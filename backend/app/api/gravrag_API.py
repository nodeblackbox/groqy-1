from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from .gravrag import MemoryInput, Memory

router = APIRouter()

# Pydantic model for input data
class MemoryInputModel(BaseModel):
    session_id: str
    role: str
    content: str
    relevance_tags: Optional[List[str]] = None
    core_intent: Optional[str] = None
    objective_id: Optional[str] = None
    discovery_id: Optional[str] = None
    iteration_id: Optional[str] = None
    task_id: Optional[str] = None
    visual_data: Optional[str] = None
    is_basal_reference: bool = False

# Instantiate memory
Knowledge = Memory()

@router.post("/memory/create")
async def create_memory_api(memory_input: MemoryInputModel):
    """
    API endpoint to create a memory.
    """
    try:
        memory_data = MemoryInput(
            session_id=memory_input.session_id,
            role=memory_input.role,
            content=memory_input.content,
            relevance_tags=memory_input.relevance_tags,
            core_intent=memory_input.core_intent,
            objective_id=memory_input.objective_id,
            discovery_id=memory_input.discovery_id,
            iteration_id=memory_input.iteration_id,
            task_id=memory_input.task_id,
            visual_data=memory_input.visual_data,
            is_basal_reference=memory_input.is_basal_reference
        )
        await Knowledge.create_memory(memory_data)
        return {"message": "Memory created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/memory/recall/{session_id}")
async def recall_memory_api(session_id: str, query: str, top_k: int = 5):
    """
    API endpoint to recall memory based on session_id and query.
    """
    try:
        results = await Knowledge.recall_memory(session_id, query, top_k)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/memory/delete/{session_id}")
async def delete_memory_api(session_id: str):
    """
    API endpoint to delete a memory for a session.
    """
    try:
        await Knowledge.delete_session_data(session_id)
        return {"message": f"Memory for session {session_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/memory/context/{session_id}")
async def get_context_window_api(session_id: str):
    """
    API endpoint to get the context window for a session.
    """
    try:
        context = await Knowledge.get_context_window(session_id)
        return {"context": context}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/optimize")
async def optimize_index_api():
    """
    API endpoint to optimize the Qdrant index.
    """
    try:
        await Knowledge.optimize_index()
        return {"message": "Index optimized successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/semantic-search")
async def semantic_search_api(query: str, filter_conditions: Optional[dict] = None, top_k: int = 10):
    """
    API endpoint for performing a semantic search.
    """
    try:
        results = await Knowledge.semantic_search(query, filter_conditions, top_k)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/export")
async def export_data_api(file_path: str):
    """
    API endpoint to export data to a file.
    """
    try:
        await Knowledge.export_data(file_path)
        return {"message": "Data exported successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/import")
async def import_data_api(file_path: str):
    """
    API endpoint to import data from a file.
    """
    try:
        await Knowledge.import_data(file_path)
        return {"message": "Data imported successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/performance/analyze")
async def analyze_performance_api():
    """
    API endpoint to analyze the system's performance.
    """
    try:
        performance_data = await Knowledge.analyze_performance()
        return {"performance": performance_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
