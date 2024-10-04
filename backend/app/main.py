from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Importing Routers
from api.agentChef_api import router as agentchef_router
from api.gravrag_api import router as gravrag_router
from api.neural_resources_api import router as neural_resources_router  # New neural resources router

app = FastAPI(title="Cogenesis Backend API", description="API for managing AI agents and models")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers for each module
app.include_router(agentchef_router, prefix="/agentchef", tags=["AgentChef API"])
app.include_router(gravrag_router, prefix="/gravrag", tags=["GravRAG API"])
app.include_router(neural_resources_router, prefix="/neural_resources", tags=["Neural Resources API"])  # Adding neural resources


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
