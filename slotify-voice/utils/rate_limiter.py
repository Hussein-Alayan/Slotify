"""
Rate limiter and circuit breaker for booking operations.
Prevents infinite loops and provides graceful degradation.
"""
import time
from typing import Dict, Optional

class BookingRateLimiter:
    """Prevents booking spam and infinite loops per session."""
    
    def __init__(self, max_attempts: int = 3, window_seconds: int = 60, backoff_seconds: int = 5):
        self.max_attempts = max_attempts
        self.window_seconds = window_seconds
        self.backoff_seconds = backoff_seconds
        self.attempts: Dict[str, list] = {}  # session_id -> [timestamps]
        self.last_attempt: Dict[str, float] = {}  # session_id -> last_attempt_time
    
    def can_attempt_booking(self, session_id: str) -> tuple[bool, Optional[str]]:
        """
        Check if booking attempt is allowed for this session.
        Returns (can_attempt, reason_if_blocked)
        """
        current_time = time.time()
        
        # Check backoff period
        if session_id in self.last_attempt:
            time_since_last = current_time - self.last_attempt[session_id]
            if time_since_last < self.backoff_seconds:
                remaining = self.backoff_seconds - time_since_last
                return False, f"Please wait {remaining:.1f} seconds before trying again"
        
        # Clean old attempts outside window
        if session_id in self.attempts:
            self.attempts[session_id] = [
                t for t in self.attempts[session_id] 
                if current_time - t < self.window_seconds
            ]
        
        # Check attempt limit
        attempts_count = len(self.attempts.get(session_id, []))
        if attempts_count >= self.max_attempts:
            return False, f"Too many booking attempts. Please wait {self.window_seconds} seconds"
        
        return True, None
    
    def record_attempt(self, session_id: str, success: bool = False):
        """Record a booking attempt."""
        current_time = time.time()
        
        if session_id not in self.attempts:
            self.attempts[session_id] = []
        
        self.attempts[session_id].append(current_time)
        self.last_attempt[session_id] = current_time
        
        # If successful, reset attempts for this session
        if success:
            self.attempts[session_id] = []
    
    def cleanup_old_sessions(self, max_age_hours: int = 24):
        """Clean up old session data to prevent memory leaks."""
        current_time = time.time()
        max_age_seconds = max_age_hours * 3600
        
        # Clean attempts
        sessions_to_remove = []
        for session_id, timestamps in self.attempts.items():
            if timestamps and current_time - timestamps[-1] > max_age_seconds:
                sessions_to_remove.append(session_id)
        
        for session_id in sessions_to_remove:
            del self.attempts[session_id]
            if session_id in self.last_attempt:
                del self.last_attempt[session_id]

# Global instance
booking_rate_limiter = BookingRateLimiter()