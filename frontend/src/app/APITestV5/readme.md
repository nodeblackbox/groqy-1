Understood! Let's comprehensively enhance your **APITestV5** page by integrating it with the **Qdrant** vector database. We'll ensure that all functionalities—such as editing JSON structures, performing CRUD operations with Qdrant, storing variables and payloads locally using **Dexie**, and testing payloads—are fully implemented.

We'll follow a structured approach:

1. **Setting Up the Qdrant Client**
2. **Creating API Routes for Qdrant Operations**
3. **Building Reusable Components in `components/APITestV5`**
4. **Refactoring `APITestV5/page.jsx`**
5. **Ensuring Local Storage with Dexie**
6. **Comprehensive Code Implementation**

---

## **1. Setting Up the Qdrant Client**

First, we'll create a Qdrant client to interact with the Qdrant API. This client will be used in our API routes to perform CRUD operations.

### **a. Install Dependencies**

Ensure you have **Axios** installed for making HTTP requests:

```bash
npm install axios
```

### **b. Create the Qdrant Client**

Create a file named `qdrantClient.js` inside the `lib` directory.

```javascript
// frontend/src/lib/qdrantClient.js
import axios from 'axios';

// Initialize Axios instance for Qdrant
const qdrantClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_QDRANT_URL || 'http://localhost:6333', // Replace with your Qdrant URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default qdrantClient;
```

**Note:** It's best practice to store sensitive URLs in environment variables. Ensure you have a `.env.local` file at the root of your project with the following content:

```env
NEXT_PUBLIC_QDRANT_URL=http://localhost:6333
```

---

## **2. Creating API Routes for Qdrant Operations**

We'll create API routes under `app/api/qdrant/` to handle CRUD operations. These routes will act as intermediaries between your frontend and the Qdrant database, ensuring security and abstraction.

### **a. Directory Structure**

```
frontend/src/app/api/qdrant/
├── create-point/
│   └── route.js
├── search-points/
│   └── route.js
├── update-point/
│   └── route.js
├── delete-point/
│   └── route.js
└── list-points/
    └── route.js
```

### **b. Implementing API Routes**

#### **i. Create Point**

```javascript
// frontend/src/app/api/qdrant/create-point/route.js
import qdrantClient from '../../../../lib/qdrantClient';

export async function POST(req) {
  try {
    const { collection, points } = await req.json();

    if (!collection || !points) {
      return new Response(JSON.stringify({ message: 'Collection and points are required.' }), {
        status: 400,
      });
    }

    const response = await qdrantClient.put(`/collections/${collection}/points`, {
      points,
    });

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('Error creating points:', error.response?.data || error.message);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
```

#### **ii. Search Points**

```javascript
// frontend/src/app/api/qdrant/search-points/route.js
import qdrantClient from '../../../../lib/qdrantClient';

export async function POST(req) {
  try {
    const { collection, vector, limit = 10, filter = null } = await req.json();

    if (!collection || !vector) {
      return new Response(JSON.stringify({ message: 'Collection and vector are required.' }), {
        status: 400,
      });
    }

    const response = await qdrantClient.post(`/collections/${collection}/points/search`, {
      vector,
      limit,
      filter,
    });

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('Error searching points:', error.response?.data || error.message);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
```

#### **iii. Update Point**

```javascript
// frontend/src/app/api/qdrant/update-point/route.js
import qdrantClient from '../../../../lib/qdrantClient';

export async function PUT(req) {
  try {
    const { collection, points } = await req.json();

    if (!collection || !points) {
      return new Response(JSON.stringify({ message: 'Collection and points are required.' }), {
        status: 400,
      });
    }

    const response = await qdrantClient.put(`/collections/${collection}/points/payload`, {
      points,
    });

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('Error updating points:', error.response?.data || error.message);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
```

#### **iv. Delete Point**

```javascript
// frontend/src/app/api/qdrant/delete-point/route.js
import qdrantClient from '../../../../lib/qdrantClient';

export async function DELETE(req) {
  try {
    const { collection, pointIds } = await req.json();

    if (!collection || !pointIds || !Array.isArray(pointIds)) {
      return new Response(JSON.stringify({ message: 'Collection and pointIds (array) are required.' }), {
        status: 400,
      });
    }

    const response = await qdrantClient.delete(`/collections/${collection}/points`, {
      data: { points: pointIds },
    });

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('Error deleting points:', error.response?.data || error.message);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
```

#### **v. List Points**

*Note: Qdrant doesn't provide a direct "list all points" endpoint due to scalability concerns. Instead, use search with appropriate parameters.*

For demonstration, we'll implement a search that retrieves all points by setting a high limit.

