import os
import json
import logging
from typing import List, Dict, Any, Optional
from anthropic import Anthropic
import openai
from groq import Groq
import requests

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Get the absolute path of the current file
current_directory = os.path.dirname(os.path.abspath(__file__))

# Create the path to neural_resources.json
json_path = os.path.join(current_directory, 'neural_resources.json')

# Load model data from JSON file
try:
    with open(json_path, 'r') as f:
        model_data = json.load(f)
    logger.info(f"Successfully loaded model data from {json_path}")
except FileNotFoundError:
    logger.error(f"neural_resources.json not found at {json_path}")
    model_data = {}
except json.JSONDecodeError:
    logger.error(f"Error decoding neural_resources.json. Please check the file format.")
    model_data = {}

class AIAsset:
    def __init__(self, api_key: str):
        self.api_key = api_key

    def create_message(self, model: str, message: str) -> Dict[str, Any]:
        raise NotImplementedError

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        raise NotImplementedError

class AnthropicLLM(AIAsset):
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.client = Anthropic(api_key=api_key)
        logger.info("Anthropic LLM initialized")

    def create_message(self, model: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for Anthropic model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to Anthropic LLM")
            return {"error": "Empty message provided"}
        try:
            response = self.client.messages.create(
                model=model,
                messages=[{"role": "user", "content": message}],
                max_tokens=model_data.get('models', {}).get(model, {}).get('max_tokens', 1000)
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
        self.client = openai.OpenAI(api_key=api_key)
        logger.info("OpenAI LLM initialized")

    def create_message(self, model: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for OpenAI model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to OpenAI LLM")
            return {"error": "Empty message provided"}
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": message}],
                max_tokens=model_data.get('models', {}).get(model, {}).get('max_tokens', 1000)
            )
            logger.info(f"Successfully created message with OpenAI model: {model}")
            return response.model_dump()
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

    def create_message(self, model: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for Groq model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to Groq LLM")
            return {"error": "Empty message provided"}
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": message}],
                max_tokens=model_data.get('models', {}).get(model, {}).get('max_tokens', 1000)
            )
            logger.info(f"Successfully created message with Groq model: {model}")
            return response.model_dump()
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

    def create_message(self, model: str, message: str) -> Dict[str, Any]:
        logger.debug(f"Creating message for Ollama model: {model}")
        if not message.strip():
            logger.warning("Empty message provided to Ollama LLM")
            return {"error": "Empty message provided"}
        try:
            url = f"{self.base_url}/api/generate"
            payload = {
                "model": model,
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
        self._initialize_models()
        logger.info("LLMManager initialized")

    def _initialize_models(self):
        logger.debug("Initializing AI models")
        for provider, api_key in self._load_api_keys().items():
            if api_key:
                self.llm_models[provider] = self._create_llm_instance(provider, api_key)
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
        if not api_key:
            logger.warning(f"No API key provided for {provider}. Skipping initialization.")
            return None
        
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

    def route_query(self, message: str, model: Optional[str] = None) -> Dict[str, Any]:
        logger.info(f"Routing query to {'specified model: ' + model if model else 'default model'}")
        if not message.strip():
            logger.warning("Empty message provided to route_query")
            return {"error": "Empty message provided"}
        
        if model:
            for provider, llm in self.llm_models.items():
                try:
                    logger.debug(f"Attempting to create message with provider: {provider}, model: {model}")
                    response = llm.create_message(model, message)
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
                response = llm.create_message(provider, message)
                if "error" not in response:
                    logger.info(f"Successfully created message with provider: {provider}")
                    return response
                logger.warning(f"Error with {provider}: {response['error']}")
            except Exception as e:
                logger.exception(f"Unexpected error with {provider}: {str(e)}")
        
        logger.error("No available models could process the request")
        return {"error": "No available models could process the request"}

    def get_available_models(self) -> List[str]:
        logger.info("Fetching available models")
        models = list(model_data.get('models', {}).keys())
        logger.debug(f"Available models: {', '.join(models)}")
        return models

    def get_model_info(self, model: str) -> Dict[str, Any]:
        logger.info(f"Retrieving model info for model: {model}")
        if model not in model_data.get('models', {}):
            logger.error(f"Model {model} not found in model_data")
            return {"error": f"Model {model} not found"}
        
        model_info = model_data['models'][model]
        info = {
            "model": model,
            "type": model_info.get('type', 'Unknown'),
            "capabilities": model_info.get('capabilities', []),
            "max_tokens": model_info.get('max_tokens', 'Unknown'),
            "context_window": model_info.get('context_window', 'Unknown'),
            "description": model_info.get('description', 'No description available')
        }
        logger.info(f"Successfully retrieved info for {model}")
        return info