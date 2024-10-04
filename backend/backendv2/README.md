# Project Structure

```
backendv2/
├── .env
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── makeIt.py
├── README.md
├── requirements.txt
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── gravrag.py
│   │   ├── neural_resources.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   ├── models/
│   │   ├── gravrag.py
│   │   ├── neural_resources.py
│   ├── services/
│   │   ├── gravrag.py
│   │   ├── neural_resources.py
├── projectMakeit/
│   ├── runGravRag.ipynb
│   ├── test2.MD
│   ├── test3.sh
├── tests/
│   ├── test_gravrag.py
│   ├── test_neural_resources.py
```

# File Contents

## `.env`

```

ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
QDRANT_HOST=qdrant
QDRANT_PORT=6333
```

## `.gitignore`

```

# Python
__pycache__/
*.py[cod]
*.pyo
*.pyd
.Python
env/
venv/
pip-log.txt
pip-delete-this-directory.txt

# Environments
.env
.venv
env/
venv/

# IDEs
.vscode/
.idea/

# Logs
*.log

# Docker
.docker/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
```

## `docker-compose.yml`

```

version: '3.9.11'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
      - QDRANT_HOST=qdrant
      - QDRANT_PORT=6333
    depends_on:
      - qdrant

  qdrant:
    image: qdrant/qdrant
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

volumes:
  qdrant_data:
```

## `Dockerfile`

```

FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## `makeIt.py`

```
import os
import re

def create_file_from_content(base_dir, file_path, content):
    full_path = os.path.join(base_dir, file_path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Created file: {full_path}")

def parse_readme_and_create_files(readme_path):
    with open(readme_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Get the directory of the README file
    base_dir = os.path.dirname(readme_path)

    # Split the content into sections based on the numbered file paths
    sections = re.split(r'\n\d+\.\s+`([^`]+)`:', content)

    # The first element is the text before any file paths, so we skip it
    sections = sections[1:]

    for i in range(0, len(sections), 2):
        file_path = sections[i].strip()
        file_content = sections[i + 1].strip() if i + 1 < len(sections) else ""

        # Remove the leading newline and any code block markers
        file_content = re.sub(r'^\n+```\w*\n', '', file_content)
        file_content = re.sub(r'\n+```\s*$', '', file_content)

        create_file_from_content(base_dir, file_path, file_content)

if __name__ == "__main__":
    # Use raw string for Windows file path
    script_dir = os.path.dirname(os.path.abspath(__file__))
    default_path = os.path.join(script_dir, "test2.MD")
    readme_path = input(f"Enter the path to your README file (press Enter to use default: {default_path}): ")
    
    if not readme_path:
        readme_path = default_path

    # Ensure the path is properly formatted for Windows
    readme_path = os.path.normpath(readme_path)

    if not os.path.exists(readme_path):
        print(f"Error: The file {readme_path} does not exist.")
    else:
        parse_readme_and_create_files(readme_path)
        print("File generation complete!")
```

## `README.md`

```

# Cogenesis Backend API

This project implements a comprehensive backend API for the Cogenesis system, integrating GravRag memory management and Neural Resources for AI model interactions.

## Features

- GravRag memory management (create, recall, prune)
- Neural Resources for interacting with various AI models (Anthropic, OpenAI, Groq, Ollama)
- Authentication and authorization
- Docker support
- Prometheus metrics

## Getting Started

### Prerequisites

- Python 3.9+
- Docker and Docker Compose (optional)

### Installation

1. Clone the repository:

```

git clone https://github.com/your-repo/cogenesis-backend.git
cd cogenesis-backend

```

2. Create a virtual environment and activate it:

```

python -m venv venv
source venv/bin/activate  # On Windows, use `venv\\Scripts\\activate`

```

3. Install the dependencies:

```

pip install -r requirements.txt

```

4. Set up environment variables:
Create a `.env` file in the root directory and add the following:

```

ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
QDRANT_HOST=localhost
QDRANT_PORT=6333
JWT_SECRET_KEY=your_jwt_secret_key

```

### Running the Application

#### Using Python

1. Start the Qdrant server (if not using Docker):

```

qdrant

```

2. Run the FastAPI application:

```

uvicorn app.main:app --reload

```

#### Using Docker

1. Build and run the Docker containers:

```

docker-compose up --build

```

The API will be available at `http://localhost:8000`.

## API Documentation

Once the application is running, you can access the Swagger UI documentation at `http://localhost:8000/docs`.

## Testing

Run the tests using pytest:

```

pytest

```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

```

This comprehensive implementation includes all the components we've discussed, incorporating improvements such as authentication, Docker support, asynchronous operations, error handling, and more. The project structure is organized for scalability and maintainability.

To run this project:

1. Set up the environment variables in the `.env` file.
2. Install the dependencies using `pip install -r requirements.txt`.
3. Run the application using `uvicorn app.main:app --reload` or use Docker with `docker-compose up --build`.

The API will be available at `http://localhost:8000`, and you can access the Swagger UI documentation at `http://localhost:8000/docs`.

Remember to implement proper error handling, logging, and security measures in a production environment. Also, consider adding more comprehensive tests and documentation as the project evolves.
```

## `requirements.txt`

```

fastapi==0.68.0
uvicorn==0.15.0
pydantic==1.8.2
python-dotenv==0.19.0
qdrant-client==0.11.0
sentence-transformers==2.1.0
anthropic==0.2.8
openai==0.27.0
groq==0.1.0
requests==2.26.0
python-jose==3.3.0
passlib==1.7.4
bcrypt==3.2.0
prometheus-client==0.11.0
```

## `app\main.py`

```

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import make_asgi_app

from app.api import gravrag, neural_resources

app = FastAPI(title="Cogenesis Backend API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Prometheus metrics
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# Include routers
app.include_router(gravrag.router, prefix="/gravrag", tags=["GravRag"])
app.include_router(neural_resources.router, prefix="/neural_resources", tags=["Neural Resources"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Cogenesis Backend API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## `app\api\gravrag.py`

```

from fastapi import APIRouter, HTTPException, Depends
from app.models.gravrag import MemoryRequest, RecallRequest, PruneRequest
from app.services.gravrag import memory_manager
from app.core.security import get_current_user

router = APIRouter()

@router.post("/create_memory")
async def create_memory(memory_request: MemoryRequest, current_user: dict = Depends(get_current_user)):
    if not memory_request.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
    try:
        await memory_manager.create_memory(content=memory_request.content, metadata=memory_request.metadata)
        return {"message": "Memory created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating memory: {str(e)}")

@router.post("/recall_memory")
async def recall_memory(recall_request: RecallRequest, current_user: dict = Depends(get_current_user)):
    if not recall_request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    try:
        memories = await memory_manager.recall_memory(query_content=recall_request.query, top_k=recall_request.top_k)
        if not memories:
            return {"message": "No relevant memories found"}
        return {"memories": memories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error recalling memories: {str(e)}")

@router.post("/prune_memories")
async def prune_memories(prune_request: PruneRequest, current_user: dict = Depends(get_current_user)):
    try:
        await memory_manager.prune_memories()
        return {"message": "Memory pruning completed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error pruning memories: {str(e)}")
```

## `app\api\neural_resources.py`

```

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
```

## `app\core\config.py`

```

from pydantic import BaseSettings

class Settings(BaseSettings):
    ANTHROPIC_API_KEY: str
    OPENAI_API_KEY: str
    GROQ_API_KEY: str
    QDRANT_HOST: str
    QDRANT_PORT: int
    JWT_SECRET_KEY: str = "your-secret-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
```

## `app\core\security.py`

```

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    return token_data
```

## `app\models\gravrag.py`

```

from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class MemoryPacket(BaseModel):
    vector: List[float]
    metadata: Dict[str, Any]

class MemoryRequest(BaseModel):
    content: str
    metadata: Optional[Dict[str, Any]] = None

class RecallRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5

class PruneRequest(BaseModel):
    gravity_threshold: Optional[float] = 1e-5
```

## `app\models\neural_resources.py`

```

from pydantic import BaseModel

class Message(BaseModel):
    content: str
    role: str

class APIKeyUpdate(BaseModel):
    provider: str
    api_key: str
```

## `app\services\gravrag.py`

```

import time
import math
import uuid
import logging
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

from app.core.config import settings
from app.models.gravrag import MemoryPacket

logger = logging.getLogger(__name__)

GRAVITATIONAL_THRESHOLD = 1e-5

class MemoryManager:
    def __init__(self):
        self.qdrant_client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)
        self.collection_name = "Mind"
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self._setup_collection()

    def _setup_collection(self):
        try:
            self.qdrant_client.get_collection(self.collection_name)
            logger.info(f"Collection '{self.collection_name}' exists.")
        except Exception:
            logger.info(f"Creating collection '{self.collection_name}'.")
            self.qdrant_client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=self.model.get_sentence_embedding_dimension(), distance=Distance.COSINE)
            )

    async def create_memory(self, content: str, metadata: Dict[str, Any]):
        vector = self.model.encode(content).tolist()
        memory_packet = MemoryPacket(vector=vector, metadata=metadata)
        point_id = str(uuid.uuid4())

        self.qdrant_client.upsert(
            collection_name=self.collection_name,
            points=[PointStruct(id=point_id, vector=vector, payload=memory_packet.dict())]
        )
        logger.info(f"Memory created successfully with ID: {point_id}")

    async def recall_memory(self, query_content: str, top_k: int = 5):
        query_vector = self.model.encode(query_content).tolist()

        results = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=top_k
        )

        memories = [MemoryPacket(**hit.payload) for hit in results]

        for memory in memories:
            self._update_relevance(memory, query_vector)

        return [memory.metadata for memory in memories]

    def _update_relevance(self, memory: MemoryPacket, query_vector: List[float]):
        memory.metadata["semantic_relativity"] = self._calculate_cosine_similarity(memory.vector, query_vector)
        memory.metadata["memetic_similarity"] = self._calculate_memetic_similarity(memory.metadata)
        memory.metadata["gravitational_pull"] = self._calculate_gravitational_pull(memory)
        memory.metadata["spacetime_coordinate"] = self._calculate_spacetime_coordinate(memory)

    @staticmethod
    def _calculate_cosine_similarity(vector_a: List[float], vector_b: List[float]) -> float:
        dot_product = sum(a * b for a, b in zip(vector_a, vector_b))
        magnitude_a = math.sqrt(sum(a ** 2 for a in vector_a))
        magnitude_b = math.sqrt(sum(b ** 2 for b in vector_b))

        if magnitude_a == 0 or magnitude_b == 0:
            return 0.0

        return dot_product / (magnitude_a * magnitude_b)

    @staticmethod
    def _calculate_memetic_similarity(metadata: Dict[str, Any]) -> float:
        tags = set(metadata.get("tags", []))
        reference_tags = set(metadata.get("reference_tags", []))

        if not tags or not reference_tags:
            return 1.0

        intersection = len(tags.intersection(reference_tags))
        union = len(tags.union(reference_tags))

        return intersection / union if union > 0 else 1.0

    @staticmethod
    def _calculate_gravitational_pull(memory: MemoryPacket) -> float:
        vector_magnitude = math.sqrt(sum(x ** 2 for x in memory.vector))
        recall_count = memory.metadata.get("recall_count", 0)
        memetic_similarity = memory.metadata.get("memetic_similarity", 1.0)
        semantic_relativity = memory.metadata.get("semantic_relativity", 1.0)

        return vector_magnitude * (1 + math.log1p(recall_count)) * memetic_similarity * semantic_relativity

    @staticmethod
    def _calculate_spacetime_coordinate(memory: MemoryPacket) -> float:
        time_decay_factor = 1 + (time.time() - memory.metadata.get("timestamp", time.time()))
        return memory.metadata["gravitational_pull"] / time_decay_factor

    async def prune_memories(self):
        total_points = self.qdrant_client.count(self.collection_name).count
        if total_points > 1000000:  # Arbitrary limit
            points = self.qdrant_client.scroll(self.collection_name, limit=1000)
            low_relevance_points = [
                p.id for p in points if p.payload['metadata']['gravitational_pull'] < GRAVITATIONAL_THRESHOLD
            ]
            if low_relevance_points:
                self.qdrant_client.delete(
                    collection_name=self.collection_name,
                    points_selector={"points": low_relevance_points}
                )
                logger.info(f"Pruned {len(low_relevance_points)} low-relevance memories.")

memory_manager = MemoryManager()
```

## `app\services\neural_resources.py`

```

import os
import logging
from typing import List, Dict, Any, Optional
from anthropic import Anthropic
import openai
from groq import Groq
import requests

from app.core.config import settings

logger = logging.getLogger(__name__)

class AIAsset:
    def __init__(self, api_key: str):
        self.api_key = api_key

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        raise NotImplementedError

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        raise NotImplementedError

class AnthropicLLM(AIAsset):
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.client = Anthropic(api_key=api_key)
        logger.info("Anthropic LLM initialized")

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for Anthropic model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to Anthropic LLM")
            return {"error": "Empty message provided"}
        try:
            response = self.client.messages.create(
                model=model,
                messages=[{"role": role, "content": message}],
            )
            logger.info(f"Successfully created message with Anthropic model: {model}")
            return response.model_dump()
        except Exception as e:
            logger.exception(f"Error creating message for Anthropic: {str(e)}")
            return {"error": f"Anthropic failed: {str(e)}"}

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        return response.get('usage', {}).get('output_tokens', 0)

class OpenAILLM(AIAsset):
    def __init__(self, api_key: str):
        super().__init__(api_key)
        openai.api_key = api_key
        logger.info("OpenAI LLM initialized")

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for OpenAI model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to OpenAI LLM")
            return {"error": "Empty message provided"}
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=[{"role": role, "content": message}],
            )
            logger.info(f"Successfully created message with OpenAI model: {model}")
            return response.to_dict()
        except Exception as e:
            logger.exception(f"Error creating message for OpenAI: {str(e)}")
            return {"error": f"OpenAI failed: {str(e)}"}

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        return response.get('usage', {}).get('completion_tokens', 0)

class GroqLLM(AIAsset):
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.client = Groq(api_key=api_key)
        logger.info("Groq LLM initialized")

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for Groq model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to Groq LLM")
            return {"error": "Empty message provided"}
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[{"role": role, "content": message}],
            )
            logger.info(f"Successfully created message with Groq model: {model}")
            return response.to_dict()
        except Exception as e:
            logger.exception(f"Error creating message for Groq: {str(e)}")
            return {"error": f"Groq failed: {str(e)}"}

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        return response.get('usage', {}).get('completion_tokens', 0)

class OllamaLLM(AIAsset):
    def __init__(self, base_url: str = "<http://localhost:11434>"):
        super().__init__(api_key="")
        self.base_url = base_url
        logger.info(f"Ollama LLM initialized with base URL: {base_url}")

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for Ollama model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to Ollama LLM")
            return {"error": "Empty message provided"}
        try:
            url = f"{self.base_url}/api/generate"
            payload = {
                "model": model,
                "role": role,
                "prompt": message,
                "stream": False
            }
            response = requests.post(url, json=payload, timeout=30)
            response.raise_for_status()
            logger.info(f"Successfully created message with Ollama model: {model}")
            return response.json()
        except requests.RequestException as e:
            logger.exception(f"Error creating message for Ollama: {str(e)}")
            return {"error": f"Ollama failed: {str(e)}"}

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        return len(response.get('response', '').split())

class LLMManager:
    def __init__(self):
        self.llm_models: Dict[str, AIAsset] = {}
        self.overridden_keys: Dict[str, str] = {}
        self.models_cache = {}  # Cache to store fetched model info
        self._initialize_models()
        logger.info("LLMManager initialized")

    def _initialize_models(self):
        logger.debug("Initializing AI models")
        for provider, api_key in self._load_api_keys().items():
            if api_key:
                llm_instance = self._create_llm_instance(provider, api_key)
                if llm_instance:
                    self.llm_models[provider] = llm_instance
        self.llm_models["ollama"] = OllamaLLM()
        logger.info(f"Initialized models: {', '.join(self.llm_models.keys())}")

    def _load_api_keys(self) -> Dict[str, str]:
        logger.debug("Loading API keys")
        keys = {
            "anthropic": self.overridden_keys.get('anthropic', settings.ANTHROPIC_API_KEY),
            "openai": self.overridden_keys.get('openai', settings.OPENAI_API_KEY),
            "groq": self.overridden_keys.get('groq', settings.GROQ_API_KEY),
        }
        for provider, key in keys.items():
            if key:
                logger.info(f"API key loaded for {provider}")
            else:
                logger.warning(f"No API key found for {provider}")
        return keys

    def _create_llm_instance(self, provider: str, api_key: str) -> Optional[AIAsset]:
        logger.debug(f"Creating LLM instance for provider: {provider}")
        if provider == "anthropic":
            return AnthropicLLM(api_key)
        elif provider == "openai":
            return OpenAILLM(api_key)
        elif provider == "groq":
            return GroqLLM(api_key)
        else:
            logger.warning(f"Unknown provider: {provider}")
            return None

    def set_api_key(self, provider: str, api_key: str):
        logger.info(f"Setting API key for provider: {provider}")
        if not provider or not api_key:
            logger.error("Invalid provider or API key provided")
            raise ValueError("Both provider and api_key must be non-empty strings")
        self.overridden_keys[provider] = api_key
        self._initialize_models()

    def get_available_models(self) -> List[str]:
        models = []

        # Fetch Ollama models
        try:
            logger.info("Fetching Ollama models")
            ollama_response = requests.get("<http://localhost:11434/api/tags>")
            if ollama_response.status_code == 200:
                ollama_data = ollama_response.json()
                ollama_models = [model['name'] for model in ollama_data.get('models', [])]
                models.extend(ollama_models)
            else:
                logger.error(f"Failed to fetch Ollama models: {ollama_response.status_code}")
        except Exception as e:
            logger.error(f"Error fetching Ollama models: {str(e)}")

        # Fetch Groq models
        try:
            logger.info("Fetching Groq models")
            groq_api_key = settings.GROQ_API_KEY
            groq_response = requests.get(
                "<https://api.groq.com/openai/v1/models>",
                headers={
                    "Authorization": f"Bearer {groq_api_key}",
                    "Content-Type": "application/json"
                }
            )
            if groq_response.status_code == 200:
                groq_models_data = groq_response.json()
                groq_models = groq_models_data.get("data", [])
                models.extend([model['id'] for model in groq_models])
            else:
                logger.error(f"Failed to fetch Groq models: {groq_response.status_code}")
        except Exception as e:
            logger.error(f"Error fetching Groq models: {str(e)}")

        logger.debug(f"Available models: {', '.join(models)}")
        return models

    def route_query(self, message: str, role: str, model: Optional[str] = None) -> Dict[str, Any]:
        logger.info(f"Routing query to {'specified model: ' + model if model else 'default model'}")
        if not message.strip():
            logger.warning("Empty message provided to route_query")
            return {"error": "Empty message provided"}

        if model:
            for provider, llm in self.llm_models.items():
                try:
                    logger.debug(f"Attempting to create message with provider: {provider}, model: {model}")
                    response = llm.create_message(model, role, message)
                    if "error" not in response:
                        logger.info(f"Successfully created message with provider: {provider}, model: {model}")
                        return response
                    logger.warning(f"Error with {provider}, model {model}: {response['error']}")
                except Exception as e:
                    logger.exception(f"Unexpected error with {provider}, model {model}: {str(e)}")

            logger.error(f"Specified model {model} is not available or failed for all providers")
            return {"error": f"Specified model {model} is not available or failed for all providers"}

        for provider, llm in self.llm_models.items():
            try:
                logger.debug(f"Attempting to create message with provider: {provider}")
                response = llm.create_message(provider, role, message)
                if "error" not in response:
                    logger.info(f"Successfully created message with provider: {provider}")
                    return response
                logger.warning(f"Error with {provider}: {response['error']}")
            except Exception as e:
                logger.exception(f"Unexpected error with {provider}: {str(e)}")

        logger.error("No available models could process the request")
        return {"error": "No available models could process the request"}

    def get_model_info(self, model: str) -> Dict[str, Any]:
        logger.info(f"Retrieving model info for model: {model}")

        # Check if the model info is cached
        if model in self.models_cache:
            logger.debug(f"Model info for {model} retrieved from cache.")
            return self.models_cache[model]

        try:
            # Fetch from Ollama
            available_models = self.get_available_models()
            if model in available_models:
                logger.info(f"Fetching model info from Ollama for model: {model}")
                url = f"{self.llm_models['ollama'].base_url}/api/models/{model}"
                ollama_response = requests.get(url)
                if ollama_response.status_code == 200:
                    model_info = ollama_response.json()
                    self.models_cache[model] = model_info
                    logger.debug(f"Fetched Ollama model info: {model_info}")
                    return model_info
                else:
                    logger.error(f"Failed to fetch Ollama model info: {ollama_response.status_code}, Response: {ollama_response.text}")

            # Fetch from Groq
            groq_api_key = settings.GROQ_API_KEY
            if groq_api_key:
                logger.info(f"Fetching model info from Groq for model: {model}")
                url = f"<https://api.groq.com/openai/v1/models/{model}>"
                groq_response = requests.get(
                    url,
                    headers={
                        "Authorization": f"Bearer {groq_api_key}",
                        "Content-Type": "application/json"
                    }
                )
                if groq_response.status_code == 200:
                    model_info = groq_response.json()
                    self.models_cache[model] = model_info
                    logger.debug(f"Fetched Groq model info: {model_info}")
                    return model_info
                else:
                    logger.error(f"Failed to fetch Groq model info: {groq_response.status_code}, Response: {groq_response.text}")
        except Exception as e:
            logger.error(f"Error fetching model info for {model}: {str(e)}")
            return {"error": f"Model {model} not found or failed to retrieve info."}

        logger.error(f"Model {model} not found in any provider.")
        return {"error": f"Model {model} not found in any provider."}

llm_manager = LLMManager()
```

## `projectMakeit\runGravRag.ipynb`

```
{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": 2,
   "metadata": {},
   "outputs": [
    {
     "ename": "ImportError",
     "evalue": "cannot import name 'PointIdsSelector' from 'qdrant_client.http.models' (c:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\qdrant_client\\http\\models\\__init__.py)",
     "output_type": "error",
     "traceback": [
      "\u001b[1;31m---------------------------------------------------------------------------\u001b[0m",
      "\u001b[1;31mImportError\u001b[0m                               Traceback (most recent call last)",
      "Cell \u001b[1;32mIn[2], line 11\u001b[0m\n\u001b[0;32m      9\u001b[0m \u001b[38;5;28;01mfrom\u001b[39;00m \u001b[38;5;21;01mqdrant_client\u001b[39;00m \u001b[38;5;28;01mimport\u001b[39;00m QdrantClient\n\u001b[0;32m     10\u001b[0m \u001b[38;5;28;01mfrom\u001b[39;00m \u001b[38;5;21;01mqdrant_client\u001b[39;00m\u001b[38;5;21;01m.\u001b[39;00m\u001b[38;5;21;01mmodels\u001b[39;00m \u001b[38;5;28;01mimport\u001b[39;00m Distance, VectorParams, PointStruct\n\u001b[1;32m---> 11\u001b[0m \u001b[38;5;28;01mfrom\u001b[39;00m \u001b[38;5;21;01mqdrant_client\u001b[39;00m\u001b[38;5;21;01m.\u001b[39;00m\u001b[38;5;21;01mhttp\u001b[39;00m\u001b[38;5;21;01m.\u001b[39;00m\u001b[38;5;21;01mmodels\u001b[39;00m \u001b[38;5;28;01mimport\u001b[39;00m PointIdsSelector\n\u001b[0;32m     12\u001b[0m \u001b[38;5;28;01mfrom\u001b[39;00m \u001b[38;5;21;01msklearn\u001b[39;00m\u001b[38;5;21;01m.\u001b[39;00m\u001b[38;5;21;01mmetrics\u001b[39;00m\u001b[38;5;21;01m.\u001b[39;00m\u001b[38;5;21;01mpairwise\u001b[39;00m \u001b[38;5;28;01mimport\u001b[39;00m cosine_similarity\n\u001b[0;32m     13\u001b[0m \u001b[38;5;28;01mfrom\u001b[39;00m \u001b[38;5;21;01msentence_transformers\u001b[39;00m \u001b[38;5;28;01mimport\u001b[39;00m SentenceTransformer\n",
      "\u001b[1;31mImportError\u001b[0m: cannot import name 'PointIdsSelector' from 'qdrant_client.http.models' (c:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\qdrant_client\\http\\models\\__init__.py)"
     ]
    }
   ],
   "source": [
    "import os\n",
    "import time\n",
    "import math\n",
    "import uuid\n",
    "import logging\n",
    "from typing import List, Dict, Any, Optional\n",
    "import requests\n",
    "import qdrant_client\n",
    "from qdrant_client import QdrantClient\n",
    "from qdrant_client.models import Distance, VectorParams, PointStruct\n",
    "from qdrant_client.http import models as rest\n",
    "from qdrant_client.http.models import Filter, FieldCondition, Range\n",
    "from sklearn.metrics.pairwise import cosine_similarity\n",
    "from sentence_transformers import SentenceTransformer\n",
    "from fastapi import FastAPI, APIRouter, HTTPException, Depends\n",
    "from fastapi.middleware.cors import CORSMiddleware\n",
    "from pydantic import BaseModel\n",
    "import uvicorn\n",
    "\n",
    "\n",
    "import asyncio\n",
    "import uuid\n",
    "import logging\n",
    "from typing import List, Dict, Any\n",
    "from sentence_transformers import SentenceTransformer\n",
    "from qdrant_client import AsyncQdrantClient\n",
    "from qdrant_client.http import models as rest\n",
    "from qdrant_client.http.models import Filter, FieldCondition, Range\n",
    "\n",
    "\n",
    "\n",
    "# Configure logging\n",
    "logging.basicConfig(level=logging.INFO)\n",
    "logger = logging.getLogger(__name__)\n",
    "\n",
    "# Gravitational constants and thresholds\n",
    "GRAVITATIONAL_THRESHOLD = 1e-5  # This can be adjusted based on system requirements\n",
    "\n",
    "class MemoryPacket:\n",
    "    def __init__(self, vector: List[float], metadata: Dict[str, Any]):\n",
    "        self.vector = vector  # Semantic vector from SentenceTransformer\n",
    "        self.metadata = metadata or {}\n",
    "\n",
    "        # Default metadata if not provided\n",
    "        self.metadata.setdefault(\"timestamp\", time.time())  # Timestamp of creation\n",
    "        self.metadata.setdefault(\"recall_count\", 0)  # How many times this memory was recalled\n",
    "        self.metadata.setdefault(\"memetic_similarity\", self.calculate_memetic_similarity())  # Dynamically calculated\n",
    "        self.metadata.setdefault(\"semantic_relativity\", 1.0)  # Will be updated during query\n",
    "        self.metadata.setdefault(\"gravitational_pull\", self.calculate_gravitational_pull())\n",
    "        self.metadata.setdefault(\"spacetime_coordinate\", self.calculate_spacetime_coordinate())\n",
    "\n",
    "    def calculate_gravitational_pull(self) -> float:\n",
    "        \"\"\"\n",
    "        Gravitational pull incorporates vector magnitude, recall count, memetic similarity, and semantic relativity.\n",
    "        \"\"\"\n",
    "        vector_magnitude = math.sqrt(sum(x ** 2 for x in self.vector))\n",
    "        recall_count = self.metadata[\"recall_count\"]\n",
    "        memetic_similarity = self.metadata[\"memetic_similarity\"]\n",
    "        semantic_relativity = self.metadata[\"semantic_relativity\"]\n",
    "\n",
    "        # Dynamically calculate gravitational pull\n",
    "        gravitational_pull = vector_magnitude * (1 + math.log1p(recall_count)) * memetic_similarity * semantic_relativity\n",
    "        self.metadata[\"gravitational_pull\"] = gravitational_pull\n",
    "        return gravitational_pull\n",
    "\n",
    "    def calculate_spacetime_coordinate(self) -> float:\n",
    "        \"\"\"\n",
    "        Spacetime coordinate is a decaying function of gravitational pull and time.\n",
    "        \"\"\"\n",
    "        time_decay_factor = 1 + (time.time() - self.metadata.get(\"timestamp\", time.time()))\n",
    "        spacetime_coordinate = self.metadata[\"gravitational_pull\"] / time_decay_factor\n",
    "        self.metadata[\"spacetime_coordinate\"] = spacetime_coordinate\n",
    "        return spacetime_coordinate\n",
    "\n",
    "    def update_relevance(self, query_vector: List[float]):\n",
    "        \"\"\"\n",
    "        Update relevance when recalling a memory. This recalculates semantic relativity, memetic similarity,\n",
    "        gravitational pull, and spacetime coordinate.\n",
    "        \"\"\"\n",
    "        # Recalculate semantic similarity with the query vector (cosine similarity)\n",
    "        self.metadata[\"semantic_relativity\"] = self.calculate_cosine_similarity(self.vector, query_vector)\n",
    "\n",
    "        # Recalculate memetic similarity based on dynamic contextual information\n",
    "        self.metadata[\"memetic_similarity\"] = self.calculate_memetic_similarity()\n",
    "\n",
    "        # Update gravitational pull and spacetime coordinate\n",
    "        self.calculate_gravitational_pull()\n",
    "        self.calculate_spacetime_coordinate()\n",
    "\n",
    "    def calculate_memetic_similarity(self) -> float:\n",
    "        \"\"\"\n",
    "        Dynamically calculate memetic similarity based on tags, recurrence, or any other contextual factors.\n",
    "        This example uses a simple Jaccard similarity between tags, but it can be extended with more complex logic.\n",
    "        \"\"\"\n",
    "        if \"tags\" not in self.metadata:\n",
    "            return 1.0  # Default if no tags are present\n",
    "\n",
    "        # Example: Jaccard similarity between tags and reference tags\n",
    "        tags = set(self.metadata.get(\"tags\", []))\n",
    "        reference_tags = set(self.metadata.get(\"reference_tags\", []))  # Reference memory or system-level tags\n",
    "\n",
    "        if not tags or not reference_tags:\n",
    "            return 1.0  # No tags to compare, assume full similarity\n",
    "\n",
    "        intersection = len(tags.intersection(reference_tags))\n",
    "        union = len(tags.union(reference_tags))\n",
    "\n",
    "        if union == 0:\n",
    "            return 1.0  # Avoid division by zero\n",
    "\n",
    "        return intersection / union  # Jaccard similarity as a placeholder for memetic similarity\n",
    "\n",
    "    @staticmethod\n",
    "    def calculate_cosine_similarity(vector_a: List[float], vector_b: List[float]) -> float:\n",
    "        \"\"\" Calculate cosine similarity between two vectors. \"\"\"\n",
    "        dot_product = sum(a * b for a, b in zip(vector_a, vector_b))\n",
    "        magnitude_a = math.sqrt(sum(a ** 2 for a in vector_a))\n",
    "        magnitude_b = math.sqrt(sum(b ** 2 for b in vector_b))\n",
    "\n",
    "        if magnitude_a == 0 or magnitude_b == 0:\n",
    "            return 0.0  # Avoid division by zero\n",
    "\n",
    "        return dot_product / (magnitude_a * magnitude_b)\n",
    "\n",
    "    def to_payload(self) -> Dict[str, Any]:\n",
    "        \"\"\"\n",
    "        Convert the memory packet to a Qdrant-compatible payload for storage.\n",
    "        \"\"\"\n",
    "        return {\n",
    "            \"vector\": self.vector,\n",
    "            \"metadata\": self.metadata\n",
    "        }\n",
    "\n",
    "    @staticmethod\n",
    "    def from_payload(payload: Dict[str, Any]):\n",
    "        \"\"\" Recreate a MemoryPacket from a payload. \"\"\"\n",
    "        return MemoryPacket(payload[\"vector\"], payload[\"metadata\"])\n",
    "\n",
    "class MemoryManager:\n",
    "    def __init__(self, qdrant_host=\"qdrant\", qdrant_port=6333, collection_name=\"Mind\"):\n",
    "        self.qdrant_client = AsyncQdrantClient(host=qdrant_host, port=qdrant_port)\n",
    "        self.collection_name = collection_name\n",
    "        self.model = SentenceTransformer('all-MiniLM-L6-v2')  # Semantic vector model\n",
    "        self.vector_size = self.model.get_sentence_embedding_dimension()\n",
    "\n",
    "    async def setup_collection(self):\n",
    "        \"\"\"\n",
    "        Ensure that the Qdrant collection is set up for vectors with cosine distance.\n",
    "        \"\"\"\n",
    "        try:\n",
    "            collection_info = await self.qdrant_client.get_collection(self.collection_name)\n",
    "            logger.info(f\"Collection '{self.collection_name}' exists.\")\n",
    "        except Exception:\n",
    "            logger.info(f\"Creating collection '{self.collection_name}'.\")\n",
    "            await self.qdrant_client.create_collection(\n",
    "                collection_name=self.collection_name,\n",
    "                vectors_config=rest.VectorParams(size=self.vector_size, distance=rest.Distance.COSINE)\n",
    "            )\n",
    "\n",
    "    async def create_memory(self, content: str, metadata: Dict[str, Any]):\n",
    "        \"\"\"\n",
    "        Create a memory from content, vectorize it, and store in Qdrant asynchronously.\n",
    "        \"\"\"\n",
    "        vector = self.model.encode(content).tolist()\n",
    "        point_id = str(uuid.uuid4())\n",
    "\n",
    "        try:\n",
    "            await self.qdrant_client.upsert(\n",
    "                collection_name=self.collection_name,\n",
    "                points=[rest.PointStruct(id=point_id, vector=vector, payload=metadata)]\n",
    "            )\n",
    "            logger.info(f\"Memory created successfully with ID: {point_id}\")\n",
    "        except Exception as e:\n",
    "            logger.error(f\"Error creating memory: {str(e)}\")\n",
    "            raise\n",
    "\n",
    "    async def recall_memory(self, query_content: str, top_k: int = 5):\n",
    "        \"\"\"\n",
    "        Recall a memory based on query content and return top K most relevant memories.\n",
    "        \"\"\"\n",
    "        query_vector = self.model.encode(query_content).tolist()\n",
    "\n",
    "        try:\n",
    "            results = await self.qdrant_client.search(\n",
    "                collection_name=self.collection_name,\n",
    "                query_vector=query_vector,\n",
    "                limit=top_k\n",
    "            )\n",
    "            \n",
    "            memories = [result.payload for result in results]\n",
    "            \n",
    "            # Update relevance (you might want to implement this differently based on your needs)\n",
    "            for memory in memories:\n",
    "                memory['relevance_score'] = memory.get('relevance_score', 0) + 1\n",
    "\n",
    "            return memories\n",
    "        except Exception as e:\n",
    "            logger.error(f\"Error recalling memory: {str(e)}\")\n",
    "            raise\n",
    "\n",
    "    async def prune_memories(self, gravitational_threshold: float = 1e-5):\n",
    "        \"\"\"\n",
    "        Prune low relevance memories based on their gravitational pull.\n",
    "        \"\"\"\n",
    "        try:\n",
    "            collection_info = await self.qdrant_client.get_collection(self.collection_name)\n",
    "            total_points = collection_info.points_count\n",
    "\n",
    "            if total_points > 1000000:  # Arbitrary limit\n",
    "                low_relevance_filter = Filter(\n",
    "                    must=[\n",
    "                        FieldCondition(\n",
    "                            key=\"gravitational_pull\",\n",
    "                            range=Range(lt=gravitational_threshold)\n",
    "                        )\n",
    "                    ]\n",
    "                )\n",
    "\n",
    "                offset = 0\n",
    "                batch_size = 1000\n",
    "                while True:\n",
    "                    response = await self.qdrant_client.scroll(\n",
    "                        collection_name=self.collection_name,\n",
    "                        scroll_filter=low_relevance_filter,\n",
    "                        limit=batch_size,\n",
    "                        offset=offset\n",
    "                    )\n",
    "\n",
    "                    if not response.points:\n",
    "                        break\n",
    "\n",
    "                    points_to_delete = [p.id for p in response.points]\n",
    "                    await self.qdrant_client.delete(\n",
    "                        collection_name=self.collection_name,\n",
    "                        points_selector=rest.PointIdsList(points=points_to_delete)\n",
    "                    )\n",
    "\n",
    "                    logger.info(f\"Pruned {len(points_to_delete)} low relevance memories.\")\n",
    "\n",
    "                    if len(response.points) < batch_size:\n",
    "                        break\n",
    "\n",
    "                    offset += len(response.points)\n",
    "            else:\n",
    "                logger.info(\"Total points below pruning threshold. No pruning necessary.\")\n",
    "\n",
    "        except Exception as e:\n",
    "            logger.error(f\"Error during memory pruning: {str(e)}\")\n",
    "            raise\n",
    "        \n",
    "        \n",
    "\n",
    "class AIAsset:\n",
    "    def __init__(self, api_key: str):\n",
    "        self.api_key = api_key\n",
    "\n",
    "    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:\n",
    "        raise NotImplementedError\n",
    "\n",
    "    def get_output_tokens(self, response: Dict[str, Any]) -> int:\n",
    "        raise NotImplementedError\n",
    "\n",
    "class AnthropicLLM(AIAsset):\n",
    "    def __init__(self, api_key: str):\n",
    "        super().__init__(api_key)\n",
    "        # Initialize Anthropic client here\n",
    "        # self.client = Anthropic(api_key=api_key)\n",
    "        logger.info(\"Anthropic LLM initialized\")\n",
    "\n",
    "    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:\n",
    "        logger.debug(f\"Creating message for Anthropic model: {model}\")\n",
    "        if not message.strip():\n",
    "            logger.warning(\"Empty message provided to Anthropic LLM\")\n",
    "            return {\"error\": \"Empty message provided\"}\n",
    "        try:\n",
    "            # Simulate response\n",
    "            response = {\n",
    "                \"model\": model,\n",
    "                \"message\": message,\n",
    "                \"role\": role,\n",
    "                \"usage\": {\"output_tokens\": len(message.split())}\n",
    "            }\n",
    "            logger.info(f\"Successfully created message with Anthropic model: {model}\")\n",
    "            return response\n",
    "        except Exception as e:\n",
    "            logger.exception(f\"Error creating message for Anthropic: {str(e)}\")\n",
    "            return {\"error\": f\"Anthropic failed: {str(e)}\"}\n",
    "\n",
    "    def get_output_tokens(self, response: Dict[str, Any]) -> int:\n",
    "        return response.get('usage', {}).get('output_tokens', 0)\n",
    "\n",
    "class OpenAILLM(AIAsset):\n",
    "    def __init__(self, api_key: str):\n",
    "        super().__init__(api_key)\n",
    "        # Initialize OpenAI client here\n",
    "        # self.client = openai.OpenAI(api_key=api_key)\n",
    "        logger.info(\"OpenAI LLM initialized\")\n",
    "\n",
    "    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:\n",
    "        logger.debug(f\"Creating message for OpenAI model: {model}\")\n",
    "        if not message.strip():\n",
    "            logger.warning(\"Empty message provided to OpenAI LLM\")\n",
    "            return {\"error\": \"Empty message provided\"}\n",
    "        try:\n",
    "            # Simulate response\n",
    "            response = {\n",
    "                \"model\": model,\n",
    "                \"message\": message,\n",
    "                \"role\": role,\n",
    "                \"usage\": {\"completion_tokens\": len(message.split())}\n",
    "            }\n",
    "            logger.info(f\"Successfully created message with OpenAI model: {model}\")\n",
    "            return response\n",
    "        except Exception as e:\n",
    "            logger.exception(f\"Error creating message for OpenAI: {str(e)}\")\n",
    "            return {\"error\": f\"OpenAI failed: {str(e)}\"}\n",
    "\n",
    "    def get_output_tokens(self, response: Dict[str, Any]) -> int:\n",
    "        return response.get('usage', {}).get('completion_tokens', 0)\n",
    "\n",
    "class GroqLLM(AIAsset):\n",
    "    def __init__(self, api_key: str):\n",
    "        super().__init__(api_key)\n",
    "        # Initialize Groq client here\n",
    "        # self.client = Groq(api_key=api_key)\n",
    "        logger.info(\"Groq LLM initialized\")\n",
    "\n",
    "    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:\n",
    "        logger.debug(f\"Creating message for Groq model: {model}\")\n",
    "        if not message.strip():\n",
    "            logger.warning(\"Empty message provided to Groq LLM\")\n",
    "            return {\"error\": \"Empty message provided\"}\n",
    "        try:\n",
    "            # Simulate response\n",
    "            response = {\n",
    "                \"model\": model,\n",
    "                \"message\": message,\n",
    "                \"role\": role,\n",
    "                \"usage\": {\"completion_tokens\": len(message.split())}\n",
    "            }\n",
    "            logger.info(f\"Successfully created message with Groq model: {model}\")\n",
    "            return response\n",
    "        except Exception as e:\n",
    "            logger.exception(f\"Error creating message for Groq: {str(e)}\")\n",
    "            return {\"error\": f\"Groq failed: {str(e)}\"}\n",
    "\n",
    "    def get_output_tokens(self, response: Dict[str, Any]) -> int:\n",
    "        return response.get('usage', {}).get('completion_tokens', 0)\n",
    "\n",
    "class OllamaLLM(AIAsset):\n",
    "    def __init__(self, base_url: str = \"http://localhost:11434\"):\n",
    "        super().__init__(api_key=\"\")\n",
    "        self.base_url = base_url\n",
    "        logger.info(f\"Ollama LLM initialized with base URL: {base_url}\")\n",
    "\n",
    "    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:\n",
    "        logger.debug(f\"Creating message for Ollama model: {model}\")\n",
    "        if not message.strip():\n",
    "            logger.warning(\"Empty message provided to Ollama LLM\")\n",
    "            return {\"error\": \"Empty message provided\"}\n",
    "        try:\n",
    "            # Simulate response\n",
    "            response = {\n",
    "                \"model\": model,\n",
    "                \"message\": message,\n",
    "                \"role\": role,\n",
    "                \"response\": \"Simulated Ollama response\",\n",
    "            }\n",
    "            logger.info(f\"Successfully created message with Ollama model: {model}\")\n",
    "            return response\n",
    "        except Exception as e:\n",
    "            logger.exception(f\"Error creating message for Ollama: {str(e)}\")\n",
    "            return {\"error\": f\"Ollama failed: {str(e)}\"}\n",
    "\n",
    "    def get_output_tokens(self, response: Dict[str, Any]) -> int:\n",
    "        return len(response.get('response', '').split())\n",
    "\n",
    "class LLMManager:\n",
    "    def __init__(self):\n",
    "        self.llm_models: Dict[str, AIAsset] = {}\n",
    "        self.overridden_keys: Dict[str, str] = {}\n",
    "        self.models_cache = {}  # Cache to store fetched model info\n",
    "        self._initialize_models()\n",
    "        logger.info(\"LLMManager initialized\")\n",
    "\n",
    "    def _initialize_models(self):\n",
    "        logger.debug(\"Initializing AI models\")\n",
    "        for provider, api_key in self._load_api_keys().items():\n",
    "            if api_key:\n",
    "                llm_instance = self._create_llm_instance(provider, api_key)\n",
    "                if llm_instance:\n",
    "                    self.llm_models[provider] = llm_instance\n",
    "        self.llm_models[\"ollama\"] = OllamaLLM()\n",
    "        logger.info(f\"Initialized models: {', '.join(self.llm_models.keys())}\")\n",
    "\n",
    "    def _load_api_keys(self) -> Dict[str, str]:\n",
    "        logger.debug(\"Loading API keys\")\n",
    "        keys = {\n",
    "            \"anthropic\": self.overridden_keys.get('anthropic', os.getenv('ANTHROPIC_API_KEY', '')),\n",
    "            \"openai\": self.overridden_keys.get('openai', os.getenv('OPENAI_API_KEY', '')),\n",
    "            \"groq\": self.overridden_keys.get('groq', os.getenv('GROQ_API_KEY', '')),\n",
    "        }\n",
    "        for provider, key in keys.items():\n",
    "            if key:\n",
    "                logger.info(f\"API key loaded for {provider}\")\n",
    "            else:\n",
    "                logger.warning(f\"No API key found for {provider}\")\n",
    "        return keys\n",
    "\n",
    "    def _create_llm_instance(self, provider: str, api_key: str) -> Optional[AIAsset]:\n",
    "        logger.debug(f\"Creating LLM instance for provider: {provider}\")\n",
    "        if provider == \"anthropic\":\n",
    "            return AnthropicLLM(api_key)\n",
    "        elif provider == \"openai\":\n",
    "            return OpenAILLM(api_key)\n",
    "        elif provider == \"groq\":\n",
    "            return GroqLLM(api_key)\n",
    "        else:\n",
    "            logger.warning(f\"Unknown provider: {provider}\")\n",
    "            return None\n",
    "\n",
    "    def set_api_key(self, provider: str, api_key: str):\n",
    "        logger.info(f\"Setting API key for provider: {provider}\")\n",
    "        if not provider or not api_key:\n",
    "            logger.error(\"Invalid provider or API key provided\")\n",
    "            raise ValueError(\"Both provider and api_key must be non-empty strings\")\n",
    "        self.overridden_keys[provider] = api_key\n",
    "        self._initialize_models()\n",
    "\n",
    "    def get_available_models(self) -> List[str]:\n",
    "        models = []\n",
    "\n",
    "        # Simulate available models\n",
    "        models.extend([\"llama3.2:latest\", \"gpt-3.5-turbo\", \"groq-model\"])\n",
    "\n",
    "        logger.debug(f\"Available models: {', '.join(models)}\")\n",
    "        return models\n",
    "\n",
    "    def route_query(self, message: str, role: str, model: Optional[str] = None) -> Dict[str, Any]:\n",
    "        logger.info(f\"Routing query to {'specified model: ' + model if model else 'default model'}\")\n",
    "        if not message.strip():\n",
    "            logger.warning(\"Empty message provided to route_query\")\n",
    "            return {\"error\": \"Empty message provided\"}\n",
    "\n",
    "        if model:\n",
    "            for provider, llm in self.llm_models.items():\n",
    "                try:\n",
    "                    logger.debug(f\"Attempting to create message with provider: {provider}, model: {model}\")\n",
    "                    response = llm.create_message(model, role, message)\n",
    "                    if \"error\" not in response:\n",
    "                        logger.info(f\"Successfully created message with provider: {provider}, model: {model}\")\n",
    "                        return response\n",
    "                    logger.warning(f\"Error with {provider}, model {model}: {response['error']}\")\n",
    "                except Exception as e:\n",
    "                    logger.exception(f\"Unexpected error with {provider}, model {model}: {str(e)}\")\n",
    "\n",
    "            logger.error(f\"Specified model {model} is not available or failed for all providers\")\n",
    "            return {\"error\": f\"Specified model {model} is not available or failed for all providers\"}\n",
    "\n",
    "        for provider, llm in self.llm_models.items():\n",
    "            try:\n",
    "                logger.debug(f\"Attempting to create message with provider: {provider}\")\n",
    "                response = llm.create_message(provider, role, message)\n",
    "                if \"error\" not in response:\n",
    "                    logger.info(f\"Successfully created message with provider: {provider}\")\n",
    "                    return response\n",
    "                logger.warning(f\"Error with {provider}: {response['error']}\")\n",
    "            except Exception as e:\n",
    "                logger.exception(f\"Unexpected error with {provider}: {str(e)}\")\n",
    "\n",
    "        logger.error(\"No available models could process the request\")\n",
    "        return {\"error\": \"No available models could process the request\"}\n",
    "\n",
    "    def get_model_info(self, model: str) -> Dict[str, Any]:\n",
    "        logger.info(f\"Retrieving model info for model: {model}\")\n",
    "\n",
    "        # Check if the model info is cached\n",
    "        if model in self.models_cache:\n",
    "            logger.debug(f\"Model info for {model} retrieved from cache.\")\n",
    "            return self.models_cache[model]\n",
    "\n",
    "        # Simulate model info\n",
    "        model_info = {\n",
    "            \"model\": model,\n",
    "            \"type\": \"text-generation\",\n",
    "            \"capabilities\": [\"text-generation\", \"conversation\", \"code-generation\"],\n",
    "            \"max_tokens\": 8192,\n",
    "            \"context_window\": 8192,\n",
    "            \"description\": \"Simulated model description\"\n",
    "        }\n",
    "        self.models_cache[model] = model_info  # Cache the result\n",
    "        logger.debug(f\"Fetched model info: {model_info}\")\n",
    "        return model_info\n",
    "\n",
    "# Create FastAPI app\n",
    "app = FastAPI(title=\"Cogenesis Backend API\", description=\"API for managing AI agents and models\")\n",
    "\n",
    "# Configure CORS\n",
    "app.add_middleware(\n",
    "    CORSMiddleware,\n",
    "    allow_origins=[\"*\"],  # Allows all origins\n",
    "    allow_credentials=True,\n",
    "    allow_methods=[\"*\"],  # Allows all methods\n",
    "    allow_headers=[\"*\"],  # Allows all headers\n",
    ")\n",
    "\n",
    "# Initialize LLMManager\n",
    "llm_manager = LLMManager()\n",
    "\n",
    "# Dependency to get the LLMManager instance\n",
    "def get_llm_manager():\n",
    "    return llm_manager\n",
    "\n",
    "# Define the router for neural resources API\n",
    "neural_resources_router = APIRouter()\n",
    "\n",
    "class Message(BaseModel):\n",
    "    content: str\n",
    "    role: str\n",
    "    model: Optional[str] = None\n",
    "\n",
    "class APIKeyUpdate(BaseModel):\n",
    "    provider: str\n",
    "    api_key: str\n",
    "\n",
    "@neural_resources_router.post(\"/route_query\")\n",
    "async def route_query(message: Message):\n",
    "    response = llm_manager.route_query(message.content, message.role, message.model)\n",
    "    if \"error\" in response:\n",
    "        raise HTTPException(status_code=500, detail=response[\"error\"])\n",
    "    return {\"response\": response}\n",
    "\n",
    "@neural_resources_router.post(\"/set_api_key\")\n",
    "async def set_api_key(api_key_update: APIKeyUpdate):\n",
    "    try:\n",
    "        llm_manager.set_api_key(api_key_update.provider, api_key_update.api_key)\n",
    "        return {\"message\": f\"API key updated for {api_key_update.provider}\"}\n",
    "    except ValueError as e:\n",
    "        raise HTTPException(status_code=400, detail=str(e))\n",
    "\n",
    "@neural_resources_router.get(\"/available_models\")\n",
    "async def get_available_models():\n",
    "    models = llm_manager.get_available_models()\n",
    "    return {\"available_models\": models}\n",
    "\n",
    "@neural_resources_router.get(\"/model_info/{model}\")\n",
    "async def get_model_info(model: str):\n",
    "    model_info = llm_manager.get_model_info(model)\n",
    "    if \"error\" in model_info:\n",
    "        raise HTTPException(status_code=404, detail=model_info[\"error\"])\n",
    "    return model_info\n",
    "\n",
    "# Include the neural resources router\n",
    "app.include_router(neural_resources_router, prefix=\"/neural_resources\", tags=[\"Neural Resources API\"])\n",
    "\n",
    "# Define the router for GravRAG API\n",
    "gravrag_router = APIRouter()\n",
    "memory_manager = MemoryManager()\n",
    "\n",
    "class MemoryRequest(BaseModel):\n",
    "    content: str\n",
    "    metadata: Optional[Dict[str, Any]] = None\n",
    "\n",
    "class RecallRequest(BaseModel):\n",
    "    query: str\n",
    "    top_k: Optional[int] = 5\n",
    "\n",
    "class PruneRequest(BaseModel):\n",
    "    gravity_threshold: Optional[float] = 1e-5\n",
    "\n",
    "@gravrag_router.post(\"/create_memory\")\n",
    "async def create_memory(memory_request: MemoryRequest):\n",
    "    if not memory_request.content.strip():\n",
    "        logger.warning(\"Memory creation failed: Empty content.\")\n",
    "        raise HTTPException(status_code=400, detail=\"Content cannot be empty.\")\n",
    "    metadata = memory_request.metadata or {}\n",
    "    try:\n",
    "        logger.info(f\"Creating memory: '{memory_request.content}' with metadata: {metadata}\")\n",
    "        await memory_manager.create_memory(content=memory_request.content, metadata=metadata)\n",
    "        return {\"message\": \"Memory created successfully\"}\n",
    "    except Exception as e:\n",
    "        logger.error(f\"Error during memory creation: {str(e)}\", exc_info=True)\n",
    "        raise HTTPException(status_code=500, detail=f\"Error creating memory: {str(e)}\")\n",
    "\n",
    "@gravrag_router.post(\"/recall_memory\")\n",
    "async def recall_memory(recall_request: RecallRequest):\n",
    "    if not recall_request.query.strip():\n",
    "        logger.warning(\"Memory recall failed: Empty query.\")\n",
    "        raise HTTPException(status_code=400, detail=\"Query cannot be empty.\")\n",
    "    try:\n",
    "        logger.info(f\"Recalling memories for query: '{recall_request.query}' with top_k={recall_request.top_k}\")\n",
    "        memories = await memory_manager.recall_memory(query_content=recall_request.query, top_k=recall_request.top_k)\n",
    "        if not memories:\n",
    "            return {\"message\": \"No relevant memories found\"}\n",
    "        return {\"memories\": memories}\n",
    "    except Exception as e:\n",
    "        logger.error(f\"Error during memory recall: {str(e)}\", exc_info=True)\n",
    "        raise HTTPException(status_code=500, detail=f\"Error recalling memories: {str(e)}\")\n",
    "\n",
    "@gravrag_router.post(\"/prune_memories\")\n",
    "async def prune_memories(prune_request: PruneRequest):\n",
    "    try:\n",
    "        await memory_manager.prune_memories()\n",
    "        return {\"message\": \"Memory pruning completed successfully\"}\n",
    "    except Exception as e:\n",
    "        logger.error(f\"Error during memory pruning: {str(e)}\", exc_info=True)\n",
    "        raise HTTPException(status_code=500, detail=f\"Error pruning memories: {str(e)}\")\n",
    "\n",
    "# Include the GravRAG router\n",
    "app.include_router(gravrag_router, prefix=\"/gravrag\", tags=[\"GravRAG API\"])\n",
    "\n",
    "# Define the API info endpoint\n",
    "@app.get(\"/api_info\")\n",
    "async def get_api_info():\n",
    "    return {\n",
    "        \"Neural Resources API\": {\n",
    "            \"Endpoints\": [\n",
    "                {\n",
    "                    \"endpoint\": \"/neural_resources/route_query\",\n",
    "                    \"method\": \"POST\",\n",
    "                    \"payload\": {\n",
    "                        \"content\": \"Your message here\",\n",
    "                        \"role\": \"user\",\n",
    "                        \"model\": \"Model name (optional)\"\n",
    "                    },\n",
    "                    \"response\": {\n",
    "                        \"response\": \"Model output\"\n",
    "                    }\n",
    "                },\n",
    "                {\n",
    "                    \"endpoint\": \"/neural_resources/set_api_key\",\n",
    "                    \"method\": \"POST\",\n",
    "                    \"payload\": {\n",
    "                        \"provider\": \"provider_name\",\n",
    "                        \"api_key\": \"new_api_key\"\n",
    "                    },\n",
    "                    \"response\": {\n",
    "                        \"message\": \"API key updated\"\n",
    "                    }\n",
    "                },\n",
    "                {\n",
    "                    \"endpoint\": \"/neural_resources/available_models\",\n",
    "                    \"method\": \"GET\",\n",
    "                    \"response\": {\n",
    "                        \"available_models\": [\"model1\", \"model2\", \"model3\"]\n",
    "                    }\n",
    "                },\n",
    "                {\n",
    "                    \"endpoint\": \"/neural_resources/model_info/{model}\",\n",
    "                    \"method\": \"GET\",\n",
    "                    \"response\": {\n",
    "                        \"model\": \"model_name\",\n",
    "                        \"type\": \"model_type\",\n",
    "                        \"capabilities\": [\"capability1\", \"capability2\"],\n",
    "                        \"max_tokens\": 1000,\n",
    "                        \"context_window\": 4096,\n",
    "                        \"description\": \"Model description\"\n",
    "                    }\n",
    "                }\n",
    "            ]\n",
    "        },\n",
    "        \"GravRAG API\": {\n",
    "            \"Endpoints\": [\n",
    "                {\n",
    "                    \"endpoint\": \"/gravrag/create_memory\",\n",
    "                    \"method\": \"POST\",\n",
    "                    \"payload\": {\n",
    "                        \"content\": \"This is a sample memory\",\n",
    "                        \"metadata\": {\n",
    "                            \"objective_id\": \"obj_1\",\n",
    "                            \"task_id\": \"task_1\"\n",
    "                        }\n",
    "                    },\n",
    "                    \"response\": {\n",
    "                        \"message\": \"Memory created successfully\"\n",
    "                    }\n",
    "                },\n",
    "                {\n",
    "                    \"endpoint\": \"/gravrag/recall_memory\",\n",
    "                    \"method\": \"POST\",\n",
    "                    \"payload\": {\n",
    "                        \"query\": \"your_query_here\",\n",
    "                        \"top_k\": 5\n",
    "                    },\n",
    "                    \"response\": {\n",
    "                        \"memories\": \"List of recalled memories\"\n",
    "                    }\n",
    "                },\n",
    "                {\n",
    "                    \"endpoint\": \"/gravrag/prune_memories\",\n",
    "                    \"method\": \"POST\",\n",
    "                    \"response\": {\n",
    "                        \"message\": \"Memory pruning completed successfully\"\n",
    "                    }\n",
    "                }\n",
    "            ]\n",
    "        }\n",
    "    }\n",
    "\n",
    "if __name__ == \"__main__\":\n",
    "    uvicorn.run(app, host=\"0.0.0.0\", port=8000)\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 1,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Collecting qdrant-client\n",
      "  Downloading qdrant_client-1.11.3-py3-none-any.whl (258 kB)\n",
      "     -------------------------------------- 258.9/258.9 kB 5.3 MB/s eta 0:00:00\n",
      "Collecting httpx[http2]>=0.20.0\n",
      "  Downloading httpx-0.27.2-py3-none-any.whl (76 kB)\n",
      "     ---------------------------------------- 76.4/76.4 kB 4.1 MB/s eta 0:00:00\n",
      "Collecting grpcio>=1.41.0\n",
      "  Downloading grpcio-1.66.2-cp310-cp310-win_amd64.whl (4.3 MB)\n",
      "     ---------------------------------------- 4.3/4.3 MB 13.0 MB/s eta 0:00:00\n",
      "Collecting grpcio-tools>=1.41.0\n",
      "  Downloading grpcio_tools-1.66.2-cp310-cp310-win_amd64.whl (1.1 MB)\n",
      "     ---------------------------------------- 1.1/1.1 MB 11.6 MB/s eta 0:00:00\n",
      "Requirement already satisfied: numpy>=1.21 in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from qdrant-client) (1.23.5)\n",
      "Requirement already satisfied: urllib3<3,>=1.26.14 in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from qdrant-client) (1.26.14)\n",
      "Collecting portalocker<3.0.0,>=2.7.0\n",
      "  Downloading portalocker-2.10.1-py3-none-any.whl (18 kB)\n",
      "Collecting pydantic>=1.10.8\n",
      "  Downloading pydantic-2.9.2-py3-none-any.whl (434 kB)\n",
      "     ------------------------------------- 434.9/434.9 kB 13.7 MB/s eta 0:00:00\n",
      "Collecting protobuf<6.0dev,>=5.26.1\n",
      "  Downloading protobuf-5.28.2-cp310-abi3-win_amd64.whl (431 kB)\n",
      "     -------------------------------------- 431.5/431.5 kB 9.0 MB/s eta 0:00:00\n",
      "Requirement already satisfied: setuptools in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from grpcio-tools>=1.41.0->qdrant-client) (65.6.3)\n",
      "Requirement already satisfied: anyio in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from httpx[http2]>=0.20.0->qdrant-client) (3.5.0)\n",
      "Requirement already satisfied: idna in c:\\users\\nasan\\appdata\\roaming\\python\\python310\\site-packages (from httpx[http2]>=0.20.0->qdrant-client) (2.10)\n",
      "Collecting httpcore==1.*\n",
      "  Downloading httpcore-1.0.6-py3-none-any.whl (78 kB)\n",
      "     ---------------------------------------- 78.0/78.0 kB 4.2 MB/s eta 0:00:00\n",
      "Requirement already satisfied: certifi in c:\\users\\nasan\\appdata\\roaming\\python\\python310\\site-packages (from httpx[http2]>=0.20.0->qdrant-client) (2023.7.22)\n",
      "Requirement already satisfied: sniffio in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from httpx[http2]>=0.20.0->qdrant-client) (1.2.0)\n",
      "Collecting h2<5,>=3\n",
      "  Downloading h2-4.1.0-py3-none-any.whl (57 kB)\n",
      "     ---------------------------------------- 57.5/57.5 kB 3.0 MB/s eta 0:00:00\n",
      "Collecting h11<0.15,>=0.13\n",
      "  Downloading h11-0.14.0-py3-none-any.whl (58 kB)\n",
      "     ---------------------------------------- 58.3/58.3 kB ? eta 0:00:00\n",
      "Requirement already satisfied: pywin32>=226 in c:\\users\\nasan\\appdata\\roaming\\python\\python310\\site-packages (from portalocker<3.0.0,>=2.7.0->qdrant-client) (306)\n",
      "Collecting annotated-types>=0.6.0\n",
      "  Downloading annotated_types-0.7.0-py3-none-any.whl (13 kB)\n",
      "Collecting pydantic-core==2.23.4\n",
      "  Downloading pydantic_core-2.23.4-cp310-none-win_amd64.whl (1.9 MB)\n",
      "     ---------------------------------------- 1.9/1.9 MB 6.8 MB/s eta 0:00:00\n",
      "Requirement already satisfied: typing-extensions>=4.6.1 in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from pydantic>=1.10.8->qdrant-client) (4.8.0)\n",
      "Collecting hpack<5,>=4.0\n",
      "  Downloading hpack-4.0.0-py3-none-any.whl (32 kB)\n",
      "Collecting hyperframe<7,>=6.0\n",
      "  Downloading hyperframe-6.0.1-py3-none-any.whl (12 kB)\n",
      "Installing collected packages: pydantic-core, protobuf, portalocker, hyperframe, hpack, h11, grpcio, annotated-types, pydantic, httpcore, h2, grpcio-tools, httpx, qdrant-client\n",
      "  Attempting uninstall: protobuf\n",
      "    Found existing installation: protobuf 4.23.4\n",
      "    Uninstalling protobuf-4.23.4:\n",
      "      Successfully uninstalled protobuf-4.23.4\n",
      "Successfully installed annotated-types-0.7.0 grpcio-1.66.2 grpcio-tools-1.66.2 h11-0.14.0 h2-4.1.0 hpack-4.0.0 httpcore-1.0.6 httpx-0.27.2 hyperframe-6.0.1 portalocker-2.10.1 protobuf-5.28.2 pydantic-2.9.2 pydantic-core-2.23.4 qdrant-client-1.11.3\n"
     ]
    }
   ],
   "source": [
    "!pip install qdrant-client"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 2,
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Collecting qdrant-client==1.5.0\n",
      "  Downloading qdrant_client-1.5.0-py3-none-any.whl (144 kB)\n",
      "     -------------------------------------- 144.2/144.2 kB 4.3 MB/s eta 0:00:00\n",
      "Requirement already satisfied: urllib3<2.0.0,>=1.26.14 in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from qdrant-client==1.5.0) (1.26.14)\n",
      "Requirement already satisfied: pydantic>=1.10.8 in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from qdrant-client==1.5.0) (2.9.2)\n",
      "Requirement already satisfied: grpcio-tools>=1.41.0 in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from qdrant-client==1.5.0) (1.66.2)\n",
      "Requirement already satisfied: httpx[http2]>=0.14.0 in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from qdrant-client==1.5.0) (0.27.2)\n",
      "Requirement already satisfied: portalocker<3.0.0,>=2.7.0 in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from qdrant-client==1.5.0) (2.10.1)\n",
      "Requirement already satisfied: numpy>=1.21 in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from qdrant-client==1.5.0) (1.23.5)\n",
      "Requirement already satisfied: grpcio>=1.41.0 in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from qdrant-client==1.5.0) (1.66.2)\n",
      "Requirement already satisfied: protobuf<6.0dev,>=5.26.1 in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from grpcio-tools>=1.41.0->qdrant-client==1.5.0) (5.28.2)\n",
      "Requirement already satisfied: setuptools in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from grpcio-tools>=1.41.0->qdrant-client==1.5.0) (65.6.3)\n",
      "Requirement already satisfied: httpcore==1.* in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from httpx[http2]>=0.14.0->qdrant-client==1.5.0) (1.0.6)\n",
      "Requirement already satisfied: sniffio in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from httpx[http2]>=0.14.0->qdrant-client==1.5.0) (1.2.0)\n",
      "Requirement already satisfied: anyio in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from httpx[http2]>=0.14.0->qdrant-client==1.5.0) (3.5.0)\n",
      "Requirement already satisfied: certifi in c:\\users\\nasan\\appdata\\roaming\\python\\python310\\site-packages (from httpx[http2]>=0.14.0->qdrant-client==1.5.0) (2023.7.22)\n",
      "Requirement already satisfied: idna in c:\\users\\nasan\\appdata\\roaming\\python\\python310\\site-packages (from httpx[http2]>=0.14.0->qdrant-client==1.5.0) (2.10)\n",
      "Requirement already satisfied: h2<5,>=3 in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from httpx[http2]>=0.14.0->qdrant-client==1.5.0) (4.1.0)\n",
      "Requirement already satisfied: h11<0.15,>=0.13 in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from httpcore==1.*->httpx[http2]>=0.14.0->qdrant-client==1.5.0) (0.14.0)\n",
      "Requirement already satisfied: pywin32>=226 in c:\\users\\nasan\\appdata\\roaming\\python\\python310\\site-packages (from portalocker<3.0.0,>=2.7.0->qdrant-client==1.5.0) (306)\n",
      "Requirement already satisfied: pydantic-core==2.23.4 in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from pydantic>=1.10.8->qdrant-client==1.5.0) (2.23.4)\n",
      "Requirement already satisfied: typing-extensions>=4.6.1 in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from pydantic>=1.10.8->qdrant-client==1.5.0) (4.8.0)\n",
      "Requirement already satisfied: annotated-types>=0.6.0 in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from pydantic>=1.10.8->qdrant-client==1.5.0) (0.7.0)\n",
      "Requirement already satisfied: hyperframe<7,>=6.0 in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from h2<5,>=3->httpx[http2]>=0.14.0->qdrant-client==1.5.0) (6.0.1)\n",
      "Requirement already satisfied: hpack<5,>=4.0 in d:\\users\\nasan\\anaconda3\\lib\\site-packages (from h2<5,>=3->httpx[http2]>=0.14.0->qdrant-client==1.5.0) (4.0.0)\n",
      "Installing collected packages: qdrant-client\n",
      "  Attempting uninstall: qdrant-client\n",
      "    Found existing installation: qdrant-client 1.11.3\n",
      "    Uninstalling qdrant-client-1.11.3:\n",
      "      Successfully uninstalled qdrant-client-1.11.3\n",
      "Successfully installed qdrant-client-1.5.0\n"
     ]
    }
   ],
   "source": [
    "!pip install qdrant-client==1.5.0"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 3,
   "metadata": {},
   "outputs": [
    {
     "ename": "ModuleNotFoundError",
     "evalue": "No module named 'fastapi'",
     "output_type": "error",
     "traceback": [
      "\u001b[1;31m---------------------------------------------------------------------------\u001b[0m",
      "\u001b[1;31mModuleNotFoundError\u001b[0m                       Traceback (most recent call last)",
      "Cell \u001b[1;32mIn[3], line 6\u001b[0m\n\u001b[0;32m      4\u001b[0m \u001b[38;5;28;01mimport\u001b[39;00m \u001b[38;5;21;01mlogging\u001b[39;00m\n\u001b[0;32m      5\u001b[0m \u001b[38;5;28;01mfrom\u001b[39;00m \u001b[38;5;21;01mtyping\u001b[39;00m \u001b[38;5;28;01mimport\u001b[39;00m List, Dict, Any, Optional\n\u001b[1;32m----> 6\u001b[0m \u001b[38;5;28;01mfrom\u001b[39;00m \u001b[38;5;21;01mfastapi\u001b[39;00m \u001b[38;5;28;01mimport\u001b[39;00m FastAPI, APIRouter, HTTPException, Depends\n\u001b[0;32m      7\u001b[0m \u001b[38;5;28;01mfrom\u001b[39;00m \u001b[38;5;21;01mpydantic\u001b[39;00m \u001b[38;5;28;01mimport\u001b[39;00m BaseModel\n\u001b[0;32m      8\u001b[0m \u001b[38;5;28;01mfrom\u001b[39;00m \u001b[38;5;21;01mqdrant_client\u001b[39;00m \u001b[38;5;28;01mimport\u001b[39;00m QdrantClient\n",
      "\u001b[1;31mModuleNotFoundError\u001b[0m: No module named 'fastapi'"
     ]
    }
   ],
   "source": [
    "import time\n",
    "import math\n",
    "import uuid\n",
    "import logging\n",
    "from typing import List, Dict, Any, Optional\n",
    "from fastapi import FastAPI, APIRouter, HTTPException, Depends\n",
    "from pydantic import BaseModel\n",
    "from qdrant_client import QdrantClient\n",
    "from qdrant_client.http.models import PointStruct\n",
    "from sentence_transformers import SentenceTransformer\n",
    "\n",
    "# Set up logging\n",
    "logging.basicConfig(level=logging.INFO)\n",
    "logger = logging.getLogger(__name__)\n",
    "\n",
    "# Constants and thresholds\n",
    "GRAVITATIONAL_THRESHOLD = 1e-5\n",
    "\n",
    "class MemoryPacket:\n",
    "    def __init__(self, vector: List[float], metadata: Dict[str, Any]):\n",
    "        self.vector = vector\n",
    "        self.metadata = metadata or {}\n",
    "\n",
    "        self.metadata.setdefault(\"timestamp\", time.time())\n",
    "        self.metadata.setdefault(\"recall_count\", 0)\n",
    "        self.metadata.setdefault(\"memetic_similarity\", self.calculate_memetic_similarity())\n",
    "        self.metadata.setdefault(\"semantic_relativity\", 1.0)\n",
    "        self.metadata.setdefault(\"gravitational_pull\", self.calculate_gravitational_pull())\n",
    "        self.metadata.setdefault(\"spacetime_coordinate\", self.calculate_spacetime_coordinate())\n",
    "\n",
    "    def calculate_gravitational_pull(self) -> float:\n",
    "        vector_magnitude = math.sqrt(sum(x ** 2 for x in self.vector))\n",
    "        recall_count = self.metadata[\"recall_count\"]\n",
    "        memetic_similarity = self.metadata[\"memetic_similarity\"]\n",
    "        semantic_relativity = self.metadata[\"semantic_relativity\"]\n",
    "\n",
    "        gravitational_pull = vector_magnitude * (1 + math.log1p(recall_count)) * memetic_similarity * semantic_relativity\n",
    "        self.metadata[\"gravitational_pull\"] = gravitational_pull\n",
    "        return gravitational_pull\n",
    "\n",
    "    def calculate_spacetime_coordinate(self) -> float:\n",
    "        time_decay_factor = 1 + (time.time() - self.metadata.get(\"timestamp\", time.time()))\n",
    "        spacetime_coordinate = self.metadata[\"gravitational_pull\"] / time_decay_factor\n",
    "        self.metadata[\"spacetime_coordinate\"] = spacetime_coordinate\n",
    "        return spacetime_coordinate\n",
    "\n",
    "    def update_relevance(self, query_vector: List[float]):\n",
    "        self.metadata[\"semantic_relativity\"] = self.calculate_cosine_similarity(self.vector, query_vector)\n",
    "        self.metadata[\"memetic_similarity\"] = self.calculate_memetic_similarity()\n",
    "        self.calculate_gravitational_pull()\n",
    "        self.calculate_spacetime_coordinate()\n",
    "\n",
    "    def calculate_memetic_similarity(self) -> float:\n",
    "        if \"tags\" not in self.metadata:\n",
    "            return 1.0\n",
    "\n",
    "        tags = set(self.metadata.get(\"tags\", []))\n",
    "        reference_tags = set(self.metadata.get(\"reference_tags\", []))\n",
    "\n",
    "        if not tags or not reference_tags:\n",
    "            return 1.0\n",
    "\n",
    "        intersection = len(tags.intersection(reference_tags))\n",
    "        union = len(tags.union(reference_tags))\n",
    "\n",
    "        if union == 0:\n",
    "            return 1.0\n",
    "\n",
    "        return intersection / union\n",
    "\n",
    "    @staticmethod\n",
    "    def calculate_cosine_similarity(vector_a: List[float], vector_b: List[float]) -> float:\n",
    "        dot_product = sum(a * b for a, b in zip(vector_a, vector_b))\n",
    "        magnitude_a = math.sqrt(sum(a ** 2 for a in vector_a))\n",
    "        magnitude_b = math.sqrt(sum(b ** 2 for b in vector_b))\n",
    "\n",
    "        if magnitude_a == 0 or magnitude_b == 0:\n",
    "            return 0.0\n",
    "\n",
    "        return dot_product / (magnitude_a * magnitude_b)\n",
    "\n",
    "    def to_payload(self) -> Dict[str, Any]:\n",
    "        return {\n",
    "            \"vector\": self.vector,\n",
    "            \"metadata\": self.metadata\n",
    "        }\n",
    "\n",
    "    @staticmethod\n",
    "    def from_payload(payload: Dict[str, Any]):\n",
    "        return MemoryPacket(payload[\"vector\"], payload[\"metadata\"])\n",
    "\n",
    "class MemoryManager:\n",
    "    def __init__(self, qdrant_host=\"localhost\", qdrant_port=6333, collection_name=\"Mind\"):\n",
    "        self.qdrant_client = QdrantClient(host=qdrant_host, port=qdrant_port)\n",
    "        self.collection_name = collection_name\n",
    "        self.model = SentenceTransformer('all-MiniLM-L6-v2')\n",
    "        self._setup_collection()\n",
    "\n",
    "    def _setup_collection(self):\n",
    "        try:\n",
    "            self.qdrant_client.get_collection(self.collection_name)\n",
    "            logger.info(f\"Collection '{self.collection_name}' exists.\")\n",
    "        except Exception:\n",
    "            logger.info(f\"Creating collection '{self.collection_name}'.\")\n",
    "            self.qdrant_client.create_collection(\n",
    "                collection_name=self.collection_name,\n",
    "                vector_size=self.model.get_sentence_embedding_dimension(),\n",
    "                distance=\"Cosine\"\n",
    "            )\n",
    "\n",
    "    async def create_memory(self, content: str, metadata: Dict[str, Any]):\n",
    "        vector = self.model.encode(content).tolist()\n",
    "        memory_packet = MemoryPacket(vector=vector, metadata=metadata)\n",
    "        point_id = str(uuid.uuid4())\n",
    "\n",
    "        self.qdrant_client.upsert(\n",
    "            collection_name=self.collection_name,\n",
    "            points=[PointStruct(id=point_id, vector=vector, payload=memory_packet.to_payload())]\n",
    "        )\n",
    "        logger.info(f\"Memory created successfully with ID: {point_id}\")\n",
    "\n",
    "    async def recall_memory(self, query_content: str, top_k: int = 5):\n",
    "        query_vector = self.model.encode(query_content).tolist()\n",
    "\n",
    "        results = self.qdrant_client.search(\n",
    "            collection_name=self.collection_name,\n",
    "            query_vector=query_vector,\n",
    "            limit=top_k\n",
    "        )\n",
    "\n",
    "        memories = [MemoryPacket.from_payload(hit.payload) for hit in results]\n",
    "\n",
    "        for memory in memories:\n",
    "            memory.update_relevance(query_vector)\n",
    "\n",
    "        return [memory.metadata for memory in memories]\n",
    "\n",
    "    async def prune_memories(self):\n",
    "        total_points = self.qdrant_client.count(self.collection_name).count\n",
    "        if total_points > 1000000:\n",
    "            points = self.qdrant_client.scroll(self.collection_name, limit=1000)\n",
    "            low_relevance_points = [\n",
    "                p.id for p in points if p.payload['metadata']['gravitational_pull'] < GRAVITATIONAL_THRESHOLD\n",
    "            ]\n",
    "            if low_relevance_points:\n",
    "                self.qdrant_client.delete(self.collection_name, points_selector=low_relevance_points)\n",
    "\n",
    "class MemoryRequest(BaseModel):\n",
    "    content: str\n",
    "    metadata: Optional[Dict[str, Any]] = None\n",
    "\n",
    "class RecallRequest(BaseModel):\n",
    "    query: str\n",
    "    top_k: Optional[int] = 5\n",
    "\n",
    "class PruneRequest(BaseModel):\n",
    "    gravity_threshold: Optional[float] = 1e-5\n",
    "\n",
    "router = APIRouter()\n",
    "memory_manager = MemoryManager()\n",
    "\n",
    "@router.post(\"/create_memory\")\n",
    "async def create_memory(memory_request: MemoryRequest):\n",
    "    if not memory_request.content.strip():\n",
    "        logger.warning(\"Memory creation failed: Empty content.\")\n",
    "        raise HTTPException(status_code=400, detail=\"Content cannot be empty.\")\n",
    "    metadata = memory_request.metadata or {}\n",
    "    try:\n",
    "        logger.info(f\"Creating memory: '{memory_request.content}' with metadata: {metadata}\")\n",
    "        await memory_manager.create_memory(content=memory_request.content, metadata=metadata)\n",
    "        return {\"message\": \"Memory created successfully\"}\n",
    "    except Exception as e:\n",
    "        logger.error(f\"Error during memory creation: {str(e)}\", exc_info=True)\n",
    "        raise HTTPException(status_code=500, detail=f\"Error creating memory: {str(e)}\")\n",
    "\n",
    "@router.post(\"/recall_memory\")\n",
    "async def recall_memory(recall_request: RecallRequest):\n",
    "    if not recall_request.query.strip():\n",
    "        logger.warning(\"Memory recall failed: Empty query.\")\n",
    "        raise HTTPException(status_code=400, detail=\"Query cannot be empty.\")\n",
    "    try:\n",
    "        logger.info(f\"Recalling memories for query: '{recall_request.query}' with top_k={recall_request.top_k}\")\n",
    "        memories = await memory_manager.recall_memory(query_content=recall_request.query, top_k=recall_request.top_k)\n",
    "        if not memories:\n",
    "            return {\"message\": \"No relevant memories found\"}\n",
    "        return {\"memories\": memories}\n",
    "    except Exception as e:\n",
    "        logger.error(f\"Error during memory recall: {str(e)}\", exc_info=True)\n",
    "        raise HTTPException(status_code=500, detail=f\"Error recalling memories: {str(e)}\")\n",
    "\n",
    "@router.post(\"/prune_memories\")\n",
    "async def prune_memories(prune_request: PruneRequest):\n",
    "    try:\n",
    "        await memory_manager.prune_memories()\n",
    "        return {\"message\": \"Memory pruning completed successfully\"}\n",
    "    except Exception as e:\n",
    "        logger.error(f\"Error during memory pruning: {str(e)}\", exc_info=True)\n",
    "        raise HTTPException(status_code=500, detail=f\"Error pruning memories: {str(e)}\")\n",
    "\n",
    "app = FastAPI()\n",
    "app.include_router(router)\n",
    "\n",
    "if __name__ == \"__main__\":\n",
    "    import uvicorn\n",
    "    uvicorn.run(app, host=\"0.0.0.0\", port=8000)"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": 2,
   "metadata": {},
   "outputs": [
    {
     "name": "stderr",
     "output_type": "stream",
     "text": [
      "INFO:sentence_transformers.SentenceTransformer:Use pytorch device_name: cpu\n",
      "INFO:sentence_transformers.SentenceTransformer:Load pretrained SentenceTransformer: all-MiniLM-L6-v2\n",
      "c:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\transformers\\tokenization_utils_base.py:1601: FutureWarning: `clean_up_tokenization_spaces` was not set. It will be set to `True` by default. This behavior will be depracted in transformers v4.45, and will be then set to `False` by default. For more details check this issue: https://github.com/huggingface/transformers/issues/31884\n",
      "  warnings.warn(\n",
      "INFO:__main__:Creating collection 'Mind'.\n"
     ]
    },
    {
     "ename": "ResponseHandlingException",
     "evalue": "[Errno 11001] getaddrinfo failed",
     "output_type": "error",
     "traceback": [
      "\u001b[1;31m---------------------------------------------------------------------------\u001b[0m",
      "\u001b[1;31mConnectError\u001b[0m                              Traceback (most recent call last)",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\httpx\\_transports\\default.py:72\u001b[0m, in \u001b[0;36mmap_httpcore_exceptions\u001b[1;34m()\u001b[0m\n\u001b[0;32m     71\u001b[0m \u001b[38;5;28;01mtry\u001b[39;00m:\n\u001b[1;32m---> 72\u001b[0m     \u001b[38;5;28;01myield\u001b[39;00m\n\u001b[0;32m     73\u001b[0m \u001b[38;5;28;01mexcept\u001b[39;00m \u001b[38;5;167;01mException\u001b[39;00m \u001b[38;5;28;01mas\u001b[39;00m exc:\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\httpx\\_transports\\default.py:236\u001b[0m, in \u001b[0;36mHTTPTransport.handle_request\u001b[1;34m(self, request)\u001b[0m\n\u001b[0;32m    235\u001b[0m \u001b[38;5;28;01mwith\u001b[39;00m map_httpcore_exceptions():\n\u001b[1;32m--> 236\u001b[0m     resp \u001b[38;5;241m=\u001b[39m \u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43m_pool\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mhandle_request\u001b[49m\u001b[43m(\u001b[49m\u001b[43mreq\u001b[49m\u001b[43m)\u001b[49m\n\u001b[0;32m    238\u001b[0m \u001b[38;5;28;01massert\u001b[39;00m \u001b[38;5;28misinstance\u001b[39m(resp\u001b[38;5;241m.\u001b[39mstream, typing\u001b[38;5;241m.\u001b[39mIterable)\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\httpcore\\_sync\\connection_pool.py:216\u001b[0m, in \u001b[0;36mConnectionPool.handle_request\u001b[1;34m(self, request)\u001b[0m\n\u001b[0;32m    215\u001b[0m     \u001b[38;5;28mself\u001b[39m\u001b[38;5;241m.\u001b[39m_close_connections(closing)\n\u001b[1;32m--> 216\u001b[0m     \u001b[38;5;28;01mraise\u001b[39;00m exc \u001b[38;5;28;01mfrom\u001b[39;00m \u001b[38;5;28;01mNone\u001b[39;00m\n\u001b[0;32m    218\u001b[0m \u001b[38;5;66;03m# Return the response. Note that in this case we still have to manage\u001b[39;00m\n\u001b[0;32m    219\u001b[0m \u001b[38;5;66;03m# the point at which the response is closed.\u001b[39;00m\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\httpcore\\_sync\\connection_pool.py:196\u001b[0m, in \u001b[0;36mConnectionPool.handle_request\u001b[1;34m(self, request)\u001b[0m\n\u001b[0;32m    194\u001b[0m \u001b[38;5;28;01mtry\u001b[39;00m:\n\u001b[0;32m    195\u001b[0m     \u001b[38;5;66;03m# Send the request on the assigned connection.\u001b[39;00m\n\u001b[1;32m--> 196\u001b[0m     response \u001b[38;5;241m=\u001b[39m \u001b[43mconnection\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mhandle_request\u001b[49m\u001b[43m(\u001b[49m\n\u001b[0;32m    197\u001b[0m \u001b[43m        \u001b[49m\u001b[43mpool_request\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mrequest\u001b[49m\n\u001b[0;32m    198\u001b[0m \u001b[43m    \u001b[49m\u001b[43m)\u001b[49m\n\u001b[0;32m    199\u001b[0m \u001b[38;5;28;01mexcept\u001b[39;00m ConnectionNotAvailable:\n\u001b[0;32m    200\u001b[0m     \u001b[38;5;66;03m# In some cases a connection may initially be available to\u001b[39;00m\n\u001b[0;32m    201\u001b[0m     \u001b[38;5;66;03m# handle a request, but then become unavailable.\u001b[39;00m\n\u001b[0;32m    202\u001b[0m     \u001b[38;5;66;03m#\u001b[39;00m\n\u001b[0;32m    203\u001b[0m     \u001b[38;5;66;03m# In this case we clear the connection and try again.\u001b[39;00m\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\httpcore\\_sync\\connection.py:99\u001b[0m, in \u001b[0;36mHTTPConnection.handle_request\u001b[1;34m(self, request)\u001b[0m\n\u001b[0;32m     98\u001b[0m     \u001b[38;5;28mself\u001b[39m\u001b[38;5;241m.\u001b[39m_connect_failed \u001b[38;5;241m=\u001b[39m \u001b[38;5;28;01mTrue\u001b[39;00m\n\u001b[1;32m---> 99\u001b[0m     \u001b[38;5;28;01mraise\u001b[39;00m exc\n\u001b[0;32m    101\u001b[0m \u001b[38;5;28;01mreturn\u001b[39;00m \u001b[38;5;28mself\u001b[39m\u001b[38;5;241m.\u001b[39m_connection\u001b[38;5;241m.\u001b[39mhandle_request(request)\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\httpcore\\_sync\\connection.py:76\u001b[0m, in \u001b[0;36mHTTPConnection.handle_request\u001b[1;34m(self, request)\u001b[0m\n\u001b[0;32m     75\u001b[0m \u001b[38;5;28;01mif\u001b[39;00m \u001b[38;5;28mself\u001b[39m\u001b[38;5;241m.\u001b[39m_connection \u001b[38;5;129;01mis\u001b[39;00m \u001b[38;5;28;01mNone\u001b[39;00m:\n\u001b[1;32m---> 76\u001b[0m     stream \u001b[38;5;241m=\u001b[39m \u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43m_connect\u001b[49m\u001b[43m(\u001b[49m\u001b[43mrequest\u001b[49m\u001b[43m)\u001b[49m\n\u001b[0;32m     78\u001b[0m     ssl_object \u001b[38;5;241m=\u001b[39m stream\u001b[38;5;241m.\u001b[39mget_extra_info(\u001b[38;5;124m\"\u001b[39m\u001b[38;5;124mssl_object\u001b[39m\u001b[38;5;124m\"\u001b[39m)\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\httpcore\\_sync\\connection.py:122\u001b[0m, in \u001b[0;36mHTTPConnection._connect\u001b[1;34m(self, request)\u001b[0m\n\u001b[0;32m    121\u001b[0m \u001b[38;5;28;01mwith\u001b[39;00m Trace(\u001b[38;5;124m\"\u001b[39m\u001b[38;5;124mconnect_tcp\u001b[39m\u001b[38;5;124m\"\u001b[39m, logger, request, kwargs) \u001b[38;5;28;01mas\u001b[39;00m trace:\n\u001b[1;32m--> 122\u001b[0m     stream \u001b[38;5;241m=\u001b[39m \u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43m_network_backend\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mconnect_tcp\u001b[49m\u001b[43m(\u001b[49m\u001b[38;5;241;43m*\u001b[39;49m\u001b[38;5;241;43m*\u001b[39;49m\u001b[43mkwargs\u001b[49m\u001b[43m)\u001b[49m\n\u001b[0;32m    123\u001b[0m     trace\u001b[38;5;241m.\u001b[39mreturn_value \u001b[38;5;241m=\u001b[39m stream\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\httpcore\\_backends\\sync.py:205\u001b[0m, in \u001b[0;36mSyncBackend.connect_tcp\u001b[1;34m(self, host, port, timeout, local_address, socket_options)\u001b[0m\n\u001b[0;32m    200\u001b[0m exc_map: ExceptionMapping \u001b[38;5;241m=\u001b[39m {\n\u001b[0;32m    201\u001b[0m     socket\u001b[38;5;241m.\u001b[39mtimeout: ConnectTimeout,\n\u001b[0;32m    202\u001b[0m     \u001b[38;5;167;01mOSError\u001b[39;00m: ConnectError,\n\u001b[0;32m    203\u001b[0m }\n\u001b[1;32m--> 205\u001b[0m \u001b[43m\u001b[49m\u001b[38;5;28;43;01mwith\u001b[39;49;00m\u001b[43m \u001b[49m\u001b[43mmap_exceptions\u001b[49m\u001b[43m(\u001b[49m\u001b[43mexc_map\u001b[49m\u001b[43m)\u001b[49m\u001b[43m:\u001b[49m\n\u001b[0;32m    206\u001b[0m \u001b[43m    \u001b[49m\u001b[43msock\u001b[49m\u001b[43m \u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43m \u001b[49m\u001b[43msocket\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mcreate_connection\u001b[49m\u001b[43m(\u001b[49m\n\u001b[0;32m    207\u001b[0m \u001b[43m        \u001b[49m\u001b[43maddress\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m    208\u001b[0m \u001b[43m        \u001b[49m\u001b[43mtimeout\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m    209\u001b[0m \u001b[43m        \u001b[49m\u001b[43msource_address\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43msource_address\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m    210\u001b[0m \u001b[43m    \u001b[49m\u001b[43m)\u001b[49m\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\contextlib.py:158\u001b[0m, in \u001b[0;36m_GeneratorContextManager.__exit__\u001b[1;34m(self, typ, value, traceback)\u001b[0m\n\u001b[0;32m    157\u001b[0m \u001b[38;5;28;01mtry\u001b[39;00m:\n\u001b[1;32m--> 158\u001b[0m     \u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mgen\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mthrow\u001b[49m\u001b[43m(\u001b[49m\u001b[43mvalue\u001b[49m\u001b[43m)\u001b[49m\n\u001b[0;32m    159\u001b[0m \u001b[38;5;28;01mexcept\u001b[39;00m \u001b[38;5;167;01mStopIteration\u001b[39;00m \u001b[38;5;28;01mas\u001b[39;00m exc:\n\u001b[0;32m    160\u001b[0m     \u001b[38;5;66;03m# Suppress StopIteration *unless* it's the same exception that\u001b[39;00m\n\u001b[0;32m    161\u001b[0m     \u001b[38;5;66;03m# was passed to throw().  This prevents a StopIteration\u001b[39;00m\n\u001b[0;32m    162\u001b[0m     \u001b[38;5;66;03m# raised inside the \"with\" statement from being suppressed.\u001b[39;00m\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\httpcore\\_exceptions.py:14\u001b[0m, in \u001b[0;36mmap_exceptions\u001b[1;34m(map)\u001b[0m\n\u001b[0;32m     13\u001b[0m     \u001b[38;5;28;01mif\u001b[39;00m \u001b[38;5;28misinstance\u001b[39m(exc, from_exc):\n\u001b[1;32m---> 14\u001b[0m         \u001b[38;5;28;01mraise\u001b[39;00m to_exc(exc) \u001b[38;5;28;01mfrom\u001b[39;00m \u001b[38;5;21;01mexc\u001b[39;00m\n\u001b[0;32m     15\u001b[0m \u001b[38;5;28;01mraise\u001b[39;00m\n",
      "\u001b[1;31mConnectError\u001b[0m: [Errno 11001] getaddrinfo failed",
      "\nThe above exception was the direct cause of the following exception:\n",
      "\u001b[1;31mConnectError\u001b[0m                              Traceback (most recent call last)",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\qdrant_client\\http\\api_client.py:106\u001b[0m, in \u001b[0;36mApiClient.send_inner\u001b[1;34m(self, request)\u001b[0m\n\u001b[0;32m    105\u001b[0m \u001b[38;5;28;01mtry\u001b[39;00m:\n\u001b[1;32m--> 106\u001b[0m     response \u001b[38;5;241m=\u001b[39m \u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43m_client\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43msend\u001b[49m\u001b[43m(\u001b[49m\u001b[43mrequest\u001b[49m\u001b[43m)\u001b[49m\n\u001b[0;32m    107\u001b[0m \u001b[38;5;28;01mexcept\u001b[39;00m \u001b[38;5;167;01mException\u001b[39;00m \u001b[38;5;28;01mas\u001b[39;00m e:\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\httpx\\_client.py:926\u001b[0m, in \u001b[0;36mClient.send\u001b[1;34m(self, request, stream, auth, follow_redirects)\u001b[0m\n\u001b[0;32m    924\u001b[0m auth \u001b[38;5;241m=\u001b[39m \u001b[38;5;28mself\u001b[39m\u001b[38;5;241m.\u001b[39m_build_request_auth(request, auth)\n\u001b[1;32m--> 926\u001b[0m response \u001b[38;5;241m=\u001b[39m \u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43m_send_handling_auth\u001b[49m\u001b[43m(\u001b[49m\n\u001b[0;32m    927\u001b[0m \u001b[43m    \u001b[49m\u001b[43mrequest\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m    928\u001b[0m \u001b[43m    \u001b[49m\u001b[43mauth\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mauth\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m    929\u001b[0m \u001b[43m    \u001b[49m\u001b[43mfollow_redirects\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mfollow_redirects\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m    930\u001b[0m \u001b[43m    \u001b[49m\u001b[43mhistory\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43m[\u001b[49m\u001b[43m]\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m    931\u001b[0m \u001b[43m\u001b[49m\u001b[43m)\u001b[49m\n\u001b[0;32m    932\u001b[0m \u001b[38;5;28;01mtry\u001b[39;00m:\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\httpx\\_client.py:954\u001b[0m, in \u001b[0;36mClient._send_handling_auth\u001b[1;34m(self, request, auth, follow_redirects, history)\u001b[0m\n\u001b[0;32m    953\u001b[0m \u001b[38;5;28;01mwhile\u001b[39;00m \u001b[38;5;28;01mTrue\u001b[39;00m:\n\u001b[1;32m--> 954\u001b[0m     response \u001b[38;5;241m=\u001b[39m \u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43m_send_handling_redirects\u001b[49m\u001b[43m(\u001b[49m\n\u001b[0;32m    955\u001b[0m \u001b[43m        \u001b[49m\u001b[43mrequest\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m    956\u001b[0m \u001b[43m        \u001b[49m\u001b[43mfollow_redirects\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mfollow_redirects\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m    957\u001b[0m \u001b[43m        \u001b[49m\u001b[43mhistory\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mhistory\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m    958\u001b[0m \u001b[43m    \u001b[49m\u001b[43m)\u001b[49m\n\u001b[0;32m    959\u001b[0m     \u001b[38;5;28;01mtry\u001b[39;00m:\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\httpx\\_client.py:991\u001b[0m, in \u001b[0;36mClient._send_handling_redirects\u001b[1;34m(self, request, follow_redirects, history)\u001b[0m\n\u001b[0;32m    989\u001b[0m     hook(request)\n\u001b[1;32m--> 991\u001b[0m response \u001b[38;5;241m=\u001b[39m \u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43m_send_single_request\u001b[49m\u001b[43m(\u001b[49m\u001b[43mrequest\u001b[49m\u001b[43m)\u001b[49m\n\u001b[0;32m    992\u001b[0m \u001b[38;5;28;01mtry\u001b[39;00m:\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\httpx\\_client.py:1027\u001b[0m, in \u001b[0;36mClient._send_single_request\u001b[1;34m(self, request)\u001b[0m\n\u001b[0;32m   1026\u001b[0m \u001b[38;5;28;01mwith\u001b[39;00m request_context(request\u001b[38;5;241m=\u001b[39mrequest):\n\u001b[1;32m-> 1027\u001b[0m     response \u001b[38;5;241m=\u001b[39m \u001b[43mtransport\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mhandle_request\u001b[49m\u001b[43m(\u001b[49m\u001b[43mrequest\u001b[49m\u001b[43m)\u001b[49m\n\u001b[0;32m   1029\u001b[0m \u001b[38;5;28;01massert\u001b[39;00m \u001b[38;5;28misinstance\u001b[39m(response\u001b[38;5;241m.\u001b[39mstream, SyncByteStream)\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\httpx\\_transports\\default.py:235\u001b[0m, in \u001b[0;36mHTTPTransport.handle_request\u001b[1;34m(self, request)\u001b[0m\n\u001b[0;32m    223\u001b[0m req \u001b[38;5;241m=\u001b[39m httpcore\u001b[38;5;241m.\u001b[39mRequest(\n\u001b[0;32m    224\u001b[0m     method\u001b[38;5;241m=\u001b[39mrequest\u001b[38;5;241m.\u001b[39mmethod,\n\u001b[0;32m    225\u001b[0m     url\u001b[38;5;241m=\u001b[39mhttpcore\u001b[38;5;241m.\u001b[39mURL(\n\u001b[1;32m   (...)\u001b[0m\n\u001b[0;32m    233\u001b[0m     extensions\u001b[38;5;241m=\u001b[39mrequest\u001b[38;5;241m.\u001b[39mextensions,\n\u001b[0;32m    234\u001b[0m )\n\u001b[1;32m--> 235\u001b[0m \u001b[43m\u001b[49m\u001b[38;5;28;43;01mwith\u001b[39;49;00m\u001b[43m \u001b[49m\u001b[43mmap_httpcore_exceptions\u001b[49m\u001b[43m(\u001b[49m\u001b[43m)\u001b[49m\u001b[43m:\u001b[49m\n\u001b[0;32m    236\u001b[0m \u001b[43m    \u001b[49m\u001b[43mresp\u001b[49m\u001b[43m \u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43m \u001b[49m\u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43m_pool\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mhandle_request\u001b[49m\u001b[43m(\u001b[49m\u001b[43mreq\u001b[49m\u001b[43m)\u001b[49m\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\contextlib.py:158\u001b[0m, in \u001b[0;36m_GeneratorContextManager.__exit__\u001b[1;34m(self, typ, value, traceback)\u001b[0m\n\u001b[0;32m    157\u001b[0m \u001b[38;5;28;01mtry\u001b[39;00m:\n\u001b[1;32m--> 158\u001b[0m     \u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mgen\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mthrow\u001b[49m\u001b[43m(\u001b[49m\u001b[43mvalue\u001b[49m\u001b[43m)\u001b[49m\n\u001b[0;32m    159\u001b[0m \u001b[38;5;28;01mexcept\u001b[39;00m \u001b[38;5;167;01mStopIteration\u001b[39;00m \u001b[38;5;28;01mas\u001b[39;00m exc:\n\u001b[0;32m    160\u001b[0m     \u001b[38;5;66;03m# Suppress StopIteration *unless* it's the same exception that\u001b[39;00m\n\u001b[0;32m    161\u001b[0m     \u001b[38;5;66;03m# was passed to throw().  This prevents a StopIteration\u001b[39;00m\n\u001b[0;32m    162\u001b[0m     \u001b[38;5;66;03m# raised inside the \"with\" statement from being suppressed.\u001b[39;00m\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\httpx\\_transports\\default.py:89\u001b[0m, in \u001b[0;36mmap_httpcore_exceptions\u001b[1;34m()\u001b[0m\n\u001b[0;32m     88\u001b[0m message \u001b[38;5;241m=\u001b[39m \u001b[38;5;28mstr\u001b[39m(exc)\n\u001b[1;32m---> 89\u001b[0m \u001b[38;5;28;01mraise\u001b[39;00m mapped_exc(message) \u001b[38;5;28;01mfrom\u001b[39;00m \u001b[38;5;21;01mexc\u001b[39;00m\n",
      "\u001b[1;31mConnectError\u001b[0m: [Errno 11001] getaddrinfo failed",
      "\nDuring handling of the above exception, another exception occurred:\n",
      "\u001b[1;31mResponseHandlingException\u001b[0m                 Traceback (most recent call last)",
      "Cell \u001b[1;32mIn[2], line 209\u001b[0m\n\u001b[0;32m    206\u001b[0m gravrag_router \u001b[38;5;241m=\u001b[39m APIRouter()\n\u001b[0;32m    207\u001b[0m neural_resources_router \u001b[38;5;241m=\u001b[39m APIRouter()\n\u001b[1;32m--> 209\u001b[0m memory_manager \u001b[38;5;241m=\u001b[39m \u001b[43mMemoryManager\u001b[49m\u001b[43m(\u001b[49m\u001b[43m)\u001b[49m\n\u001b[0;32m    210\u001b[0m llm_manager \u001b[38;5;241m=\u001b[39m LLMManager()\n\u001b[0;32m    212\u001b[0m \u001b[38;5;129m@gravrag_router\u001b[39m\u001b[38;5;241m.\u001b[39mpost(\u001b[38;5;124m\"\u001b[39m\u001b[38;5;124m/create_memory\u001b[39m\u001b[38;5;124m\"\u001b[39m)\n\u001b[0;32m    213\u001b[0m \u001b[38;5;28;01masync\u001b[39;00m \u001b[38;5;28;01mdef\u001b[39;00m \u001b[38;5;21mcreate_memory\u001b[39m(memory_request: MemoryRequest):\n",
      "Cell \u001b[1;32mIn[2], line 99\u001b[0m, in \u001b[0;36mMemoryManager.__init__\u001b[1;34m(self, qdrant_host, qdrant_port, collection_name)\u001b[0m\n\u001b[0;32m     97\u001b[0m \u001b[38;5;28mself\u001b[39m\u001b[38;5;241m.\u001b[39mcollection_name \u001b[38;5;241m=\u001b[39m collection_name\n\u001b[0;32m     98\u001b[0m \u001b[38;5;28mself\u001b[39m\u001b[38;5;241m.\u001b[39mmodel \u001b[38;5;241m=\u001b[39m SentenceTransformer(\u001b[38;5;124m'\u001b[39m\u001b[38;5;124mall-MiniLM-L6-v2\u001b[39m\u001b[38;5;124m'\u001b[39m)\n\u001b[1;32m---> 99\u001b[0m \u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43m_setup_collection\u001b[49m\u001b[43m(\u001b[49m\u001b[43m)\u001b[49m\n",
      "Cell \u001b[1;32mIn[2], line 107\u001b[0m, in \u001b[0;36mMemoryManager._setup_collection\u001b[1;34m(self)\u001b[0m\n\u001b[0;32m    105\u001b[0m \u001b[38;5;28;01mexcept\u001b[39;00m \u001b[38;5;167;01mException\u001b[39;00m:\n\u001b[0;32m    106\u001b[0m     logger\u001b[38;5;241m.\u001b[39minfo(\u001b[38;5;124mf\u001b[39m\u001b[38;5;124m\"\u001b[39m\u001b[38;5;124mCreating collection \u001b[39m\u001b[38;5;124m'\u001b[39m\u001b[38;5;132;01m{\u001b[39;00m\u001b[38;5;28mself\u001b[39m\u001b[38;5;241m.\u001b[39mcollection_name\u001b[38;5;132;01m}\u001b[39;00m\u001b[38;5;124m'\u001b[39m\u001b[38;5;124m.\u001b[39m\u001b[38;5;124m\"\u001b[39m)\n\u001b[1;32m--> 107\u001b[0m     \u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mqdrant_client\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mcreate_collection\u001b[49m\u001b[43m(\u001b[49m\n\u001b[0;32m    108\u001b[0m \u001b[43m        \u001b[49m\u001b[43mcollection_name\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mcollection_name\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m    109\u001b[0m \u001b[43m        \u001b[49m\u001b[43mvectors_config\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mVectorParams\u001b[49m\u001b[43m(\u001b[49m\u001b[43msize\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mmodel\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mget_sentence_embedding_dimension\u001b[49m\u001b[43m(\u001b[49m\u001b[43m)\u001b[49m\u001b[43m,\u001b[49m\u001b[43m \u001b[49m\u001b[43mdistance\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mDistance\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mCOSINE\u001b[49m\u001b[43m)\u001b[49m\n\u001b[0;32m    110\u001b[0m \u001b[43m    \u001b[49m\u001b[43m)\u001b[49m\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\qdrant_client\\qdrant_client.py:2096\u001b[0m, in \u001b[0;36mQdrantClient.create_collection\u001b[1;34m(self, collection_name, vectors_config, sparse_vectors_config, shard_number, sharding_method, replication_factor, write_consistency_factor, on_disk_payload, hnsw_config, optimizers_config, wal_config, quantization_config, init_from, timeout, **kwargs)\u001b[0m\n\u001b[0;32m   2047\u001b[0m \u001b[38;5;250m\u001b[39m\u001b[38;5;124;03m\"\"\"Create empty collection with given parameters\u001b[39;00m\n\u001b[0;32m   2048\u001b[0m \n\u001b[0;32m   2049\u001b[0m \u001b[38;5;124;03mArgs:\u001b[39;00m\n\u001b[1;32m   (...)\u001b[0m\n\u001b[0;32m   2092\u001b[0m \u001b[38;5;124;03m    Operation result\u001b[39;00m\n\u001b[0;32m   2093\u001b[0m \u001b[38;5;124;03m\"\"\"\u001b[39;00m\n\u001b[0;32m   2094\u001b[0m \u001b[38;5;28;01massert\u001b[39;00m \u001b[38;5;28mlen\u001b[39m(kwargs) \u001b[38;5;241m==\u001b[39m \u001b[38;5;241m0\u001b[39m, \u001b[38;5;124mf\u001b[39m\u001b[38;5;124m\"\u001b[39m\u001b[38;5;124mUnknown arguments: \u001b[39m\u001b[38;5;132;01m{\u001b[39;00m\u001b[38;5;28mlist\u001b[39m(kwargs\u001b[38;5;241m.\u001b[39mkeys())\u001b[38;5;132;01m}\u001b[39;00m\u001b[38;5;124m\"\u001b[39m\n\u001b[1;32m-> 2096\u001b[0m \u001b[38;5;28;01mreturn\u001b[39;00m \u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43m_client\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mcreate_collection\u001b[49m\u001b[43m(\u001b[49m\n\u001b[0;32m   2097\u001b[0m \u001b[43m    \u001b[49m\u001b[43mcollection_name\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mcollection_name\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   2098\u001b[0m \u001b[43m    \u001b[49m\u001b[43mvectors_config\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mvectors_config\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   2099\u001b[0m \u001b[43m    \u001b[49m\u001b[43mshard_number\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mshard_number\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   2100\u001b[0m \u001b[43m    \u001b[49m\u001b[43msharding_method\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43msharding_method\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   2101\u001b[0m \u001b[43m    \u001b[49m\u001b[43mreplication_factor\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mreplication_factor\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   2102\u001b[0m \u001b[43m    \u001b[49m\u001b[43mwrite_consistency_factor\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mwrite_consistency_factor\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   2103\u001b[0m \u001b[43m    \u001b[49m\u001b[43mon_disk_payload\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mon_disk_payload\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   2104\u001b[0m \u001b[43m    \u001b[49m\u001b[43mhnsw_config\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mhnsw_config\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   2105\u001b[0m \u001b[43m    \u001b[49m\u001b[43moptimizers_config\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43moptimizers_config\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   2106\u001b[0m \u001b[43m    \u001b[49m\u001b[43mwal_config\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mwal_config\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   2107\u001b[0m \u001b[43m    \u001b[49m\u001b[43mquantization_config\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mquantization_config\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   2108\u001b[0m \u001b[43m    \u001b[49m\u001b[43minit_from\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43minit_from\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   2109\u001b[0m \u001b[43m    \u001b[49m\u001b[43mtimeout\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mtimeout\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   2110\u001b[0m \u001b[43m    \u001b[49m\u001b[43msparse_vectors_config\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43msparse_vectors_config\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   2111\u001b[0m \u001b[43m    \u001b[49m\u001b[38;5;241;43m*\u001b[39;49m\u001b[38;5;241;43m*\u001b[39;49m\u001b[43mkwargs\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   2112\u001b[0m \u001b[43m\u001b[49m\u001b[43m)\u001b[49m\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\qdrant_client\\qdrant_remote.py:2647\u001b[0m, in \u001b[0;36mQdrantRemote.create_collection\u001b[1;34m(self, collection_name, vectors_config, shard_number, replication_factor, write_consistency_factor, on_disk_payload, hnsw_config, optimizers_config, wal_config, quantization_config, init_from, timeout, sparse_vectors_config, sharding_method, **kwargs)\u001b[0m\n\u001b[0;32m   2630\u001b[0m     init_from \u001b[38;5;241m=\u001b[39m GrpcToRest\u001b[38;5;241m.\u001b[39mconvert_init_from(init_from)\n\u001b[0;32m   2632\u001b[0m create_collection_request \u001b[38;5;241m=\u001b[39m models\u001b[38;5;241m.\u001b[39mCreateCollection(\n\u001b[0;32m   2633\u001b[0m     vectors\u001b[38;5;241m=\u001b[39mvectors_config,\n\u001b[0;32m   2634\u001b[0m     shard_number\u001b[38;5;241m=\u001b[39mshard_number,\n\u001b[1;32m   (...)\u001b[0m\n\u001b[0;32m   2644\u001b[0m     sharding_method\u001b[38;5;241m=\u001b[39msharding_method,\n\u001b[0;32m   2645\u001b[0m )\n\u001b[1;32m-> 2647\u001b[0m result: Optional[\u001b[38;5;28mbool\u001b[39m] \u001b[38;5;241m=\u001b[39m \u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mhttp\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mcollections_api\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mcreate_collection\u001b[49m\u001b[43m(\u001b[49m\n\u001b[0;32m   2648\u001b[0m \u001b[43m    \u001b[49m\u001b[43mcollection_name\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mcollection_name\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   2649\u001b[0m \u001b[43m    \u001b[49m\u001b[43mcreate_collection\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mcreate_collection_request\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   2650\u001b[0m \u001b[43m    \u001b[49m\u001b[43mtimeout\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mtimeout\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   2651\u001b[0m \u001b[43m\u001b[49m\u001b[43m)\u001b[49m\u001b[38;5;241m.\u001b[39mresult\n\u001b[0;32m   2653\u001b[0m \u001b[38;5;28;01massert\u001b[39;00m result \u001b[38;5;129;01mis\u001b[39;00m \u001b[38;5;129;01mnot\u001b[39;00m \u001b[38;5;28;01mNone\u001b[39;00m, \u001b[38;5;124m\"\u001b[39m\u001b[38;5;124mCreate collection returned None\u001b[39m\u001b[38;5;124m\"\u001b[39m\n\u001b[0;32m   2654\u001b[0m \u001b[38;5;28;01mreturn\u001b[39;00m result\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\qdrant_client\\http\\api\\collections_api.py:1170\u001b[0m, in \u001b[0;36mSyncCollectionsApi.create_collection\u001b[1;34m(self, collection_name, timeout, create_collection)\u001b[0m\n\u001b[0;32m   1161\u001b[0m \u001b[38;5;28;01mdef\u001b[39;00m \u001b[38;5;21mcreate_collection\u001b[39m(\n\u001b[0;32m   1162\u001b[0m     \u001b[38;5;28mself\u001b[39m,\n\u001b[0;32m   1163\u001b[0m     collection_name: \u001b[38;5;28mstr\u001b[39m,\n\u001b[0;32m   1164\u001b[0m     timeout: \u001b[38;5;28mint\u001b[39m \u001b[38;5;241m=\u001b[39m \u001b[38;5;28;01mNone\u001b[39;00m,\n\u001b[0;32m   1165\u001b[0m     create_collection: m\u001b[38;5;241m.\u001b[39mCreateCollection \u001b[38;5;241m=\u001b[39m \u001b[38;5;28;01mNone\u001b[39;00m,\n\u001b[0;32m   1166\u001b[0m ) \u001b[38;5;241m-\u001b[39m\u001b[38;5;241m>\u001b[39m m\u001b[38;5;241m.\u001b[39mInlineResponse200:\n\u001b[0;32m   1167\u001b[0m \u001b[38;5;250m    \u001b[39m\u001b[38;5;124;03m\"\"\"\u001b[39;00m\n\u001b[0;32m   1168\u001b[0m \u001b[38;5;124;03m    Create new collection with given parameters\u001b[39;00m\n\u001b[0;32m   1169\u001b[0m \u001b[38;5;124;03m    \"\"\"\u001b[39;00m\n\u001b[1;32m-> 1170\u001b[0m     \u001b[38;5;28;01mreturn\u001b[39;00m \u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43m_build_for_create_collection\u001b[49m\u001b[43m(\u001b[49m\n\u001b[0;32m   1171\u001b[0m \u001b[43m        \u001b[49m\u001b[43mcollection_name\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mcollection_name\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   1172\u001b[0m \u001b[43m        \u001b[49m\u001b[43mtimeout\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mtimeout\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   1173\u001b[0m \u001b[43m        \u001b[49m\u001b[43mcreate_collection\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mcreate_collection\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m   1174\u001b[0m \u001b[43m    \u001b[49m\u001b[43m)\u001b[49m\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\qdrant_client\\http\\api\\collections_api.py:116\u001b[0m, in \u001b[0;36m_CollectionsApi._build_for_create_collection\u001b[1;34m(self, collection_name, timeout, create_collection)\u001b[0m\n\u001b[0;32m    114\u001b[0m \u001b[38;5;28;01mif\u001b[39;00m \u001b[38;5;124m\"\u001b[39m\u001b[38;5;124mContent-Type\u001b[39m\u001b[38;5;124m\"\u001b[39m \u001b[38;5;129;01mnot\u001b[39;00m \u001b[38;5;129;01min\u001b[39;00m headers:\n\u001b[0;32m    115\u001b[0m     headers[\u001b[38;5;124m\"\u001b[39m\u001b[38;5;124mContent-Type\u001b[39m\u001b[38;5;124m\"\u001b[39m] \u001b[38;5;241m=\u001b[39m \u001b[38;5;124m\"\u001b[39m\u001b[38;5;124mapplication/json\u001b[39m\u001b[38;5;124m\"\u001b[39m\n\u001b[1;32m--> 116\u001b[0m \u001b[38;5;28;01mreturn\u001b[39;00m \u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mapi_client\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mrequest\u001b[49m\u001b[43m(\u001b[49m\n\u001b[0;32m    117\u001b[0m \u001b[43m    \u001b[49m\u001b[43mtype_\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mm\u001b[49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mInlineResponse200\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m    118\u001b[0m \u001b[43m    \u001b[49m\u001b[43mmethod\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[38;5;124;43m\"\u001b[39;49m\u001b[38;5;124;43mPUT\u001b[39;49m\u001b[38;5;124;43m\"\u001b[39;49m\u001b[43m,\u001b[49m\n\u001b[0;32m    119\u001b[0m \u001b[43m    \u001b[49m\u001b[43murl\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[38;5;124;43m\"\u001b[39;49m\u001b[38;5;124;43m/collections/\u001b[39;49m\u001b[38;5;132;43;01m{collection_name}\u001b[39;49;00m\u001b[38;5;124;43m\"\u001b[39;49m\u001b[43m,\u001b[49m\n\u001b[0;32m    120\u001b[0m \u001b[43m    \u001b[49m\u001b[43mheaders\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mheaders\u001b[49m\u001b[43m \u001b[49m\u001b[38;5;28;43;01mif\u001b[39;49;00m\u001b[43m \u001b[49m\u001b[43mheaders\u001b[49m\u001b[43m \u001b[49m\u001b[38;5;28;43;01melse\u001b[39;49;00m\u001b[43m \u001b[49m\u001b[38;5;28;43;01mNone\u001b[39;49;00m\u001b[43m,\u001b[49m\n\u001b[0;32m    121\u001b[0m \u001b[43m    \u001b[49m\u001b[43mpath_params\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mpath_params\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m    122\u001b[0m \u001b[43m    \u001b[49m\u001b[43mparams\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mquery_params\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m    123\u001b[0m \u001b[43m    \u001b[49m\u001b[43mcontent\u001b[49m\u001b[38;5;241;43m=\u001b[39;49m\u001b[43mbody\u001b[49m\u001b[43m,\u001b[49m\n\u001b[0;32m    124\u001b[0m \u001b[43m\u001b[49m\u001b[43m)\u001b[49m\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\qdrant_client\\http\\api_client.py:79\u001b[0m, in \u001b[0;36mApiClient.request\u001b[1;34m(self, type_, method, url, path_params, **kwargs)\u001b[0m\n\u001b[0;32m     77\u001b[0m     kwargs[\u001b[38;5;124m\"\u001b[39m\u001b[38;5;124mtimeout\u001b[39m\u001b[38;5;124m\"\u001b[39m] \u001b[38;5;241m=\u001b[39m \u001b[38;5;28mint\u001b[39m(kwargs[\u001b[38;5;124m\"\u001b[39m\u001b[38;5;124mparams\u001b[39m\u001b[38;5;124m\"\u001b[39m][\u001b[38;5;124m\"\u001b[39m\u001b[38;5;124mtimeout\u001b[39m\u001b[38;5;124m\"\u001b[39m])\n\u001b[0;32m     78\u001b[0m request \u001b[38;5;241m=\u001b[39m \u001b[38;5;28mself\u001b[39m\u001b[38;5;241m.\u001b[39m_client\u001b[38;5;241m.\u001b[39mbuild_request(method, url, \u001b[38;5;241m*\u001b[39m\u001b[38;5;241m*\u001b[39mkwargs)\n\u001b[1;32m---> 79\u001b[0m \u001b[38;5;28;01mreturn\u001b[39;00m \u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43msend\u001b[49m\u001b[43m(\u001b[49m\u001b[43mrequest\u001b[49m\u001b[43m,\u001b[49m\u001b[43m \u001b[49m\u001b[43mtype_\u001b[49m\u001b[43m)\u001b[49m\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\qdrant_client\\http\\api_client.py:96\u001b[0m, in \u001b[0;36mApiClient.send\u001b[1;34m(self, request, type_)\u001b[0m\n\u001b[0;32m     95\u001b[0m \u001b[38;5;28;01mdef\u001b[39;00m \u001b[38;5;21msend\u001b[39m(\u001b[38;5;28mself\u001b[39m, request: Request, type_: Type[T]) \u001b[38;5;241m-\u001b[39m\u001b[38;5;241m>\u001b[39m T:\n\u001b[1;32m---> 96\u001b[0m     response \u001b[38;5;241m=\u001b[39m \u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43mmiddleware\u001b[49m\u001b[43m(\u001b[49m\u001b[43mrequest\u001b[49m\u001b[43m,\u001b[49m\u001b[43m \u001b[49m\u001b[38;5;28;43mself\u001b[39;49m\u001b[38;5;241;43m.\u001b[39;49m\u001b[43msend_inner\u001b[49m\u001b[43m)\u001b[49m\n\u001b[0;32m     97\u001b[0m     \u001b[38;5;28;01mif\u001b[39;00m response\u001b[38;5;241m.\u001b[39mstatus_code \u001b[38;5;129;01min\u001b[39;00m [\u001b[38;5;241m200\u001b[39m, \u001b[38;5;241m201\u001b[39m, \u001b[38;5;241m202\u001b[39m]:\n\u001b[0;32m     98\u001b[0m         \u001b[38;5;28;01mtry\u001b[39;00m:\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\qdrant_client\\http\\api_client.py:205\u001b[0m, in \u001b[0;36mBaseMiddleware.__call__\u001b[1;34m(self, request, call_next)\u001b[0m\n\u001b[0;32m    204\u001b[0m \u001b[38;5;28;01mdef\u001b[39;00m \u001b[38;5;21m__call__\u001b[39m(\u001b[38;5;28mself\u001b[39m, request: Request, call_next: Send) \u001b[38;5;241m-\u001b[39m\u001b[38;5;241m>\u001b[39m Response:\n\u001b[1;32m--> 205\u001b[0m     \u001b[38;5;28;01mreturn\u001b[39;00m \u001b[43mcall_next\u001b[49m\u001b[43m(\u001b[49m\u001b[43mrequest\u001b[49m\u001b[43m)\u001b[49m\n",
      "File \u001b[1;32mc:\\Users\\nasan\\miniconda3\\Lib\\site-packages\\qdrant_client\\http\\api_client.py:108\u001b[0m, in \u001b[0;36mApiClient.send_inner\u001b[1;34m(self, request)\u001b[0m\n\u001b[0;32m    106\u001b[0m     response \u001b[38;5;241m=\u001b[39m \u001b[38;5;28mself\u001b[39m\u001b[38;5;241m.\u001b[39m_client\u001b[38;5;241m.\u001b[39msend(request)\n\u001b[0;32m    107\u001b[0m \u001b[38;5;28;01mexcept\u001b[39;00m \u001b[38;5;167;01mException\u001b[39;00m \u001b[38;5;28;01mas\u001b[39;00m e:\n\u001b[1;32m--> 108\u001b[0m     \u001b[38;5;28;01mraise\u001b[39;00m ResponseHandlingException(e)\n\u001b[0;32m    109\u001b[0m \u001b[38;5;28;01mreturn\u001b[39;00m response\n",
      "\u001b[1;31mResponseHandlingException\u001b[0m: [Errno 11001] getaddrinfo failed"
     ]
    }
   ],
   "source": [
    "import time\n",
    "import math\n",
    "import uuid\n",
    "import logging\n",
    "from typing import List, Dict, Any, Optional\n",
    "from fastapi import FastAPI, APIRouter, HTTPException, Depends\n",
    "from pydantic import BaseModel\n",
    "from qdrant_client import QdrantClient\n",
    "from qdrant_client.http.models import PointStruct, Distance, VectorParams, Batch\n",
    "from sentence_transformers import SentenceTransformer\n",
    "\n",
    "\n",
    "# Set up logging\n",
    "logging.basicConfig(level=logging.INFO)\n",
    "logger = logging.getLogger(__name__)\n",
    "\n",
    "# Constants and thresholds\n",
    "GRAVITATIONAL_THRESHOLD = 1e-5\n",
    "MEMORY_LIMIT = 1000000\n",
    "\n",
    "class MemoryPacket:\n",
    "    def __init__(self, vector: List[float], metadata: Dict[str, Any]):\n",
    "        self.vector = vector\n",
    "        self.metadata = metadata or {}\n",
    "\n",
    "        self.metadata.setdefault(\"timestamp\", time.time())\n",
    "        self.metadata.setdefault(\"recall_count\", 0)\n",
    "        self.metadata.setdefault(\"memetic_similarity\", self.calculate_memetic_similarity())\n",
    "        self.metadata.setdefault(\"semantic_relativity\", 1.0)\n",
    "        self.metadata.setdefault(\"gravitational_pull\", self.calculate_gravitational_pull())\n",
    "        self.metadata.setdefault(\"spacetime_coordinate\", self.calculate_spacetime_coordinate())\n",
    "\n",
    "    def calculate_gravitational_pull(self) -> float:\n",
    "        vector_magnitude = math.sqrt(sum(x ** 2 for x in self.vector))\n",
    "        recall_count = self.metadata[\"recall_count\"]\n",
    "        memetic_similarity = self.metadata[\"memetic_similarity\"]\n",
    "        semantic_relativity = self.metadata[\"semantic_relativity\"]\n",
    "\n",
    "        gravitational_pull = vector_magnitude * (1 + math.log1p(recall_count)) * memetic_similarity * semantic_relativity\n",
    "        self.metadata[\"gravitational_pull\"] = gravitational_pull\n",
    "        return gravitational_pull\n",
    "\n",
    "    def calculate_spacetime_coordinate(self) -> float:\n",
    "        time_decay_factor = 1 + (time.time() - self.metadata.get(\"timestamp\", time.time()))\n",
    "        spacetime_coordinate = self.metadata[\"gravitational_pull\"] / time_decay_factor\n",
    "        self.metadata[\"spacetime_coordinate\"] = spacetime_coordinate\n",
    "        return spacetime_coordinate\n",
    "\n",
    "    def update_relevance(self, query_vector: List[float]):\n",
    "        self.metadata[\"semantic_relativity\"] = self.calculate_cosine_similarity(self.vector, query_vector)\n",
    "        self.metadata[\"memetic_similarity\"] = self.calculate_memetic_similarity()\n",
    "        self.calculate_gravitational_pull()\n",
    "        self.calculate_spacetime_coordinate()\n",
    "\n",
    "    def calculate_memetic_similarity(self) -> float:\n",
    "        if \"tags\" not in self.metadata:\n",
    "            return 1.0\n",
    "\n",
    "        tags = set(self.metadata.get(\"tags\", []))\n",
    "        reference_tags = set(self.metadata.get(\"reference_tags\", []))\n",
    "\n",
    "        if not tags or not reference_tags:\n",
    "            return 1.0\n",
    "\n",
    "        intersection = len(tags.intersection(reference_tags))\n",
    "        union = len(tags.union(reference_tags))\n",
    "\n",
    "        if union == 0:\n",
    "            return 1.0\n",
    "\n",
    "        return intersection / union\n",
    "\n",
    "    @staticmethod\n",
    "    def calculate_cosine_similarity(vector_a: List[float], vector_b: List[float]) -> float:\n",
    "        dot_product = sum(a * b for a, b in zip(vector_a, vector_b))\n",
    "        magnitude_a = math.sqrt(sum(a ** 2 for a in vector_a))\n",
    "        magnitude_b = math.sqrt(sum(b ** 2 for b in vector_b))\n",
    "\n",
    "        if magnitude_a == 0 or magnitude_b == 0:\n",
    "            return 0.0\n",
    "\n",
    "        return dot_product / (magnitude_a * magnitude_b)\n",
    "\n",
    "    def to_payload(self) -> Dict[str, Any]:\n",
    "        return {\n",
    "            \"vector\": self.vector,\n",
    "            \"metadata\": self.metadata\n",
    "        }\n",
    "\n",
    "    @staticmethod\n",
    "    def from_payload(payload: Dict[str, Any]):\n",
    "        return MemoryPacket(payload[\"vector\"], payload[\"metadata\"])\n",
    "\n",
    "class MemoryManager:\n",
    "    def __init__(self, qdrant_host=\"qdrant\", qdrant_port=6333, collection_name=\"Mind\"):\n",
    "        self.qdrant_client = QdrantClient(host=qdrant_host, port=qdrant_port)\n",
    "        self.collection_name = collection_name\n",
    "        self.model = SentenceTransformer('all-MiniLM-L6-v2')\n",
    "        self._setup_collection()\n",
    "\n",
    "    def _setup_collection(self):\n",
    "        try:\n",
    "            self.qdrant_client.get_collection(self.collection_name)\n",
    "            logger.info(f\"Collection '{self.collection_name}' exists.\")\n",
    "        except Exception:\n",
    "            logger.info(f\"Creating collection '{self.collection_name}'.\")\n",
    "            self.qdrant_client.create_collection(\n",
    "                collection_name=self.collection_name,\n",
    "                vectors_config=VectorParams(size=self.model.get_sentence_embedding_dimension(), distance=Distance.COSINE)\n",
    "            )\n",
    "\n",
    "    async def create_memory(self, content: str, metadata: Dict[str, Any]):\n",
    "        vector = self.model.encode(content).tolist()\n",
    "        memory_packet = MemoryPacket(vector=vector, metadata=metadata)\n",
    "        point_id = str(uuid.uuid4())\n",
    "\n",
    "        self.qdrant_client.upsert(\n",
    "            collection_name=self.collection_name,\n",
    "            points=[PointStruct(id=point_id, vector=vector, payload=memory_packet.to_payload())]\n",
    "        )\n",
    "        logger.info(f\"Memory created successfully with ID: {point_id}\")\n",
    "\n",
    "    async def recall_memory(self, query_content: str, top_k: int = 5):\n",
    "        query_vector = self.model.encode(query_content).tolist()\n",
    "\n",
    "        results = self.qdrant_client.search(\n",
    "            collection_name=self.collection_name,\n",
    "            query_vector=query_vector,\n",
    "            limit=top_k\n",
    "        )\n",
    "\n",
    "        memories = [MemoryPacket.from_payload(hit.payload) for hit in results]\n",
    "\n",
    "        for memory in memories:\n",
    "            memory.update_relevance(query_vector)\n",
    "\n",
    "        return [memory.metadata for memory in memories]\n",
    "\n",
    "    async def prune_memories(self):\n",
    "        total_points = self.qdrant_client.count(self.collection_name).count\n",
    "        if total_points > MEMORY_LIMIT:\n",
    "            points = self.qdrant_client.scroll(self.collection_name, limit=1000)\n",
    "            low_relevance_points = [\n",
    "                p.id for p in points if p.payload['metadata']['gravitational_pull'] < GRAVITATIONAL_THRESHOLD\n",
    "            ]\n",
    "            if low_relevance_points:\n",
    "                self.qdrant_client.delete(self.collection_name, points_selector=low_relevance_points)\n",
    "\n",
    "class LLMManager:\n",
    "    def __init__(self):\n",
    "        self.llm_models = {}\n",
    "        self.overridden_keys = {}\n",
    "\n",
    "        # Initialize OpenAI and Ollama models\n",
    "        self.llm_models[\"openai\"] = OpenAILLM(api_key=self.overridden_keys.get(\"openai\", \"\"))\n",
    "        self.llm_models[\"ollama\"] = OllamaLLM()\n",
    "\n",
    "    def set_api_key(self, provider: str, api_key: str):\n",
    "        if not provider or not api_key:\n",
    "            raise ValueError(\"Both provider and api_key must be non-empty strings\")\n",
    "        self.overridden_keys[provider] = api_key\n",
    "\n",
    "    def route_query(self, message: str, model: Optional[str] = None) -> Dict[str, Any]:\n",
    "        if not message.strip():\n",
    "            return {\"error\": \"Empty message provided\"}\n",
    "\n",
    "        if model:\n",
    "            for provider, llm in self.llm_models.items():\n",
    "                try:\n",
    "                    response = llm.create_message(model, message)\n",
    "                    if \"error\" not in response:\n",
    "                        return response\n",
    "                except Exception as e:\n",
    "                    logger.exception(f\"Unexpected error with {provider}, model {model}: {str(e)}\")\n",
    "            return {\"error\": f\"Specified model {model} is not available or failed for all providers\"}\n",
    "\n",
    "        for provider, llm in self.llm_models.items():\n",
    "            try:\n",
    "                response = llm.create_message(provider, message)\n",
    "                if \"error\" not in response:\n",
    "                    return response\n",
    "            except Exception as e:\n",
    "                logger.exception(f\"Unexpected error with {provider}: {str(e)}\")\n",
    "\n",
    "        return {\"error\": \"No available models could process the request\"}\n",
    "\n",
    "class Message(BaseModel):\n",
    "    content: str\n",
    "    model: Optional[str] = None\n",
    "\n",
    "class MemoryRequest(BaseModel):\n",
    "    content: str\n",
    "    metadata: Optional[Dict[str, Any]] = None\n",
    "\n",
    "class RecallRequest(BaseModel):\n",
    "    query: str\n",
    "    top_k: Optional[int] = 5\n",
    "\n",
    "class PruneRequest(BaseModel):\n",
    "    gravity_threshold: Optional[float] = 1e-5\n",
    "\n",
    "class APIKeyUpdate(BaseModel):\n",
    "    provider: str\n",
    "    api_key: str\n",
    "\n",
    "gravrag_router = APIRouter()\n",
    "neural_resources_router = APIRouter()\n",
    "\n",
    "memory_manager = MemoryManager()\n",
    "llm_manager = LLMManager()\n",
    "\n",
    "@gravrag_router.post(\"/create_memory\")\n",
    "async def create_memory(memory_request: MemoryRequest):\n",
    "    if not memory_request.content.strip():\n",
    "        logger.warning(\"Memory creation failed: Empty content.\")\n",
    "        raise HTTPException(status_code=400, detail=\"Content cannot be empty.\")\n",
    "    metadata = memory_request.metadata or {}\n",
    "    try:\n",
    "        logger.info(f\"Creating memory: '{memory_request.content}' with metadata: {metadata}\")\n",
    "        await memory_manager.create_memory(content=memory_request.content, metadata=metadata)\n",
    "        return {\"message\": \"Memory created successfully\"}\n",
    "    except Exception as e:\n",
    "        logger.error(f\"Error during memory creation: {str(e)}\", exc_info=True)\n",
    "        raise HTTPException(status_code=500, detail=f\"Error creating memory: {str(e)}\")\n",
    "\n",
    "@gravrag_router.post(\"/recall_memory\")\n",
    "async def recall_memory(recall_request: RecallRequest):\n",
    "    if not recall_request.query.strip():\n",
    "        logger.warning(\"Memory recall failed: Empty query.\")\n",
    "        raise HTTPException(status_code=400, detail=\"Query cannot be empty.\")\n",
    "    try:\n",
    "        logger.info(f\"Recalling memories for query: '{recall_request.query}' with top_k={recall_request.top_k}\")\n",
    "        memories = await memory_manager.recall_memory(query_content=recall_request.query, top_k=recall_request.top_k)\n",
    "        if not memories:\n",
    "            return {\"message\": \"No relevant memories found\"}\n",
    "        return {\"memories\": memories}\n",
    "    except Exception as e:\n",
    "        logger.error(f\"Error during memory recall: {str(e)}\", exc_info=True)\n",
    "        raise HTTPException(status_code=500, detail=f\"Error recalling memories: {str(e)}\")\n",
    "\n",
    "@gravrag_router.post(\"/prune_memories\")\n",
    "async def prune_memories(prune_request: PruneRequest):\n",
    "    try:\n",
    "        await memory_manager.prune_memories()\n",
    "        return {\"message\": \"Memory pruning completed successfully\"}\n",
    "    except Exception as e:\n",
    "        logger.error(f\"Error during memory pruning: {str(e)}\", exc_info=True)\n",
    "        raise HTTPException(status_code=500, detail=f\"Error pruning memories: {str(e)}\")\n",
    "\n",
    "@neural_resources_router.post(\"/route_query\")\n",
    "async def route_query(message: Message):\n",
    "    try:\n",
    "        response = llm_manager.route_query(message.content, message.model)\n",
    "        if \"error\" in response:\n",
    "            raise HTTPException(status_code=500, detail=response[\"error\"])\n",
    "        return response\n",
    "    except HTTPException as e:\n",
    "        raise e\n",
    "    except Exception as e:\n",
    "        logger.error(f\"Error during query routing: {str(e)}\", exc_info=True)\n",
    "        raise HTTPException(status_code=500, detail=f\"Error routing query: {str(e)}\")\n",
    "\n",
    "@neural_resources_router.post(\"/set_api_key\")\n",
    "async def set_api_key(api_key_update: APIKeyUpdate):\n",
    "    try:\n",
    "        llm_manager.set_api_key(api_key_update.provider, api_key_update.api_key)\n",
    "        return {\"message\": f\"API key updated for {api_key_update.provider}\"}\n",
    "    except ValueError as e:\n",
    "        raise HTTPException(status_code=400, detail=str(e))\n",
    "    except Exception as e:\n",
    "        logger.error(f\"Error during API key update: {str(e)}\", exc_info=True)\n",
    "        raise HTTPException(status_code=500, detail=f\"Error updating API key: {str(e)}\")\n",
    "\n",
    "@neural_resources_router.get(\"/available_models\")\n",
    "async def get_available_models():\n",
    "    return {\"available_models\": list(llm_manager.llm_models.keys())}\n",
    "\n",
    "app = FastAPI()\n",
    "app.include_router(gravrag_router, prefix=\"/gravrag\", tags=[\"GravRAG\"])\n",
    "app.include_router(neural_resources_router, prefix=\"/neural_resources\", tags=[\"Neural Resources\"])\n",
    "\n",
    "if __name__ == \"__main__\":\n",
    "    import uvicorn\n",
    "    uvicorn.run(app, host=\"0.0.0.0\", port=8000)"
   ]
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.12.3"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 2
}

```

## `projectMakeit\test2.MD`

```
I'll provide a comprehensive implementation of the Cogenesis Backend API system, incorporating all the components we've discussed and adding the suggested improvements. This implementation will be fully functional and ready to use.

Let's start with the project structure and then go through each file:

```
cogenesis-backend/
│
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── gravrag.py
│   │   └── neural_resources.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── security.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── gravrag.py
│   │   └── neural_resources.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── gravrag.py
│   │   └── neural_resources.py
│   └── main.py
├── tests/
│   ├── __init__.py
│   ├── test_gravrag.py
│   └── test_neural_resources.py
├── .env
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── README.md

```

Now, let's implement each file:

1. `.env`:

```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
QDRANT_HOST=qdrant
QDRANT_PORT=6333

```

1. `.gitignore`:

```
# Python
__pycache__/
*.py[cod]
*.pyo
*.pyd
.Python
env/
venv/
pip-log.txt
pip-delete-this-directory.txt

# Environments
.env
.venv
env/
venv/

# IDEs
.vscode/
.idea/

# Logs
*.log

# Docker
.docker/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

```

1. `Dockerfile`:

```
FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

```

1. `docker-compose.yml`:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
      - QDRANT_HOST=qdrant
      - QDRANT_PORT=6333
    depends_on:
      - qdrant

  qdrant:
    image: qdrant/qdrant
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

volumes:
  qdrant_data:

```

1. `requirements.txt`:

```
fastapi==0.68.0
uvicorn==0.15.0
pydantic==1.8.2
python-dotenv==0.19.0
qdrant-client==0.11.0
sentence-transformers==2.1.0
anthropic==0.2.8
openai==0.27.0
groq==0.1.0
requests==2.26.0
python-jose==3.3.0
passlib==1.7.4
bcrypt==3.2.0
prometheus-client==0.11.0

```

1. `app/core/config.py`:

```python
from pydantic import BaseSettings

class Settings(BaseSettings):
    ANTHROPIC_API_KEY: str
    OPENAI_API_KEY: str
    GROQ_API_KEY: str
    QDRANT_HOST: str
    QDRANT_PORT: int
    JWT_SECRET_KEY: str = "your-secret-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()

```

1. `app/core/security.py`:

```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    return token_data

```

1. `app/models/gravrag.py`:

```python
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class MemoryPacket(BaseModel):
    vector: List[float]
    metadata: Dict[str, Any]

class MemoryRequest(BaseModel):
    content: str
    metadata: Optional[Dict[str, Any]] = None

class RecallRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5

class PruneRequest(BaseModel):
    gravity_threshold: Optional[float] = 1e-5

```

1. `app/models/neural_resources.py`:

```python
from pydantic import BaseModel

class Message(BaseModel):
    content: str
    role: str

class APIKeyUpdate(BaseModel):
    provider: str
    api_key: str

```

1. `app/services/gravrag.py`:

```python
import time
import math
import uuid
import logging
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

from app.core.config import settings
from app.models.gravrag import MemoryPacket

logger = logging.getLogger(__name__)

GRAVITATIONAL_THRESHOLD = 1e-5

class MemoryManager:
    def __init__(self):
        self.qdrant_client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)
        self.collection_name = "Mind"
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self._setup_collection()

    def _setup_collection(self):
        try:
            self.qdrant_client.get_collection(self.collection_name)
            logger.info(f"Collection '{self.collection_name}' exists.")
        except Exception:
            logger.info(f"Creating collection '{self.collection_name}'.")
            self.qdrant_client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=self.model.get_sentence_embedding_dimension(), distance=Distance.COSINE)
            )

    async def create_memory(self, content: str, metadata: Dict[str, Any]):
        vector = self.model.encode(content).tolist()
        memory_packet = MemoryPacket(vector=vector, metadata=metadata)
        point_id = str(uuid.uuid4())

        self.qdrant_client.upsert(
            collection_name=self.collection_name,
            points=[PointStruct(id=point_id, vector=vector, payload=memory_packet.dict())]
        )
        logger.info(f"Memory created successfully with ID: {point_id}")

    async def recall_memory(self, query_content: str, top_k: int = 5):
        query_vector = self.model.encode(query_content).tolist()

        results = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=top_k
        )

        memories = [MemoryPacket(**hit.payload) for hit in results]

        for memory in memories:
            self._update_relevance(memory, query_vector)

        return [memory.metadata for memory in memories]

    def _update_relevance(self, memory: MemoryPacket, query_vector: List[float]):
        memory.metadata["semantic_relativity"] = self._calculate_cosine_similarity(memory.vector, query_vector)
        memory.metadata["memetic_similarity"] = self._calculate_memetic_similarity(memory.metadata)
        memory.metadata["gravitational_pull"] = self._calculate_gravitational_pull(memory)
        memory.metadata["spacetime_coordinate"] = self._calculate_spacetime_coordinate(memory)

    @staticmethod
    def _calculate_cosine_similarity(vector_a: List[float], vector_b: List[float]) -> float:
        dot_product = sum(a * b for a, b in zip(vector_a, vector_b))
        magnitude_a = math.sqrt(sum(a ** 2 for a in vector_a))
        magnitude_b = math.sqrt(sum(b ** 2 for b in vector_b))

        if magnitude_a == 0 or magnitude_b == 0:
            return 0.0

        return dot_product / (magnitude_a * magnitude_b)

    @staticmethod
    def _calculate_memetic_similarity(metadata: Dict[str, Any]) -> float:
        tags = set(metadata.get("tags", []))
        reference_tags = set(metadata.get("reference_tags", []))

        if not tags or not reference_tags:
            return 1.0

        intersection = len(tags.intersection(reference_tags))
        union = len(tags.union(reference_tags))

        return intersection / union if union > 0 else 1.0

    @staticmethod
    def _calculate_gravitational_pull(memory: MemoryPacket) -> float:
        vector_magnitude = math.sqrt(sum(x ** 2 for x in memory.vector))
        recall_count = memory.metadata.get("recall_count", 0)
        memetic_similarity = memory.metadata.get("memetic_similarity", 1.0)
        semantic_relativity = memory.metadata.get("semantic_relativity", 1.0)

        return vector_magnitude * (1 + math.log1p(recall_count)) * memetic_similarity * semantic_relativity

    @staticmethod
    def _calculate_spacetime_coordinate(memory: MemoryPacket) -> float:
        time_decay_factor = 1 + (time.time() - memory.metadata.get("timestamp", time.time()))
        return memory.metadata["gravitational_pull"] / time_decay_factor

    async def prune_memories(self):
        total_points = self.qdrant_client.count(self.collection_name).count
        if total_points > 1000000:  # Arbitrary limit
            points = self.qdrant_client.scroll(self.collection_name, limit=1000)
            low_relevance_points = [
                p.id for p in points if p.payload['metadata']['gravitational_pull'] < GRAVITATIONAL_THRESHOLD
            ]
            if low_relevance_points:
                self.qdrant_client.delete(
                    collection_name=self.collection_name,
                    points_selector={"points": low_relevance_points}
                )
                logger.info(f"Pruned {len(low_relevance_points)} low-relevance memories.")

memory_manager = MemoryManager()

```

1. `app/services/neural_resources.py`:

```python
import os
import logging
from typing import List, Dict, Any, Optional
from anthropic import Anthropic
import openai
from groq import Groq
import requests

from app.core.config import settings

logger = logging.getLogger(__name__)

class AIAsset:
    def __init__(self, api_key: str):
        self.api_key = api_key

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        raise NotImplementedError

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        raise NotImplementedError

class AnthropicLLM(AIAsset):
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.client = Anthropic(api_key=api_key)
        logger.info("Anthropic LLM initialized")

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for Anthropic model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to Anthropic LLM")
            return {"error": "Empty message provided"}
        try:
            response = self.client.messages.create(
                model=model,
                messages=[{"role": role, "content": message}],
            )
            logger.info(f"Successfully created message with Anthropic model: {model}")
            return response.model_dump()
        except Exception as e:
            logger.exception(f"Error creating message for Anthropic: {str(e)}")
            return {"error": f"Anthropic failed: {str(e)}"}

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        return response.get('usage', {}).get('output_tokens', 0)

class OpenAILLM(AIAsset):
    def __init__(self, api_key: str):
        super().__init__(api_key)
        openai.api_key = api_key
        logger.info("OpenAI LLM initialized")

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for OpenAI model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to OpenAI LLM")
            return {"error": "Empty message provided"}
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=[{"role": role, "content": message}],
            )
            logger.info(f"Successfully created message with OpenAI model: {model}")
            return response.to_dict()
        except Exception as e:
            logger.exception(f"Error creating message for OpenAI: {str(e)}")
            return {"error": f"OpenAI failed: {str(e)}"}

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        return response.get('usage', {}).get('completion_tokens', 0)

class GroqLLM(AIAsset):
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.client = Groq(api_key=api_key)
        logger.info("Groq LLM initialized")

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for Groq model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to Groq LLM")
            return {"error": "Empty message provided"}
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[{"role": role, "content": message}],
            )
            logger.info(f"Successfully created message with Groq model: {model}")
            return response.to_dict()
        except Exception as e:
            logger.exception(f"Error creating message for Groq: {str(e)}")
            return {"error": f"Groq failed: {str(e)}"}

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        return response.get('usage', {}).get('completion_tokens', 0)

class OllamaLLM(AIAsset):
    def __init__(self, base_url: str = "<http://localhost:11434>"):
        super().__init__(api_key="")
        self.base_url = base_url
        logger.info(f"Ollama LLM initialized with base URL: {base_url}")

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for Ollama model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to Ollama LLM")
            return {"error": "Empty message provided"}
        try:
            url = f"{self.base_url}/api/generate"
            payload = {
                "model": model,
                "role": role,
                "prompt": message,
                "stream": False
            }
            response = requests.post(url, json=payload, timeout=30)
            response.raise_for_status()
            logger.info(f"Successfully created message with Ollama model: {model}")
            return response.json()
        except requests.RequestException as e:
            logger.exception(f"Error creating message for Ollama: {str(e)}")
            return {"error": f"Ollama failed: {str(e)}"}

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        return len(response.get('response', '').split())

class LLMManager:
    def __init__(self):
        self.llm_models: Dict[str, AIAsset] = {}
        self.overridden_keys: Dict[str, str] = {}
        self.models_cache = {}  # Cache to store fetched model info
        self._initialize_models()
        logger.info("LLMManager initialized")

    def _initialize_models(self):
        logger.debug("Initializing AI models")
        for provider, api_key in self._load_api_keys().items():
            if api_key:
                llm_instance = self._create_llm_instance(provider, api_key)
                if llm_instance:
                    self.llm_models[provider] = llm_instance
        self.llm_models["ollama"] = OllamaLLM()
        logger.info(f"Initialized models: {', '.join(self.llm_models.keys())}")

    def _load_api_keys(self) -> Dict[str, str]:
        logger.debug("Loading API keys")
        keys = {
            "anthropic": self.overridden_keys.get('anthropic', settings.ANTHROPIC_API_KEY),
            "openai": self.overridden_keys.get('openai', settings.OPENAI_API_KEY),
            "groq": self.overridden_keys.get('groq', settings.GROQ_API_KEY),
        }
        for provider, key in keys.items():
            if key:
                logger.info(f"API key loaded for {provider}")
            else:
                logger.warning(f"No API key found for {provider}")
        return keys

    def _create_llm_instance(self, provider: str, api_key: str) -> Optional[AIAsset]:
        logger.debug(f"Creating LLM instance for provider: {provider}")
        if provider == "anthropic":
            return AnthropicLLM(api_key)
        elif provider == "openai":
            return OpenAILLM(api_key)
        elif provider == "groq":
            return GroqLLM(api_key)
        else:
            logger.warning(f"Unknown provider: {provider}")
            return None

    def set_api_key(self, provider: str, api_key: str):
        logger.info(f"Setting API key for provider: {provider}")
        if not provider or not api_key:
            logger.error("Invalid provider or API key provided")
            raise ValueError("Both provider and api_key must be non-empty strings")
        self.overridden_keys[provider] = api_key
        self._initialize_models()

    def get_available_models(self) -> List[str]:
        models = []

        # Fetch Ollama models
        try:
            logger.info("Fetching Ollama models")
            ollama_response = requests.get("<http://localhost:11434/api/tags>")
            if ollama_response.status_code == 200:
                ollama_data = ollama_response.json()
                ollama_models = [model['name'] for model in ollama_data.get('models', [])]
                models.extend(ollama_models)
            else:
                logger.error(f"Failed to fetch Ollama models: {ollama_response.status_code}")
        except Exception as e:
            logger.error(f"Error fetching Ollama models: {str(e)}")

        # Fetch Groq models
        try:
            logger.info("Fetching Groq models")
            groq_api_key = settings.GROQ_API_KEY
            groq_response = requests.get(
                "<https://api.groq.com/openai/v1/models>",
                headers={
                    "Authorization": f"Bearer {groq_api_key}",
                    "Content-Type": "application/json"
                }
            )
            if groq_response.status_code == 200:
                groq_models_data = groq_response.json()
                groq_models = groq_models_data.get("data", [])
                models.extend([model['id'] for model in groq_models])
            else:
                logger.error(f"Failed to fetch Groq models: {groq_response.status_code}")
        except Exception as e:
            logger.error(f"Error fetching Groq models: {str(e)}")

        logger.debug(f"Available models: {', '.join(models)}")
        return models

    def route_query(self, message: str, role: str, model: Optional[str] = None) -> Dict[str, Any]:
        logger.info(f"Routing query to {'specified model: ' + model if model else 'default model'}")
        if not message.strip():
            logger.warning("Empty message provided to route_query")
            return {"error": "Empty message provided"}

        if model:
            for provider, llm in self.llm_models.items():
                try:
                    logger.debug(f"Attempting to create message with provider: {provider}, model: {model}")
                    response = llm.create_message(model, role, message)
                    if "error" not in response:
                        logger.info(f"Successfully created message with provider: {provider}, model: {model}")
                        return response
                    logger.warning(f"Error with {provider}, model {model}: {response['error']}")
                except Exception as e:
                    logger.exception(f"Unexpected error with {provider}, model {model}: {str(e)}")

            logger.error(f"Specified model {model} is not available or failed for all providers")
            return {"error": f"Specified model {model} is not available or failed for all providers"}

        for provider, llm in self.llm_models.items():
            try:
                logger.debug(f"Attempting to create message with provider: {provider}")
                response = llm.create_message(provider, role, message)
                if "error" not in response:
                    logger.info(f"Successfully created message with provider: {provider}")
                    return response
                logger.warning(f"Error with {provider}: {response['error']}")
            except Exception as e:
                logger.exception(f"Unexpected error with {provider}: {str(e)}")

        logger.error("No available models could process the request")
        return {"error": "No available models could process the request"}

    def get_model_info(self, model: str) -> Dict[str, Any]:
        logger.info(f"Retrieving model info for model: {model}")

        # Check if the model info is cached
        if model in self.models_cache:
            logger.debug(f"Model info for {model} retrieved from cache.")
            return self.models_cache[model]

        try:
            # Fetch from Ollama
            available_models = self.get_available_models()
            if model in available_models:
                logger.info(f"Fetching model info from Ollama for model: {model}")
                url = f"{self.llm_models['ollama'].base_url}/api/models/{model}"
                ollama_response = requests.get(url)
                if ollama_response.status_code == 200:
                    model_info = ollama_response.json()
                    self.models_cache[model] = model_info
                    logger.debug(f"Fetched Ollama model info: {model_info}")
                    return model_info
                else:
                    logger.error(f"Failed to fetch Ollama model info: {ollama_response.status_code}, Response: {ollama_response.text}")

            # Fetch from Groq
            groq_api_key = settings.GROQ_API_KEY
            if groq_api_key:
                logger.info(f"Fetching model info from Groq for model: {model}")
                url = f"<https://api.groq.com/openai/v1/models/{model}>"
                groq_response = requests.get(
                    url,
                    headers={
                        "Authorization": f"Bearer {groq_api_key}",
                        "Content-Type": "application/json"
                    }
                )
                if groq_response.status_code == 200:
                    model_info = groq_response.json()
                    self.models_cache[model] = model_info
                    logger.debug(f"Fetched Groq model info: {model_info}")
                    return model_info
                else:
                    logger.error(f"Failed to fetch Groq model info: {groq_response.status_code}, Response: {groq_response.text}")
        except Exception as e:
            logger.error(f"Error fetching model info for {model}: {str(e)}")
            return {"error": f"Model {model} not found or failed to retrieve info."}

        logger.error(f"Model {model} not found in any provider.")
        return {"error": f"Model {model} not found in any provider."}

llm_manager = LLMManager()

```

1. `app/api/gravrag.py`:

```python
from fastapi import APIRouter, HTTPException, Depends
from app.models.gravrag import MemoryRequest, RecallRequest, PruneRequest
from app.services.gravrag import memory_manager
from app.core.security import get_current_user

router = APIRouter()

@router.post("/create_memory")
async def create_memory(memory_request: MemoryRequest, current_user: dict = Depends(get_current_user)):
    if not memory_request.content.strip():
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
    try:
        await memory_manager.create_memory(content=memory_request.content, metadata=memory_request.metadata)
        return {"message": "Memory created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating memory: {str(e)}")

@router.post("/recall_memory")
async def recall_memory(recall_request: RecallRequest, current_user: dict = Depends(get_current_user)):
    if not recall_request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    try:
        memories = await memory_manager.recall_memory(query_content=recall_request.query, top_k=recall_request.top_k)
        if not memories:
            return {"message": "No relevant memories found"}
        return {"memories": memories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error recalling memories: {str(e)}")

@router.post("/prune_memories")
async def prune_memories(prune_request: PruneRequest, current_user: dict = Depends(get_current_user)):
    try:
        await memory_manager.prune_memories()
        return {"message": "Memory pruning completed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error pruning memories: {str(e)}")

```

1. `app/api/neural_resources.py`:

```python
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

```

1. `app/main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import make_asgi_app

from app.api import gravrag, neural_resources

app = FastAPI(title="Cogenesis Backend API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Prometheus metrics
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# Include routers
app.include_router(gravrag.router, prefix="/gravrag", tags=["GravRag"])
app.include_router(neural_resources.router, prefix="/neural_resources", tags=["Neural Resources"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Cogenesis Backend API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

```

1. `tests/test_gravrag.py`:

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture
def mock_memory_manager(mocker):
    return mocker.patch('app.services.gravrag.MemoryManager')

def test_create_memory(mock_memory_manager):
    response = client.post("/gravrag/create_memory", json={"content": "Test memory", "metadata": {"key": "value"}})
    assert response.status_code == 200
    assert response.json() == {"message": "Memory created successfully"}

def test_recall_memory(mock_memory_manager):
    mock_memory_manager.return_value.recall_memory.return_value = [{"content": "Test memory"}]
    response = client.post("/gravrag/recall_memory", json={"query": "Test query", "top_k": 5})
    assert response.status_code == 200
    assert "memories" in response.json()

def test_prune_memories(mock_memory_manager):
    response = client.post("/gravrag/prune_memories", json={"gravity_threshold": 0.5})
    assert response.status_code == 200
    assert response.json() == {"message": "Memory pruning completed successfully"}

```

1. `tests/test_neural_resources.py`:

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture
def mock_llm_manager(mocker):
    return mocker.patch('app.services.neural_resources.LLMManager')

def test_route_query(mock_llm_manager):
    mock_llm_manager.return_value.route_query.return_value = {"response": "Test response"}
    response = client.post("/neural_resources/route_query", json={"content": "Test query", "role": "user"})
    assert response.status_code == 200
    assert "response" in response.json()

def test_set_api_key(mock_llm_manager):
    response = client.post("/neural_resources/set_api_key", json={"provider": "test_provider", "api_key": "test_key"})
    assert response.status_code == 200
    assert response.json() == {"message": "API key updated for test_provider"}

def test_get_available_models(mock_llm_manager):
    mock_llm_manager.return_value.get_available_models.return_value = ["model1", "model2"]
    response = client.get("/neural_resources/available_models")
    assert response.status_code == 200
    assert "available_models" in response.json()

def test_get_model_info(mock_llm_manager):
    mock_llm_manager.return_value.get_model_info.return_value = {"model": "test_model", "info": "test_info"}
    response = client.get("/neural_resources/model_info/test_model")
    assert response.status_code == 200
    assert "model" in response.json()

```

1. `README.md`:

```markdown
# Cogenesis Backend API

This project implements a comprehensive backend API for the Cogenesis system, integrating GravRag memory management and Neural Resources for AI model interactions.

## Features

- GravRag memory management (create, recall, prune)
- Neural Resources for interacting with various AI models (Anthropic, OpenAI, Groq, Ollama)
- Authentication and authorization
- Docker support
- Prometheus metrics

## Getting Started

### Prerequisites

- Python 3.9+
- Docker and Docker Compose (optional)

### Installation

1. Clone the repository:

```

git clone https://github.com/your-repo/cogenesis-backend.git
cd cogenesis-backend

```

2. Create a virtual environment and activate it:

```

python -m venv venv
source venv/bin/activate  # On Windows, use `venv\\Scripts\\activate`

```

3. Install the dependencies:

```

pip install -r requirements.txt

```

4. Set up environment variables:
Create a `.env` file in the root directory and add the following:

```

ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key
QDRANT_HOST=localhost
QDRANT_PORT=6333
JWT_SECRET_KEY=your_jwt_secret_key

```

### Running the Application

#### Using Python

1. Start the Qdrant server (if not using Docker):

```

qdrant

```

2. Run the FastAPI application:

```

uvicorn app.main:app --reload

```

#### Using Docker

1. Build and run the Docker containers:

```

docker-compose up --build

```

The API will be available at `http://localhost:8000`.

## API Documentation

Once the application is running, you can access the Swagger UI documentation at `http://localhost:8000/docs`.

## Testing

Run the tests using pytest:

```

pytest

```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

```

This comprehensive implementation includes all the components we've discussed, incorporating improvements such as authentication, Docker support, asynchronous operations, error handling, and more. The project structure is organized for scalability and maintainability.

To run this project:

1. Set up the environment variables in the `.env` file.
2. Install the dependencies using `pip install -r requirements.txt`.
3. Run the application using `uvicorn app.main:app --reload` or use Docker with `docker-compose up --build`.

The API will be available at `http://localhost:8000`, and you can access the Swagger UI documentation at `http://localhost:8000/docs`.

Remember to implement proper error handling, logging, and security measures in a production environment. Also, consider adding more comprehensive tests and documentation as the project evolves.
```

## `projectMakeit\test3.sh`

```
#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# ----------------------------
# Function Definitions
# ----------------------------

# Function to create directories
create_directories() {
    echo "Creating project directories..."
    mkdir -p cogenesis_backend/{api,tests,docs}
    echo "Directories created."
}

# Function to create and populate main.py
create_main_py() {
    echo "Creating main.py..."
    cat << 'EOF' > cogenesis_backend/main.py
import os
import time
import math
import uuid
import logging
from typing import List, Dict, Any, Optional
import requests

from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from anthropic import Anthropic
import openai
from groq import Groq

# ----------------------------
# Logging Configuration
# ----------------------------
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("CogenesisBackend")

# ----------------------------
# GravRAG: Memory Management
# ----------------------------

GRAVITATIONAL_THRESHOLD = 1e-5  # Adjustable based on system requirements

class MemoryPacket:
    def __init__(self, vector: List[float], metadata: Dict[str, Any]):
        self.vector = vector  # Semantic vector from SentenceTransformer
        self.metadata = metadata or {}

        # Default metadata if not provided
        self.metadata.setdefault("timestamp", time.time())  # Timestamp of creation
        self.metadata.setdefault("recall_count", 0)  # Number of recalls
        self.metadata.setdefault("memetic_similarity", self.calculate_memetic_similarity())  # Dynamically calculated
        self.metadata.setdefault("semantic_relativity", 1.0)  # Updated during query
        self.metadata.setdefault("gravitational_pull", self.calculate_gravitational_pull())
        self.metadata.setdefault("spacetime_coordinate", self.calculate_spacetime_coordinate())

    def calculate_gravitational_pull(self) -> float:
        vector_magnitude = math.sqrt(sum(x ** 2 for x in self.vector))
        recall_count = self.metadata["recall_count"]
        memetic_similarity = self.metadata["memetic_similarity"]
        semantic_relativity = self.metadata["semantic_relativity"]

        gravitational_pull = vector_magnitude * (1 + math.log1p(recall_count)) * memetic_similarity * semantic_relativity
        self.metadata["gravitational_pull"] = gravitational_pull
        return gravitational_pull

    def calculate_spacetime_coordinate(self) -> float:
        time_decay_factor = 1 + (time.time() - self.metadata.get("timestamp", time.time()))
        spacetime_coordinate = self.metadata["gravitational_pull"] / time_decay_factor
        self.metadata["spacetime_coordinate"] = spacetime_coordinate
        return spacetime_coordinate

    def update_relevance(self, query_vector: List[float]):
        self.metadata["semantic_relativity"] = self.calculate_cosine_similarity(self.vector, query_vector)
        self.metadata["memetic_similarity"] = self.calculate_memetic_similarity()
        self.calculate_gravitational_pull()
        self.calculate_spacetime_coordinate()

    def calculate_memetic_similarity(self) -> float:
        if "tags" not in self.metadata:
            return 1.0

        tags = set(self.metadata.get("tags", []))
        reference_tags = set(self.metadata.get("reference_tags", []))  # System-level tags

        if not tags or not reference_tags:
            return 1.0

        intersection = len(tags.intersection(reference_tags))
        union = len(tags.union(reference_tags))

        if union == 0:
            return 1.0

        return intersection / union  # Jaccard similarity

    @staticmethod
    def calculate_cosine_similarity(vector_a: List[float], vector_b: List[float]) -> float:
        dot_product = sum(a * b for a, b in zip(vector_a, vector_b))
        magnitude_a = math.sqrt(sum(a ** 2 for a in vector_a))
        magnitude_b = math.sqrt(sum(b ** 2 for b in vector_b))

        if magnitude_a == 0 or magnitude_b == 0:
            return 0.0

        return dot_product / (magnitude_a * magnitude_b)

    def to_payload(self) -> Dict[str, Any]:
        return {
            "vector": self.vector,
            "metadata": self.metadata
        }

    @staticmethod
    def from_payload(payload: Dict[str, Any]):
        return MemoryPacket(payload["vector"], payload["metadata"])

class MemoryManager:
    def __init__(self, qdrant_host="localhost", qdrant_port=6333, collection_name="Mind"):
        self.qdrant_client = QdrantClient(host=qdrant_host, port=qdrant_port)
        self.collection_name = collection_name
        self.model = SentenceTransformer('all-MiniLM-L6-v2')  # Semantic vector model
        self._setup_collection()

    def _setup_collection(self):
        try:
            self.qdrant_client.get_collection(self.collection_name)
            logger.info(f"Collection '{self.collection_name}' exists.")
        except Exception:
            logger.info(f"Creating collection '{self.collection_name}'.")
            self.qdrant_client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=self.model.get_sentence_embedding_dimension(), distance=Distance.COSINE)
            )

    async def create_memory(self, content: str, metadata: Dict[str, Any]):
        vector = self.model.encode(content).tolist()
        memory_packet = MemoryPacket(vector=vector, metadata=metadata)
        point_id = str(uuid.uuid4())
        
        self.qdrant_client.upsert(
            collection_name=self.collection_name,
            points=[PointStruct(id=point_id, vector=vector, payload=memory_packet.to_payload())]
        )
        logger.info(f"Memory created successfully with ID: {point_id}")

    async def recall_memory(self, query_content: str, top_k: int = 5):
        query_vector = self.model.encode(query_content).tolist()

        results = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=top_k
        )

        memories = [MemoryPacket.from_payload(hit.payload) for hit in results]

        for memory in memories:
            memory.update_relevance(query_vector)
            # Optionally, update the memory in Qdrant if relevance metrics are stored
            self.qdrant_client.upsert(
                collection_name=self.collection_name,
                points=[PointStruct(id=memory.metadata.get("id", str(uuid.uuid4())), vector=memory.vector, payload=memory.to_payload())]
            )

        return [memory.metadata for memory in memories]

    async def prune_memories(self):
        total_points = self.qdrant_client.count(self.collection_name).count
        if total_points > 1000000:  # Arbitrary limit
            points = self.qdrant_client.scroll(self.collection_name, limit=1000)
            low_relevance_points = [
                p.id for p in points if p.payload['metadata']['gravitational_pull'] < GRAVITATIONAL_THRESHOLD
            ]
            if low_relevance_points:
                self.qdrant_client.delete(
                    collection_name=self.collection_name,
                    points_selector={"points": low_relevance_points}
                )
                logger.info(f"Pruned {len(low_relevance_points)} low-relevance memories.")

# ----------------------------
# Neural Resources: LLM Management
# ----------------------------

class AIAsset:
    def __init__(self, api_key: str):
        self.api_key = api_key

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        raise NotImplementedError

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        raise NotImplementedError

class AnthropicLLM(AIAsset):
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.client = Anthropic(api_key=api_key)
        logger.info("Anthropic LLM initialized")

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for Anthropic model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to Anthropic LLM")
            return {"error": "Empty message provided"}
        try:
            response = self.client.messages.create(
                model=model,
                messages=[{"role": role, "content": message}],
            )
            logger.info(f"Successfully created message with Anthropic model: {model}")
            return response.model_dump()
        except Exception as e:
            logger.exception(f"Error creating message for Anthropic: {str(e)}")
            return {"error": f"Anthropic failed: {str(e)}"}

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        return response.get('usage', {}).get('output_tokens', 0)

class OpenAILLM(AIAsset):
    def __init__(self, api_key: str):
        super().__init__(api_key)
        openai.api_key = api_key
        logger.info("OpenAI LLM initialized")

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for OpenAI model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to OpenAI LLM")
            return {"error": "Empty message provided"}
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=[{"role": role, "content": message}],
            )
            logger.info(f"Successfully created message with OpenAI model: {model}")
            return response.to_dict()
        except Exception as e:
            logger.exception(f"Error creating message for OpenAI: {str(e)}")
            return {"error": f"OpenAI failed: {str(e)}"}

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        return response.get('usage', {}).get('completion_tokens', 0)

class GroqLLM(AIAsset):
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.client = Groq(api_key=api_key)
        logger.info("Groq LLM initialized")

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for Groq model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to Groq LLM")
            return {"error": "Empty message provided"}
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[{"role": role, "content": message}],
            )
            logger.info(f"Successfully created message with Groq model: {model}")
            return response.to_dict()
        except Exception as e:
            logger.exception(f"Error creating message for Groq: {str(e)}")
            return {"error": f"Groq failed: {str(e)}"}

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        return response.get('usage', {}).get('completion_tokens', 0)

class OllamaLLM(AIAsset):
    def __init__(self, base_url: str = "http://localhost:11434"):
        super().__init__(api_key="")
        self.base_url = base_url
        logger.info(f"Ollama LLM initialized with base URL: {base_url}")

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for Ollama model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to Ollama LLM")
            return {"error": "Empty message provided"}
        try:
            url = f"{self.base_url}/api/generate"
            payload = {
                "model": model,
                "role": role,
                "prompt": message,
                "stream": False
            }
            response = requests.post(url, json=payload, timeout=30)
            response.raise_for_status()
            logger.info(f"Successfully created message with Ollama model: {model}")
            return response.json()
        except requests.RequestException as e:
            logger.exception(f"Error creating message for Ollama: {str(e)}")
            return {"error": f"Ollama failed: {str(e)}"}

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        return len(response.get('response', '').split())

class LLMManager:
    def __init__(self):
        self.llm_models: Dict[str, AIAsset] = {}
        self.overridden_keys: Dict[str, str] = {}
        self.models_cache = {}  # Cache to store fetched model info
        self._initialize_models()
        logger.info("LLMManager initialized")

    def _initialize_models(self):
        logger.debug("Initializing AI models")
        for provider, api_key in self._load_api_keys().items():
            if api_key:
                llm_instance = self._create_llm_instance(provider, api_key)
                if llm_instance:
                    self.llm_models[provider] = llm_instance
        self.llm_models["ollama"] = OllamaLLM()
        logger.info(f"Initialized models: {', '.join(self.llm_models.keys())}")

    def _load_api_keys(self) -> Dict[str, str]:
        logger.debug("Loading API keys")
        keys = {
            "anthropic": self.overridden_keys.get('anthropic', os.getenv('ANTHROPIC_API_KEY', '')),
            "openai": self.overridden_keys.get('openai', os.getenv('OPENAI_API_KEY', '')),
            "groq": self.overridden_keys.get('groq', os.getenv('GROQ_API_KEY', '')),
        }
        for provider, key in keys.items():
            if key:
                logger.info(f"API key loaded for {provider}")
            else:
                logger.warning(f"No API key found for {provider}")
        return keys

    def _create_llm_instance(self, provider: str, api_key: str) -> Optional[AIAsset]:
        logger.debug(f"Creating LLM instance for provider: {provider}")
        if provider == "anthropic":
            return AnthropicLLM(api_key)
        elif provider == "openai":
            return OpenAILLM(api_key)
        elif provider == "groq":
            return GroqLLM(api_key)
        else:
            logger.warning(f"Unknown provider: {provider}")
            return None

    def set_api_key(self, provider: str, api_key: str):
        logger.info(f"Setting API key for provider: {provider}")
        if not provider or not api_key:
            logger.error("Invalid provider or API key provided")
            raise ValueError("Both provider and api_key must be non-empty strings")
        self.overridden_keys[provider] = api_key
        self._initialize_models()

    def get_available_models(self) -> List[str]:
        models = []

        # Fetch Ollama models
        try:
            logger.info("Fetching Ollama models")
            ollama_response = requests.get("http://localhost:11434/api/tags")
            if ollama_response.status_code == 200:
                ollama_data = ollama_response.json()
                ollama_models = [model['name'] for model in ollama_data.get('models', [])]
                models.extend(ollama_models)
            else:
                logger.error(f"Failed to fetch Ollama models: {ollama_response.status_code}")
        except Exception as e:
            logger.error(f"Error fetching Ollama models: {str(e)}")

        # Fetch Groq models
        try:
            logger.info("Fetching Groq models")
            groq_api_key = os.getenv("GROQ_API_KEY")
            groq_response = requests.get(
                "https://api.groq.com/openai/v1/models",
                headers={
                    "Authorization": f"Bearer {groq_api_key}",
                    "Content-Type": "application/json"
                }
            )
            if groq_response.status_code == 200:
                groq_models_data = groq_response.json()
                groq_models = groq_models_data.get("data", [])
                models.extend([model['id'] for model in groq_models])
            else:
                logger.error(f"Failed to fetch Groq models: {groq_response.status_code}")
        except Exception as e:
            logger.error(f"Error fetching Groq models: {str(e)}")

        logger.debug(f"Available models: {', '.join(models)}")
        return models

    def route_query(self, message: str, role: str, model: Optional[str] = None) -> Dict[str, Any]:
        logger.info(f"Routing query to {'specified model: ' + model if model else 'default model'}")
        if not message.strip():
            logger.warning("Empty message provided to route_query")
            return {"error": "Empty message provided"}
        
        if model:
            for provider, llm in self.llm_models.items():
                try:
                    logger.debug(f"Attempting to create message with provider: {provider}, model: {model}")
                    response = llm.create_message(model, role, message)
                    if "error" not in response:
                        logger.info(f"Successfully created message with provider: {provider}, model: {model}")
                        return response
                    logger.warning(f"Error with {provider}, model {model}: {response['error']}")
                except Exception as e:
                    logger.exception(f"Unexpected error with {provider}, model {model}: {str(e)}")
            
            logger.error(f"Specified model {model} is not available or failed for all providers")
            return {"error": f"Specified model {model} is not available or failed for all providers"}
        
        for provider, llm in self.llm_models.items():
            try:
                logger.debug(f"Attempting to create message with provider: {provider}")
                response = llm.create_message(provider, role, message)
                if "error" not in response:
                    logger.info(f"Successfully created message with provider: {provider}")
                    return response
                logger.warning(f"Error with {provider}: {response['error']}")
            except Exception as e:
                logger.exception(f"Unexpected error with {provider}: {str(e)}")
        
        logger.error("No available models could process the request")
        return {"error": "No available models could process the request"}

    def get_model_info(self, model: str) -> Dict[str, Any]:
        logger.info(f"Retrieving model info for model: {model}")
        
        # Check if the model info is cached
        if model in self.models_cache:
            logger.debug(f"Model info for {model} retrieved from cache.")
            return self.models_cache[model]

        try:
            # Fetch from Ollama
            available_models = self.get_available_models()
            if model in available_models:
                logger.info(f"Fetching model info from Ollama for model: {model}")
                url = f"{self.llm_models['ollama'].base_url}/api/models/{model}"
                ollama_response = requests.get(url)
                if ollama_response.status_code == 200:
                    model_info = ollama_response.json()
                    self.models_cache[model] = model_info
                    logger.debug(f"Fetched Ollama model info: {model_info}")
                    return model_info
                else:
                    logger.error(f"Failed to fetch Ollama model info: {ollama_response.status_code}, Response: {ollama_response.text}")
            
            # Fetch from Groq
            groq_api_key = os.getenv("GROQ_API_KEY")
            if groq_api_key:
                logger.info(f"Fetching model info from Groq for model: {model}")
                url = f"https://api.groq.com/openai/v1/models/{model}"
                groq_response = requests.get(
                    url,
                    headers={
                        "Authorization": f"Bearer {groq_api_key}",
                        "Content-Type": "application/json"
                    }
                )
                if groq_response.status_code == 200:
                    model_info = groq_response.json()
                    self.models_cache[model] = model_info
                    logger.debug(f"Fetched Groq model info: {model_info}")
                    return model_info
                else:
                    logger.error(f"Failed to fetch Groq model info: {groq_response.status_code}, Response: {groq_response.text}")
        except Exception as e:
            logger.error(f"Error fetching model info for {model}: {str(e)}")
            return {"error": f"Model {model} not found or failed to retrieve info."}
        
        logger.error(f"Model {model} not found in any provider.")
        return {"error": f"Model {model} not found in any provider."}

# Initialize LLMManager
llm_manager = LLMManager()

# ----------------------------
# FastAPI Backend Setup
# ----------------------------

app = FastAPI(
    title="Cogenesis Backend API",
    description="API for managing GravRAG (Memory Management) and Neural Resources (LLM Management).",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# ----------------------------
# API Routers
# ----------------------------

# ----------------------------
# Neural Resources API Router
# ----------------------------
neural_resources_router = APIRouter(prefix="/neural_resources", tags=["Neural Resources API"])

class Message(BaseModel):
    content: str
    role: str  # 'user' or 'system'

class APIKeyUpdate(BaseModel):
    provider: str
    api_key: str

@neural_resources_router.post("/route_query")
async def route_query(message: Message):
    response = llm_manager.route_query(message.content, message.role)
    if "error" in response:
        raise HTTPException(status_code=500, detail=response["error"])
    return response

@neural_resources_router.post("/set_api_key")
async def set_api_key(api_key_update: APIKeyUpdate):
    try:
        llm_manager.set_api_key(api_key_update.provider, api_key_update.api_key)
        return {"message": f"API key updated for {api_key_update.provider}"}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

@neural_resources_router.get("/available_models")
async def get_available_models():
    models = llm_manager.get_available_models()
    return {"available_models": models}

@neural_resources_router.post("/create_message/{provider}/{model}")
async def create_message(provider: str, model: str, message: Message):
    if provider not in llm_manager.llm_models:
        raise HTTPException(status_code=404, detail=f"Provider {provider} not found")
    try:
        response = llm_manager.llm_models[provider].create_message(model, message.role, message.content)
        if "error" in response:
            raise HTTPException(status_code=500, detail=response["error"])
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@neural_resources_router.get("/model_info/{model}")
async def get_model_info(model: str):
    model_info = llm_manager.get_model_info(model)
    if "error" in model_info:
        raise HTTPException(status_code=404, detail=model_info["error"])
    return model_info

@neural_resources_router.get("/health")
async def neural_health_check():
    return {"status": "Neural Resources API is healthy"}

# ----------------------------
# GravRAG API Router
# ----------------------------
gravrag_router = APIRouter(prefix="/gravrag", tags=["GravRAG API"])

class MemoryRequest(BaseModel):
    content: str
    metadata: Optional[Dict[str, Any]] = None

class RecallRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5

class PruneRequest(BaseModel):
    gravity_threshold: Optional[float] = 1e-5

memory_manager = MemoryManager()

@gravrag_router.post("/create_memory")
async def create_memory(memory_request: MemoryRequest):
    if not memory_request.content.strip():
        logger.warning("Memory creation failed: Empty content.")
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
    metadata = memory_request.metadata or {}
    try:
        logger.info(f"Creating memory: '{memory_request.content}' with metadata: {metadata}")
        await memory_manager.create_memory(content=memory_request.content, metadata=metadata)
        return {"message": "Memory created successfully"}
    except Exception as e:
        logger.error(f"Error during memory creation: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error creating memory: {str(e)}")

@gravrag_router.post("/recall_memory")
async def recall_memory(recall_request: RecallRequest):
    if not recall_request.query.strip():
        logger.warning("Memory recall failed: Empty query.")
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    try:
        logger.info(f"Recalling memories for query: '{recall_request.query}' with top_k={recall_request.top_k}")
        memories = await memory_manager.recall_memory(query_content=recall_request.query, top_k=recall_request.top_k)
        if not memories:
            return {"message": "No relevant memories found"}
        return {"memories": memories}
    except Exception as e:
        logger.error(f"Error during memory recall: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error recalling memories: {str(e)}")

@gravrag_router.post("/prune_memories")
async def prune_memories(prune_request: PruneRequest):
    try:
        global GRAVITATIONAL_THRESHOLD
        if prune_request.gravity_threshold:
            GRAVITATIONAL_THRESHOLD = prune_request.gravity_threshold
        await memory_manager.prune_memories()
        return {"message": "Memory pruning completed successfully"}
    except Exception as e:
        logger.error(f"Error during memory pruning: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error pruning memories: {str(e)}")

@gravrag_router.get("/health")
async def gravrag_health_check():
    return {"status": "GravRAG API is healthy"}

# ----------------------------
# API Info Endpoint
# ----------------------------
@app.get("/api_info")
async def get_api_info():
    """
    This endpoint provides an overview of the API, including payload structures
    for the different modules (Neural Resources and GravRAG).
    """
    return {
        "Neural Resources API": {
            "Endpoints": [
                {
                    "endpoint": "/neural_resources/route_query",
                    "method": "POST",
                    "payload": {
                        "content": "Your message here",
                        "role": "user or system"
                    },
                    "response": {
                        "response": "Model output"
                    }
                },
                {
                    "endpoint": "/neural_resources/set_api_key",
                    "method": "POST",
                    "payload": {
                        "provider": "provider_name",
                        "api_key": "new_api_key"
                    },
                    "response": {
                        "message": "API key updated"
                    }
                },
                {
                    "endpoint": "/neural_resources/available_models",
                    "method": "GET",
                    "response": {
                        "available_models": ["model1", "model2", "model3"]
                    }
                },
                {
                    "endpoint": "/neural_resources/model_info/{model}",
                    "method": "GET",
                    "response": {
                        "model": "model_name",
                        "type": "model_type",
                        "capabilities": ["capability1", "capability2"],
                        "max_tokens": 1000,
                        "context_window": 4096,
                        "description": "Model description"
                    }
                },
                {
                    "endpoint": "/neural_resources/create_message/{provider}/{model}",
                    "method": "POST",
                    "payload": {
                        "content": "Your message here",
                        "role": "user or system"
                    },
                    "response": {
                        "response": "Model output"
                    }
                },
                {
                    "endpoint": "/neural_resources/health",
                    "method": "GET",
                    "response": {
                        "status": "Neural Resources API is healthy"
                    }
                }
            ]
        },
        "GravRAG API": {
            "Endpoints": [
                {
                    "endpoint": "/gravrag/create_memory",
                    "method": "POST",
                    "payload": {
                        "content": "This is a sample memory",
                        "metadata": {
                            "objective_id": "obj_1",
                            "task_id": "task_1",
                            "tags": ["AI", "machine learning"],
                            "reference_tags": ["AI", "data science"]
                        }
                    },
                    "response": {
                        "message": "Memory created successfully"
                    }
                },
                {
                    "endpoint": "/gravrag/recall_memory",
                    "method": "POST",
                    "payload": {
                        "query": "Your query here",
                        "top_k": 5
                    },
                    "response": {
                        "memories": [
                            {
                                "vector": [0.1, 0.2, ...],
                                "metadata": {
                                    "timestamp": 1701234567.89,
                                    "recall_count": 3,
                                    "memetic_similarity": 0.85,
                                    "semantic_relativity": 0.9,
                                    "gravitational_pull": 0.123,
                                    "spacetime_coordinate": 0.00123,
                                    "objective_id": "obj_1",
                                    "task_id": "task_1",
                                    "tags": ["AI", "machine learning"],
                                    "reference_tags": ["AI", "data science"]
                                }
                            },
                            ...
                        ]
                    }
                },
                {
                    "endpoint": "/gravrag/prune_memories",
                    "method": "POST",
                    "payload": {
                        "gravity_threshold": 1e-5  # Optional, defaults to 1e-5
                    },
                    "response": {
                        "message": "Memory pruning completed successfully"
                    }
                },
                {
                    "endpoint": "/gravrag/health",
                    "method": "GET",
                    "response": {
                        "status": "GravRAG API is healthy"
                    }
                }
            ]
        }
    }

# ----------------------------
# Include Routers
# ----------------------------
app.include_router(neural_resources_router)
app.include_router(gravrag_router)

# ----------------------------
# Run the Application
# ----------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOF
    echo "main.py created."
}

# Function to create memory_manager.py
create_memory_manager_py() {
    echo "Creating memory_manager.py..."
    cat << 'EOF' > cogenesis_backend/memory_manager.py
import time
import math
import uuid
import logging
from typing import List, Dict, Any, Optional
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sklearn.metrics.pairwise import cosine_similarity

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Gravitational constants and thresholds
GRAVITATIONAL_THRESHOLD = 1e-5  # Adjustable based on system requirements

class MemoryPacket:
    def __init__(self, vector: List[float], metadata: Dict[str, Any]):
        self.vector = vector  # Semantic vector from SentenceTransformer
        self.metadata = metadata or {}

        # Default metadata if not provided
        self.metadata.setdefault("timestamp", time.time())  # Timestamp of creation
        self.metadata.setdefault("recall_count", 0)  # Number of recalls
        self.metadata.setdefault("memetic_similarity", self.calculate_memetic_similarity())  # Dynamically calculated
        self.metadata.setdefault("semantic_relativity", 1.0)  # Updated during query
        self.metadata.setdefault("gravitational_pull", self.calculate_gravitational_pull())
        self.metadata.setdefault("spacetime_coordinate", self.calculate_spacetime_coordinate())

    def calculate_gravitational_pull(self) -> float:
        vector_magnitude = math.sqrt(sum(x ** 2 for x in self.vector))
        recall_count = self.metadata["recall_count"]
        memetic_similarity = self.metadata["memetic_similarity"]
        semantic_relativity = self.metadata["semantic_relativity"]

        gravitational_pull = vector_magnitude * (1 + math.log1p(recall_count)) * memetic_similarity * semantic_relativity
        self.metadata["gravitational_pull"] = gravitational_pull
        return gravitational_pull

    def calculate_spacetime_coordinate(self) -> float:
        time_decay_factor = 1 + (time.time() - self.metadata.get("timestamp", time.time()))
        spacetime_coordinate = self.metadata["gravitational_pull"] / time_decay_factor
        self.metadata["spacetime_coordinate"] = spacetime_coordinate
        return spacetime_coordinate

    def update_relevance(self, query_vector: List[float]):
        self.metadata["semantic_relativity"] = self.calculate_cosine_similarity(self.vector, query_vector)
        self.metadata["memetic_similarity"] = self.calculate_memetic_similarity()
        self.calculate_gravitational_pull()
        self.calculate_spacetime_coordinate()

    def calculate_memetic_similarity(self) -> float:
        if "tags" not in self.metadata:
            return 1.0

        tags = set(self.metadata.get("tags", []))
        reference_tags = set(self.metadata.get("reference_tags", []))  # System-level tags

        if not tags or not reference_tags:
            return 1.0

        intersection = len(tags.intersection(reference_tags))
        union = len(tags.union(reference_tags))

        if union == 0:
            return 1.0

        return intersection / union  # Jaccard similarity

    @staticmethod
    def calculate_cosine_similarity(vector_a: List[float], vector_b: List[float]) -> float:
        dot_product = sum(a * b for a, b in zip(vector_a, vector_b))
        magnitude_a = math.sqrt(sum(a ** 2 for a in vector_a))
        magnitude_b = math.sqrt(sum(b ** 2 for b in vector_b))

        if magnitude_a == 0 or magnitude_b == 0:
            return 0.0

        return dot_product / (magnitude_a * magnitude_b)

    def to_payload(self) -> Dict[str, Any]:
        return {
            "vector": self.vector,
            "metadata": self.metadata
        }

    @staticmethod
    def from_payload(payload: Dict[str, Any]):
        return MemoryPacket(payload["vector"], payload["metadata"])

class MemoryManager:
    def __init__(self, qdrant_host="localhost", qdrant_port=6333, collection_name="Mind"):
        self.qdrant_client = QdrantClient(host=qdrant_host, port=qdrant_port)
        self.collection_name = collection_name
        self.model = SentenceTransformer('all-MiniLM-L6-v2')  # Semantic vector model
        self._setup_collection()

    def _setup_collection(self):
        try:
            self.qdrant_client.get_collection(self.collection_name)
            logger.info(f"Collection '{self.collection_name}' exists.")
        except Exception:
            logger.info(f"Creating collection '{self.collection_name}'.")
            self.qdrant_client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=self.model.get_sentence_embedding_dimension(), distance=Distance.COSINE)
            )

    async def create_memory(self, content: str, metadata: Dict[str, Any]):
        vector = self.model.encode(content).tolist()
        memory_packet = MemoryPacket(vector=vector, metadata=metadata)
        point_id = str(uuid.uuid4())
        
        self.qdrant_client.upsert(
            collection_name=self.collection_name,
            points=[PointStruct(id=point_id, vector=vector, payload=memory_packet.to_payload())]
        )
        logger.info(f"Memory created successfully with ID: {point_id}")

    async def recall_memory(self, query_content: str, top_k: int = 5):
        query_vector = self.model.encode(query_content).tolist()

        results = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=top_k
        )

        memories = [MemoryPacket.from_payload(hit.payload) for hit in results]

        for memory in memories:
            memory.update_relevance(query_vector)
            # Optionally, update the memory in Qdrant if relevance metrics are stored
            self.qdrant_client.upsert(
                collection_name=self.collection_name,
                points=[PointStruct(id=memory.metadata.get("id", str(uuid.uuid4())), vector=memory.vector, payload=memory.to_payload())]
            )

        return [memory.metadata for memory in memories]

    async def prune_memories(self):
        total_points = self.qdrant_client.count(self.collection_name).count
        if total_points > 1000000:  # Arbitrary limit
            points = self.qdrant_client.scroll(self.collection_name, limit=1000)
            low_relevance_points = [
                p.id for p in points if p.payload['metadata']['gravitational_pull'] < GRAVITATIONAL_THRESHOLD
            ]
            if low_relevance_points:
                self.qdrant_client.delete(
                    collection_name=self.collection_name,
                    points_selector={"points": low_relevance_points}
                )
                logger.info(f"Pruned {len(low_relevance_points)} low-relevance memories.")
