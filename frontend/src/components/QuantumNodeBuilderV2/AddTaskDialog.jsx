// components/AddTaskDialog.jsx
"use client";

import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

const AddTaskDialog = ({ onAddTask }) => {
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

    const handleCreateTask = () => {
        onAddTask(newTaskData);
        // Reset form
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
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Task
                </Button>
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
                    <Button onClick={handleCreateTask} className="bg-cyan-600 hover:bg-cyan-700 text-white">Create Task</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddTaskDialog;