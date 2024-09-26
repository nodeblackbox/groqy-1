import os
import json
import logging
import requests
from typing import List, Dict, Any
from anthropic import Anthropic
import openai
from groq import Groq

# Get the absolute path of the current file
current_directory = os.path.dirname(os.path.abspath(__file__))

# Create the path to neural_resources.json
json_path = os.path.join(current_directory, 'neural_resources.json')

# Load model data from JSON file
with open(json_path, 'r') as f:
    model_data = json.load(f)

class AIAsset:
    def __init__(self, api_key: str):
        self.api_key = api_key

    def create_message(self, model: str, message: str) -> Dict[str, Any]:
        """Abstract method for creating a message"""
        pass

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        """Abstract method to get token usage"""
        pass

    def execute_tool_calls(self, tool_calls: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Abstract method for executing tool calls"""
        pass

class AnthropicLLM(AIAsset):
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.client = Anthropic(api_key=api_key)

    def create_message(self, model: str, message: str) -> Dict[str, Any]:
        try:
            response = self.client.messages.create(
                model=model,
                messages=[message],
                max_tokens=model_data['models'][model]['max_tokens']
            )
            return response.model_dump()
        except Exception as e:
            logging.error(f"Error creating message for Anthropic: {str(e)}")
            return {"error": f"Anthropic failed: {str(e)}"}

    def get_output_tokens(self, response: Dict[str, Any]) -> int:
        return response.get('usage', {}).get('output_tokens', 0)

class OpenAILLM(AIAsset):
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.client = openai.OpenAI(api_key=api_key)

    def create_message(self, model: str, message: str) -> Dict[str, Any]:
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[{"content": message}],
                max_tokens=model_data['models'][model]['max_tokens']
            )
            return response.model_dump()
        except Exception as e:
            logging.error(f"Error creating message for OpenAI: {str(e)}")
            return {"error": f"OpenAI failed: {str(e)}"}

class GroqLLM(AIAsset):
    def __init__(self, api_key: str):
        super().__init__(api_key)
        self.client = Groq(api_key=api_key)

    def create_message(self, model: str, message: str) -> Dict[str, Any]:
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[{"content": message}],
                max_tokens=model_data['models'][model]['max_tokens']
            )
            return response.model_dump()
        except Exception as e:
            logging.error(f"Error creating message for Groq: {str(e)}")
            return {"error": f"Groq failed: {str(e)}"}

class OllamaLLM(AIAsset):
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url

    def create_message(self, model: str, message: str) -> Dict[str, Any]:
        try:
            url = f"{self.base_url}/api/generate"
            payload = {
                "model": model,
                "prompt": message,
                "stream": False
            }
            response = requests.post(url, json=payload)
            return response.json()
        except Exception as e:
            logging.error(f"Error creating message for Ollama: {str(e)}")
            return {"error": f"Ollama failed: {str(e)}"}

class LLMManager:
    def __init__(self):
        self.llm_models = {}
        self.overridden_keys = {}
        self._initialize_models()

    def _initialize_models(self):
        for provider, api_key in self._load_api_keys().items():
            if api_key:
                self.llm_models[provider] = self._create_llm_instance(provider, api_key)
        self.llm_models["ollama"] = OllamaLLM()

    def _load_api_keys(self) -> Dict[str, str]:
        return {
            "anthropic": self.overridden_keys.get('anthropic', os.getenv('ANTHROPIC_API_KEY')),
            "openai": self.overridden_keys.get('openai', os.getenv('OPENAI_API_KEY')),
            "groq": self.overridden_keys.get('groq', os.getenv('GROQ_API_KEY')),
        }

    def _create_llm_instance(self, provider: str, api_key: str) -> AIAsset:
        if provider == "anthropic":
            return AnthropicLLM(api_key)
        elif provider == "openai":
            return OpenAILLM(api_key)
        elif provider == "groq":
            return GroqLLM(api_key)
        return None

    def set_api_key(self, provider: str, api_key: str):
        """Override API keys manually"""
        self.overridden_keys[provider] = api_key
        self._initialize_models()

    def route_query(self, message: str) -> Dict[str, Any]:
        """Handles message routing entirely internally"""
        for provider, model in self.llm_models.items():
            try:
                return model.create_message(provider, message)
            except Exception as e:
                logging.error(f"Error with {provider}: {str(e)}")
        return {"error": "No available models"}
