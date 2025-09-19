def get_service_mapping(business_id):
	resp = requests.get(f"{LARAVEL_API}/businesses/{business_id}/services")
	if resp.status_code == 200:
		# Return mapping: {service_name: service_id}
		return {s['name']: s['id'] for s in resp.json()}
	return {}

import requests

LARAVEL_API = "http://localhost:8000/api/v1"

def forward_transcript(call_id, transcript):
	requests.post(
		f"http://localhost:8000/api/v1/voice/{call_id}/transcript",
		json={"transcript": transcript}
	)

def end_call_api(call_id):
	requests.post(f"http://localhost:8000/api/v1/voice/{call_id}/end")

def create_booking(business_id, date, time, service_id, client_info=None):
	payload = {
		"service_id": service_id,
		"date": date,
		"time": time
	}
	if client_info:
		payload.update(client_info)
	resp = requests.post(
		f"{LARAVEL_API}/businesses/{business_id}/bookings",
		json=payload
	)
	return resp.json()

def check_availability(business_id, date=None, service_id=None):
	params = {}
	if date:
		params["date"] = date
	if service_id:
		params["service_id"] = service_id
	resp = requests.get(
		f"{LARAVEL_API}/businesses/{business_id}/availability",
		params=params
	)
	return resp.json()
