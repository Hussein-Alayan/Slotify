from fastapi import FastAPI
from pydantic import BaseModel
import requests
from fastapi import WebSocket, WebSocketDisconnect
from speech_service import GoogleSpeechStreamer

app = FastAPI()

LARAVEL_API = "http://localhost:8000/api/v1/voice"

# -----------------------
# Request Models
# -----------------------
class StartCallRequest(BaseModel):
    caller_phone: str
    business_id: int = None
    client_id: int = None

class ReceiveAudioRequest(BaseModel):
    # In real STT, you might send a file URL or base64 audio
    # For now we fake the transcript
    pass


# Remove MediaRequest and EndCallRequest models


# Only keep the correct path-parameter endpoints

@app.post("/incoming/start")
def start_call(data: StartCallRequest):
    try:
        resp = requests.post(f"{LARAVEL_API}/log", json={
            "caller_phone": data.caller_phone,
            "business_id": data.business_id,
            "client_id": data.client_id
        })
        resp.raise_for_status()
        call_id = resp.json()["data"]["call_id"]
        return {"call_id": call_id, "reply": "Hi, thanks for calling Slotify!"}
    except Exception as e:
        return {"error": str(e), "response": getattr(e, 'response', None)}

@app.post("/incoming/media/{call_id}")
def receive_audio(call_id: int):
    fake_transcript = "I want a haircut tomorrow at 5pm"
    requests.post(f"{LARAVEL_API}/{call_id}/transcript", json={"transcript": fake_transcript})
    return {"success": True, "transcript": fake_transcript}

@app.post("/incoming/end/{call_id}")
def end_call(call_id: int):
    requests.post(f"{LARAVEL_API}/{call_id}/end")
    return {"success": True}

    # WebSocket endpoint for real-time PCM chunk streaming

import asyncio
import threading
from queue import Queue

@app.websocket("/ws/call/{session_id}")
async def websocket_call(websocket: WebSocket, session_id: str):
    await websocket.accept()
    stt_streamer = GoogleSpeechStreamer()
    chunk_queue = Queue()
    transcript_queue = Queue()
    stop_event = threading.Event()

    def stt_worker():
        try:
            def chunk_iter():
                while not stop_event.is_set():
                    chunk = chunk_queue.get()
                    if chunk is None:
                        break
                    yield chunk
            for transcript in stt_streamer.stream_transcribe(chunk_iter()):
                transcript_queue.put(transcript)
        except Exception as e:
            transcript_queue.put(f"[STT error] {str(e)}")

    stt_thread = threading.Thread(target=stt_worker)
    stt_thread.start()

    try:
        while True:
            chunk = await websocket.receive_bytes()
            chunk_queue.put(chunk)
            # Send any transcripts from the queue
            while not transcript_queue.empty():
                transcript = transcript_queue.get()
                await websocket.send_text(transcript)
    except WebSocketDisconnect:
        stop_event.set()
        chunk_queue.put(None)  # Signal end to worker
        stt_thread.join()
        # Flush remaining transcripts
        while not transcript_queue.empty():
            transcript = transcript_queue.get()
            await websocket.send_text(transcript)
