# GravRAG: Gravitational **Retrieval-Augmented Generation (RAG)** System

## Overview

**GravRAG** is an enhanced **Retrieval-Augmented Generation (RAG)** system, incorporating advanced memory management features through **gravitational pull**-based ranking and **metadata integration**. It enhances traditional RAG systems by introducing concepts like **semantic relativity**, **memetic similarity**, and **spacetime decay**, all of which contribute to a more contextually aware and long-term efficient memory recall system.

GravRAG optimizes **retrieval** of information by balancing the relevance of past memories (data) with their dynamic importance in the current context, offering enhanced **generation** of outputs using the most relevant information.

## Key Features

1. **Dual Retrieval Mechanism**:
   - **Semantic Search**: Memories are vectorized using a **sentence transformer model** and can be recalled via free-text queries based on **semantic similarity**.
   - **Metadata Search**: Memories are tagged with **rich metadata** (e.g., `user_id`, `task_id`, `project_id`) and can be recalled directly through metadata filtering.

2. **Gravitational Pull Ranking**:
   - Memories are ranked not only by their semantic similarity but also by their **gravitational pull**, which is dynamically calculated based on memory relevance, frequency of use, and recency.

3. **Spacetime Decay**:
   - Older memories gradually lose importance over time unless frequently recalled, ensuring that irrelevant or outdated information naturally decays, optimizing performance in the long term.

4. **Efficient Memory Management**:
   - GravRAG offers **pruning** of low-relevance memories and **purging** capabilities to maintain system efficiency. These memory management tools prevent the system from being bogged down by stale data.

5. **Enhanced Recall for Generation**:
   - When used in a **generation system** (like a GPT or other language model), GravRAG ensures that the generated responses are supported by the most relevant and contextually significant data, improving the overall quality and reliability of generated outputs.

## How GravRAG Works

### 1. **Memory Creation**:
   - When new data (memories) is created, it's stored in vectorized form using semantic embeddings. These memories are enriched with **metadata** (tags, timestamps, etc.) for later filtering or recall. 

### 2. **Memory Recall**:
   - **Semantic Recall**: The user can provide a **free-text query**, which is matched against the stored memories based on their **vectorized semantic similarity**.
   - **Metadata Recall**: Alternatively, users can recall memories based on structured **metadata filters**, such as retrieving all memories tagged to a specific project or user.

### 3. **Gravitational Pull & Ranking**:
   - Memories are dynamically ranked based on their **gravitational pull**, which combines factors like **semantic similarity**, **frequency of recall**, and **relevance to the current context**.
   - This ensures that the most important and contextually appropriate memories are prioritized during recall, especially in **generation tasks** where relevance directly impacts output quality.

### 4. **Decay and Pruning**:
   - Memories are assigned a **spacetime coordinate**, representing their relevance decay over time. Memories that are not frequently recalled gradually lose their gravitational pull and can be **pruned** (removed) when they fall below a certain threshold of importance.

## Benefits Over Traditional RAG Systems

GravRAG addresses some of the limitations found in traditional Retrieval-Augmented Generation systems:

### 1. **Dynamic Memory Relevance**:
   - Traditional RAG systems rely solely on **static vector-based retrieval**, which doesn't take into account how **relevant** or **frequently accessed** a memory might be.
   - GravRAG, by contrast, dynamically recalculates a memory's **gravitational pull**, ensuring that **frequently used** and **important memories** remain prioritized.

### 2. **Structured Metadata Retrieval**:
   - While many RAG systems are limited to semantic search, GravRAG integrates **metadata-based recall**, allowing for more structured and **targeted retrieval** of specific memories. This is especially useful in use cases where organizational structure (e.g., tasks, projects, user activity) needs to be referenced directly.

### 3. **Efficient Long-Term Memory Management**:
   - Over time, traditional RAG systems can become overloaded with **stale data**, impacting both performance and recall accuracy. GravRAG addresses this with a **spacetime decay model**, ensuring that memories naturally decay unless they remain contextually significant.
   - **Pruning** and **purging** tools ensure that the system remains clean and performant even as memory usage grows.

### 4. **Improved Output Quality for Generation Tasks**:
   - By incorporating **dynamic relevance factors** (e.g., gravitational pull), GravRAG ensures that only the **most relevant data** is used during generation tasks. This enhances the quality, accuracy, and contextual alignment of generated content.

## How GravRAG Benefits End Users

