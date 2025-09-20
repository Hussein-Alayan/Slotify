# Cache for services to avoid redundant API calls
services_cache = {}

def get_services(business_id):
	"""Get all services for a business (cached)"""
	if business_id in services_cache:
		return services_cache[business_id]
	
	resp = requests.get(f"{LARAVEL_API}/businesses/{business_id}/services")
	if resp.status_code == 200:
		response_data = resp.json()
		# Handle Laravel API response structure 
		services = response_data.get('data', response_data) if isinstance(response_data, dict) else response_data
		services_cache[business_id] = services
		return services
	return []

def get_service_mapping(business_id):
	"""Get service name to ID mapping"""
	services = get_services(business_id)
	# Return mapping: {service_name: service_id}
	return {s['name']: s['id'] for s in services}

def get_service_details(business_id, service_id):
	"""Get full service details including duration"""
	services = get_services(business_id)
	for service in services:
		if service['id'] == service_id:
			return service
	return None

import requests

LARAVEL_API = "http://localhost:8000/api/v1"

def parse_natural_datetime(date_str, time_str):
	"""Parse natural language date and time to standard format"""
	from datetime import datetime, timedelta
	import re
	
	# Parse time first (e.g., "2 p.m." -> "14:00")
	time_str = time_str.lower().strip()
	
	# Extract hour and AM/PM
	time_match = re.search(r'(\d+)(?::(\d+))?\s*(a\.?m\.?|p\.?m\.?|am|pm)?', time_str)
	if time_match:
		hour = int(time_match.group(1))
		minute = int(time_match.group(2) or 0)
		period = time_match.group(3)
		
		# Convert to 24-hour format
		if period and ('p' in period.lower()) and hour != 12:
			hour += 12
		elif period and ('a' in period.lower()) and hour == 12:
			hour = 0
			
		parsed_time = f"{hour:02d}:{minute:02d}"
	else:
		# Default to 09:00 if can't parse
		parsed_time = "09:00"
	
	# Parse date (e.g., "Monday" -> next Monday's date)
	date_str = date_str.lower().strip()
	today = datetime.now()
	
	# Days of week mapping
	days_map = {
		'monday': 0, 'tuesday': 1, 'wednesday': 2, 'thursday': 3,
		'friday': 4, 'saturday': 5, 'sunday': 6
	}
	
	if date_str in days_map:
		# Find next occurrence of this day
		target_weekday = days_map[date_str]
		days_ahead = target_weekday - today.weekday()
		if days_ahead <= 0:  # Target day already happened this week
			days_ahead += 7
		target_date = today + timedelta(days=days_ahead)
		parsed_date = target_date.strftime("%Y-%m-%d")
	else:
		# Try to parse as regular date, or default to tomorrow
		try:
			parsed_dt = datetime.strptime(date_str, "%Y-%m-%d")
			parsed_date = parsed_dt.strftime("%Y-%m-%d")
		except:
			# Default to tomorrow
			tomorrow = today + timedelta(days=1)
			parsed_date = tomorrow.strftime("%Y-%m-%d")
	
	return parsed_date, parsed_time

def forward_transcript(call_id, transcript):
	requests.post(
		f"http://localhost:8000/api/v1/voice/{call_id}/transcript",
		json={"transcript": transcript}
	)

def end_call_api(call_id):
	requests.post(f"http://localhost:8000/api/v1/voice/{call_id}/end")

def create_booking(business_id, date, time, service_id, client_id=None, resource_id=None):
	"""Create booking with proper Laravel-compatible payload"""
	from datetime import datetime, timedelta
	import re
	
	# Get service details to calculate duration
	service = get_service_details(business_id, service_id)
	if not service:
		raise ValueError(f"Service {service_id} not found")
	
	# Parse natural language date and time
	parsed_date, parsed_time = parse_natural_datetime(date, time)
	
	# Create start_time datetime
	start_datetime_str = f"{parsed_date} {parsed_time}:00"
	start_time = datetime.strptime(start_datetime_str, "%Y-%m-%d %H:%M:%S")
	
	# Calculate end_time based on service duration
	duration_minutes = service.get('duration_minutes', 60)  # Default 60 minutes
	end_time = start_time + timedelta(minutes=duration_minutes)
	
	# Format for Laravel
	start_time_str = start_time.strftime("%Y-%m-%d %H:%M:%S")
	end_time_str = end_time.strftime("%Y-%m-%d %H:%M:%S")
	
	payload = {
		"business_id": business_id,
		"client_id": client_id,
		"service_id": service_id,
		"start_time": start_time_str,
		"end_time": end_time_str
	}
	
	# Add resource_id if provided
	if resource_id:
		payload["resource_id"] = resource_id
	
	print(f"[DEBUG] Sending booking payload: {payload}")
	
	resp = requests.post(
		f"{LARAVEL_API}/businesses/{business_id}/bookings",
		json=payload
	)
	
	if resp.status_code not in [200, 201]:
		print(f"[ERROR] Booking failed: {resp.status_code} - {resp.text}")
		resp.raise_for_status()
	
	return resp.json()

def check_availability(business_id, date=None, service_id=None):
	params = {}
	if date:
		params["date"] = date
	if service_id:
		params["service_id"] = service_id
	resp = requests.get(
		f"{LARAVEL_API}/businesses/{business_id}/availability",
		params=params
	)
	return resp.json()
