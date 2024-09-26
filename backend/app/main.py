from fastapi import FastAPI
from api.agentChef_api import router as agentchef_router
from api.gravrag_API import router as gravrag_router
import uvicorn

# Create the FastAPI app
app = FastAPI()

# Include routers from both modules
app.include_router(agentchef_router, prefix="/agentchef", tags=["AgentChef"])
app.include_router(gravrag_router, prefix="/gravrag", tags=["GravRAG"])

# Main entry point
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8888)
