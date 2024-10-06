import requests
import json
from typing import Dict, Any
import sys
import os

# Add the parent directory to the Python path to allow importing from sibling directories
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import the FastAPI app and the agentchef router
from app.main import app

# Use TestClient for testing FastAPI applications
from fastapi.testclient import TestClient

class AgentChefAPITester:
    def __init__(self):
        self.client = TestClient(app)

    def test_collect_data(self) -> Dict[str, Any]:
        endpoint = "/agentchef/collect_data"
        payload = {
            "source_type": "arxiv",
            "query": "machine learning",
            "max_results": 5
        }
        response = self.client.post(endpoint, json=payload)
        return {
            "status_code": response.status_code,
            "response": response.json() if response.status_code < 400 else response.text
        }

    def test_structure_data(self) -> Dict[str, Any]:
        endpoint = "/agentchef/structure_data"
        payload = {
            "data": [
                {"title": "Machine Learning Basics", "content": "This is an introduction to machine learning."},
                {"title": "Deep Learning", "content": "Deep learning is a subset of machine learning."}
            ],
            "template_name": "instruction_input_output"
        }
        response = self.client.post(endpoint, json=payload)
        return {
            "status_code": response.status_code,
            "response": response.json() if response.status_code < 400 else response.text
        }

    def test_augment_data(self) -> Dict[str, Any]:
        endpoint = "/agentchef/augment_data"
        payload = {
            "input_file": "structured_data.parquet",
            "num_samples": 3,
            "agent_name": "openai"
        }
        response = self.client.post(endpoint, json=payload)
        return {
            "status_code": response.status_code,
            "response": response.json() if response.status_code < 400 else response.text
        }

    def test_push_to_huggingface(self) -> Dict[str, Any]:
        endpoint = "/agentchef/push_to_huggingface"
        payload = {
            "file_path": "augmented_data.parquet",
            "repo_id": "username/dataset-name",
            "token": "your_huggingface_token"
        }
        response = self.client.post(endpoint, json=payload)
        return {
            "status_code": response.status_code,
            "response": response.json() if response.status_code < 400 else response.text
        }

    def run_all_tests(self):
        tests = [
            ("Collect Data", self.test_collect_data),
            ("Structure Data", self.test_structure_data),
            ("Augment Data", self.test_augment_data),
            ("Push to Hugging Face", self.test_push_to_huggingface)
        ]

        results = {}
        for test_name, test_func in tests:
            print(f"Running test: {test_name}")
            result = test_func()
            results[test_name] = result
            print(f"Status Code: {result['status_code']}")
            print(f"Response: {json.dumps(result['response'], indent=2)}")
            print("-" * 50)

        return results

if __name__ == "__main__":
    tester = AgentChefAPITester()
    tester.run_all_tests()