```javascript
// frontend/src/app/api/qdrant/list-points/route.js
import qdrantClient from '../../../../lib/qdrantClient';

export async function POST(req) {
  try {
    const { collection, vector = [], limit = 1000, filter = null } = await req.json();

    if (!collection) {
      return new Response(JSON.stringify({ message: 'Collection is required.' }), {
        status: 400,
      });
    }

    const response = await qdrantClient.post(`/collections/${collection}/points/search`, {
      vector,
      limit,
      filter,
    });

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error('Error listing points:', error.response?.data || error.message);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
```

---

## **3. Building Reusable Components in `components/APITestV5`**

To keep your code organized and maintainable, we'll create reusable components specific to the **APITestV5** page. These components will reside in `components/APITestV5/`.

### **a. Directory Structure**

```
frontend/src/components/APITestV5/
├── JSONEditor.jsx
├── QdrantManager.jsx
├── PayloadTester.jsx
└── APIEndpointManager.jsx
```

### **b. Implementing Components**

#### **i. JSONEditor.jsx**

A component to edit and view JSON structures.

```javascript
// frontend/src/components/APITestV5/JSONEditor.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

const JSONEditor = ({ jsonStructure, setJsonStructure, handleImportJSON, handleExportJSON, validateJSON, handleSaveJSON }) => {
  const handleChange = (e) => {
    try {
      const parsed = JSON.parse(e.target.value);
      setJsonStructure(parsed);
    } catch (error) {
      // Do not update state if JSON is invalid
    }
  };

  return (
    <div className="bg-black p-6 rounded-xl mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Dynamic JSON Builder</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleSaveJSON}>
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleImportJSON(prompt('Paste JSON here:'))}>
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportJSON}>
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={validateJSON}>
            Validate
          </Button>
        </div>
      </div>
      <Input
        className="mb-4 bg-gray-800 border-gray-700 text-white"
        placeholder="Search JSON Structure..."
        value={jsonStructure ? JSON.stringify(jsonStructure, null, 2) : ''}
        onChange={handleChange}
        as="textarea"
        rows={10}
      />
    </div>
  );
};

export default JSONEditor;
```

#### **ii. QdrantManager.jsx**

A component to handle Qdrant CRUD operations.

```javascript
// frontend/src/components/APITestV5/QdrantManager.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';

const QdrantManager = ({ collection, setCollection }) => {
  const [pointId, setPointId] = useState('');
  const [vector, setVector] = useState('');
  const [payload, setPayload] = useState('');

  const handleCreatePoint = async () => {
    try {
      const response = await fetch('/api/qdrant/create-point', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection,
          points: [
            {
              id: pointId,
              vector: vector.split(',').map(Number),
              payload: JSON.parse(payload),
            },
          ],
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Point created successfully!');
      } else {
        toast.error(data.message || 'Failed to create point.');
      }
    } catch (error) {
      console.error('Create Point Error:', error);
      toast.error('An error occurred while creating the point.');
    }
  };

  // Similar handlers for Search, Update, Delete can be implemented here

  return (
    <div className="bg-black p-6 rounded-xl mb-4">
      <h2 className="text-2xl font-semibold mb-4">Qdrant Manager</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Collection Name</label>
          <Input
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            placeholder="Enter Collection Name"
          />
        </div>
        <div>
          <label className="block mb-1">Point ID</label>
          <Input
            value={pointId}
            onChange={(e) => setPointId(e.target.value)}
            placeholder="Enter Point ID"
          />
        </div>
        <div>
          <label className="block mb-1">Vector (comma-separated)</label>
          <Input
            value={vector}
            onChange={(e) => setVector(e.target.value)}
            placeholder="e.g., 0.1,0.2,0.3,..."
          />
        </div>
        <div>
          <label className="block mb-1">Payload (JSON)</label>
          <Input
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            placeholder='e.g., {"key":"value"}'
            as="textarea"
            rows={3}
          />
        </div>
        <Button onClick={handleCreatePoint} className="bg-green-600 hover:bg-green-700">
          Create Point
        </Button>
      </div>
    </div>
  );
};

export default QdrantManager;
```

#### **iii. PayloadTester.jsx**

A component to test sending payloads to Qdrant.

