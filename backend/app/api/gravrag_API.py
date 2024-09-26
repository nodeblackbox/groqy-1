from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from gravrag.gravrag import MemoryManager  # Correct import

# Using APIRouter for integration into the main FastAPI app
router = APIRouter()

# Instantiate the memory manager
memory_manager = MemoryManager()

class MemoryInputModel(BaseModel):
    content: str
    metadata: Optional[Dict[str, Any]] = {}

@router.post("/memory/create")
async def create_memory(memory_input: MemoryInputModel):
    try:
        await memory_manager.create_memory(memory_input.content, memory_input.metadata)
        return {"message": "Memory created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")

@router.get("/memory/recall")
async def recall_memory(query: str, top_k: int = 5):
    try:
        results = await memory_manager.recall_memory(query, top_k)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")

@router.post("/memory/prune")
async def prune_memories():
    try:
        await memory_manager.prune_memories()
        return {"message": "Pruning complete"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")

# Example ThunderClient payloads:
# 1. Create Memory
# {
#   "content": "This is a sample memory",
#   "metadata": {
#     "objective_id": "obj_1",
#     "task_id": "task_1"
#   }
# }
#
# 2. Recall Memory
# GET /api/memory/recall?query=How does GravRAG handle memory?
#
# 3. Prune Memories
# POST /api/memory/prune