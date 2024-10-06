import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, patch
from app.main import app
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = TestClient(app)

@pytest.fixture
def mock_memory_manager():
    with patch('app.services.gravrag.memory_manager') as mock:
        yield mock

# Test for creating a memory
def test_create_memory(mock_memory_manager):
    mock_memory_manager.create_memory = AsyncMock()
    
    payload = {
        "content": "This is a test memory",
        "metadata": {
            "objective_id": "obj_123",
            "task_id": "task_123",
            "tags": ["test", "example"]
        }
    }

    response = client.post("/gravrag/create_memory", json=payload)
    logger.info(f"Create Memory Response: {response.status_code}")
    assert response.status_code == 200
    assert response.json() == {"message": "Memory created successfully"}
    mock_memory_manager.create_memory.assert_awaited_once_with(content=payload["content"], metadata=payload["metadata"])

# Test for creating another memory
def test_create_memory_2(mock_memory_manager):
    mock_memory_manager.create_memory = AsyncMock()

    payload = {
        "content": "This is another test memory",
        "metadata": {
            "objective_id": "obj_567",
            "task_id": "task_567",
            "tags": ["test", "example"]
        }
    }

    response = client.post("/gravrag/create_memory", json=payload)
    logger.info(f"Create Memory 2 Response: {response.status_code}")
    assert response.status_code == 200
    assert response.json() == {"message": "Memory created successfully"}
    mock_memory_manager.create_memory.assert_awaited_once_with(content=payload["content"], metadata=payload["metadata"])

# Test for invalid memory creation
def test_create_invalid_memory(mock_memory_manager):
    payload = {"content": ""}  # Empty content

    response = client.post("/gravrag/create_memory", json=payload)
    logger.info(f"Create Invalid Memory Response: {response.status_code}")
    assert response.status_code == 400
    assert response.json() == {"detail": "Content cannot be empty."}

# Test for recalling memory
def test_recall_memory(mock_memory_manager):
    mock_memories = [
        {
            "content": "This is a test memory",
            "metadata": {
                "objective_id": "obj_123",
                "task_id": "task_123",
                "tags": ["test", "example"],
                "gravitational_pull": 0.9,
                "memetic_similarity": 1.0,
                "semantic_relativity": 1.0,
                "timestamp": 1728026867
            }
        }
    ]
    mock_memory_manager.recall_memory = AsyncMock(return_value=mock_memories)

    payload = {"query": "test memory", "top_k": 3}
    response = client.post("/gravrag/recall_memory", json=payload)
    logger.info(f"Recall Memory Response: {response.status_code}")
    assert response.status_code == 200
    assert response.json() == {"memories": mock_memories}
    mock_memory_manager.recall_memory.assert_awaited_once_with(query_content=payload["query"], top_k=payload["top_k"])

# Test for memory pruning
def test_prune_memories(mock_memory_manager):
    mock_memory_manager.prune_memories = AsyncMock()

    response = client.post("/gravrag/prune_memories", json={})
    logger.info(f"Prune Memories Response: {response.status_code}")
    assert response.status_code == 200
    assert response.json() == {"message": "Memory pruning completed successfully"}
    mock_memory_manager.prune_memories.assert_awaited_once()

# Test for memory recall using metadata
def test_recall_memory_with_metadata(mock_memory_manager):
    mock_memories = {
        "memories": [
            {
                "content": "This is a test memory",
                "metadata": {
                    "objective_id": "obj_123",
                    "task_id": "task_123",
                    "tags": ["test", "example"],
                    "gravitational_pull": 1.0,
                    "memetic_similarity": 1.0,
                    "semantic_relativity": 1.0,
                    "timestamp": 1728026867
                }
            }
        ]
    }
    mock_memory_manager.recall_memory_with_metadata = AsyncMock(return_value=mock_memories)

    payload = {
        "query": "test memory",
        "metadata": {"objective_id": "obj_123", "task_id": "task_123"},
        "top_k": 5
    }
    response = client.post("/gravrag/recall_with_metadata", json=payload)
    logger.info(f"Recall with Metadata Response: {response.status_code}")
    assert response.status_code == 200
    assert response.json() == mock_memories
    mock_memory_manager.recall_memory_with_metadata.assert_awaited_once_with(
        query_content=payload["query"],
        search_metadata=payload["metadata"],
        top_k=payload["top_k"]
    )

# Test for deleting memory by metadata
def test_delete_by_metadata(mock_memory_manager):
    mock_memory_manager.delete_memories_by_metadata = AsyncMock()

    payload = {"metadata": {"objective_id": "obj_123", "task_id": "task_123"}}
    response = client.post("/gravrag/delete_by_metadata", json=payload)
    logger.info(f"Delete by Metadata Response: {response.status_code}")
    assert response.status_code == 200
    assert response.json() == {"message": "Memory deletion by metadata completed successfully"}
    mock_memory_manager.delete_memories_by_metadata.assert_awaited_once_with(metadata=payload["metadata"])

# Test for purging all memories
def test_purge_memories(mock_memory_manager):
    mock_memory_manager.purge_all_memories = AsyncMock()

    response = client.post("/gravrag/purge_memories")
    logger.info(f"Purge Memories Response: {response.status_code}")
    assert response.status_code == 200
    assert response.json() == {"message": "All memories have been purged successfully"}
    mock_memory_manager.purge_all_memories.assert_awaited_once()
