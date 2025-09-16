from google.cloud import speech

class GoogleSpeechStreamer:
    def __init__(self, sample_rate=16000, language_code="en-US"):
        self.client = speech.SpeechClient()
        self.config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=sample_rate,
            language_code=language_code,
        )

    def stream_transcribe(self, pcm_chunk_iterable):
        """
        Accepts an iterable of PCM audio chunks and yields partial transcripts.
        """
        requests = (speech.StreamingRecognizeRequest(audio_content=chunk) for chunk in pcm_chunk_iterable)
        streaming_config = speech.StreamingRecognitionConfig(config=self.config, interim_results=True)
        responses = self.client.streaming_recognize(streaming_config, requests)
        for response in responses:
            for result in response.results:
                if result.is_final or result.alternatives:
                    yield result.alternatives[0].transcript
