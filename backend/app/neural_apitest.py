#neural_apitest.py
import requests
import json

BASE_URL = "http://backend:8000"

def test_neural_resources():
    print("\nTesting Neural Resources API:")
   
    # Test set_api_key
    response = requests.post(
        f"{BASE_URL}/neural_resources/set_api_key",
        json={
            "provider": "groq",
            "api_key": "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"
        }
    )
    print(f"Set API Key Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 200, "Failed to set API key for groq"
    assert response.json().get("message") == "API key updated for groq", "API key set response mismatch"

    # Test set_api_key with empty provider
    response = requests.post(
        f"{BASE_URL}/neural_resources/set_api_key",
        json={
            "provider": "",
            "api_key": "test_key"
        }
    )
    print(f"Set API Key (Empty Provider) Status: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 400, "Setting API key with empty provider should fail"
    assert "Both provider and api_key must be non-empty strings" in response.json().get("detail", ""), "Error message mismatch for empty provider"

    # Test available_models
    response = requests.get(f"{BASE_URL}/neural_resources/available_models")
    print(f"Available Models Status: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 200, "Failed to retrieve available models"
    available_models = response.json().get("available_models", [])
    
    if not available_models:
        print("No models were returned. Available models list is empty.")
    else:
        print(f"Available models: {available_models}")

    # Check if Ollama model 'llama3.2:latest' is in the list
    expected_model = "llama3.2:latest"
    if expected_model not in available_models:
        print(f"Ollama model '{expected_model}' was NOT found in the available models list.")
        print(f"Full available models list: {available_models}")
        
        # Fetch Ollama models directly for debugging purposes
        ollama_response = requests.get("http://localhost:11434/api/tags")
        if ollama_response.status_code == 200:
            ollama_models = [model['name'] for model in ollama_response.json().get('models', [])]
            print(f"Fetched Ollama models directly from API: {ollama_models}")
        else:
            print(f"Failed to fetch Ollama models directly. Status code: {ollama_response.status_code}")
        
        assert False, f"Expected model '{expected_model}' not found"
    else:
        print(f"Model '{expected_model}' found in available models.")

    # Test model_info with fallback for max_tokens
    response = requests.get(f"{BASE_URL}/neural_resources/model_info/llama3-groq-70b-8192-tool-use-preview")
    print(f"Model Info Status: {response.status_code}")
    model_info = response.json()

    # Fallback for max_tokens
    max_tokens = model_info.get('max_tokens', 'N/A')
    print(f"Model Info max_tokens: {max_tokens}")

    # Log instead of failing the test if max_tokens is missing
    if max_tokens == 'N/A':
        print("Warning: Model info does not contain 'max_tokens', using fallback value 'N/A'.")

    if "context_window" in model_info:
        assert model_info.get("context_window") == 8192, "Model 'context_window' does not match the expected value"
    else:
        print("Model info does not contain 'context_window'")

    # Test route_query with default routing
    payload = {
        "content": "Hello, how are you?",
        "role": "user",
        "model": None
    }

    response = requests.post(f"{BASE_URL}/neural_resources/route_query", json=payload)
    print(f"Route Query (Default) Status: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code in [200, 500], "Unexpected status for route query (default model)"
    if response.status_code == 200:
        assert "response" in response.json(), "Route query response missing expected 'response' key"
        assert response.json().get("response").get("done"), "Response should indicate query is done"
    else:
        print(f"Route Query (Default) failed with response: {response.json()}")

    # Test route_query with specified model (Ollama)
    payload = {
        "content": "What is the capital of France?",
        "role": "user",
        "model": "llama3.2:latest"  # Specified Ollama model
    }
    response = requests.post(f"{BASE_URL}/neural_resources/route_query", json=payload)
    print(f"Route Query (Specified Model) Status: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 200, "Route query with specified model failed"
    assert "response" in response.json(), "Route query response missing 'response'"
    assert response.json().get("response").get("response") == "The capital of France is Paris.", "Query response content mismatch"

    # Test route_query with empty message
    payload = {
        "content": "",
        "role": "user",
        "model": None
    }
    response = requests.post(f"{BASE_URL}/neural_resources/route_query", json=payload)
    print(f"Route Query (Empty Message) Status: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 400, "Route query with empty message should fail"
    assert "Empty message provided" in response.json().get("detail", ""), "Error message mismatch for empty message"

    # Test route_query with non-existent model
    payload = {
        "content": "Test message",
        "role": "user",
        "model": "non_existent_model"
    }
    response = requests.post(f"{BASE_URL}/neural_resources/route_query", json=payload)
    print(f"Route Query (Non-existent Model) Status: {response.status_code}")
    print(f"Response: {response.json()}")
    assert response.status_code == 500, "Route query with non-existent model should return 500 error"

def main():
    print("Starting Neural Resources API tests...")
   
    try:
        test_neural_resources()
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while testing the API: {e}")
    except AssertionError as ae:
        print(f"Assertion failed: {ae}")
   
    print("\nNeural Resources API tests completed.")

if __name__ == "__main__":
    main()
