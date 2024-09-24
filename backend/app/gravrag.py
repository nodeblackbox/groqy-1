from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, Range, SearchParams
from qdrant_client.http import models
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any, Union
import time
import json
import asyncio
from cachetools import TTLCache
import hashlib
import logging
import os
import uuid

from fastapi import FastAPI
from .api.gravrag_API import router as memory_router  # Assuming same directory

app = FastAPI()

app.include_router(memory_router, prefix="/api")

# Gravitational constant
G = 6.67430e-11  # This could be tuned based on system needs
GRAVITATIONAL_THRESHOLD = 1e-5  # Initial threshold (adjust as needed for your system)

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MemoryPacket:
    def __init__(self, session_id: str, role: str, content: str, vector: List[float], relevance_tags: List[str] = None, 
                 core_intent: str = None, is_basal_reference: bool = False, timestamp: int = None,
                 objective_id: str = None, discovery_id: str = None, iteration_id: str = None,
                 task_id: str = None, visual_data: str = None):
        
        self.session_id = session_id
        self.role = role
        self.content = content
        self.vector = vector
        self.relevance_tags = relevance_tags or []
        self.core_intent = core_intent
        self.is_basal_reference = is_basal_reference
        self.timestamp = timestamp or int(time.time())
        self.objective_id = objective_id
        self.discovery_id = discovery_id
        self.iteration_id = iteration_id
        self.task_id = task_id
        self.visual_data = visual_data
        
        # Calculate memetic value based on session and relevance tags
        self.memetic_value = self.calculate_memetic_value()
        
        # Calculate gravitational pull using content vector and relevance tags
        self.gravitational_pull = self.calculate_gravitational_pull()
        
        # Spacetime coordinate combining gravity and time
        self.spacetime_coordinate = self.calculate_spacetime_coordinate()

    def calculate_memetic_value(self):
        """Calculate memetic value based on the recurrence and relationships."""
        recurrence_factor = self._get_recurrence_count(self.session_id)
        relevance_factor = len(self.relevance_tags) or 1  # Boost for more tags
        return recurrence_factor * relevance_factor

    def calculate_gravitational_pull(self):
        """ 
        Calculate gravitational pull using vector magnitude and relevance. 
        Refined to better account for the significance of relevance tags and vector magnitude.
        """
        vector_magnitude = sum([x ** 2 for x in self.vector]) ** 0.5  # Magnitude of the vector
        tag_factor = len(self.relevance_tags) if self.relevance_tags else 1  # Simplified tag importance
        base_gravity = vector_magnitude * tag_factor
        
        # Apply scaling based on a logarithmic function of tag count for more nuanced relevance weighting
        relevance_weight = (1 + tag_factor) ** 0.5
        gravitational_pull = base_gravity * relevance_weight
        
        return gravitational_pull

    def calculate_spacetime_coordinate(self):
        """Create a unified spacetime coordinate using gravitational pull and timestamp."""
        return self.gravitational_pull / (1 + (time.time() - self.timestamp))

    def to_payload(self) -> Dict[str, Any]:
        """Convert memory packet data into a payload for the database."""
        payload = {
            "session_id": self.session_id,
            "role": self.role,
            "content": self.content,
            "timestamp": self.timestamp,
            "objective_id": self.objective_id,
            "discovery_id": self.discovery_id,
            "iteration_id": self.iteration_id,
            "task_id": self.task_id,
            "relevance_tags": self.relevance_tags,
            "core_intent": self.core_intent,
            "is_basal_reference": self.is_basal_reference,
            "memetic_value": self.memetic_value,
            "gravitational_pull": self.gravitational_pull,
            "spacetime_coordinate": self.spacetime_coordinate
        }
        if self.visual_data:
            payload["visual_data"] = self.visual_data
        return payload

    def _get_recurrence_count(self, session_id: str) -> int:
        # Mockup of a function that returns how many times a session has been recalled.
        return 5  # Placeholder for now

