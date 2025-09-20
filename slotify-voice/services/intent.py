

import aiohttp
import os
import json
from dotenv import load_dotenv

load_dotenv()

# Gemini LLM intent detection and entity extraction
async def detect_intent_llm(transcript, service_mapping=None, conversation_history=None):
    service_mapping = service_mapping or {}
    conversation_history = conversation_history or []

    def build_prompt(transcript, service_mapping, conversation_history):
        # Build conversation context
        context = ""
        if conversation_history:
            context = "Previous conversation:\n"
            for msg in conversation_history[-5:]:  # Last 5 messages for context
                role = msg.get('role', 'unknown')
                content = msg.get('content', '')
                context += f"{role}: {content}\n"
            context += f"\nCurrent user message: '{transcript}'\n\n"
        
        return (
            f"{context}"
            f"Classify the intent of this message: '{transcript}'. "
            "Return one of: booking, availability, cancel, reschedule, pricing, staff_info, business_info, unknown. "
            "Extract entities: date, time, service_id, staff, booking_id. "
            f"Here is the service mapping for this business (name → id): {json.dumps(service_mapping)}. "
            "When extracting entities, always use the numeric service_id from this mapping. "
            "For service matching: Look for the closest semantic match between what the user said and the available service names. "
            "Consider partial matches, abbreviations, and common synonyms. "
            "Examples: 'consultation' might match 'General Consultation', 'checkup' might match 'Dental Checkup', etc. "
            "If you find a reasonable semantic match, use that service_id. If no clear match exists, set service_id to null. "
            "IMPORTANT: If the user is confirming a previously suggested booking (like 'yes', 'confirm', 'book it'), "
            "extract the date, time, and service details from the conversation history above. "
            "Respond ONLY with a valid JSON object containing 'intent' and 'entities'. "
            "If you cannot extract intent/entities, reply with: {\"intent\": \"unknown\", \"entities\": {}}"
        )

    prompt = build_prompt(transcript, service_mapping, conversation_history)

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
