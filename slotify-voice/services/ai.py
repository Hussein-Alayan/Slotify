
import httpx

GEMINI_API_URL = "https://api.gemini.example.com/v1/ai"
GEMINI_API_KEY = "your-gemini-api-key"  # Replace with your actual key

async def get_ai_response(session_id: str, transcript: str, static_context: dict, dynamic_context: dict) -> dict:
	payload = {
		"session_id": session_id,
		"user_transcript": transcript,
		"static_context": static_context,
		"dynamic_context": dynamic_context
	}
	headers = {
		"Authorization": f"Bearer {GEMINI_API_KEY}",
		"Content-Type": "application/json"
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
