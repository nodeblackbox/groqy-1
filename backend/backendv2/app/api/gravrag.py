
from fastapi import APIRouter, HTTPException, Depends
from app.models.gravrag import MemoryRequest, RecallRequest, PruneRequest
from app.services.gravrag import memory_manager
from app.core.security import get_current_user

router = APIRouter()

@router.post("/create_memory")
async def create_memory(memory_request: MemoryRequest, current_user: dict = Depends(get_current_user)):
    if not memory_request.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
    try:
        await memory_manager.create_memory(content=memory_request.content, metadata=memory_request.metadata)
        return {"message": "Memory created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating memory: {str(e)}")

@router.post("/recall_memory")
async def recall_memory(recall_request: RecallRequest, current_user: dict = Depends(get_current_user)):
    if not recall_request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    try:
        memories = await memory_manager.recall_memory(query_content=recall_request.query, top_k=recall_request.top_k)
        if not memories:
            return {"message": "No relevant memories found"}
        return {"memories": memories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error recalling memories: {str(e)}")

@router.post("/prune_memories")
async def prune_memories(prune_request: PruneRequest, current_user: dict = Depends(get_current_user)):
    try:
        await memory_manager.prune_memories()
        return {"message": "Memory pruning completed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error pruning memories: {str(e)}")