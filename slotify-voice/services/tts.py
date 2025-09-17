import os
import requests

GOOGLE_TTS_API_URL = "https://texttospeech.googleapis.com/v1beta1/text:synthesize"
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

def synthesize_speech(text: str, sample_rate: int = 16000, language_code: str = "en-US") -> bytes:
    if not GOOGLE_API_KEY:
        raise RuntimeError("Google API key not set in environment variable GOOGLE_API_KEY")

    payload = {
        "input": {"text": text},
        "voice": {
            "languageCode": language_code,
            "name": "en-US-Chirp3-HD-Achernar"
        },
        "audioConfig": {
            "audioEncoding": "LINEAR16",
            "pitch": 0,
            "speakingRate": 1,
            "sampleRateHertz": sample_rate
        }
    }
    url = f"{GOOGLE_TTS_API_URL}?key={GOOGLE_API_KEY}"
    response = requests.post(url, json=payload)
    response.raise_for_status()
    audio_content = response.json().get("audioContent")
    if not audio_content:
        raise RuntimeError("No audioContent in TTS response")
    import base64
    return base64.b64decode(audio_content)
