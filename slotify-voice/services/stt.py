from services.speech_service import GoogleSpeechStreamer
import threading
from queue import Queue

class STTSession:
	def __init__(self):
		self.stt_streamer = GoogleSpeechStreamer()
		self.chunk_queue = Queue()
		self.transcript_queue = Queue()
		self.stop_event = threading.Event()
		self.stt_thread = threading.Thread(target=self.stt_worker)

	def start(self):
		self.stt_thread.start()

	def stop(self):
		self.stop_event.set()
		self.chunk_queue.put(None)
		self.stt_thread.join()

	def stt_worker(self):
		try:
			def chunk_iter():
				while not self.stop_event.is_set():
					chunk = self.chunk_queue.get()
					if chunk is None:
						break
					yield chunk

			for transcript, is_final in self.stt_streamer.stream_transcribe(chunk_iter()):
				self.transcript_queue.put((transcript, is_final))
		except Exception as e:
			self.transcript_queue.put((f"[STT error] {str(e)}", True))
