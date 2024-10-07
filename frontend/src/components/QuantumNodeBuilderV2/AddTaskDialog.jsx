// components/AddTaskDialog.jsx
"use client";

import React, { useState } from 'react';
import { PlusCircle, Minus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import CustomColorPicker from './CustomColorPicker';

const AddTaskDialog = ({ onAddTask }) => {
    const [newTaskData, setNewTaskData] = useState({
        label: '',
        description: '',
        inputs: [{ id: 'input1', label: 'Input 1' }],
        outputs: [{ id: 'output1', label: 'Output 1' }],
        color: '#00FFFF',
        apiCalls: [{ url: '', method: 'GET', headers: '{}', payload: '{}' }],
    });
    const [selectedInputs, setSelectedInputs] = useState({});
    const [selectedOutputs, setSelectedOutputs] = useState({});

    const addInput = () => {
        setNewTaskData((prev) => ({
            ...prev,
            inputs: [...prev.inputs, { id: `input${prev.inputs.length + 1}`, label: `Input ${prev.inputs.length + 1}` }],
        }));
    };

    const removeInput = (index) => {
        setNewTaskData((prev) => ({
            ...prev,
            inputs: prev.inputs.filter((_, i) => i !== index),
        }));
    };

    const addOutput = () => {
        setNewTaskData((prev) => ({
            ...prev,
            outputs: [...prev.outputs, { id: `output${prev.outputs.length + 1}`, label: `Output ${prev.outputs.length + 1}` }],
        }));
    };

    const removeOutput = (index) => {
        setNewTaskData((prev) => ({
            ...prev,
            outputs: prev.outputs.filter((_, i) => i !== index),
        }));
    };

    const addApiCall = () => {
        setNewTaskData((prev) => ({
            ...prev,
            apiCalls: [...prev.apiCalls, { url: '', method: 'GET', headers: '{}', payload: '{}' }],
        }));
    };

    const removeApiCall = (index) => {
        setNewTaskData((prev) => ({
            ...prev,
            apiCalls: prev.apiCalls.filter((_, i) => i !== index),
        }));
    };

    const handleCreateTask = () => {
        onAddTask({
            ...newTaskData,
            selectedInputs,
            selectedOutputs,
        });
        // Reset form
        setNewTaskData({
            label: '',
            description: '',
            inputs: [{ id: 'input1', label: 'Input 1' }],
            outputs: [{ id: 'output1', label: 'Output 1' }],
            color: '#00FFFF',
            apiCalls: [{ url: '', method: 'GET', headers: '{}', payload: '{}' }],
        });
        setSelectedInputs({});
        setSelectedOutputs({});
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-cyan-400 border-cyan-500 max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-cyan-400">Create New Quantum Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
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
                    <CustomColorPicker
                        currentColor={newTaskData.color}
                        onChangeColor={(color) => setNewTaskData({ ...newTaskData, color })}
                    />
                    <div>
                        <Label className="text-cyan-400">Inputs</Label>
                        {newTaskData.inputs.map((input, index) => (
                            <div key={input.id} className="flex items-center mb-2">
                                <Input
                                    value={input.label}
                                    onChange={(e) => {
                                        const updatedInputs = [...newTaskData.inputs];
                                        updatedInputs[index].label = e.target.value;
                                        setNewTaskData({ ...newTaskData, inputs: updatedInputs });
                                    }}
                                    className="flex-grow bg-gray-700 text-cyan-400 border-cyan-500"
                                />
                                <Select
                                    value={selectedInputs[input.id] || ''}
                                    onValueChange={(value) => setSelectedInputs({...selectedInputs, [input.id]: value})}
                                >
                                    <SelectTrigger className="bg-gray-700 border-cyan-500">
                                        <SelectValue placeholder="Select API" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {newTaskData.apiCalls.map((api, apiIndex) => (
                                            <SelectItem key={apiIndex} value={`api-${apiIndex}`}>
                                                {api.url}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={() => removeInput(index)} className="ml-2 bg-red-600 hover:bg-red-700">
                                    <Minus className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button onClick={addInput} className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white">Add Input</Button>
                    </div>
                    <div>
                        <Label className="text-cyan-400">Outputs</Label>
                        {newTaskData.outputs.map((output, index) => (
                            <div key={output.id} className="flex items-center mb-2">
                                <Input
                                    value={output.label}
                                    onChange={(e) => {
                                        const updatedOutputs = [...newTaskData.outputs];
                                        updatedOutputs[index].label = e.target.value;
                                        setNewTaskData({ ...newTaskData, outputs: updatedOutputs });
                                    }}
                                    className="flex-grow bg-gray-700 text-cyan-400 border-cyan-500"
                                />
                                <Select
                                    value={selectedOutputs[output.id] || ''}
                                    onValueChange={(value) => setSelectedOutputs({...selectedOutputs, [output.id]: value})}
                                >
                                    <SelectTrigger className="bg-gray-700 border-cyan-500">
                                        <SelectValue placeholder="Select API" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {newTaskData.apiCalls.map((api, apiIndex) => (
                                            <SelectItem key={apiIndex} value={`api-${apiIndex}`}>
                                                {api.url}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={() => removeOutput(index)} className="ml-2 bg-red-600 hover:bg-red-700">
                                    <Minus className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <Button onClick={addOutput} className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white">Add Output</Button>
                    </div>
                    <div>
                        <Label className="text-cyan-400">API Calls</Label>
                        {newTaskData.apiCalls.map((apiCall, index) => (
                            <div key={index} className="mb-4 p-4 border border-cyan-500 rounded">
                                <Input
                                    value={apiCall.url}
                                    onChange={(e) => {
                                        const updatedApiCalls = [...newTaskData.apiCalls];
                                        updatedApiCalls[index].url = e.target.value;
                                        setNewTaskData({ ...newTaskData, apiCalls: updatedApiCalls });
                                    }}
                                    placeholder="API URL"
                                    className="mb-2 bg-gray-700 text-cyan-400 border-cyan-500"
                                />
                                <Select
                                    value={apiCall.method}
                                    onValueChange={(value) => {
                                        const updatedApiCalls = [...newTaskData.apiCalls];
                                        updatedApiCalls[index].method = value;
                                        setNewTaskData({ ...newTaskData, apiCalls: updatedApiCalls });
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
                                        const updatedApiCalls = [...new

TaskData.apiCalls];
                                        updatedApiCalls[index].headers = e.target.value;
                                        setNewTaskData({ ...newTaskData, apiCalls: updatedApiCalls });
                                    }}
                                    placeholder="Headers (JSON)"
                                    className="mt-2 bg-gray-700 text-cyan-400 border-cyan-500"
                                />
                                <Textarea
                                    value={apiCall.payload}
                                    onChange={(e) => {
                                        const updatedApiCalls = [...newTaskData.apiCalls];
                                        updatedApiCalls[index].payload = e.target.value;
                                        setNewTaskData({ ...newTaskData, apiCalls: updatedApiCalls });
                                    }}
                                    placeholder="Payload (JSON)"
                                    className="mt-2 bg-gray-700 text-cyan-400 border-cyan-500"
                                />
                                <Button onClick={() => removeApiCall(index)} className="mt-2 bg-red-600 hover:bg-red-700">
                                    Remove API Call
                                </Button>
                            </div>
                        ))}
                        <Button onClick={addApiCall} className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white">Add API Call</Button>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreateTask} className="bg-cyan-600 hover:bg-cyan-700 text-white">Create Task</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddTaskDialog;