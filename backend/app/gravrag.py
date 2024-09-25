import time
import uuid
from typing import List, Dict, Any, Optional
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, Filter, FieldCondition

# Gravitational Constants
GRAVITATIONAL_THRESHOLD = 1e-5
memory_relationships = {}  # To track frequently recalled memory pairs for memetic similarity

def calculate_cosine_similarity(vector_a: List[float], vector_b: List[float]) -> float:
    """Calculate cosine similarity between two vectors."""
    dot_product = sum(a * b for a, b in zip(vector_a, vector_b))
    magnitude_a = sum(a ** 2 for a in vector_a) ** 0.5
    magnitude_b = sum(b ** 2 for b in vector_b) ** 0.5
    if magnitude_a == 0 or magnitude_b == 0:
        return 0.0
    return dot_product / (magnitude_a * magnitude_b)

def update_memetic_similarity(memory_id: str, related_memory_id: str) -> int:
    """Update memetic similarity based on frequently recalled memories."""
    if memory_id not in memory_relationships:
        memory_relationships[memory_id] = {}

    if related_memory_id in memory_relationships[memory_id]:
        memory_relationships[memory_id][related_memory_id] += 1
    else:
        memory_relationships[memory_id][related_memory_id] = 1

    return memory_relationships[memory_id][related_memory_id]

class MemoryPacket:
    def __init__(self, vector: List[float], metadata: Dict[str, Any]):
        self.vector = vector  # Memory vector representation
        self.metadata = metadata  # Metadata (json-like structure)
        
        # Add a uuidv1 timestamp to metadata by default if not provided
        self.metadata.setdefault("timestamp", uuid.uuid1().time)

        # Initialize important fields
        self.metadata.setdefault("recall_count", 0)  # Tracks access frequency
        self.metadata.setdefault("memetic_similarity", 1.0)  # Default similarity score
        self.metadata.setdefault("semantic_relativity", 1.0)  # Default relativity score
        self.metadata.setdefault("gravitational_pull", 1.0)  # Initialized pull
        self.metadata.setdefault("spacetime_coordinate", self.calculate_spacetime_coordinate())  # Initialized spacetime coord

    def calculate_gravitational_pull(self) -> float:
        """Calculate gravitational pull based on semantic relativity, recall count, and memetic similarity."""
        vector_magnitude = sum([x ** 2 for x in self.vector]) ** 0.5  # Vector magnitude
        recall_count = self.metadata["recall_count"]
        memetic_similarity = self.metadata["memetic_similarity"]
        semantic_relativity = self.metadata["semantic_relativity"]
        
        gravitational_pull = vector_magnitude * (1 + recall_count / 10) * memetic_similarity * semantic_relativity
        self.metadata["gravitational_pull"] = gravitational_pull
        
        return gravitational_pull

    def calculate_spacetime_coordinate(self) -> float:
        """Calculate a spacetime coordinate for memory relevance based on gravitational pull and time decay."""
        time_decay_factor = 1 + (time.time() - self.metadata.get("timestamp", time.time()))  # Time decay
        return self.metadata["gravitational_pull"] / time_decay_factor  # Space-time relevance coordinate

    def update_relevance(self, query_vector: List[float], memory_id: str, related_memory_id: Optional[str] = None):
        """Update the relevance of the memory based on the new query."""
        # Update semantic similarity based on query
        self.metadata["semantic_relativity"] = calculate_cosine_similarity(self.vector, query_vector)

        # Optionally update memetic similarity if a related memory is involved
        if related_memory_id:
            self.metadata["memetic_similarity"] = update_memetic_similarity(memory_id, related_memory_id)

        # Recalculate gravitational pull
        self.calculate_gravitational_pull()
        self.metadata["spacetime_coordinate"] = self.calculate_spacetime_coordinate()

    def to_payload(self) -> Dict[str, Any]:
        """Convert memory packet to dictionary (JSON-like structure) for database storage."""
        return {
            "vector": self.vector,
            "metadata": self.metadata
        }

    @staticmethod
    def from_payload(payload: Dict[str, Any]):
        """Create a MemoryPacket from a stored payload."""
        return MemoryPacket(payload["vector"], payload["metadata"])

class GravityRAGService:
    def __init__(self, mind_name: str = "Mind", max_entries: int = 1000000):
        self.client = QdrantClient(host="localhost", port=6333)
        self.mind_name = mind_name
        self.max_entries = max_entries

    async def create_memory(self, vector: List[float], metadata: Dict[str, Any]):
        """Create and store a memory packet in the database."""
        memory_packet = MemoryPacket(vector, metadata)
        await self.client.upsert(
            collection_name=self.mind_name,
            points=[PointStruct(id=str(uuid.uuid4()), vector=memory_packet.vector, payload=memory_packet.to_payload())]
        )

    async def recall_memory(self, query_vector: List[float], session_id: Optional[str] = None, top_k: int = 5) -> List[Dict[str, Any]]:
        """Recall memories that are most relevant to the query vector."""
        query_filter = None
        if session_id:
            query_filter = Filter(must=[FieldCondition(key="metadata.session_id", match={"value": session_id})])

        results = await self.client.search(
            collection_name=self.mind_name,
            query_vector=query_vector,
            query_filter=query_filter,
            limit=top_k
        )

        memory_packets = [MemoryPacket.from_payload(hit.payload) for hit in results]

        for memory in memory_packets:
            # Increment recall count
            memory.metadata["recall_count"] += 1

            # Update relevance factors
            memory.update_relevance(query_vector, memory.metadata.get("memory_id"))

            # Update memory in the database
            await self.client.upsert(
                collection_name=self.mind_name,
                points=[PointStruct(id=str(uuid.uuid4()), vector=memory.vector, payload=memory.to_payload())]
            )

        # Sort memories by spacetime coordinate
        sorted_memories = sorted(memory_packets, key=lambda x: x.metadata["spacetime_coordinate"], reverse=True)

        return [{"metadata": memory.metadata, "vector": memory.vector} for memory in sorted_memories]

    async def delete_session_data(self, session_id: str):
        """Delete memories associated with a specific session."""
        await self.client.delete(
            collection_name=self.mind_name,
            points_selector=Filter(must=[FieldCondition(key="metadata.session_id", match={"value": session_id})])
        )

    async def optimize_index(self):
        """Optimize the index for performance."""
        await self.client.update_collection(self.mind_name, optimizer_config={"indexing_threshold": 20000, "memmap_threshold": 50000})

# Knowledge service instantiation (singleton-like)
Knowledge = GravityRAGService()
