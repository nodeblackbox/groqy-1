from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from neural_resources.neural_resources import LLMManager
import logging

router = APIRouter()

logger = logging.getLogger(__name__)

llm_manager = LLMManager()

class Message(BaseModel):
    content: str
    model: Optional[str] = None

class APIKeyUpdate(BaseModel):
    provider: str
    api_key: str

@router.post("/route_query")
async def route_query(message: Message):
    logger.info(f"Received route_query request for model: {message.model}")
    try:
        response = llm_manager.route_query(message.content, message.model)
        if "error" in response:
            logger.warning(f"Error in route_query: {response['error']}")
            raise HTTPException(status_code=400, detail=response["error"])
        logger.info("Successfully routed query and received response")
        return {"response": response}
    except Exception as e:
        logger.exception(f"Unexpected error in route_query: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@router.post("/set_api_key")
async def set_api_key(api_key_update: APIKeyUpdate):
    logger.info(f"Received request to update API key for provider: {api_key_update.provider}")
    try:
        llm_manager.set_api_key(api_key_update.provider, api_key_update.api_key)
        logger.info(f"Successfully updated API key for provider: {api_key_update.provider}")
        return {"message": f"API key updated for {api_key_update.provider}"}
    except ValueError as ve:
        logger.error(f"Invalid input for set_api_key: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.exception(f"Unexpected error in set_api_key: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@router.get("/available_models")
async def get_available_models():
    logger.info("Received request for available models")
    try:
        models = llm_manager.get_available_models()
        logger.info(f"Retrieved available models: {', '.join(models)}")
        return {"available_models": models}
    except Exception as e:
        logger.exception(f"Unexpected error in get_available_models: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@router.get("/model_info/{model}")
async def get_model_info(model: str):
    logger.info(f"Received model_info request for model: {model}")
    try:
        info = llm_manager.get_model_info(model)
        if "error" in info:
            logger.warning(f"Error in get_model_info: {info['error']}")
            raise HTTPException(status_code=404, detail=info["error"])
        logger.info(f"Retrieved model info for model: {model}")
        return info
    except Exception as e:
        logger.exception(f"Unexpected error in get_model_info: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")