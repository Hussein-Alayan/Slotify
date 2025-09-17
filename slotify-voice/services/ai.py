import os
import httpx
from google.oauth2 import service_account
import google.auth.transport.requests

SERVICE_ACCOUNT_PATH = os.path.join(
	os.path.dirname(__file__),
	"..",
	"venv",
	"config",
	"n8n-integration-469209-a90c52dd16a5.json"
)

PROJECT_ID = "n8n-integration-469209"
LOCATION = "us-central1"  # Change if your model is deployed elsewhere
MODEL_ID = "publishers/google/models/gemini-2.5-flash-lite"


SCOPES = ["https://www.googleapis.com/auth/cloud-platform"]

def get_access_token():
	credentials = service_account.Credentials.from_service_account_file(
		SERVICE_ACCOUNT_PATH,
		scopes=SCOPES
	)
	request = google.auth.transport.requests.Request()
	credentials.refresh(request)
	return credentials.token

async def stream_gemini_response(static_context: dict, dynamic_context: dict):
	endpoint = f"https://{LOCATION}-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/gemini-2.5-flash-lite:streamGenerateContent"
	access_token = get_access_token()
	business_name = static_context.get("name", "this business")
	system_instruction = {
		"role": "system",
		"parts": [{"text": f"You are an AI assistant handling a real-time phone call for {business_name}. Your job is to help callers book appointments, answer questions about services, staff, and hours, and provide helpful information using the provided business context and current bookings. Keep responses concise, natural, and conversational—never more than 1-2 sentences unless asked for detail. Do not invent information or bookings; only use what is provided. If you are unsure, ask the caller for clarification or offer to connect them to a human."}]
	}
	history = dynamic_context.get("history", [])
	contents = []
	for msg in history:
		if msg["role"] == "user":
			contents.append({"role": "user", "parts": [{"text": msg["content"]}]})
		elif msg["role"] == "assistant":
			contents.append({"role": "model", "parts": [{"text": msg["content"]}]})
	payload = {
		"contents": contents,
		"systemInstruction": system_instruction
	}
	headers = {
		"Authorization": f"Bearer {access_token}",
		"Content-Type": "application/json",
		"Accept": "application/json"
	}
	async with httpx.AsyncClient(timeout=None) as client:
		async with client.stream('POST', endpoint, json=payload, headers=headers) as response:
			async for chunk in response.aiter_text():
				yield chunk

async def get_ai_response(session_id: str, transcript: str, static_context: dict, dynamic_context: dict) -> dict:
	endpoint = f"https://{LOCATION}-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/gemini-2.5-flash-lite:generateContent"
	access_token = get_access_token()
	business_name = static_context.get("name", "this business")
	system_instruction = (
		f"You are an AI assistant handling a real-time phone call for {business_name}. "
		"Your job is to help callers book appointments, answer questions about services, staff, and hours, and provide helpful information using the provided business context and current bookings. "
		"Keep responses concise, natural, and conversational—never more than 1-2 sentences unless asked for detail. "
		"Do not invent information or bookings; only use what is provided. "
		"If you are unsure, ask the caller for clarification or offer to connect them to a human."
	)
	history = dynamic_context.get("history", [])
	contents = []
	contents.append({"role": "system", "parts": [{"text": system_instruction}]})
	for msg in history:
		if msg["role"] == "user":
			contents.append({"role": "user", "parts": [{"text": msg["content"]}]})
		elif msg["role"] == "assistant":
			contents.append({"role": "assistant", "parts": [{"text": msg["content"]}]})
	payload = {
		"contents": contents
	}
	headers = {
		"Authorization": f"Bearer {access_token}",
		"Content-Type": "application/json",
		"Accept": "application/json"
	}
	try:
		async with httpx.AsyncClient() as client:
			resp = await client.post(endpoint, json=payload, headers=headers, timeout=30.0)
			resp.raise_for_status()
			return resp.json()
	except httpx.ReadTimeout:
		return {
			"error": "Gemini API timed out. Please try again later or check API status."
		}
	except Exception as e:
		return {
			"error": f"Gemini API error: {str(e)}"
		}

# Example response structure:
# {
#   "response_text": "Hi, your haircut is booked at 10am with Sam.",
#   "intent": "book_appointment",
#   "booking": { ... },
#   "suggestions": [ ... ]
# }