EOF
    echo "memory_manager.py created."
}

# Function to create llm_manager.py
create_llm_manager_py() {
    echo "Creating llm_manager.py..."
    cat << 'EOF' > cogenesis_backend/llm_manager.py
import os
import logging
from typing import List, Dict, Any, Optional
from anthropic import Anthropic
import openai
from groq import Groq
import requests

# Set up logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AIAsset:
    def __init__(self, api_key: str):
        self.api_key = api_key

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        raise NotImplementedError

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        raise NotImplementedError

class AnthropicLLM(AIAsset):
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.client = Anthropic(api_key=api_key)
        logger.info("Anthropic LLM initialized")

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for Anthropic model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to Anthropic LLM")
            return {"error": "Empty message provided"}
        try:
            response = self.client.messages.create(
                model=model,
                messages=[{"role": role, "content": message}],
            )
            logger.info(f"Successfully created message with Anthropic model: {model}")
            return response.model_dump()
        except Exception as e:
            logger.exception(f"Error creating message for Anthropic: {str(e)}")
            return {"error": f"Anthropic failed: {str(e)}"}

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        return response.get('usage', {}).get('output_tokens', 0)

class OpenAILLM(AIAsset):
    def __init__(self, api_key: str):
        super().__init__(api_key)
        openai.api_key = api_key
        logger.info("OpenAI LLM initialized")

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for OpenAI model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to OpenAI LLM")
            return {"error": "Empty message provided"}
        try:
            response = openai.ChatCompletion.create(
                model=model,
                messages=[{"role": role, "content": message}],
            )
            logger.info(f"Successfully created message with OpenAI model: {model}")
            return response.to_dict()
        except Exception as e:
            logger.exception(f"Error creating message for OpenAI: {str(e)}")
            return {"error": f"OpenAI failed: {str(e)}"}

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        return response.get('usage', {}).get('completion_tokens', 0)

class GroqLLM(AIAsset):
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.client = Groq(api_key=api_key)
        logger.info("Groq LLM initialized")

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for Groq model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to Groq LLM")
            return {"error": "Empty message provided"}
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[{"role": role, "content": message}],
            )
            logger.info(f"Successfully created message with Groq model: {model}")
            return response.to_dict()
        except Exception as e:
            logger.exception(f"Error creating message for Groq: {str(e)}")
            return {"error": f"Groq failed: {str(e)}"}

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        return response.get('usage', {}).get('completion_tokens', 0)

