# backend

## Project Structure

```
cogenesis-backend/
├── .env
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── makeReadMe.py
├── PROJECT_DOCUMENTATION.md
├── PROJECT_DOCUMENTATIONV2.md
├── README.md
├── requirements.txt
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── gravrag.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   ├── models/
│   │   ├── gravrag.py
│   ├── services/
│   │   ├── gravrag.py
├── tests/
│   ├── test_gravrag.py
```

## File Contents and Implementation Guidelines

### `docker-compose.yml`

#### File Content:
```yaml

version: '3.9.11'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
      - QDRANT_HOST=qdrant
      - QDRANT_PORT=6333
    depends_on:
      - qdrant

  qdrant:
    image: qdrant/qdrant
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

volumes:
  qdrant_data:
```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions for the file 'docker-compose.yml':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `makeReadMe.py`

#### File Content:
```python
import os
import sys
import re
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def generate_tree(startpath):
    tree = []
    for root, dirs, files in os.walk(startpath):
        level = root.replace(startpath, '').count(os.sep)
        indent = '│   ' * (level - 1) + '├── ' if level > 0 else ''
        tree.append(f"{indent}{os.path.basename(root)}/")
        subindent = '│   ' * level + '├── '
        for f in files:
            tree.append(f"{subindent}{f}")
    return '\n'.join(tree)

def read_file_content(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
            logging.info(f"Successfully read file: {file_path}")
            return content
    except Exception as e:
        logging.error(f"Error reading file {file_path}: {str(e)}")
        return f"Error reading file: {str(e)}"

def extract_function_names(content):
    pattern = r'(async\s+)?function\s+(\w+)|const\s+(\w+)\s*=\s*(async\s*)?\('
    matches = re.findall(pattern, content)
    return [match[1] or match[2] for match in matches if match[1] or match[2]]

def generate_implementation_prompt(file_path, content):
    functions = extract_function_names(content)
    relative_path = os.path.relpath(file_path, start=os.getcwd())
    prompt = f"Implement the following functions for the file '{relative_path}':\n\n"
    for func in functions:
        prompt += f"- {func}\n"
    prompt += "\nEnsure that the implementation follows best practices and integrates with the existing project structure."
    return prompt

def get_file_language(file_extension):
    language_map = {
        '.js': 'javascript',
        '.ts': 'typescript',
        '.jsx': 'jsx',
        '.tsx': 'tsx',
        '.py': 'python',
        '.md': 'markdown',
        '.yml': 'yaml',
        '.env': 'plaintext'
    }
    return language_map.get(file_extension.lower(), 'plaintext')

def generate_readme(folder_path):
    project_name = os.path.basename(os.path.dirname(folder_path))
    readme_content = f"# {project_name}\n\n"
    readme_content += "## Project Structure\n\n```\n"
    readme_content += generate_tree(folder_path)
    readme_content += "\n```\n\n"
    readme_content += "## File Contents and Implementation Guidelines\n\n"

    for root, dirs, files in os.walk(folder_path):
        for file in files:
            file_extension = os.path.splitext(file)[1]
            if file_extension in ['.js', '.ts', '.jsx', '.tsx', '.py', '.env', '.md', '.yml']:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, folder_path)
                content = read_file_content(file_path)
                
                readme_content += f"### `{relative_path}`\n\n"
                readme_content += "#### File Content:\n"
                language = get_file_language(file_extension)
                readme_content += f"```{language}\n"
                readme_content += content
                readme_content += "\n```\n\n"
                
                readme_content += "#### Implementation Guidelines:\n"
                readme_content += "- Purpose: [Briefly describe the purpose of this file]\n"
                readme_content += "- Key Components/Functions:\n"
                for func in extract_function_names(content):
                    readme_content += f"  - `{func}`: [Describe the purpose and expected behavior]\n"
                readme_content += "- Integration Points: [Describe how this file integrates with other parts of the system]\n"
                readme_content += "- Data Flow: [Explain the data flow in and out of this file]\n"
                readme_content += "- Error Handling: [Describe any specific error handling requirements]\n\n"
                
                readme_content += "#### Implementation Prompt:\n"
                readme_content += "```\n"
                readme_content += generate_implementation_prompt(file_path, content)
                readme_content += "\n```\n\n"

    return readme_content

def main():
    if len(sys.argv) > 1:
        folder_path = sys.argv[1]
    else:
        folder_path = os.getcwd()

    if not os.path.isdir(folder_path):
        logging.error(f"Error: {folder_path} is not a valid directory")
        sys.exit(1)

    logging.info(f"Generating documentation for: {folder_path}")
    readme_content = generate_readme(folder_path)
    
    readme_path = os.path.join(folder_path, "PROJECT_DOCUMENTATION.md")
    try:
        with open(readme_path, 'w', encoding='utf-8') as readme_file:
            readme_file.write(readme_content)
        logging.info(f"PROJECT_DOCUMENTATION.md has been generated at {readme_path}")
    except Exception as e:
        logging.error(f"Error writing documentation file: {str(e)}")

if __name__ == "__main__":
    main()
```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions for the file 'makeReadMe.py':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `PROJECT_DOCUMENTATION.md`

#### File Content:
```markdown

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions for the file 'PROJECT_DOCUMENTATION.md':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `PROJECT_DOCUMENTATIONV2.md`

#### File Content:
```markdown
# Next.js 14 API and Agent Management System

## Project Structure

```
cogenesis-backend/
├── .env
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── makeReadMe.py
├── PROJECT_DOCUMENTATION.md
├── PROJECT_DOCUMENTATIONV2.md
├── README.md
├── requirements.txt
├── app/
│   ├── main.py
│   ├── api/
│   │   ├── gravrag.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   ├── models/
│   │   ├── gravrag.py
│   ├── services/
│   │   ├── gravrag.py
├── tests/
│   ├── test_gravrag.py
```

## File Contents and Implementation Guidelines

### `.env`

#### File Content:
```javascript

ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
QDRANT_HOST=qdrant
QDRANT_PORT=6333
```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions for the file '.env':


Ensure that the implementation follows Next.js 14 best practices and integrates with the existing project structure.
```

### `docker-compose.yml`

#### File Content:
```javascript

version: '3.9.11'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
      - QDRANT_HOST=qdrant
      - QDRANT_PORT=6333
    depends_on:
      - qdrant

  qdrant:
    image: qdrant/qdrant
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

volumes:
  qdrant_data:
```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions for the file 'docker-compose.yml':


Ensure that the implementation follows Next.js 14 best practices and integrates with the existing project structure.
```

### `PROJECT_DOCUMENTATION.md`

#### File Content:
```javascript

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions for the file 'PROJECT_DOCUMENTATION.md':


Ensure that the implementation follows Next.js 14 best practices and integrates with the existing project structure.
```

### `PROJECT_DOCUMENTATIONV2.md`

#### File Content:
```javascript

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions for the file 'PROJECT_DOCUMENTATIONV2.md':


Ensure that the implementation follows Next.js 14 best practices and integrates with the existing project structure.
```

### `README.md`

#### File Content:
```javascript

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions for the file 'README.md':


Ensure that the implementation follows Next.js 14 best practices and integrates with the existing project structure.
```


```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions for the file 'PROJECT_DOCUMENTATIONV2.md':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `README.md`

