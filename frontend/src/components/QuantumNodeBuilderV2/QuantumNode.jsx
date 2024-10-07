// components/QuantumNode.jsx
"use client";

import React, { useState } from 'react';
import ReactFlow, { Handle, Position, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle, Minus, Save, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSub,
    ContextMenuSubTrigger,
    ContextMenuSubContent,
} from "@/components/ui/context-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CustomColorPicker from './CustomColorPicker';

const defaultColors = [
    '#00FFFF', '#FF00FF', '#FFFF00', '#FF0000', '#00FF00', '#0000FF',
];

const QuantumNode = ({ data, id }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(data);
    const { setNodes, getNodes, getEdges, setEdges, getNode } = useReactFlow();
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [isTestingOpen, setIsTestingOpen] = useState(false);
    const [testResult, setTestResult] = useState("");
    const [isResultsOpen, setIsResultsOpen] = useState(false);
    const [selectedInputs, setSelectedInputs] = useState(data.selectedInputs || {});
    const [selectedOutputs, setSelectedOutputs] = useState(data.selectedOutputs || {});

    const handleSave = () => {
        data.onUpdate({ ...editedData, selectedInputs, selectedOutputs });
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

    const handleTestAPI = async (apiCall) => {
        try {
            const response = await fetch(apiCall.url, {
                method: apiCall.method,
                headers: JSON.parse(apiCall.headers),
                body: apiCall.method !== 'GET' ? apiCall.payload : undefined,
            });
            const result = await response.json();
            return JSON.stringify(result, null, 2);
        } catch (error) {
            return `Error: ${error.message}`;
        }
    };

    const runAllTests = async () => {
        const results = await Promise.all(editedData.apiCalls.map(handleTestAPI));
        setTestResult(results.join('\n\n'));
        setIsResultsOpen(true);
        toast({
            title: "API Tests Completed",
            description: "All API tests have been executed.",
        });
    };

    const addApiCall = () => {
        setEditedData({
            ...editedData,
            apiCalls: [...editedData.apiCalls, { url: '', method: 'GET', headers: '{}', payload: '{}' }],
        });
    };

    const removeApiCall = (index) => {
        setEditedData({
            ...editedData,
            apiCalls: editedData.apiCalls.filter((_, i) => i !== index),
        });
    };

    const addInput = () => {
        setEditedData({
            ...editedData,
            inputs: [...editedData.inputs, { id: `input-${editedData.inputs.length + 1}`, label: `Input ${editedData.inputs.length + 1}` }],
        });
    };

    const removeInput = (index) => {
        setEditedData({
            ...editedData,
            inputs: editedData.inputs.filter((_, i) => i !== index),
        });
    };

    const addOutput = () => {
        setEditedData({
            ...editedData,
            outputs: [...editedData.outputs, { id: `output-${editedData.outputs.length + 1}`, label: `Output ${editedData.outputs.length + 1}` }],
        });
    };

    const removeOutput = (index) => {
        setEditedData({
            ...editedData,
            outputs: editedData.outputs.filter((_, i) => i !== index),
        });
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <Card 
                    className="w-96 bg-gray-900 border-2 rounded-lg overflow-hidden shadow-lg transition-all duration-300" 
                    style={{ 
                        borderColor: data.color,
                        boxShadow: `0 0 20px ${data.color}`,
                    }}
                >
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
                                {editedData.apiCalls.map((apiCall, index) => (
                                    <div key={index} className="space-y-2 p-2 border border-gray-700 rounded">
                                        <Input
                                            value={apiCall.url}
                                            onChange={(e) => {
                                                const newApiCalls = [...editedData.apiCalls];
                                                newApiCalls[index].url = e.target.value;
                                                setEditedData({ ...editedData, apiCalls: newApiCalls });
                                            }}
                                            placeholder="API URL"
                                            className="bg-gray-700 border-cyan-500"
                                        />
                                        <Select
                                            value={apiCall.method}
                                            onValueChange={(value) => {
                                                const newApiCalls = [...editedData.apiCalls];
                                                newApiCalls[index].method = value;
                                                setEditedData({ ...editedData, apiCalls: newApiCalls });
                                            }}
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
                                            value={apiCall.headers}
                                            onChange={(e) => {
                                                const newApiCalls = [...editedData.apiCalls];
                                                newApiCalls[index].headers = e.target.value;
                                                setEditedData({ ...editedData, apiCalls: newApiCalls });
                                            }}
                                            placeholder="Headers (JSON)"
                                            className="bg-gray-700 border-cyan-500"
                                        />
                                        <Textarea
                                            value={apiCall.payload}
                                            onChange={(e) => {
                                                const newApiCalls = [...editedData.apiCalls];
                                                newApiCalls[index].payload = e.target.value;
                                                setEditedData({ ...editedData, apiCalls: newApiCalls });
                                            }}
                                            placeholder="Payload (JSON)"
                                            className="bg-gray-700 border-cyan-500"
                                        />
                                        <Button onClick={() => removeApiCall(index)} className="bg-red-600 hover:bg-red-700 text-white">
                                            <Minus className="mr-2 h-4 w-4" /> Remove API Call
                                        </Button>
                                    </div>
                                ))}
                                <Button onClick={addApiCall} className="bg-green-600 hover:bg-green-700 text-white">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add API Call
                                </Button>
                                <div>
                                    <Label className="text-cyan-400">Inputs</Label>
                                    {editedData.inputs.map((input, index) => (
                                        <div key={input.id} className="flex items-center space-x-2 my-2">
                                            <Input
                                                value={input.label}
                                                onChange={(e) => {
                                                    const newInputs = [...editedData.inputs];
                                                    newInputs[index].label = e.target.value;
                                                    setEditedData({ ...editedData, inputs: newInputs });
                                                }}
                                                className="bg-gray-700 border-cyan-500"
                                            />
                                            <Select
                                                value={selectedInputs[input.id] || ''}
                                                onValueChange={(value) => setSelectedInputs({...selectedInputs, [input.id]: value})}
                                            >
                                                <SelectTrigger className="bg-gray-700 border-cyan-500">
                                                    <SelectValue placeholder="Select API" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {editedData.apiCalls.map((api, apiIndex) => (
                                                        <SelectItem key={apiIndex} value={`api-${apiIndex}`}>
                                                            {api.url}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button onClick={() => removeInput(index)} className="bg-red-600 hover:bg-red-700 text-white">
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button onClick={addInput} className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white">
                                        <PlusCircle className="mr-2 h-4 w-4" /> Add Input
                                    </Button>
                                </div>
                                <div>
                                    <Label className="text-cyan-400">Outputs</Label>
                                    {editedData.outputs.map((output, index) => (
                                        <div key={output.id} className="flex items-center space-x-2 my-2">
                                            <Input
                                                value={output.label}
                                                onChange={(e) => {
                                                    const newOutputs = [...editedData.outputs];
                                                    newOutputs[index].label = e.target.value;
                                                    setEditedData({ ...editedData, outputs: newOutputs });
                                                }}
                                                className="bg-gray-700 border-cyan-500"
                                            />
                                            <Select
                                                value={selectedOutputs[output.id] || ''}
                                                onValueChange={(value) => setSelectedOutputs({...selectedOutputs, [output.id]: value})}
                                            >
                                                <SelectTrigger className="bg-gray-700 border-cyan-500">
                                                    <SelectValue placeholder="Select API" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {editedData.apiCalls.map((api, apiIndex) => (
                                                        <SelectItem key={apiIndex} value={`api-${apiIndex}`}>
                                                            {api.url}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button onClick={() => removeOutput(index)} className="bg-red-600 hover:bg-red-700 text-white">
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    <Button onClick={addOutput} className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white">
                                        <PlusCircle className="mr-2 h-4 w-4" /> Add Output
                                    </Button>
                                </div>
                                <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white">Save</Button>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm mb-4" style={{ color: data.color }}>{data.description}</p>
                                <Button onClick={() => setIsEditing(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white mr-2">Edit</Button>
                                <Button onClick={() => setIsTestingOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">Test APIs</Button>
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
                    <CustomColorPicker currentColor={data.color} onChangeColor={changeNodeColor} />
                </PopoverContent>
            </Popover>
            <Dialog open={isTestingOpen} onOpenChange={setIsTestingOpen}>
                <DialogContent className="bg-gray-800 text-white">
                    <DialogHeader>
                        <DialogTitle>API Test Results</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Button onClick={runAllTests} className="bg-purple-600 hover:bg-purple-700 text-white">
                            Run All Tests
                        </Button>
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

export default QuantumNode;