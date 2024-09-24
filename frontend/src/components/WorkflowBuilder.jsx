// src/components/WorkflowBuilder.jsx

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { useNotification } from '@/components/ui/NotificationProvider';

const WorkflowBuilder = () => {
    const [tools, setTools] = useState([]);
    const [availableTools, setAvailableTools] = useState([]);
    const [workflowName, setWorkflowName] = useState('');
    const [selectedTool, setSelectedTool] = useState('');
    const addNotification = useNotification();

    useEffect(() => {
        // Fetch available tools from API
        async function fetchAvailableTools() {
            try {
                const response = await fetch('/api/tools'); // Ensure this endpoint is correctly implemented
                const data = await response.json();
                setAvailableTools(data);
            } catch (error) {
                console.error('Error fetching tools:', error);
                addNotification('Failed to fetch available tools.', 'error');
            }
        }

        fetchAvailableTools();
    }, [addNotification]);

    const handleAddTool = () => {
        if (selectedTool) {
            setTools([...tools, selectedTool]);
            setSelectedTool('');
        }
    };

    const handleRemoveTool = (index) => {
        const updatedTools = [...tools];
        updatedTools.splice(index, 1);
        setTools(updatedTools);
    };

    const handleSaveWorkflow = async () => {
        if (!workflowName || tools.length === 0) {
            addNotification('Please provide a workflow name and add at least one tool.', 'warning');
            return;
        }

        const workflow = {
            name: workflowName,
            tools: tools,
        };

        try {
            const response = await fetch('/api/workflows', { // Ensure this endpoint is correctly implemented
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(workflow),
            });

            if (response.ok) {
                addNotification('Workflow saved successfully!', 'success');
                setWorkflowName('');
                setTools([]);
            } else {
                addNotification('Failed to save workflow.', 'error');
            }
        } catch (error) {
            console.error('Error saving workflow:', error);
            addNotification('An error occurred while saving the workflow.', 'error');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Agent Workflow Builder</h2>
            <div className="mb-4">
                <Label htmlFor="workflow-name">Workflow Name</Label>
                <Input
                    id="workflow-name"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    placeholder="Enter workflow name"
                />
            </div>
            <div className="mb-4">
                <Label htmlFor="select-tool">Select Tool</Label>
                <div className="flex space-x-2">
                    <Select
                        value={selectedTool}
                        onValueChange={(value) => setSelectedTool(value)}
                    >
                        <SelectTrigger id="select-tool">
                            <SelectValue placeholder="Select a tool" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableTools.map((tool) => (
                                <SelectItem key={tool.id} value={tool.name}>
                                    {tool.name}
                                </SelectItem>
                            ))}
                            {availableTools.length === 0 && <SelectItem disabled>No tools available</SelectItem>}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleAddTool} disabled={!selectedTool}>
                        <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                </div>
            </div>
            <div className="mb-4">
                <Label>Selected Tools</Label>
                <ul className="list-disc list-inside">
                    {tools.map((tool, index) => (
                        <li key={index} className="flex justify-between items-center">
                            {tool}
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveTool(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
            <Button onClick={handleSaveWorkflow} disabled={!workflowName || tools.length === 0}>
                Save Workflow
            </Button>
        </div>
    );
};

export default WorkflowBuilder;