#### File Content:
```markdown

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions for the file 'README.md':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `app\main.py`

#### File Content:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_client import make_asgi_app

# Change this import statement
from api import gravrag

app = FastAPI(title="Cogenesis Backend API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Prometheus metrics
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# Include routers
app.include_router(gravrag.router, prefix="/gravrag", tags=["GravRag"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Cogenesis Backend API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions for the file 'app\main.py':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `app\api\gravrag.py`

#### File Content:
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging
from app.models.gravrag import MemoryManager

router = APIRouter()
logger = logging.getLogger(__name__)
memory_manager = MemoryManager()

class MemoryRequest(BaseModel):
    content: str
    metadata: Optional[Dict[str, Any]] = None

class RecallRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5

class PruneRequest(BaseModel):
    gravity_threshold: Optional[float] = 1e-5

class RecallWithMetadataRequest(BaseModel):
    query: str
    metadata: Dict[str, Any]
    top_k: Optional[int] = 10

class DeleteByMetadataRequest(BaseModel):
    metadata: Dict[str, Any]

@router.post("/create_memory")
async def create_memory(memory_request: MemoryRequest):
    if not memory_request.content.strip():
        logger.warning("Memory creation failed: Empty content.")
        raise HTTPException(status_code=400, detail="Content cannot be empty.")
    
    metadata = memory_request.metadata or {}
    try:
        logger.info(f"Creating memory: '{memory_request.content}' with metadata: {metadata}")
        await memory_manager.create_memory(content=memory_request.content, metadata=metadata)
        return {"message": "Memory created successfully"}
    except Exception as e:
        logger.error(f"Error during memory creation: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error creating memory: {str(e)}")

@router.post("/recall_memory")
async def recall_memory(recall_request: RecallRequest):
    if not recall_request.query.strip():
        logger.warning("Memory recall failed: Empty query.")
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    try:
        logger.info(f"Recalling memories for query: '{recall_request.query}' with top_k={recall_request.top_k}")
        memories = await memory_manager.recall_memory(query_content=recall_request.query, top_k=recall_request.top_k)
        if not memories:
            return {"message": "No relevant memories found"}
        return {"memories": memories}
    except Exception as e:
        logger.error(f"Error during memory recall: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error recalling memories: {str(e)}")

@router.post("/prune_memories")
async def prune_memories(prune_request: PruneRequest):
    try:
        await memory_manager.prune_memories()
        return {"message": "Memory pruning completed successfully"}
    except Exception as e:
        logger.error(f"Error during memory pruning: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error pruning memories: {str(e)}")

@router.post("/purge_memories")
async def purge_memories():
    try:
        await memory_manager.purge_all_memories()
        return {"message": "All memories have been purged successfully"}
    except Exception as e:
        logger.error(f"Error purging memories: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error purging memories: {str(e)}")

@router.post("/recall_with_metadata")
async def recall_with_metadata(recall_request: RecallWithMetadataRequest):
    """
    Recall memories that match query content and metadata criteria.
    """
    query = recall_request.query
    metadata = recall_request.metadata
    top_k = recall_request.top_k or 10

    if not query.strip():
        raise HTTPException(status_code=400, detail="Query content cannot be empty.")
    if not metadata:
        raise HTTPException(status_code=400, detail="Metadata cannot be empty.")

    try:
        memories = await memory_manager.recall_memory_with_metadata(query_content=query, search_metadata=metadata, top_k=top_k)
        
        if not memories or "memories" not in memories:
            return {"message": "No matching memories found"}
        
        return memories
    except Exception as e:
        logger.error(f"Error during metadata recall: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error recalling memories: {str(e)}")

@router.post("/delete_by_metadata")
async def delete_by_metadata(delete_request: DeleteByMetadataRequest):
    try:
        logger.info(f"Deleting memories with metadata: {delete_request.metadata}")
        await memory_manager.delete_memories_by_metadata(metadata=delete_request.metadata)
        return {"message": "Memory deletion by metadata completed successfully"}
    except Exception as e:
        logger.error(f"Error deleting memories by metadata: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error deleting memories: {str(e)}")

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions for the file 'app\api\gravrag.py':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `app\core\config.py`

#### File Content:
```python

from pydantic import BaseSettings

class Settings(BaseSettings):
    ANTHROPIC_API_KEY: str
    OPENAI_API_KEY: str
    GROQ_API_KEY: str
    QDRANT_HOST: str
    QDRANT_PORT: int
    JWT_SECRET_KEY: str = "your-secret-key"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions for the file 'app\core\config.py':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `app\core\security.py`

#### File Content:
```python

from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    return token_data
```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions for the file 'app\core\security.py':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `app\models\gravrag.py`

#### File Content:
```python

from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class MemoryPacket(BaseModel):
    vector: List[float]
    metadata: Dict[str, Any]

class MemoryRequest(BaseModel):
    content: str
    metadata: Optional[Dict[str, Any]] = None

class RecallRequest(BaseModel):
    query: str
    top_k: Optional[int] = 5

class PruneRequest(BaseModel):
    gravity_threshold: Optional[float] = 1e-5
```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions for the file 'app\models\gravrag.py':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `app\services\gravrag.py`

