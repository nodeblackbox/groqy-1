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
        if (e.key === 'Enter')
        {
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
            if (storedAuthKeys.length > 0)
            {
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
        if (darkMode)
        {
            document.documentElement.classList.add('dark');
        } else
        {
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
        if (parent.type === 'object' || parent.type === 'array')
        {
            parent.children = parent.children || [];
            parent.children.push(newNode);
            parent.isOpen = true;
            setJsonStructure({ ...jsonStructure });
        }
    };

    const deleteNode = (nodeToDelete) => {
        if (!nodeToDelete) return; // Guard clause
        const deleteRecursive = (node) => {
            if (node.children)
            {
                node.children = node.children.filter((child) => child !== nodeToDelete);
                node.children.forEach(deleteRecursive);
            }
        };
        if (jsonStructure !== nodeToDelete)
        {
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
        try
        {
            const parsed = JSON.parse(importedJSON);
            setJsonStructure(parsed);
            toast.success('JSON Structure Imported!');
        } catch (error)
        {
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
        try
        {
            JSON.stringify(jsonStructure);
            toast.success('JSON Structure is Valid');
        } catch (error)
        {
            toast.error('Invalid JSON Structure');
        }
    };

    // AI Command Center Handlers
    const handleExecuteAI = () => {
        if (aiCommand.trim() === '')
        {
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
        if (!templateName)
        {
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
        if (selectedDatabase && selectedDatabase.id === dbId)
        {
            setSelectedDatabase(null);
        }
    };

    const selectDatabase = (db) => {
        setSelectedDatabase(db);
    };

    const executeQuery = () => {
        if (currentQuery.trim() === '')
        {
            toast.error('Query cannot be empty');
            return;
        }
        // Mock query execution
        if (!currentQuery.toLowerCase().startsWith('select'))
        {
            setQueryResult('Only SELECT queries are supported in this mock.');
            toast.error('Unsupported Query Type');
            return;
        }
        // Mock result based on selected database
        let simulatedResult = [];
        if (selectedDatabase)
        {
            simulatedResult = selectedDatabase.tables.map((table, index) => ({
                id: index + 1,
                name: `${table}_name_${index + 1}`,
                value: Math.floor(Math.random() * 100),
            }));
        } else
        {
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
        if (message.toLowerCase().includes('fetch apis'))
        {
            response += `Here are the available APIs: ${apiEndpoints.map((ep) => ep.name).join(', ')}.`;
        } else if (message.toLowerCase().includes('virtual database'))
        {
            response += `Our virtual database includes the following tables: ${databases.map((db) => db.tables.join(', ')).flat().join(', ')}.`;
        } else
        {
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
                                            if (e.key === 'Enter')
                                            {
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
                                <QdrantManager collection={jsonStructure.collection || 'default'} setCollection={(col) => {
                                    setJsonStructure({ ...jsonStructure, collection: col });
                                }} />
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
                                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); deleteDatabaseHandler(dbItem.id); }}>
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
                                        <pre className="text-sm">
                                            {Array.isArray(queryResult) ? JSON.stringify(getPaginatedResults(), null, 2) : queryResult}
                                        </pre>
                                        {Array.isArray(queryResult) && (
                                            <div className="flex justify-between items-center mt-2">
                                                <span>Page {queryPage}</span>
                                                <div className="flex space-x-2">
                                                    <Button variant="ghost" size="sm" onClick={() => setQueryPage(prev => Math.max(prev - 1, 1))} disabled={queryPage === 1}>
                                                        Previous
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => setQueryPage(prev => prev + 1)} disabled={(queryPage * queryPageSize) >= queryResult.length}>
                                                        Next
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div className="mt-4">
                                    <h3 className="text-lg mb-2">Recent Queries:</h3>
                                    <ul className="space-y-2 text-sm">
                                        {queries.map((q, idx) => (
                                            <li key={idx} className="bg-gray-700 p-2 rounded">
                                                {q}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-black p-6 rounded-xl">
                                <h2 className="text-2xl mb-4 font-semibold">Data Visualization</h2>
                                <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg">
                                    <span className="text-gray-400">Interactive data visualizations would be displayed here</span>
                                </div>
                            </div>
                        </TabsContent>

                        {/* API Tester Tab */}
                        <TabsContent value="test" className="space-y-4">
                                <PayloadTester />
                                <APIEndpointManager
                                    apiEndpoints={apiEndpoints}
                                    setApiEndpoints={setApiEndpoints}
                                    handleTestAPI={(ep) => handleTestAPI(ep)}
                                />
                            <div className="bg-black p-6 rounded-xl">
                                <h2 className="text-2xl mb-4 font-semibold">Test History</h2>
                                <ul className="space-y-2">
                                    {testHistory.map((test, index) => (
                                        <li key={index} className="bg-gray-800 p-2 rounded">
                                            <p className="text-sm"><strong>Method:</strong> {test.method}</p>
                                            <p className="text-sm"><strong>URL:</strong> {test.url}</p>
                                            <p className="text-sm"><strong>Result:</strong> {test.result}</p>
                                            <p className="text-xs text-gray-400">{test.timestamp}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            )}

            {/* AI Template Save Dialog */}
            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Save AI Command Template</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <Input
                            placeholder="Template Name"
                            value={newEndpoint.name}
                            onChange={(e) => setNewEndpoint({ ...newEndpoint, name: e.target.value })}
                        />
                    </DialogBody>
                    <DialogFooter>
                        <Button onClick={() => {
                            const templateName = prompt('Enter Template Name:');
                            if (templateName) handleSaveTemplate(templateName);
                        }}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Authentication Keys Dialog */}
            <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Set Authentication Keys</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="openai">OpenAI API Key</Label>
                                <div className="relative">
                                    <Input
                                        type={authKeys.openai ? 'password' : 'text'}
                                        id="openai"
                                        value={authKeys.openai}
                                        onChange={(e) => setAuthKeys({ ...authKeys, openai: e.target.value })}
                                        placeholder="Enter OpenAI API Key"
                                        className="bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => setAuthKeys(prev => ({ ...prev, openai: authKeys.openai }))}
                                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-white"
                                    >
                                        {authKeys.openai ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="anthropic">Anthropic API Key</Label>
                                <div className="relative">
                                    <Input
                                        type={authKeys.anthropic ? 'password' : 'text'}
                                        id="anthropic"
                                        value={authKeys.anthropic}
                                        onChange={(e) => setAuthKeys({ ...authKeys, anthropic: e.target.value })}
                                        placeholder="Enter Anthropic API Key"
                                        className="bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => setAuthKeys(prev => ({ ...prev, anthropic: authKeys.anthropic }))}
                                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-white"
                                    >
                                        {authKeys.anthropic ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="groq">Groq API Key</Label>
                                <div className="relative">
                                    <Input
                                        type={authKeys.groq ? 'password' : 'text'}
                                        id="groq"
                                        value={authKeys.groq}
                                        onChange={(e) => setAuthKeys({ ...authKeys, groq: e.target.value })}
                                        placeholder="Enter Groq API Key"
                                        className="bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => setAuthKeys(prev => ({ ...prev, groq: authKeys.groq }))}
                                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-white"
                                    >
                                        {authKeys.groq ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button onClick={handleAuthKeysSave}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}