"""
Centralized error handling utilities for voice booking system.
Provides consistent error handling and logging.
"""
import asyncio
import traceback
from functools import wraps
from typing import Any, Callable, Optional

class BookingError(Exception):
    """Custom exception for booking-related errors."""
    pass

class APIError(Exception):
    """Custom exception for API-related errors."""
    pass

def safe_async_call(timeout_seconds: int = 10, default_return: Any = None):
    """
    Decorator for safe async function calls with timeout and error handling.
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                return await asyncio.wait_for(func(*args, **kwargs), timeout=timeout_seconds)
            except asyncio.TimeoutError:
                print(f"[ERROR] {func.__name__} timed out after {timeout_seconds}s")
                return default_return
            except Exception as e:
                print(f"[ERROR] {func.__name__} failed: {e}")
                traceback.print_exc()
                return default_return
        return wrapper
    return decorator

def safe_sync_call(default_return: Any = None):
    """
    Decorator for safe synchronous function calls with error handling.
    """
    def decorator(func: Callable):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                print(f"[ERROR] {func.__name__} failed: {e}")
                traceback.print_exc()
                return default_return
        return wrapper
    return decorator

async def handle_websocket_error(websocket, session_id: str, error: Exception):
    """
    Centralized WebSocket error handling.
    """
    error_message = f"Error in session {session_id}: {str(error)}"
    print(f"[ERROR] {error_message}")
    
    try:
        # Send error message to client
        await websocket.send_text(f"Sorry, I encountered an error: {str(error)}")
    except:
        # If we can't send to WebSocket, just log
        print(f"[ERROR] Could not send error message to WebSocket for session {session_id}")

def validate_booking_data(business_id: Optional[str], date: Optional[str], 
                         time: Optional[str], service_id: Optional[str]) -> tuple[bool, str]:
    """
    Validate booking data before making API calls.
    Returns (is_valid, error_message)
    """
    if not business_id:
        return False, "Business ID is required for booking"
    
    if not date:
        return False, "Date is required for booking"
    
    if not time:
        return False, "Time is required for booking"
    
    if not service_id:
        return False, "Service must be specified for booking"
    
    return True, ""