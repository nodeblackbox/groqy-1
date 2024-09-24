<!-- To integrate your Python-based FastAPI service with your JavaScript project, you need to set up communication between the frontend and the FastAPI backend. Here's a guide that will help you incorporate the FastAPI backend into your JavaScript project, focusing on handling API calls effectively.

### 1. **Project Structure**
Here's a recommended project structure for managing both your FastAPI backend and JavaScript frontend in a single project.

```bash
my_project/
├── backend/                    # Python (FastAPI) backend
│   ├── gravrag.py              # Main FastAPI app with memory creation/recall logic
│   ├── requirements.txt        # Backend dependencies
│   └── .env                    # Environment variables for the backend (optional)
├── frontend/                   # JavaScript (React, Vue, etc.) frontend
│   ├── src/                    # Frontend source code
│   │   ├── components/         # React/Vue components
│   │   │   └── MemoryComponent.js  # React component example
│   │   ├── services/           # Axios API service
│   │   │   └── apiService.js   # Contains functions for API calls
│   └── public/                 # Public static files
├── .gitignore                  # Ignored files for Git
└── docker-compose.yml          # Optional: Docker Compose for managing both services (optional)
```

### 2. **Running the FastAPI Backend**
Ensure your FastAPI backend (in the `backend/` directory) is up and running.

#### 2.1 Install Dependencies
Ensure that the required Python packages are installed. Add the necessary dependencies to `requirements.txt`:

```txt
fastapi
uvicorn
qdrant-client
sentence-transformers
cachetools
```

Install the dependencies using:

```bash
pip install -r requirements.txt
```

#### 2.2 Run the Backend
Start the FastAPI backend with Uvicorn:

```bash
uvicorn gravrag:app --reload
```

This will run the FastAPI service on `http://localhost:8000` by default.

### 3. **Integrating FastAPI with JavaScript Frontend**

#### 3.1 Install Axios for HTTP Requests
In your JavaScript frontend (React/Vue/etc.), you’ll need a way to make HTTP requests to your FastAPI backend. Use `Axios` for this:

```bash
npm install axios
```

#### 3.2 Create an API Service for Interacting with FastAPI
In your `frontend/src/services/` directory, create an `apiService.js` file that will contain all the methods for interacting with the FastAPI API.

##### Example `apiService.js`:

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Change this to match the FastAPI host/port if needed

// Function to create memory
export const createMemory = async (memoryData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/memory/create`, memoryData);
        return response.data;
    } catch (error) {
        console.error('Error creating memory:', error);
        throw error;
    }
};

// Function to recall memory
export const recallMemory = async (sessionId, query, topK = 5) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/memory/recall/${sessionId}`, {
            params: { query, top_k: topK }
        });
        return response.data;
    } catch (error) {
        console.error('Error recalling memory:', error);
        throw error;
    }
};

// Function to delete memory
export const deleteMemory = async (sessionId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/memory/delete/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting memory:', error);
        throw error;
    }
};

// Function to get context window
export const getContextWindow = async (sessionId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/memory/context/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching context window:', error);
        throw error;
    }
};
```

### 4. **Frontend Example: React Component for Memory Creation/Recall**

In your `frontend/src/components/` directory, create a `MemoryComponent.js` file that interacts with the `apiService.js` to handle memory creation and recall.

##### Example `MemoryComponent.js`:

```javascript
import React, { useState } from 'react';
import { createMemory, recallMemory } from '../services/apiService';

const MemoryComponent = () => {
    const [sessionId, setSessionId] = useState('session_12345'); // Example session ID
    const [content, setContent] = useState('');
    const [recalledMemories, setRecalledMemories] = useState([]);
    const [query, setQuery] = useState('');

    const handleCreateMemory = async () => {
        try {
            const memoryData = {
                session_id: sessionId,
                role: 'user',
                content: content,
                relevance_tags: ['tag1', 'tag2'],  // Example tags
                core_intent: 'test',
                is_basal_reference: false
            };
            await createMemory(memoryData);
            alert('Memory created successfully!');
        } catch (error) {
            console.error('Error creating memory:', error);
        }
    };

    const handleRecallMemory = async () => {
        try {
            const result = await recallMemory(sessionId, query);
            setRecalledMemories(result.results);
        } catch (error) {
            console.error('Error recalling memory:', error);
        }
    };

    return (
        <div>
            <h2>Create and Recall Memories</h2>

            <div>
                <h3>Create Memory</h3>
                <input 
                    type="text" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    placeholder="Memory content"
                />
                <button onClick={handleCreateMemory}>Create Memory</button>
            </div>

            <div>
                <h3>Recall Memory</h3>
                <input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="Query"
                />
                <button onClick={handleRecallMemory}>Recall Memory</button>
                <ul>
                    {recalledMemories.map((memory, index) => (
                        <li key={index}>
                            {memory.content} - {memory.role}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MemoryComponent;
```

### 5. **Handling CORS in FastAPI**
If your frontend is running on a different port (like `http://localhost:3000` for React), you need to handle Cross-Origin Resource Sharing (CORS) in FastAPI.

Install CORS middleware for FastAPI:

```bash
pip install fastapi[all] python-multipart
```

In your `gravrag.py`, add the CORS middleware:

```python
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set this to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 6. **Running Your Frontend**

Now that the backend is running, you can start the frontend. Ensure `apiService.js` points to the correct backend URL (`http://localhost:8000` by default).

```bash
npm start  # Start your frontend (React/Vue/etc.)
```

With this setup, your frontend is now fully integrated with your FastAPI backend. The JavaScript frontend interacts with the backend APIs (for memory creation, recall, etc.), and you can extend this with more features as needed.

### Optional: **Dockerizing the Setup**

If you want to manage both services using Docker, you can set up a `docker-compose.yml` file to build and run both FastAPI and the frontend in containers.

---

This integration guide provides a clean, maintainable structure for connecting a FastAPI-based Python backend to a JavaScript (React, Vue, etc.) frontend, enabling seamless API interaction. -->