class OllamaLLM(AIAsset):
    def __init__(self, base_url: str = "http://localhost:11434"):
        super().__init__(api_key="")
        self.base_url = base_url
        logger.info(f"Ollama LLM initialized with base URL: {base_url}")

    def create_message(self, model: str, role: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for Ollama model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to Ollama LLM")
            return {"error": "Empty message provided"}
        try:
            url = f"{self.base_url}/api/generate"
            payload = {
                "model": model,
                "role": role,
                "prompt": message,
                "stream": False
            }
            response = requests.post(url, json=payload, timeout=30)
            response.raise_for_status()
            logger.info(f"Successfully created message with Ollama model: {model}")
            return response.json()
        except requests.RequestException as e:
            logger.exception(f"Error creating message for Ollama: {str(e)}")
            return {"error": f"Ollama failed: {str(e)}"}

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        return len(response.get('response', '').split())

class LLMManager:
    def __init__(self):
        self.llm_models: Dict[str, AIAsset] = {}
        self.overridden_keys: Dict[str, str] = {}
        self.models_cache = {}  # Cache to store fetched model info
        self._initialize_models()
        logger.info("LLMManager initialized")

    def _initialize_models(self):
        logger.debug("Initializing AI models")
        for provider, api_key in self._load_api_keys().items():
            if api_key:
                llm_instance = self._create_llm_instance(provider, api_key)
                if llm_instance:
                    self.llm_models[provider] = llm_instance
        self.llm_models["ollama"] = OllamaLLM()
        logger.info(f"Initialized models: {', '.join(self.llm_models.keys())}")

    def _load_api_keys(self) -> Dict[str, str]:
        logger.debug("Loading API keys")
        keys = {
            "anthropic": self.overridden_keys.get('anthropic', os.getenv('ANTHROPIC_API_KEY', '')),
            "openai": self.overridden_keys.get('openai', os.getenv('OPENAI_API_KEY', '')),
            "groq": self.overridden_keys.get('groq', os.getenv('GROQ_API_KEY', '')),
        }
        for provider, key in keys.items():
            if key:
                logger.info(f"API key loaded for {provider}")
            else:
                logger.warning(f"No API key found for {provider}")
        return keys

    def _create_llm_instance(self, provider: str, api_key: str) -> Optional[AIAsset]:
        logger.debug(f"Creating LLM instance for provider: {provider}")
        if provider == "anthropic":
            return AnthropicLLM(api_key)
        elif provider == "openai":
            return OpenAILLM(api_key)
        elif provider == "groq":
            return GroqLLM(api_key)
        else:
            logger.warning(f"Unknown provider: {provider}")
            return None

    def set_api_key(self, provider: str, api_key: str):
        logger.info(f"Setting API key for provider: {provider}")
        if not provider or not api_key:
            logger.error("Invalid provider or API key provided")
            raise ValueError("Both provider and api_key must be non-empty strings")
        self.overridden_keys[provider] = api_key
        self._initialize_models()

    def get_available_models(self) -> List[str]:
        models = []

        # Fetch Ollama models
        try:
            logger.info("Fetching Ollama models")
            ollama_response = requests.get("http://localhost:11434/api/tags")
            if ollama_response.status_code == 200:
                ollama_data = ollama_response.json()
                ollama_models = [model['name'] for model in ollama_data.get('models', [])]
                models.extend(ollama_models)
            else:
                logger.error(f"Failed to fetch Ollama models: {ollama_response.status_code}")
        except Exception as e:
            logger.error(f"Error fetching Ollama models: {str(e)}")

        # Fetch Groq models
        try:
            logger.info("Fetching Groq models")
            groq_api_key = os.getenv("GROQ_API_KEY")
            groq_response = requests.get(
                "https://api.groq.com/openai/v1/models",
                headers={
                    "Authorization": f"Bearer {groq_api_key}",
                    "Content-Type": "application/json"
                }
            )
            if groq_response.status_code == 200:
                groq_models_data = groq_response.json()
                groq_models = groq_models_data.get("data", [])
                models.extend([model['id'] for model in groq_models])
            else:
                logger.error(f"Failed to fetch Groq models: {groq_response.status_code}")
        except Exception as e:
            logger.error(f"Error fetching Groq models: {str(e)}")

        logger.debug(f"Available models: {', '.join(models)}")
        return models

    def route_query(self, message: str, role: str, model: Optional[str] = None) -> Dict[str, Any]:
        logger.info(f"Routing query to {'specified model: ' + model if model else 'default model'}")
        if not message.strip():
            logger.warning("Empty message provided to route_query")
            return {"error": "Empty message provided"}
        
        if model:
            for provider, llm in self.llm_models.items():
                try:
                    logger.debug(f"Attempting to create message with provider: {provider}, model: {model}")
                    response = llm.create_message(model, role, message)
                    if "error" not in response:
                        logger.info(f"Successfully created message with provider: {provider}, model: {model}")
                        return response
                    logger.warning(f"Error with {provider}, model {model}: {response['error']}")
                except Exception as e:
                    logger.exception(f"Unexpected error with {provider}, model {model}: {str(e)}")
            
            logger.error(f"Specified model {model} is not available or failed for all providers")
            return {"error": f"Specified model {model} is not available or failed for all providers"}
        
        for provider, llm in self.llm_models.items():
            try:
                logger.debug(f"Attempting to create message with provider: {provider}")
                response = llm.create_message(provider, role, message)
                if "error" not in response:
                    logger.info(f"Successfully created message with provider: {provider}")
                    return response
                logger.warning(f"Error with {provider}: {response['error']}")
            except Exception as e:
                logger.exception(f"Unexpected error with {provider}: {str(e)}")
        
        logger.error("No available models could process the request")
        return {"error": "No available models could process the request"}

    def get_model_info(self, model: str) -> Dict[str, Any]:
        logger.info(f"Retrieving model info for model: {model}")
        
        # Check if the model info is cached
        if model in self.models_cache:
            logger.debug(f"Model info for {model} retrieved from cache.")
            return self.models_cache[model]

        try:
            # Fetch from Ollama
            available_models = self.get_available_models()
            if model in available_models:
                logger.info(f"Fetching model info from Ollama for model: {model}")
                url = f"{self.llm_models['ollama'].base_url}/api/models/{model}"
                ollama_response = requests.get(url)
                if ollama_response.status_code == 200:
                    model_info = ollama_response.json()
                    self.models_cache[model] = model_info
                    logger.debug(f"Fetched Ollama model info: {model_info}")
                    return model_info
                else:
                    logger.error(f"Failed to fetch Ollama model info: {ollama_response.status_code}, Response: {ollama_response.text}")
            
            # Fetch from Groq
            groq_api_key = os.getenv("GROQ_API_KEY")
            if groq_api_key:
                logger.info(f"Fetching model info from Groq for model: {model}")
                url = f"https://api.groq.com/openai/v1/models/{model}"
                groq_response = requests.get(
                    url,
                    headers={
                        "Authorization": f"Bearer {groq_api_key}",
                        "Content-Type": "application/json"
                    }
                )
                if groq_response.status_code == 200:
                    model_info = groq_response.json()
                    self.models_cache[model] = model_info
                    logger.debug(f"Fetched Groq model info: {model_info}")
                    return model_info
                else:
                    logger.error(f"Failed to fetch Groq model info: {groq_response.status_code}, Response: {groq_response.text}")
        except Exception as e:
            logger.error(f"Error fetching model info for {model}: {str(e)}")
            return {"error": f"Model {model} not found or failed to retrieve info."}
        
        logger.error(f"Model {model} not found in any provider.")
        return {"error": f"Model {model} not found in any provider."}
EOF
    echo "llm_manager.py created."
}

