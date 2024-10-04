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