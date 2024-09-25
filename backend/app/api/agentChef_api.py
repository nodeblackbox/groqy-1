from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
from agentChef.cutlery import DatasetManager, TemplateManager, FileHandler, DocumentLoader
from agentChef.chef import DatasetKitchen, DataCollectionAgent, DataDigestionAgent, DataGenerationAgent, DataCleaningAgent, DataAugmentationAgent
from agentChef.utils.prompt_manager import PromptManager
from agentChef.ai_providers.ollama import OllamaProvider

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

# Initialize components
template_manager = TemplateManager(config['templates_dir'])
file_handler = FileHandler(config['input_dir'], config['output_dir'])
ollama_interface = OllamaProvider(config['ollama_config'])
prompt_manager = PromptManager()
document_loader = DocumentLoader()

# Initialize agents
collection_agent = DataCollectionAgent(template_manager, file_handler, document_loader)
digestion_agent = DataDigestionAgent(file_handler, ollama_interface)
generation_agent = DataGenerationAgent(ollama_interface, template_manager, prompt_manager)
cleaning_agent = DataCleaningAgent()
augmentation_agent = DataAugmentationAgent(ollama_interface, prompt_manager)

# Initialize DatasetManager and DatasetKitchen
dataset_manager = DatasetManager(
    ollama_interface,
    template_manager,
    config['input_dir'],
    config['output_dir']
)
kitchen = DatasetKitchen(config)

# Pydantic models for request bodies
class PrepareDatasetRequest(BaseModel):
    source: str
    template: str
    num_samples: int = 100
    output_file: str
    augmentation_config: Dict[str, Any] = {}

class GenerateParaphrasesRequest(BaseModel):
    seed_file: str
    num_samples: int = 1
    system_prompt: Optional[str] = None

class AugmentDataRequest(BaseModel):
    seed_parquet: str
    augmentation_config: Dict[str, Any] = {}

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

@app.post("/prepare_dataset")
async def prepare_dataset(request: PrepareDatasetRequest):
    try:
        # Step 1: Collect and structure data
        structured_data = collection_agent.collect_and_structure_data(request.source, request.template)
        
        # Step 2: Digest data
        digested_data = digestion_agent.digest_data(structured_data, request.template)

        # Step 3: Clean data
        cleaned_data = cleaning_agent.clean_data(digested_data)
        
        # Step 4: Augment data (if configured)
        if request.augmentation_config:
            augmented_data = augmentation_agent.augment_data(cleaned_data, request.augmentation_config)
        else:
            augmented_data = cleaned_data
        
        # Step 5: Generate synthetic data
        synthetic_data = generation_agent.generate_synthetic_data(
            augmented_data, 
            request.num_samples, 
            request.augmentation_config
        )
        
        # Step 6: Clean data again
        final_cleaned_data = cleaning_agent.clean_data(synthetic_data)
        
        # Save the final dataset
        file_handler.save_to_parquet(final_cleaned_data, request.output_file)
        
        return {"message": f"Dataset prepared and saved to {request.output_file}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_paraphrases")
async def generate_paraphrases(request: GenerateParaphrasesRequest):
    try:
        seed_data = file_handler.load_seed_data(request.seed_file)
        paraphrased_content = generation_agent.generate_paraphrases(
            seed_data, 
            request.num_samples, 
            request.system_prompt
        )
        output_files = file_handler.save_paraphrased_content(paraphrased_content, request.seed_file)
        return {"message": f"Paraphrased content saved to: {', '.join(output_files)}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/augment_data")
async def augment_data(request: AugmentDataRequest):
    try:
        seed_data = file_handler.load_seed_data(request.seed_parquet)
        augmented_data = augmentation_agent.augment_data(seed_data, request.augmentation_config)
        output_file = file_handler.save_to_parquet(augmented_data, f"augmented_{request.seed_parquet}")
        return {"message": f"Augmented data saved to: {output_file}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/parse_text_to_parquet")
async def parse_text_to_parquet(request: ParseTextToParquetRequest):
    try:
        df, json_file, parquet_file = digestion_agent.parse_text_to_parquet(
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
        file_handler.convert_parquet(request.parquet_file, request.output_formats)
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