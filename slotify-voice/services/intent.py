import aiohttp

# Gemini LLM intent detection and entity extraction
async def detect_intent_llm(transcript):
	prompt = (
		f"Classify the intent of this message: '{transcript}'. "
		"Return one of: booking, availability, cancel, reschedule, pricing, staff_info, business_info, unknown. "
		"Also extract entities: date, time, service, staff, booking_id. Respond in JSON."
	)
	GEMINI_API_URL = "GEMINI_API_URL"
	GEMINI_API_KEY = "GEMINI_API_KEY"
	headers = {"Authorization": f"Bearer {GEMINI_API_KEY}", "Content-Type": "application/json"}
	payload = {"prompt": prompt}
	async with aiohttp.ClientSession() as session:
		async with session.post(GEMINI_API_URL, json=payload, headers=headers) as resp:
			resp.raise_for_status()
			result = await resp.json()
			# Expect result to be a dict with 'intent' and 'entities'
			return result
