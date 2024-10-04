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
