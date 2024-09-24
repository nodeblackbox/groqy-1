from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import os

router = APIRouter()

# Define the base directories
BASE_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'agent_chef_data')
INPUT_DIR = os.path.join(BASE_DIR, "ingredients")
OUTPUT_DIR = os.path.join(BASE_DIR, "dishes")
LATEX_LIBRARY_DIR = os.path.join(BASE_DIR, "latex_library")
SALAD_DIR = os.path.join(BASE_DIR, "salad")
HUGGINGFACE_DIR = os.path.join(BASE_DIR, "huggingface_models")
OVEN_DIR = os.path.join(BASE_DIR, "oven")
EDITS_DIR = os.path.join(BASE_DIR, "edits")

class FileStructure(BaseModel):
    ingredient_files: List[str]
    dish_files: List[str]
    latex_files: List[str]
    salad_files: List[str]
    huggingface_folders: List[str]
    oven_files: List[str]
    edits_files: List[str]

def get_files_from_dir(directory: str) -> List[str]:
    return [f for f in os.listdir(directory) if os.path.isfile(os.path.join(directory, f)) and f.endswith(('.json', '.parquet', '.txt', '.tex'))]

@router.get("/api/get-file-structure", response_model=FileStructure)
async def get_file_structure():
    try:
        structure = FileStructure(
            ingredient_files=get_files_from_dir(INPUT_DIR),
            dish_files=get_files_from_dir(OUTPUT_DIR),
            latex_files=[f for f in os.listdir(LATEX_LIBRARY_DIR) if f.endswith('.tex')],
            salad_files=get_files_from_dir(SALAD_DIR),
            huggingface_folders=[f for f in os.listdir(HUGGINGFACE_DIR) if os.path.isdir(os.path.join(HUGGINGFACE_DIR, f))],
            oven_files=get_files_from_dir(OVEN_DIR),
            edits_files=get_files_from_dir(EDITS_DIR)
        )
        return structure
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching file structure: {str(e)}")