# AgentChef Comprehensive Guide

This guide demonstrates how to use the agentChef package to scrape data from various sources, process it into a structured format, and run it through a data processing pipeline.

## Initialization

Import the necessary modules and initialize the DatasetKitchen:

```python
from chef import DatasetKitchen
from agentChef.cutlery import CustomAgentBase
import pandas as pd

config = {
    'templates_dir': './templates',
    'input_dir': './input',
    'output_dir': './output',
}

kitchen = DatasetKitchen(config)
```

## Data Collection

### 1. Hugging Face Datasets

```python
hf_dataset_url = "https://huggingface.co/datasets/your_dataset"
hf_data = kitchen.document_loader.load_from_huggingface(hf_dataset_url)
```

### 2. Wikipedia

```python
wiki_query = "Artificial Intelligence"
wiki_data = kitchen.document_loader.load_from_wikipedia(wiki_query)
```

### 3. Reddit (Custom Agent)

Create a custom Reddit agent:

```python
import praw

class RedditAgent(CustomAgentBase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.reddit = praw.Reddit(client_id='YOUR_CLIENT_ID',
                                  client_secret='YOUR_CLIENT_SECRET',
                                  user_agent='YOUR_USER_AGENT')

    def scrape_data(self, source: str) -> List[Dict[str, Any]]:
        submission = self.reddit.submission(url=source)
        submission.comments.replace_more(limit=None)
        return [{'body': comment.body, 'score': comment.score} for comment in submission.comments.list()]

    def process_data(self, data: List[Dict[str, Any]]) -> pd.DataFrame:
        return pd.DataFrame(data)

kitchen.register_custom_agent('reddit', RedditAgent)
reddit_agent = kitchen.get_agent('reddit')
reddit_data = reddit_agent.run('https://www.reddit.com/r/AskReddit/comments/example_post/')
```

### 4. arXiv

```python
arxiv_query = "machine learning"
arxiv_data = kitchen.document_loader.load_from_arxiv(arxiv_query)
```

### 5. GitHub

```python
github_repo = "username/repo"
github_data = kitchen.document_loader.load_from_github(github_repo)
```

## Data Processing

Now that we have collected data from various sources, let's process it into the desired JSON structure:

```python
def process_data(data, source_type):
    processed_data = []
    for item in data:
        processed_item = {
            "task": "command_description",
            "instruction": "You are a function description specialist for Ollama Agent Roll Cage.",
            "input": f"Please explain what the command does in the context of {source_type}.",
            "output": item.get('body', item.get('content', str(item))),
            "command": f"/{source_type}_command"
        }
        processed_data.append(processed_item)
    return processed_data

# Process data from each source
hf_processed = process_data(hf_data, "huggingface")
wiki_processed = process_data(wiki_data, "wikipedia")
reddit_processed = process_data(reddit_data.to_dict('records'), "reddit")
arxiv_processed = process_data(arxiv_data, "arxiv")
github_processed = process_data(github_data, "github")

# Combine all processed data
all_processed_data = hf_processed + wiki_processed + reddit_processed + arxiv_processed + github_processed
```

## Data Pipeline

Now, let's run the combined data through the agentChef pipeline:

```python
# Convert to DataFrame
df = pd.DataFrame(all_processed_data)

# Clean data
cleaned_data = kitchen.clean_data(df)

# Augment data
augmentation_config = {
    'instruction': {'type': 'paraphrase'},
    'input': {'type': 'paraphrase'},
    'output': {'type': 'paraphrase'}
}
augmented_data = kitchen.augment_data(cleaned_data, augmentation_config)

# Generate synthetic data
num_samples = 100
synthetic_data = kitchen.generate_synthetic_data(augmented_data, num_samples, augmentation_config)

# Final cleaning
final_data = kitchen.clean_data(synthetic_data)
```

## Saving and Pushing to Hugging Face

Save the final data as JSON and Parquet:

```python
# Save as JSON
json_output = 'final_dataset.json'
final_data.to_json(json_output, orient='records', indent=2)
print(f"Saved JSON to {json_output}")

# Save as Parquet
parquet_output = 'final_dataset.parquet'
kitchen.file_handler.save_to_parquet(final_data, parquet_output)
print(f"Saved Parquet to {parquet_output}")
```

Optionally, push the Parquet file to Hugging Face:

