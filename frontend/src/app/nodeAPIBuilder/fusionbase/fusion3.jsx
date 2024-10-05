"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
    Handle,
    Position,
    addEdge,
    Background,
    Controls,
    MiniMap,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { PlusCircle, Trash2, Save, Upload, Settings, Play, ChevronDown, ChevronRight, Edit, Copy, Download, Search, Sun, Moon, Folder, ArrowRight } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast, Toaster } from 'react-hot-toast';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSub,
    ContextMenuSubTrigger,
    ContextMenuSubContent,
} from "@/components/ui/context-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { v4 as uuidv4 } from 'uuid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { saveAs } from 'file-saver';
import Dexie from 'dexie';

import JSONEditor from "@/components/APITestV5/JSONEditor";
import QdrantManager from "@/components/APITestV5/QdrantManager";
import PayloadTester from "@/components/APITestV5/PayloadTester";
import APIEndpointManager from "@/components/APITestV5/APIEndpointManager";

const nodeTypes = {};

const defaultColors = [
    '#00FFFF', // Cyan
    '#FF00FF', // Magenta
    '#FFFF00', // Yellow
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
];

const apis = [
    { name: 'OpenAI', functions: ['completions', 'embeddings', 'chat'] },
    { name: 'Qdrant', functions: ['createPoint', 'searchPoints', 'deletePoint'] },
    { name: 'Gravrag', functions: ['createMemory', 'recallMemory', 'pruneMemories'] },
    { name: 'NeuralResources', functions: ['routeQuery', 'setApiKey', 'availableModels', 'modelInfo'] },
];

