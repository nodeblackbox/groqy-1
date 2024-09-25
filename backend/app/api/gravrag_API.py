from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from pydantic import BaseModel
from gravrag import Knowledge

router = APIRouter()

# API Model for creating a memory
class MemoryInputModel(BaseModel):
    vector: List[float]
    metadata: Dict[str, Any]

# Example Payload for Thunder Client / Postman:
# POST /api/memory/create
# {
#   "vector": [0.1, 0.2, 0.3, 0.4],
#   "metadata": {
#     "session_id": "session123",
#     "recall_count": 0,
#     "memetic_similarity": 1.0,
#     "semantic_relativity": 1.0,
#     "gravitational_pull": 1.0,
#     "spacetime_coordinate": 1.0,
#     "timestamp": 1633024800,
#     "objective_id": "objective_42",
#     "discovery_id": "discovery_99",
#     "iteration_id": "iteration_v3",
#     "task_id": "task_123",
#     "visual_data": null
#   }
# }

# API endpoint to create a memory
@router.post("/memory/create")
async def create_memory(memory_input: MemoryInputModel):
    try:
        await Knowledge.create_memory(memory_input.vector, memory_input.metadata)
        return {"message": "Memory created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Example Payload for Thunder Client / Postman:
# GET /api/memory/recall?query_vector=[0.1,0.2,0.3,0.4]&session_id=session123&top_k=5
# You can adjust the query_vector and session_id to match your query.

# API endpoint to recall a memory
@router.get("/memory/recall")
async def recall_memory(query_vector: List[float], session_id: str = None, top_k: int = 5):
    try:
        results = await Knowledge.recall_memory(query_vector, session_id, top_k)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Example Payload for Thunder Client / Postman:
# DELETE /api/memory/delete/session123

# API endpoint to delete a memory
@router.delete("/memory/delete/{session_id}")
async def delete_memory(session_id: str):
    try:
        await Knowledge.delete_session_data(session_id)
        return {"message": f"Memory for session {session_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Example Payload for Thunder Client / Postman:
# POST /api/optimize
# No payload required.

# API endpoint to optimize the index
@router.post("/optimize")
async def optimize_index():
    try:
        await Knowledge.optimize_index()
        return {"message": "Index optimized successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
