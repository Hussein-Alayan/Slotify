import httpx
import os

GEMINI_STREAM_URL = "https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:streamGenerateContent"
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") or os.getenv("TTS_KEY")

async def stream_gemini_response(static_context: dict, dynamic_context: dict):
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
	payload = {"contents": contents}
	url = f"{GEMINI_STREAM_URL}?key={GEMINI_API_KEY}"
	async with httpx.AsyncClient(timeout=None) as client:
		async with client.stream('POST', url, json=payload, headers={"Content-Type": "application/json"}) as response:
			async for chunk in response.aiter_text():
				yield chunk
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

	# Build conversation history for Gemini
	history = dynamic_context.get("history", [])
	contents = []
	# Add system instruction as first part
	contents.append({"role": "system", "parts": [{"text": system_instruction}]})
	# Add all prior exchanges
	for msg in history:
		if msg["role"] == "user":
			contents.append({"role": "user", "parts": [{"text": msg["content"]}]})
		elif msg["role"] == "assistant":
			contents.append({"role": "assistant", "parts": [{"text": msg["content"]}]})

	payload = {
		"contents": contents
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
