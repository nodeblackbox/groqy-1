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

class CreateTemplateRequest(BaseModel):
    template_name: str
    template_fields: List[str]

# GravRAG API models
class MemoryInputModel(BaseModel):
    content: str
    metadata: Optional[Dict[str, Any]] = {}

# # AgentChef API endpoints
# @app.post("/agentchef/prepare_dataset")
# async def prepare_dataset(request: PrepareDatasetRequest):
#     try:
#         dataset = kitchen.prepare_dataset(
#             source=request.source,
#             template_name=request.template,
#             num_samples=request.num_samples,
#             augmentation_config={},
#             output_file=request.output_file
#         )
#         return {"message": f"Dataset prepared and saved to {request.output_file}"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.post("/agentchef/generate_paraphrases")
# async def generate_paraphrases(request: GenerateParaphrasesRequest):
#     try:
#         output_files = kitchen.generate_paraphrases(
#             seed_file=request.seed_file,
#             num_samples=request.num_samples,
#             system_prompt=request.system_prompt
#         )
#         return {"message": f"Paraphrased content saved to: {', '.join(output_files)}"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.post("/agentchef/augment_data")
# async def augment_data(request: AugmentDataRequest):
#     try:
#         augmentation_config = {}
#         output_file = kitchen.augment_data(seed_parquet=request.seed_parquet, augmentation_config=augmentation_config)
#         return {"message": f"Augmented data saved to: {output_file}"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.post("/agentchef/parse_text_to_parquet")
# async def parse_text_to_parquet(request: ParseTextToParquetRequest):
#     try:
#         df, json_file, parquet_file = kitchen.dataset_manager.parse_text_to_parquet(
#             request.text_content,
#             request.template_name,
#             request.filename
#         )
#         return {
#             "message": "Parsing completed successfully",
#             "json_file": json_file,
#             "parquet_file": parquet_file,
#             "dataframe_shape": df.shape
#         }
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.post("/agentchef/convert_parquet")
# async def convert_parquet(request: ConvertParquetRequest):
#     try:
#         kitchen.dataset_manager.convert_parquet(request.parquet_file, request.output_formats)
#         return {"message": f"Parquet file converted to {', '.join(request.output_formats)}"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.get("/agentchef/get_templates")
# async def get_templates():
#     try:
#         templates = template_manager.get_templates()
#         return {"templates": templates}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.post("/agentchef/create_template")
# async def create_template(request: CreateTemplateRequest):
#     try:
#         new_template = template_manager.create_template(request.template_name, request.template_fields)
#         return {"message": f"Template '{request.template_name}' created successfully", "template": new_template}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# GravRAG API endpoints
@app.post("/gravrag/memory/create")
async def create_memory(memory_input: MemoryInputModel):
    try:
        await Knowledge.create_memory(memory_input.content, memory_input.metadata)
        return {"message": "Memory created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")

@app.get("/gravrag/memory/recall")
async def recall_memory(query: str, top_k: int = 5):
    try:
        results = await Knowledge.recall_memory(query, top_k)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")

@app.post("/gravrag/memory/prune")
async def prune_memories():
    try:
        await Knowledge.prune_memories()
        return {"message": "Pruning complete"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")

async def run_server(app, host, port):
    config = uvicorn.Config(app, host=host, port=port)
    server = uvicorn.Server(config)
    await server.serve()

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    tasks = [
        run_server(app, "0.0.0.0", 8888),  # AgentChef API
        run_server(app, "0.0.0.0", 6333)   # GravRAG API
    ]
    loop.run_until_complete(asyncio.gather(*tasks))