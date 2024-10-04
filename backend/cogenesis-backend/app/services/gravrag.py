
import time
import math
import uuid
import logging
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

from app.core.config import settings
from app.models.gravrag import MemoryPacket

logger = logging.getLogger(__name__)

GRAVITATIONAL_THRESHOLD = 1e-5

class MemoryManager:
    def __init__(self):
        self.qdrant_client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)
        self.collection_name = "Mind"
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self._setup_collection()

    def _setup_collection(self):
        try:
            self.qdrant_client.get_collection(self.collection_name)
            logger.info(f"Collection '{self.collection_name}' exists.")
        except Exception:
            logger.info(f"Creating collection '{self.collection_name}'.")
            self.qdrant_client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=self.model.get_sentence_embedding_dimension(), distance=Distance.COSINE)
            )

    async def create_memory(self, content: str, metadata: Dict[str, Any]):
        vector = self.model.encode(content).tolist()
        memory_packet = MemoryPacket(vector=vector, metadata=metadata)
        point_id = str(uuid.uuid4())

        self.qdrant_client.upsert(
            collection_name=self.collection_name,
            points=[PointStruct(id=point_id, vector=vector, payload=memory_packet.dict())]
        )
        logger.info(f"Memory created successfully with ID: {point_id}")

    async def recall_memory(self, query_content: str, top_k: int = 5):
        query_vector = self.model.encode(query_content).tolist()

        results = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=top_k
        )

        memories = [MemoryPacket(**hit.payload) for hit in results]

        for memory in memories:
            self._update_relevance(memory, query_vector)

        return [memory.metadata for memory in memories]

    def _update_relevance(self, memory: MemoryPacket, query_vector: List[float]):
        memory.metadata["semantic_relativity"] = self._calculate_cosine_similarity(memory.vector, query_vector)
        memory.metadata["memetic_similarity"] = self._calculate_memetic_similarity(memory.metadata)
        memory.metadata["gravitational_pull"] = self._calculate_gravitational_pull(memory)
        memory.metadata["spacetime_coordinate"] = self._calculate_spacetime_coordinate(memory)

    @staticmethod
    def _calculate_cosine_similarity(vector_a: List[float], vector_b: List[float]) -> float:
        dot_product = sum(a * b for a, b in zip(vector_a, vector_b))
        magnitude_a = math.sqrt(sum(a ** 2 for a in vector_a))
        magnitude_b = math.sqrt(sum(b ** 2 for b in vector_b))

        if magnitude_a == 0 or magnitude_b == 0:
            return 0.0

        return dot_product / (magnitude_a * magnitude_b)

    @staticmethod
    def _calculate_memetic_similarity(metadata: Dict[str, Any]) -> float:
        tags = set(metadata.get("tags", []))
        reference_tags = set(metadata.get("reference_tags", []))

        if not tags or not reference_tags:
            return 1.0

        intersection = len(tags.intersection(reference_tags))
        union = len(tags.union(reference_tags))

        return intersection / union if union > 0 else 1.0

    @staticmethod
    def _calculate_gravitational_pull(memory: MemoryPacket) -> float:
        vector_magnitude = math.sqrt(sum(x ** 2 for x in memory.vector))
        recall_count = memory.metadata.get("recall_count", 0)
        memetic_similarity = memory.metadata.get("memetic_similarity", 1.0)
        semantic_relativity = memory.metadata.get("semantic_relativity", 1.0)

        return vector_magnitude * (1 + math.log1p(recall_count)) * memetic_similarity * semantic_relativity

    @staticmethod
    def _calculate_spacetime_coordinate(memory: MemoryPacket) -> float:
        time_decay_factor = 1 + (time.time() - memory.metadata.get("timestamp", time.time()))
        return memory.metadata["gravitational_pull"] / time_decay_factor

    async def prune_memories(self):
        total_points = self.qdrant_client.count(self.collection_name).count
        if total_points > 1000000:  # Arbitrary limit
            points = self.qdrant_client.scroll(self.collection_name, limit=1000)
            low_relevance_points = [
                p.id for p in points if p.payload['metadata']['gravitational_pull'] < GRAVITATIONAL_THRESHOLD
            ]
            if low_relevance_points:
                self.qdrant_client.delete(
                    collection_name=self.collection_name,
                    points_selector={"points": low_relevance_points}
                )
                logger.info(f"Pruned {len(low_relevance_points)} low-relevance memories.")

memory_manager = MemoryManager()