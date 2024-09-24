from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import httpx

router = APIRouter()

# URLs for both APIs
AGENT_CHEF_API_URL = "http://localhost:8888"
GRAV_RAG_API_URL = "http://localhost:6333"

class FileStructure(BaseModel):
    ingredient_files: List[str]
    dish_files: List[str]
    latex_files: List[str]
    salad_files: List[str]
    huggingface_folders: List[str]
    oven_files: List[str]
    edits_files: List[str]

class MemoryInputModel(BaseModel):
    session_id: str
    role: str
    content: str
    relevance_tags: Optional[List[str]] = None
    core_intent: Optional[str] = None
    objective_id: Optional[str] = None
    discovery_id: Optional[str] = None
    iteration_id: Optional[str] = None
    task_id: Optional[str] = None
    visual_data: Optional[str] = None
    is_basal_reference: bool = False

class PrepareDatasetModel(BaseModel):
    source: str
    template: str
    num_samples: int = 100
    output_file: str

class GenerateParaphrasesModel(BaseModel):
    seed_file: str
    num_samples: int = 1
    system_prompt: Optional[str] = None

class AugmentDataModel(BaseModel):
    seed_parquet: str

class ParseTextToParquetModel(BaseModel):
    text_content: str
    template_name: str
    filename: str

class ConvertParquetModel(BaseModel):
    parquet_file: str
    output_formats: List[str] = ['csv', 'jsonl']
    
@router.post("/prepare_dataset")
async def prepare_dataset(data: PrepareDatasetModel):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{AGENT_CHEF_API_URL}/prepare_dataset", json=data.dict())
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error preparing dataset: {str(e)}")

@router.post("/generate_paraphrases")
async def generate_paraphrases(data: GenerateParaphrasesModel):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{AGENT_CHEF_API_URL}/generate_paraphrases", json=data.dict())
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating paraphrases: {str(e)}")

@router.post("/augment_data")
async def augment_data(data: AugmentDataModel):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{AGENT_CHEF_API_URL}/augment_data", json=data.dict())
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error augmenting data: {str(e)}")

@router.post("/parse_text_to_parquet")
async def parse_text_to_parquet(data: ParseTextToParquetModel):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{AGENT_CHEF_API_URL}/parse_text_to_parquet", json=data.dict())
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error parsing text to parquet: {str(e)}")

@router.post("/convert_parquet")
async def convert_parquet(data: ConvertParquetModel):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{AGENT_CHEF_API_URL}/convert_parquet", json=data.dict())
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error converting parquet: {str(e)}")
    
# Grav Rag API routes
@router.post("/memory/create")
async def create_memory(memory_input: MemoryInputModel):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{GRAV_RAG_API_URL}/memory/create", json=memory_input.dict())
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error creating memory: {str(e)}")

@router.get("/memory/recall/{session_id}")
async def recall_memory(session_id: str, query: str, top_k: int = 5):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{GRAV_RAG_API_URL}/memory/recall/{session_id}", params={"query": query, "top_k": top_k})
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error recalling memory: {str(e)}")

@router.post("/semantic-search")
async def semantic_search(query: str, filter_conditions: Optional[Dict[str, Any]] = None, top_k: int = 10):
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(f"{GRAV_RAG_API_URL}/semantic-search", 
                                         json={"query": query, "filter_conditions": filter_conditions, "top_k": top_k})
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error performing semantic search: {str(e)}")

# Add more routes as needed for both APIs