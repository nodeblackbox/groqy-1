# **Gravitational Retrieval Augmented Generation (GravRAG)**

This README provides an in-depth explanation of the **Gravitational Retrieval Augmented Generation (GravRAG)** system. GravRAG is a powerful AI system designed to store, recall, and prune memories using gravitational concepts applied to semantic vectors, for enhanced retrieval-augmented generation. It integrates Qdrant for vector storage and retrieval, and utilizes Sentence Transformers to embed text into high-dimensional vectors for semantic similarity.

## **Core Concepts of GravRAG**

### 1. **Gravitational Pull in Memory Management**
Gravitational pull is the central concept in GravRAG that quantifies the importance of each memory. It is determined by several factors:
- **Vector Magnitude**: The strength of the memory based on its semantic representation.
- **Recall Count**: The frequency at which the memory has been retrieved.
- **Memetic Similarity**: The relevance of the memory based on context, recurrence, and shared tags with reference memories.
- **Semantic Relativity**: The similarity between the stored memory and the incoming query.

These factors together create a dynamic system where memories with higher gravitational pull have a higher likelihood of being recalled.

### 2. **Spacetime Coordinate**
Spacetime coordinate is a decaying function that incorporates both **gravitational pull** and **time**. The longer a memory goes unaccessed, the more its relevance decays, mimicking the concept of gravitational decay over time. This concept ensures that outdated memories become less prominent in the recall process unless frequently accessed.

### 3. **Memetic Similarity**
Memetic similarity is calculated dynamically to represent the contextual alignment of a memory with respect to the query or other reference memories. The concept relies on tags and shared attributes to assess how relevant a memory is in the broader context. It supports context-aware recall, making memories more valuable when they are related to current events or topics.

### 4. **Semantic Relativity**
Semantic relativity measures the closeness of a query to a stored memory in vector space. Cosine similarity is used to compute how semantically similar the two are. The higher the similarity, the more relevant the memory is for the query.

### 5. **Dynamic Memory Pruning**
GravRAG ensures the memory store does not become cluttered by **pruning** low-relevance memories. Memories with low gravitational pull and low spacetime coordinates are periodically removed to maintain a relevant and efficient knowledge base.

---

## **How GravRAG Works**

### 1. **Memory Creation**
When a new memory is created, GravRAG:
- **Embeds the content** using a Sentence Transformer to convert it into a high-dimensional semantic vector.
- **Calculates gravitational pull**, **memetic similarity**, and **spacetime coordinates** based on content and metadata.
- **Stores the memory** in a Qdrant collection for efficient vector-based retrieval.

**Steps in Detail**:
1. **Vectorize Content**: The content is passed through the Sentence Transformer model to generate its vector.
2. **Metadata Enrichment**: The metadata includes information such as timestamp, tags, recall count, and initial similarity measures.
3. **Gravitational Calculations**: Gravitational pull, spacetime coordinates, and memetic similarity are computed to quantify the significance of the memory.

### 2. **Memory Recall**
GravRAG retrieves the most relevant memories based on a query. The process involves:
1. **Vectorizing the Query**: The query text is transformed into a semantic vector using the same Sentence Transformer.
2. **Searching the Memory Store**: A semantic search is conducted in the Qdrant vector store to find the memories most similar to the query.
3. **Updating Relevance**: The retrieved memories’ gravitational pull, semantic relativity, and memetic similarity are updated based on the query.
4. **Returning Results**: The most relevant memories are returned to the user, sorted by their gravitational pull and spacetime coordinate.

**Steps in Detail**:
1. **Query Vectorization**: The input query is embedded into a vector.
2. **Vector Search**: Qdrant performs a nearest-neighbor search to find memories with the closest vectors.
3. **Relevance Update**: For each recalled memory, semantic relativity and gravitational pull are updated to reflect its current relevance to the query.

### 3. **Memory Pruning**
Over time, memories that are no longer relevant (low gravitational pull and low spacetime coordinate) are pruned to keep the memory store optimized. This prevents stale memories from overwhelming the system and ensures efficient retrieval.