#### File Content:
```python

from app.core.config import settings
from app.models.gravrag import MemoryPacket
import time
import math
import uuid
import logging
from typing import List, Dict, Any, Optional
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sklearn.metrics.pairwise import cosine_similarity
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Gravitational constants and thresholds
GRAVITATIONAL_THRESHOLD = 1e-5  # This can be adjusted based on system requirements

class MemoryPacket:
    def __init__(self, vector: List[float], content: str, metadata: Dict[str, Any]):
        self.vector = vector  # Semantic vector (numeric representation)
        self.content = content  # Original content (human-readable text)
        self.metadata = metadata or {}

        # Metadata defaults
        self.metadata.setdefault("timestamp", time.time())
        self.metadata.setdefault("recall_count", 0)
        self.metadata.setdefault("memetic_similarity", self.calculate_memetic_similarity())
        self.metadata.setdefault("semantic_relativity", 1.0)
        self.metadata.setdefault("gravitational_pull", self.calculate_gravitational_pull())
        self.metadata.setdefault("spacetime_coordinate", self.calculate_spacetime_coordinate())

    def calculate_gravitational_pull(self) -> float:
        """
        Gravitational pull incorporates vector magnitude, recall count, memetic similarity, and semantic relativity.
        """
        vector_magnitude = math.sqrt(sum(x ** 2 for x in self.vector))
        recall_count = self.metadata["recall_count"]
        memetic_similarity = self.metadata["memetic_similarity"]
        semantic_relativity = self.metadata["semantic_relativity"]

        # Dynamically calculate gravitational pull
        gravitational_pull = vector_magnitude * (1 + math.log1p(recall_count)) * memetic_similarity * semantic_relativity
        self.metadata["gravitational_pull"] = gravitational_pull
        return gravitational_pull

    def calculate_spacetime_coordinate(self) -> float:
        """
        Spacetime coordinate is a decaying function of gravitational pull and time.
        """
        time_decay_factor = 1 + (time.time() - self.metadata.get("timestamp", time.time()))
        spacetime_coordinate = self.metadata["gravitational_pull"] / time_decay_factor
        self.metadata["spacetime_coordinate"] = spacetime_coordinate
        return spacetime_coordinate

    def update_relevance(self, query_vector: List[float]):
        """
        Update relevance when recalling a memory. This recalculates semantic relativity, memetic similarity,
        gravitational pull, and spacetime coordinate.
        """
        # Recalculate semantic similarity with the query vector (cosine similarity)
        self.metadata["semantic_relativity"] = self.calculate_cosine_similarity(self.vector, query_vector)

        # Recalculate memetic similarity based on dynamic contextual information
        self.metadata["memetic_similarity"] = self.calculate_memetic_similarity()

        # Update gravitational pull and spacetime coordinate
        self.calculate_gravitational_pull()
        self.calculate_spacetime_coordinate()

    def calculate_memetic_similarity(self) -> float:
        """
        Dynamically calculate memetic similarity based on tags, recurrence, or any other contextual factors.
        This example uses a simple Jaccard similarity between tags, but it can be extended with more complex logic.
        """
        if "tags" not in self.metadata:
            return 1.0  # Default if no tags are present

        # Example: Jaccard similarity between tags and reference tags
        tags = set(self.metadata.get("tags", []))
        reference_tags = set(self.metadata.get("reference_tags", []))  # Reference memory or system-level tags

        if not tags or not reference_tags:
            return 1.0  # No tags to compare, assume full similarity

        intersection = len(tags.intersection(reference_tags))
        union = len(tags.union(reference_tags))

        if union == 0:
            return 1.0  # Avoid division by zero

        return intersection / union  # Jaccard similarity as a placeholder for memetic similarity

    @staticmethod
    def calculate_cosine_similarity(vector_a: List[float], vector_b: List[float]) -> float:
        """ Calculate cosine similarity between two vectors. """
        dot_product = sum(a * b for a, b in zip(vector_a, vector_b))
        magnitude_a = math.sqrt(sum(a ** 2 for a in vector_a))
        magnitude_b = math.sqrt(sum(b ** 2 for b in vector_b))

        if magnitude_a == 0 or magnitude_b == 0:
            return 0.0  # Avoid division by zero

        return dot_product / (magnitude_a * magnitude_b)

    def to_payload(self) -> Dict[str, Any]:
        """
        Convert the memory packet to a Qdrant-compatible payload for storage.
        Store the vector and content separately.
        """
        return {
            "vector": self.vector,  # Correctly storing the vector here
            "content": self.content,  # Storing the original content here
            "metadata": self.metadata
        }

    @staticmethod
    def from_payload(payload: Dict[str, Any]):
        """ Recreate a MemoryPacket from a payload, ensuring 'content' is handled correctly. """
        vector = payload.get("vector")
        content = payload.get("content", "")  # Ensure content is present, or provide a default value
        metadata = payload.get("metadata", {})
        
        # Raise an error if vector is missing, as it is essential for MemoryPacket
        if not vector:
            raise ValueError("Vector data is missing in payload")
        
        return MemoryPacket(vector=vector, content=content, metadata=metadata)


class MemoryManager:
    def __init__(self, qdrant_host="localhost", qdrant_port=6333, collection_name="Mind"):
        self.qdrant_client = QdrantClient(host=qdrant_host, port=qdrant_port)
        self.collection_name = collection_name
        self.model = SentenceTransformer('all-MiniLM-L6-v2')  # Semantic vector model
        self._setup_collection()

    def _setup_collection(self):
        """
        Ensure that the Qdrant collection is set up for vectors with cosine distance.
        """
        try:
            self.qdrant_client.get_collection(self.collection_name)
            logger.info(f"Collection '{self.collection_name}' exists.")
        except Exception:
            logger.info(f"Creating collection '{self.collection_name}'.")
            self.qdrant_client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=self.model.get_sentence_embedding_dimension(), distance=Distance.COSINE)
            )

    async def create_memory(self, content: str, metadata: Dict[str, Any]):
        """
        Create a memory from content, vectorize it, and store in Qdrant asynchronously.
        """
        vector = self.model.encode(content).tolist()
        memory_packet = MemoryPacket(vector=vector, content=content, metadata=metadata)
        point_id = str(uuid.uuid4())
        
        # Insert the memory packet into the Qdrant collection
        self.qdrant_client.upsert(
            collection_name=self.collection_name,
            points=[PointStruct(id=point_id, vector=vector, payload=memory_packet.to_payload())]
        )
        logger.info(f"Memory created successfully with ID: {point_id}")

    async def recall_memory(self, query_content: str, top_k: int = 5):
        """ Recall a memory based on query content and return the original content along with metadata. """
        query_vector = self.model.encode(query_content).tolist()

        # Perform semantic search with Qdrant (using the query vector and top_k limit)
        results = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=top_k
        )

        # Recreate MemoryPacket objects from the search results
        memories = [MemoryPacket.from_payload(hit.payload) for hit in results]

        # Update relevance for each memory
        for memory in memories:
            memory.update_relevance(query_vector)

        # Rank memories based on combined relevance factors
        ranked_memories = sorted(
            memories,
            key=lambda mem: (
                mem.metadata['semantic_relativity'] * mem.metadata['memetic_similarity'] * mem.metadata['gravitational_pull']
            ),
            reverse=True
        )

        # Return original content and metadata for top K results
        return [{
            "content": memory.content,  # Return the original content
            "metadata": memory.metadata
        } for memory in ranked_memories[:top_k]]

    async def prune_memories(self):
        """
        Prune low relevance memories based on their gravitational pull and spacetime coordinates.
        """
        total_points = self.qdrant_client.count(self.collection_name).count
        if total_points > 1000000:  # Arbitrary limit
            points = self.qdrant_client.scroll(self.collection_name, limit=1000)
            low_relevance_points = [
                p.id for p in points if p.payload['metadata']['gravitational_pull'] < GRAVITATIONAL_THRESHOLD
            ]
            if low_relevance_points:
                self.qdrant_client.delete(self.collection_name, points_selector=low_relevance_points)
    
    async def purge_all_memories(self):
        """
        Deletes all memories from the Qdrant collection.
        """
        try:
            # Delete the entire collection (and all memories within it)
            self.qdrant_client.delete_collection(self.collection_name)
            
            # Re-create the collection after purging
            self._setup_collection()
            logger.info(f"Purged all memories in the collection '{self.collection_name}'.")
        except Exception as e:
            logger.error(f"Error purging all memories: {str(e)}")
            raise e

    async def recall_memory_with_metadata(self, query_content: str, search_metadata: Dict[str, Any], top_k: int = 10):
        """
        Recall memories based on query content, and further filter by matching metadata.
        """
        try:
            # Step 1: Vector search for the top K most relevant memories based on semantic similarity
            query_vector = self.model.encode(query_content).tolist()
            results = self.qdrant_client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                limit=top_k
            )

            # Step 2: Recreate MemoryPacket objects from the search results
            memories = [MemoryPacket.from_payload(hit.payload) for hit in results]

            # Step 3: Filter the top K results based on metadata
            matching_memories = []
            for memory in memories:
                memory_metadata = memory.metadata

                # Check if all search metadata keys/values match the memory metadata
                if all(memory_metadata.get(key) == value for key, value in search_metadata.items()):
                    matching_memories.append({
                        "content": memory.content,
                        "metadata": memory_metadata
                    })

            if not matching_memories:
                return {"message": "No matching memories found"}

            return {"memories": matching_memories}
        
        except Exception as e:
            logger.error(f"Error recalling memories by metadata: {str(e)}")
            raise e


    async def delete_memories_by_metadata(self, metadata: Dict[str, Any]):
        """
        Delete memories where the metadata matches the given metadata criteria.
        """
        try:
            # Scroll through all memories in the collection
            scroll_result = self.qdrant_client.scroll(self.collection_name, limit=1000)

            # Check if result is a list of points, otherwise handle it as a tuple
            if isinstance(scroll_result, tuple):
                points = scroll_result[0]
            else:
                points = scroll_result
            
            # List to store the IDs of memories to be deleted
            memories_to_delete = []
            
            for point in points:
                if isinstance(point, dict) and 'payload' in point:
                    point_metadata = point['payload']['metadata']
                    
                    # Check if the point's metadata matches the provided metadata
                    if all(point_metadata.get(key) == value for key, value in metadata.items()):
                        memories_to_delete.append(point["id"])
            
            # Delete the memories that match the metadata criteria
            if memories_to_delete:
                self.qdrant_client.delete(self.collection_name, points_selector=memories_to_delete)
                logger.info(f"Deleted {len(memories_to_delete)} memories matching the metadata.")
            else:
                logger.info("No memories found matching the specified metadata.")
        except Exception as e:
            logger.error(f"Error deleting memories by metadata: {str(e)}")
            raise e

memory_manager = MemoryManager()
```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
  - `of`: [Describe the purpose and expected behavior]
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions for the file 'app\services\gravrag.py':

