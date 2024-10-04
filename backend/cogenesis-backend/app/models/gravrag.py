
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class MemoryPacket(BaseModel):
    vector: List[float]
    metadata: Dict[str, Any]

class MemoryRequest(BaseModel):
    content: str
    metadata: Optional[Dict[str, Any]] = None

class RecallRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5

class PruneRequest(BaseModel):
    gravity_threshold: Optional[float] = 1e-5