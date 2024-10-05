from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging
from models.gravrag import MemoryManager

router = APIRouter()
logger = logging.getLogger(__name__)
memory_manager = MemoryManager()

class MemoryRequest(BaseModel):
    content: str
    metadata: Optional[Dict[str, Any]] = None

class RecallRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5

class PruneRequest(BaseModel):
    gravity_threshold: Optional[float] = 1e-5

class RecallWithMetadataRequest(BaseModel):
    query: str
    metadata: Dict[str, Any]
    top_k: Optional[int] = 10

class DeleteByMetadataRequest(BaseModel):
    metadata: Dict[str, Any]

@router.post("/create_memory")
async def create_memory(memory_request: MemoryRequest):
    if not memory_request.content.strip():
        logger.warning("Memory creation failed: Empty content.")
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
    
    metadata = memory_request.metadata or {}
    try:
        logger.info(f"Creating memory: '{memory_request.content}' with metadata: {metadata}")
        await memory_manager.create_memory(content=memory_request.content, metadata=metadata)
        return {"message": "Memory created successfully"}
    except Exception as e:
        logger.error(f"Error during memory creation: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error creating memory: {str(e)}")

@router.post("/recall_memory")
async def recall_memory(recall_request: RecallRequest):
    if not recall_request.query.strip():
        logger.warning("Memory recall failed: Empty query.")
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    try:
        logger.info(f"Recalling memories for query: '{recall_request.query}' with top_k={recall_request.top_k}")
        memories = await memory_manager.recall_memory(query_content=recall_request.query, top_k=recall_request.top_k)
        if not memories:
            return {"message": "No relevant memories found"}
        return {"memories": memories}
    except Exception as e:
        logger.error(f"Error during memory recall: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error recalling memories: {str(e)}")

@router.post("/prune_memories")
async def prune_memories(prune_request: PruneRequest):
    try:
        await memory_manager.prune_memories()
        return {"message": "Memory pruning completed successfully"}
    except Exception as e:
        logger.error(f"Error during memory pruning: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error pruning memories: {str(e)}")

@router.post("/purge_memories")
async def purge_memories():
    try:
        await memory_manager.purge_all_memories()
        return {"message": "All memories have been purged successfully"}
    except Exception as e:
        logger.error(f"Error purging memories: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error purging memories: {str(e)}")

@router.post("/recall_with_metadata")
async def recall_with_metadata(recall_request: RecallWithMetadataRequest):
    """
    Recall memories that match query content and metadata criteria.
    """
    query = recall_request.query
    metadata = recall_request.metadata
    top_k = recall_request.top_k or 10

    if not query.strip():
        raise HTTPException(status_code=400, detail="Query content cannot be empty.")
    if not metadata:
        raise HTTPException(status_code=400, detail="Metadata cannot be empty.")

    try:
        memories = await memory_manager.recall_memory_with_metadata(query_content=query, search_metadata=metadata, top_k=top_k)
        
        if not memories or "memories" not in memories:
            return {"message": "No matching memories found"}
        
        return memories
    except Exception as e:
        logger.error(f"Error during metadata recall: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error recalling memories: {str(e)}")

@router.post("/delete_by_metadata")
async def delete_by_metadata(delete_request: DeleteByMetadataRequest):
    try:
        logger.info(f"Deleting memories with metadata: {delete_request.metadata}")
        await memory_manager.delete_memories_by_metadata(metadata=delete_request.metadata)
        return {"message": "Memory deletion by metadata completed successfully"}
    except Exception as e:
        logger.error(f"Error deleting memories by metadata: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error deleting memories: {str(e)}")
