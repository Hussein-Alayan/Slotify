
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
from services.ai import get_ai_response
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

# -----------------------
# Test Gemini Endpoint
# -----------------------
@app.post("/test/gemini")
async def test_gemini_endpoint(text: str = Body(..., embed=True)):
    result = await get_ai_response(
        session_id="test-session",
        transcript=text,
        static_context={},
        dynamic_context={}
    )
    print(f"Gemini raw response: {result}")
    return result

# -----------------------
# REST Endpoints
# -----------------------
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
        call_id = resp.json()["data"]["call_id"]

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
def receive_audio(call_id: int):
    fake_transcript = "I want a haircut tomorrow at 5pm"
    forward_transcript(call_id, fake_transcript)
    return {"success": True, "transcript": fake_transcript}

@app.post("/incoming/end/{call_id}")
def end_call(call_id: int):
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
    async def handle_ai_and_tts(transcript, session_id, static_context):
        # Refresh dynamic_context to include the latest user message
        dynamic_context = get_dynamic_context(session_id) or {}
        ai_result = await get_ai_response(
            session_id,
            transcript,
            static_context,
            dynamic_context
        )
        def extract_gemini_text(ai_result):
            try:
                return ai_result['candidates'][0]['content']['parts'][0]['text']
            except (KeyError, IndexError, TypeError):
                return None
        if ai_result:
            ai_text = extract_gemini_text(ai_result)
            update_dynamic_context(session_id, "last_ai_response", ai_text)
            # Append AI response to conversation history
            dynamic_context = get_dynamic_context(session_id) or {}
            history = dynamic_context.get("history", [])
            history.append({"role": "assistant", "content": ai_text})
            update_dynamic_context(session_id, "history", history)
            await websocket.send_text(f"AI: {ai_text}")
            if ai_text:
                tts_audio = synthesize_speech(ai_text)
                await websocket.send_bytes(tts_audio)

    try:
        while True:
            chunk = await websocket.receive_bytes()
            stt_session.chunk_queue.put(chunk)

            static_context = get_static_context(session_id) or {}
            dynamic_context = get_dynamic_context(session_id) or {}

            # Send greeting via TTS only once at the start of the call
            if not greeting_sent:
                business_name = static_context.get("name", "this business")
                greeting_text = f"Welcome to {business_name}, how can I help you?"
                tts_audio = synthesize_speech(greeting_text)
                await websocket.send_bytes(tts_audio)
                greeting_sent = True

            while not stt_session.transcript_queue.empty():
                transcript, is_final = stt_session.transcript_queue.get()
                transcript_clean = transcript.strip()
                # Skip empty or noisy short transcripts
                if not transcript_clean or len(transcript_clean) < 2:
                    continue
                await websocket.send_text(transcript_clean)

                if is_final:
                    forward_transcript(session_id, transcript_clean)

                    # Track full conversation history
                    history = dynamic_context.get("history", [])
                    # Append user message
                    history.append({"role": "user", "content": transcript_clean})
                    update_dynamic_context(session_id, "history", history)

                    # Offload AI and TTS to background task
                    asyncio.create_task(handle_ai_and_tts(transcript_clean, session_id, static_context))
    except WebSocketDisconnect:
        stt_session.stop()
        while not stt_session.transcript_queue.empty():
            transcript, is_final = stt_session.transcript_queue.get()
            await websocket.send_text(transcript)
            if is_final:
                forward_transcript(session_id, transcript)
