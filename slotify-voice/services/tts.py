from google.cloud import texttospeech

def synthesize_speech(text: str, sample_rate: int = 16000, language_code: str = "en-US") -> bytes:
    client = texttospeech.TextToSpeechClient()
    # Detect if input is SSML (starts with <speak>)
    if text.strip().startswith('<speak>'):
        input_text = texttospeech.SynthesisInput(ssml=text)
    else:
        input_text = texttospeech.SynthesisInput(text=text)

    voice = texttospeech.VoiceSelectionParams(
        language_code=language_code,
        name="en-US-Wavenet-D",  # Use WaveNet for naturalness
        ssml_gender=texttospeech.SsmlVoiceGender.MALE
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.LINEAR16,
        sample_rate_hertz=sample_rate,
        speaking_rate=1.0,  # 0.75-1.25 is natural
        pitch=0.0,          # -5.0 to 5.0, 0 is default
        volume_gain_db=0.0  # -96.0 to 16.0, 0 is default
    )
    response = client.synthesize_speech(
        input=input_text,
        voice=voice,
        audio_config=audio_config
    )
    return response.audio_content
