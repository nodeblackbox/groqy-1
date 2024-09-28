# API Documentation

Welcome to the comprehensive API documentation for our project. This guide provides detailed information on the available endpoints, including example payloads and usage examples in **cURL**, **JavaScript**, and **Python**. Whether you're a frontend developer, backend engineer, or just getting started, this documentation will help you integrate seamlessly with our APIs.

## Table of Contents

- [Neural Resources API](#neural-resources-api)
  - [route_query](#route_query)
  - [set_api_key](#set_api_key)
  - [available_models](#available_models)
  - [create_message](#create_message)
- [AgentChef API](#agentchef-api)
  - [collect_data](#collect_data)
  - [structure_data](#structure_data)
  - [augment_data](#augment_data)
  - [push_to_huggingface](#push_to-huggingface)
- [GravRAG API](#gravrag-api)
  - [create_memory](#create_memory)
  - [recall_memory](#recall_memory)
  - [prune_memories](#prune_memories)

---

## Neural Resources API

Base URL: `http://localhost:8000/neural_resources`

The Neural Resources API provides endpoints to interact with various neural network resources, manage API keys, and handle message creation.

### route_query

- **Endpoint:** `/route_query`
- **Method:** `POST`
- **Description:** Routes a query through the neural resources to get a response based on the provided content.

#### Request Payload

```json
{
  "content": "Hello, how are you?"
}
```

#### cURL Example

```bash
curl -X POST http://localhost:8000/neural_resources/route_query \
     -H "Content-Type: application/json" \
     -d '{"content": "Hello, how are you?"}'
```

#### JavaScript Example (using Fetch API)

```javascript
fetch('http://localhost:8000/neural_resources/route_query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ content: 'Hello, how are you?' })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### Python Example (using requests)

```python
import requests

url = "http://localhost:8000/neural_resources/route_query"
payload = {"content": "Hello, how are you?"}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

---

### set_api_key

- **Endpoint:** `/set_api_key`
- **Method:** `POST`
- **Description:** Sets the API key for a specified provider.

#### Request Payload

```json
{
  "provider": "openai",
  "api_key": "test_key"
}
```

#### cURL Example

```bash
curl -X POST http://localhost:8000/neural_resources/set_api_key \
     -H "Content-Type: application/json" \
     -d '{"provider": "openai", "api_key": "test_key"}'
```

#### JavaScript Example (using Fetch API)

```javascript
fetch('http://localhost:8000/neural_resources/set_api_key', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ provider: 'openai', api_key: 'test_key' })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### Python Example (using requests)

```python
import requests

url = "http://localhost:8000/neural_resources/set_api_key"
payload = {"provider": "openai", "api_key": "test_key"}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

---

### available_models

- **Endpoint:** `/available_models`
- **Method:** `GET`
- **Description:** Retrieves a list of available neural network models.

#### cURL Example

```bash
curl -X GET http://localhost:8000/neural_resources/available_models
```

#### JavaScript Example (using Fetch API)

```javascript
fetch('http://localhost:8000/neural_resources/available_models')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### Python Example (using requests)

```python
import requests

url = "http://localhost:8000/neural_resources/available_models"

response = requests.get(url)
print(response.json())
```

---

### create_message

- **Endpoint:** `/create_message/{provider}/{model}`
- **Method:** `POST`
- **Description:** Creates a message using the specified provider and model.

#### URL Parameters

- `provider`: The name of the provider (e.g., `openai`)
- `model`: The model name (e.g., `gpt-3.5-turbo`)

#### Request Payload

```json
{
  "content": "What is AI?"
}
```

#### cURL Example

```bash
curl -X POST http://localhost:8000/neural_resources/create_message/openai/gpt-3.5-turbo \
     -H "Content-Type: application/json" \
     -d '{"content": "What is AI?"}'
```

#### JavaScript Example (using Fetch API)

```javascript
const provider = 'openai';
const model = 'gpt-3.5-turbo';
const url = `http://localhost:8000/neural_resources/create_message/${provider}/${model}`;

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ content: 'What is AI?' })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### Python Example (using requests)

```python
import requests

provider = "openai"
model = "gpt-3.5-turbo"
url = f"http://localhost:8000/neural_resources/create_message/{provider}/{model}"
payload = {"content": "What is AI?"}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

---

## AgentChef API

Base URL: `http://localhost:8000/agentchef`

The AgentChef API facilitates data collection, structuring, augmentation, and integration with Hugging Face repositories.

### collect_data

- **Endpoint:** `/collect_data`
- **Method:** `POST`
- **Description:** Collects data from specified sources based on the query.

#### Request Payload

```json
{
  "source_type": "arxiv",
  "query": "machine learning",
  "max_results": 5
}
```

#### cURL Example

```bash
curl -X POST http://localhost:8000/agentchef/collect_data \
     -H "Content-Type: application/json" \
     -d '{"source_type": "arxiv", "query": "machine learning", "max_results": 5}'
```

#### JavaScript Example (using Fetch API)

```javascript
fetch('http://localhost:8000/agentchef/collect_data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    source_type: 'arxiv',
    query: 'machine learning',
    max_results: 5
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### Python Example (using requests)

```python
import requests

url = "http://localhost:8000/agentchef/collect_data"
payload = {
    "source_type": "arxiv",
    "query": "machine learning",
    "max_results": 5
}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

---

### structure_data

- **Endpoint:** `/structure_data`
- **Method:** `POST`
- **Description:** Structures raw data based on a specified template.

#### Request Payload

```json
{
  "data": [
    {
      "title": "Test",
      "content": "This is a test content"
    }
  ],
  "template_name": "instruction_input_output"
}
```

#### cURL Example

```bash
curl -X POST http://localhost:8000/agentchef/structure_data \
     -H "Content-Type: application/json" \
     -d '{"data": [{"title": "Test", "content": "This is a test content"}], "template_name": "instruction_input_output"}'
```

#### JavaScript Example (using Fetch API)

```javascript
fetch('http://localhost:8000/agentchef/structure_data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    data: [{ title: 'Test', content: 'This is a test content' }],
    template_name: 'instruction_input_output'
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### Python Example (using requests)

```python
import requests

url = "http://localhost:8000/agentchef/structure_data"
payload = {
    "data": [{"title": "Test", "content": "This is a test content"}],
    "template_name": "instruction_input_output"
}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

---

### augment_data

- **Endpoint:** `/augment_data`
- **Method:** `POST`
- **Description:** Augments structured data by generating additional samples.

#### Request Payload

```json
{
  "input_file": "structured_data.parquet",
  "num_samples": 3,
  "agent_name": "openai"
}
```

#### cURL Example

```bash
curl -X POST http://localhost:8000/agentchef/augment_data \
     -H "Content-Type: application/json" \
     -d '{"input_file": "structured_data.parquet", "num_samples": 3, "agent_name": "openai"}'
```

#### JavaScript Example (using Fetch API)

```javascript
fetch('http://localhost:8000/agentchef/augment_data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    input_file: 'structured_data.parquet',
    num_samples: 3,
    agent_name: 'openai'
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### Python Example (using requests)

```python
import requests

url = "http://localhost:8000/agentchef/augment_data"
payload = {
    "input_file": "structured_data.parquet",
    "num_samples": 3,
    "agent_name": "openai"
}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

---

### push_to_huggingface

- **Endpoint:** `/push_to_huggingface`
- **Method:** `POST`
- **Description:** Pushes augmented data to a Hugging Face repository.

#### Request Payload

```json
{
  "file_path": "augmented_data.parquet",
  "repo_id": "test/dataset",
  "token": "hf_test_token"
}
```

#### cURL Example

```bash
curl -X POST http://localhost:8000/agentchef/push_to_huggingface \
     -H "Content-Type: application/json" \
     -d '{"file_path": "augmented_data.parquet", "repo_id": "test/dataset", "token": "hf_test_token"}'
```

#### JavaScript Example (using Fetch API)

```javascript
fetch('http://localhost:8000/agentchef/push_to_huggingface', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    file_path: 'augmented_data.parquet',
    repo_id: 'test/dataset',
    token: 'hf_test_token'
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### Python Example (using requests)

```python
import requests

url = "http://localhost:8000/agentchef/push_to_huggingface"
payload = {
    "file_path": "augmented_data.parquet",
    "repo_id": "test/dataset",
    "token": "hf_test_token"
}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

---

## GravRAG API

Base URL: `http://localhost:8000/gravrag/api/memory`

The GravRAG API manages memory operations, including creation, recall, and pruning of memories.

### create_memory

- **Endpoint:** `/memory/create`
- **Method:** `POST`
- **Description:** Creates a new memory entry with associated metadata.

#### Request Payload

```json
{
  "content": "This is a test memory",
  "metadata": {
    "objective_id": "obj_1",
    "task_id": "task_1"
  }
}
```

#### cURL Example

```bash
curl -X POST http://localhost:8000/gravrag/api/memory/create \
     -H "Content-Type: application/json" \
     -d '{"content": "This is a test memory", "metadata": {"objective_id": "obj_1", "task_id": "task_1"}}'
```

#### JavaScript Example (using Fetch API)

```javascript
fetch('http://localhost:8000/gravrag/api/memory/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'This is a test memory',
    metadata: {
      objective_id: 'obj_1',
      task_id: 'task_1'
    }
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### Python Example (using requests)

```python
import requests

url = "http://localhost:8000/gravrag/api/memory/create"
payload = {
    "content": "This is a test memory",
    "metadata": {
        "objective_id": "obj_1",
        "task_id": "task_1"
    }
}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

---

### recall_memory

- **Endpoint:** `/memory/recall`
- **Method:** `GET`
- **Description:** Recalls memories based on a query.

#### Query Parameters

- `query`: The query string to search for relevant memories.

#### Example URL

```
http://localhost:8000/gravrag/api/memory/recall?query=test memory
```

#### cURL Example

```bash
curl -G http://localhost:8000/gravrag/api/memory/recall \
     --data-urlencode "query=test memory"
```

#### JavaScript Example (using Fetch API)

```javascript
const query = 'test memory';
const url = `http://localhost:8000/gravrag/api/memory/recall?query=${encodeURIComponent(query)}`;

fetch(url)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### Python Example (using requests)

```python
import requests

url = "http://localhost:8000/gravrag/api/memory/recall"
params = {"query": "test memory"}

response = requests.get(url, params=params)
print(response.json())
```

---

### prune_memories

- **Endpoint:** `/memory/prune`
- **Method:** `POST`
- **Description:** Prunes old or irrelevant memories to maintain optimal memory usage.

#### Request Payload

```json
{}
```

*Note: This endpoint may not require a payload. If it does, specify the parameters accordingly.*

#### cURL Example

```bash
curl -X POST http://localhost:8000/gravrag/api/memory/prune \
     -H "Content-Type: application/json" \
     -d '{}'
```

#### JavaScript Example (using Fetch API)

```javascript
fetch('http://localhost:8000/gravrag/api/memory/prune', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({})
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

#### Python Example (using requests)

```python
import requests

url = "http://localhost:8000/gravrag/api/memory/prune"
payload = {}
headers = {"Content-Type": "application/json"}

response = requests.post(url, json=payload, headers=headers)
print(response.json())
```

---

## Conclusion

This documentation provides a detailed overview of the available API endpoints, along with example payloads and usage snippets in various programming languages. For any further assistance or questions, please refer to our support channels or consult the API specifications.

---

**Happy Coding! 🚀**