from google.cloud import texttospeech

def synthesize_speech(text: str, sample_rate: int = 16000, language_code: str = "en-US") -> bytes:
    client = texttospeech.TextToSpeechClient()
    input_text = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code=language_code,
        ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
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
    return response.audio_content
