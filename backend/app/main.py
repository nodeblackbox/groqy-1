from fastapi import FastAPI
from api.agentChef_api import app as agentchef_app
from api.gravrag_API import app as gravrag_app
from api.ai_api_providers import router as llm_router
import uvicorn
import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

agentchef_fastapi = FastAPI()
gravrag_fastapi = FastAPI()

agentchef_fastapi.include_router(llm_router, prefix="/llm", tags=["llm"])
#agentchef_fastapi.include_router(agentchef_app, tags=["agentchef"])
#gravrag_fastapi.include_router(gravrag_app, tags=["gravrag"])

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

# Function to run a server asynchronously
async def run_server(app, host, port):
    config = uvicorn.Config(app, host=host, port=port)
    server = uvicorn.Server(config)
    await server.serve()

# Main execution block
if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    
    tasks = [
        run_server(agentchef_fastapi, "0.0.0.0", 8888),
        run_server(gravrag_fastapi, "0.0.0.0", 6369),
    ]
    
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