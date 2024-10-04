import requests
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = "http://localhost:8000/gravrag"

def test_create_memory():
    payload = {
        "content": "This is a test memory",
        "metadata": {
            "objective_id": "obj_123", 
            "task_id": "task_123", 
            "tags": ["test", "example"]
        }
    }
    response = requests.post(f"{BASE_URL}/create_memory", json=payload)
    
    logger.info(f"Create Memory Response: {response.status_code}")
    logger.info(f"Response Content: {response.content}")
    assert response.status_code == 200, f"Failed to create memory. Status Code: {response.status_code}"
    logger.info("Memory created successfully.")

def test_create_memory_2():
    payload = {
        "content": "This is another test memory",
        "metadata": {
            "objective_id": "obj_567", 
            "task_id": "task_567", 
            "tags": ["test", "example"]
        }
    }
    response = requests.post(f"{BASE_URL}/create_memory", json=payload)
    
    logger.info(f"Create Memory 2 Response: {response.status_code}")
    logger.info(f"Response Content: {response.content}")
    assert response.status_code == 200, f"Failed to create memory. Status Code: {response.status_code}"
    logger.info("Memory 2 created successfully.")

def test_create_memory_3():
    payload = {
        "content": "This is yet another test memory",
        "metadata": {
            "objective_id": "obj_789", 
            "task_id": "task_789", 
            "tags": ["test", "example"]
        }
    }
    response = requests.post(f"{BASE_URL}/create_memory", json=payload)
    
    logger.info(f"Create Memory 3 Response: {response.status_code}")
    logger.info(f"Response Content: {response.content}")
    assert response.status_code == 200, f"Failed to create memory. Status Code: {response.status_code}"
    logger.info("Memory 3 created successfully.")

def test_create_invalid_memory():
    payload = {"content": ""}  # Empty content, should fail
    response = requests.post(f"{BASE_URL}/create_memory", json=payload)
    
    logger.info(f"Create Invalid Memory Response: {response.status_code}")
    logger.info(f"Response Content: {response.content}")
    assert response.status_code == 400, f"Expected 400, but got {response.status_code}"
    logger.info("Invalid memory creation test passed (empty content rejected).")

def test_recall_memory():
    payload = {
        "query": "test memory",
        "top_k": 3
    }
    response = requests.post(f"{BASE_URL}/recall_memory", json=payload)
    
    logger.info(f"Recall Memory Response: {response.status_code}")
    logger.info(f"Response Content: {response.content}")
    assert response.status_code == 200, f"Failed to recall memory. Status Code: {response.status_code}"

    data = response.json()
    assert "memories" in data, "No memories found in the response"
    for memory in data["memories"]:
        assert "content" in memory, "Memory does not contain original content"
        assert "metadata" in memory, "Memory does not contain metadata"
    
    logger.info("Memory recall successful.")
    logger.info(f"Recalled Memories: {json.dumps(data, indent=2)}")

def test_prune_memories():
    response = requests.post(f"{BASE_URL}/prune_memories", json={})
    
    logger.info(f"Prune Memories Response: {response.status_code}")
    logger.info(f"Response Content: {response.content}")
    assert response.status_code == 200, f"Failed to prune memories. Status Code: {response.status_code}"
    logger.info("Memory pruning successful.")

def test_purge_memories():
    response = requests.post(f"{BASE_URL}/purge_memories")
    
    logger.info(f"Purge Memories Response: {response.status_code}")
    logger.info(f"Response Content: {response.content}")
    assert response.status_code == 200, f"Failed to purge all memories. Status Code: {response.status_code}"
    logger.info("Memory purge successful.")

def test_recall_memory_with_metadata():
    # Define query and metadata for recall
    payload = {
        "query": "test memory",
        "metadata": {
            "objective_id": "obj_123",
            "task_id": "task_123"
        },
        "top_k": 5  # Retrieve the top 5 most relevant memories based on vector similarity
    }

    response = requests.post(f"{BASE_URL}/recall_with_metadata", json=payload)

    # Log and check status
    logger.info(f"Recall with Metadata Response: {response.status_code}")
    logger.info(f"Response Content: {response.content}")

    assert response.status_code == 200, f"Failed to recall memories with metadata. Status Code: {response.status_code}"

    data = response.json()
    assert "memories" in data, "No memories found in the response"
    assert len(data["memories"]) > 0, "No matching memories found"
    
    logger.info("Memory recall with metadata successful.")
    logger.info(f"Matching Memories: {json.dumps(data, indent=2)}")

def test_delete_by_metadata():
    payload = {
        "metadata": {
            "objective_id": "obj_123",
            "task_id": "task_123"
        }
    }
    response = requests.post(f"{BASE_URL}/delete_by_metadata", json=payload)
    
    logger.info(f"Delete by Metadata Response: {response.status_code}")
    logger.info(f"Response Content: {response.content}")
    assert response.status_code == 200, f"Failed to delete memories by metadata. Status Code: {response.status_code}"
    logger.info("Memory deletion by metadata successful.")

def main():
    logger.info("Starting GravRAG API tests...")

    try:
        test_create_memory()
    except Exception as e:
        logger.error(f"Error in test_create_memory: {e}")

    try:
        test_create_memory_2()
    except Exception as e:
        logger.error(f"Error in test_create_memory_2: {e}")

    try:
        test_create_memory_3()
    except Exception as e:
        logger.error(f"Error in test_create_memory_3: {e}")

    try:
        test_create_invalid_memory()
    except Exception as e:
        logger.error(f"Error in test_create_invalid_memory: {e}")

    try:
        test_recall_memory()
    except Exception as e:
        logger.error(f"Error in test_recall_memory: {e}")

    try:
        test_prune_memories()
    except Exception as e:
        logger.error(f"Error in test_prune_memories: {e}")

    try:
        test_recall_memory_with_metadata()
    except Exception as e:
        logger.error(f"Error in test_recall_memory_with_metadata: {e}")

    try:
        test_delete_by_metadata()
    except Exception as e:
        logger.error(f"Error in test_delete_by_metadata: {e}")

    try:
        test_purge_memories()
    except Exception as e:
        logger.error(f"Error in test_purge_memories: {e}")

if __name__ == "__main__":
    main()
