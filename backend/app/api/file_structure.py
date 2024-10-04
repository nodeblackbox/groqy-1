from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import httpx
import requests
import json

router = APIRouter()

# URLs for both APIs
AGENT_CHEF_API_URL = "http://localhost:8888"
GRAV_RAG_API_URL = "http://qdrant:6333"

def prepare_dataset(source, template, num_samples, output_file):
    response = requests.post(f"{AGENT_CHEF_API_URL}/prepare_dataset", json={
        "source": source,
        "template": template,
        "num_samples": num_samples,
        "output_file": output_file
    })
    return response.json()

def generate_paraphrases(seed_file, num_samples, system_prompt=None):
    response = requests.post(f"{AGENT_CHEF_API_URL}/generate_paraphrases", json={
        "seed_file": seed_file,
        "num_samples": num_samples,
        "system_prompt": system_prompt
    })
    return response.json()

def get_templates():
    response = requests.get(f"{AGENT_CHEF_API_URL}/get_templates")
    return response.json()

# Example usage
if __name__ == "__main__":
    # Prepare a dataset
    result = prepare_dataset("example_source.txt", "chat", 100, "output_dataset.parquet")
    print(result)

    # Generate paraphrases
    result = generate_paraphrases("seed_file.txt", 5)
    print(result)

    # Get available templates
    templates = get_templates()
    print(json.dumps(templates, indent=2))