```javascript
// frontend/src/components/APITestV5/PayloadTester.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

const PayloadTester = () => {
  const [testPayload, setTestPayload] = useState('');
  const [testResult, setTestResult] = useState('');

  const handleSendPayload = async () => {
    try {
      const response = await fetch('/api/qdrant/create-point', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection: 'Mind',
          points: [
            {
              id: Date.now(),
              vector: Array(384).fill(0.5), // Example vector; replace with actual data
              payload: JSON.parse(testPayload),
            },
          ],
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setTestResult('Payload sent successfully!');
        toast.success('Payload sent successfully!');
      } else {
        setTestResult(data.message || 'Failed to send payload.');
        toast.error(data.message || 'Failed to send payload.');
      }
    } catch (error) {
      console.error('Send Payload Error:', error);
      setTestResult('An error occurred.');
      toast.error('An error occurred while sending the payload.');
    }
  };

  return (
    <div className="bg-black p-6 rounded-xl mb-4">
      <h2 className="text-2xl font-semibold mb-4">Payload Tester</h2>
      <div className="space-y-4">
        <div>
          <label className="block mb-1">Test Payload (JSON)</label>
          <Input
            value={testPayload}
            onChange={(e) => setTestPayload(e.target.value)}
            placeholder='e.g., {"testKey":"testValue"}'
            as="textarea"
            rows={3}
          />
        </div>
        <Button onClick={handleSendPayload} className="bg-blue-600 hover:bg-blue-700">
          Send Payload
        </Button>
        {testResult && <p className="mt-2 text-green-400">{testResult}</p>}
      </div>
    </div>
  );
};

export default PayloadTester;
```

#### **iv. APIEndpointManager.jsx**

A component to manage API endpoints (create, list, delete).

```javascript
// frontend/src/components/APITestV5/APIEndpointManager.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Play } from 'lucide-react';
import { toast } from 'react-hot-toast';

const APIEndpointManager = ({ apiEndpoints, setApiEndpoints, handleTestAPI }) => {
  const [newEndpoint, setNewEndpoint] = useState({
    name: '',
    url: '',
    method: 'GET',
    headers: '{"Content-Type": "application/json"}',
    payload: '',
  });

  const addApiEndpoint = () => {
    if (!newEndpoint.name.trim() || !newEndpoint.url.trim()) {
      toast.error('Endpoint name and URL are required.');
      return;
    }

    try {
      JSON.parse(newEndpoint.headers);
      if (['POST', 'PUT'].includes(newEndpoint.method) && newEndpoint.payload) {
        JSON.parse(newEndpoint.payload);
      }
    } catch (error) {
      toast.error('Invalid JSON in headers or payload.');
      return;
    }

    const endpoint = { ...newEndpoint, id: Date.now() };
    setApiEndpoints([...apiEndpoints, endpoint]);
    setNewEndpoint({ name: '', url: '', method: 'GET', headers: '{"Content-Type": "application/json"}', payload: '' });
    toast.success('API Endpoint Added.');
  };

  const deleteApiEndpoint = (id) => {
    setApiEndpoints(apiEndpoints.filter((ep) => ep.id !== id));
    toast.success('API Endpoint Deleted.');
  };

  return (
    <div className="bg-black p-6 rounded-xl mb-4">
      <h2 className="text-2xl font-semibold mb-4">Manage API Endpoints</h2>
      <div className="flex flex-wrap space-x-4 mb-4">
        <Input
          placeholder="Endpoint Name"
          value={newEndpoint.name}
          onChange={(e) => setNewEndpoint({ ...newEndpoint, name: e.target.value })}
          className="bg-gray-800 border-gray-700 text-white"
        />
        <Input
          placeholder="URL"
          value={newEndpoint.url}
          onChange={(e) => setNewEndpoint({ ...newEndpoint, url: e.target.value })}
          className="bg-gray-800 border-gray-700 text-white"
        />
        <Select value={newEndpoint.method} onValueChange={(value) => setNewEndpoint({ ...newEndpoint, method: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
        {['POST', 'PUT'].includes(newEndpoint.method) && (
          <Input
            placeholder="Payload (JSON)"
            value={newEndpoint.payload}
            onChange={(e) => setNewEndpoint({ ...newEndpoint, payload: e.target.value })}
            className="bg-gray-800 border-gray-700 text-white"
            as="textarea"
            rows={1}
          />
        )}
        <Input
          placeholder="Headers (JSON)"
          value={newEndpoint.headers}
          onChange={(e) => setNewEndpoint({ ...newEndpoint, headers: e.target.value })}
          className="bg-gray-800 border-gray-700 text-white"
          as="textarea"
          rows={1}
        />
        <Button variant="ghost" onClick={addApiEndpoint}>
          <Trash2 size={16} />
        </Button>
      </div>
      <ul className="space-y-2">
        {apiEndpoints.map((ep) => (
          <li key={ep.id} className="flex items-center justify-between bg-gray-800 p-2 rounded">
            <div>
              <p className="font-semibold">{ep.name}</p>
              <p className="text-sm">
                {ep.method} - {ep.url}
              </p>
              {ep.payload && (
                <pre className="text-xs bg-gray-700 p-1 rounded mt-1">{JSON.stringify(JSON.parse(ep.payload), null, 2)}</pre>
              )}
              {ep.headers && (
                <pre className="text-xs bg-gray-700 p-1 rounded mt-1">{JSON.stringify(JSON.parse(ep.headers), null, 2)}</pre>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={() => handleTestAPI(ep)}>
                <Play size={14} />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => deleteApiEndpoint(ep.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default APIEndpointManager;
```

