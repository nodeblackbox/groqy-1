'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast, Toaster } from 'react-hot-toast';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Code, Copy, Play, Download, Upload, Trash, Plus, Folder, ArrowRight } from 'lucide-react';
import { saveAs } from 'file-saver';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import SortableItem from '@/components/APITestV5/SortableItem';

import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

const PayloadTester = () => {
    // State variables
    const [selectedApi, setSelectedApi] = useState('');
    const [selectedAction, setSelectedAction] = useState('');
    const [apiActions, setApiActions] = useState({
        gravrag: [
            { name: 'Create Memory', value: 'create_memory', endpoint: '/gravrag/api/memory/create', method: 'POST' },
            { name: 'Recall Memory', value: 'recall_memory', endpoint: '/gravrag/api/memory/recall', method: 'GET' },
            { name: 'Prune Memories', value: 'prune_memories', endpoint: '/gravrag/api/memory/prune', method: 'POST' }
        ],
        neural_resources: [
            { name: 'Route Query', value: 'route_query', endpoint: '/neural_resources/route_query', method: 'POST' },
            { name: 'Set API Key', value: 'set_api_key', endpoint: '/neural_resources/set_api_key', method: 'POST' },
            { name: 'Available Models', value: 'available_models', endpoint: '/neural_resources/available_models', method: 'GET' },
            { name: 'Model Info', value: 'model_info', endpoint: '/neural_resources/model_info', method: 'GET' }
        ]
    });
    const [headers, setHeaders] = useState([
        { key: 'Content-Type', value: 'application/json' }
    ]);
    const [payload, setPayload] = useState('{}');
    const [savedRequests, setSavedRequests] = useState([]);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importedRequest, setImportedRequest] = useState('{}');
    const [response, setResponse] = useState(null);
    const [messages, setMessages] = useState([
        { role: 'bot', content: "Welcome! Select an API and action to get started." }
    ]);
    const [tasks, setTasks] = useState([]);

    // Drag and Drop Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    // Load saved requests and tasks from localStorage on mount
    useEffect(() => {
        const storedRequests = JSON.parse(localStorage.getItem('savedRequests') || '[]');
        setSavedRequests(storedRequests);
        const storedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        setTasks(storedTasks);
    }, []);

    // Save requests and tasks to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('savedRequests', JSON.stringify(savedRequests));
    }, [savedRequests]);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    // Header Management Functions
    const addHeader = () => {
        setHeaders([...headers, { key: '', value: '' }]);
    };

    const updateHeader = (index, field, value) => {
        const newHeaders = [...headers];
        newHeaders[index][field] = value;
        setHeaders(newHeaders);
    };

    const removeHeader = (index) => {
        const newHeaders = headers.filter((_, i) => i !== index);
        setHeaders(newHeaders);
    };

    // Payload Validation
    const validatePayload = () => {
        try
        {
            JSON.parse(payload);
            return true;
        } catch (error)
        {
            return false;
        }
    };

    // Save Current Request
    const addRequest = () => {
        if (!selectedApi || !selectedAction)
        {
            toast.error('Please select both API and Action before saving the request.');
            return;
        }
        if (!validatePayload())
        {
            toast.error('Invalid JSON payload. Cannot save request.');
            return;
        }
        try
        {
            const parsedPayload = JSON.parse(payload);
            const actionDetails = apiActions[selectedApi].find(a => a.value === selectedAction);
            if (!actionDetails)
            {
                toast.error('Selected action not found.');
                return;
            }
            const newRequest = {
                id: Date.now(),
                name: `Request_${savedRequests.length + 1}`,
                api: selectedApi,
                action: selectedAction,
                headers: headers,
                payload: parsedPayload,
                endpoint: actionDetails.endpoint,
                method: actionDetails.method,
            };
            setSavedRequests([...savedRequests, newRequest]);
            toast.success('Request saved successfully!');
        } catch (error)
        {
            toast.error('An error occurred while saving the request.');
        }
    };

    // Send Current Request
    const handleSendRequest = async () => {
        if (!selectedApi || !selectedAction)
        {
            toast.error('Please select both API and Action.');
            return;
        }

        let parsedPayload = {};
        try
        {
            parsedPayload = payload ? JSON.parse(payload) : {};
        } catch (error)
        {
            toast.error('Invalid JSON payload.');
            return;
        }

        // Construct headers object
        const headersObj = {};
        headers.forEach(header => {
            if (header.key && header.value)
            {
                headersObj[header.key] = header.value;
            }
        });

        // Find action details
        const actionDetails = apiActions[selectedApi].find(a => a.value === selectedAction);
        if (!actionDetails)
        {
            toast.error('Selected action not found.');
            return;
        }

        let url = `http://localhost:8000${actionDetails.endpoint}`;
        const options = {
            method: actionDetails.method,
            headers: headersObj,
        };

        if (actionDetails.method === 'GET')
        {
            const queryParams = new URLSearchParams(parsedPayload).toString();
            url += queryParams ? `?${queryParams}` : '';
        } else
        {
            options.body = JSON.stringify(parsedPayload);
        }

        // Log user message
        const userMessage = `Sending ${actionDetails.method} request to ${actionDetails.endpoint}`;
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

        try
        {
            const res = await fetch(url, options);
            const data = await res.json();

            if (!res.ok)
            {
                throw new Error(data.message || 'API request failed.');
            }

            setResponse(data);
            setMessages(prev => [...prev, { role: 'bot', content: JSON.stringify(data, null, 2) }]);
            toast.success('Request sent successfully!');
        } catch (error)
        {
            setResponse(null);
            setMessages(prev => [...prev, { role: 'bot', content: `Error: ${error.message}` }]);
            toast.error(`Error: ${error.message}`);
        }
    };

    // Send Saved Request
    const handleSendSavedRequest = async (request) => {
        const { endpoint, method, headers: reqHeaders, payload: reqPayload } = request;

        let url = `http://localhost:8000${endpoint}`;
        const options = {
            method: method,
            headers: {},
        };

        // Set headers
        reqHeaders.forEach(header => {
            if (header.key && header.value)
            {
                options.headers[header.key] = header.value;
            }
        });

        if (method === 'GET')
        {
            const queryParams = new URLSearchParams(reqPayload).toString();
            url += queryParams ? `?${queryParams}` : '';
        } else
        {
            options.body = JSON.stringify(reqPayload);
        }

        // Log user message
        const userMessage = `Sending ${method} request to ${endpoint}`;
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

        try
        {
            const res = await fetch(url, options);
            const data = await res.json();

            if (!res.ok)
            {
                throw new Error(data.message || 'API request failed.');
            }

            setResponse(data);
            setMessages(prev => [...prev, { role: 'bot', content: JSON.stringify(data, null, 2) }]);
            toast.success(`Request "${request.name}" sent successfully!`);
        } catch (error)
        {
            setResponse(null);
            setMessages(prev => [...prev, { role: 'bot', content: `Error in "${request.name}": ${error.message}` }]);
            toast.error(`Error in "${request.name}": ${error.message}`);
        }
    };

    // Import Request
    const importRequest = () => {
        try
        {
            const parsedRequest = JSON.parse(importedRequest);
            const newRequest = {
                id: Date.now(),
                name: parsedRequest.name || `Imported_Request_${savedRequests.length + 1}`,
                api: parsedRequest.api || '',
                action: parsedRequest.action || '',
                headers: parsedRequest.headers || [],
                payload: parsedRequest.payload || {},
                endpoint: parsedRequest.endpoint || '',
                method: parsedRequest.method || 'GET',
            };
            setSavedRequests([...savedRequests, newRequest]);
            setIsImportModalOpen(false);
            setImportedRequest('{}');
            toast.success('Request imported successfully!');
        } catch (error)
        {
            toast.error('Invalid JSON format. Cannot import request.');
        }
    };

    // Export All Requests
    const exportAllRequests = () => {
        if (savedRequests.length === 0)
        {
            toast.error('No requests to export.');
            return;
        }
        const blob = new Blob([JSON.stringify(savedRequests, null, 2)], { type: 'application/json' });
        saveAs(blob, `All_Saved_Requests_${Date.now()}.json`);
        toast.success('All requests exported successfully!');
    };

    // Handle Test All Requests
    const handleTestAllRequests = async () => {
        if (savedRequests.length === 0)
        {
            toast.error('No saved requests to test.');
            return;
        }

        for (const request of savedRequests)
        {
            try
            {
                const { endpoint, method, headers: reqHeaders, payload: reqPayload, name } = request;

                let url = `http://localhost:8000${endpoint}`;
                const options = {
                    method: method,
                    headers: {},
                };

                // Set headers
                reqHeaders.forEach(header => {
                    if (header.key && header.value)
                    {
                        options.headers[header.key] = header.value;
                    }
                });

                if (method === 'GET')
                {
                    const queryParams = new URLSearchParams(reqPayload).toString();
                    url += queryParams ? `?${queryParams}` : '';
                } else
                {
                    options.body = JSON.stringify(reqPayload);
                }

                // Log user message
                const userMessage = `Sending ${method} request to ${endpoint}`;
                setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

                const res = await fetch(url, options);
                const data = await res.json();

                if (!res.ok)
                {
                    throw new Error(data.message || 'API request failed.');
                }

                setResponse(data);
                setMessages(prev => [...prev, { role: 'bot', content: JSON.stringify(data, null, 2) }]);
                toast.success(`Request "${name}" sent successfully!`);
            } catch (error)
            {
                setResponse(null);
                setMessages(prev => [...prev, { role: 'bot', content: `Error in "${request.name}": ${error.message}` }]);
                toast.error(`Error in "${request.name}": ${error.message}`);
            }
        }
    };

    // Handle Response Data Selection
    const handleSelectResponseData = () => {
        if (!response)
        {
            toast.error('No response data to select.');
            return;
        }
        const selectedText = window.getSelection().toString();
        if (selectedText)
        {
            navigator.clipboard.writeText(selectedText);
            toast.success('Selected data copied to clipboard!');
        } else
        {
            toast.error('No text selected.');
        }
    };

    // Drag and Drop Handlers for Tasks and Subtasks
    const onDragEnd = (event) => {
        const { active, over, type } = event;

        if (!over) return;

        if (type === 'task')
        {
            if (active.id !== over.id)
            {
                const oldIndex = tasks.findIndex(task => task.id.toString() === active.id);
                const newIndex = tasks.findIndex(task => task.id.toString() === over.id);
                setTasks(arrayMove(tasks, oldIndex, newIndex));
            }
        }

        if (type === 'subtask')
        {
            const [activeTaskId, activeSubtaskId] = active.id.split('-');
            const [overTaskId, overSubtaskId] = over.id.split('-');

            if (activeTaskId === overTaskId)
            {
                const task = tasks.find(t => t.id.toString() === activeTaskId);
                const oldIndex = task.subtasks.findIndex(st => st.id.toString() === activeSubtaskId);
                const newIndex = task.subtasks.findIndex(st => st.id.toString() === overSubtaskId);
                const updatedSubtasks = arrayMove(task.subtasks, oldIndex, newIndex);
                setTasks(tasks.map(t => t.id.toString() === activeTaskId ? { ...t, subtasks: updatedSubtasks } : t));
            } else
            {
                // Moving subtask between tasks
                const activeTask = tasks.find(t => t.id.toString() === activeTaskId);
                const overTask = tasks.find(t => t.id.toString() === overTaskId);
                const subtask = activeTask.subtasks.find(st => st.id.toString() === activeSubtaskId);

                const newActiveSubtasks = activeTask.subtasks.filter(st => st.id.toString() !== activeSubtaskId);
                const overIndex = overTask.subtasks.findIndex(st => st.id.toString() === overSubtaskId);
                const newOverSubtasks = [...overTask.subtasks];
                newOverSubtasks.splice(overIndex, 0, subtask);

                setTasks(tasks.map(t => {
                    if (t.id.toString() === activeTaskId)
                    {
                        return { ...t, subtasks: newActiveSubtasks };
                    }
                    if (t.id.toString() === overTaskId)
                    {
                        return { ...t, subtasks: newOverSubtasks };
                    }
                    return t;
                }));
            }
        }
    };

    // Add Task
    const addTask = () => {
        const newTask = {
            id: Date.now(),
            name: `Task_${tasks.length + 1}`,
            subtasks: []
        };
        setTasks([...tasks, newTask]);
        toast.success('Task added successfully!');
    };

    // Add Subtask to a Task
    const addSubtask = (taskId) => {
        const newSubtask = {
            id: Date.now(),
            name: `Subtask_${tasks.find(task => task.id === taskId).subtasks.length + 1}`,
            request: null
        };
        setTasks(tasks.map(task => {
            if (task.id === taskId)
            {
                return { ...task, subtasks: [...task.subtasks, newSubtask] };
            }
            return task;
        }));
        toast.success('Subtask added successfully!');
    };

    // Assign Request to Subtask
    const assignRequestToSubtask = (taskId, subtaskId, request) => {
        if (!request)
        {
            toast.error('Invalid Request ID.');
            return;
        }
        setTasks(tasks.map(task => {
            if (task.id === taskId)
            {
                const updatedSubtasks = task.subtasks.map(subtask => {
                    if (subtask.id === subtaskId)
                    {
                        return { ...subtask, request: request };
                    }
                    return subtask;
                });
                return { ...task, subtasks: updatedSubtasks };
            }
            return task;
        }));
        toast.success('Request assigned to subtask!');
    };

    return (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            <Card className="w-full max-w-6xl mx-auto my-8 p-6 bg-gray-900 text-white rounded-lg shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl">Payload Tester</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* API and Action Selection */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        {/* Select API */}
                        <div>
                            <Label htmlFor="api-select" className="block mb-2">Select API</Label>
                            <Select value={selectedApi} onValueChange={(value) => { setSelectedApi(value); setSelectedAction(''); }}>
                                <SelectTrigger id="api-select">
                                    <SelectValue placeholder="Choose an API" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(apiActions).map(api => (
                                        <SelectItem key={api} value={api}>
                                            {api.replace('_', ' ').toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Select Action */}
                        <div>
                            <Label htmlFor="action-select" className="block mb-2">Select Action</Label>
                            <Select value={selectedAction} onValueChange={setSelectedAction} disabled={!selectedApi}>
                                <SelectTrigger id="action-select">
                                    <SelectValue placeholder="Choose an action" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedApi && apiActions[selectedApi].map(action => (
                                        <SelectItem key={action.value} value={action.value}>
                                            {action.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Header Management */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xl font-semibold">Headers</h3>
                            <Button onClick={addHeader} className="bg-green-600 hover:bg-green-700 flex items-center">
                                <Plus size={16} className="mr-1" /> Add Header
                            </Button>
                        </div>
                        {headers.map((header, index) => (
                            <div key={index} className="flex space-x-2 mb-2">
                                <Input
                                    placeholder="Key"
                                    value={header.key}
                                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                                    className="bg-gray-800"
                                />
                                <Input
                                    placeholder="Value"
                                    value={header.value}
                                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                                    className="bg-gray-800"
                                />
                                <Button onClick={() => removeHeader(index)} className="bg-red-600 hover:bg-red-700">
                                    <Trash size={16} />
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Payload Editor */}
                    <div className="mb-6">
                        <Label htmlFor="payload" className="block mb-2">Payload (JSON)</Label>
                        <Textarea
                            id="payload"
                            value={payload}
                            onChange={(e) => setPayload(e.target.value)}
                            className="w-full h-32 p-2 font-mono text-sm bg-gray-800 text-white border border-gray-700 rounded"
                            style={{ resize: 'vertical' }}
                        />
                        {!validatePayload() && <p className="text-red-500 mt-1">Invalid JSON format.</p>}
                    </div>

                    {/* Request Management Buttons */}
                    <div className="flex space-x-4 mb-6">
                        <Button
                            onClick={addRequest}
                            className="bg-blue-600 hover:bg-blue-700 flex items-center"
                        >
                            <Plus size={16} className="mr-1" /> Save Request
                        </Button>
                        <Button
                            onClick={handleSendRequest}
                            disabled={!validatePayload() || !selectedApi || !selectedAction}
                            className="bg-purple-600 hover:bg-purple-700 flex items-center"
                        >
                            <Play size={16} className="mr-1" /> Send Request
                        </Button>
                        <Button
                            onClick={handleTestAllRequests}
                            disabled={savedRequests.length === 0}
                            className="bg-indigo-600 hover:bg-indigo-700 flex items-center"
                        >
                            <Code size={16} className="mr-1" /> Test All
                        </Button>
                        <Button
                            onClick={() => setIsImportModalOpen(true)}
                            className="bg-teal-600 hover:bg-teal-700 flex items-center"
                        >
                            <Upload size={16} className="mr-1" /> Import Request
                        </Button>
                        <Button
                            onClick={exportAllRequests}
                            disabled={savedRequests.length === 0}
                            className="bg-orange-600 hover:bg-orange-700 flex items-center"
                        >
                            <Download size={16} className="mr-1" /> Export All
                        </Button>
                    </div>

                    {/* Drag and Drop Context */}
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={onDragEnd}
                    >
                        <SortableContext
                            items={tasks.map(task => task.id.toString())}
                            strategy={verticalListSortingStrategy}
                            type="task"
                        >
                            <div className="space-y-6">
                                {tasks.map((task, index) => (
                                    <SortableItem key={task.id} id={task.id.toString()} type="task">
                                        <Card className="bg-gray-800 text-white p-4 rounded-lg shadow">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <Folder size={20} />
                                                    <h4 className="text-lg font-semibold">{task.name}</h4>
                                                </div>
                                                <Button onClick={() => addSubtask(task.id)} className="bg-green-600 hover:bg-green-700 flex items-center">
                                                    <Plus size={16} className="mr-1" /> Add Subtask
                                                </Button>
                                            </div>
                                            {/* Subtasks */}
                                            <SortableContext
                                                items={task.subtasks.map(subtask => `${task.id}-${subtask.id}`)}
                                                strategy={verticalListSortingStrategy}
                                                type="subtask"
                                            >
                                                <div className="space-y-4">
                                                    {task.subtasks.map(subtask => (
                                                        <SortableItem key={subtask.id} id={`${task.id}-${subtask.id}`} type="subtask">
                                                            <Card className="bg-gray-700 text-white p-3 rounded-lg shadow-inner">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <div className="flex items-center space-x-2">
                                                                        <ArrowRight size={20} />
                                                                        <h5 className="text-md font-medium">{subtask.name}</h5>
                                                                    </div>
                                                                    {!subtask.request && (
                                                                        <Button onClick={() => {
                                                                            const requestId = prompt('Enter Request ID to assign:');
                                                                            const request = savedRequests.find(req => req.id === parseInt(requestId));
                                                                            if (request)
                                                                            {
                                                                                assignRequestToSubtask(task.id, subtask.id, request);
                                                                            } else
                                                                            {
                                                                                toast.error('Request not found.');
                                                                            }
                                                                        }} className="bg-blue-600 hover:bg-blue-700 flex items-center">
                                                                            <Plus size={16} className="mr-1" /> Assign Request
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                                {subtask.request && (
                                                                    <div className="space-y-2">
                                                                        <div className="flex justify-between items-center">
                                                                            <h6 className="font-semibold">{subtask.request.name}</h6>
                                                                            <div className="flex space-x-2">
                                                                                <CopyToClipboard text={JSON.stringify(subtask.request.payload, null, 2)} onCopy={handleSelectResponseData}>
                                                                                    <Button variant="ghost" size="sm">
                                                                                        <Copy size={16} />
                                                                                    </Button>
                                                                                </CopyToClipboard>
                                                                                <Button
                                                                                    onClick={() => handleSendSavedRequest(subtask.request)}
                                                                                    className="bg-blue-600 hover:bg-blue-700 flex items-center"
                                                                                >
                                                                                    <Play size={16} className="mr-1" /> Send
                                                                                </Button>
                                                                                <Button
                                                                                    onClick={() => {
                                                                                        // Unassign request
                                                                                        setTasks(tasks.map(t => {
                                                                                            if (t.id === task.id)
                                                                                            {
                                                                                                const updatedSubtasks = t.subtasks.map(st => {
                                                                                                    if (st.id === subtask.id)
                                                                                                    {
                                                                                                        return { ...st, request: null };
                                                                                                    }
                                                                                                    return st;
                                                                                                });
                                                                                                return { ...t, subtasks: updatedSubtasks };
                                                                                            }
                                                                                            return t;
                                                                                        }));
                                                                                        toast.success('Request unassigned from subtask!');
                                                                                    }}
                                                                                    className="bg-red-600 hover:bg-red-700 flex items-center"
                                                                                >
                                                                                    <Trash size={16} className="mr-1" /> Unassign
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                        <Textarea
                                                                            value={JSON.stringify(subtask.request.payload, null, 2)}
                                                                            readOnly
                                                                            className="w-full h-24 p-2 font-mono text-sm bg-gray-800 text-white border border-gray-700 rounded"
                                                                            style={{ resize: 'vertical' }}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </Card>
                                                        </SortableItem>
                                                    ))}
                                                </div>
                                            </SortableContext>
                                        </Card>
                                    </SortableItem>
                                ))}
                                {/** Placeholder for Droppable area */}
                            </div>
                        </SortableContext>
                    </DndContext>

                    {/* Saved Requests */}
                    <div className="mt-8">
                        <h3 className="text-2xl font-semibold mb-4">Saved Requests</h3>
                        {savedRequests.length === 0 ? (
                            <p className="text-gray-400">No payloads saved. Add a new payload above.</p>
                        ) : (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={onDragEnd}
                                >
                                    <SortableContext
                                        items={savedRequests.map(req => req.id.toString())}
                                        strategy={verticalListSortingStrategy}
                                        type="request"
                                    >
                                        <ul className="space-y-4">
                                            {savedRequests.map((payload, index) => (
                                                <SortableItem key={payload.id} id={payload.id.toString()} type="request">
                                                    <li className="bg-gray-800 p-4 rounded-lg shadow-inner flex flex-col">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <div className="flex items-center space-x-2">
                                                                <Code size={20} />
                                                                <h4 className="text-lg font-medium">{payload.name}</h4>
                                                            </div>
                                                            <div className="flex space-x-2">
                                                                <CopyToClipboard text={JSON.stringify(payload.payload, null, 2)} onCopy={handleSelectResponseData}>
                                                                    <Button variant="ghost" size="sm">
                                                                        <Copy size={16} />
                                                                    </Button>
                                                                </CopyToClipboard>
                                                                <Button
                                                                    onClick={() => handleSendSavedRequest(payload)}
                                                                    className="bg-blue-600 hover:bg-blue-700 flex items-center"
                                                                >
                                                                    <Play size={16} className="mr-1" /> Send
                                                                </Button>
                                                                <Button
                                                                    onClick={() => {
                                                                        // Edit functionality can be implemented here
                                                                        toast.info('Edit functionality not implemented.');
                                                                    }}
                                                                    className="bg-yellow-600 hover:bg-yellow-700 flex items-center"
                                                                >
                                                                    <Code size={16} className="mr-1" /> Edit
                                                                </Button>
                                                                <Button
                                                                    onClick={() => {
                                                                        // Delete request
                                                                        setSavedRequests(savedRequests.filter(req => req.id !== payload.id));
                                                                        toast.success('Payload deleted.');
                                                                    }}
                                                                    className="bg-red-600 hover:bg-red-700 flex items-center"
                                                                >
                                                                    <Trash size={16} className="mr-1" /> Delete
                                                                </Button>
                                                                <Button
                                                                    onClick={() => {
                                                                        // Export individual request
                                                                        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                                                                        saveAs(blob, `${payload.name}.json`);
                                                                        toast.success('Payload exported.');
                                                                    }}
                                                                    className="bg-teal-600 hover:bg-teal-700 flex items-center"
                                                                >
                                                                    <Download size={16} className="mr-1" /> Export
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <Textarea
                                                            value={JSON.stringify(payload.payload, null, 2)}
                                                            readOnly
                                                            className="w-full h-24 p-2 font-mono text-sm bg-gray-800 text-white border border-gray-700 rounded"
                                                            style={{ resize: 'vertical' }}
                                                        />
                                                    </li>
                                                </SortableItem>
                                            ))}
                                            {/** Placeholder for Droppable area */}
                                        </ul>
                                    </SortableContext>
                                </DndContext>
                        )}
                    </div>

                    {/* Response Display */}
                    {response && (
                        <div className="mt-8">
                            <h3 className="text-2xl font-semibold mb-4">Response</h3>
                            <Textarea
                                value={JSON.stringify(response, null, 2)}
                                readOnly
                                className="w-full h-48 p-2 font-mono text-sm bg-gray-800 text-white border border-gray-700 rounded"
                                style={{ resize: 'vertical' }}
                            />
                            <div className="flex justify-end mt-2">
                                <Button onClick={handleSelectResponseData} className="bg-blue-600 hover:bg-blue-700 flex items-center">
                                    <Copy size={16} className="mr-1" /> Copy Selected
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Messages Log */}
                    <div className="mt-8">
                        <h3 className="text-2xl font-semibold mb-4">Messages</h3>
                        <ScrollArea className="h-64 p-4 border rounded bg-gray-800">
                            {messages.map((message, index) => (
                                <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                                    <span className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}>
                                        <pre className="whitespace-pre-wrap">{message.content}</pre>
                                    </span>
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                </CardContent>

                {/* Import Modal */}
                <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Import Request</DialogTitle>
                        </DialogHeader>
                        <Textarea
                            value={importedRequest}
                            onChange={(e) => setImportedRequest(e.target.value)}
                            className="w-full h-32 p-2 font-mono text-sm bg-gray-800 text-white border border-gray-700 rounded"
                            style={{ resize: 'vertical' }}
                        />
                        <DialogFooter>
                            <Button
                                onClick={importRequest}
                                className="bg-green-600 hover:bg-green-700 flex items-center"
                            >
                                <Upload size={16} className="mr-1" /> Import
                            </Button>
                            <Button
                                onClick={() => setIsImportModalOpen(false)}
                                className="bg-gray-600 hover:bg-gray-700 flex items-center"
                            >
                                Cancel
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </Card>
        </>
    );
};

export default PayloadTester;
