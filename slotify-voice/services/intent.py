

import aiohttp
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Gemini LLM intent detection and entity extraction
async def detect_intent_llm(transcript, service_mapping=None):
    service_mapping = service_mapping or {}

    def build_prompt(transcript, service_mapping):
        return (
            f"Classify the intent of this message: '{transcript}'. "
            "Return one of: booking, availability, cancel, reschedule, pricing, staff_info, business_info, unknown. "
            "Extract entities: date, time, service_id, staff, booking_id. "
            f"Here is the service mapping for this business (name → id): {json.dumps(service_mapping)}. "
            "When extracting entities, always use the numeric service_id from this mapping. "
            "If the service is not found, set service_id to null. "
            "Respond ONLY with a valid JSON object containing 'intent' and 'entities'. "
            "If you cannot extract intent/entities, reply with: {\"intent\": \"unknown\", \"entities\": {}}"
        )

    prompt = build_prompt(transcript, service_mapping)

    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
    GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash")
    GEMINI_API_URL = (
        f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    )

    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY environment variable not set.")

    headers = {"Content-Type": "application/json"}
    payload = {"contents": [{"parts": [{"text": prompt}]}]}

    async with aiohttp.ClientSession() as session:
        async with session.post(GEMINI_API_URL, json=payload, headers=headers) as resp:
            resp.raise_for_status()
            result = await resp.json()
            text = result["candidates"][0]["content"]["parts"][0]["text"]

            print(f"[DEBUG] Gemini raw response: {text}")

            # Clean markdown fences
            if text.startswith("```json"):
                text = text.replace("```json", "").replace("```", "").strip()
            elif text.startswith("```"):
                text = text.replace("```", "").strip()

            # Try parsing JSON
            try:
                parsed = json.loads(text)
            except json.JSONDecodeError as e:
                print(f"[ERROR] Failed to parse JSON: {e}")
                print(f"[ERROR] Raw text: '{text}'")
                return {"intent": "unknown", "entities": {}}

            # Validate service_id
            entities = parsed.get("entities", {})
            if entities.get("service_id") not in service_mapping.values():
                entities["service_id"] = None
            parsed["entities"] = entities

            print(f"[DEBUG] Parsed intent/entities: {parsed}")
            return parsed
