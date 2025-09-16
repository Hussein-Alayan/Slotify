import httpx
import os

GEMINI_API_URL = os.getenv("GEMINI_API_URL") or ""
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or ""

if not GEMINI_API_URL or not GEMINI_API_KEY:
	raise RuntimeError("Gemini API credentials are not set. Check your .env file.")

async def get_ai_response(session_id: str, transcript: str, static_context: dict, dynamic_context: dict) -> dict:
	payload = {
		"contents": [
			{
				"parts": [
					{"text": transcript}
				]
			}
		]
	}
	headers = {
		"Content-Type": "application/json",
		"X-goog-api-key": GEMINI_API_KEY
	}
	async with httpx.AsyncClient() as client:
		resp = await client.post(GEMINI_API_URL, json=payload, headers=headers)
		resp.raise_for_status()
		return resp.json()

# Example response structure:
# {
#   "response_text": "Hi, your haircut is booked at 10am with Sam.",
#   "intent": "book_appointment",
#   "booking": { ... },
#   "suggestions": [ ... ]
# }