# Function to create api/neural_resources_api.py
create_neural_resources_api_py() {
    echo "Creating api/neural_resources_api.py..."
    cat << 'EOF' > cogenesis_backend/api/neural_resources_api.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional
from llm_manager import LLMManager

neural_resources_router = APIRouter(prefix="/neural_resources", tags=["Neural Resources API"])

class Message(BaseModel):
    content: str
    role: str  # 'user' or 'system'

class APIKeyUpdate(BaseModel):
    provider: str
    api_key: str

@neural_resources_router.post("/route_query")
async def route_query(message: Message, manager: LLMManager = Depends(lambda: manager_instance)):
    response = manager.route_query(message.content, message.role)
    if "error" in response:
        raise HTTPException(status_code=500, detail=response["error"])
    return response

@neural_resources_router.post("/set_api_key")
async def set_api_key(api_key_update: APIKeyUpdate, manager: LLMManager = Depends(lambda: manager_instance)):
    try:
        manager.set_api_key(api_key_update.provider, api_key_update.api_key)
        return {"message": f"API key updated for {api_key_update.provider}"}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

@neural_resources_router.get("/available_models")
async def get_available_models(manager: LLMManager = Depends(lambda: manager_instance)):
    models = manager.get_available_models()
    return {"available_models": models}

@neural_resources_router.post("/create_message/{provider}/{model}")
async def create_message(provider: str, model: str, message: Message, manager: LLMManager = Depends(lambda: manager_instance)):
    if provider not in manager.llm_models:
        raise HTTPException(status_code=404, detail=f"Provider {provider} not found")
    try:
        response = manager.llm_models[provider].create_message(model, message.role, message.content)
        if "error" in response:
            raise HTTPException(status_code=500, detail=response["error"])
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@neural_resources_router.get("/model_info/{model}")
async def get_model_info(model: str, manager: LLMManager = Depends(lambda: manager_instance)):
    model_info = manager.get_model_info(model)
    if "error" in model_info:
        raise HTTPException(status_code=404, detail=model_info["error"])
    return model_info

@neural_resources_router.get("/health")
async def neural_health_check():
    return {"status": "Neural Resources API is healthy"}

# Dependency Injection
manager_instance = LLMManager()
EOF
    echo "api/neural_resources_api.py created."
}