- of

Ensure that the implementation follows best practices and integrates with the existing project structure.
```

### `tests\test_gravrag.py`

#### File Content:
```python
import pytest
from fastapi.testclient import TestClient
from app.main import app
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = TestClient(app)

@pytest.fixture
def mock_memory_manager(mocker):
    return mocker.patch('app.services.gravrag.MemoryManager')

# Test for creating a memory
def test_create_memory(mock_memory_manager):
    mock_memory_manager.return_value.create_memory.return_value = None

    payload = {
        "content": "This is a test memory",
        "metadata": {
            "objective_id": "obj_123",
            "task_id": "task_123",
            "tags": ["test", "example"]
        }
    }

    response = client.post("/gravrag/create_memory", json=payload)
    logger.info(f"Create Memory Response: {response.status_code}")
    assert response.status_code == 200
    assert response.json() == {"message": "Memory created successfully"}

# Test for creating another memory
def test_create_memory_2(mock_memory_manager):
    mock_memory_manager.return_value.create_memory.return_value = None

    payload = {
        "content": "This is another test memory",
        "metadata": {
            "objective_id": "obj_567",
            "task_id": "task_567",
            "tags": ["test", "example"]
        }
    }

    response = client.post("/gravrag/create_memory", json=payload)
    logger.info(f"Create Memory 2 Response: {response.status_code}")
    assert response.status_code == 200
    assert response.json() == {"message": "Memory created successfully"}

