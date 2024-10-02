import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"
OLLAMA_API_URL = "http://localhost:11434/api/tags"

def print_header(title):
    print("\n" + "="*len(title))
    print(title)
    print("="*len(title))

def print_subheader(subtitle):
    print(f"\n--- {subtitle} ---\n")

def print_request_details(method, url, payload=None):
    print(f"**Endpoint:** {method.upper()} {url}")
    if payload:
        print("**Payload:**")
        print(json.dumps(payload, indent=4))
    print("\n")

def print_response_details(response):
    print(f"**Response Status:** {response.status_code}")
    try:
        response_json = response.json()
        print("**Response Body:**")
        print(json.dumps(response_json, indent=4))
    except json.JSONDecodeError:
        print("**Response Body:**")
        print(response.text)
    print("\n" + "-"*50 + "\n")

def fetch_available_models():
    try:
        response = requests.get(OLLAMA_API_URL)
        if response.status_code == 200:
            return [model['name'] for model in response.json().get('models', [])]
        else:
            print(f"**Error:** Failed to fetch Ollama models. Status code: {response.status_code}")
            return []
    except requests.exceptions.RequestException as e:
        print(f"**Network Error:** Could not connect to Ollama API: {e}")
        return []

def test_neural_resources():
    print_header("Neural Resources API Testing")
    print(f"Test Initiated at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # 1. Test set_api_key (Valid Provider)
    print_subheader("1. Setting API Key (Valid Provider)")
    endpoint = f"{BASE_URL}/neural_resources/set_api_key"
    payload = {
        "provider": "groq",
        "api_key": "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"
    }
    print_request_details("POST", endpoint, payload)
    response = requests.post(endpoint, json=payload)
    print_response_details(response)
    
    assert response.status_code == 200, "Failed to set API key for groq"
    assert response.json().get("message") == "API key updated for groq", "API key set response mismatch"

    # 2. Test set_api_key with empty provider
    print_subheader("2. Setting API Key (Empty Provider)")
    payload = {
        "provider": "",
        "api_key": "test_key"
    }
    print_request_details("POST", endpoint, payload)
    response = requests.post(endpoint, json=payload)
    print_response_details(response)
    
    assert response.status_code == 400, "Setting API key with empty provider should fail"
    assert "Both provider and api_key must be non-empty strings" in response.json().get("detail", ""), "Error message mismatch for empty provider"

    # 3. Test available_models
    print_subheader("3. Retrieving Available Models")
    endpoint = f"{BASE_URL}/neural_resources/available_models"
    print_request_details("GET", endpoint)
    response = requests.get(endpoint)
    print_response_details(response)
    
    assert response.status_code == 200, "Failed to retrieve available models"
    available_models = response.json().get("available_models", [])
    
    if not available_models:
        print("**Note:** No models were returned. Available models list is empty.")
    else:
        print(f"**Available Models:** {available_models}")
    
    # Check if expected Ollama model is in the list
    expected_model = "llama3.1:latest"
    if expected_model not in available_models:
        print(f"**Warning:** Ollama model '{expected_model}' was NOT found in the available models list.")
        print(f"**Full Available Models List:** {available_models}")
        
        # Fetch Ollama models directly for debugging purposes
        print_subheader("Fetching Ollama Models Directly for Verification")
        ollama_models = fetch_available_models()
        if ollama_models:
            print(f"**Fetched Ollama Models Directly:** {ollama_models}")
            if expected_model not in ollama_models:
                print(f"**Error:** Expected model '{expected_model}' not found in Ollama models.")
                print("**Action:** Skipping tests related to the missing model.")
                return
        else:
            print("**Error:** Unable to fetch Ollama models directly.")
            print("**Action:** Skipping tests related to the missing model.")
            return
    else:
        print(f"**Success:** Model '{expected_model}' found in available models.")

    # 4. Test model_info with fallback for max_tokens
    print_subheader("4. Retrieving Model Information")
    model_identifier = "llama3-groq-70b-8192-tool-use-preview"
    endpoint = f"{BASE_URL}/neural_resources/model_info/{model_identifier}"
    print_request_details("GET", endpoint)
    response = requests.get(endpoint)
    print_response_details(response)
    
    model_info = response.json()
    max_tokens = model_info.get('max_tokens', 'N/A')
    print(f"**Model Info - max_tokens:** {max_tokens}")
    
    if max_tokens == 'N/A':
        print("**Warning:** Model info does not contain 'max_tokens', using fallback value 'N/A'.")
    
    if "context_window" in model_info:
        assert model_info.get("context_window") == 8192, "Model 'context_window' does not match the expected value"
    else:
        print("**Note:** Model info does not contain 'context_window'.")

    # 5. Test route_query with default routing
    print_subheader("5. Routing Query (Default Model)")
    payload = {
        "content": "Hello, how are you?",
        "role": "user",
        "model": None
    }
    endpoint = f"{BASE_URL}/neural_resources/route_query"
    print_request_details("POST", endpoint, payload)
    response = requests.post(endpoint, json=payload)
    print_response_details(response)
    
    assert response.status_code in [200, 500], "Unexpected status for route query (default model)"
    if response.status_code == 200:
        assert "response" in response.json(), "Route query response missing expected 'response' key"
        assert response.json().get("response").get("done"), "Response should indicate query is done"
    else:
        print(f"**Error:** Route Query (Default) failed with response: {response.json()}")

    # 6. Test route_query with specified model (Ollama)
    print_subheader("6. Routing Query (Specified Model - Ollama)")
    payload = {
        "content": "What is the capital of France?",
        "role": "user",
        "model": "llama3.1:latest"  # Updated to use llama3.1
    }
    print_request_details("POST", endpoint, payload)
    response = requests.post(endpoint, json=payload)
    print_response_details(response)
    
    assert response.status_code == 200, "Route query with specified model failed"
    assert "response" in response.json(), "Route query response missing 'response'"
    expected_response = "The capital of France is Paris."
    actual_response = response.json().get("response", {}).get("response", "")
    assert expected_response in actual_response, f"Query response content mismatch. Expected '{expected_response}' in '{actual_response}'"

    # 7. Test route_query with empty message
    print_subheader("7. Routing Query (Empty Message)")
    payload = {
        "content": "",
        "role": "user",
        "model": None
    }
    print_request_details("POST", endpoint, payload)
    response = requests.post(endpoint, json=payload)
    print_response_details(response)
    
    assert response.status_code == 400, "Route query with empty message should fail"
    assert "Empty message provided" in response.json().get("detail", ""), "Error message mismatch for empty message"

    # 8. Test route_query with non-existent model
    print_subheader("8. Routing Query (Non-existent Model)")
    payload = {
        "content": "Test message",
        "role": "user",
        "model": "non_existent_model"
    }
    print_request_details("POST", endpoint, payload)
    response = requests.post(endpoint, json=payload)
    print_response_details(response)
    
    assert response.status_code == 500, "Route query with non-existent model should return 500 error"

def main():
    print_header("Neural Resources API Test Suite")
    try:
        test_neural_resources()
    except requests.exceptions.RequestException as e:
        print(f"**Network Error:** An error occurred while testing the API: {e}")
    except AssertionError as ae:
        print(f"**Assertion Failed:** {ae}")
    except Exception as ex:
        print(f"**Unexpected Error:** {ex}")
    finally:
        print("\n" + "="*40)
        print("Neural Resources API tests completed.")
        print("="*40 + "\n")

if __name__ == "__main__":
    main()