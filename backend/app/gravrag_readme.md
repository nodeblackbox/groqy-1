I am unable to access the uploaded file directly. However, I will provide an updated **README** based on the current state of the **GravRAG** system as you have specified, integrating the functionality we've discussed.

---

## **GravRAG Memory System**
GravRAG (Gravitational Relativity Augmented Generation) is a memory system that dynamically calculates the relevance of memories based on **semantic relativity**, **memetic similarity**, and **recall frequency**. The system assigns **gravitational pull** and **spacetime coordinates** to memories to influence their significance over time.

---

### **Key Concepts**

1. **Gravitational Pull**:
   - **Gravitational pull** is calculated as a combination of the **semantic similarity** between memories, the **recall count**, and the **memetic similarity** of memories.
   - Higher gravitational pull makes memories more likely to be recalled in future queries.
   
2. **Spacetime Coordinates**:
   - **Spacetime coordinates** measure the relevance of memories over time.
   - Memories decay over time unless frequently recalled or semantically similar to new queries, ensuring that **important or frequently accessed memories** remain relevant.

3. **Memetic Similarity**:
   - Measures the **contextual relationship** between memories that are frequently co-recalled.
   - As memories are accessed together, their **memetic similarity** increases, dynamically altering their relevance in the system.

4. **Semantic Relativity**:
   - Measured using **cosine similarity** between the semantic vectors of two pieces of content.
   - **SentenceTransformer** is used to generate vectors that represent the semantic meaning of memories.

5. **Recall Count**:
   - Every time a memory is recalled, its **recall count** increases, boosting its **gravitational pull** and ensuring its relevance within the system grows.

---

### **System Features**

- **Automatic Vectorization**:
   - The system automatically generates **semantic vectors** for new memories using the **SentenceTransformer** model.
   
- **Gravitational Pull Calculation**:
   - Gravitational pull is calculated dynamically, incorporating **vector magnitude**, **recall frequency**, **memetic similarity**, and **semantic relativity**.

- **Spacetime Coordinate Decay**:
   - Memories' spacetime coordinates decay over time unless frequently accessed, simulating a real-world decay of relevance for old, unused memories.

- **Memory Pruning**:
   - Low relevance memories are pruned from the system based on their **gravitational pull** falling below a set threshold, ensuring efficient memory management.

---

### **How It Works**

1. **Creating a Memory**:
   - When a memory is created, its content is **vectorized** using **SentenceTransformer**.
   - Initial metadata such as **recall count**, **gravitational pull**, and **spacetime coordinate** is automatically generated and stored alongside the vector.

2. **Recalling a Memory**:
   - When a memory is recalled (queried), the system calculates the **cosine similarity** between the query and all existing memory vectors.
   - The system then adjusts the memory's **recall count**, **memetic similarity**, and **spacetime coordinate** based on the query interaction.

3. **Pruning Low Relevance Memories**:
   - Periodically, memories that fall below a specified **gravitational pull threshold** are automatically pruned from the system to maintain optimal performance.

---

### **API Endpoints**

The GravRAG system includes a simple, modular API that allows users to interact with the memory system.

#### **1. Create Memory**

- **Endpoint**: `/api/memory/create`
- **Method**: `POST`
- **Payload**:
    ```json
    {
      "content": "This is the memory content",
      "metadata": {
        "objective_id": "objective_1",
        "task_id": "task_1"
      }
    }
    ```
- **Description**: 
   - This endpoint creates a new memory in the system. The content is vectorized automatically, and any optional metadata can be passed.

#### **2. Recall Memory**

- **Endpoint**: `/api/memory/recall`
- **Method**: `GET`
- **Parameters**:
    - `query` (string): The content used to search for relevant memories.
    - `top_k` (integer): The number of most relevant memories to return (default: 5).
- **Example Call**:
    ```
    GET /api/memory/recall?query=What is GravRAG?&top_k=3
    ```
- **Description**:
   - Returns the top `k` most relevant memories based on the semantic similarity between the query and the stored memories.

#### **3. Prune Low Relevance Memories**

- **Endpoint**: `/api/memory/prune`
- **Method**: `POST`
- **Description**:
   - Triggers a cleanup process that removes low-relevance memories from the system.

---

### **Internal Calculations**

#### **Gravitational Pull**:

Gravitational pull is calculated based on the following formula:

```python
gravitational_pull = vector_magnitude * (1 + math.log1p(recall_count)) * memetic_similarity * semantic_relativity
```
- **Vector Magnitude**: The magnitude of the memory vector generated by SentenceTransformer.
- **Recall Count**: The number of times a memory has been recalled.
- **Memetic Similarity**: How closely a memory relates to other frequently co-recalled memories.
- **Semantic Relativity**: Cosine similarity between the memory vector and the query vector.

#### **Spacetime Coordinate**:

The spacetime coordinate is calculated as follows:

```python
spacetime_coordinate = gravitational_pull / (1 + (time.time() - timestamp))
```
- **Gravitational Pull**: As calculated above.
- **Timestamp**: The last time the memory was recalled or created.
- **Time Decay Factor**: Ensures that older memories lose relevance unless they are frequently recalled.

---

### **Error Handling**

- **Database Connectivity**:
   - The system automatically retries failed database connections and logs all errors in the process.

- **Vectorization Issues**:
   - If content cannot be vectorized, an error is logged and handled gracefully, ensuring system stability.

---

### **Technologies Used**

- **FastAPI**: For building and exposing the API.
- **Qdrant**: For vector-based semantic search and memory storage.
- **SentenceTransformer**: For generating semantic vectors based on memory content.
- **Python**: For the core implementation, leveraging libraries like `math` for calculations and `logging` for robust error handling.

---

### **Running the Project**

1. **Install Dependencies**:
   ```bash
   pip install fastapi uvicorn sentence-transformers qdrant-client
   ```

2. **Start the API**:
   ```bash
   uvicorn api:app --reload
   ```

3. **Using the API**:
   - Use any HTTP client (Postman, ThunderClient, curl) to send requests to the `/api/memory/create`, `/api/memory/recall`, and `/api/memory/prune` endpoints.

---

### **Future Enhancements**

- **Memetic Relationship Tracking**: In future versions, the system will track **cross-recall events** to dynamically boost memetic similarity.
- **Advanced Pruning Algorithms**: We plan to introduce more sophisticated memory pruning algorithms that adapt to large-scale memory usage patterns.

---

This **README** now reflects the current state and functionality of **GravRAG** with all the requested modifications and improvements integrated.