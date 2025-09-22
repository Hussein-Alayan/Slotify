import requests

LARAVEL_API = "http://localhost:8000/api/v1/voice"

# In-memory cache for static business context
static_context_cache = {}

# In-memory cache for dynamic context per session/call ID
dynamic_context_cache = {}

def fetch_static_context(business_id):
	try:
		resp = requests.get(f"{LARAVEL_API}/business-context/{business_id}")
		resp.raise_for_status()
		data = resp.json()["data"]
		# Return full business data including business_id and workflow
		context = data.get("workflow", {})
		context["business_id"] = business_id  # Ensure business_id is included
		context["id"] = business_id  # Also add as 'id' for compatibility
		return context
	except Exception as e:
		print(f"[ERROR] Failed to fetch static context for business {business_id}: {e}")
		return None

def cache_static_context(session_id, context):
	static_context_cache[session_id] = context

def get_static_context(session_id):
	return static_context_cache.get(session_id)

def init_dynamic_context(session_id):
		# Fetch current bookings from Laravel
		try:
			# You need to know the business_id for this session
			business_id = session_id.split('-')[0] if '-' in session_id else session_id
			resp = requests.get(f"http://localhost:8000/api/v1/businesses/{business_id}/bookings")
			resp.raise_for_status()
			bookings = resp.json().get("data", [])
		except Exception:
			bookings = []
		dynamic_context_cache[session_id] = {
			"last_ai_response": None,
			"current_bookings": bookings,
			"user_messages": []
		}

def get_dynamic_context(session_id):
	return dynamic_context_cache.get(session_id)

def update_dynamic_context(session_id, key, value):
	ctx = dynamic_context_cache.get(session_id)
	if ctx is not None:
		ctx[key] = value
