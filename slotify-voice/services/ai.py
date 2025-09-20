import os
import httpx
from google.oauth2 import service_account
import google.auth.transport.requests

SERVICE_ACCOUNT_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "config",
    "google-stt-key.json"
)

PROJECT_ID = "n8n-integration-469209"
LOCATION = "us-central1"  # Change if your model is deployed elsewhere
MODEL_ID = "gemini-2.5-flash-lite"  # Updated model name

SCOPES = ["https://www.googleapis.com/auth/cloud-platform"]


def get_access_token():
    try:
        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_PATH,
            scopes=SCOPES
        )
        request = google.auth.transport.requests.Request()
        credentials.refresh(request)
        print(f"Successfully obtained access token for: {credentials.service_account_email}")
        return credentials.token
    except Exception as e:
        print(f"Error getting access token: {e}")
        raise


async def stream_gemini_response(static_context: dict, dynamic_context: dict, session_id: str | None = None):
    endpoint = (
        f"https://{LOCATION}-aiplatform.googleapis.com/v1/projects/"
        f"{PROJECT_ID}/locations/{LOCATION}/publishers/google/models/{MODEL_ID}:streamGenerateContent"
    )
    
    try:
        access_token = get_access_token()
        print(f"Using endpoint: {endpoint}")
    except Exception as e:
        print(f"Failed to get access token: {e}")
        yield f"Authentication error: {str(e)}"
        return

    business_name = static_context.get("name", "this business")
    system_instruction = (
        f"You are an AI assistant handling a real-time phone call for {business_name}. "
        "Your job is to help callers book appointments, answer questions about services, staff, and hours, "
        "and provide helpful information using the provided business context and current bookings. "
        "Keep responses concise, natural, and conversational—never more than 1-2 sentences unless asked for detail. "
        "Do not invent information or bookings; only use what is provided. "
        "If you are unsure, ask the caller for clarification or offer to connect them to a human. "
        "IMPORTANT: If there's a recent booking result in the context, respond based on that result. "
        "For successful bookings, confirm with details (service, date, time, booking ID). "
        "For failed bookings, explain the issue and offer alternatives."
    )

    history = dynamic_context.get("history", [])
    booking_result = dynamic_context.get("last_booking_result")

    # Always start with system instruction
    contents = [{"role": "user", "parts": [{"text": system_instruction}]}]

    # Include booking result if available
    if booking_result:
        if "error" in booking_result:
            booking_context = f"BOOKING FAILED: {booking_result['error']}. Please help the customer understand what went wrong and offer alternatives."
        else:
            booking_context = f"BOOKING SUCCESSFUL: {booking_result}. Please confirm the booking details to the customer including the booking ID and appointment details."
        
        contents.append({
            "role": "user", 
            "parts": [{"text": booking_context}]
        })
        
        # Clear booking result after using it to prevent stale data
        if session_id:
            from services.context import update_dynamic_context
            update_dynamic_context(session_id, "last_booking_result", None)

    # Append conversation history
    for msg in history:
        contents.append({
            "role": msg["role"],
            "parts": [{"text": msg["content"]}]
        })

    payload = {"contents": contents}

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    async with httpx.AsyncClient(timeout=None) as client:
        try:
            async with client.stream("POST", endpoint, json=payload, headers=headers) as response:
                print(f"Response status: {response.status_code}")
                if response.status_code != 200:
                    error_text = await response.aread()
                    print(f"API Error ({response.status_code}): {error_text.decode()}")
                    yield f"API Error: {error_text.decode()}"
                    return
                    
                async for chunk in response.aiter_text():
                    yield chunk
        except Exception as e:
            print(f"HTTP request error: {e}")
            yield f"Request error: {str(e)}"


# Example response structure:
# {
#   "response_text": "Hi, your haircut is booked at 10am with Sam.",
#   "intent": "book_appointment",
#   "booking": { ... },
#   "suggestions": [ ... ]
# }
