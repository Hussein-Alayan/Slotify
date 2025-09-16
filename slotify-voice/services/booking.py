import requests

LARAVEL_API = "http://localhost:8000/api/v1/voice"

def forward_transcript(call_id, transcript):
	requests.post(
		f"{LARAVEL_API}/{call_id}/transcript",
		json={"transcript": transcript}
	)

def end_call_api(call_id):
	requests.post(f"{LARAVEL_API}/{call_id}/end")