# Function to create api/gravrag_API.py
create_gravrag_api_py() {
    echo "Creating api/gravrag_API.py..."
    cat << 'EOF' > cogenesis_backend/api/gravrag_API.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging
from memory_manager import MemoryManager

gravrag_router = APIRouter(prefix="/gravrag", tags=["GravRAG API"])

class MemoryRequest(BaseModel):
    content: str
    metadata: Optional[Dict[str, Any]] = None

class RecallRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5

class PruneRequest(BaseModel):
    gravity_threshold: Optional[float] = 1e-5

memory_manager = MemoryManager()

@gravrag_router.post("/create_memory")
async def create_memory(memory_request: MemoryRequest):
    if not memory_request.content.strip():
        logging.warning("Memory creation failed: Empty content.")
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
    metadata = memory_request.metadata or {}
    try:
        logging.info(f"Creating memory: '{memory_request.content}' with metadata: {metadata}")
        await memory_manager.create_memory(content=memory_request.content, metadata=metadata)
        return {"message": "Memory created successfully"}
    except Exception as e:
        logging.error(f"Error during memory creation: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error creating memory: {str(e)}")

@gravrag_router.post("/recall_memory")
async def recall_memory(recall_request: RecallRequest):
    if not recall_request.query.strip():
        logging.warning("Memory recall failed: Empty query.")
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    try:
        logging.info(f"Recalling memories for query: '{recall_request.query}' with top_k={recall_request.top_k}")
        memories = await memory_manager.recall_memory(query_content=recall_request.query, top_k=recall_request.top_k)
        if not memories:
            return {"message": "No relevant memories found"}
        return {"memories": memories}
    except Exception as e:
        logging.error(f"Error during memory recall: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error recalling memories: {str(e)}")

@gravrag_router.post("/prune_memories")
async def prune_memories(prune_request: PruneRequest):
    try:
        global GRAVITATIONAL_THRESHOLD
        if prune_request.gravity_threshold:
            GRAVITATIONAL_THRESHOLD = prune_request.gravity_threshold
        await memory_manager.prune_memories()
        return {"message": "Memory pruning completed successfully"}
    except Exception as e:
        logging.error(f"Error during memory pruning: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error pruning memories: {str(e)}")

@gravrag_router.get("/health")
async def gravrag_health_check():
    return {"status": "GravRAG API is healthy"}
EOF
    echo "api/gravrag_API.py created."
}

