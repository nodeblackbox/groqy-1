from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from oarc import ollama_chatbot_base

app = FastAPI()

# Initialize DatasetKitchen and other components
chatbotbase = ollama_chatbot_base()

class start_chatbot(BaseModel):
    modelname: str  # Path to the source data file or URL
    
@app.post("/start_chatbot")
async def start_chatbot(request: StartChatbotRequest):
    """
    """
    try:
        chatbotbase = start

        return {"message": f"Dataset prepared and saved to {request.output_file}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
