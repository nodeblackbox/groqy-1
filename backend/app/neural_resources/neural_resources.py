#neural_resources.py
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
                max_tokens=1000
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
                max_tokens=1000
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
                max_tokens=1000
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

        # Fetch Groq models (ensure this section is correctly handling Groq models)
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

    def get_model_info(self, model: str) -> Dict[str, Any]:
        logger.info(f"Retrieving model info for model: {model}")
        
        # Check if the model info is cached
        if model in self.models_cache:
            logger.debug(f"Model info for {model} retrieved from cache.")
            return self.models_cache[model]

        try:
            # Fetch from Ollama
            ollama_models = self.get_available_models()
            if model in ollama_models:
                logger.info(f"Fetching model info from Ollama for model: {model}")
                url = f"{self.llm_models['ollama'].base_url}/api/models/{model}"
                ollama_response = requests.get(url)
                if ollama_response.status_code == 200:
                    model_info = ollama_response.json()
                    self.models_cache[model] = model_info  # Cache the result
                    logger.debug(f"Fetched Ollama model info: {model_info}")
                    return model_info
                else:
                    logger.error(f"Failed to fetch Ollama model info: {ollama_response.status_code}, Response: {ollama_response.text}")
            
            # Fetch from Groq
            groq_api_key = self.overridden_keys.get('groq')
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
                    self.models_cache[model] = model_info  # Cache the result
                    logger.debug(f"Fetched Groq model info: {model_info}")
                    return model_info
                else:
                    logger.error(f"Failed to fetch Groq model info: {groq_response.status_code}, Response: {groq_response.text}")
        except Exception as e:
            logger.error(f"Error fetching model info for {model}: {str(e)}")
            return {"error": f"Model {model} not found or failed to retrieve info."}
        
        logger.error(f"Model {model} not found in any provider.")
        return {"error": f"Model {model} not found in any provider."}
