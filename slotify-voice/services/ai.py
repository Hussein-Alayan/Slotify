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


async def stream_gemini_response(static_context: dict, dynamic_context: dict):
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
        "If you are unsure, ask the caller for clarification or offer to connect them to a human."
    )

    history = dynamic_context.get("history", [])

    # Always start with system instruction
    contents = [{"role": "user", "parts": [{"text": system_instruction}]}]

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
