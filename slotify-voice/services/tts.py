
import os
from google.cloud import texttospeech

SERVICE_ACCOUNT_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "config",
    "google-stt-key.json"
)

def synthesize_speech(text: str, sample_rate: int = 16000, language_code: str = "en-US") -> bytes:
    client = texttospeech.TextToSpeechClient.from_service_account_file(SERVICE_ACCOUNT_PATH)
    input_text = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code=language_code,
        name="en-US-Chirp3-HD-Achernar"
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.LINEAR16,
        sample_rate_hertz=sample_rate
    )
    response = client.synthesize_speech(
        input=input_text,
        voice=voice,
        audio_config=audio_config
    )
    if not response.audio_content:
        raise RuntimeError("No audioContent in TTS response")
    return response.audio_content
