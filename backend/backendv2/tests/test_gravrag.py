
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture
def mock_memory_manager(mocker):
    return mocker.patch('app.services.gravrag.MemoryManager')

def test_create_memory(mock_memory_manager):
    response = client.post("/gravrag/create_memory", json={"content": "Test memory", "metadata": {"key": "value"}})
    assert response.status_code == 200
    assert response.json() == {"message": "Memory created successfully"}

def test_recall_memory(mock_memory_manager):
    mock_memory_manager.return_value.recall_memory.return_value = [{"content": "Test memory"}]
    response = client.post("/gravrag/recall_memory", json={"query": "Test query", "top_k": 5})
    assert response.status_code == 200
    assert "memories" in response.json()

def test_prune_memories(mock_memory_manager):
    response = client.post("/gravrag/prune_memories", json={"gravity_threshold": 0.5})
    assert response.status_code == 200
    assert response.json() == {"message": "Memory pruning completed successfully"}