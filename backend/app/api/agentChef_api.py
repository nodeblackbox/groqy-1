from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn

from cutlery import DatasetManager, TemplateManager, FileHandler, DocumentLoader, PromptManager
from chef import DatasetKitchen, DataCollectionAgent, DataDigestionAgent, DataGenerationAgent, DataCleaningAgent, DataAugmentationAgent

from backend.app.agentchef_resources import LLMManager, OllamaLLM
from huggingface_hub import HfApi
import uvicorn
import pandas as pd
import json
import os

# Initialize necessary objects
llm_manager = LLMManager()
template_manager = TemplateManager('./templates')
file_handler = FileHandler('./input', './output')
document_loader = DocumentLoader()
prompt_manager = PromptManager()

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

class LLMConfig(BaseModel):
    model: str
    api_base: str

class CustomAgentConfig(BaseModel):
    agent_name: str
    config: Dict[str, Any]

class PrepareDatasetRequest(BaseModel):
    source: str
    template_name: str
    num_samples: int
    augmentation_config: Optional[Dict[str, Any]] = None
    output_file: str

class GenerateParaphrasesRequest(BaseModel):
    seed_file: str
    num_samples: int = 1
    system_prompt: Optional[str] = None
    
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

@app.post("/collect_data")
async def collect_data(request: DataSourceRequest):
    """
    Collect data from arXiv, Wikipedia, or Hugging Face datasets.
    
    Example payload:
    {
        "source_type": "arxiv",
        "query": "machine learning",
        "max_results": 10
    }
    """
    try:
        if request.source_type == "arxiv":
            data = document_loader.load_from_arxiv(request.query, request.max_results)
        elif request.source_type == "wikipedia":
            data = document_loader.load_from_wikipedia(request.query)
        elif request.source_type == "huggingface":
            data = document_loader.load_from_huggingface(request.query)
        else:
            raise HTTPException(status_code=400, detail="Invalid source type")
        
        return {"message": "Data collected successfully", "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/structure_data")
async def structure_data(request: StructureDataRequest):
    """
    Structure collected data into the instruction-input-output format.
    
    Example payload:
    {
        "data": [{"title": "Example", "content": "This is a sample content"}],
        "template_name": "instruction_input_output"
    }
    """
    try:
        template = template_manager.get_template(request.template_name)
        if not template:
            raise HTTPException(status_code=404, detail=f"Template '{request.template_name}' not found")
        
        structured_data = []
        for item in request.data:
            structured_item = {
                "instruction": f"Summarize the following text: {item['title']}",
                "input": item['content'],
                "output": "This is where the summary would go."
            }
            structured_data.append(structured_item)
        
        # Save as JSON and Parquet
        json_file = os.path.join(config['output_dir'], "structured_data.json")
        with open(json_file, 'w') as f:
            json.dump(structured_data, f, indent=2)
        
        df = pd.DataFrame(structured_data)
        parquet_file = os.path.join(config['output_dir'], "structured_data.parquet")
        df.to_parquet(parquet_file, index=False)
        
        return {
            "message": "Data structured successfully",
            "json_file": json_file,
            "parquet_file": parquet_file
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/augment_data")
async def augment_data(request: AugmentDataRequest, manager: LLMManager = Depends(get_llm_manager)):
    """
    Augment structured data by generating paraphrases, expanding, and cleaning.
    
    Example payload:
    {
        "input_file": "structured_data.parquet",
        "num_samples": 5,
        "agent_name": "openai"
    }
    """
    try:
        agent = kitchen.get_agent(request.agent_name)
        if agent is None:
            raise HTTPException(status_code=404, detail=f"Agent '{request.agent_name}' not found")

        # Load the input data
        input_data = pd.read_parquet(os.path.join(config['input_dir'], request.input_file))

        # Augment data
        augmented_data = []
        for _, row in input_data.iterrows():
            for _ in range(request.num_samples):
                augmented_item = {
                    "instruction": agent.paraphrase_text(row['instruction']),
                    "input": agent.paraphrase_text(row['input']),
                    "output": agent.paraphrase_text(row['output'])
                }
                augmented_data.append(augmented_item)

        # Clean data
        cleaned_data = kitchen.clean_data(pd.DataFrame(augmented_data))

        # Save augmented and cleaned data
        output_file = os.path.join(config['output_dir'], "augmented_data.parquet")
        cleaned_data.to_parquet(output_file, index=False)

        return {"message": f"Data augmented and saved to: {output_file}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/push_to_huggingface")
async def push_to_huggingface(request: PushToHuggingFaceRequest):
    """
    Push the final dataset to Hugging Face.
    
    Example payload:
    {
        "file_path": "augmented_data.parquet",
        "repo_id": "username/dataset-name",
        "token": "your_huggingface_token"
    }
    """
    try:
        file_path = os.path.join(config['output_dir'], request.file_path)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"File not found: {file_path}")

        api = HfApi()
        api.upload_file(
            path_or_fileobj=file_path,
            path_in_repo=request.file_path,
            repo_id=request.repo_id,
            token=request.token
        )

        return {"message": f"File {request.file_path} pushed to Hugging Face repository: {request.repo_id}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get_templates")
async def get_templates():
    """
    Retrieve all available templates.
    """
    try:
        templates = template_manager.get_templates()
        return {"templates": templates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get_available_agents")
async def get_available_agents():
    """
    Retrieve all available AI agents.
    """
    try:
        agents = llm_manager.get_available_models()
        return {"available_agents": agents}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8888)