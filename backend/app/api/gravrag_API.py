from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging
from gravrag.gravrag import MemoryManager  # Ensure gravrag is imported correctly

# Initialize Router
router = APIRouter()

logger = logging.getLogger(__name__)

# Instantiate MemoryManager for GravRAG
memory_manager = MemoryManager()

# Request models
class MemoryRequest(BaseModel):
    content: str
    metadata: Optional[Dict[str, Any]] = None  # System handles metadata if absent

class RecallRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5  # Retrieve top K memories, default 5

class PruneRequest(BaseModel):
    gravity_threshold: Optional[float] = 1e-5  # Default threshold for pruning memories

# API: Create Memory
@router.post("/create_memory")
async def create_memory(memory_request: MemoryRequest):
    """
    Create a new memory. The memory is vectorized, given gravitational properties,
    and stored in the Qdrant system for future recall.
    """
    # Validate that content isn't empty
    if not memory_request.content.strip():
        logger.warning("Memory creation failed: Empty content provided.")
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
    
    # Use provided metadata or initialize an empty dictionary
    metadata = memory_request.metadata or {}
    
    try:
        logger.info(f"Creating memory for content: '{memory_request.content}' with metadata: {metadata}")
        
        # Vectorize the content and create a memory packet in the system
        await memory_manager.create_memory(content=memory_request.content, metadata=metadata)
        
        logger.info("Memory created successfully.")
        return {"message": "Memory created successfully"}
    except Exception as e:
        logger.error(f"Error while creating memory: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal error while creating memory: {str(e)}")

# API: Recall Memory
@router.post("/recall_memory")
async def recall_memory(recall_request: RecallRequest):
    """
    Recall memories based on a query. The system returns the most relevant memories
    based on their gravitational pull, memetic similarity, and semantic relativity.
    """
    # Validate that query isn't empty
    if not recall_request.query.strip():
        logger.warning("Memory recall failed: Empty query provided.")
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    try:
        logger.info(f"Recalling memories for query: '{recall_request.query}' with top_k: {recall_request.top_k}")
        
        # Recall relevant memories from the system
        memories = await memory_manager.recall_memory(query_content=recall_request.query, top_k=recall_request.top_k)
        
        if not memories:
            logger.info("No relevant memories found.")
            return {"message": "No relevant memories found"}
        
        logger.info(f"Recalled {len(memories)} memories successfully.")
        return {"memories": memories}
    except Exception as e:
        logger.error(f"Error while recalling memories: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal error while recalling memories: {str(e)}")

# API: Prune Memories
@router.post("/prune_memories")
async def prune_memories(prune_request: PruneRequest):
    """
    Prune memories with a gravitational pull below a certain threshold. This removes
    memories that are no longer relevant or significant in the recursive system.
    """
    try:
        logger.info(f"Pruning memories with a gravitational threshold of: {prune_request.gravity_threshold}")
        
        # Prune the low-relevance memories from the system
        await memory_manager.prune_memories(gravity_threshold=prune_request.gravity_threshold)
        
        logger.info("Memory pruning completed successfully.")
        return {"message": "Memory pruning completed successfully"}
    except Exception as e:
        logger.error(f"Error while pruning memories: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal error while pruning memories: {str(e)}")
