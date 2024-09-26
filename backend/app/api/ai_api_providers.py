from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List
from agentchef.agentchef_resources import LLMManager, model_data, OpenAILLM, OllamaLLM

router = APIRouter()

# Initialize LLMManager
llm_manager = LLMManager()

class Message(BaseModel):
    content: str

class APIKeyUpdate(BaseModel):
    provider: str
    api_key: str

def get_llm_manager():
    from agentchef.agentchef_resources import LLMManager
    return LLMManager()

# Dependency to get the LLMManager instance
def get_llm_manager_dependency():
    return get_llm_manager()

@router.post("/route_query")
async def route_query(message: Message, manager: Any = Depends(get_llm_manager_dependency)):
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
        raise HTTPException(status_code=404, detail="Model not found")
    return model_data['models'][model]

@router.get("/health")
async def health_check():
    return {"status": "healthy"}