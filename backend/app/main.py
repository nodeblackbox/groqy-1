from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
# from agentChef import DatasetKitchen, TemplateManager, FileHandler
# from gravrag import Knowledge
import uvicorn
import asyncio

# Import the AgentChef API
# We're importing the entire app and specific models that we might need
from api.agentChef_api import app as agentchef_app, LLMConfig, CustomAgentConfig, PrepareDatasetRequest, GenerateParaphrasesRequest, AugmentDataRequest

# Import the GravRAG API
# Similarly, we import the GravRAG app and its MemoryInputModel
from api.gravrag_API import app as gravrag_app, MemoryInputModel

# Create separate FastAPI instances for AgentChef and GravRAG
# This allows us to run two separate APIs on different ports
agentchef_fastapi = FastAPI()
gravrag_fastapi = FastAPI()

# Configuration for AgentChef
# This dictionary contains all the necessary settings for AgentChef
config = {
    'templates_dir': './templates',  # Directory for templates
    'input_dir': './input',          # Directory for input files
    'output_dir': './output',        # Directory for output files
    'ollama_config': {
        'model': 'phi3',             # The model to use
        'api_base': 'http://localhost:11434'  # Ollama API endpoint
    }
}

# Initialize AgentChef components
# These objects will be used to interact with various parts of AgentChef
# Initialize AgentChef components
kitchen = agentchef_app.DatasetKitchen(config)
template_manager = agentchef_app.TemplateManager(config['templates_dir'])
file_handler = agentchef_app.FileHandler(config['input_dir'], config['output_dir'])
chef_llm_manager = agentchef_app.LLMManager()

grav_llm_manager = gravrag_app.LLMManager()
chef_llm_manager = agentchef_app.LLMManager()

document_loader = agentchef_app.DocumentLoader()

# Include AgentChef routes
# This adds all the routes from the AgentChef API to our FastAPI instance
agentchef_fastapi.include_router(agentchef_app, tags=["agentchef"])

# Include GravRAG routes
# This adds all the routes from the GravRAG API to our FastAPI instance
gravrag_fastapi.include_router(gravrag_app, tags=["gravrag"])

# Function to run a server asynchronously
async def run_server(app, host, port):
    config = uvicorn.Config(app, host=host, port=port)
    server = uvicorn.Server(config)
    await server.serve()

# Main execution block
if __name__ == "__main__":
    # Get the event loop
    loop = asyncio.get_event_loop()
    
    # Define tasks for running both servers
    tasks = [
        run_server(agentchef_fastapi, "0.0.0.0", 8888),  # AgentChef API on port 8888
        run_server(gravrag_fastapi, "0.0.0.0", 6369),    # GravRAG API on port 6369
    ]
    
    # Run both servers concurrently
    loop.run_until_complete(asyncio.gather(*tasks))

# How to use this API:
# 1. Make sure you have all the required dependencies installed (FastAPI, uvicorn, agentChef, gravrag, etc.)
# 2. Run this script using: python main.py
# 3. The AgentChef API will be available at http://localhost:8888
# 4. The GravRAG API will be available at http://localhost:6369
# 5. You can now send requests to these APIs using tools like curl, Postman, or from your own code

# Example usage for AgentChef API:
# - Collect data: POST http://localhost:8888/collect_data
# - Structure data: POST http://localhost:8888/structure_data
# - Augment data: POST http://localhost:8888/augment_data
# - Push to Hugging Face: POST http://localhost:8888/push_to_huggingface

# Example usage for GravRAG API:
# - Create memory: POST http://localhost:6369/api/memory/create
# - Recall memory: GET http://localhost:6369/api/memory/recall?query=your_query_here
# - Prune memories: POST http://localhost:6369/api/memory/prune

# Remember to check the documentation of each API for detailed information on request/response formats and available endpoints.