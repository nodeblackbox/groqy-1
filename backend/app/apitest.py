from fastapi import FastAPI
from api.agentChef_api import app as agentchef_app
from api.gravrag_API import app as gravrag_app
from api.ai_api_providers import router as llm_router
import uvicorn

# Initialize FastAPI instance
app = FastAPI()

# Include all routers
#app.include_router(agentchef_app, tags=["agentchef"])
#app.include_router(gravrag_app, tags=["gravrag"])
app.include_router(llm_router, prefix="/llm", tags=["llm"])

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)