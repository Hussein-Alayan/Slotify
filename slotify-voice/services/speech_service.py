from google.cloud import speech
import os

class GoogleSpeechStreamer:
    def __init__(self, sample_rate=16000, language_code="en-US"):
        # Try environment variable first, then fallback to service account file
        if os.environ.get('GOOGLE_APPLICATION_CREDENTIALS'):
            # Use environment variable for credentials
            self.client = speech.SpeechClient()
        else:
            # Use service account file for authentication
            service_account_path = os.path.join(
                os.path.dirname(__file__),
                "..",
                "config",
                "google-stt-key.json"
            )
            self.client = speech.SpeechClient.from_service_account_file(service_account_path)
        self.config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=sample_rate,
            language_code=language_code,
        )

    def stream_transcribe(self, pcm_chunk_iterable):
        requests = (
            speech.StreamingRecognizeRequest(audio_content=chunk)
            for chunk in pcm_chunk_iterable
        )
        streaming_config = speech.StreamingRecognitionConfig(
            config=self.config, interim_results=True
        )
        responses = self.client.streaming_recognize(streaming_config, requests)

        for response in responses:
            for result in response.results:
                if result.alternatives:
                    transcript = result.alternatives[0].transcript
                    yield transcript, result.is_final  # return both
