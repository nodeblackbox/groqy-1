"use client"

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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { PlusCircle, Trash2, Save, Upload, Settings, Play, ChevronDown, ChevronUp, Copy } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
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

const defaultColors = [
    '#00FFFF', // Cyan
    '#FF00FF', // Magenta
    '#FFFF00', // Yellow
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
];

const QuantumNode = ({ data, id }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(data);
    const { getNode, setNodes, getEdges, setEdges } = useReactFlow();
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [isTestingOpen, setIsTestingOpen] = useState(false);
    const [testResult, setTestResult] = useState("");
    const [isResultsOpen, setIsResultsOpen] = useState(false);
    const [reRunCount, setReRunCount] = useState(0);

    const handleSave = () => {
        data.onUpdate(editedData);
        setIsEditing(false);
        toast({
            title: "Task Updated",
            description: "Your changes have been saved successfully.",
        });
    };

    const disconnectWire = (nodeId, handleId) => {
        setEdges((eds) => eds.filter(
            (edge) => !(
                (edge.source === nodeId && edge.sourceHandle === handleId) ||
                (edge.target === nodeId && edge.targetHandle === handleId)
            )
        ));
        toast({
            title: "Wire Disconnected",
            description: "The selected wire has been removed.",
        });
    };

    const disconnectAllWires = (nodeId) => {
        setEdges((eds) => eds.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId
        ));
        toast({
            title: "All Wires Disconnected",
            description: "All wires connected to the node have been removed.",
        });
    };

    const changeNodeColor = (color) => {
        setNodes((nds) => nds.map((node) => {
            if (node.id === id) {
                return { ...node, data: { ...node.data, color } };
            }
            return node;
        }));
        setIsColorPickerOpen(false);
        toast({
            title: "Node Color Changed",
            description: `The node color has been changed to ${color}.`,
        });
    };

    const getInputColor = (inputId) => {
        const incomingEdge = getEdges().find(edge => edge.target === id && edge.targetHandle === `input-${inputId}`);
        if (incomingEdge) {
            const sourceNode = getNode(incomingEdge.source);
            return sourceNode.data.color;
        }
        return data.color;
    };

    const handleTestAPI = async () => {
        try {
            const response = await fetch(editedData.url, {
                method: editedData.method,
                headers: JSON.parse(editedData.headers),
                body: editedData.method !== 'GET' ? editedData.payload : undefined,
            });
            const result = await response.json();
            setTestResult(JSON.stringify(result, null, 2));
            setIsResultsOpen(true);
            toast({
                title: "API Test Completed",
                description: "The API test has been executed successfully.",
            });
        } catch (error) {
            setTestResult(`Error: ${error.message}`);
            setIsResultsOpen(true);
            toast({
                title: "API Test Failed",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const handleReRun = async () => {
        for (let i = 0; i < reRunCount; i++) {
            await handleTestAPI();
        }
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
                                <Input
                                    value={editedData.url}
                                    onChange={(e) => setEditedData({ ...editedData, url: e.target.value })}
                                    placeholder="API URL"
                                    className="bg-gray-700 border-cyan-500"
                                />
                                <Select
                                    value={editedData.method}
                                    onValueChange={(value) => setEditedData({ ...editedData, method: value })}
                                >
                                    <SelectTrigger className="bg-gray-700 border-cyan-500">
                                        <SelectValue placeholder="Select Method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GET">GET</SelectItem>
                                        <SelectItem value="POST">POST</SelectItem>
                                        <SelectItem value="PUT">PUT</SelectItem>
                                        <SelectItem value="DELETE">DELETE</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Textarea
                                    value={editedData.headers}
                                    onChange={(e) => setEditedData({ ...editedData, headers: e.target.value })}
                                    placeholder="Headers (JSON)"
                                    className="bg-gray-700 border-cyan-500"
                                />
                                <Textarea
                                    value={editedData.payload}
                                    onChange={(e) => setEditedData({ ...editedData, payload: e.target.value })}
                                    placeholder="Payload (JSON)"
                                    className="bg-gray-700 border-cyan-500"
                                />
                                <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white">Save</Button>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm mb-4" style={{ color: data.color }}>{data.description}</p>
                                <Button onClick={() => setIsEditing(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white mr-2">Edit</Button>
                                <Button onClick={() => setIsTestingOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">Test API</Button>
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
                <ContextMenuItem onSelect={() => navigator.clipboard.writeText(JSON.stringify(data))}>
                    Copy Node
                </ContextMenuItem>
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
            <Dialog open={isTestingOpen} onOpenChange={setIsTestingOpen}>
                <DialogContent className="bg-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle>API Test Results</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Button onClick={handleTestAPI} className="bg-purple-600 hover:bg-purple-700 text-white">
                            Run Test
                        </Button>
                        {reRunCount > 0 && (
                            <Button onClick={handleReRun} className="bg-blue-600 hover:bg-blue-700 text-white ml-2">
                                Re-run {reRunCount} time{reRunCount > 1 ? 's' : ''}
                            </Button>
                        )}
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Test Results</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsResultsOpen(!isResultsOpen)}
                            >
                                {isResultsOpen ? <ChevronUp /> : <ChevronDown />}
                            </Button>
                        </div>
                        {isResultsOpen && (
                            <pre className="bg-gray-900 p-4 rounded-lg overflow-auto max-h-60">
                                {testResult || "No test results yet."}
                            </pre>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </ContextMenu>
    );
};

const nodeTypes = {
    quantumNode: QuantumNode,
};

const QuantumNexusWorkflowBuilder = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [newTaskData, setNewTaskData] = useState({
        label: '',
        description: '',
        inputs: [{ id: 'input1', label: 'Input 1' }],
        outputs: [{ id: 'output1', label: 'Output 1' }],
        color: '#00FFFF',
        url: '',
        method: 'GET',
        headers: '{}',
        payload: '{}',
    });
    const reactFlowWrapper = useRef(null);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [errorLog, setErrorLog] = useState([]);
    const [workflowTestResults, setWorkflowTestResults] = useState({});
    const [copiedNode, setCopiedNode] = useState(null);

    const onConnect = useCallback((params) => {
        const sourceNode = nodes.find(node => node.id === params.source);
        const newEdge = {
            ...params,
            type: 'smoothstep',
            animated: true,
            style: { stroke: sourceNode.data.color, strokeWidth: 2 },
        };
        setEdges((eds) => addEdge(newEdge, eds));
        toast({
            title: "Connection Established",
            description: "Nodes connected successfully.",
        });
    }, [nodes, setEdges]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const createNewNode = useCallback((position, data = newTaskData) => {
        const newNode = {
            id: `quantum-${nodes.length + 1}`,
            type: 'quantumNode',
            position,
            data: {
                ...data,
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
            url: '',
            method: 'GET',
            headers: '{}',
            payload: '{}',
        });
        setIsAddingTask(false);
        toast({
            title: "Task Added",
            description: "New quantum task has been added to the workflow.",
        });
    }, [nodes, newTaskData, setNodes]);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const position = {
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            };

            createNewNode(position);
        },
        [createNewNode]
    );

    const onPaste = useCallback(
        (event) => {
            if (copiedNode && event.target === reactFlowWrapper.current) {
                const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
                const position = {
                    x: event.clientX - reactFlowBounds.left,
                    y: event.clientY - reactFlowBounds.top,
                };
                createNewNode(position, JSON.parse(copiedNode));
            }
        },
        [copiedNode, createNewNode]
    );

    useEffect(() => {
        document.addEventListener('paste', onPaste);
        return () => {
            document.removeEventListener('paste', onPaste);
        };
    }, [onPaste]);

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
            toast({
                title: "Task Removed",
                description: "Quantum task has been removed from the workflow.",
            });
        },
        [setNodes, setEdges]
    );

    const addNewTask = () => {
        const position = { x: 100, y: 100 }; // Default position, you can adjust this
        createNewNode(position);
    };

    const saveWorkflow = () => {
        const workflow = { nodes, edges };
        const json = JSON.stringify(workflow);
        const blob = new Blob([json], { type: 'application/json' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = 'quantum_nexus_workflow.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
            title: "Workflow Saved",
            description: "Your Quantum Nexus workflow has been saved successfully.",
        });
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
                    toast({
                        title: "Workflow Loaded",
                        description: "Your Quantum Nexus workflow has been loaded successfully.",
                    });
                } catch (error) {
                    setErrorLog((prev) => [...prev, `Error loading workflow: ${error}`]);
                    toast({
                        title: "Error",
                        description: "Failed to load workflow. Please check the file format.",
                        variant: "destructive",
                    });
                }
            };
            reader.readAsText(file);
        }
    };

    const runWorkflowTests = async () => {
        const results = {};
        for (const node of nodes) {
            try {
                const response = await fetch(node.data.url, {
                    method: node.data.method,
                    headers: JSON.parse(node.data.headers),
                    body: node.data.method !== 'GET' ? node.data.payload : undefined,
                });
                const result = await response.json();
                results[node.id] = {
                    status: 'success',
                    data: result,
                };
            } catch (error) {
                results[node.id] = {
                    status: 'error',
                    message: error.message,
                };
            }
        }
        setWorkflowTestResults(results);
        toast({
            title: "Workflow Tests Completed",
            description: "All API tests in the workflow have been executed.",
        });
    };

    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <div className={`h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
            <div className="p-4 bg-gray-900 border-b border-cyan-700 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-cyan-400">Quantum API Node Workflow Builder</h1>
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
                                <Input
                                    value={newTaskData.url}
                                    onChange={(e) => setNewTaskData({ ...newTaskData, url: e.target.value })}
                                    placeholder="API URL"
                                    className="bg-gray-700 text-cyan-400 border-cyan-500"
                                />
                                <Select
                                    value={newTaskData.method}
                                    onValueChange={(value) => setNewTaskData({ ...newTaskData, method: value })}
                                >
                                    <SelectTrigger className="bg-gray-700 border-cyan-500">
                                        <SelectValue placeholder="Select Method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="GET">GET</SelectItem>
                                        <SelectItem value="POST">POST</SelectItem>
                                        <SelectItem value="PUT">PUT</SelectItem>
                                        <SelectItem value="DELETE">DELETE</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Textarea
                                    value={newTaskData.headers}
                                    onChange={(e) => setNewTaskData({ ...newTaskData, headers: e.target.value })}
                                    placeholder="Headers (JSON)"
                                    className="bg-gray-700 text-cyan-400 border-cyan-500"
                                />
                                <Textarea
                                    value={newTaskData.payload}
                                    onChange={(e) => setNewTaskData({ ...newTaskData, payload: e.target.value })}
                                    placeholder="Payload (JSON)"
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
                                <Button onClick={addNewTask} className="bg-cyan-600 hover:bg-cyan-700 text-white">Create Task</Button>
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
                    <Button onClick={runWorkflowTests} className="bg-green-600 hover:bg-green-700 text-white">
                        <Play className="mr-2 h-4 w-4" /> Run Workflow Tests
                    </Button>
                </div>
            </div>
            <ReactFlowProvider>
                <div 
                    className="flex-grow bg-gray-900" 
                    ref={reactFlowWrapper}
                    onKeyDown={(e) => {
                        if (e.ctrlKey && e.key === 'c') {
                            const selectedNodes = nodes.filter(node => node.selected);
                            if (selectedNodes.length === 1) {
                                setCopiedNode(JSON.stringify(selectedNodes[0].data));
                                toast({
                                    title: "Node Copied",
                                    description: "The selected node has been copied to clipboard.",
                                });
                            }
                        }
                    }}
                    tabIndex={0}
                >
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
                </div>
            </ReactFlowProvider>
            {Object.keys(workflowTestResults).length > 0 && (
                <div className="p-4 bg-gray-800 border-t border-cyan-700">
                    <h2 className="text-lg font-bold text-cyan-400 mb-2">Workflow Test Results</h2>
                    {Object.entries(workflowTestResults).map(([nodeId, result]) => (
                        <div key={nodeId} className="mb-4">
                            <h3 className="text-md font-semibold text-cyan-400">Node: {nodeId}</h3>
                            <p className="text-sm text-gray-300">Status: {result.status}</p>
                            <pre className="bg-gray-900 p-2 rounded-lg mt-2 text-xs overflow-auto max-h-40">
                                {result.status === 'success'
                                    ? JSON.stringify(result.data, null, 2)
                                    : result.message}
                            </pre>
                        </div>
                    ))}
                </div>
            )}
            {errorLog.length > 0 && (
                <div className="p-4 bg-gray-800 border-t border-cyan-700">
                    <h2 className="text-lg font-bold text-cyan-400 mb-2">Error Log</h2>
                    <ul className="list-disc list-inside text-red-400">
                        {errorLog.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default QuantumNexusWorkflowBuilder;