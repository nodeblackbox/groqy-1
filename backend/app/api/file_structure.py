from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import httpx
import os

router = APIRouter()

# URL of your Flask API
AGENT_CHEF_API_URL = "http://localhost:8888"  # Update this to the correct URL
GRAV_RAG_API_URL = "http://localhost:6333"  # Update this to the correct URL

class FileStructure(BaseModel):
    ingredient_files: List[str]
    dish_files: List[str]
    latex_files: List[str]
    salad_files: List[str]
    huggingface_folders: List[str]
    oven_files: List[str]
    edits_files: List[str]

@router.get("/file-structure", response_model=FileStructure)
async def get_file_structure():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(f"{AGENT_CHEF_API_URL}/api/files")
            response.raise_for_status()
            data = response.json()
            return FileStructure(**data)
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=str(e))
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching file structure: {str(e)}")