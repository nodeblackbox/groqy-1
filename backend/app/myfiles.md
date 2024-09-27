# Project Analysis Report

## Overall Project Structure

### [.venv](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\.venv)

**Type:**  file

(Binary or unreadable file)

### [Dockerfile](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\Dockerfile)

**Type:**  file


    FROM python:3.11.9-slim
    
    WORKDIR /app
    
    COPY requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt
    
    COPY . .
    
    CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
    



### [Testmain.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\Testmain.py)

**Type:** PY file


    from fastapi import FastAPI, HTTPException
    from pydantic import BaseModel
    from typing import List, Optional, Dict, Any
    # from agentChef import DatasetKitchen, TemplateManager, FileHandler
    from gravrag import Knowledge
    import uvicorn
    import asyncio
    
    app = FastAPI()
    
    # Configuration for AgentChef
    config = {
        'templates_dir': './templates',
        'input_dir': './input',
        'output_dir': './output',
        'ollama_config': {
            'model': 'phi3',
            'api_base': 'http://localhost:11434'
        }
    }
    
    # Initialize AgentChef components
    # kitchen = DatasetKitchen(config)
    # template_manager = TemplateManager(config['templates_dir'])
    # file_handler = FileHandler(config['input_dir'], config['output_dir'])
    
    # AgentChef API models
    class PrepareDatasetRequest(BaseModel):
        source: str
        template: str
        num_samples: int = 100
        output_file: str
    
    class GenerateParaphrasesRequest(BaseModel):
        seed_file: str
        num_samples: int = 1
        system_prompt: Optional[str] = None
    
    class AugmentDataRequest(BaseModel):
        seed_parquet: str
    
    class ParseTextToParquetRequest(BaseModel):
        text_content: str
        template_name: str
        filename: str
    
    class ConvertParquetRequest(BaseModel):
        parquet_file: str
        output_formats: List[str] = ['csv', 'jsonl']
    
    
    ... (truncated, showing first 50 lines)
    



### [agent_chef_guide.md](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\agent_chef_guide.md)

