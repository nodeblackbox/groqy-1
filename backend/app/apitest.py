import requests
import json
import os

BASE_URL = "http://localhost:8000"

def test_neural_resources():
    print("\nTesting Neural Resources API:")
   
    # Test set_api_key
    response = requests.post(f"{BASE_URL}/neural_resources/set_api_key", json={"provider": "groq", "api_key": "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"})
    print(f"Set API Key Status: {response.status_code}")
    print(f"Response: {response.json()}")

    # Test set_api_key with empty provider
    response = requests.post(f"{BASE_URL}/neural_resources/set_api_key", json={"provider": "", "api_key": "test_key"})
    print(f"Set API Key (Empty Provider) Status: {response.status_code}")
    print(f"Response: {response.json()}")

    # Test available_models
    response = requests.get(f"{BASE_URL}/neural_resources/available_models")
    print(f"Available Models Status: {response.status_code}")
    print(f"Response: {response.json()}")

    # Test model_info
    response = requests.get(f"{BASE_URL}/neural_resources/model_info/llama3-groq-70b-8192-tool-use-preview")
    print(f"Model Info Status: {response.status_code}")
    print(f"Response: {response.json()}")

    # Test route_query with default routing
    payload = {
        "content": "Hello, how are you?",
        "model": None
    }

    response = requests.post(f"{BASE_URL}/neural_resources/route_query", json=payload)
    print(f"Route Query (Default) Status: {response.status_code}")
    print(f"Response: {response.json()}")

    # Test route_query with specified model (Ollama)
    payload = {
        "content": "What is the capital of France?",
        "model": "llama3.2:latest"  # Assuming this is an available Ollama model
    }
    response = requests.post(f"{BASE_URL}/neural_resources/route_query", json=payload)
    print(f"Route Query (Specified Model) Status: {response.status_code}")
    print(f"Response: {response.json()}")

    # Test route_query with empty message
    payload = {
        "content": "",
        "model": None
    }
    response = requests.post(f"{BASE_URL}/neural_resources/route_query", json=payload)
    print(f"Route Query (Empty Message) Status: {response.status_code}")
    print(f"Response: {response.json()}")

    # Test route_query with non-existent model
    payload = {
        "content": "Test message",
        "model": "non_existent_model"
    }
    response = requests.post(f"{BASE_URL}/neural_resources/route_query", json=payload)
    print(f"Route Query (Non-existent Model) Status: {response.status_code}")
    print(f"Response: {response.json()}")

def test_gravrag():
    print("\nTesting GravRAG API:")
   
    # Test create memory
    response = requests.post(f"{BASE_URL}/gravrag/api/memory/create", json={"content": "This is a test memory", "metadata": {"objective_id": "obj_1", "task_id": "task_1"}})
    print(f"Create Memory Status: {response.status_code}")
    print(f"Response: {response.json()}")

    # Test recall memory
    response = requests.get(f"{BASE_URL}/gravrag/api/memory/recall", params={"query": "test memory"})
    print(f"Recall Memory Status: {response.status_code}")
    print(f"Response: {response.json()}")

    # Test prune memories
    response = requests.post(f"{BASE_URL}/gravrag/api/memory/prune")
    print(f"Prune Memories Status: {response.status_code}")
    print(f"Response: {response.json()}")

def main():
    print("Starting API tests...")
   
    try:
        test_neural_resources()
        test_gravrag()
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while testing the API: {e}")
   
    print("\nAPI tests completed.")

if __name__ == "__main__":
    main()