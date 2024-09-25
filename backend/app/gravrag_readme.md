Here's a **Markdown README** file for **GravRAG**, explaining the system, setup, API usage, and relevant details for users and developers.

---

# GravRAG: Gravitational Relevance Augmented Memory System

GravRAG (Gravitational Relevance Augmented Memory) is a system designed to store and recall semantic memories using a combination of **semantic relativity**, **memetic similarity**, and **access frequency**. Memories are represented as vectors, with metadata dynamically calculated to determine their **gravitational pull** and **spacetime relevance** over time.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [API Usage](#api-usage)
  - [Create Memory](#create-memory)
  - [Recall Memory](#recall-memory)
  - [Delete Session Data](#delete-session-data)
  - [Optimize Index](#optimize-index)
- [Metadata Fields](#metadata-fields)
- [How Gravitational Pull Works](#how-gravitational-pull-works)
- [License](#license)

---

## Overview

GravRAG is a memory storage and recall system designed for AI systems to retrieve the most relevant information over time. It calculates the **gravitational pull** of memories based on how frequently they are accessed, how semantically similar they are to queries, and their **memetic** relationships to other memories.

### Key Concepts:

- **Gravitational Pull**: Determines the importance of a memory based on its recall frequency, memetic similarity, and semantic relevance.
- **Spacetime Coordinate**: Tracks memory relevance over time, allowing the system to decay older, less relevant memories.
- **Memetic Similarity**: Measures how closely related a memory is to others recalled together.

---

## Features

- **Vector-based Memory Storage**: Each memory is stored as a semantic vector.
- **Metadata-Driven Recall**: Metadata such as recall frequency, semantic relativity, and gravitational pull help determine the relevance of memories.
- **Dynamic Relevance Calculation**: Each memory's relevance is updated based on how frequently it is recalled and its relationship to other memories.
- **Optional Session Tracking**: Memories can be grouped by sessions, but session tracking is optional.

---

## Architecture

GravRAG is built using:
- **FastAPI** for API exposure.
- **Qdrant** for vector similarity search and memory storage.
- **SentenceTransformers** for vectorizing memory content.
- **Python** for the core system logic.

---

## Installation

### Prerequisites

- Python 3.8+
- Qdrant running locally or accessible via network.

### Clone the Repository

```bash
git clone https://github.com/yourusername/gravrag.git
cd gravrag
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Start the FastAPI Application

```bash
uvicorn api.gravrag_API:app --reload
```

This will start the API at `http://localhost:8000`.

---

## API Usage

### 1. **Create Memory**

**Endpoint**: `POST /api/memory/create`

**Payload Example**:

```json
{
  "vector": [0.1, 0.2, 0.3, 0.4],
  "metadata": {
    "session_id": "session123",
    "recall_count": 0,
    "memetic_similarity": 1.0,
    "semantic_relativity": 1.0,
    "gravitational_pull": 1.0,
    "spacetime_coordinate": 1.0,
    "timestamp": 1633024800,
    "objective_id": "objective_42",
    "discovery_id": "discovery_99",
    "iteration_id": "iteration_v3",
    "task_id": "task_123",
    "visual_data": null
  }
}
```

**Response**:
```json
{
  "message": "Memory created successfully"
}
```

### 2. **Recall Memory**

**Endpoint**: `GET /api/memory/recall`

**Query Example**:
```
/api/memory/recall?query_vector=[0.1,0.2,0.3,0.4]&session_id=session123&top_k=5
```

**Response**:
```json
{
  "results": [
    {
      "vector": [0.1, 0.2, 0.3, 0.4],
      "metadata": {
        "session_id": "session123",
        "recall_count": 5,
        "memetic_similarity": 0.85,
        "semantic_relativity": 0.9,
        "gravitational_pull": 3.8,
        "spacetime_coordinate": 2.7
      }
    }
  ]
}
```

### 3. **Delete Session Data**

**Endpoint**: `DELETE /api/memory/delete/{session_id}`

**Request Example**:
```
/api/memory/delete/session123
```

**Response**:
```json
{
  "message": "Memory for session session123 deleted successfully"
}
```

### 4. **Optimize Index**

**Endpoint**: `POST /api/optimize`

**No Payload Required**

**Response**:
```json
{
  "message": "Index optimized successfully"
}
```

---

## Metadata Fields

Each memory is stored as a vector and includes the following **metadata** fields:

1. **`session_id`** (Optional): The session to which the memory belongs.
2. **`recall_count`** (Default = 0): Tracks how many times the memory has been recalled.
3. **`memetic_similarity`** (Default = 1.0): Measures similarity to other memories that are often recalled together.
4. **`semantic_relativity`** (Default = 1.0): The semantic similarity to a query vector.
5. **`gravitational_pull`** (Default = 1.0): The overall "weight" of the memory, combining recall frequency, memetic similarity, and semantic relativity.
6. **`spacetime_coordinate`**: Relevance over time, decaying with older memories unless frequently recalled.
7. **`timestamp`**: Time the memory was created (or last updated), using UUIDv1 for a unique timestamp.
8. **Optional Fields**: You can add custom metadata like `objective_id`, `task_id`, `visual_data`, etc.

---

## How Gravitational Pull Works

The **gravitational pull** of a memory is calculated using:

- **Recall Count**: More frequent recalls increase gravitational pull.
- **Memetic Similarity**: Memories that are often recalled with others gain higher similarity scores.
- **Semantic Relativity**: How closely the memory's vector matches a query vector.

The formula for **gravitational pull** looks like this:

```python
gravitational_pull = vector_magnitude * (1 + recall_count / 10) * memetic_similarity * semantic_relativity
```

This value is updated each time the memory is recalled, ensuring the most relevant memories have the highest pull.

---

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

---

This README provides an overview of **GravRAG**, including the features, installation, and API usage. Let me know if you'd like any further adjustments!