# Function to create tests/test_neural_apitest.py
create_test_neural_apitest_py() {
    echo "Creating tests/test_neural_apitest.py..."
    cat << 'EOF' > cogenesis_backend/tests/test_neural_apitest.py
import requests
import json

BASE_URL = "http://localhost:8000"

def test_neural_resources():
    print("\nTesting Neural Resources API:")
   
    # Test set_api_key
    response = requests.post(
        f"{BASE_URL}/neural_resources/set_api_key",
        json={
            "provider": "groq",
            "api_key": "your_groq_api_key_here"
        }
    )
    print(f"Set API Key Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    assert response.status_code == 200, "Failed to set API key for groq"
    assert response.json().get("message") == "API key updated for groq", "API key set response mismatch"

    # Test set_api_key with empty provider
    response = requests.post(
        f"{BASE_URL}/neural_resources/set_api_key",
        json={
            "provider": "",
            "api_key": "test_key"
        }
    )
    print(f"Set API Key (Empty Provider) Status: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 400, "Setting API key with empty provider should fail"
    assert "Both provider and api_key must be non-empty strings" in response.json().get("detail", ""), "Error message mismatch for empty provider"

    # Test available_models
    response = requests.get(f"{BASE_URL}/neural_resources/available_models")
    print(f"Available Models Status: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 200, "Failed to retrieve available models"
    available_models = response.json().get("available_models", [])
    
if not available_models:
        print("No available models found. This might be due to API key issues or network problems.")
    else:
        print(f"Available models: {', '.join(available_models)}")
        assert len(available_models) > 0, "No available models found"

    # Test model_info
    if available_models:
        test_model = available_models[0]
        response = requests.get(f"{BASE_URL}/neural_resources/model_info/{test_model}")
        print(f"Model Info Status: {response.status_code}")
        print(f"Response: {response.json()}")

        assert response.status_code == 200, f"Failed to retrieve model info for {test_model}"
        model_info = response.json()
        assert "model" in model_info, "Model info response does not contain 'model' key"

    # Test route_query
    response = requests.post(
        f"{BASE_URL}/neural_resources/route_query",
        json={
            "content": "Hello, how are you?",
            "role": "user"
        }
    )
    print(f"Route Query Status: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 200, "Failed to route query"
    assert "response" in response.json(), "Route query response does not contain 'response' key"

    # Test health check
    response = requests.get(f"{BASE_URL}/neural_resources/health")
    print(f"Health Check Status: {response.status_code}")
    print(f"Response: {response.json()}")

    assert response.status_code == 200, "Health check failed"
    assert response.json().get("status") == "Neural Resources API is healthy", "Unexpected health check response"

if __name__ == "__main__":
    test_neural_resources()

```

## `tests\test_gravrag.py`

```

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture
def mock_memory_manager(mocker):
    return mocker.patch('app.services.gravrag.MemoryManager')

def test_create_memory(mock_memory_manager):
    response = client.post("/gravrag/create_memory", json={"content": "Test memory", "metadata": {"key": "value"}})
    assert response.status_code == 200
    assert response.json() == {"message": "Memory created successfully"}

def test_recall_memory(mock_memory_manager):
    mock_memory_manager.return_value.recall_memory.return_value = [{"content": "Test memory"}]
    response = client.post("/gravrag/recall_memory", json={"query": "Test query", "top_k": 5})
    assert response.status_code == 200
    assert "memories" in response.json()

def test_prune_memories(mock_memory_manager):
    response = client.post("/gravrag/prune_memories", json={"gravity_threshold": 0.5})
    assert response.status_code == 200
    assert response.json() == {"message": "Memory pruning completed successfully"}
```

## `tests\test_neural_resources.py`

```

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture
def mock_llm_manager(mocker):
    return mocker.patch('app.services.neural_resources.LLMManager')

def test_route_query(mock_llm_manager):
    mock_llm_manager.return_value.route_query.return_value = {"response": "Test response"}
    response = client.post("/neural_resources/route_query", json={"content": "Test query", "role": "user"})
    assert response.status_code == 200
    assert "response" in response.json()

def test_set_api_key(mock_llm_manager):
    response = client.post("/neural_resources/set_api_key", json={"provider": "test_provider", "api_key": "test_key"})
    assert response.status_code == 200
    assert response.json() == {"message": "API key updated for test_provider"}

def test_get_available_models(mock_llm_manager):
    mock_llm_manager.return_value.get_available_models.return_value = ["model1", "model2"]
    response = client.get("/neural_resources/available_models")
    assert response.status_code == 200
    assert "available_models" in response.json()

def test_get_model_info(mock_llm_manager):
    mock_llm_manager.return_value.get_model_info.return_value = {"model": "test_model", "info": "test_info"}
    response = client.get("/neural_resources/model_info/test_model")
    assert response.status_code == 200
    assert "model" in response.json()
```