const QuantumNode = ({ data, id }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(data);
    const { getNode, setNodes, getEdges, setEdges } = useReactFlow();
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

    const handleSave = () => {
        data.onUpdate(editedData);
        setIsEditing(false);
        toast.success("Task Updated");
    };

    const disconnectWire = (nodeId, handleId) => {
        setEdges((eds) => eds.filter(
            (edge) => !(
                (edge.source === nodeId && edge.sourceHandle === handleId) ||
                (edge.target === nodeId && edge.targetHandle === handleId)
            )
        ));
        toast.success("Wire Disconnected");
    };

    const disconnectAllWires = (nodeId) => {
        setEdges((eds) => eds.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId
        ));
        toast.success("All Wires Disconnected");
    };

    const changeNodeColor = (color) => {
        setNodes((nds) => nds.map((node) => {
            if (node.id === id) {
                return { ...node, data: { ...node.data, color } };
            }
            return node;
        }));
        setIsColorPickerOpen(false);
        toast.success(`Node color changed to ${color}`);
    };

    const getInputColor = (inputId) => {
        const incomingEdge = getEdges().find(edge => edge.target === id && edge.targetHandle === `input-${inputId}`);
        if (incomingEdge) {
            const sourceNode = getNode(incomingEdge.source);
            return sourceNode.data.color;
        }
        return data.color;
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <Card className="w-96 bg-gray-900 border-2 rounded-lg overflow-hidden shadow-lg" style={{ borderColor: data.color }}>
                    <CardHeader className="p-4 bg-gray-800">
                        <CardTitle className="text-xl font-bold" style={{ color: data.color }}>{data.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        {isEditing ? (
                            <div className="space-y-4">
                                <Input
                                    value={editedData.label}
                                    onChange={(e) => setEditedData({ ...editedData, label: e.target.value })}
                                    placeholder="Task Label"
                                    className="bg-gray-700 border-cyan-500"
                                    style={{ color: data.color }}
                                />
                                <Textarea
                                    value={editedData.description}
                                    onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                                    placeholder="Task Description"
                                    className="bg-gray-700 border-cyan-500"
                                    style={{ color: data.color }}
                                />
                                <Select
                                    value={editedData.api}
                                    onValueChange={(value) => setEditedData({ ...editedData, api: value, apiFunction: '' })}
                                >
                                    <SelectTrigger className="bg-gray-700 border-cyan-500">
                                        <SelectValue placeholder="Select API" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {apis.map((api) => (
                                            <SelectItem key={api.name} value={api.name}>{api.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editedData.api && (
                                    <Select
                                        value={editedData.apiFunction}
                                        onValueChange={(value) => setEditedData({ ...editedData, apiFunction: value })}
                                    >
                                        <SelectTrigger className="bg-gray-700 border-cyan-500">
                                            <SelectValue placeholder="Select API Function" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {apis.find(api => api.name === editedData.api)?.functions.map((func) => (
                                                <SelectItem key={func} value={func}>{func}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                <Textarea
                                    value={editedData.payload}
                                    onChange={(e) => setEditedData({ ...editedData, payload: e.target.value })}
                                    placeholder="API Payload (JSON)"
                                    className="bg-gray-700 border-cyan-500"
                                    style={{ color: data.color }}
                                />
                                <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white">Save</Button>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm mb-4" style={{ color: data.color }}>{data.description}</p>
                                {data.api && (
                                    <p className="text-sm mb-4" style={{ color: data.color }}>
                                        API: {data.api} - Function: {data.apiFunction}
                                    </p>
                                )}
                                <Button onClick={() => setIsEditing(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white">Edit</Button>
                            </>
                        )}
                        <div className="mt-4">
                            <Label className="text-cyan-400">Inputs</Label>
                            {data.inputs.map((input, index) => (
                                <div key={input.id} className="my-2">
                                    <Handle
                                        type="target"
                                        position={Position.Left}
                                        id={`input-${input.id}`}
                                        style={{ left: -8, top: 60 + index * 40, background: getInputColor(input.id), width: 12, height: 12 }}
                                    />
                                    <span className="text-xs ml-4" style={{ color: data.color }}>{input.label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Label className="text-cyan-400">Outputs</Label>
                            {data.outputs.map((output, index) => (
                                <div key={output.id} className="my-2">
                                    <Handle
                                        type="source"
                                        position={Position.Right}
                                        id={`output-${output.id}`}
                                        style={{ right: -8, top: 60 + index * 40, background: data.color, width: 12, height: 12 }}
                                    />
                                    <span className="text-xs mr-4 float-right" style={{ color: data.color }}>{output.label}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuSub>
                    <ContextMenuSubTrigger>Change Node Color</ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-36">
                        {defaultColors.map((color) => (
                            <ContextMenuItem key={color} onSelect={() => changeNodeColor(color)}>
                                <div className="flex items-center">
                                    <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                                    {color}
                                </div>
                            </ContextMenuItem>
                        ))}
                        <ContextMenuItem onSelect={() => setIsColorPickerOpen(true)}>
                            Custom Color
                        </ContextMenuItem>
                    </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuItem onSelect={() => disconnectAllWires(id)}>
                    Disconnect All Wires
                </ContextMenuItem>
                {data.inputs.map(input => (
                    <ContextMenuItem key={input.id} onSelect={() => disconnectWire(id, `input-${input.id}`)}>
                        Disconnect {input.label}
                    </ContextMenuItem>
                ))}
                {data.outputs.map(output => (
                    <ContextMenuItem key={output.id} onSelect={() => disconnectWire(id, `output-${output.id}`)}>
                        Disconnect {output.label}
                    </ContextMenuItem>
                ))}
            </ContextMenuContent>
            <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
                <PopoverTrigger asChild>
                    <div style={{ display: 'none' }}></div>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="custom-color">Custom Color</Label>
                        <Input
                            id="custom-color"
                            type="color"
                            value={data.color}
                            onChange={(e) => changeNodeColor(e.target.value)}
                            className="h-10"
                        />
                        <Button onClick={() => setIsColorPickerOpen(false)}>Apply Color</Button>
                    </div>
                </PopoverContent>
            </Popover>
        </ContextMenu>
    );
};

nodeTypes.quantumNode = QuantumNode;

// Initialize IndexedDB using Dexie
const db = new Dexie("ComprehensiveAppDB");
db.version(1).stores({
    apiKeys: "++id, provider, key",
    jsonStructures: "++id, structure",
    aiLogs: "++id, command, response, timestamp",
    aiTemplates: "++id, name, command, complexity, isRealTime",
    databases: "++id, name, type, host, port, tables",
    queries: "++id, query, timestamp",
    apiEndpoints: "++id, name, url, method, headers, payload",
    testHistory: "++id, url, method, result, timestamp",
    chatHistory: "++id, userMessage, botMessage, timestamp",
    nodes: "++id",
    edges: "++id",
});

const NodeApiBuilder = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [newTaskData, setNewTaskData] = useState({
        label: '',
        description: '',
        inputs: [{ id: 'input1', label: 'Input 1' }],
        outputs: [{ id: 'output1', label: 'Output 1' }],
        color: '#00FFFF',
        api: '',
        apiFunction: '',
        payload: '{}',
    });
    const reactFlowWrapper = useRef(null);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [errorLog, setErrorLog] = useState([]);
    const [activeTab, setActiveTab] = useState("nodeBuilder");

    // API Tester States
    const [jsonStructure, setJsonStructure] = useState({
        type: "object",
        name: "root",
        isOpen: true,
        children: [],
        collection: "default",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [aiCommand, setAiCommand] = useState("");
    const [complexity, setComplexity] = useState(50);
    const [isRealTime, setIsRealTime] = useState(false);
    const [aiLogs, setAiLogs] = useState([]);
    const [aiTemplates, setAiTemplates] = useState([]);
    const [databases, setDatabases] = useState([]);
    const [selectedDatabase, setSelectedDatabase] = useState(null);
    const [queries, setQueries] = useState([]);
    const [currentQuery, setCurrentQuery] = useState("");
    const [queryResult, setQueryResult] = useState(null);
    const [queryPage, setQueryPage] = useState(1);
    const [queryPageSize, setQueryPageSize] = useState(10);
    const [apiEndpoints, setApiEndpoints] = useState([]);
    const [newEndpoint, setNewEndpoint] = useState({
        name: "",
        url: "",
        method: "GET",
        headers: '{"Content-Type": "application/json"}',
        payload: "",
    });
    const [testUrl, setTestUrl] = useState("");
    const [testMethod, setTestMethod] = useState("GET");
    const [testHeaders, setTestHeaders] = useState("{}");
    const [testPayload, setTestPayload] = useState("");
    const [testResult, setTestResult] = useState("");
    const [testHistory, setTestHistory] = useState([]);
    const [authKeys, setAuthKeys] = useState({
        openai: "",
        anthropic: "",
        groq: "",
    });
    const [chatHistory, setChatHistory] = useState([]);
    const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
    const [showAPIManager, setShowAPIManager] = useState(false);

    const onConnect = useCallback((params) => {
        const sourceNode = nodes.find(node => node.id === params.source);
        const newEdge = {
            ...params,
            type: 'smoothstep',
            animated: true,
            style: { stroke: sourceNode.data.color, strokeWidth: 2 },
        };
        setEdges((eds) => addEdge(newEdge, eds));
        toast.success("Connection Established");
    }, [nodes, setEdges]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const position = {
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            };

            const newNode = {
                id: `quantum-${nodes.length + 1}`,
                type: 'quantumNode',
                position,
                data: {
                    ...newTaskData,
                    onUpdate: (updatedData) => {
                        setNodes((nds) =>
                            nds.map((node) =>
                                node.id === newNode.id ? { ...node, data: { ...node.data, ...updatedData } } : node
                            )
                        );
                    },
                },
            };

            setNodes((nds) => nds.concat(newNode));
            setNewTaskData({
                label: '',
                description: '',
                inputs: [{ id: 'input1', label: 'Input 1' }],
                outputs: [{ id: 'output1', label: 'Output 1' }],
                color: '#00FFFF',
                api: '',
                apiFunction: '',
                payload: '{}',
            });
            setIsAddingTask(false);
            toast.success("New quantum task has been added to the workflow.");
        },
        [nodes, newTaskData, setNodes]
    );

    const addInput = () => {
        setNewTaskData((prev) => ({
            ...prev,
            inputs: [...prev.inputs, { id: `input${prev.inputs.length + 1}`, label: `Input ${prev.inputs.length + 1}` }],
        }));
    };

    const addOutput = () => {
        setNewTaskData((prev) => ({
            ...prev,
            outputs: [...prev.outputs, { id: `output${prev.outputs.length + 1}`, label: `Output ${prev.outputs.length + 1}` }],
        }));
    };

    const removeNode = useCallback(
        (nodeId) => {
            setNodes((nds) => nds.filter((node) => node.id !== nodeId));
            setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
            toast.success("Quantum task has been removed from the workflow.");
        },
        [setNodes, setEdges]
    );

    const saveWorkflow = () => {
        const workflow = { nodes, edges };
        const json = JSON.stringify(workflow);
        const blob = new Blob([json], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = 'node_api_workflow.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Your Node API workflow has been saved successfully.");
    };

    const loadWorkflow = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                try {
                    const workflow = JSON.parse(content);
                    setNodes(workflow.nodes || []);
                    setEdges(workflow.edges || []);
                    toast.success("Your Node API workflow has been loaded successfully.");
                } catch (error) {
                    setErrorLog((prev) => [...prev, `Error loading workflow: ${error}`]);
                    toast.error("Failed to load workflow. Please check the file format.");
                }
            };
            reader.readAsText(file);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const storedNodes = await db.nodes.toArray();
            const storedEdges = await db.edges.toArray();
            if (storedNodes.length > 0) setNodes(storedNodes);
            if (storedEdges.length > 0) setEdges(storedEdges);

            const storedDarkMode = await db.jsonStructures.where("id").equals(1).first();
            if (storedDarkMode) setIsDarkMode(JSON.parse(storedDarkMode.structure).darkMode);

            const storedJsonStructure = await db.jsonStructures.where("id").equals(1).first();
            if (storedJsonStructure) {
                const parsedStructure = JSON.parse(storedJsonStructure.structure);
                setJsonStructure(parsedStructure.jsonStructure || {
                    type: "object",
                    name: "root",
                    isOpen: true,
                    children: [],
                    collection: "default",
                });
            }

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

    useEffect(() => {
        db.nodes.clear().then(() => db.nodes.bulkAdd(nodes));
        db.edges.clear().then(() => db.edges.bulkAdd(edges));
    }, [nodes, edges]);

    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        db.jsonStructures.put({ id: 1, structure: JSON.stringify({ darkMode: isDarkMode }) });
    }, [isDarkMode]);

    const handleSaveJSON = () => {
        db.jsonStructures.put({ id: 1, structure: JSON.stringify({ jsonStructure }) });
        toast.success("JSON Structure Saved!");
    };

    const handleAuthKeysSave = async () => {
        await db.apiKeys.clear();
        const keysToAdd = Object.entries(authKeys).map(([provider, key]) => ({ provider, key }));
        await db.apiKeys.bulkAdd(keysToAdd);
        toast.success("Authentication Keys Saved!");
        setIsAuthDialogOpen(false);
    };

    const handleExecuteAI = () => {
        if (aiCommand.trim() === "") {
            toast.error("AI Command cannot be empty");
            return;
        }
        const response = `AI Response to "${aiCommand}" with complexity ${complexity}% and ${isRealTime ? "real-time" : "batch"} processing.`;
        const newLog = { command: aiCommand, response, timestamp: new Date().toLocaleString() };
        setAiLogs([...aiLogs, newLog]);
        setChatHistory([...chatHistory, { userMessage: aiCommand, botMessage: response, timestamp: new Date().toLocaleString() }]);
        db.aiLogs.add(newLog);
        db.chatHistory.add({ userMessage: aiCommand, botMessage: response, timestamp: new Date().toLocaleString() });
        setAiCommand("");
        toast.success("AI Command Executed");
    };

    const handleSaveTemplate = async (templateName) => {
        if (!templateName) {
            toast.error("Template name is required");
            return;
        }
        const newTemplate = { name: templateName, command: aiCommand, complexity, isRealTime };
        setAiTemplates([...aiTemplates, newTemplate]);
        await db.aiTemplates.add(newTemplate);
        toast.success("AI Template Saved");
    };

    const handleTestAPI = async (endpoint) => {
        try {
            const headers = JSON.parse(endpoint.headers);
            const response = await fetch(endpoint.url, {
                method: endpoint.method,
                headers: headers,
                body: endpoint.method !== 'GET' ? endpoint.payload : undefined,
            });
            const data = await response.json();
            setTestResult(JSON.stringify(data, null, 2));
            const historyItem = { url: endpoint.url, method: endpoint.method, result: JSON.stringify(data), timestamp: new Date().toISOString() };
            setTestHistory([...testHistory, historyItem]);
            await db.testHistory.add(historyItem);
            toast.success(`API Test for ${endpoint.name} completed successfully`);
        } catch (error) {
            setTestResult(`Error: ${error.message}`);
            toast.error(`API Test for ${endpoint.name} failed: ${error.message}`);
        }
    };

    return (
        <div className={`h-screen flex flex-col ${isDarkMode ? 'dark' : ''} bg-gray-900 text-white`}>
            <Toaster position="top-right" />
            <div className="p-4 border-b border-cyan-700 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-cyan-400">Nexus: Advanced LLM API Architect</h1>
                <div className="flex space-x-2">
                    <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
                        <DialogTrigger asChild>
                            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white"><PlusCircle className="mr-2 h-4 w-4" /> Add New Task</Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 text-cyan-400 border-cyan-500">
                            <DialogHeader>
                                <DialogTitle className="text-cyan-400">Create New Quantum Task</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <Input
                                    value={newTaskData.label}
                                    onChange={(e) => setNewTaskData({ ...newTaskData, label: e.target.value })}
                                    placeholder="Enter task label"
                                    className="bg-gray-700 text-cyan-400 border-cyan-500"
                                />
                                <Textarea
                                    value={newTaskData.description}
                                    onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                                    placeholder="Enter task description"
                                    className="bg-gray-700 text-cyan-400 border-cyan-500"
                                />
                                <Select
                                    value={newTaskData.api}
                                    onValueChange={(value) => setNewTaskData({ ...newTaskData, api: value, apiFunction: '' })}
                                >
                                    <SelectTrigger className="bg-gray-700 border-cyan-500">
                                        <SelectValue placeholder="Select API" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {apis.map((api) => (
                                            <SelectItem key={api.name} value={api.name}>{api.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {newTaskData.api && (
                                    <Select
                                        value={newTaskData.apiFunction}
                                        onValueChange={(value) => setNewTaskData({ ...newTaskData, apiFunction: value })}
                                    >
                                        <SelectTrigger className="bg-gray-700 border-cyan-500">
                                            <SelectValue placeholder="Select API Function" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {apis.find(api => api.name === newTaskData.api)?.functions.map((func) => (
                                                <SelectItem key={func} value={func}>{func}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                <Textarea
                                    value={newTaskData.payload}
                                    onChange={(e) => setNewTaskData({ ...newTaskData, payload: e.target.value })}
                                    placeholder="Enter API payload (JSON)"
                                    className="bg-gray-700 text-cyan-400 border-cyan-500"
                                />
                                <div>
                                    <Label className="text-cyan-400">Inputs</Label>
                                    {newTaskData.inputs.map((input, index) => (
                                        <Input
                                            key={input.id}
                                            value={input.label}
                                            onChange={(e) => {
                                                const updatedInputs = [...newTaskData.inputs];
                                                updatedInputs[index].label = e.target.value;
                                                setNewTaskData({ ...newTaskData, inputs: updatedInputs });
                                            }}
                                            className="mb-2 bg-gray-700 text-cyan-400 border-cyan-500"
                                        />
                                    ))}
                                    <Button onClick={addInput} className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white">Add Input</Button>
                                </div>
                                <div>
                                    <Label className="text-cyan-400">Outputs</Label>
                                    {newTaskData.outputs.map((output, index) => (
                                        <Input
                                            key={output.id}
                                            value={output.label}
                                            onChange={(e) => {
                                                const updatedOutputs = [...newTaskData.outputs];
                                                updatedOutputs[index].label = e.target.value;
                                                setNewTaskData({ ...newTaskData, outputs: updatedOutputs });
                                            }}
                                            className="mb-2 bg-gray-700 text-cyan-400 border-cyan-500"
                                        />
                                    ))}
                                    <Button onClick={addOutput} className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white">Add Output</Button>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={() => setIsAddingTask(false)} className="bg-cyan-600 hover:bg-cyan-700 text-white">Create Task</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button onClick={saveWorkflow} className="bg-cyan-600 hover:bg-cyan-700 text-white"><Save className="mr-2 h-4 w-4" /> Save Workflow</Button>
                    <Button onClick={() => document.getElementById('load-workflow').click()} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                        <Upload className="mr-2 h-4 w-4" /> Load Workflow
                    </Button>
                    <input
                        id="load-workflow"
                        type="file"
                        accept=".json"
                        style={{ display: 'none' }}
                        onChange={loadWorkflow}
                    />
                    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white"><Settings className="mr-2 h-4 w-4" /> Settings</Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-800 text-cyan-400 border-cyan-500">
                            <DialogHeader>
                                <DialogTitle className="text-cyan-400">Settings</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Label htmlFor="dark-mode" className="text-cyan-400">Dark Mode</Label>
                                    <Switch
                                        id="dark-mode"
                                        checked={isDarkMode}
                                        onCheckedChange={setIsDarkMode}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="api-key" className="text-cyan-400">OpenAI API Key</Label>
                                    <Input
                                        id="api-key"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        type="password"
                                        className="bg-gray-700 text-cyan-400 border-cyan-500"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="model-select" className="text-cyan-400">Select Model</Label>
                                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                                        <SelectTrigger id="model-select" className="bg-gray-700 border-cyan-500">
                                            <SelectValue placeholder="Select a model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                            <SelectItem value="gpt-4">GPT-4</SelectItem>
                                            <SelectItem value="gpt-4-32k">GPT-4 32k</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-grow">
                <TabsList className="bg-gray-800 border-b border-cyan-700">
                    <TabsTrigger value="nodeBuilder" className="text-cyan-400 hover:bg-cyan-700">Node Builder</TabsTrigger>
                    <TabsTrigger value="apiTester" className="text-cyan-400 hover:bg-cyan-700">API Tester</TabsTrigger>
                </TabsList>
                <TabsContent value="nodeBuilder" className="flex-grow">
                    <div className="flex-grow flex" ref={reactFlowWrapper}>
                        <ReactFlowProvider>
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                onDragOver={onDragOver}
                                onDrop={onDrop}
                                nodeTypes={nodeTypes}
                                fitView
                            >
                                <Background color="#4a5568" gap={16} />
                                <Controls />
                                <MiniMap style={{ height: 120 }} zoomable pannable />
                            </ReactFlow>
                        </ReactFlowProvider>
                    </div>
                </TabsContent>
                <TabsContent value="apiTester" className="flex-grow p-4 overflow-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-gray-800 border-cyan-500">
                            <CardHeader>
                                <CardTitle className="text-cyan-400">JSON Structure</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <JSONEditor
                                    jsonStructure={jsonStructure}
                                    setJsonStructure={setJsonStructure}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                />
                                <Button onClick={handleSaveJSON} className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white">Save JSON Structure</Button>
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-cyan-500">
                            <CardHeader>
                                <CardTitle className="text-cyan-400">Qdrant Manager</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <QdrantManager
                                    collection={jsonStructure?.collection || "default"}
                                    setCollection={(col) => setJsonStructure(prevState => ({...prevState, collection: col}))}
                                />
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-cyan-500">
                            <CardHeader>
                                <CardTitle className="text-cyan-400">Payload Tester</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <PayloadTester />
                            </CardContent>
                        </Card>
                        <Card className="bg-gray-800 border-cyan-500">
                            <CardHeader>
                                <CardTitle className="text-cyan-400">API Endpoint Manager</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <APIEndpointManager
                                    apiEndpoints={apiEndpoints}
                                    setApiEndpoints={setApiEndpoints}
                                    newEndpoint={newEndpoint}
                                    setNewEndpoint={setNewEndpoint}
                                    handleTestAPI={handleTestAPI}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default NodeApiBuilder;