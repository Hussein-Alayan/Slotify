
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Body, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import requests
import threading
from queue import Queue
import asyncio

from pydantic import BaseModel
from services.stt import STTSession
from services.tts import synthesize_speech
from services.ai import stream_gemini_response
from services.booking import forward_transcript, end_call_api
from services.context import (
    fetch_static_context,
    cache_static_context,
    get_static_context,
    init_dynamic_context,
    get_dynamic_context,
    update_dynamic_context
)
from models.schemas import StartCallRequest

LARAVEL_API = "http://localhost:8000/api/v1/voice"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/incoming/start")
def start_call(data: StartCallRequest):
    try:
        resp = requests.post(
            f"{LARAVEL_API}/log",
            json={
                "caller_phone": data.caller_phone,
                "business_id": data.business_id,
                "client_id": data.client_id,
            },
        )
        resp.raise_for_status()
        call_id = str(resp.json()["data"]["call_id"])

        # Fetch and cache static business context
        static_context = fetch_static_context(data.business_id)
        if static_context:
            cache_static_context(call_id, static_context)

        # Initialize dynamic context
        init_dynamic_context(call_id)
        # Initialize conversation history for this session
        update_dynamic_context(call_id, "history", [])

        return {"call_id": call_id, "reply": "Hi, thanks for calling Slotify!"}
    except Exception as e:
        return {"error": str(e), "response": getattr(e, "response", None)}

@app.post("/incoming/media/{call_id}")
def receive_audio(call_id: str):
    fake_transcript = "I want a haircut tomorrow at 5pm"
    forward_transcript(call_id, fake_transcript)
    return {"success": True, "transcript": fake_transcript}

@app.post("/incoming/end/{call_id}")
def end_call(call_id: str):
    end_call_api(call_id)
    # Clear all session-specific keys in dynamic_context for this call/session
    for key in ["history", "last_ai_response", "user_messages"]:
        update_dynamic_context(call_id, key, None)
    return {"success": True}

# -----------------------
# WebSocket Endpoint
# -----------------------
@app.websocket("/ws/call/{session_id}")
async def websocket_call(websocket: WebSocket, session_id: str):
    await websocket.accept()
    stt_session = STTSession()
    stt_session.start()
    greeting_sent = False

    async def handle_ai_and_tts(session_id, static_context):
        try:
            dynamic_context = get_dynamic_context(session_id) or {}
            print(f"AI called for user message: {dynamic_context.get('last_user_message')}")
            ai_buffer = ""
            
            import json
            import re
            async for chunk in stream_gemini_response(static_context, dynamic_context):
                print(f"Chunk: {repr(chunk[:100])}")
                if not chunk or not chunk.strip():
                    continue
                
                # Use regex to extract any substantial quoted text (likely AI responses)
                text_pattern = r'"([^"]{15,})"'  # Find quoted strings longer than 15 chars
                matches = re.findall(text_pattern, chunk)
                
                for match in matches:
                    # Skip common JSON field names, metadata, and technical strings
                    skip_terms = [
                        'candidates', 'content', 'parts', 'role', 'model', 'text', 'finish_reason', 
                        'usage_metadata', 'traffic_type', 'model_version', 'create_time', 'response_id',
                        'prompt_token_count', 'candidates_token_count', 'total_token_count',
                        'gemini-2.5-flash-lite', 'trafficType', 'modelVersion', 'createTime', 
                        'responseId', 'promptTokenCount', 'candidatesTokenCount', 'totalTokenCount',
                        'promptTokensDetails'
                    ]
                    
                    # Skip if it's metadata/JSON structure
                    if any(term.lower() in match.lower() for term in skip_terms):
                        continue
                    
                    # Skip if it contains mostly JSON syntax
                    if match.count('{') > 2 or match.count('[') > 2 or match.count(':') > 3:
                        continue
                    
                    # Skip timestamps and IDs
                    if re.match(r'.*\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*', match):
                        continue
                    
                    # Only keep text that looks like natural conversation
                    if any(word in match.lower() for word in ['help', 'can', 'you', 'with', 'today', 'appointment', 'service', 'question', 'booking', 'available', 'slot', 'day', 'time', 'yes', 'no', 'what', 'when', 'how', 'come in', 'schedule']):
                        print(f"Extracted text: {repr(match)}")
                        ai_buffer += match + " "  # Add space between fragments
            
            # Send the complete accumulated response to TTS
            if ai_buffer.strip():
                tts_text = ai_buffer.strip()
                print(f"Sending complete response to TTS: {repr(tts_text)}")
                tts_audio = synthesize_speech(tts_text)
                await websocket.send_bytes(tts_audio)
                await websocket.send_text(ai_buffer)
                
                # Save to history
                history = dynamic_context.get("history", [])
                history.append({"role": "assistant", "content": ai_buffer})
                update_dynamic_context(session_id, "history", history)
                    
            print("AI finished responding")
        except Exception as e:
            print(f"AI task error: {e}")

    try:
        while True:
            chunk = await websocket.receive_bytes()
            stt_session.chunk_queue.put(chunk)

            static_context = get_static_context(session_id) or {}
            dynamic_context = get_dynamic_context(session_id) or {}

            # Send greeting once
            if not greeting_sent:
                business_name = static_context.get("name", "this business")
                greeting_text = f"Welcome to {business_name}, how can I help you?"
                tts_audio = synthesize_speech(greeting_text)
                await websocket.send_bytes(tts_audio)
                greeting_sent = True

            while not stt_session.transcript_queue.empty():
                transcript, is_final = stt_session.transcript_queue.get()
                transcript_clean = transcript.strip()
                if not transcript_clean or len(transcript_clean) < 2:
                    continue
                await websocket.send_text(transcript_clean)

                if is_final:
                    forward_transcript(session_id, transcript_clean)
                    history = dynamic_context.get("history", [])
                    history.append({"role": "user", "content": transcript_clean})
                    update_dynamic_context(session_id, "history", history)
                    update_dynamic_context(session_id, "last_user_message", transcript_clean)

                    # Spawn AI + TTS
                    asyncio.create_task(handle_ai_and_tts(session_id, static_context))
    except WebSocketDisconnect:
        stt_session.stop()
        while not stt_session.transcript_queue.empty():
            transcript, is_final = stt_session.transcript_queue.get()
            await websocket.send_text(transcript)
            if is_final:
                forward_transcript(session_id, transcript)
