#ai_assets.py
import os
from dotenv import load_dotenv
import json
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Union
import logging
from anthropic import Anthropic
import openai
from groq import Groq

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load model data from JSON file
with open('neural_resources.json', 'r') as f:
    model_data = json.load(f)

# Configuration constants
MAX_CONTINUATION_ITERATIONS = int(os.environ.get('MAX_CONTINUATION_ITERATIONS', '10'))
MAX_CONTINUATION_TOKENS = int(os.environ.get('MAX_CONTINUATION_TOKENS', '50000'))
CONTINUATION_EXIT_PHRASE = os.environ.get('CONTINUATION_EXIT_PHRASE', 'AUTOMODE_COMPLETE')

# Color Configuration
USER_COLOR = os.environ.get('USER_COLOR', '\033[94m')  # Blue
CLAUDE_COLOR = os.environ.get('CLAUDE_COLOR', '\033[92m')  # Green
TOOL_COLOR = os.environ.get('TOOL_COLOR', '\033[93m')  # Yellow
RESULT_COLOR = os.environ.get('RESULT_COLOR', '\033[95m')  # Magenta

class AIAsset(ABC):
    @abstractmethod
    def create_message(self, model: str, system: str, messages: List[Dict[str, str]], 
                       functions: List[Dict[str, object]] | None = None, 
                       function_call: str | None = None) -> object:
        pass

    @abstractmethod
    def get_output_tokens(self, response: object) -> int:
        pass

    @abstractmethod
    def execute_tool_calls(self, tool_calls: List[Dict[str, object]]) -> List[Dict[str, object]]:
        pass

class AnthropicLLM(AIAsset):
    def __init__(self, api_key: str):
        self.client = Anthropic(api_key=api_key)

    def create_message(self, model: str, system: str, messages: List[Dict[str, str]]) -> Any:
        try:
            model_info = model_data['models'][model]
            params = {
                "model": model,
                "max_tokens": model_info['max_tokens'],
                "temperature": model_info['temperature'],
                "system": system,
                "messages": [msg for msg in messages if msg['role'] != 'system']
            }
            response = self.client.messages.create(**params)
            return response
        except Exception as e:
            raise Exception(f"Error in Anthropic API call: {str(e)}")

    def get_output_tokens(self, response: Any) -> int:
        return response.usage.output_tokens if hasattr(response, 'usage') else 0

    def execute_tool_calls(self, tool_calls: List[Dict[str, object]]) -> List[Dict[str, object]]:
        # Implement tool call execution for Anthropic
        pass

class OpenAILLM(AIAsset):
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(api_key=api_key)

    def create_message(self, model: str, system: str, messages: List[Dict[str, str]], 
                       functions: List[Dict[str, Any]] = None, 
                       function_call: str = None) -> Dict[str, Any]:
        try:
            model_info = model_data['models'][model]
            params = {
                "model": model,
                "messages": [{"role": "system", "content": system}, *messages],
                "max_tokens": model_info['max_tokens'],
                "temperature": model_info['temperature'],
            }
            if functions:
                params["functions"] = functions
                if function_call:
                    params["function_call"] = function_call if function_call != "auto" else "auto"
            response = self.client.chat.completions.create(**params)
            return response.model_dump()
        except Exception as e:
            raise Exception(f"Error in OpenAI API call: {str(e)}")

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        return response.get('usage', {}).get('completion_tokens', 0)

    def execute_tool_calls(self, tool_calls: List[Dict[str, object]]) -> List[Dict[str, object]]:
        # Implement tool call execution for OpenAI
        pass

class GroqLLM(AIAsset):
    def __init__(self, api_key: str):
        self.client = Groq(api_key=api_key)

    def create_message(self, model: str, system: str, messages: List[Dict[str, str]], 
                       functions: List[Dict[str, Any]] = None, 
                       function_call: str = None) -> Dict[str, Any]:
        try:
            model_info = model_data['models'][model]
            params = {
                "model": model,
                "messages": [{"role": "system", "content": system}, *messages],
                "max_tokens": model_info['max_tokens'],
                "temperature": model_info['temperature'],
            }
            if functions:
                params["functions"] = functions
                if function_call:
                    params["function_call"] = function_call if function_call != "auto" else "auto"
            response = self.client.chat.completions.create(**params)
            return response.model_dump()
        except Exception as e:
            raise Exception(f"Error in Groq API call: {str(e)}")

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        return response.get('usage', {}).get('completion_tokens', 0)

    def execute_tool_calls(self, tool_calls: List[Dict[str, object]]) -> List[Dict[str, object]]:
        # Implement tool call execution for Groq
        pass

