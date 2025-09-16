from fastapi import FastAPI
from pydantic import BaseModel
import requests

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
