
from app.core.config import settings
from app.models.gravrag import MemoryPacket
import time
import math
import uuid
import logging
from typing import List, Dict, Any, Optional
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Gravitational constants and thresholds
GRAVITATIONAL_THRESHOLD = 1e-5  # This can be adjusted based on system requirements

class MemoryPacket:
    def __init__(self, vector: List[float], content: str, metadata: Dict[str, Any]):
        self.vector = vector  # Semantic vector (numeric representation)
        self.content = content  # Original content (human-readable text)
        self.metadata = metadata or {}

        # Metadata defaults
        self.metadata.setdefault("timestamp", time.time())
        self.metadata.setdefault("recall_count", 0)
        self.metadata.setdefault("memetic_similarity", self.calculate_memetic_similarity())
        self.metadata.setdefault("semantic_relativity", 1.0)
        self.metadata.setdefault("gravitational_pull", self.calculate_gravitational_pull())
        self.metadata.setdefault("spacetime_coordinate", self.calculate_spacetime_coordinate())

    def calculate_gravitational_pull(self) -> float:
        """
        Gravitational pull incorporates vector magnitude, recall count, memetic similarity, and semantic relativity.
        """
        vector_magnitude = math.sqrt(sum(x ** 2 for x in self.vector))
        recall_count = self.metadata["recall_count"]
        memetic_similarity = self.metadata["memetic_similarity"]
        semantic_relativity = self.metadata["semantic_relativity"]

        # Dynamically calculate gravitational pull
        gravitational_pull = vector_magnitude * (1 + math.log1p(recall_count)) * memetic_similarity * semantic_relativity
        self.metadata["gravitational_pull"] = gravitational_pull
        return gravitational_pull

    def calculate_spacetime_coordinate(self) -> float:
        """
        Spacetime coordinate is a decaying function of gravitational pull and time.
        """
        time_decay_factor = 1 + (time.time() - self.metadata.get("timestamp", time.time()))
        spacetime_coordinate = self.metadata["gravitational_pull"] / time_decay_factor
        self.metadata["spacetime_coordinate"] = spacetime_coordinate
        return spacetime_coordinate

    def update_relevance(self, query_vector: List[float]):
        """
        Update relevance when recalling a memory. This recalculates semantic relativity, memetic similarity,
        gravitational pull, and spacetime coordinate.
        """
        # Recalculate semantic similarity with the query vector (cosine similarity)
        self.metadata["semantic_relativity"] = self.calculate_cosine_similarity(self.vector, query_vector)

        # Recalculate memetic similarity based on dynamic contextual information
        self.metadata["memetic_similarity"] = self.calculate_memetic_similarity()

        # Update gravitational pull and spacetime coordinate
        self.calculate_gravitational_pull()
        self.calculate_spacetime_coordinate()

    def calculate_memetic_similarity(self) -> float:
        """
        Dynamically calculate memetic similarity based on tags, recurrence, or any other contextual factors.
        This example uses a simple Jaccard similarity between tags, but it can be extended with more complex logic.
        """
        if "tags" not in self.metadata:
            return 1.0  # Default if no tags are present

        # Example: Jaccard similarity between tags and reference tags
        tags = set(self.metadata.get("tags", []))
        reference_tags = set(self.metadata.get("reference_tags", []))  # Reference memory or system-level tags

        if not tags or not reference_tags:
            return 1.0  # No tags to compare, assume full similarity

        intersection = len(tags.intersection(reference_tags))
        union = len(tags.union(reference_tags))

        if union == 0:
            return 1.0  # Avoid division by zero

        return intersection / union  # Jaccard similarity as a placeholder for memetic similarity

    @staticmethod
    def calculate_cosine_similarity(vector_a: List[float], vector_b: List[float]) -> float:
        """ Calculate cosine similarity between two vectors. """
        dot_product = sum(a * b for a, b in zip(vector_a, vector_b))
        magnitude_a = math.sqrt(sum(a ** 2 for a in vector_a))
        magnitude_b = math.sqrt(sum(b ** 2 for b in vector_b))

        if magnitude_a == 0 or magnitude_b == 0:
            return 0.0  # Avoid division by zero

        return dot_product / (magnitude_a * magnitude_b)

    def to_payload(self) -> Dict[str, Any]:
        """
        Convert the memory packet to a Qdrant-compatible payload for storage.
        Store the vector and content separately.
        """
        return {
            "vector": self.vector,  # Correctly storing the vector here
            "content": self.content,  # Storing the original content here
            "metadata": self.metadata
        }

    @staticmethod
    def from_payload(payload: Dict[str, Any]):
        """ Recreate a MemoryPacket from a payload, ensuring 'content' is handled correctly. """
        vector = payload.get("vector")
        content = payload.get("content", "")  # Ensure content is present, or provide a default value
        metadata = payload.get("metadata", {})
        
        # Raise an error if vector is missing, as it is essential for MemoryPacket
        if not vector:
            raise ValueError("Vector data is missing in payload")
        
        return MemoryPacket(vector=vector, content=content, metadata=metadata)


