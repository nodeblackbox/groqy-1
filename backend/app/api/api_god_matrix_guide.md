# AgentChef and GravRAG API GOD MATRIX Usage Guide

This guide explains how to use the combined AgentChef and GravRAG API GOD MATRIX system, which is set up using `main.py` and includes the functionality from `agentChef_api.py` & gravrag_API.py.

## Table of Contents

1. [Setup and Installation](#setup-and-installation)
2. [Running the API](#running-the-api)
3. [AgentChef API Endpoints](#agentchef-api-endpoints)
   - [Collect Data](#collect-data)
   - [Structure Data](#structure-data)
   - [Augment Data](#augment-data)
   - [Push to Hugging Face](#push-to-hugging-face)
   - [Get Templates](#get-templates)
   - [Get Available Agents](#get-available-agents)
4. [GravRAG API Endpoints](#gravrag-api-endpoints)
   - [Create Memory](#create-memory)
   - [Recall Memory](#recall-memory)
   - [Prune Memories](#prune-memories)
5. [Example Workflow](#example-workflow)

## Setup and Installation

1. Ensure you have Python 3.7+ installed.
2. Install the required dependencies:
   ```
   pip install fastapi uvicorn agentchef gravrag pandas huggingface_hub
   ```
3. Place `main.py`, `agentChef_api.py`, and `gravrag_API.py` in the same directory.

## Running the API

1. Open a terminal and navigate to the directory containing `main.py`.
2. Run the following command:
   ```
   python main.py
   ```
3. The AgentChef API will be available at `http://localhost:8888`.
4. The GravRAG API will be available at `http://localhost:6369`.

## AgentChef API Endpoints

### Collect Data

- **Endpoint**: `POST http://localhost:8888/collect_data`
- **Description**: Collects data from arXiv, Wikipedia, or Hugging Face datasets.
- **Payload Example**:
  ```json
  {
    "source_type": "arxiv",
    "query": "machine learning",
    "max_results": 10
  }
  ```

### Structure Data

- **Endpoint**: `POST http://localhost:8888/structure_data`
- **Description**: Structures collected data into the instruction-input-output format.
- **Payload Example**:
  ```json
  {
    "data": [{"title": "Example", "content": "This is a sample content"}],
    "template_name": "instruction_input_output"
  }
  ```

### Augment Data

- **Endpoint**: `POST http://localhost:8888/augment_data`
- **Description**: Augments structured data by generating paraphrases, expanding, and cleaning.
- **Payload Example**:
  ```json
  {
    "input_file": "structured_data.parquet",
    "num_samples": 5,
    "agent_name": "openai"
  }
  ```

### Push to Hugging Face

- **Endpoint**: `POST http://localhost:8888/push_to_huggingface`
- **Description**: Pushes the final dataset to a Hugging Face repository.
- **Payload Example**:
  ```json
  {
    "file_path": "augmented_data.parquet",
    "repo_id": "username/dataset-name",
    "token": "your_huggingface_token"
  }
  ```

### Get Templates

- **Endpoint**: `GET http://localhost:8888/get_templates`
- **Description**: Retrieves all available templates.

### Get Available Agents

- **Endpoint**: `GET http://localhost:8888/get_available_agents`
- **Description**: Retrieves all available AI agents.

## GravRAG API Endpoints

### Create Memory

- **Endpoint**: `POST http://localhost:6369/api/memory/create`
- **Description**: Creates a new memory in GravRAG.
- **Payload Example**:
  ```json
  {
    "content": "This is a sample memory",
    "metadata": {
      "objective_id": "obj_1",
      "task_id": "task_1"
    }
  }
  ```

### Recall Memory

- **Endpoint**: `GET http://localhost:6369/api/memory/recall`
- **Description**: Recalls memories from GravRAG based on a query.
- **Usage Example**: `GET http://localhost:6369/api/memory/recall?query=How does GravRAG handle memory?&top_k=5`

### Prune Memories

- **Endpoint**: `POST http://localhost:6369/api/memory/prune`
- **Description**: Prunes memories in GravRAG.

## Example Workflow

Here's an example of how you might use these APIs together:

1. Collect data from arXiv:
   ```
   POST http://localhost:8888/collect_data
   {
     "source_type": "arxiv",
     "query": "machine learning",
     "max_results": 10
   }
   ```

2. Structure the collected data:
   ```
   POST http://localhost:8888/structure_data
   {
     "data": [{"title": "Machine Learning Overview", "content": "Machine learning is a subset of artificial intelligence..."}],
     "template_name": "instruction_input_output"
   }
   ```

3. Augment the structured data:
   ```
   POST http://localhost:8888/augment_data
   {
     "input_file": "structured_data.parquet",
     "num_samples": 5,
     "agent_name": "openai"
   }
   ```

4. Push the augmented data to Hugging Face:
   ```
   POST http://localhost:8888/push_to_huggingface
   {
     "file_path": "augmented_data.parquet",
     "repo_id": "username/ml-dataset",
     "token": "your_huggingface_token"
   }
   ```

5. Create a memory in GravRAG:
   ```
   POST http://localhost:6369/api/memory/create
   {
     "content": "Created a machine learning dataset and pushed it to Hugging Face",
     "metadata": {
       "dataset_name": "ml-dataset",
       "source": "arxiv"
     }
   }
   ```

6. Recall the memory:
   ```
   GET http://localhost:6369/api/memory/recall?query=What datasets have I created?
   ```

This workflow demonstrates how you can use both APIs to collect, process, and store data, as well as create and recall memories related to your data processing tasks.