**Type:** MD file


    # AgentChef Comprehensive Guide
    
    This guide demonstrates how to use the agentChef package to scrape data from various sources, process it into a structured format, and run it through a data processing pipeline.
    
    ## Initialization
    
    Import the necessary modules and initialize the DatasetKitchen:
    
    ```python
    from chef import DatasetKitchen
    from agentChef.cutlery import CustomAgentBase
    import pandas as pd
    
    config = {
        'templates_dir': './templates',
        'input_dir': './input',
        'output_dir': './output',
    }
    
    kitchen = DatasetKitchen(config)
    ```
    
    ## Data Collection
    
    ### 1. Hugging Face Datasets
    
    ```python
    hf_dataset_url = "https://huggingface.co/datasets/your_dataset"
    hf_data = kitchen.document_loader.load_from_huggingface(hf_dataset_url)
    ```
    
    ### 2. Wikipedia
    
    ```python
    wiki_query = "Artificial Intelligence"
    wiki_data = kitchen.document_loader.load_from_wikipedia(wiki_query)
    ```
    
    ### 3. Reddit (Custom Agent)
    
    Create a custom Reddit agent:
    
    ```python
    import praw
    
    class RedditAgent(CustomAgentBase):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.reddit = praw.Reddit(client_id='YOUR_CLIENT_ID',
                                      client_secret='YOUR_CLIENT_SECRET',
    
    ... (truncated, showing first 50 lines)
    



### [agentchef_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\agentchef_resources.py)

**Type:** PY file


    import os
    import json
    import logging
    import requests
    from typing import List, Dict, Any
    from anthropic import Anthropic
    import openai
    from groq import Groq
    
    app.include_router(llm_router, prefix="/llm", tags=["llm"])
    
    # Load model data from JSON file
    with open('neural_resources.json', 'r') as f:
        model_data = json.load(f)
    
    class AIAsset:
        def __init__(self, api_key: str):
            self.api_key = api_key
    
        def create_message(self, model: str, message: str) -> Dict[str, Any]:
            """Abstract method for creating a message"""
            pass
    
        def get_output_tokens(self, response: Dict[str, Any]) -> int:
            """Abstract method to get token usage"""
            pass
    
        def execute_tool_calls(self, tool_calls: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
            """Abstract method for executing tool calls"""
            pass
    
    class AnthropicLLM(AIAsset):
        def __init__(self, api_key: str):
            super().__init__(api_key)
            self.client = Anthropic(api_key=api_key)
    
        def create_message(self, model: str, message: str) -> Dict[str, Any]:
            response = self.client.messages.create(
                model=model,
                messages=[message],
                max_tokens=model_data['models'][model]['max_tokens']
            )
            return response.model_dump()
    
        def get_output_tokens(self, response: Dict[str, Any]) -> int:
            return response.get('usage', {}).get('output_tokens', 0)
    
    class OpenAILLM(AIAsset):
        def __init__(self, api_key: str):
            super().__init__(api_key)
    
    ... (truncated, showing first 50 lines)
    



## Directory: api

  ### [api\__init__.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\__init__.py)

  **Type:** PY file

  
    # __init__.py
    
    from .agentChef_api import app as agentchef_app, LLMConfig, CustomAgentConfig, PrepareDatasetRequest, GenerateParaphrasesRequest, AugmentDataRequest
    from .gravrag_API import app as gravrag_app, MemoryInputModel
    
    __all__ = [
        'agentchef_app',
        'LLMConfig',
        'CustomAgentConfig',
        'PrepareDatasetRequest',
        'GenerateParaphrasesRequest',
        'AugmentDataRequest',
        'gravrag_app',
        'MemoryInputModel'
    ]
    



  ### [api\agentChef_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\agentChef_api.py)

  **Type:** PY file

  
    from fastapi import FastAPI, HTTPException
    from pydantic import BaseModel
    from typing import List, Optional, Dict, Any
    import uvicorn
    from cutlery import DatasetManager, TemplateManager, FileHandler, DocumentLoader
    from chef import DatasetKitchen, DataCollectionAgent, DataDigestionAgent, DataGenerationAgent, DataCleaningAgent, DataAugmentationAgent
    from cutlery import PromptManager
    from ai_api_providers import LLMManager
    from huggingface_hub import HfApi
    import uvicorn
    import pandas as pd
    import json
    import os
    
    app = FastAPI(title="AgentChef API", description="API for data processing and dataset creation")
    
    # Configuration for AgentChef
    # config = {
    #     'templates_dir': './templates',
    #     'input_dir': './input',
    #     'output_dir': './output',
    #     'ollama_config': {
    #         'model': 'phi3',
    #         'api_base': 'http://localhost:11434'
    #     }
    # }
    
    # Pydantic models for request bodies
    class DataSourceRequest(BaseModel):
        source_type: str
        query: str
        max_results: int = 10
    
    class StructureDataRequest(BaseModel):
        data: List[Dict[str, Any]]
        template_name: str
    
    class AugmentDataRequest(BaseModel):
        input_file: str
        num_samples: int = 5
        agent_name: str
    
    class PushToHuggingFaceRequest(BaseModel):
        file_path: str
        repo_id: str
        token: str
    
    # Helper function to get LLMManager instance
    def get_llm_manager():
        return llm_manager
    
    ... (truncated, showing first 50 lines)
    



  ### [api\ai_api_providers.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\ai_api_providers.py)

  **Type:** PY file

  
    from fastapi import APIRouter, HTTPException, Depends
    from pydantic import BaseModel
    from typing import Dict, Any, List
    from app.agentchef_resources import LLMManager, model_data
    
    router = APIRouter()
    
    # Initialize LLMManager
    llm_manager = LLMManager()
    
    class Message(BaseModel):
        content: str
    
    class APIKeyUpdate(BaseModel):
        provider: str
        api_key: str
    
    # Dependency to get the LLMManager instance
    def get_llm_manager():
        return llm_manager
    
    @router.post("/route_query")
    async def route_query(message: Message, manager: LLMManager = Depends(get_llm_manager)):
        response = manager.route_query(message.content)
        if "error" in response:
            raise HTTPException(status_code=500, detail=response["error"])
        return response
    
    @router.post("/set_api_key")
    async def set_api_key(api_key_update: APIKeyUpdate, manager: LLMManager = Depends(get_llm_manager)):
        manager.set_api_key(api_key_update.provider, api_key_update.api_key)
        return {"message": f"API key updated for {api_key_update.provider}"}
    
    @router.get("/available_models")
    async def get_available_models(manager: LLMManager = Depends(get_llm_manager)):
        return {"available_models": list(manager.llm_models.keys())}
    
    @router.post("/create_message/{provider}/{model}")
    async def create_message(provider: str, model: str, message: Message, manager: LLMManager = Depends(get_llm_manager)):
        if provider not in manager.llm_models:
            raise HTTPException(status_code=404, detail=f"Provider {provider} not found")
        try:
            response = manager.llm_models[provider].create_message(model, message.content)
            return response
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.get("/model_info/{provider}/{model}")
    async def get_model_info(provider: str, model: str):
        if provider not in model_data['models'] or model not in model_data['models']:
    
    ... (truncated, showing first 50 lines)
    



  ### [api\api_god_matrix_guide.md](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\api_god_matrix_guide.md)

  **Type:** MD file

  
    # AgentChef and GravRAG API GOD MATRIX Usage Guide
    
    This guide explains how to use the combined AgentChef and GravRAG API GOD MATRIX system, which is set up using `main.py` and includes the functionality from `agentChef_api.py` & gravrag_API.py.
    
    ## Table of Contents
    
    1. [Setup and Installation](#setup-and-installation)
    2. [Running the API](#running-the-api)
    3. [AgentChef API Endpoints](#agentchef-api-endpoints)
       - [Collect Data](#collect-data)
       - [Structure Data](#structure-data)
       - [Augment Data](#augment-data)
       - [Push to Hugging Face](#push-to-hugging-face)
       - [Get Templates](#get-templates)
       - [Get Available Agents](#get-available-agents)
    4. [GravRAG API Endpoints](#gravrag-api-endpoints)
       - [Create Memory](#create-memory)
       - [Recall Memory](#recall-memory)
       - [Prune Memories](#prune-memories)
    5. [Example Workflow](#example-workflow)
    
    ## Setup and Installation
    
    1. Ensure you have Python 3.7+ installed.
    2. Install the required dependencies:
       ```
       pip install fastapi uvicorn agentchef gravrag pandas huggingface_hub
       ```
    3. Place `main.py`, `agentChef_api.py`, and `gravrag_API.py` in the same directory.
    
    ## Running the API
    
    1. Open a terminal and navigate to the directory containing `main.py`.
    2. Run the following command:
       ```
       python main.py
       ```
    3. The AgentChef API will be available at `http://localhost:8888`.
    4. The GravRAG API will be available at `http://localhost:6369`.
    
    ## AgentChef API Endpoints
    
    ### Collect Data
    
    - **Endpoint**: `POST http://localhost:8888/collect_data`
    - **Description**: Collects data from arXiv, Wikipedia, or Hugging Face datasets.
    - **Payload Example**:
      ```json
      {
        "source_type": "arxiv",
    
    ... (truncated, showing first 50 lines)
    



  ### [api\chef_api_providers_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\chef_api_providers_api.py)

  **Type:** PY file

  
    from fastapi import APIRouter, HTTPException, Depends
    from pydantic import BaseModel
    from typing import Dict, Any, List
    from ..neural_resources import LLMManager, model_data  # Assuming the previous code is in llm_manager.py
    
    router = APIRouter()
    
    # Initialize LLMManager
    llm_manager = LLMManager()
    
    class Message(BaseModel):
        content: str
    
    class APIKeyUpdate(BaseModel):
        provider: str
        api_key: str
    
    # Dependency to get the LLMManager instance
    def get_llm_manager():
        return llm_manager
    
    @router.post("/route_query")
    async def route_query(message: Message, manager: LLMManager = Depends(get_llm_manager)):
        response = manager.route_query(message.content)
        if "error" in response:
            raise HTTPException(status_code=500, detail=response["error"])
        return response
    
    @router.post("/set_api_key")
    async def set_api_key(api_key_update: APIKeyUpdate, manager: LLMManager = Depends(get_llm_manager)):
        manager.set_api_key(api_key_update.provider, api_key_update.api_key)
        return {"message": f"API key updated for {api_key_update.provider}"}
    
    @router.get("/available_models")
    async def get_available_models(manager: LLMManager = Depends(get_llm_manager)):
        return {"available_models": list(manager.llm_models.keys())}
    
    @router.post("/create_message/{provider}/{model}")
    async def create_message(provider: str, model: str, message: Message, manager: LLMManager = Depends(get_llm_manager)):
        if provider not in manager.llm_models:
            raise HTTPException(status_code=404, detail=f"Provider {provider} not found")
        try:
            response = manager.llm_models[provider].create_message(model, message.content)
            return response
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.get("/model_info/{provider}/{model}")
    async def get_model_info(provider: str, model: str):
        if provider not in model_data['models'] or model not in model_data['models']:
    
    ... (truncated, showing first 50 lines)
    



  ### [api\comprehensive_file_insights.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\comprehensive_file_insights.py)

  **Type:** PY file

  (Binary or unreadable file)

  ### [api\file_contents.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\file_contents.py)

  **Type:** PY file

  (Binary or unreadable file)

  ### [api\file_insights.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\file_insights.py)

  **Type:** PY file

  (Binary or unreadable file)

  ### [api\file_structure.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\file_structure.py)

  **Type:** PY file

  
    from fastapi import APIRouter, HTTPException, Request
    from pydantic import BaseModel
    from typing import List, Dict, Any, Optional
    import httpx
    import requests
    import json
    
    router = APIRouter()
    
    # URLs for both APIs
    AGENT_CHEF_API_URL = "http://localhost:8888"
    GRAV_RAG_API_URL = "http://localhost:6333"
    
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
    



  ### [api\gravrag_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\gravrag_API.py)

  **Type:** PY file

  
    from fastapi import FastAPI, HTTPException
    from pydantic import BaseModel
    from typing import Dict, Any, Optional
    from ..gravrag import Knowledge
    
    app = FastAPI()
    
    class MemoryInputModel(BaseModel):
        content: str
        metadata: Optional[Dict[str, Any]] = {}
    
    @app.post("/api/memory/create")
    async def create_memory(memory_input: MemoryInputModel):
        try:
            await Knowledge.create_memory(memory_input.content, memory_input.metadata)
            return {"message": "Memory created successfully"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {e}")
    
    @app.get("/api/memory/recall")
    async def recall_memory(query: str, top_k: int = 5):
        try:
            results = await Knowledge.recall_memory(query, top_k)
            return {"results": results}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {e}")
    
    @app.post("/api/memory/prune")
    async def prune_memories():
        try:
            await Knowledge.prune_memories()
            return {"message": "Pruning complete"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error: {e}")
    
    # Example ThunderClient payloads:
    # 1. Create Memory
    # {
    #   "content": "This is a sample memory",
    #   "metadata": {
    #     "objective_id": "obj_1",
    #     "task_id": "task_1"
    #   }
    # }
    #
    # 2. Recall Memory
    # GET /api/memory/recall?query=How does GravRAG handle memory?
    #
    # 3. Prune Memories
    # POST /api/memory/prune
    



  ### [api\neural_resources_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\neural_resources_API.py)

  **Type:** PY file

  
    from fastapi import APIRouter, HTTPException, Depends
    from pydantic import BaseModel
    from typing import Dict, Any, List
    from ..neural_resources import LLMManager, model_data  # Assuming the previous code is in llm_manager.py
    
    router = APIRouter()
    
    # Initialize LLMManager
    llm_manager = LLMManager()
    
    class Message(BaseModel):
        content: str
    
    class APIKeyUpdate(BaseModel):
        provider: str
        api_key: str
    
    # Dependency to get the LLMManager instance
    def get_llm_manager():
        return llm_manager
    
    @router.post("/route_query")
    async def route_query(message: Message, manager: LLMManager = Depends(get_llm_manager)):
        response = manager.route_query(message.content)
        if "error" in response:
            raise HTTPException(status_code=500, detail=response["error"])
        return response
    
    @router.post("/set_api_key")
    async def set_api_key(api_key_update: APIKeyUpdate, manager: LLMManager = Depends(get_llm_manager)):
        manager.set_api_key(api_key_update.provider, api_key_update.api_key)
        return {"message": f"API key updated for {api_key_update.provider}"}
    
    @router.get("/available_models")
    async def get_available_models(manager: LLMManager = Depends(get_llm_manager)):
        return {"available_models": list(manager.llm_models.keys())}
    
    @router.post("/create_message/{provider}/{model}")
    async def create_message(provider: str, model: str, message: Message, manager: LLMManager = Depends(get_llm_manager)):
        if provider not in manager.llm_models:
            raise HTTPException(status_code=404, detail=f"Provider {provider} not found")
        try:
            response = manager.llm_models[provider].create_message(model, message.content)
            return response
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @router.get("/model_info/{provider}/{model}")
    async def get_model_info(provider: str, model: str):
        if provider not in model_data['models'] or model not in model_data['models']:
    
    ... (truncated, showing first 50 lines)
    



  ### [api\oarc_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\oarc_api.py)

  **Type:** PY file

  
    from fastapi import FastAPI, HTTPException
    from pydantic import BaseModel
    from typing import List, Optional
    import uvicorn
    from oarc import ollama_chatbot_base
    
    app = FastAPI()
    
    # Initialize DatasetKitchen and other components
    chatbotbase = ollama_chatbot_base()
    
    class start_chatbot(BaseModel):
        modelname: str  # Path to the source data file or URL
        
    @app.post("/start_chatbot")
    async def start_chatbot(request: StartChatbotRequest):
        """
        """
        try:
            chatbotbase = start
    
            return {"message": f"Dataset prepared and saved to {request.output_file}"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    



### [chef.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\chef.py)

**Type:** PY file


    from typing import List, Dict, Any
    import json
    from colorama import Fore, Style
    import click
    # from .config import ConfigManager
    from cutlery import DatasetManager, TemplateManager, PromptManager, FileHandler, DocumentLoader
    from api.ai_api_providers import LLMManager
    from api.agentChef_api import OllamaProvider
    
    # If ConfigManager is in a separate config.py file next to main.py
    # from config import ConfigManager
    
    # If PromptManager is part of cutlery, update the import
    from cutlery import PromptManager
    
    class DataCollectionAgent:
        def __init__(self, template_manager: TemplateManager, file_handler: FileHandler, document_loader: DocumentLoader):
            self.template_manager = template_manager
            self.file_handler = file_handler
            self.document_loader = document_loader
    
        def collect_and_structure_data(self, source: str, template_name: str) -> Dict[str, Any]:
            template = self.template_manager.get_template(template_name)
            
            collected_data = self._collect_data(source)
            structured_data = self._structure_data(collected_data, template)
            
            self.file_handler.save_to_parquet(structured_data, f"{template_name}_structured_data.parquet")
            
            return structured_data
    
        def _collect_data(self, source: str) -> List[Dict[str, Any]]:
            if source.startswith("hf://"):
                dataset_name = source[5:]
                return self.document_loader.load_from_huggingface(dataset_name)
            elif source.startswith("github://"):
                repo_name = source[9:]
                return self.document_loader.load_from_github(repo_name)
            elif source.startswith("wiki://"):
                query = source[7:]
                return [self.document_loader.load_from_wikipedia(query)]
            elif source.startswith("arxiv://"):
                query = source[8:]
                return self.document_loader.load_from_arxiv(query)
            elif self.document_loader.is_url(source):
                return self.document_loader.load_web_page(source)
            else:
                return self.file_handler.load_seed_data(source)
    
        def _structure_data(self, data: List[Dict[str, Any]], template: List[str]) -> Dict[str, List[Any]]:
    
    ... (truncated, showing first 50 lines)
    



### [config.json](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\config.json)

**Type:** JSON file


    {
        "api_key": "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",
        "project_dir": "D:/CodingGit_StorageHDD/Ollama_Custom_Mods/nextjs/cee_cee_mystery/quantum-nexus/groqy/backend/app",
        "selected_files": [],
        "system_prompt": "You are an AI assistant analyzing a project structure.",
        "user_prompt": "Analyze the following project structure:",
        "include_context": true,
        "excluded_dirs": [
            "node_modules",
            ".git",
            "__pycache__"
        ],
        "excluded_extensions": [
            ".pyc",
            ".log",
            ".pyo"
        ]
    }
    



### [custom_agent_example.md](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\custom_agent_example.md)

**Type:** MD file


    # Custom Agents in agentChef
    
    Users can create custom agents to extend the functionality of the agentChef package. Here's how to define and use custom agents:
    
    ## Defining a Custom Agent
    
    To create a custom agent, inherit from the `CustomAgentBase` class and implement the required methods:
    
    ```python
    from agentChef.cutlery import CustomAgentBase
    import pandas as pd
    
    class MyCustomAgent(CustomAgentBase):
        def __init__(self, llm_manager, template_manager, file_handler, prompt_manager, document_loader):
            super().__init__(llm_manager, template_manager, file_handler, prompt_manager, document_loader)
            # Add any custom initialization here
    
        def process_data(self, data: Any) -> pd.DataFrame:
            # Implement your custom data processing logic here
            # This method should return a pandas DataFrame
            processed_data = ...  # Your processing logic
            return pd.DataFrame(processed_data)
    
        def scrape_data(self, source: str) -> Any:
            # Implement your custom data scraping logic here
            # This method can return data in any format that your process_data method can handle
            scraped_data = ...  # Your scraping logic
            return scraped_data
    
        # Optionally, add any custom methods you need
        def custom_method(self, ...):
            # Custom functionality
            pass
    
    # The `run` method is inherited from CustomAgentBase and typically doesn't need to be overridden
    ```
    
    ## Example: Reddit Comment Scraper Agent
    
    Here's an example of a custom agent that scrapes comments from a Reddit post:
    
    ```python
    import praw
    from agentChef.cutlery import CustomAgentBase
    import pandas as pd
    
    class RedditCommentAgent(CustomAgentBase):
        def __init__(self, llm_manager, template_manager, file_handler, prompt_manager, document_loader):
            super().__init__(llm_manager, template_manager, file_handler, prompt_manager, document_loader)
            self.reddit = praw.Reddit(client_id='YOUR_CLIENT_ID',
    
    ... (truncated, showing first 50 lines)
    



### [cutlery.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\cutlery.py)

**Type:** PY file


    # Import necessary libraries (assuming they're all needed)
    import pandas as pd
    from tqdm import tqdm
    from datasets import load_dataset
    import numpy as np
    from colorama import Fore, Style, init
    import os, json, urllib.parse, tarfile, gzip, shutil, requests, random, re, time, logging, glob
    from typing import List, Dict, Any, Optional
    import logging
    
    init(autoreset=True)
    
    from langchain_community.document_loaders import (
        WebBaseLoader, PyPDFLoader, TextLoader, Docx2txtLoader,
        UnstructuredPowerPointLoader, WikipediaLoader, ArxivLoader,
        UnstructuredEPubLoader, JSONLoader, CSVLoader
    )
    
    from api.ai_api_providers import LLMManager
    
    from huggingface_hub import snapshot_download, HfApi, hf_hub_download
    from github import Github
    init(autoreset=True)
    
    import requests
    from abc import ABC, abstractmethod
    from typing import List, Dict, Any
    
    import os
    import json
    from typing import Dict, Any
    
    class DataAgent(ABC):
        @abstractmethod
        def fetch_data(self, query: str) -> List[Dict[str, Any]]:
            pass
    
        @abstractmethod
        def get_source_name(self) -> str:
            pass
    
    class ArxivAgent(DataAgent):
        def fetch_data(self, query: str) -> List[Dict[str, Any]]:
            # Implement arXiv API logic here
            # Return a list of dictionaries containing paper information
            pass
    
        def get_source_name(self) -> str:
            return "arXiv"
    
    
    ... (truncated, showing first 50 lines)
    



### [example.venv](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\example.venv)

**Type:** VENV file

(Binary or unreadable file)

### [gravrag.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\gravrag.py)

**Type:** PY file


    import time
    import math
    import uuid
    import logging
    from typing import List, Dict, Any, Optional
    from sentence_transformers import SentenceTransformer
    from qdrant_client import QdrantClient
    from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition
    
    # Set up logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    # Gravitational constants and thresholds
    GRAVITATIONAL_THRESHOLD = 1e-5
    
    class MemoryPacket:
        def __init__(self, vector: List[float], metadata: Dict[str, Any]):
            """
            Memory packet to handle all gravity-based functions and metadata tracking.
            """
            self.vector = vector  # Semantic vector from SentenceTransformer
            self.metadata = metadata or {}
            
            # Default metadata if not provided
            self.metadata.setdefault("timestamp", time.time())
            self.metadata.setdefault("recall_count", 0)
            self.metadata.setdefault("memetic_similarity", 1.0)  # Could be refined over time
            self.metadata.setdefault("semantic_relativity", 1.0)  # Set after query similarity
            self.metadata.setdefault("gravitational_pull", self.calculate_gravitational_pull())
            self.metadata.setdefault("spacetime_coordinate", self.calculate_spacetime_coordinate())
    
        def calculate_gravitational_pull(self) -> float:
            """
            Gravitational pull incorporates vector magnitude, recall count, memetic similarity, and semantic relativity.
            """
            vector_magnitude = math.sqrt(sum(x ** 2 for x in self.vector))
            recall_count = self.metadata["recall_count"]
            memetic_similarity = self.metadata["memetic_similarity"]
            semantic_relativity = self.metadata["semantic_relativity"]
            
            # Calculate gravitational pull
            gravitational_pull = vector_magnitude * (1 + math.log1p(recall_count)) * memetic_similarity * semantic_relativity
            
            self.metadata["gravitational_pull"] = gravitational_pull
            return gravitational_pull
    
        def calculate_spacetime_coordinate(self) -> float:
            """
            Spacetime coordinate is a decaying function of gravitational pull and time.
    
    ... (truncated, showing first 50 lines)
    



### [gravrag_readme.md](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\gravrag_readme.md)

**Type:** MD file


    I am unable to access the uploaded file directly. However, I will provide an updated **README** based on the current state of the **GravRAG** system as you have specified, integrating the functionality we've discussed.
    
    ---
    
    ## **GravRAG Memory System**
    GravRAG (Gravitational Relativity Augmented Generation) is a memory system that dynamically calculates the relevance of memories based on **semantic relativity**, **memetic similarity**, and **recall frequency**. The system assigns **gravitational pull** and **spacetime coordinates** to memories to influence their significance over time.
    
    ---
    
    ### **Key Concepts**
    
    1. **Gravitational Pull**:
       - **Gravitational pull** is calculated as a combination of the **semantic similarity** between memories, the **recall count**, and the **memetic similarity** of memories.
       - Higher gravitational pull makes memories more likely to be recalled in future queries.
       
    2. **Spacetime Coordinates**:
       - **Spacetime coordinates** measure the relevance of memories over time.
       - Memories decay over time unless frequently recalled or semantically similar to new queries, ensuring that **important or frequently accessed memories** remain relevant.
    
    3. **Memetic Similarity**:
       - Measures the **contextual relationship** between memories that are frequently co-recalled.
       - As memories are accessed together, their **memetic similarity** increases, dynamically altering their relevance in the system.
    
    4. **Semantic Relativity**:
       - Measured using **cosine similarity** between the semantic vectors of two pieces of content.
       - **SentenceTransformer** is used to generate vectors that represent the semantic meaning of memories.
    
    5. **Recall Count**:
       - Every time a memory is recalled, its **recall count** increases, boosting its **gravitational pull** and ensuring its relevance within the system grows.
    
    ---
    
    ### **System Features**
    
    - **Automatic Vectorization**:
       - The system automatically generates **semantic vectors** for new memories using the **SentenceTransformer** model.
       
    - **Gravitational Pull Calculation**:
       - Gravitational pull is calculated dynamically, incorporating **vector magnitude**, **recall frequency**, **memetic similarity**, and **semantic relativity**.
    
    - **Spacetime Coordinate Decay**:
       - Memories' spacetime coordinates decay over time unless frequently accessed, simulating a real-world decay of relevance for old, unused memories.
    
    - **Memory Pruning**:
       - Low relevance memories are pruned from the system based on their **gravitational pull** falling below a set threshold, ensuring efficient memory management.
    
    ---
    
    ### **How It Works**
    
    
    ... (truncated, showing first 50 lines)
    



### [main.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\main.py)

**Type:** PY file


    from fastapi import FastAPI, HTTPException
    from pydantic import BaseModel
    from typing import List, Optional, Dict, Any
    # from agentChef import DatasetKitchen, TemplateManager, FileHandler
    # from gravrag import Knowledge
    import uvicorn
    import asyncio
    import sys
    import os
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    # Import the AgentChef API
    # We're importing the entire app and specific models that we might need
    from api.agentChef_api import app as agentchef_app, LLMConfig, CustomAgentConfig, PrepareDatasetRequest, GenerateParaphrasesRequest, AugmentDataRequest
    
    # Import the GravRAG API
    # Similarly, we import the GravRAG app and its MemoryInputModel
    from api.gravrag_API import app as gravrag_app, MemoryInputModel
    
    from api.ai_api_providers import router as llm_router
    app.include_router(llm_router, prefix="/llm", tags=["llm"])
    
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
    
    
    ... (truncated, showing first 50 lines)
    



### [neural_resources.json](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\neural_resources.json)

**Type:** JSON file


    {
      "models": {
        "llama3-groq-70b-8192-tool-use-preview": {
          "provider": "groq",
          "type": "text-generation",
          "capabilities": [
            "text-generation",
            "conversation",
            "code-generation",
            "function-calling"
          ],
          "temperature": 1.0,
          "max_tokens": 8192,
          "context_window": 8192,
          "description": "Large model optimized for tool use and function calling tasks."
        },
        "llama-3.1-70b-versatile": {
          "provider": "groq",
          "type": "text-generation",
          "capabilities": [
            "text-generation",
            "conversation",
            "code-generation",
            "function-calling"
          ],
          "temperature": 1.0,
          "max_tokens": 131072,
          "context_window": 131072,
          "description": "Very large model for advanced reasoning and diverse capabilities."
        },
        "mixtral-8x7b-32768": {
          "provider": "groq",
          "type": "text-generation",
          "capabilities": [
            "text-generation",
            "conversation",
            "code-generation"
          ],
          "temperature": 1.0,
          "max_tokens": 32768,
          "context_window": 32768,
          "description": "Balanced model for general-purpose text generation and coding tasks."
        }
      }
    }
    



### [neural_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\neural_resources.py)

**Type:** PY file


    import os
    import json
    import logging
    import requests
    from typing import List, Dict, Any
    from anthropic import Anthropic
    import openai
    from groq import Groq
    from fastapi import FastAPI
    #TODO POSSIBLE CIRCULAR IMPORT
    from api.neural_resources_API import router as llm_router
    
    app = FastAPI()
    
    app.include_router(llm_router, prefix="/llm", tags=["llm"])
    
    # Load model data from JSON file
    with open('neural_resources.json', 'r') as f:
        model_data = json.load(f)
    
    class AIAsset:
        def __init__(self, api_key: str):
            self.api_key = api_key
    
        def create_message(self, model: str, message: str) -> Dict[str, Any]:
            """Abstract method for creating a message"""
            pass
    
        def get_output_tokens(self, response: Dict[str, Any]) -> int:
            """Abstract method to get token usage"""
            pass
    
        def execute_tool_calls(self, tool_calls: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
            """Abstract method for executing tool calls"""
            pass
    
    class AnthropicLLM(AIAsset):
        def __init__(self, api_key: str):
            super().__init__(api_key)
            self.client = Anthropic(api_key=api_key)
    
        def create_message(self, model: str, message: str) -> Dict[str, Any]:
            response = self.client.messages.create(
                model=model,
                messages=[message],
                max_tokens=model_data['models'][model]['max_tokens']
            )
            return response.model_dump()
    
        def get_output_tokens(self, response: Dict[str, Any]) -> int:
    
    ... (truncated, showing first 50 lines)
    



### [requirements.txt](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\requirements.txt)

**Type:** TXT file


    fastapi
    uvicorn
    qdrant-client
    sentence-transformers
    sentence_transformers
    cachetools
    Flask==2.0.1
    gunicorn==20.1.0
    



### [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py)

**Type:** PY file


    import os
    import re
    import yaml
    import json
    import time
    import logging
    import threading
    import tkinter as tk
    from tkinter import filedialog, messagebox, simpledialog, ttk
    from groq import Groq
    from pygments import highlight
    from pygments.lexers import get_lexer_for_filename
    from pygments.formatters import HtmlFormatter
    import html2text
    
    # Constants
    CONFIG_FILE = 'config.json'
    LOG_FILE = 'project_analyzer.log'
    RATE_LIMIT = 2  # seconds between API calls
    
    # Set up logging
    logging.basicConfig(
        filename=LOG_FILE,
        level=logging.DEBUG,
        format='%(asctime)s - %(levelname)s - %(message)s',
    )
    
    class ProjectAnalyzerGUI:
        def __init__(self, root):
            self.root = root
            self.root.title("Project Analyzer")
            self.root.geometry("1200x800")
            self.root.protocol("WM_DELETE_WINDOW", self.on_close)
    
            self.config = self.load_config()
            self.api_key = self.config.get('api_key', '')
            self.client = None
            self.project_dir = self.config.get('project_dir', '')
            self.selected_files = self.config.get('selected_files', [])
            self.system_prompt = self.config.get('system_prompt', "You are an AI assistant analyzing a project structure.")
            self.user_prompt = self.config.get('user_prompt', "Analyze the following project structure:")
            self.include_context = tk.BooleanVar(value=self.config.get('include_context', True))
            self.excluded_dirs = set(self.config.get('excluded_dirs', ['.git', '__pycache__', 'node_modules']))
            self.excluded_extensions = set(self.config.get('excluded_extensions', ['.log', '.pyc', '.pyo']))
    
            self.create_widgets()
            self.populate_fields()
    
        def create_widgets(self):
            # Main frame
    
    ... (truncated, showing first 50 lines)
    



## Project Relationships

### Variable Usage
- **prefix** is used in:
  - [agentchef_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\agentchef_resources.py)
  - [main.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\main.py)
  - [neural_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\neural_resources.py)
- **tags** is used in:
  - [agentchef_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\agentchef_resources.py)
  - [main.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\main.py)
  - [neural_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\neural_resources.py)
- **model_data** is used in:
  - [agentchef_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\agentchef_resources.py)
  - [neural_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\neural_resources.py)
- **api_key** is used in:
  - [agentchef_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\agentchef_resources.py)
  - [agentchef_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\agentchef_resources.py)
  - [neural_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\neural_resources.py)
  - [neural_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\neural_resources.py)
  - [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py)
- **client** is used in:
  - [agentchef_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\agentchef_resources.py)
  - [neural_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\neural_resources.py)
  - [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py)
- **response** is used in:
  - [agentchef_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\agentchef_resources.py)
  - [neural_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\neural_resources.py)
  - [api\ai_api_providers.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\ai_api_providers.py)
  - [api\ai_api_providers.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\ai_api_providers.py)
  - [api\chef_api_providers_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\chef_api_providers_api.py)
  - [api\chef_api_providers_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\chef_api_providers_api.py)
  - [api\file_structure.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\file_structure.py)
  - [api\file_structure.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\file_structure.py)
  - [api\file_structure.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\file_structure.py)
  - [api\neural_resources_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\neural_resources_API.py)
  - [api\neural_resources_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\neural_resources_API.py)
- **model** is used in:
  - [agentchef_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\agentchef_resources.py)
  - [neural_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\neural_resources.py)
- **messages** is used in:
  - [agentchef_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\agentchef_resources.py)
  - [neural_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\neural_resources.py)
- **max_tokens** is used in:
  - [agentchef_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\agentchef_resources.py)
  - [neural_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\neural_resources.py)
- **template_manager** is used in:
  - [chef.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\chef.py)
  - [main.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\main.py)
  - [Testmain.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\Testmain.py)
- **file_handler** is used in:
  - [chef.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\chef.py)
  - [main.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\main.py)
  - [Testmain.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\Testmain.py)
- **document_loader** is used in:
  - [chef.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\chef.py)
- **template** is used in:
  - [chef.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\chef.py)
- **collected_data** is used in:
  - [chef.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\chef.py)
- **structured_data** is used in:
  - [chef.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\chef.py)
- **dataset_name** is used in:
  - [chef.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\chef.py)
- **repo_name** is used in:
  - [chef.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\chef.py)
- **query** is used in:
  - [chef.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\chef.py)
  - [chef.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\chef.py)
  - [api\gravrag_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\gravrag_API.py)
- **autoreset** is used in:
  - [cutlery.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\cutlery.py)
  - [cutlery.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\cutlery.py)
- **level** is used in:
  - [gravrag.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\gravrag.py)
  - [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py)
- **logger** is used in:
  - [gravrag.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\gravrag.py)
- **GRAVITATIONAL_THRESHOLD** is used in:
  - [gravrag.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\gravrag.py)
- **vector** is used in:
  - [gravrag.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\gravrag.py)
- **metadata** is used in:
  - [gravrag.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\gravrag.py)
- **vector_magnitude** is used in:
  - [gravrag.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\gravrag.py)
- **recall_count** is used in:
  - [gravrag.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\gravrag.py)
- **memetic_similarity** is used in:
  - [gravrag.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\gravrag.py)
- **semantic_relativity** is used in:
  - [gravrag.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\gravrag.py)
- **gravitational_pull** is used in:
  - [gravrag.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\gravrag.py)
- **agentchef_fastapi** is used in:
  - [main.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\main.py)
- **gravrag_fastapi** is used in:
  - [main.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\main.py)
- **config** is used in:
  - [main.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\main.py)
  - [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py)
  - [Testmain.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\Testmain.py)
  - [api\agentChef_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\agentChef_api.py)
- **kitchen** is used in:
  - [main.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\main.py)
  - [Testmain.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\Testmain.py)
- **chef_llm_manager** is used in:
  - [main.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\main.py)
  - [main.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\main.py)
- **grav_llm_manager** is used in:
  - [main.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\main.py)
- **app** is used in:
  - [neural_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\neural_resources.py)
  - [Testmain.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\Testmain.py)
  - [api\agentChef_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\agentChef_api.py)
  - [api\gravrag_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\gravrag_API.py)
  - [api\oarc_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\oarc_api.py)
- **CONFIG_FILE** is used in:
  - [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py)
- **LOG_FILE** is used in:
  - [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py)
- **RATE_LIMIT** is used in:
  - [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py)
- **filename** is used in:
  - [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py)
- **format** is used in:
  - [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py)
- **root** is used in:
  - [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py)
- **project_dir** is used in:
  - [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py)
- **selected_files** is used in:
  - [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py)
- **system_prompt** is used in:
  - [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py)
  - [api\file_structure.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\file_structure.py)
- **user_prompt** is used in:
  - [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py)
- **include_context** is used in:
  - [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py)
- **value** is used in:
  - [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py)
- **excluded_dirs** is used in:
  - [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py)
- **excluded_extensions** is used in:
  - [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py)
- **int** is used in:
  - [Testmain.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\Testmain.py)
  - [Testmain.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\Testmain.py)
  - [api\agentChef_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\agentChef_api.py)
  - [api\agentChef_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\agentChef_api.py)
  - [api\gravrag_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\gravrag_API.py)
- **title** is used in:
  - [api\agentChef_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\agentChef_api.py)
- **description** is used in:
  - [api\agentChef_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\agentChef_api.py)
- **router** is used in:
  - [api\ai_api_providers.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\ai_api_providers.py)
  - [api\chef_api_providers_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\chef_api_providers_api.py)
  - [api\file_structure.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\file_structure.py)
  - [api\neural_resources_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\neural_resources_API.py)
- **llm_manager** is used in:
  - [api\ai_api_providers.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\ai_api_providers.py)
  - [api\chef_api_providers_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\chef_api_providers_api.py)
  - [api\neural_resources_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\neural_resources_API.py)
- **LLMManager** is used in:
  - [api\ai_api_providers.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\ai_api_providers.py)
  - [api\ai_api_providers.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\ai_api_providers.py)
  - [api\ai_api_providers.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\ai_api_providers.py)
  - [api\ai_api_providers.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\ai_api_providers.py)
  - [api\chef_api_providers_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\chef_api_providers_api.py)
  - [api\chef_api_providers_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\chef_api_providers_api.py)
  - [api\chef_api_providers_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\chef_api_providers_api.py)
  - [api\chef_api_providers_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\chef_api_providers_api.py)
  - [api\neural_resources_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\neural_resources_API.py)
  - [api\neural_resources_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\neural_resources_API.py)
  - [api\neural_resources_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\neural_resources_API.py)
  - [api\neural_resources_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\neural_resources_API.py)
- **status_code** is used in:
  - [api\ai_api_providers.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\ai_api_providers.py)
  - [api\ai_api_providers.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\ai_api_providers.py)
  - [api\ai_api_providers.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\ai_api_providers.py)
  - [api\chef_api_providers_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\chef_api_providers_api.py)
  - [api\chef_api_providers_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\chef_api_providers_api.py)
  - [api\chef_api_providers_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\chef_api_providers_api.py)
  - [api\gravrag_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\gravrag_API.py)
  - [api\gravrag_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\gravrag_API.py)
  - [api\gravrag_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\gravrag_API.py)
  - [api\neural_resources_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\neural_resources_API.py)
  - [api\neural_resources_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\neural_resources_API.py)
  - [api\neural_resources_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\neural_resources_API.py)
  - [api\oarc_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\oarc_api.py)
- **detail** is used in:
  - [api\ai_api_providers.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\ai_api_providers.py)
  - [api\ai_api_providers.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\ai_api_providers.py)
  - [api\ai_api_providers.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\ai_api_providers.py)
  - [api\chef_api_providers_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\chef_api_providers_api.py)
  - [api\chef_api_providers_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\chef_api_providers_api.py)
  - [api\chef_api_providers_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\chef_api_providers_api.py)
  - [api\gravrag_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\gravrag_API.py)
  - [api\gravrag_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\gravrag_API.py)
  - [api\gravrag_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\gravrag_API.py)
  - [api\neural_resources_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\neural_resources_API.py)
  - [api\neural_resources_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\neural_resources_API.py)
  - [api\neural_resources_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\neural_resources_API.py)
  - [api\oarc_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\oarc_api.py)
- **AGENT_CHEF_API_URL** is used in:
  - [api\file_structure.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\file_structure.py)
- **GRAV_RAG_API_URL** is used in:
  - [api\file_structure.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\file_structure.py)
- **json** is used in:
  - [api\file_structure.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\file_structure.py)
  - [api\file_structure.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\file_structure.py)
- **__name__** is used in:
  - [api\file_structure.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\file_structure.py)
- **result** is used in:
  - [api\file_structure.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\file_structure.py)
  - [api\file_structure.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\file_structure.py)
- **templates** is used in:
  - [api\file_structure.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\file_structure.py)
- **indent** is used in:
  - [api\file_structure.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\file_structure.py)
- **results** is used in:
  - [api\gravrag_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\gravrag_API.py)
- **chatbotbase** is used in:
  - [api\oarc_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\oarc_api.py)
  - [api\oarc_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\oarc_api.py)
- **__all__** is used in:
  - [api\__init__.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\__init__.py)

### File Dependencies
- [agentchef_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\agentchef_resources.py) depends on:
  - os
  - json
  - logging
  - requests
  - typing
  - anthropic
  - openai
  - groq
- [chef.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\chef.py) depends on:
  - typing
  - json
  - colorama
  - click
  - .config
  - cutlery
  - api.ai_api_providers
  - api.agentChef_api
  - config
  - from
  - PromptManager
- [cutlery.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\cutlery.py) depends on:
  - pandas
  - tqdm
  - datasets
  - numpy
  - colorama
  - os,
  - typing
  - logging
  - langchain_community.document_loaders
  - api.ai_api_providers
  - huggingface_hub
  - github
  - requests
  - abc
  - typing
  - os
  - json
  - typing
- [gravrag.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\gravrag.py) depends on:
  - time
  - math
  - uuid
  - logging
  - typing
  - sentence_transformers
  - qdrant_client
  - qdrant_client.models
- [main.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\main.py) depends on:
  - fastapi
  - pydantic
  - typing
  - agentChef
  - gravrag
  - uvicorn
  - asyncio
  - sys
  - os
  - api.agentChef_api
  - the
  - api.gravrag_API
  - api.ai_api_providers
- [neural_resources.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\neural_resources.py) depends on:
  - os
  - json
  - logging
  - requests
  - typing
  - anthropic
  - openai
  - groq
  - fastapi
  - api.neural_resources_API
- [runthisIFYOUAREBORCH.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\runthisIFYOUAREBORCH.py) depends on:
  - os
  - re
  - yaml
  - json
  - time
  - logging
  - threading
  - tkinter
  - tkinter
  - groq
  - pygments
  - pygments.lexers
  - pygments.formatters
  - html2text
- [Testmain.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\Testmain.py) depends on:
  - fastapi
  - pydantic
  - typing
  - agentChef
  - gravrag
  - uvicorn
  - asyncio
- [api\agentChef_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\agentChef_api.py) depends on:
  - fastapi
  - pydantic
  - typing
  - uvicorn
  - cutlery
  - chef
  - cutlery
  - ai_api_providers
  - huggingface_hub
  - uvicorn
  - pandas
  - json
  - os
- [api\ai_api_providers.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\ai_api_providers.py) depends on:
  - fastapi
  - pydantic
  - typing
  - app.agentchef_resources
- [api\chef_api_providers_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\chef_api_providers_api.py) depends on:
  - fastapi
  - pydantic
  - typing
  - ..neural_resources
- [api\file_structure.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\file_structure.py) depends on:
  - fastapi
  - pydantic
  - typing
  - httpx
  - requests
  - json
- [api\gravrag_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\gravrag_API.py) depends on:
  - fastapi
  - pydantic
  - typing
  - ..gravrag
- [api\neural_resources_API.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\neural_resources_API.py) depends on:
  - fastapi
  - pydantic
  - typing
  - ..neural_resources
- [api\oarc_api.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\oarc_api.py) depends on:
  - fastapi
  - pydantic
  - typing
  - uvicorn
  - oarc
- [api\__init__.py](file://D:\CodingGit_StorageHDD\Ollama_Custom_Mods\nextjs\cee_cee_mystery\quantum-nexus\groqy\backend\app\api\__init__.py) depends on:
  - .agentChef_api
  - .gravrag_API


## AI Analysis

The project structure appears to be a complex system with multiple components and APIs. Here's a high-level overview of the structure:

1. **APIs**: There are multiple APIs in the project, including:
	* `agentChef_api`: Provides endpoints for data processing and dataset creation.
	* `gravrag_API`: Provides endpoints for memory management and recall.
	* `neural_resources_API`: Provides endpoints for neural resource management.
	* `oarc_api`: Provides endpoints for chatbot functionality.
2. **Services**: There are several services that interact with the APIs, including:
	* `agentChef`: A service that provides data processing and dataset creation functionality.
	* `GravRAG`: A service that provides memory management and recall functionality.
	* `LLMManager`: A service that manages large language models.
3. **Models**: There are several models defined in the project, including:
	* `LLMConfig`: A model that represents the configuration for a large language model.
	* `CustomAgentConfig`: A model that represents the configuration for a custom agent.
	* `PrepareDatasetRequest`: A model that represents a request to prepare a dataset.
	* `GenerateParaphrasesRequest`: A model that represents a request to generate paraphrases.
	* `AugmentDataRequest`: A model that represents a request to augment data.
4. **Utils**: There are several utility files in the project, including:
	* `cutlery.py`: A utility file that provides functions for data processing and dataset creation.
	* `gravrag.py`: A utility file that provides functions for memory management and recall.
	* `neural_resources.py`: A utility file that provides functions for neural resource management.
5. **Config**: There is a `config.json` file that stores configuration settings for the project.
6. **Main**: The `main.py` file appears to be the entry point for the project, and it creates instances of the services and APIs.

The project structure suggests that it is a complex system that integrates multiple APIs and services to provide data processing, dataset creation, and memory management functionality. The use of multiple APIs and services suggests that the project is designed to be scalable and modular.

Some potential improvements to the project structure could include:

* Creating a more modular structure, with each API and service in its own separate directory.
* Using a more consistent naming convention for files and directories.
* Adding more documentation and comments to explain the purpose and functionality of each file and directory.
* Consider using a more robust configuration management system, such as a separate configuration file for each service or API.
* Consider using a more robust error handling system, such as a centralized error handling service that can handle errors from multiple APIs and services.