class Memory:
    def __init__(self, mind_name: str = None, context_window_size: int = 10, max_entries: int = 1000000, max_retries: int = 3):
        if hasattr(self, '_initialized') and self._initialized:
            return

        self.mind_name = mind_name or os.getenv("MIND_NAME", "Mind")
        self.context_window_size = context_window_size
        self.max_entries = max_entries
        self.max_retries = max_retries
        self.client = None

        # Attempt to connect to the database and create the memory if needed
        self.client = self._connect_to_database()
        if self.client:
            try:
                self.model = SentenceTransformer('all-MiniLM-L6-v2')

                # Initialize the cache
                self.cache = TTLCache(maxsize=1000, ttl=3600)  # Cache with 1 hour TTL

                self._create_memory()  # Single method to handle both checking and creating
            except Exception as e:
                logging.error(f"Error initializing model or memory: {str(e)}")
        else:
            logging.warning("Database is unavailable, proceeding without database functionality.")
        
        self._initialized = True

    def _connect_to_database(self) -> Union[QdrantClient, None]:
        """
        Attempt to connect to the Qdrant database and handle connection retries with exponential backoff.
        """
        attempt = 0
        backoff_time = 1  # Initial backoff time in seconds
        while attempt < self.max_retries:
            try:
                client = QdrantClient(
                    os.getenv("QDRANT_HOST", "localhost"),
                    port=int(os.getenv("QDRANT_PORT", 6333))
                )
                client.get_collections()  # Test the connection by listing collections
                logging.info("Connected to Qdrant Database")
                return client
            except Exception as e:
                attempt += 1
                logging.error(f"Failed to connect to database (Attempt {attempt}/{self.max_retries}): {str(e)}")
                time.sleep(backoff_time)  # Exponential backoff
                backoff_time *= 2
        
        logging.warning("Exceeded maximum retry attempts. Database connection failed.")
        return None

    def _create_memory(self):
        """
        Check if the collection exists and create it if it doesn't.
        No retries. Just handle the 404 directly and create the collection.
        """
        if not self.client:
            logging.warning("Database client unavailable. Skipping memory creation.")
            return

        try:
            # Attempt to fetch the collection
            self.client.get_collection(self.mind_name)
            logging.info(f"Collection '{self.mind_name}' exists.")
        
        except Exception as e:
            if "404" in str(e):
                # Collection doesn't exist, create it
                logging.info(f"Collection '{self.mind_name}' not found. Creating new collection...")
                try:
                    self.client.create_collection(
                        collection_name=self.mind_name,
                        vectors_config=VectorParams(size=self.model.get_sentence_embedding_dimension(), distance=Distance.COSINE)
                    )
                    logging.info(f"Collection '{self.mind_name}' created successfully.")
                except Exception as creation_error:
                    logging.error(f"Error creating collection: {str(creation_error)}")
                    return
                # Verify post-creation to confirm success
                try:
                    self.client.get_collection(self.mind_name)
                    logging.info(f"Collection '{self.mind_name}' verified post-creation.")
                except Exception as verify_error:
                    logging.error(f"Post-creation verification failed: {str(verify_error)}")
            else:
                # Any other errors are logged
                logging.error(f"Unexpected error while checking collection: {str(e)}")

    async def create_memory(self, session_id: str, role: str, content: str, visual_data: Union[str, None] = None,
                            objective_id: str = None, discovery_id: str = None, iteration_id: str = None,
                            task_id: str = None, relevance_tags: List[str] = None, core_intent: str = None,
                            is_basal_reference: bool = False) -> None:
        """
        Create a memory packet, encode its vector, and store it in the Qdrant database.
        Error handling ensures memory creation proceeds correctly.
        """
        if not self.client:
            logging.warning("Skipping create_memory: Database client unavailable.")
            return

        try:
            logging.info(f"Creating memory for session ID: {session_id}")

            # Generate vector for the content
            vector = self.model.encode(content).tolist()

            # Create the MemoryPacket instance
            memory_packet = MemoryPacket(
                session_id=session_id,
                role=role,
                content=content,
                vector=vector,
                relevance_tags=relevance_tags,
                core_intent=core_intent,
                is_basal_reference=is_basal_reference,
                objective_id=objective_id,
                discovery_id=discovery_id,
                iteration_id=iteration_id,
                task_id=task_id,
                visual_data=visual_data
            )
            logging.info(f"Memory Packet Payload: {memory_packet.to_payload()}")

            # Upsert the memory into the database using the payload from MemoryPacket
            self.client.upsert(
                collection_name=self.mind_name,  # Pass the collection name
                points=[PointStruct(id=str(uuid.uuid4()), vector=vector, payload=memory_packet.to_payload())]
            )

            # Cleanup if not basal reference
            if not is_basal_reference:
                await self._cleanup_old_entries()

            # Invalidate the cache for the session
            self._invalidate_cache(session_id)

        except Exception as e:
            logging.error(f"Error creating memory for session {session_id}: {str(e)}")


    def _calculate_rule_of_37_breakout(self, memory_packets: List[MemoryPacket]) -> MemoryPacket:
        """
        Apply the Rule of 37% to determine when to trigger a breakout event.
        Now considers both gravitational pull and spacetime coordinates when selecting a breakout memory.
        """
        num_packets = len(memory_packets)
        observation_limit = int(num_packets * 0.37)  # Calculate 37% of total packets

        # Observe the first 37% of memory packets and track the best gravitational pull and spacetime coordinate
        best_observed_packet = None
        best_gravitational_pull = 0
        best_spacetime_coordinate = 0
        
        for i in range(observation_limit):
            packet = memory_packets[i]
            if packet.gravitational_pull > best_gravitational_pull or packet.spacetime_coordinate > best_spacetime_coordinate:
                best_observed_packet = packet
                best_gravitational_pull = packet.gravitational_pull
                best_spacetime_coordinate = packet.spacetime_coordinate

        # After observing, select the next memory packet that exceeds the best observed gravitational pull or spacetime coordinate
        for i in range(observation_limit, num_packets):
            packet = memory_packets[i]
            if packet.gravitational_pull > best_gravitational_pull or packet.spacetime_coordinate > best_spacetime_coordinate:
                # Breakout triggered when a better memory packet is found
                return packet

        # If no breakout, return the best observed packet from the initial 37%
        return best_observed_packet

    def _calculate_memetic_value(self, session_id: str, relevance_tags: List[str] = None) -> float:
        """
        Calculate memetic value based on how often this session or its related tags have been referenced.
        This can also consider relevance tags to see if related content boosts its memetic value.
        """
        recurrence_factor = self._get_recurrence_count(session_id)
        relevance_factor = len(relevance_tags) if relevance_tags else 1  # Boost for more tags
        return recurrence_factor * relevance_factor

    def _calculate_gravitational_pull(self, vector: List[float], relevance_tags: List[str] = None) -> float:
        """
        Calculate gravitational pull using vector representation and semantic relevance.
        In a simplified model, we use vector magnitude and relevance tags to determine pull.
        """
        vector_magnitude = sum([x**2 for x in vector]) ** 0.5  # Magnitude of the vector
        tag_factor = len(relevance_tags) if relevance_tags else 1  # Simplified tag importance
        return vector_magnitude * tag_factor

    def _get_recurrence_count(self, session_id: str) -> int:
        """
        Mockup of a function that returns how many times a session has been recalled. 
        Could be expanded to a database lookup for recurrence count.
        """
        # In actual implementation, this would look up past references in the database
        return 5  # Placeholder for now

    def _format_result(self, hit) -> Dict[str, Any]:
        """Format the Qdrant hit result into a simplified structure."""
        result = {
            "session_id": hit.payload.get("session_id", "unknown_session"),  # Adding session_id here
            "role": hit.payload["role"],
            "content": hit.payload["content"],
            "timestamp": hit.payload.get("timestamp"),
            "memetic_value": hit.payload.get("memetic_value"),
            "gravitational_pull": hit.payload.get("gravitational_pull"),
            "spacetime_coordinate": hit.payload.get("spacetime_coordinate"),
            "relevance_tags": hit.payload.get("relevance_tags", [])
        }
        if "visual_data" in hit.payload:
            result["visual_data"] = hit.payload["visual_data"]
        
        return result


    async def _cleanup_old_entries(self):
        if not self.client:
            logging.warning("Skipping cleanup: Database client unavailable.")
            return

        total_points = self.client.count(collection_name=self.mind_name).count  # Remove 'await'
        if total_points > self.max_entries:
            points_to_remove = total_points - self.max_entries
            oldest_points = self.client.scroll(  # Remove 'await' from scroll as well
                collection_name=self.mind_name,
                limit=points_to_remove,
                with_payload=True,
                with_vectors=False
            )

            # Filter out basal references and high spacetime coordinate memories from deletion
            points_to_delete = [
                p for p in oldest_points[0] 
                if not p.payload.get("is_basal_reference", False) and p.payload.get("spacetime_coordinate", 0) < GRAVITATIONAL_THRESHOLD
            ]

            if points_to_delete:
                await self.client.delete(
                    collection_name=self.mind_name,  # Specify the collection name here
                    points_selector=Filter(
                        must=[FieldCondition(
                            key="timestamp",
                            range=Range(lt=points_to_delete[-1].payload["timestamp"])
                        )]
                    )
                )

    async def recursive_validity_check(self):
        """Asynchronously check the validity of stored memory and ensure it's coherent with core intent and gravitational pull."""
        if not self.client:
            logging.warning("Skipping validity check: Database client unavailable.")
            return

        results = await self.client.scroll(
            mind_name=self.mind_name,
            limit=1000,  # Example limit for how many entries to validate
            with_payload=True,
            with_vectors=False
        )

        for point in results[0]:
            core_intent = point.payload.get("core_intent", None)
            gravitational_pull = point.payload.get("gravitational_pull", 0)
            if core_intent and self._is_valid(core_intent) and gravitational_pull >= GRAVITATIONAL_THRESHOLD:
                logging.info(f"Memory point {point.id} is valid and gravitational pull is sufficient.")
            else:
                logging.warning(f"Memory point {point.id} failed validity check.")


    def _is_valid(self, core_intent):
        # Placeholder function that checks if the core intent aligns with current system goals
        return True  # For now, assume all core intents are valid

    async def recall_memory(self, session_id: str, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Recall memory for the given session and query using vector search.
        Prioritize results based on gravitational pull and spacetime coordinates before applying Rule of 37%.
        """
        if not self.client:
            logging.warning("Skipping recall_memory: Database client unavailable.")
            return []

        cache_key = self._get_cache_key(session_id, query)
        if cache_key in self.cache:
            return self.cache[cache_key]

        query_vector = self.model.encode(query).tolist()
        results = await self.client.search(
            mind_name=self.mind_name,
            query_vector=query_vector,
            query_filter=Filter(
                must=[FieldCondition(key="session_id", match={"value": session_id})]
            ),
            limit=top_k
        )

        # Convert the search results into memory packets
        memory_packets = [self._create_memory_packet_from_result(hit) for hit in results]
        
        # Prioritize memory packets based on gravitational pull and spacetime coordinates
        memory_packets = sorted(memory_packets, key=lambda x: (x.gravitational_pull, x.spacetime_coordinate), reverse=True)
        
        # Apply Rule of 37% after sorting by gravitational pull
        breakout_packet = self._calculate_rule_of_37_breakout(memory_packets)

        context = self._format_result(breakout_packet)
        self.cache[cache_key] = context
        return context

    def get_context_window(self, session_id):
        logging.info(f"Fetching context window for session: {session_id}")
        
        cache_key = f"context_{session_id}"
        cached_context = self.cache.get(cache_key)
        if cached_context:
            logging.info(f"Returning cached context for session: {session_id}")
            return cached_context

        context = []
        scroll_filter = models.Filter(must=[models.FieldCondition(key="session_id", match={"value": session_id})])
        
        while True:
            results = self.client.scroll(
                collection_name=self.mind_name,
                scroll_filter=scroll_filter,
                limit=self.context_window_size,
                with_payload=True,
                with_vectors=False
            )

            if not results or not results[0]:
                break

            for hit in results[0]:
                formatted_result = self._format_result(hit)
                if formatted_result.get("gravitational_pull", 0) > GRAVITATIONAL_THRESHOLD:
                    context.append(formatted_result)

            if len(context) >= self.context_window_size or not results[1]:
                break

            if results[1]:  # Ensure the offset exists before setting it
                scroll_filter.offset = results[1]

        if context:
            self.cache[cache_key] = context
            logging.info(f"Cached {len(context)} context items for session: {session_id}")

        return context

    def delete_session_data(self, session_id):
        logging.info(f"Deleting session data for session: {session_id}")
        
        self.client.delete(
            collection_name=self.mind_name,
            points_selector=models.Filter(must=[models.FieldCondition(key="session_id", match={"value": session_id})])
        )
        
        self._invalidate_cache(session_id)
        
        logging.info(f"Deleted session data and cleared cache for session: {session_id}")

    def _invalidate_cache(self, session_id: str):
        cache_key = f"context_{session_id}"
        self.cache.pop(cache_key, None)  # Using pop to remove the cache key if it exists
        logging.info(f"Invalidated cache for session: {session_id}")

    def _get_cache_key(self, session_id: str, query: str) -> str:
        return f"{session_id}:{hashlib.md5(query.encode()).hexdigest()}"

    async def analyze_performance(self) -> Dict[str, Any]:
        total_points = self.client.count(collection_name=self.mind_name).count  # Access the count attribute
        mind_info = self.client.get_mind(self.mind_name)
        return {
            "total_points": total_points,  # Now this returns the correct integer value
            "vector_size": mind_info.config.params.vectors.size,
            "index_type": mind_info.config.hnsw_config.ef_construct,
            "storage_type": mind_info.config.wal,
        }

    async def optimize_index(self):
        await self.client.update_mind(
            mind_name=self.mind_name,
            optimizer_config={
                "indexing_threshold": 20000,
                "memmap_threshold": 50000
            }
        )

    async def semantic_search(self, query: str, filter_conditions: Dict[str, Any] = None, top_k: int = 10) -> List[Dict[str, Any]]:
        query_vector = self.model.encode(query).tolist()
        search_params = SearchParams(hnsw_ef=128, exact=False)
        
        if filter_conditions:
            query_filter = Filter(
                must=[FieldCondition(key=k, match={"value": v}) for k, v in filter_conditions.items()]
            )
        else:
            query_filter = None

        results = await self.client.search(
            mind_name=self.mind_name,
            query_vector=query_vector,
            query_filter=query_filter,
            limit=top_k,
            search_params=search_params
        )
        return [self._format_result(hit) for hit in results]

    async def export_data(self, file_path: str):
        all_points = []
        offset = 0
        limit = 1000
        while True:
            batch = await self.client.scroll(
                mind_name=self.mind_name,
                offset=offset,
                limit=limit,
                with_payload=True,
                with_vectors=True
            )
            if not batch[0]:
                break
            all_points.extend(batch[0])
            offset += limit

        with open(file_path, 'w') as f:
            json.dump([{
                "id": point.id,
                "payload": point.payload,
                "vector": point.vector
            } for point in all_points], f)

    async def import_data(self, file_path: str):
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        points = [
            PointStruct(id=item['id'], payload=item['payload'], vector=item['vector'])
            for item in data
        ]
        
        await self.client.upsert(
            mind_name=self.mind_name,
            points=points
        )

# Knowledge instantiation
Knowledge = Memory("Mind")

# Exposed asynchronous functions
async def create_memory(session_id: str, role: str, content: str, visual_data: Union[str, None] = None,
                        objective_id: str = None, discovery_id: str = None, iteration_id: str = None,
                        task_id: str = None, relevance_tags: List[str] = None, core_intent: str = None) -> None:
    await Knowledge.create_memory(session_id, role, content, visual_data, objective_id, discovery_id, iteration_id, task_id, relevance_tags, core_intent)

async def get_relevant_context(session_id: str, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    return await Knowledge.recall_memory(session_id, query, top_k)

async def get_context_window(session_id: str) -> List[Dict[str, Any]]:
    return await Knowledge.get_context_window(session_id)

async def delete_session_data(session_id: str):
    await Knowledge.delete_session_data(session_id)

async def analyze_performance() -> Dict[str, Any]:
    return await Knowledge.analyze_performance()

async def optimize_index():
    await Knowledge.optimize_index()

async def semantic_search(query: str, filter_conditions: Dict[str, Any] = None, top_k: int = 10) -> List[Dict[str, Any]]:
    return await Knowledge.semantic_search(query, filter_conditions, top_k)

async def export_data(file_path: str):
    await Knowledge.export_data(file_path)

async def import_data(file_path: str):
    await Knowledge.import_data(file_path)

# Synchronous wrapper functions for non-async code
def run_async(coroutine):
    try:
        return asyncio.run(coroutine)
    except RuntimeError:
        loop = asyncio.get_event_loop()
        return loop.run_until_complete(coroutine)

def sync_create_memory(session_id: str, role: str, content: str, visual_data: Union[str, None] = None,
                       objective_id: str = None, discovery_id: str = None, iteration_id: str = None,
                       task_id: str = None, relevance_tags: List[str] = None, core_intent: str = None) -> None:
    asyncio.run(create_memory(session_id, role, content, visual_data, objective_id, discovery_id, iteration_id, task_id, relevance_tags, core_intent))

def sync_get_relevant_context(session_id: str, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    return run_async(Knowledge.recall_memory(session_id, query, top_k))

def sync_get_context_window(session_id: str) -> List[Dict[str, Any]]:
    return run_async(Knowledge.get_context_window(session_id))

def sync_delete_session_data(session_id: str):
    asyncio.run(delete_session_data(session_id))

def sync_analyze_performance() -> Dict[str, Any]:
    return asyncio.run(analyze_performance())

def sync_optimize_index():
    asyncio.run(optimize_index())

def sync_semantic_search(query: str, filter_conditions: Dict[str, Any] = None, top_k: int = 10) -> List[Dict[str, Any]]:
    return asyncio.run(semantic_search(query, filter_conditions, top_k))

def sync_export_data(file_path: str):
    asyncio.run(export_data(file_path))

def sync_import_data(file_path: str):
    asyncio.run(import_data(file_path))