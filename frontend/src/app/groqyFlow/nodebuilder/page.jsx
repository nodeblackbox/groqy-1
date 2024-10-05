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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Trash2, Save, Upload, Settings } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const nodeTypes = {};

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
            if (node.id === id)
            {
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
        if (incomingEdge)
        {
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
                                <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white">Save</Button>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm mb-4" style={{ color: data.color }}>{data.description}</p>
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

const QuantumNexusWorkflowBuilder = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [newTaskData, setNewTaskData] = useState({
        label: '',
        description: '',
        inputs: [{ id: 'input1', label: 'Input 1' }],
        outputs: [{ id: 'output1', label: 'Output 1' }],
        color: '#00FFFF',
    });
    const reactFlowWrapper = useRef(null);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [errorLog, setErrorLog] = useState([]);

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
            });
            setIsAddingTask(false);
            toast({
                title: "Task Added",
                description: "New quantum task has been added to the workflow.",
            });
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
            toast({
                title: "Task Removed",
                description: "Quantum task has been removed from the workflow.",
            });
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
        if (file)
        {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                try
                {
                    const workflow = JSON.parse(content);
                    setNodes(workflow.nodes || []);
                    setEdges(workflow.edges || []);
                    toast({
                        title: "Workflow Loaded",
                        description: "Your Quantum Nexus workflow has been loaded successfully.",
                    });
                } catch (error)
                {
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

    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode)
        {
            root.classList.add('dark');
        } else
        {
            root.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <div className={`h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
            <div className="p-4 bg-gray-900 border-b border-cyan-700 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-cyan-400">Quantum Nexus Workflow Builder</h1>
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
                                <div>
                                    <Label htmlFor="taskLabel" className="text-cyan-400">Task Label</Label>
                                    <Input
                                        id="taskLabel"
                                        value={newTaskData.label}
                                        onChange={(e) => setNewTaskData({ ...newTaskData, label: e.target.value })}
                                        placeholder="Enter task label"
                                        className="bg-gray-700 text-cyan-400 border-cyan-500"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="taskDescription" className="text-cyan-400">Task Description</Label>
                                    <Textarea
                                        id="taskDescription"
                                        value={newTaskData.description}
                                        onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                                        placeholder="Enter task description"
                                        className="bg-gray-700 text-cyan-400 border-cyan-500"
                                    />
                                </div>
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
                                    <Button onClick={addInput} variant="outline" size="sm" className="text-cyan-400 border-cyan-500">Add Input</Button>
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
                                    <Button onClick={addOutput} variant="outline" size="sm" className="text-cyan-400 border-cyan-500">Add Output</Button>
                                </div>
                                <div>
                                    <Label htmlFor="nodeColor" className="text-cyan-400">Node Color</Label>
                                    <Input
                                        id="nodeColor"
                                        type="color"
                                        value={newTaskData.color}
                                        onChange={(e) => setNewTaskData({ ...newTaskData, color: e.target.value })}
                                        className="h-10 bg-gray-700 text-cyan-400 border-cyan-500"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={() => {
                                    const newNode = {
                                        id: `quantum-${nodes.length + 1}`,
                                        type: 'quantumNode',
                                        position: { x: 100, y: 100 },
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
                                    setIsAddingTask(false);
                                    toast({
                                        title: "Quantum Task Added",
                                        description: "Your new quantum task has been added to the workflow.",
                                    });
                                }}
                                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                            >
                                Create Quantum Task
                            </Button>
                        </DialogContent>
                    </Dialog>
                    <Button onClick={saveWorkflow} className="bg-cyan-600 hover:bg-cyan-700 text-white"><Save className="mr-2 h-4 w-4" /> Save Workflow</Button>
                    <label htmlFor="load-workflow">
                        <Button as="span" className="bg-cyan-600 hover:bg-cyan-700 text-white"><Upload className="mr-2 h-4 w-4" /> Load Workflow</Button>
                    </label>
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
                                <DialogTitle className="text-cyan-400">Quantum Nexus Settings</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="apiKey" className="text-cyan-400">API Key</Label>
                                    <Input
                                        id="apiKey"
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="Enter your API key"
                                        className="bg-gray-700 text-cyan-400 border-cyan-500"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="model" className="text-cyan-400">Model</Label>
                                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                                        <SelectTrigger className="bg-gray-700 text-cyan-400 border-cyan-500">
                                            <SelectValue placeholder="Select a model" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-700 text-cyan-400 border-cyan-500">
                                            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                            <SelectItem value="gpt-4">GPT-4</SelectItem>
                                            <SelectItem value="quantum-model">Quantum Model</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="dark-mode"
                                        checked={isDarkMode}
                                        onCheckedChange={setIsDarkMode}
                                    />
                                    <Label htmlFor="dark-mode" className="text-cyan-400">Dark Mode</Label>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <ReactFlowProvider>
                <div ref={reactFlowWrapper} className="flex-grow bg-gray-900">
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
                        snapToGrid
                        snapGrid={[15, 15]}
                        defaultEdgeOptions={{
                            animated: true,
                            type: 'smoothstep'
                        }}
                    >
                        <Background color="#00FFFF" variant="dots" gap={12} size={1} />
                        <Controls className="bg-gray-800 text-cyan-400 border-cyan-500" />
                        <MiniMap
                            nodeStrokeColor={(n) => n.data.color}
                            nodeColor={(n) => n.data.color}
                        />
                    </ReactFlow>
                </div>
            </ReactFlowProvider>
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