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
import { PlusCircle, Trash2, Save, Upload, Settings, Play, ChevronDown, ChevronUp, Copy } from 'lucide-react';
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
    const { setNodes, getNodes, getEdges, setEdges, getNode } = useReactFlow();
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
                    <CustomColorPicker currentColor={data.color} onChangeColor={changeNodeColor} />
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

export default QuantumNode;