```python
from huggingface_hub import HfApi

def push_to_huggingface(file_path, repo_id, token):
    api = HfApi()
    api.upload_file(
        path_or_fileobj=file_path,
        path_in_repo=file_path,
        repo_id=repo_id,
        token=token
    )

# Push to Hugging Face
hf_token = "your_huggingface_token"
hf_repo = "your_username/your_dataset_repo"
push_to_huggingface(parquet_output, hf_repo, hf_token)
print(f"Pushed {parquet_output} to Hugging Face repository: {hf_repo}")
```

## Complete Example

Here's a complete script that puts all these steps together:

```python
from agentChef import DatasetKitchen
from agentChef.cutlery import CustomAgentBase
import pandas as pd
import praw
from huggingface_hub import HfApi

# Configuration
config = {
    'templates_dir': './templates',
    'input_dir': './input',
    'output_dir': './output',
    'github_access_token': 'your_github_token_if_needed'
}

# Initialize DatasetKitchen
kitchen = DatasetKitchen(config)

# Define Reddit Agent
class RedditAgent(CustomAgentBase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.reddit = praw.Reddit(client_id='YOUR_CLIENT_ID',
                                  client_secret='YOUR_CLIENT_SECRET',
                                  user_agent='YOUR_USER_AGENT')

    def scrape_data(self, source: str) -> List[Dict[str, Any]]:
        submission = self.reddit.submission(url=source)
        submission.comments.replace_more(limit=None)
        return [{'body': comment.body, 'score': comment.score} for comment in submission.comments.list()]

    def process_data(self, data: List[Dict[str, Any]]) -> pd.DataFrame:
        return pd.DataFrame(data)

# Register Reddit Agent
kitchen.register_custom_agent('reddit', RedditAgent)

# Data Collection
hf_data = kitchen.document_loader.load_from_huggingface("https://huggingface.co/datasets/your_dataset")
wiki_data = kitchen.document_loader.load_from_wikipedia("Artificial Intelligence")
reddit_agent = kitchen.get_agent('reddit')
reddit_data = reddit_agent.run('https://www.reddit.com/r/AskReddit/comments/example_post/')
arxiv_data = kitchen.document_loader.load_from_arxiv("machine learning")
github_data = kitchen.document_loader.load_from_github("username/repo")

# Data Processing
def process_data(data, source_type):
    processed_data = []
    for item in data:
        processed_item = {
            "task": "command_description",
            "instruction": "You are a function description specialist for Ollama Agent Roll Cage.",
            "input": f"Please explain what the command does in the context of {source_type}.",
            "output": item.get('body', item.get('content', str(item))),
            "command": f"/{source_type}_command"
        }
        processed_data.append(processed_item)
    return processed_data

hf_processed = process_data(hf_data, "huggingface")
wiki_processed = process_data(wiki_data, "wikipedia")
reddit_processed = process_data(reddit_data.to_dict('records'), "reddit")
arxiv_processed = process_data(arxiv_data, "arxiv")
github_processed = process_data(github_data, "github")

all_processed_data = hf_processed + wiki_processed + reddit_processed + arxiv_processed + github_processed

# Data Pipeline
df = pd.DataFrame(all_processed_data)
cleaned_data = kitchen.clean_data(df)

augmentation_config = {
    'instruction': {'type': 'paraphrase'},
    'input': {'type': 'paraphrase'},
    'output': {'type': 'paraphrase'}
}
augmented_data = kitchen.augment_data(cleaned_data, augmentation_config)

num_samples = 100
synthetic_data = kitchen.generate_synthetic_data(augmented_data, num_samples, augmentation_config)

final_data = kitchen.clean_data(synthetic_data)

# Save and Push to Hugging Face
json_output = 'final_dataset.json'
final_data.to_json(json_output, orient='records', indent=2)
print(f"Saved JSON to {json_output}")

parquet_output = 'final_dataset.parquet'
kitchen.file_handler.save_to_parquet(final_data, parquet_output)
print(f"Saved Parquet to {parquet_output}")

def push_to_huggingface(file_path, repo_id, token):
    api = HfApi()
    api.upload_file(
        path_or_fileobj=file_path,
        path_in_repo=file_path,
        repo_id=repo_id,
        token=token
    )

hf_token = "your_huggingface_token"
hf_repo = "your_username/your_dataset_repo"
push_to_huggingface(parquet_output, hf_repo, hf_token)
print(f"Pushed {parquet_output} to Hugging Face repository: {hf_repo}")
```

This comprehensive guide demonstrates how to use the agentChef package to collect data from various sources, process it into a structured format, run it through a data processing pipeline, and finally save and push the results to Hugging Face. You can adapt this guide to your specific needs and data sources.