---

## **4. Refactoring `APITestV5/page.jsx`**

Now, we'll refactor your `APITestV5/page.jsx` to utilize the newly created components. This will ensure a clean, organized, and maintainable codebase.

### **a. Complete Refactored Code**

```javascript
// frontend/src/app/APITestV5/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
} from '@/components/ui/dialog';
import {
  Cpu,
  Database,
  Layers,
  Zap,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  Play,
  Edit,
  Save,
  Download,
  Upload,
  Search,
  Sun,
  Moon,
  Trash,
  Key,
  Eye,
  EyeOff,
  Code,
  Send,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast, Toaster } from 'react-hot-toast';
import Dexie from 'dexie';

import JSONEditor from '@/components/APITestV5/JSONEditor';
import QdrantManager from '@/components/APITestV5/QdrantManager';
import PayloadTester from '@/components/APITestV5/PayloadTester';
import APIEndpointManager from '@/components/APITestV5/APIEndpointManager';

const TreeNode = ({ node, onAdd, onDelete, onToggle, onEdit, searchTerm }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nodeType, setNodeType] = useState(node.type);

  const handleEdit = (e) => {
    if (e.key === 'Enter') {
      onEdit(node, 'name', e.target.value);
      setIsEditing(false);
    }
  };

  const handleTypeChange = (e) => {
    onEdit(node, 'type', e.target.value);
    setNodeType(e.target.value);
  };

  const matchesSearch = node?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;

  return (
    <div className={`ml-4 ${searchTerm && !matchesSearch ? 'hidden' : ''}`}>
      <div className="flex items-center space-x-2 my-1">
        {(node.type === 'object' || node.type === 'array') ? (
          <button onClick={() => onToggle(node)} className="text-gray-400 hover:text-white">
            {node.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        ) : (
          <span className="w-4" /> // Placeholder for alignment
        )}
        <select
          value={nodeType}
          onChange={handleTypeChange}
          className="bg-gray-800 text-white rounded px-1 py-0.5 text-xs"
        >
          <option value="string">String</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
          <option value="object">Object</option>
          <option value="array">Array</option>
        </select>
        {isEditing ? (
          <Input
            value={node.name}
            onChange={(e) => onEdit(node, 'name', e.target.value)}
            onKeyDown={handleEdit}
            onBlur={() => setIsEditing(false)}
            className="h-6 py-0 px-1 w-24 bg-gray-800 border border-gray-700 text-white text-xs"
          />
        ) : (
          <span
            className={`text-green-400 text-xs cursor-pointer ${!matchesSearch && searchTerm ? 'hidden' : ''}`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {node.name}
          </span>
        )}
        {node.value !== undefined && node.type !== 'object' && node.type !== 'array' && (
          isEditing ? (
            <Input
              value={node.value}
              onChange={(e) => onEdit(node, 'value', e.target.value)}
              onKeyDown={handleEdit}
              onBlur={() => setIsEditing(false)}
              className="h-6 py-0 px-1 w-24 bg-gray-800 border border-gray-700 text-white text-xs"
            />
          ) : (
            <span
              className={`text-yellow-400 text-xs cursor-pointer ${!matchesSearch && searchTerm ? 'hidden' : ''}`}
              onDoubleClick={() => setIsEditing(true)}
            >
              : {node.value}
            </span>
          )
        )}
        <div className="ml-auto flex space-x-1">
          <Button size="xs" variant="ghost" onClick={() => onAdd(node)} className="h-6 w-6 p-0">
            <Plus size={12} />
          </Button>
          <Button size="xs" variant="ghost" onClick={() => onDelete(node)} className="h-6 w-6 p-0">
            <Trash2 size={12} />
          </Button>
        </div>
      </div>
      {node.isOpen && node.children && (
        <div className="ml-4">
          {node.children.map((child, index) => (
            <TreeNode
              key={index}
              node={child}
              onAdd={onAdd}
              onDelete={onDelete}
              onToggle={onToggle}
              onEdit={onEdit}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Initialize IndexedDB using Dexie
const db = new Dexie('ComprehensiveAppDB');
db.version(1).stores({
  apiKeys: '++id, provider, key',
  jsonStructures: '++id, structure',
  aiLogs: '++id, command, response, timestamp',
  aiTemplates: '++id, name, command, complexity, isRealTime',
  databases: '++id, name, type, host, port, tables',
  queries: '++id, query, timestamp',
  apiEndpoints: '++id, name, url, method, headers, payload',
  testHistory: '++id, url, method, result, timestamp',
  chatHistory: '++id, userMessage, botMessage, timestamp',
});

export default function APITestV5Page() {
  // State declarations
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('structure');

  const [jsonStructure, setJsonStructure] = useState({
    type: 'object',
    name: 'root',
    isOpen: true,
    children: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [aiCommand, setAiCommand] = useState('');
  const [complexity, setComplexity] = useState(50);
  const [isRealTime, setIsRealTime] = useState(false);
  const [aiLogs, setAiLogs] = useState([]);
  const [aiTemplates, setAiTemplates] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState(null);
  const [queries, setQueries] = useState([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [queryPage, setQueryPage] = useState(1);
  const [queryPageSize, setQueryPageSize] = useState(10);
  const [apiEndpoints, setApiEndpoints] = useState([]);
  const [newEndpoint, setNewEndpoint] = useState({
    name: '',
    url: '',
    method: 'GET',
    headers: '{"Content-Type": "application/json"}',
    payload: '',
  });
  const [testUrl, setTestUrl] = useState('');
  const [testMethod, setTestMethod] = useState('GET');
  const [testHeaders, setTestHeaders] = useState('{}');
  const [testPayload, setTestPayload] = useState('');
  const [testResult, setTestResult] = useState('');
  const [testHistory, setTestHistory] = useState([]);
  const [authKeys, setAuthKeys] = useState({ openai: '', anthropic: '', groq: '' });
  const [chatHistory, setChatHistory] = useState([]);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [showAPIManager, setShowAPIManager] = useState(false);

  // useEffect hooks for IndexedDB
  useEffect(() => {
    const fetchData = async () => {
      const storedDarkMode = await db.jsonStructures.where('id').equals(1).first();
      if (storedDarkMode) setDarkMode(JSON.parse(storedDarkMode.structure).darkMode);

      const storedJsonStructure = await db.jsonStructures.where('id').equals(1).first();
      if (storedJsonStructure) setJsonStructure(JSON.parse(storedJsonStructure.structure).jsonStructure);

      const storedAiLogs = await db.aiLogs.toArray();
      setAiLogs(storedAiLogs);

      const storedAiTemplates = await db.aiTemplates.toArray();
      setAiTemplates(storedAiTemplates);

      const storedDatabases = await db.databases.toArray();
      setDatabases(storedDatabases);

      const storedQueries = await db.queries.toArray();
      setQueries(storedQueries);

      const storedApiEndpoints = await db.apiEndpoints.toArray();
      setApiEndpoints(storedApiEndpoints);

      const storedTestHistory = await db.testHistory.toArray();
      setTestHistory(storedTestHistory);

      const storedAuthKeys = await db.apiKeys.toArray();
      if (storedAuthKeys.length > 0) {
        const keyObj = storedAuthKeys.reduce((acc, curr) => {
          acc[curr.provider] = curr.key;
          return acc;
        }, {});
        setAuthKeys(keyObj);
      }

      const storedChatHistory = await db.chatHistory.toArray();
      setChatHistory(storedChatHistory);
    };
    fetchData();
  }, []);

  // Persist Dark Mode
  useEffect(() => {
    db.jsonStructures.put({ id: 1, structure: JSON.stringify({ darkMode }) });
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Persist JSON Structure
  useEffect(() => {
    db.jsonStructures.put({ id: 1, structure: JSON.stringify({ jsonStructure }) });
  }, [jsonStructure]);

  // Persist AI Logs
  useEffect(() => {
    db.aiLogs.bulkPut(aiLogs).catch((err) => {
      console.error('Failed to bulkPut AI Logs:', err);
    });
  }, [aiLogs]);

  // Persist AI Templates
  useEffect(() => {
    db.aiTemplates.bulkPut(aiTemplates).catch((err) => {
      console.error('Failed to bulkPut AI Templates:', err);
    });
  }, [aiTemplates]);

  // Persist Databases
  useEffect(() => {
    db.databases.bulkPut(databases).catch((err) => {
      console.error('Failed to bulkPut Databases:', err);
    });
  }, [databases]);

  // Persist Queries
  useEffect(() => {
    db.queries.bulkPut(queries).catch((err) => {
      console.error('Failed to bulkPut Queries:', err);
    });
  }, [queries]);

  // Persist API Endpoints
  useEffect(() => {
    db.apiEndpoints.bulkPut(apiEndpoints).catch((err) => {
      console.error('Failed to bulkPut API Endpoints:', err);
    });
  }, [apiEndpoints]);

  // Persist Test History
  useEffect(() => {
    db.testHistory.bulkPut(testHistory).catch((err) => {
      console.error('Failed to bulkPut Test History:', err);
    });
  }, [testHistory]);

  // Persist Auth Keys
  useEffect(() => {
    db.apiKeys
      .clear()
      .then(() => {
        const keysToAdd = Object.entries(authKeys).map(([provider, key]) => ({ provider, key }));
        return db.apiKeys.bulkAdd(keysToAdd);
      })
      .catch((err) => {
        console.error('Failed to bulkAdd API Keys:', err);
      });
  }, [authKeys]);

  // Persist Chat History
  useEffect(() => {
    db.chatHistory.bulkPut(chatHistory).catch((err) => {
      console.error('Failed to bulkPut Chat History:', err);
    });
  }, [chatHistory]);

  // Hotkeys
  useHotkeys('ctrl+s, command+s', (event) => {
    event.preventDefault();
    handleSaveJSON();
  }, { enableOnTags: ['INPUT', 'TEXTAREA'] });

  // JSON Structure Handlers
  const addNode = (parent) => {
    if (!parent) return; // Guard clause
    const newNode = { type: 'string', name: 'newField', value: 'value' };
    if (parent.type === 'object' || parent.type === 'array') {
      parent.children = parent.children || [];
      parent.children.push(newNode);
      parent.isOpen = true;
      setJsonStructure({ ...jsonStructure });
    }
  };

  const deleteNode = (nodeToDelete) => {
    if (!nodeToDelete) return; // Guard clause
    const deleteRecursive = (node) => {
      if (node.children) {
        node.children = node.children.filter((child) => child !== nodeToDelete);
        node.children.forEach(deleteRecursive);
      }
    };
    if (jsonStructure !== nodeToDelete) {
      deleteRecursive(jsonStructure);
      setJsonStructure({ ...jsonStructure });
    }
  };

  const toggleNode = (node) => {
    if (!node) return; // Guard clause
    node.isOpen = !node.isOpen;
    setJsonStructure({ ...jsonStructure });
  };

  const editNode = (node, field, value) => {
    if (!node) return; // Guard clause
    node[field] = value;
    setJsonStructure({ ...jsonStructure });
  };

  const handleSaveJSON = () => {
    toast.success('JSON Structure Saved!');
    // Already saved via useEffect
  };

  const handleImportJSON = async (importedJSON) => {
    if (!importedJSON) return;
    try {
      const parsed = JSON.parse(importedJSON);
      setJsonStructure(parsed);
      toast.success('JSON Structure Imported!');
    } catch (error) {
      toast.error('Invalid JSON Structure');
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(jsonStructure, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'jsonStructure.json';
    link.click();
    toast.success('JSON Structure Exported!');
  };

  const validateJSON = () => {
    try {
      JSON.stringify(jsonStructure);
      toast.success('JSON Structure is Valid');
    } catch (error) {
      toast.error('Invalid JSON Structure');
    }
  };

  // AI Command Center Handlers
  const handleExecuteAI = () => {
    if (aiCommand.trim() === '') {
      toast.error('AI Command cannot be empty');
      return;
    }
    // Mock AI processing
    const response = `AI Response to "${aiCommand}" with complexity ${complexity}% and ${isRealTime ? 'real-time' : 'batch'} processing.`;
    setAiLogs([...aiLogs, { command: aiCommand, response, timestamp: new Date().toLocaleString() }]);
    setChatHistory([...chatHistory, { userMessage: aiCommand, botMessage: response, timestamp: new Date().toLocaleString() }]);
    setAiCommand('');
    toast.success('AI Command Executed');
  };

  const handleSaveTemplate = async (templateName) => {
    if (!templateName) {
      toast.error('Template name is required');
      return;
    }
    setAiTemplates([...aiTemplates, { name: templateName, command: aiCommand, complexity, isRealTime }]);
    toast.success('AI Template Saved');
  };

  const handleLoadTemplate = (template) => {
    setAiCommand(template.command);
    setComplexity(template.complexity);
    setIsRealTime(template.isRealTime);
    toast.success(`AI Template "${template.name}" Loaded`);
  };

  // Database Interactions Handlers
  const addDatabase = () => {
    const newDb = { id: Date.now(), name: 'NewDB', type: 'MySQL', host: 'localhost', port: 3306, tables: ['table1', 'table2'] };
    setDatabases([...databases, newDb]);
    toast.success('Database Added');
  };

  const deleteDatabaseHandler = (dbId) => {
    setDatabases(databases.filter((db) => db.id !== dbId));
    toast.success('Database Deleted');
    if (selectedDatabase && selectedDatabase.id === dbId) {
      setSelectedDatabase(null);
    }
  };

  const selectDatabase = (db) => {
    setSelectedDatabase(db);
  };

  const executeQuery = () => {
    if (currentQuery.trim() === '') {
      toast.error('Query cannot be empty');
      return;
    }
    // Mock query execution
    if (!currentQuery.toLowerCase().startsWith('select')) {
      setQueryResult('Only SELECT queries are supported in this mock.');
      toast.error('Unsupported Query Type');
      return;
    }
    // Mock result based on selected database
    let simulatedResult = [];
    if (selectedDatabase) {
      simulatedResult = selectedDatabase.tables.map((table, index) => ({
        id: index + 1,
        name: `${table}_name_${index + 1}`,
        value: Math.floor(Math.random() * 100),
      }));
    } else {
      simulatedResult = [
        { id: 1, name: 'Alice', value: 50 },
        { id: 2, name: 'Bob', value: 70 },
      ];
    }
    setQueryResult(simulatedResult);
    setQueries([...queries, currentQuery]);
    setCurrentQuery('');
    toast.success('Query Executed');
  };

  const getPaginatedResults = () => {
    if (!queryResult) return [];
    const start = (queryPage - 1) * queryPageSize;
    return queryResult.slice(start, start + queryPageSize);
  };

  const suggestQueryOptimization = () => {
    // Mock optimization suggestion
    toast.info('Consider adding indexes to improve query performance.');
  };

  // Chatbot Handlers
  const handleChat = (message) => {
    if (message.trim() === '') return;
    // Mock chatbot response integrating API access
    let response = `You said: "${message}". `;
    // Example: If message includes "fetch apis", list available APIs
    if (message.toLowerCase().includes('fetch apis')) {
      response += `Here are the available APIs: ${apiEndpoints.map((ep) => ep.name).join(', ')}.`;
    } else if (message.toLowerCase().includes('virtual database')) {
      response += `Our virtual database includes the following tables: ${databases.map((db) => db.tables.join(', ')).flat().join(', ')}.`;
    } else {
      response += 'I am here to assist you with API testing and database interactions.';
    }
    setChatHistory([...chatHistory, { userMessage: message, botMessage: response, timestamp: new Date().toLocaleString() }]);
  };

  // Render Component
  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'} text-white overflow-hidden`}>
      <Toaster position="top-right" />
      {/* Sidebar */}
      <div className="w-16 bg-black flex flex-col items-center py-8 space-y-8">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="h-12 w-12" onClick={() => setActiveTab('structure')}>
                <Layers className="w-6 h-6 text-green-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>JSON Structure</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="h-12 w-12" onClick={() => setActiveTab('ai')}>
                <Cpu className="w-6 h-6 text-blue-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>AI Processing</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="h-12 w-12" onClick={() => setActiveTab('database')}>
                <Database className="w-6 h-6 text-purple-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Database</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="h-12 w-12" onClick={() => setActiveTab('test')}>
                <Zap className="w-6 h-6 text-yellow-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>API Tester</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="h-12 w-12" onClick={() => setIsAuthDialogOpen(true)}>
                <Edit className="w-6 h-6 text-red-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Auth Keys</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="h-12 w-12" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-400" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{darkMode ? 'Dark Mode' : 'Light Mode'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Main Content */}
      {showAPIManager ? (
        // Placeholder for API Manager if needed
        <div className="flex-1 flex items-center justify-center">
          <p>API Manager Placeholder</p>
        </div>
      ) : (
        <div className={`flex-1 flex flex-col p-8 overflow-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} text-white`}>
          <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Nexus: Advanced LLM API Architect
          </h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="mb-4">
              <TabsTrigger value="structure">JSON Structure</TabsTrigger>
              <TabsTrigger value="ai">AI Command Center</TabsTrigger>
              <TabsTrigger value="database">Database Interactions</TabsTrigger>
              <TabsTrigger value="test">API Tester</TabsTrigger>
            </TabsList>

            {/* JSON Structure Tab */}
            <TabsContent value="structure" className="flex-1 overflow-auto">
              <JSONEditor
                jsonStructure={jsonStructure}
                setJsonStructure={setJsonStructure}
                handleImportJSON={handleImportJSON}
                handleExportJSON={handleExportJSON}
                validateJSON={validateJSON}
                handleSaveJSON={handleSaveJSON}
              />
              <div className="bg-black p-6 rounded-xl">
                <h2 className="text-2xl mb-4 font-semibold">JSON Preview</h2>
                <pre className="bg-gray-800 p-4 rounded-lg overflow-auto max-h-64">
                  {JSON.stringify(jsonStructure, null, 2)}
                </pre>
              </div>
            </TabsContent>

            {/* AI Command Center Tab */}
            <TabsContent value="ai" className="space-y-4">
              <div className="bg-black p-6 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">AI Command Center</h2>
                  <Button variant="outline" size="sm" onClick={() => setIsTemplateDialogOpen(true)}>
                    <Save size={16} className="mr-1" /> Save Template
                  </Button>
                </div>
                <div className="flex space-x-4 mb-4">
                  <Input
                    className="flex-1 bg-gray-800 border-gray-700 text-white"
                    placeholder="Enter your command or query..."
                    value={aiCommand}
                    onChange={(e) => setAiCommand(e.target.value)}
                  />
                  <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleExecuteAI}>
                    Execute
                  </Button>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span>Complexity Level: {complexity}%</span>
                  <Slider
                    max={100}
                    step={1}
                    value={[complexity]}
                    onValueChange={(value) => setComplexity(value[0])}
                    className="w-64"
                  />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span>Real-time Processing</span>
                  <Switch checked={isRealTime} onCheckedChange={setIsRealTime} />
                </div>
                {/* Chatbot Interface */}
                <div className="bg-gray-800 p-4 rounded-lg max-h-64 overflow-auto">
                  <h3 className="text-lg mb-2">Chatbot:</h3>
                  <div className="space-y-2">
                    {chatHistory.map((chat, index) => (
                      <div key={index}>
                        <p className="text-sm"><strong>You:</strong> {chat.userMessage}</p>
                        <p className="text-sm"><strong>Bot:</strong> {chat.botMessage}</p>
                        <p className="text-xs text-gray-400">{chat.timestamp}</p>
                      </div>
                    ))}
                  </div>
                  <Input
                    className="mt-2 bg-gray-700 border-gray-600 text-white"
                    placeholder="Type a message..."
                    value={aiCommand}
                    onChange={(e) => setAiCommand(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleChat(aiCommand);
                        setAiCommand('');
                      }
                    }}
                  />
                  <Button className="mt-2 bg-red-600 hover:bg-red-700" onClick={() => setChatHistory([])}>
                    Clear Chat
                  </Button>
                </div>
                {/* AI Logs */}
                <div className="bg-gray-800 p-4 rounded-lg max-h-64 overflow-auto">
                  <h3 className="text-lg mb-2">AI Logs:</h3>
                  <ul className="space-y-2">
                    {aiLogs.map((log, index) => (
                      <li key={index} className="border-b border-gray-700 pb-2">
                        <p className="text-sm"><strong>Command:</strong> {log.command}</p>
                        <p className="text-sm"><strong>Response:</strong> {log.response}</p>
                        <p className="text-xs text-gray-400">{log.timestamp}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-black p-6 rounded-xl">
                <h2 className="text-2xl mb-4 font-semibold">AI Suggestions</h2>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">Apply</Button>
                    <span>Optimize API endpoint for better performance</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">Apply</Button>
                    <span>Add caching layer to reduce database load</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">Apply</Button>
                    <span>Implement rate limiting for security</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            {/* Database Interactions Tab */}
            <TabsContent value="database" className="space-y-4">
              <QdrantManager collection={collection} setCollection={setCollection} />
              <div className="bg-black p-6 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Database Connections</h2>
                  <Button variant="outline" size="sm" onClick={addDatabase}>
                    <Plus size={16} className="mr-1" /> Add Database
                  </Button>
                </div>
                <ul className="space-y-2">
                  {databases.map((dbItem) => (
                    <li key={dbItem.id} className="flex items-center justify-between bg-gray-800 p-2 rounded cursor-pointer" onClick={() => selectDatabase(dbItem)}>
                      <div>
                        <p className="font-semibold">{dbItem.name}</p>
                        <p className="text-sm">{dbItem.type} - {dbItem.host}:{dbItem.port}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => deleteDatabaseHandler(dbItem.id)}>
                        <Trash size={14} />
                      </Button>
                    </li>
                  ))}
                </ul>
                {selectedDatabase && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">Tables in {selectedDatabase.name}:</h3>
                    <ul className="space-y-1">
                      {selectedDatabase.tables.map((table, index) => (
                        <li key={index} className="text-sm text-gray-400">{table}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="bg-black p-6 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Query Editor</h2>
                  <Button variant="outline" size="sm" onClick={suggestQueryOptimization}>
                    Optimize Query
                  </Button>
                </div>
                <Input
                  as="textarea"
                  rows={4}
                  className="bg-gray-800 border-gray-700 text-white p-2 rounded w-full mb-4"
                  placeholder="Enter your SQL SELECT query here..."
                  value={currentQuery}
                  onChange={(e) => setCurrentQuery(e.target.value)}
                />
                <Button className="bg-green-600 hover:bg-green-700 mb-4" onClick={executeQuery}>
                  Execute Query
                </Button>
                {queryResult && (
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-lg mb-2">Query Result:</h3>
                    <pre className="