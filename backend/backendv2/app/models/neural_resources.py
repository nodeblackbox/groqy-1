
from pydantic import BaseModel

class Message(BaseModel):
    content: str
    role: str

class APIKeyUpdate(BaseModel):
    provider: str
    api_key: str