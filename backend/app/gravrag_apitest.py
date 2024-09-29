import requests
import json

BASE_URL = "http://localhost:8000"

def test_create_memory():
    payload = {
        "content": "This is a test memory", 
        "metadata": {"objective_id": "obj_123", "task_id": "task_123"}
    }
    response = requests.post(f"{BASE_URL}/gravrag/create_memory", json=payload)
    assert response.status_code == 200, "Failed to create memory"
    print(f"Create Memory Status: {response.status_code}")
    print(f"Response: {response.json()}")

def test_create_invalid_memory():
    payload = {"content": ""}
    response = requests.post(f"{BASE_URL}/gravrag/create_memory", json=payload)
    assert response.status_code == 400, "Invalid memory creation should fail"
    print(f"Invalid Create Memory Status: {response.status_code}")
    print(f"Response: {response.json()}")

def test_recall_memory():
    # Assuming the test memory exists
    payload = {
        "query": "test",
        "top_k": 3
    }
    response = requests.post(f"{BASE_URL}/gravrag/recall_memory", json=payload)
    assert response.status_code == 200, "Failed to recall memory"
    
    data = response.json()
    assert "memories" in data, "No memories found in the response"
    
    for memory in data["memories"]:
        assert "gravitational_pull" in memory, "Memory does not contain gravitational pull"
        assert "recall_count" in memory, "Memory does not contain recall count"
    
    print(f"Recall Memory Status: {response.status_code}")
    print(f"Response: {json.dumps(data, indent=2)}")

def test_prune_memories():
    response = requests.post(f"{BASE_URL}/gravrag/prune_memories", json={})
    assert response.status_code == 200, "Failed to prune memories"
    print(f"Prune Memories Status: {response.status_code}")
    print(f"Response: {response.json()}")

def main():
    print("Starting GravRAG API tests...")
    
    # Test creating a memory
    test_create_memory()
    
    # Test creating invalid memory (empty content)
    test_create_invalid_memory()
    
    # Test recalling memories
    test_recall_memory()
    
    # Test pruning memories
    test_prune_memories()

if __name__ == "__main__":
    main()
