import pytest
from fastapi.testclient import TestClient
from app.main import app
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = TestClient(app)

@pytest.fixture
def mock_memory_manager(mocker):
    return mocker.patch('app.services.gravrag.MemoryManager')

# Test for creating a memory
def test_create_memory(mock_memory_manager):
    mock_memory_manager.return_value.create_memory.return_value = None

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

# Test for creating another memory
def test_create_memory_2(mock_memory_manager):
    mock_memory_manager.return_value.create_memory.return_value = None

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

# Test for invalid memory creation
def test_create_invalid_memory(mock_memory_manager):
    payload = {"content": ""}  # Empty content

    response = client.post("/gravrag/create_memory", json=payload)
    logger.info(f"Create Invalid Memory Response: {response.status_code}")
    assert response.status_code == 400
    assert response.json() == {"detail": "Content cannot be empty."}

# Test for recalling memory
def test_recall_memory(mock_memory_manager):
    mock_memory_manager.return_value.recall_memory.return_value = [
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

    payload = {"query": "test memory", "top_k": 3}
    response = client.post("/gravrag/recall_memory", json=payload)
    logger.info(f"Recall Memory Response: {response.status_code}")
    assert response.status_code == 200
    assert "memories" in response.json()

# Test for memory pruning
def test_prune_memories(mock_memory_manager):
    mock_memory_manager.return_value.prune_memories.return_value = None

    response = client.post("/gravrag/prune_memories", json={})
    logger.info(f"Prune Memories Response: {response.status_code}")
    assert response.status_code == 200
    assert response.json() == {"message": "Memory pruning completed successfully"}

# Test for memory recall using metadata
def test_recall_memory_with_metadata(mock_memory_manager):
    mock_memory_manager.return_value.recall_memory.return_value = [
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

    payload = {
        "query": "test memory",
        "metadata": {"objective_id": "obj_123", "task_id": "task_123"},
        "top_k": 5
    }
    response = client.post("/gravrag/recall_with_metadata", json=payload)
    logger.info(f"Recall with Metadata Response: {response.status_code}")
    assert response.status_code == 200
    assert "memories" in response.json()

# Test for deleting memory by metadata
def test_delete_by_metadata(mock_memory_manager):
    mock_memory_manager.return_value.delete_memories_by_metadata.return_value = None

    payload = {"metadata": {"objective_id": "obj_123", "task_id": "task_123"}}
    response = client.post("/gravrag/delete_by_metadata", json=payload)
    logger.info(f"Delete by Metadata Response: {response.status_code}")
    assert response.status_code == 200
    assert response.json() == {"message": "Memory deletion by metadata completed successfully"}

# Test for purging all memories
def test_purge_memories(mock_memory_manager):
    mock_memory_manager.return_value.purge_all_memories.return_value = None

    response = client.post("/gravrag/purge_memories")
    logger.info(f"Purge Memories Response: {response.status_code}")
    assert response.status_code == 200
    assert response.json() == {"message": "All memories have been purged successfully"}
