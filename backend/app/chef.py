from typing import List, Dict, Any
import json
from colorama import Fore, Style
import click
#from config import ConfigManager
from cutlery import DatasetManager, TemplateManager, PromptManager, FileHandler, DocumentLoader
import pandas as pd
from api.ai_api_providers import LLMManager
from agentchef_resources import OpenAILLM, OllamaLLM
from anthropic import Anthropic
import openai
from groq import Groq
import tqdm

# If ConfigManager is in a separate config.py file next to main.py
# from config import ConfigManager

# If PromptManager is part of cutlery, update the import
from cutlery import PromptManager

class DataCollectionAgent:
    def __init__(self, template_manager: TemplateManager, file_handler: FileHandler, document_loader: DocumentLoader):
        self.template_manager = template_manager
        self.file_handler = file_handler
        self.document_loader = document_loader

    def collect_and_structure_data(self, source: str, template_name: str) -> Dict[str, Any]:
        template = self.template_manager.get_template(template_name)
        
        collected_data = self._collect_data(source)
        structured_data = self._structure_data(collected_data, template)
        
        self.file_handler.save_to_parquet(structured_data, f"{template_name}_structured_data.parquet")
        
        return structured_data

    def _collect_data(self, source: str) -> List[Dict[str, Any]]:
        if source.startswith("hf://"):
            dataset_name = source[5:]
            return self.document_loader.load_from_huggingface(dataset_name)
        elif source.startswith("github://"):
            repo_name = source[9:]
            return self.document_loader.load_from_github(repo_name)
        elif source.startswith("wiki://"):
            query = source[7:]
            return [self.document_loader.load_from_wikipedia(query)]
        elif source.startswith("arxiv://"):
            query = source[8:]
            return self.document_loader.load_from_arxiv(query)
        elif self.document_loader.is_url(source):
            return self.document_loader.load_web_page(source)
        else:
            return self.file_handler.load_seed_data(source)

    def _structure_data(self, data: List[Dict[str, Any]], template: List[str]) -> Dict[str, List[Any]]:
        structured_data = {field: [] for field in template}
        
        for item in data:
            for field in template:
                structured_data[field].append(item.get(field, ""))
        
        return structured_data

class DataDigestionAgent:
    def __init__(self, file_handler: FileHandler):
        self.file_handler = file_handler

    def digest_data(self, input_file: str, output_format: str = 'parquet') -> str:
        data = self.file_handler.load_data(input_file)
        
        if output_format == 'parquet':
            output_file = self.file_handler.save_to_parquet(data, f"digested_{input_file}.parquet")
        elif output_format == 'csv':
            output_file = self.file_handler.save_to_csv(data, f"digested_{input_file}.csv")
        else:
            raise ValueError(f"Unsupported output format: {output_format}")
        
        return output_file

    def parse_text_to_structured_data(self, text_content: str, template: List[str]) -> Dict[str, List[Any]]:
        # Implement parsing logic here
        pass

class DataGenerationAgent:
    def __init__(self, ollama_interface: OllamaLLM, template_manager: TemplateManager):
        self.ollama_interface = ollama_interface
        self.template_manager = template_manager

    def generate_synthetic_data(self, seed_data: pd.DataFrame, num_samples: int, column_types: Dict[str, str], custom_prompts: Dict[str, Any]) -> pd.DataFrame:
        synthetic_data = []
        
        for _ in range(num_samples):
            synthetic_row = {}
            for column, col_type in column_types.items():
                if col_type in ['static', 'reference']:
                    synthetic_row[column] = seed_data[column].sample().iloc[0]
                elif col_type == 'dynamic':
                    original_content = seed_data[column].sample().iloc[0]
                    synthetic_row[column] = self._generate_content(column, original_content, seed_data.sample().iloc[0], column_types, custom_prompts)
            
            synthetic_data.append(synthetic_row)
        
        return pd.DataFrame(synthetic_data)

    def _generate_content(self, column: str, text: str, row: pd.Series, column_types: Dict[str, str], custom_prompts: Dict[str, Any]) -> str:
        # Implement content generation logic using Ollama
        pass

    def augment_data(self, data: pd.DataFrame, augmentation_config: Dict[str, Any]) -> pd.DataFrame:
        # Implement data augmentation logic
        pass

class DataGenerationAgent:
    def __init__(self, llm_manager, template_manager, prompt_manager):
        self.llm_manager = llm_manager
        self.template_manager = template_manager
        self.prompt_manager = prompt_manager

    def generate_synthetic_data(self, seed_data: pd.DataFrame, num_samples: int, column_types: Dict[str, str], custom_prompts: Dict[str, Any]) -> pd.DataFrame:
        synthetic_data = []
        
        for _ in range(num_samples):
            synthetic_row = {}
            for column, col_type in column_types.items():
                if col_type in ['static', 'reference']:
                    synthetic_row[column] = seed_data[column].sample().iloc[0]
                elif col_type == 'dynamic':
                    original_content = seed_data[column].sample().iloc[0]
                    synthetic_row[column] = self._generate_content(column, original_content, seed_data.sample().iloc[0], column_types, custom_prompts)
            
            synthetic_data.append(synthetic_row)
        
        return pd.DataFrame(synthetic_data)

    def _generate_content(self, column: str, text: str, row: pd.Series, column_types: Dict[str, str], custom_prompts: Dict[str, Any]) -> str:
        print(f"{Fore.CYAN}Generating content for column: {column}{Style.RESET_ALL}")
        print(f"{Fore.YELLOW}Custom prompts: {json.dumps(custom_prompts, indent=2)}{Style.RESET_ALL}")

        reference_values = {col: row[col] for col, col_type in column_types.items() if col_type == 'reference'}
        is_question = self._is_question(text)

        system_prompt = custom_prompts.get('system') or self.prompt_manager.get_prompt('system')
        column_prompts = custom_prompts.get('dynamicColumns', {}).get(column, {})
        user_prompt = column_prompts.get('user') or self.prompt_manager.get_prompt('dynamicColumns', 'user', column)

        print(f"{Fore.MAGENTA}System prompt: {system_prompt}{Style.RESET_ALL}")
        print(f"{Fore.MAGENTA}User prompt: {user_prompt}{Style.RESET_ALL}")

        if not user_prompt:
            user_prompt = self._get_default_user_prompt(column)

        formatted_user_prompt = user_prompt.format(
            text=text,
            reference_values=reference_values,
            is_question=is_question,
            column=column
        )

        print(f"{Fore.BLUE}Formatted user prompt: {formatted_user_prompt}{Style.RESET_ALL}")

        response = self.llm_manager.route_query(formatted_user_prompt)
        
        generated_content = response['message']['content'].strip()
        print(f"{Fore.GREEN}Generated content: {generated_content}{Style.RESET_ALL}")

        cleaned_content = self._clean_generated_content(generated_content, is_question)
        print(f"{Fore.LIGHTGREEN_EX}Cleaned content: {cleaned_content}{Style.RESET_ALL}")

        return cleaned_content

    def _is_question(self, text: str) -> bool:
        return text.strip().endswith('?')

    def _get_default_user_prompt(self, column: str) -> str:
        if column == 'input':
            return """
            Original text: {text}
            Reference values: {reference_values}
            Is question: {is_question}

            Generate a rephrased input question that maintains the original meaning and incorporates the reference values. If the original is not a question, convert it into one. Ensure the question starts with an appropriate question word (What, When, Where, Who, Why, How, Can, Could, Would, Should, Is, Are, Do, Does) and ends with a question mark. Do not provide any explanations or additional information.
            """
        elif column == 'output':
            return """
            Original text: {text}
            Reference values: {reference_values}
            Is question: {is_question}

            Generate a rephrased output statement that maintains the original meaning and incorporates the reference values. If the original is a question, convert it into a statement. Ensure the statement is clear, concise, and ends with a period. Do not provide any explanations or additional information.
            """
        else:
            return """
            Original text: {text}
            Reference values: {reference_values}
            Is question: {is_question}

            Generate a suitable response for the '{column}' column, maintaining its core meaning and incorporating the reference values where appropriate. Ensure the response is coherent and contextually relevant.
            """

    def _clean_generated_content(self, content: str, is_question: bool) -> str:
        # Implement cleaning logic here
        # For example, ensure proper punctuation, remove extra whitespace, etc.
        return content.strip()

    def generate_paraphrase(self, text: str, row: pd.Series, column_types: Dict[str, str]) -> str:
        reference_values = {col: row[col] for col, col_type in column_types.items() if col_type == 'reference'}
        is_question = self._is_question(text)
        paraphrased = self._paraphrase_text_with_references(text, reference_values)
        verified = self._verify_paraphrase(original=text, paraphrased=paraphrased, reference=reference_values, is_question=is_question)
        return verified

    def _paraphrase_text_with_references(self, text: str, reference_values: Dict[str, Any]) -> str:
        system_prompt = self.prompt_manager.get_prompt('paraphrase', 'system')
        user_prompt = self.prompt_manager.get_prompt('paraphrase', 'user').format(
            text=text,
            reference_values=reference_values
        )

        response = self.ollama_interface.chat(messages=[
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': user_prompt}
        ])
        
        paraphrased_text = response['message']['content'].strip()
        return paraphrased_text

    def _verify_paraphrase(self, original: str, paraphrased: str, reference: Dict[str, Any], is_question: bool) -> str:
        system_prompt = self.prompt_manager.get_prompt('verify', 'system')
        user_prompt = self.prompt_manager.get_prompt('verify', 'user').format(
            original=original,
            generated=paraphrased,
            reference=reference,
            is_question=is_question
        )

        response = self.ollama_interface.chat(messages=[
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': user_prompt}
        ])

        verified_text = response['message']['content'].strip()
        return verified_text
    
