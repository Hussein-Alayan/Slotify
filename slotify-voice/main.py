from services.booking import forward_transcript, end_call_api
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import threading
from queue import Queue

from services.stt import STTSession
from services.tts import synthesize_speech
import asyncio
from services.ai import get_ai_response



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LARAVEL_API = "http://localhost:8000/api/v1/voice"



from services.context import (
    fetch_static_context,
    cache_static_context,
    get_static_context,
    init_dynamic_context,
    get_dynamic_context,
    update_dynamic_context
)



# -----------------------
# Request Models
# -----------------------
from models.schemas import StartCallRequest


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

        # Initialize dynamic context for this session
        init_dynamic_context(call_id)

        return {"call_id": call_id, "reply": "Hi, thanks for calling Slotify!"}
    except Exception as e:
        return {"error": str(e), "response": getattr(e, "response", None)}


@app.post("/incoming/media/{call_id}")
def receive_audio(call_id: int):
    # Fake fallback transcript
    fake_transcript = "I want a haircut tomorrow at 5pm"
    forward_transcript(call_id, fake_transcript)
    return {"success": True, "transcript": fake_transcript}


@app.post("/incoming/end/{call_id}")
def end_call(call_id: int):
    end_call_api(call_id)
    return {"success": True}


# -----------------------
# WebSocket Endpoint
# -----------------------
@app.websocket("/ws/call/{session_id}")
async def websocket_call(websocket: WebSocket, session_id: str):
    await websocket.accept()

    stt_session = STTSession()
    stt_session.start()

    try:
        while True:
            # Receive PCM chunks from browser

            chunk = await websocket.receive_bytes()
            stt_session.chunk_queue.put(chunk)

            # Send transcripts back to client
            while not stt_session.transcript_queue.empty():
                transcript, is_final = stt_session.transcript_queue.get()
                await websocket.send_text(transcript)

                if is_final:  # forward only final transcript to Laravel
                    forward_transcript(session_id, transcript)

                    # --- Gemini AI integration ---
                    static_context = get_static_context(session_id) or {}
                    dynamic_context = get_dynamic_context(session_id) or {}
                    # Call Gemini API for AI response
                    ai_result = asyncio.run(get_ai_response(
                        session_id,
                        transcript,
                        static_context,
                        dynamic_context
                    ))
                    # Update dynamic context with AI response
                    if ai_result:
                        update_dynamic_context(session_id, "last_ai_response", ai_result.get("response_text"))
                        # Optionally update bookings, user_messages, etc.
                        # Send AI response to frontend
                        ai_text = ai_result.get('response_text')
                        await websocket.send_text(f"AI: {ai_text}")

                        # --- TTS: synthesize and stream audio ---
                        if ai_text:
                            tts_audio = synthesize_speech(ai_text)
                            # Stream audio bytes to frontend (as binary frame)
                            await websocket.send_bytes(tts_audio)
    except WebSocketDisconnect:
        stt_session.stop()

        # Flush any remaining transcripts
        while not stt_session.transcript_queue.empty():
            transcript, is_final = stt_session.transcript_queue.get()
            await websocket.send_text(transcript)
            if is_final:
                forward_transcript(session_id, transcript)
