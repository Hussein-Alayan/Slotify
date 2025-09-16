from pydantic import BaseModel
from typing import Optional

class StartCallRequest(BaseModel):
	caller_phone: str
	business_id: Optional[int] = None
	client_id: Optional[int] = None