### 1. **Faster and More Relevant Information Retrieval**:
   - Users can find information quickly using **free-text search**, or through **targeted metadata queries**, without the burden of navigating through stale or irrelevant data.
   - Memories related to recent or frequently accessed data are ranked higher, improving the speed and relevance of retrieval.

### 2. **Personalized and Context-Aware Generation**:
   - When used with **language models** or other AI-generation tools, GravRAG ensures that outputs are generated from the most **contextually appropriate data**, improving the quality of the generated content.
   - This makes it ideal for **chatbots**, **AI assistants**, and other **interactive systems** where context and relevance are paramount.

### 3. **Scalable and Long-Term Efficiency**:
   - For teams or enterprises managing **large datasets**, GravRAG's pruning and decaying memory model ensures that the system doesn't slow down or produce irrelevant results over time, making it highly scalable for **long-term projects**.

## Use Cases

### 1. **AI-Powered Assistants**:
   - GravRAG can power **intelligent assistants** that provide context-aware responses, drawing from a combination of recent and important memories, whether the assistant is helping with scheduling, project management, or other tasks.
   
### 2. **Knowledge Base Management**:
   - Organizations that rely on **knowledge bases** can use GravRAG to retrieve the most relevant documents or information. By integrating **metadata** and **semantic search**, GravRAG ensures that users always find the most pertinent information without wading through outdated or irrelevant entries.

### 3. **Long-Term Project Management**:
   - Teams working on long-term projects can use GravRAG to efficiently recall memories tied to specific tasks, objectives, or users, while also benefiting from the system's ability to decay older, irrelevant information over time.

### 4. **Content Generation Systems**:
   - For applications requiring **contextual text generation** (e.g., blogs, emails, product descriptions), GravRAG can be integrated with **GPT-style models** to ensure that content is generated based on the most contextually significant data.

## Example API Payloads

### 1. **Create Memory**
- **Endpoint**: `/gravrag/create_memory`
- **Example Payload**:
  ```json
  {
    "content": "User completed the onboarding task for Project X",
    "metadata": {
      "objective_id": "project_x",
      "task_id": "onboarding_task",
      "tags": ["user_interaction", "onboarding", "project_x"],
      "user_id": "user_123",
      "timestamp": "2024-10-06T15:45:00Z"
    }
  }
  ```
  - **Utility**: This memory might be related to a user's interaction with a project task. It's stored both with **semantic data** (the content) and **metadata** (tags, project identifiers).

### 2. **Recall Memory (Semantic Search)**
- **Endpoint**: `/gravrag/recall_memory`
- **Example Payload**:
  ```json
  {
    "query": "onboarding task completion",
    "top_k": 5
  }
  ```
  - **Utility**: This performs a **semantic search** to retrieve the top 5 memories most similar to the query. Useful for general memory recall.

### 3. **Recall Memory (Metadata Search)**
- **Endpoint**: `/gravrag/recall_with_metadata`
- **Example Payload**:
  ```json
  {
    "metadata": {
      "objective_id": "project_x",
      "user_id": "user_123"
    }
  }
  ```
  - **Utility**: This query searches for memories based on **metadata filters**, retrieving all memories related to **user_123** and **project_x**.

### 4. **Prune Memories**
- **Endpoint**: `/gravrag/prune_memories`
- **Example Payload**:
  ```json
  {}
  ```
  - **Utility**: This prunes low-relevance memories that have decayed over time or have insufficient gravitational pull. Helps keep the system efficient by removing irrelevant data.

### 5. **Delete Memory by Metadata**
- **Endpoint**: `/gravrag/delete_by_metadata`
- **Example Payload**:
  ```json
  {
    "metadata": {
      "objective_id": "project_x"
    }
  }
  ```
  - **Utility**: This deletes memories tied to a specific **objective** or task, ideal for project transitions or data cleanups.

### 6. **Purge All Memories**
- **Endpoint**: `/gravrag/purge_memories`
- **

Example Payload**:
  ```json
  {}
  ```
  - **Utility**: This performs a **complete system reset**, purging all stored memories. Useful in testing environments or when preparing the system for new data.

## Conclusion

GravRAG offers a significant leap over traditional RAG solutions by introducing **dynamic relevance ranking**, **metadata-based filtering**, and **long-term efficiency** through memory decay. Whether it's for **AI assistants**, **knowledge management**, or **generation systems**, GravRAG ensures that only the most **contextually relevant** and **high-utility** memories are utilized, making it an essential tool for modern, data-driven applications.