class MemoryManager:
    def __init__(self, qdrant_host="localhost", qdrant_port=6333, collection_name="Mind"):
        self.qdrant_client = QdrantClient(host=qdrant_host, port=qdrant_port)
        self.collection_name = collection_name
        self.model = SentenceTransformer('all-MiniLM-L6-v2')  # Semantic vector model
        self._setup_collection()

    def _setup_collection(self):
        """
        Ensure that the Qdrant collection is set up for vectors with cosine distance.
        """
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
        """
        Create a memory from content, vectorize it, and store in Qdrant asynchronously.
        """
        vector = self.model.encode(content).tolist()
        memory_packet = MemoryPacket(vector=vector, content=content, metadata=metadata)
        point_id = str(uuid.uuid4())
        
        # Insert the memory packet into the Qdrant collection
        self.qdrant_client.upsert(
            collection_name=self.collection_name,
            points=[PointStruct(id=point_id, vector=vector, payload=memory_packet.to_payload())]
        )
        logger.info(f"Memory created successfully with ID: {point_id}")

    async def recall_memory(self, query_content: str, top_k: int = 5):
        """ Recall a memory based on query content and return the original content along with metadata. """
        query_vector = self.model.encode(query_content).tolist()

        # Perform semantic search with Qdrant (using the query vector and top_k limit)
        results = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=top_k
        )

        # Recreate MemoryPacket objects from the search results
        memories = [MemoryPacket.from_payload(hit.payload) for hit in results]

        # Update relevance for each memory
        for memory in memories:
            memory.update_relevance(query_vector)

        # Rank memories based on combined relevance factors
        ranked_memories = sorted(
            memories,
            key=lambda mem: (
                mem.metadata['semantic_relativity'] * mem.metadata['memetic_similarity'] * mem.metadata['gravitational_pull']
            ),
            reverse=True
        )

        # Return original content and metadata for top K results
        return [{
            "content": memory.content,  # Return the original content
            "metadata": memory.metadata
        } for memory in ranked_memories[:top_k]]

    async def prune_memories(self):
        """
        Prune low relevance memories based on their gravitational pull and spacetime coordinates.
        """
        total_points = self.qdrant_client.count(self.collection_name).count
        if total_points > 1000000:  # Arbitrary limit
            points = self.qdrant_client.scroll(self.collection_name, limit=1000)
            low_relevance_points = [
                p.id for p in points if p.payload['metadata']['gravitational_pull'] < GRAVITATIONAL_THRESHOLD
            ]
            if low_relevance_points:
                self.qdrant_client.delete(self.collection_name, points_selector=low_relevance_points)
    
    async def purge_all_memories(self):
        """
        Deletes all memories from the Qdrant collection.
        """
        try:
            # Delete the entire collection (and all memories within it)
            self.qdrant_client.delete_collection(self.collection_name)
            
            # Re-create the collection after purging
            self._setup_collection()
            logger.info(f"Purged all memories in the collection '{self.collection_name}'.")
        except Exception as e:
            logger.error(f"Error purging all memories: {str(e)}")
            raise e

    async def recall_memory_with_metadata(self, query_content: str, search_metadata: Dict[str, Any], top_k: int = 10):
        """
        Recall memories based on query content, and further filter by matching metadata.
        """
        try:
            # Step 1: Vector search for the top K most relevant memories based on semantic similarity
            query_vector = self.model.encode(query_content).tolist()
            results = self.qdrant_client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=top_k
            )

            # Step 2: Recreate MemoryPacket objects from the search results
            memories = [MemoryPacket.from_payload(hit.payload) for hit in results]

            # Step 3: Filter the top K results based on metadata
            matching_memories = []
            for memory in memories:
                memory_metadata = memory.metadata

                # Check if all search metadata keys/values match the memory metadata
                if all(memory_metadata.get(key) == value for key, value in search_metadata.items()):
                    matching_memories.append({
                        "content": memory.content,
                        "metadata": memory_metadata
                    })

            if not matching_memories:
                return {"message": "No matching memories found"}

            return {"memories": matching_memories}
        
        except Exception as e:
            logger.error(f"Error recalling memories by metadata: {str(e)}")
            raise e


    async def delete_memories_by_metadata(self, metadata: Dict[str, Any]):
        """
        Delete memories where the metadata matches the given metadata criteria.
        """
        try:
            # Scroll through all memories in the collection
            scroll_result = self.qdrant_client.scroll(self.collection_name, limit=1000)

            # Check if result is a list of points, otherwise handle it as a tuple
            if isinstance(scroll_result, tuple):
                points = scroll_result[0]
            else:
                points = scroll_result
            
            # List to store the IDs of memories to be deleted
            memories_to_delete = []
            
            for point in points:
                if isinstance(point, dict) and 'payload' in point:
                    point_metadata = point['payload']['metadata']
                    
                    # Check if the point's metadata matches the provided metadata
                    if all(point_metadata.get(key) == value for key, value in metadata.items()):
                        memories_to_delete.append(point["id"])
            
            # Delete the memories that match the metadata criteria
            if memories_to_delete:
                self.qdrant_client.delete(self.collection_name, points_selector=memories_to_delete)
                logger.info(f"Deleted {len(memories_to_delete)} memories matching the metadata.")
            else:
                logger.info("No memories found matching the specified metadata.")
        except Exception as e:
            logger.error(f"Error deleting memories by metadata: {str(e)}")
            raise e

memory_manager = MemoryManager()