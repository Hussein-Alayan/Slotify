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
		return resp.json()["data"]
	except Exception as e:
		return None

def cache_static_context(session_id, context):
	static_context_cache[session_id] = context

def get_static_context(session_id):
	return static_context_cache.get(session_id)

def init_dynamic_context(session_id):
	dynamic_context_cache[session_id] = {
		"last_ai_response": None,
		"current_bookings": [],
		"user_messages": []
	}

def get_dynamic_context(session_id):
	return dynamic_context_cache.get(session_id)

def update_dynamic_context(session_id, key, value):
	ctx = dynamic_context_cache.get(session_id)
	if ctx is not None:
		ctx[key] = value
