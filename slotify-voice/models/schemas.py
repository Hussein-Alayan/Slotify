from pydantic import BaseModel
from typing import Optional

class StartCallRequest(BaseModel):
	caller_phone: str
	business_id: Optional[int] = None
	client_name: Optional[str] = None
	client_phone: Optional[str] = None
	# Deprecated: keeping for backward compatibility
	client_id: Optional[int] = None