# Test for invalid memory creation
def test_create_invalid_memory(mock_memory_manager):
    payload = {"content": ""}  # Empty content

    response = client.post("/gravrag/create_memory", json=payload)
    logger.info(f"Create Invalid Memory Response: {response.status_code}")
    assert response.status_code == 400
    assert response.json() == {"detail": "Content cannot be empty."}

# Test for recalling memory
def test_recall_memory(mock_memory_manager):
    mock_memory_manager.return_value.recall_memory.return_value = [
        {
            "content": "This is a test memory",
            "metadata": {
                "objective_id": "obj_123",
                "task_id": "task_123",
                "tags": ["test", "example"],
                "gravitational_pull": 0.9,
                "memetic_similarity": 1.0,
                "semantic_relativity": 1.0,
                "timestamp": 1728026867
            }
        }
    ]

    payload = {"query": "test memory", "top_k": 3}
    response = client.post("/gravrag/recall_memory", json=payload)
    logger.info(f"Recall Memory Response: {response.status_code}")
    assert response.status_code == 200
    assert "memories" in response.json()

# Test for memory pruning
def test_prune_memories(mock_memory_manager):
    mock_memory_manager.return_value.prune_memories.return_value = None

    response = client.post("/gravrag/prune_memories", json={})
    logger.info(f"Prune Memories Response: {response.status_code}")
    assert response.status_code == 200
    assert response.json() == {"message": "Memory pruning completed successfully"}

