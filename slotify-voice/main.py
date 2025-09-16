from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import threading
from queue import Queue
from speech_service import GoogleSpeechStreamer



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LARAVEL_API = "http://localhost:8000/api/v1/voice"


# In-memory cache for static business context
static_context_cache = {}

# In-memory cache for dynamic context per session/call ID
dynamic_context_cache = {}

def fetch_static_context(business_id):
    try:
        resp = requests.get(f"{LARAVEL_API}/business-context/{business_id}")
        resp.raise_for_status()
        return resp.json()["data"]
    except Exception as e:
        return None

def cache_static_context(session_id, context):
    static_context_cache[session_id] = context

def get_static_context(session_id):
    return static_context_cache.get(session_id)

def init_dynamic_context(session_id):
    dynamic_context_cache[session_id] = {
        "last_ai_response": None,
        "current_bookings": [],
        "user_messages": []
    }

def get_dynamic_context(session_id):
    return dynamic_context_cache.get(session_id)

def update_dynamic_context(session_id, key, value):
    ctx = dynamic_context_cache.get(session_id)
    if ctx is not None:
        ctx[key] = value


# -----------------------
# Request Models
# -----------------------
from typing import Optional

class StartCallRequest(BaseModel):
    caller_phone: str
    business_id: Optional[int] = None
    client_id: Optional[int] = None


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
    requests.post(
        f"{LARAVEL_API}/{call_id}/transcript", json={"transcript": fake_transcript}
    )
    return {"success": True, "transcript": fake_transcript}


@app.post("/incoming/end/{call_id}")
def end_call(call_id: int):
    requests.post(f"{LARAVEL_API}/{call_id}/end")
    return {"success": True}


# -----------------------
# WebSocket Endpoint
# -----------------------
@app.websocket("/ws/call/{session_id}")
async def websocket_call(websocket: WebSocket, session_id: str):
    await websocket.accept()
    stt_streamer = GoogleSpeechStreamer()
    chunk_queue = Queue()
    transcript_queue = Queue()
    stop_event = threading.Event()

    # Worker thread: run Google STT
    def stt_worker():
        try:
            def chunk_iter():
                while not stop_event.is_set():
                    chunk = chunk_queue.get()
                    if chunk is None:
                        break
                    yield chunk

            for transcript, is_final in stt_streamer.stream_transcribe(chunk_iter()):
                transcript_queue.put((transcript, is_final))
        except Exception as e:
            transcript_queue.put((f"[STT error] {str(e)}", True))

    stt_thread = threading.Thread(target=stt_worker)
    stt_thread.start()

    try:
        while True:
            # Receive PCM chunks from browser
            chunk = await websocket.receive_bytes()
            chunk_queue.put(chunk)

            # Send transcripts back to client
            while not transcript_queue.empty():
                transcript, is_final = transcript_queue.get()
                await websocket.send_text(transcript)

                if is_final:  # ✅ forward only final transcript to Laravel
                    requests.post(
                        f"{LARAVEL_API}/{session_id}/transcript",
                        json={"transcript": transcript},
                    )
    except WebSocketDisconnect:
        stop_event.set()
        chunk_queue.put(None)
        stt_thread.join()

        # Flush any remaining transcripts
        while not transcript_queue.empty():
            transcript, is_final = transcript_queue.get()
            await websocket.send_text(transcript)
            if is_final:
                requests.post(
                    f"{LARAVEL_API}/{session_id}/transcript",
                    json={"transcript": transcript},
                )