---

## **GravRAG's Gravitational Calculations**

### **Gravitational Pull Formula**
The gravitational pull is computed as:

\[
\text{Gravitational Pull} = \text{Vector Magnitude} \times (1 + \log(1 + \text{Recall Count})) \times \text{Memetic Similarity} \times \text{Semantic Relativity}
\]

Where:
- **Vector Magnitude**: The strength of the memory’s vector.
- **Recall Count**: The number of times the memory has been accessed.
- **Memetic Similarity**: The contextual similarity between the memory and reference points (tags, themes).
- **Semantic Relativity**: The similarity between the query vector and the memory vector.

### **Spacetime Coordinate**
The spacetime coordinate decays over time based on gravitational pull:

\[
\text{Spacetime Coordinate} = \frac{\text{Gravitational Pull}}{1 + (\text{Current Time} - \text{Timestamp})}
\]

---

## **GravRAG Usage**

### **1. Memory Creation**

```python
await memory_manager.create_memory(
    content="This is a memory about machine learning.",
    metadata={
        "session_id": "session1",
        "tags": ["AI", "ML", "research"],
        "objective_id": "obj_1",
        "task_id": "task_1"
    }
)
```

### **2. Memory Recall**

```python
results = await memory_manager.recall_memory(query_content="What is machine learning?", top_k=5)
```

### **3. Memory Pruning**

```python
await memory_manager.prune_memories()
```

---

## **GravRAG Architecture Overview**

### **1. MemoryPacket Class**
- Responsible for encapsulating each memory.
- Handles vector storage, metadata management, and the calculation of key metrics like gravitational pull and spacetime coordinate.

### **2. MemoryManager Class**
- Manages the interaction with the Qdrant vector store.
- Handles memory creation, recall, and pruning processes.
- Responsible for ensuring the integrity of the memory store and efficiently managing storage and retrieval.

---

## **GravRAG and Qdrant**

GravRAG utilizes **Qdrant**, a powerful vector database, to store and retrieve high-dimensional semantic vectors. It relies on **Qdrant’s nearest-neighbor search** capabilities to efficiently find the most relevant memories for a given query.

### **Why Qdrant?**
- **High Performance**: Qdrant supports fast and scalable vector searches.
- **Cosine Distance**: Qdrant enables cosine similarity searches, which is ideal for text embeddings.
- **Flexible Schema**: Qdrant’s flexible schema allows for easy storage of both vectors and associated metadata.

---

## **Installation and Setup**

### **Requirements**
- Python 3.7+
- Qdrant Server (or cloud-hosted Qdrant)
- Sentence Transformer Model (`all-MiniLM-L6-v2`)

### **Installation**
1. Install Qdrant client and dependencies:
    ```bash
    pip install qdrant-client sentence-transformers
    ```

2. Install and run Qdrant:
    - [Qdrant Quickstart Guide](https://qdrant.tech/documentation/quickstart/)

3. Set up your environment variables for Qdrant connection:
    ```bash
    export QDRANT_HOST="localhost"
    export QDRANT_PORT="6333"
    ```

---

## **Example Usage in Production**

### Memory Creation:

```python
await memory_manager.create_memory(
    content="What is Quantum Computing?",
    metadata={
        "tags": ["quantum", "computing", "AI"],
        "session_id": "session_xyz"
    }
)
```

### Memory Recall:

```python
results = await memory_manager.recall_memory(
    query_content="Tell me about AI and Quantum Computing.",
    top_k=5
)
```

### Pruning Outdated Memories:

```python
await memory_manager.prune_memories()
```

---

## **Conclusion**

GravRAG enhances memory management by integrating **gravitational concepts** with **retrieval-augmented generation (RAG)** techniques, ensuring that relevant memories are always prioritized based on their importance and relevance. This makes it an essential tool for complex AI systems that need to manage and recall large quantities of knowledge efficiently.