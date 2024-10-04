
from fastapi import APIRouter, HTTPException, Depends
from app.models.neural_resources import Message, APIKeyUpdate
from app.services.neural_resources import llm_manager
from app.core.security import get_current_user

router = APIRouter()

@router.post("/route_query")
async def route_query(message: Message, current_user: dict = Depends(get_current_user)):
    response = llm_manager.route_query(message.content, message.role)
    if "error" in response:
        raise HTTPException(status_code=500, detail=response["error"])
    return response

@router.post("/set_api_key")
async def set_api_key(api_key_update: APIKeyUpdate, current_user: dict = Depends(get_current_user)):
    try:
        llm_manager.set_api_key(api_key_update.provider, api_key_update.api_key)
        return {"message": f"API key updated for {api_key_update.provider}"}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

@router.get("/available_models")
async def get_available_models(current_user: dict = Depends(get_current_user)):
    models = llm_manager.get_available_models()
    return {"available_models": models}

@router.get("/model_info/{model}")
async def get_model_info(model: str, current_user: dict = Depends(get_current_user)):
    model_info = llm_manager.get_model_info(model)
    if "error" in model_info:
        raise HTTPException(status_code=404, detail=model_info["error"])
    return model_info