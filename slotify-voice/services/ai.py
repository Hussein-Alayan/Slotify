import httpx
import os

GEMINI_API_URL = os.getenv("GEMINI_API_URL") or ""
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or ""

if not GEMINI_API_URL or not GEMINI_API_KEY:
	raise RuntimeError("Gemini API credentials are not set. Check your .env file.")

async def get_ai_response(session_id: str, transcript: str, static_context: dict, dynamic_context: dict) -> dict:
	business_name = static_context.get("name", "this business")
	system_instruction = (
		f"You are an AI assistant handling a real-time phone call for {business_name}. "
		"Your job is to help callers book appointments, answer questions about services, staff, and hours, and provide helpful information using the provided business context and current bookings. "
		"Keep responses concise, natural, and conversational—never more than 1-2 sentences unless asked for detail. "
		"Do not invent information or bookings; only use what is provided. "
		"If you are unsure, ask the caller for clarification or offer to connect them to a human."
	)
	payload = {
		"contents": [
			{
				"parts": [
					{"text": system_instruction},
					{"text": transcript}
				]
			}
		]
	}
	headers = {
		"Content-Type": "application/json",
		"X-goog-api-key": GEMINI_API_KEY
	}
	try:
		async with httpx.AsyncClient() as client:
			resp = await client.post(GEMINI_API_URL, json=payload, headers=headers, timeout=30.0)
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