class DataAugmentationAgent:
    def __init__(self, llm_manager, prompt_manager):
        self.llm_manager = llm_manager
        self.prompt_manager = prompt_manager

    def augment_data(self, data, augmentation_config):
        augmented_data = []
        
        for _, row in tqdm(data.iterrows(), total=len(data), desc="Augmenting data"):
            augmented_row = self._generate_augmented_row(row, augmentation_config)
            augmented_data.append(augmented_row)
        
        return pd.DataFrame(augmented_data)

    def _generate_augmented_row(self, row, augmentation_config):
        augmented_row = {}
        
        for column, config in augmentation_config.items():
            if config['type'] == 'paraphrase':
                augmented_row[column] = self._paraphrase_text(row[column])
            elif config['type'] == 'expand':
                augmented_row[column] = self._expand_text(row[column], config['prompt'])
            else:
                augmented_row[column] = row[column]
        
        return augmented_row
    
class DataCleaningAgent:
    def clean_data(self, data: pd.DataFrame) -> pd.DataFrame:
        cleaned_data = data.copy()
        
        # Remove any leading/trailing whitespace
        for column in cleaned_data.columns:
            if cleaned_data[column].dtype == 'object':
                cleaned_data[column] = cleaned_data[column].str.strip()
        
        # Remove duplicate rows
        cleaned_data = cleaned_data.drop_duplicates()
        
        # Handle missing values (you might want to customize this based on your needs)
        cleaned_data = cleaned_data.fillna('')
        
        return cleaned_data

    def remove_inconsistencies(self, data: pd.DataFrame, rules: List[Dict[str, Any]]) -> pd.DataFrame:
        # Implement logic to remove inconsistencies based on provided rules
        pass

    def validate_data(self, data: pd.DataFrame, validation_schema: Dict[str, Any]) -> pd.DataFrame:
        # Implement data validation logic
        pass
    
