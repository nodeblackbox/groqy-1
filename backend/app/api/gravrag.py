#gravrag.py is a FastAPI application that provides APIs for creating and recalling memories. It uses a Qdrant database for storing and searching memories. The application also provides APIs for optimizing the Qdrant index, exporting and importing data, and performing semantic search.
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, Range, SearchParams
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any, Optional
import time
import asyncio
from cachetools import TTLCache
import hashlib
import logging
import os
import uuid
from .gravrag_API import router as memory_router

# Constants
GRAVITATIONAL_THRESHOLD = 1e-5

# Logging setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI()
app.include_router(memory_router, prefix="/api"
                   )
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

# Centralized class for memory input data
class MemoryInput:
    def __init__(self, session_id: str, role: str, content: str, relevance_tags: List[str] = None, core_intent: str = None,
                 objective_id: str = None, discovery_id: str = None, iteration_id: str = None, task_id: str = None,
                 visual_data: str = None, is_basal_reference: bool = False):
        self.session_id = session_id
        self.role = role
        self.content = content
        self.relevance_tags = relevance_tags or []
        self.core_intent = core_intent
        self.objective_id = objective_id
        self.discovery_id = discovery_id
        self.iteration_id = iteration_id
        self.task_id = task_id
        self.visual_data = visual_data
        self.is_basal_reference = is_basal_reference
        self.timestamp = int(time.time())

    def to_dict(self):
        return self.__dict__

# Centralized memory class
class Memory:
    def __init__(self, mind_name: str = "Mind", context_window_size: int = 10, max_entries: int = 1000000):
        self.mind_name = mind_name
        self.context_window_size = context_window_size
        self.max_entries = max_entries
        self.client = self._connect_to_database()
        self.model = SentenceTransformer('all-MiniLM-L6-v2') if self.client else None
        self.cache = TTLCache(maxsize=1000, ttl=3600)  # 1-hour cache

        if self.client and self.model:
            self._initialize_collection()

    def _connect_to_database(self):
        try:
            client = QdrantClient(host=os.getenv("QDRANT_HOST", "localhost"), port=int(os.getenv("QDRANT_PORT", 6333)))
            client.get_collections()  # Test the connection
            logging.info("Connected to Qdrant Database")
            return client
        except Exception as e:
            logging.error(f"Failed to connect to database: {str(e)}")
            return None

    def _initialize_collection(self):
        """Initialize the memory collection in Qdrant."""
        try:
            self.client.get_collection(self.mind_name)
            logging.info(f"Collection '{self.mind_name}' exists.")
        except Exception as e:
            logging.info(f"Creating collection '{self.mind_name}' as it does not exist.")
            self.client.create_collection(
                collection_name=self.mind_name,
                vectors_config=VectorParams(size=self.model.get_sentence_embedding_dimension(), distance=Distance.COSINE)
            )

    async def create_memory(self, memory_input: MemoryInput):
        """Create a memory, encode its vector, and store it."""
        if not self.client:
            logging.warning("Database client unavailable, cannot create memory.")
            return

        try:
            logging.info(f"Creating memory for session ID: {memory_input.session_id}")
            vector = self.model.encode(memory_input.content).tolist()

            memory_data = memory_input.to_dict()
            memory_data['vector'] = vector
            self.client.upsert(collection_name=self.mind_name, points=[PointStruct(id=str(uuid.uuid4()), vector=vector, payload=memory_data)])

            await self._cleanup_old_entries()  # Clean up old entries
            self._invalidate_cache(memory_input.session_id)
        except Exception as e:
            logging.error(f"Error creating memory: {str(e)}")

    async def recall_memory(self, session_id: str, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Recall memory for the given session."""
        cache_key = self._get_cache_key(session_id, query)
        if cache_key in self.cache:
            return self.cache[cache_key]

        query_vector = self.model.encode(query).tolist()
        results = await self.client.search(
            mind_name=self.mind_name,
            query_vector=query_vector,
            query_filter=Filter(must=[FieldCondition(key="session_id", match={"value": session_id})]),
            limit=top_k
        )
        
        formatted_results = [self._format_result(hit) for hit in results]
        self.cache[cache_key] = formatted_results
        return formatted_results

    def _invalidate_cache(self, session_id: str):
        cache_key = f"context_{session_id}"
        self.cache.pop(cache_key, None)  # Invalidate the cache for this session

    def _format_result(self, hit) -> Dict[str, Any]:
        """Format search result into a simplified dictionary."""
        return {
            "session_id": hit.payload.get("session_id"),
            "role": hit.payload.get("role"),
            "content": hit.payload.get("content"),
            "timestamp": hit.payload.get("timestamp"),
            "relevance_tags": hit.payload.get("relevance_tags", []),
        }

    async def _cleanup_old_entries(self):
        """Clean up old entries based on the max number of entries."""
        total_points = self.client.count(collection_name=self.mind_name).count
        if total_points > self.max_entries:
            points_to_remove = total_points - self.max_entries
            points = self.client.scroll(collection_name=self.mind_name, limit=points_to_remove, with_payload=True)
            to_delete = [p.id for p in points[0] if not p.payload.get("is_basal_reference", False)]
            if to_delete:
                await self.client.delete(collection_name=self.mind_name, points_selector=Filter(must=[FieldCondition(key="id", range=Range(lt=max(to_delete)))]))

    def _get_cache_key(self, session_id: str, query: str) -> str:
        return f"{session_id}:{hashlib.md5(query.encode()).hexdigest()}"

# API Endpoints

@app.post("/memory/create")
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

@app.get("/memory/recall/{session_id}")
async def recall_memory_api(session_id: str, query: str, top_k: int = 5):
    """
    API endpoint to recall memory based on session_id and query.
    """
    try:
        results = await Knowledge.recall_memory(session_id, query, top_k)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/memory/delete/{session_id}")
async def delete_memory_api(session_id: str):
    """
    API endpoint to delete a memory for a session.
    """
    try:
        await Knowledge.delete_session_data(session_id)
        return {"message": f"Memory for session {session_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/memory/context/{session_id}")
async def get_context_window_api(session_id: str):
    """
    API endpoint to get the context window for a session.
    """
    try:
        context = await Knowledge.get_context_window(session_id)
        return {"context": context}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/performance/analyze")
async def analyze_performance_api():
    """
    API endpoint to analyze the system's performance.
    """
    try:
        performance_data = await Knowledge.analyze_performance()
        return {"performance": performance_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimize")
async def optimize_index_api():
    """
    API endpoint to optimize the Qdrant index.
    """
    try:
        await Knowledge.optimize_index()
        return {"message": "Index optimized successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/semantic-search")
async def semantic_search_api(query: str, filter_conditions: Optional[dict] = None, top_k: int = 10):
    """
    API endpoint for performing a semantic search.
    """
    try:
        results = await Knowledge.semantic_search(query, filter_conditions, top_k)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/export")
async def export_data_api(file_path: str):
    """
    API endpoint to export data to a file.
    """
    try:
        await Knowledge.export_data(file_path)
        return {"message": "Data exported successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/import")
async def import_data_api(file_path: str):
    """
    API endpoint to import data from a file.
    """
    try:
        await Knowledge.import_data(file_path)
        return {"message": "Data imported successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Synchronous wrapper functions
def sync_create_memory(memory_input: MemoryInput):
    asyncio.run(Knowledge.create_memory(memory_input))

def sync_recall_memory(session_id: str, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    return asyncio.run(Knowledge.recall_memory(session_id, query, top_k))

# Instantiate memory
Knowledge = Memory()