class LLMManager:
    _instance = None  # Singleton instance
    _llm_models: Dict[str, AIAsset] = {}
    _primary_models: Dict[str, str] = {}
    _secondary_models: Dict[str, str] = {}
    _tertiary_models: Dict[str, str] = {}

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(LLMManager, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not hasattr(self, '_initialized'):  # Ensure initialization happens only once
            self.api_keys = self.load_api_keys()
            self.valid_apis = {}
            self.validate_api_keys()
            self._llm_models = {}  # Cache initialized LLM models
            self._initialized = True  # Mark the instance as initialized

    def load_api_keys(self) -> Dict[str, str]:
        return {
            "anthropic": os.getenv('ANTHROPIC_API_KEY'),
            "openai": os.getenv('OPENAI_API_KEY'),
            "groq": os.getenv('GROQ_API_KEY'),
            "tavily": os.getenv('TAVILY_API_KEY'),
        }

    def validate_api_keys(self):
        for api_name, api_key in self.api_keys.items():
            if api_key:
                self.valid_apis[api_name] = api_key
                logger.info(f"API key for {api_name} is present.")
            else:
                logger.warning(f"API key for {api_name} is not provided.")

    def get_available_models(self):
        available_models = {}
        for provider, api_key in self.config.valid_apis.items():
            if api_key:  # Check if the API key is present
                models = self.get_model_by_provider(provider)
                if models:
                    available_models[provider] = models
                else:
                    raise ValueError(f"No available models: {provider}")
        return available_models

    def get_model_by_provider(self, provider: str) -> AIAsset:
        if provider not in self._llm_models:
            if provider not in self.valid_apis:
                raise ValueError(f"No valid API key for provider: {provider}")
            
            if provider == 'anthropic':
                self._llm_models[provider] = AnthropicLLM(api_key=self.valid_apis['anthropic'])
            elif provider == 'openai':
                self._llm_models[provider] = OpenAILLM(api_key=self.valid_apis['openai'])
            elif provider == 'groq':
                self._llm_models[provider] = GroqLLM(api_key=self.valid_apis['groq'])
            else:
                raise ValueError(f"Unknown provider: {provider}")
        return self._llm_models[provider]

    def get_default_model(self, provider: str) -> Union[str, None]:
        try:
            available_models = self.list_models(provider)
            if available_models:
                # Return the first available model for the provider
                return next(iter(available_models))
            else:
                logger.warning(f"No available models for provider: {provider}")
                return None
        except Exception as e:
            logger.error(f"Error getting default model for provider {provider}: {str(e)}")
            return None

    @staticmethod
    def set_primary_model(provider: str, model: str):
        LLMManager._primary_models[provider] = model

    @staticmethod
    def set_secondary_model(provider: str, model: str):
        LLMManager._secondary_models[provider] = model

    @staticmethod
    def set_tertiary_model(provider: str, model: str):
        LLMManager._tertiary_models[provider] = model

    @staticmethod
    def get_primary_model(provider: str) -> Union[str, None]:
        return LLMManager._primary_models.get(provider)

    @staticmethod
    def get_secondary_model(provider: str) -> str:
        return LLMManager._secondary_models.get(provider)

    @staticmethod
    def get_tertiary_model(provider: str) -> str:
        return LLMManager._tertiary_models.get(provider)

    def get_model_for_task(self, task: str, provider: str) -> Union[str, None]:
        try:
            primary_model = self.get_primary_model(provider)
            if primary_model:
                return primary_model

            available_models = self.list_models(provider)
            for tier in ['primary', 'secondary', 'tertiary']:
                for model, info in available_models.items():
                    if info.get('tier') == tier and task in info.get('suitable_tasks', []):
                        return model

            # If no suitable model is found, return the default model
            default_model = self.get_default_model(provider)
            if default_model:
                logger.info(f"Using default model {default_model} for task: {task} with provider: {provider}")
                return default_model

            logger.warning(f"No suitable or default model found for task: {task} with provider: {provider}")
            return None

        except Exception as e:
            logger.error(f"Error occurred while selecting model for task '{task}' with provider '{provider}': {str(e)}")
            return None

    @staticmethod
    def list_models(provider: str = None, model_type: str = None) -> Dict[str, Any]:
        if provider and model_type:
            return {name: info for name, info in model_data['models'].items() 
                    if info['provider'] == provider and info['type'] == model_type}
        elif provider:
            return {name: info for name, info in model_data['models'].items() 
                    if info['provider'] == provider}
        elif model_type:
            return {name: info for name, info in model_data['models'].items() 
                    if info['type'] == model_type}
        else:
            return model_data['models']

    @staticmethod
    def get_model_info(model_name: str) -> Dict[str, Any]:
        return model_data['models'].get(model_name, {})

    @staticmethod
    def get_model_by_capability(capability: str) -> List[str]:
        return [name for name, info in model_data['models'].items() 
                if capability in info.get('capabilities', [])]

    def get_api_key(self, provider: str) -> str:
        return self.valid_apis.get(provider)

    def masked_api_keys(self) -> Dict[str, str]:
        """Return a masked version of the API keys for logging purposes."""
        return {k: (v[:5] + '*****') if v else None for k, v in self.api_keys.items()}

    def masked_valid_apis(self) -> Dict[str, str]:
        """Return a masked version of the valid API keys for logging purposes."""
        return {k: (v[:5] + '*****') if v else None for k, v in self.valid_apis.items()}
    
llm_manager = LLMManager()