class DatasetKitchen:
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.template_manager = TemplateManager(config['templates_dir'])
        self.file_handler = FileHandler(config['input_dir'], config['output_dir'])
        self.llm_manager = LLMManager()
        self.prompt_manager = PromptManager()
        self.document_loader = DocumentLoader(github_access_token=config.get('github_access_token'))
        self.dataset_manager = DatasetManager(
            self.llm_manager,
            self.template_manager,
            self.file_handler,
            self.prompt_manager
        )
        self.collection_agent = DataCollectionAgent(
            self.template_manager,
            self.file_handler,
            self.document_loader
        )
        self.custom_agents = {}

    def register_custom_agent(self, agent_name: str, agent_class):
        """Register a custom agent"""
        self.custom_agents[agent_name] = agent_class(
            self.llm_manager,
            self.template_manager,
            self.file_handler,
            self.prompt_manager,
            self.document_loader
        )
        
    def get_agent(self, agent_name: str):
        """Get a registered agent"""
        return self.custom_agents.get(agent_name, None)

    def scrape_data(self, source: str, agent_name: str = None):
        """Scrape data using Langchain and custom agents if specified"""
        if agent_name and agent_name in self.custom_agents:
            return self.custom_agents[agent_name].scrape_data(source)
        return self.document_loader.ingest_document(source, self.config['output_dir'])
    
    def prepare_dataset(self, source: str, template_name: str, num_samples: int, augmentation_config: Dict[str, Any], output_file: str) -> pd.DataFrame:
        """Multi-step dataset construction process"""
        return self.dataset_manager.prepare_dataset(source, template_name, num_samples, augmentation_config, output_file)

    def collect_and_structure_data(self, source: str, template_name: str) -> Dict[str, Any]:
        return self.dataset_manager.collect_and_structure_data(source, template_name)

    def digest_data(self, data: Dict[str, Any], template_name: str) -> pd.DataFrame:
        return self.dataset_manager.digest_data(data, template_name)

    def clean_data(self, data: pd.DataFrame) -> pd.DataFrame:
        return self.dataset_manager.clean_data(data)

    def augment_data(self, data: pd.DataFrame, augmentation_config: Dict[str, Any]) -> pd.DataFrame:
        return self.dataset_manager.augment_data(data, augmentation_config)

    def generate_synthetic_data(self, data: pd.DataFrame, num_samples: int, augmentation_config: Dict[str, Any]) -> pd.DataFrame:
        return self.dataset_manager.generate_synthetic_data(data, num_samples, augmentation_config)

    def parse_text_to_parquet(self, text_content: str, template_name: str, filename: str):
        return self.dataset_manager.parse_text_to_parquet(text_content, template_name, filename)

    def convert_parquet(self, parquet_file: str, output_formats: List[str]):
        return self.dataset_manager.convert_parquet(parquet_file, output_formats)

@click.group()
@click.option('--config', default='config.yaml', help='Path to the configuration file')
@click.pass_context
def cli(ctx, config):
    ctx.obj = ConfigManager.load_config(config)

@cli.command()
@click.option('--source', required=True, help='Source of the data')
@click.option('--template', required=True, help='Name of the template to use')
@click.option('--num-samples', default=100, help='Number of samples to generate')
@click.option('--output', required=True, help='Path to save the generated dataset')
@click.option('--augment/--no-augment', default=False, help='Whether to augment the data')
@click.pass_obj
def prepare_dataset(config, source, template, num_samples, output, augment):
    dataset_kitchen = DatasetKitchen(config)
    augmentation_config = config.get('augmentation_config', {}) if augment else None
    dataset = dataset_kitchen.prepare_dataset(source, template, num_samples, augmentation_config, output)
    click.echo(f"Dataset prepared and saved to {output}")

@cli.command()
@click.option('--seed-file', required=True, help='Path to the seed file')
@click.option('--num-samples', default=1, help='Number of paraphrased samples to generate')
@click.option('--system-prompt', help='Custom system prompt for paraphrasing')
@click.pass_obj
def generate_paraphrases(config, seed_file, num_samples, system_prompt):
    dataset_kitchen = DatasetKitchen(config)
    output_files = dataset_kitchen.generate_paraphrases(seed_file, num_samples, system_prompt)
    click.echo(f"Paraphrased content saved to: {', '.join(output_files)}")

@cli.command()
@click.option('--seed-parquet', required=True, help='Path to the seed parquet file')
@click.pass_obj
def augment_data(config, seed_parquet):
    dataset_kitchen = DatasetKitchen(config)
    augmentation_config = config.get('augmentation_config', {})
    output_file = dataset_kitchen.augment_data(seed_parquet, augmentation_config)
    click.echo(f"Augmented data saved to: {output_file}")

if __name__ == '__main__':
    cli()