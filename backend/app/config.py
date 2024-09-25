# agentchef/config.py

import yaml
from typing import Dict, Any

class ConfigManager:
    @staticmethod
    def load_config(config_path: str) -> Dict[str, Any]:
        with open(config_path, 'r') as f:
            return yaml.safe_load(f)

    @staticmethod
    def save_config(config: Dict[str, Any], config_path: str):
        with open(config_path, 'w') as f:
            yaml.dump(config, f)