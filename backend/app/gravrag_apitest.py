import requests

BASE_URL = "http://localhost:8000"

def test_create_memory():
    """
    Test the creation of a memory in the GravRAG system.
    """
    # Test valid memory creation
    response = requests.post(
        f"{BASE_URL}/gravrag/create_memory",
        json={
            "content": "This is a test memory involving gravitational pull.",
            "metadata": {"objective_id": "grav_obj", "task_id": "grav_task"}
        }
    )
    print(f"Create Memory Status: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 200, "Failed to create memory"
    assert response.json().get("message") == "Memory created successfully", "Unexpected response message"

    # Test invalid memory creation (empty content)
    response = requests.post(
        f"{BASE_URL}/gravrag/create_memory",
        json={"content": "", "metadata": {}}
    )
    print(f"Invalid Create Memory Status: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 400, "Empty content should return a 400 error"
    assert response.json().get("detail") == "Content cannot be empty.", "Expected error message not returned"

def test_recall_memory():
    """
    Test the recall of memories in the GravRAG system.
    """
    # Pre-condition: Ensure there is a memory to recall
    recall_payload = {"query": "gravitational", "top_k": 3}
    
    response = requests.post(f"{BASE_URL}/gravrag/recall_memory", json=recall_payload)
    print(f"Recall Memory Status: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 200, "Failed to recall memory"
    assert "memories" in response.json(), "Response missing 'memories' key"
    
    memories = response.json().get("memories")
    assert len(memories) > 0, "No memories were returned"
    print(f"Memories recalled: {memories}")

def main():
    """
    Main function to run all GravRAG API tests.
    """
    print("Starting GravRAG API tests...")
    
    # Test memory creation
    test_create_memory()

    # Test valid memory recall
    test_recall_memory()

    print("GravRAG API tests completed.")

if __name__ == "__main__":
    main()