# Test for memory recall using metadata
def test_recall_memory_with_metadata(mock_memory_manager):
    mock_memory_manager.return_value.recall_memory.return_value = [
        {
            "content": "This is a test memory",
            "metadata": {
                "objective_id": "obj_123",
                "task_id": "task_123",
                "tags": ["test", "example"],
                "gravitational_pull": 1.0,
                "memetic_similarity": 1.0,
                "semantic_relativity": 1.0,
                "timestamp": 1728026867
            }
        }
    ]

    payload = {
        "query": "test memory",
        "metadata": {"objective_id": "obj_123", "task_id": "task_123"},
        "top_k": 5
    }
    response = client.post("/gravrag/recall_with_metadata", json=payload)
    logger.info(f"Recall with Metadata Response: {response.status_code}")
    assert response.status_code == 200
    assert "memories" in response.json()

# Test for deleting memory by metadata
def test_delete_by_metadata(mock_memory_manager):
    mock_memory_manager.return_value.delete_memories_by_metadata.return_value = None

    payload = {"metadata": {"objective_id": "obj_123", "task_id": "task_123"}}
    response = client.post("/gravrag/delete_by_metadata", json=payload)
    logger.info(f"Delete by Metadata Response: {response.status_code}")
    assert response.status_code == 200
    assert response.json() == {"message": "Memory deletion by metadata completed successfully"}

# Test for purging all memories
def test_purge_memories(mock_memory_manager):
    mock_memory_manager.return_value.purge_all_memories.return_value = None

    response = client.post("/gravrag/purge_memories")
    logger.info(f"Purge Memories Response: {response.status_code}")
    assert response.status_code == 200
    assert response.json() == {"message": "All memories have been purged successfully"}

```

#### Implementation Guidelines:
- Purpose: [Briefly describe the purpose of this file]
- Key Components/Functions:
- Integration Points: [Describe how this file integrates with other parts of the system]
- Data Flow: [Explain the data flow in and out of this file]
- Error Handling: [Describe any specific error handling requirements]

#### Implementation Prompt:
```
Implement the following functions for the file 'tests\test_gravrag.py':


Ensure that the implementation follows best practices and integrates with the existing project structure.
```

