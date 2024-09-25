from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from .agentChef import DatasetKitchen, TemplateManager, FileHandler
import uvicorn

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

# Initialize DatasetKitchen and other components
kitchen = DatasetKitchen(config)
template_manager = TemplateManager(config['templates_dir'])
file_handler = FileHandler(config['input_dir'], config['output_dir'])

class PrepareDatasetRequest(BaseModel):
    source: str  # Path to the source data file or URL
    template: str  # Name of the template to use for structuring the data
    num_samples: int = 100  # Number of samples to generate (default: 100)
    output_file: str  # Name of the output file to save the prepared dataset

class GenerateParaphrasesRequest(BaseModel):
    seed_file: str  # Path to the seed file containing original text
    num_samples: int = 1  # Number of paraphrases to generate for each input (default: 1)
    system_prompt: Optional[str] = None  # Optional custom system prompt for paraphrasing

class AugmentDataRequest(BaseModel):
    seed_parquet: str  # Path to the seed parquet file to be augmented

class ParseTextToParquetRequest(BaseModel):
    text_content: str  # Raw text content to be parsed
    template_name: str  # Name of the template to use for parsing
    filename: str  # Base name for the output files (without extension)

class ConvertParquetRequest(BaseModel):
    parquet_file: str  # Path to the input parquet file
    output_formats: List[str] = ['csv', 'jsonl']  # List of desired output formats (default: ['csv', 'jsonl'])

class CreateTemplateRequest(BaseModel):
    template_name: str  # Name of the new template
    template_fields: List[str]  # List of field names for the template

@app.post("/prepare_dataset")
async def prepare_dataset(request: PrepareDatasetRequest):
    try:
        dataset = kitchen.prepare_dataset(
            source=request.source,
            template_name=request.template,
            num_samples=request.num_samples,
            augmentation_config={},
            output_file=request.output_file
        )
        return {"message": f"Dataset prepared and saved to {request.output_file}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_paraphrases")
async def generate_paraphrases(request: GenerateParaphrasesRequest):
    try:
        output_files = kitchen.generate_paraphrases(
            seed_file=request.seed_file,
            num_samples=request.num_samples,
            system_prompt=request.system_prompt
        )
        return {"message": f"Paraphrased content saved to: {', '.join(output_files)}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/augment_data")
async def augment_data(request: AugmentDataRequest):
    try:
        augmentation_config = {}  # Extend to accept augmentation config if needed
        output_file = kitchen.augment_data(seed_parquet=request.seed_parquet, augmentation_config=augmentation_config)
        return {"message": f"Augmented data saved to: {output_file}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/parse_text_to_parquet")
async def parse_text_to_parquet(request: ParseTextToParquetRequest):
    try:
        df, json_file, parquet_file = kitchen.dataset_manager.parse_text_to_parquet(
            request.text_content,
            request.template_name,
            request.filename
        )
        return {
            "message": "Parsing completed successfully",
            "json_file": json_file,
            "parquet_file": parquet_file,
            "dataframe_shape": df.shape
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/convert_parquet")
async def convert_parquet(request: ConvertParquetRequest):
    try:
        kitchen.dataset_manager.convert_parquet(request.parquet_file, request.output_formats)
        return {"message": f"Parquet file converted to {', '.join(request.output_formats)}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get_templates")
async def get_templates():
    try:
        templates = template_manager.get_templates()
        return {"templates": templates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/create_template")
async def create_template(request: CreateTemplateRequest):
    try:
        new_template = template_manager.create_template(request.template_name, request.template_fields)
        return {"message": f"Template '{request.template_name}' created successfully", "template": new_template}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8888)
    uvicorn.run(app, host="0.0.0.0", port=6333)