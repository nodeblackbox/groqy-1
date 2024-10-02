"use client";

import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    ChevronRight,
    ChevronDown,
    Play,
    Edit,
    Save,
    Download,
    Upload,
    Search,
    Plus,
    Trash2,
    ArrowRight,
    Copy,
    Bell,
    Menu,
    User,
    Settings,
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

// Custom UI Components
const Button = ({ onClick, children, variant = 'primary', size = 'md', className = '', ...props }) => {
    const baseClasses =
        'flex items-center justify-center space-x-1 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105';

    const variants = {
        primary: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
        secondary: 'bg-gradient-to-r from-green-500 to-teal-500 text-white',
        destructive: 'bg-gradient-to-r from-red-500 to-orange-500 text-white',
        success: 'bg-gradient-to-r from-blue-500 to-green-500 text-white',
        ghost: 'bg-transparent text-gray-200 hover:bg-gray-700',
        outline: 'border border-gray-500 text-gray-200 hover:bg-gray-700',
    };

    const sizes = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
        xs: 'px-1 py-0.5 text-xs',
    };

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

const Input = ({ value, onChange, placeholder, className = '', icon, ...props }) => (
    <div className={`relative ${className}`}>
        {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-3 py-2 pl-${icon ? '10' : '3'} bg-gray-700 bg-opacity-50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500`}
            {...props}
        />
    </div>
);

const TextArea = ({ value, onChange, placeholder, className = '', ...props }) => (
    <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-3 py-2 bg-gray-700 bg-opacity-50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y ${className}`}
        {...props}
    />
);

// TreeNode Component for JSON Structure Builder
const TreeNode = ({ node, onAdd, onDelete, onToggle, onEdit, searchTerm }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [fieldValue, setFieldValue] = useState(node.name);

    const handleEdit = (e) => {
        if (e.key === 'Enter')
        {
            onEdit(node.id, 'name', fieldValue);
            setIsEditing(false);
        }
    };

    const matchesSearch = (name) => {
        if (!searchTerm) return true;
        return name.toLowerCase().includes(searchTerm.toLowerCase());
    };

    if (!matchesSearch(node.name))
    {
        return null;
    }

    return (
        <div className="ml-4">
            <div className="flex items-center space-x-2 my-1">
                {node.children && node.children.length > 0 && (
                    <button onClick={() => onToggle(node.id)} className="text-gray-400 hover:text-white focus:outline-none">
                        {node.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                )}
                {isEditing ? (
                    <Input
                        value={fieldValue}
                        onChange={(e) => setFieldValue(e.target.value)}
                        onKeyDown={handleEdit}
                        onBlur={() => {
                            onEdit(node.id, 'name', fieldValue);
                            setIsEditing(false);
                        }}
                        className="h-6 py-0 px-1 w-24 bg-gray-700 border border-gray-600 text-white text-xs"
                    />
                ) : (
                    <span
                        className="text-green-400 text-xs cursor-pointer"
                        onDoubleClick={() => setIsEditing(true)}
                    >
                        {node.name}
                    </span>
                )}
                {node.value !== undefined && (
                    <span className="text-yellow-400 text-xs">: {node.value}</span>
                )}
                <div className="ml-auto flex space-x-1">
                    <Button size="xs" variant="ghost" onClick={() => onAdd(node.id)} className="h-6 w-6 p-0">
                        <Plus size={12} />
                    </Button>
                    {node.id !== 'root' && (
                        <Button size="xs" variant="ghost" onClick={() => onDelete(node.id)} className="h-6 w-6 p-0">
                            <Trash2 size={12} />
                        </Button>
                    )}
                </div>
            </div>
            {node.isOpen && node.children && (
                <div className="ml-4">
                    {node.children.map((child) => (
                        <TreeNode
                            key={child.id}
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

// Tabs Component
const Tabs = ({ children }) => {
    return <div>{children}</div>;
};

// JSON Viewer Component for Beautified Output
const JSONViewer = ({ json }) => {
    return (
        <pre className="bg-gray-800 p-4 rounded-lg overflow-auto text-xs">
            {JSON.stringify(json, null, 2)}
        </pre>
    );
};

// Main Page Component
const PayloadMakerUI = () => {

    // State Variables
    const [url, setUrl] = useState('');
    const [payloads, setPayloads] = useState([]);
    const [activePayload, setActivePayload] = useState(null);
    const [results, setResults] = useState({});
    const [useAuth, setUseAuth] = useState(false);
    const [bearerToken, setBearerToken] = useState('');
    const [jsonStructure, setJsonStructure] = useState({ id: 'root', name: 'root', children: [], isOpen: true });
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importedConfig, setImportedConfig] = useState('');
    const [globalVariables, setGlobalVariables] = useState({});
    const [routines, setRoutines] = useState([]);
    const [activeRoutine, setActiveRoutine] = useState(null);
    const [isAsyncExecution, setIsAsyncExecution] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('name'); // or 'date'

    // Refs for Drag-and-Drop
    const dragItem = useRef();
    const dragOverItem = useRef();

    // Load from Local Storage on Mount
    useEffect(() => {
        try
        {
            const storedPayloads = JSON.parse(localStorage.getItem('payloads') || '[]');
            const storedGlobalVariables = JSON.parse(localStorage.getItem('globalVariables') || '{}');
            const storedRoutines = JSON.parse(localStorage.getItem('routines') || '[]');
            const storedJsonStructure = JSON.parse(localStorage.getItem('jsonStructure') || '{"id":"root","name":"root","children":[],"isOpen":true}');
            setPayloads(storedPayloads);
            setGlobalVariables(storedGlobalVariables);
            setRoutines(storedRoutines);
            setJsonStructure(storedJsonStructure);
        } catch (error)
        {
            console.error('Error loading from localStorage:', error);
            toast.error('Failed to load saved data.');
        }
    }, []);

    // Save to Local Storage on Changes
    useEffect(() => {
        try
        {
            localStorage.setItem('payloads', JSON.stringify(payloads));
            localStorage.setItem('globalVariables', JSON.stringify(globalVariables));
            localStorage.setItem('routines', JSON.stringify(routines));
            localStorage.setItem('jsonStructure', JSON.stringify(jsonStructure));
        } catch (error)
        {
            console.error('Error saving to localStorage:', error);
            toast.error('Failed to save data.');
        }
    }, [payloads, globalVariables, routines, jsonStructure]);

    // Payload Management Functions
    const createPayload = () => {
        const newPayload = {
            id: uuidv4(),
            name: `Payload ${payloads.length + 1}`,
            description: '',
            url: '',
            method: 'GET',
            headers: '{}',
            body: '{}',
            subtasks: [],
            createdAt: new Date().toISOString(),
        };
        setPayloads([...payloads, newPayload]);
        setActivePayload(newPayload);
        toast.success('New payload created.');
    };

    const updatePayload = (id, updates) => {
        setPayloads(payloads.map(p => p.id === id ? { ...p, ...updates } : p));
        if (activePayload && activePayload.id === id)
        {
            setActivePayload({ ...activePayload, ...updates });
        }
    };

    const deletePayload = (id) => {
        if (confirm('Are you sure you want to delete this payload?'))
        {
            setPayloads(payloads.filter(p => p.id !== id));
            if (activePayload && activePayload.id === id)
            {
                setActivePayload(null);
            }
            toast.success('Payload deleted.');
        }
    };

    const addSubtask = (payloadId) => {
        const payload = payloads.find(p => p.id === payloadId);
        if (payload)
        {
            const newSubtask = {
                id: uuidv4(),
                name: `Subtask ${payload.subtasks.length + 1}`,
                description: '',
                url: '',
                method: 'GET',
                headers: '{}',
                body: '{}',
            };
            updatePayload(payloadId, { subtasks: [...payload.subtasks, newSubtask] });
            toast.success('Subtask added.');
        }
    };

    const updateSubtask = (payloadId, subtaskId, updates) => {
        const payload = payloads.find(p => p.id === payloadId);
        if (payload)
        {
            const updatedSubtasks = payload.subtasks.map(st => st.id === subtaskId ? { ...st, ...updates } : st);
            updatePayload(payloadId, { subtasks: updatedSubtasks });
        }
    };

    const deleteSubtask = (payloadId, subtaskId) => {
        if (confirm('Are you sure you want to delete this subtask?'))
        {
            const payload = payloads.find(p => p.id === payloadId);
            if (payload)
            {
                const updatedSubtasks = payload.subtasks.filter(st => st.id !== subtaskId);
                updatePayload(payloadId, { subtasks: updatedSubtasks });
                toast.success('Subtask deleted.');
            }
        }
    };

    // JSON Structure Management
    const addNodeToJsonStructure = (parentId) => {
        const newNode = { id: uuidv4(), name: 'New Node', value: '', children: [], isOpen: true };
        const addNodeRecursive = (node) => {
            if (node.id === parentId)
            {
                node.children = [...(node.children || []), newNode];
                return true;
            }
            if (node.children)
            {
                for (let child of node.children)
                {
                    if (addNodeRecursive(child)) return true;
                }
            }
            return false;
        };
        const newStructure = { ...jsonStructure };
        addNodeRecursive(newStructure);
        setJsonStructure(newStructure);
        toast.success('Node added to JSON structure.');
    };

    const deleteNodeFromJsonStructure = (nodeId) => {
        const deleteNodeRecursive = (node) => {
            if (node.children)
            {
                node.children = node.children.filter(child => child.id !== nodeId);
                node.children.forEach(deleteNodeRecursive);
            }
        };
        const newStructure = { ...jsonStructure };
        if (newStructure.id === nodeId)
        {
            toast.error('Cannot delete root node.');
            return;
        }
        deleteNodeRecursive(newStructure);
        setJsonStructure(newStructure);
        toast.success('Node deleted from JSON structure.');
    };

    const toggleNodeInJsonStructure = (nodeId) => {
        const toggleNodeRecursive = (node) => {
            if (node.id === nodeId)
            {
                node.isOpen = !node.isOpen;
                return true;
            }
            if (node.children)
            {
                for (let child of node.children)
                {
                    if (toggleNodeRecursive(child)) return true;
                }
            }
            return false;
        };
        const newStructure = { ...jsonStructure };
        toggleNodeRecursive(newStructure);
        setJsonStructure(newStructure);
    };

    const editNodeInJsonStructure = (nodeId, field, value) => {
        const editNodeRecursive = (node) => {
            if (node.id === nodeId)
            {
                node[field] = value;
                return true;
            }
            if (node.children)
            {
                for (let child of node.children)
                {
                    if (editNodeRecursive(child)) return true;
                }
            }
            return false;
        };
        const newStructure = { ...jsonStructure };
        editNodeRecursive(newStructure);
        setJsonStructure(newStructure);
    };

    // Routine Management
    const createRoutine = () => {
        const newRoutine = {
            id: uuidv4(),
            name: `Routine ${routines.length + 1}`,
            payloads: [],
            createdAt: new Date().toISOString(),
        };
        setRoutines([...routines, newRoutine]);
        setActiveRoutine(newRoutine);
        toast.success('New routine created.');
    };

    const updateRoutine = (id, updates) => {
        setRoutines(routines.map(r => r.id === id ? { ...r, ...updates } : r));
        if (activeRoutine && activeRoutine.id === id)
        {
            setActiveRoutine({ ...activeRoutine, ...updates });
        }
    };

    const deleteRoutine = (id) => {
        if (confirm('Are you sure you want to delete this routine?'))
        {
            setRoutines(routines.filter(r => r.id !== id));
            if (activeRoutine && activeRoutine.id === id)
            {
                setActiveRoutine(null);
            }
            toast.success('Routine deleted.');
        }
    };

    const addPayloadToRoutine = (routineId, payloadId) => {
        const routine = routines.find(r => r.id === routineId);
        if (routine && !routine.payloads.includes(payloadId))
        {
            updateRoutine(routineId, { payloads: [...routine.payloads, payloadId] });
            toast.success('Payload added to routine.');
        }
    };

    const removePayloadFromRoutine = (routineId, payloadId) => {
        const routine = routines.find(r => r.id === routineId);
        if (routine)
        {
            const updatedPayloads = routine.payloads.filter(id => id !== payloadId);
            updateRoutine(routineId, { payloads: updatedPayloads });
            toast.success('Payload removed from routine.');
        }
    };

    const executeRoutine = async (routine) => {
        toast.loading('Executing routine...', { id: 'routineExecution' });
        for (const payloadId of routine.payloads)
        {
            const payload = payloads.find(p => p.id === payloadId);
            if (payload)
            {
                await executePayloadWithSubtasks(payload);
            }
        }
        toast.success('Routine executed successfully!', { id: 'routineExecution' });
    };

    // Payload Execution
    const handleSendPayload = async (payload) => {
        try
        {
            const headers = JSON.parse(payload.headers);
            if (useAuth)
            {
                headers['Authorization'] = `Bearer ${bearerToken}`;
            }

            // Replace variables in URL, headers, and body
            const interpolatedUrl = interpolateString(payload.url, globalVariables);
            const interpolatedHeaders = interpolateObject(headers, globalVariables);
            const interpolatedBody = payload.body ? interpolateString(payload.body, globalVariables) : undefined;

            const response = await fetch(interpolatedUrl || '/api/qdrant/create-point', {
                method: payload.method,
                headers: interpolatedHeaders,
                body: payload.method !== 'GET' ? interpolatedBody : undefined,
            });

            const contentType = response.headers.get('content-type');
            let data;
            if (contentType && contentType.includes('application/json'))
            {
                data = await response.json();
            } else
            {
                data = await response.text();
            }

            setResults(prev => ({ ...prev, [payload.id]: { url: interpolatedUrl, payload, response: data } }));

            // Optionally, extract variables from response (custom logic needed)
            // setGlobalVariables(prev => ({ ...prev, [payload.name]: data }));

            toast.success(`Payload "${payload.name}" sent successfully!`);
            return data;
        } catch (error)
        {
            console.error('Error sending payload:', error);
            setResults(prev => ({ ...prev, [payload.id]: { url: payload.url, payload, response: { error: error.message } } }));
            toast.error(`Failed to send payload "${payload.name}".`);
            return { error: error.message };
        }
    };

    const executePayloadWithSubtasks = async (payload) => {
        const mainResult = await handleSendPayload(payload);
        if (payload.subtasks.length > 0)
        {
            if (isAsyncExecution)
            {
                await Promise.all(payload.subtasks.map(async (subtask) => {
                    await handleSendPayload({ ...subtask, headers: payload.headers });
                }));
            } else
            {
                for (const subtask of payload.subtasks)
                {
                    await handleSendPayload({ ...subtask, headers: payload.headers });
                }
            }
        }
    };

    // Variable Interpolation Functions
    const interpolateString = (str, variables) => {
        return str.replace(/\${([^}]+)}/g, (_, key) => {
            return variables[key] || `\${${key}}`;
        });
    };

    const interpolateObject = (obj, variables) => {
        const result = {};
        for (const key in obj)
        {
            const value = obj[key];
            if (typeof value === 'string')
            {
                result[key] = interpolateString(value, variables);
            } else
            {
                result[key] = value;
            }
        }
        return result;
    };

    // Import & Export Configuration
    const handleImportConfig = () => {
        try
        {
            const config = JSON.parse(importedConfig);
            setPayloads(config.payloads || []);
            setJsonStructure(config.jsonStructure || { id: 'root', name: 'root', children: [], isOpen: true });
            setGlobalVariables(config.globalVariables || {});
            setRoutines(config.routines || []);
            setIsImportModalOpen(false);
            toast.success('Configuration imported successfully!');
        } catch (error)
        {
            console.error('Import Config Error:', error);
            toast.error('Invalid configuration format.');
        }
    };

    const handleExportConfig = () => {
        const config = {
            payloads,
            jsonStructure,
            globalVariables,
            routines,
        };
        const dataStr = JSON.stringify(config, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const urlBlob = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = urlBlob;
        link.download = 'payload_tester_config.json';
        link.click();
        toast.success('Configuration exported successfully!');
    };

    // Drag-and-Drop Handlers
    const handleDragStart = (e, position) => {
        dragItem.current = position;
    };

    const handleDragEnter = (e, position) => {
        dragOverItem.current = position;
    };

    const handleDragEnd = () => {
        const copyListItems = [...payloads];
        const dragItemContent = copyListItems[dragItem.current];
        copyListItems.splice(dragItem.current, 1);
        copyListItems.splice(dragOverItem.current, 0, dragItemContent);
        dragItem.current = null;
        dragOverItem.current = null;
        setPayloads(copyListItems);
        toast.success('Payloads reordered.');
    };

    // Sorting and Filtering
    const sortedPayloads = [...payloads].sort((a, b) => {
        if (sortOption === 'name')
        {
            return a.name.localeCompare(b.name);
        } else if (sortOption === 'date')
        {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
        return 0;
    });

    const filteredPayloads = sortedPayloads.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Execute All Payloads
    const executeAllPayloads = async () => {
        toast.loading('Executing all payloads...', { id: 'executeAll' });
        for (const payload of payloads)
        {
            await executePayloadWithSubtasks(payload);
        }
        toast.success('All payloads executed successfully!', { id: 'executeAll' });
    };

    // Execute All Routines
    const executeAllRoutines = async () => {
        toast.loading('Executing all routines...', { id: 'executeAllRoutines' });
        for (const routine of routines)
        {
            await executeRoutine(routine);
        }
        toast.success('All routines executed successfully!', { id: 'executeAllRoutines' });
    };

    return (

        <div className="bg-gradient-to-br from-gray-900 to-black text-white p-4 min-h-screen font-sans">
            <Toaster position="top-right" />

            {/* Control Buttons */}
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Button onClick={createPayload} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> New Payload
                    </Button>
                    <Button onClick={createRoutine} variant="secondary" className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> New Routine
                    </Button>
                    <Button onClick={() => setIsImportModalOpen(true)} variant="success" className="w-full">
                        <Upload className="mr-2 h-4 w-4" /> Import Config
                    </Button>
                    <Button onClick={handleExportConfig} variant="destructive" className="w-full">
                        <Download className="mr-2 h-4 w-4" /> Export Config
                    </Button>
                </div>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Button onClick={executeAllPayloads} variant="primary" className="w-full">
                        <Play className="mr-2 h-4 w-4" /> Execute All Payloads
                    </Button>
                    <Button onClick={executeAllRoutines} variant="secondary" className="w-full">
                        <Play className="mr-2 h-4 w-4" /> Execute All Routines
                    </Button>
                    {/* Additional control buttons can be added here */}
                    <div></div>
                </div>
            </div>

            <div className="md:flex md:gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-1/4">
                    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Payloads</h2>
                        <div className="mb-4 flex items-center space-x-2">
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search Payloads"
                                className="flex-1"
                                icon={<Search size={16} />}
                            />
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="px-3 py-2 bg-gray-700 bg-opacity-50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="name">Sort by Name</option>
                                <option value="date">Sort by Date</option>
                            </select>
                        </div>
                        <ul className="space-y-2 max-h-96 overflow-auto">
                            {filteredPayloads.map((payload, index) => (
                                <li
                                    key={payload.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragEnter={(e) => handleDragEnter(e, index)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => e.preventDefault()}
                                    className={`p-2 rounded cursor-pointer ${activePayload && activePayload.id === payload.id ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                                        }`}
                                    onClick={() => {
                                        setActivePayload(payload);
                                        setActiveRoutine(null);
                                    }}
                                >
                                    {payload.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Routines Section */}
                    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
                        <h2 className="text-2xl font-semibold mb-4">Routines</h2>
                        <ul className="space-y-2">
                            {routines.map((routine) => (
                                <li
                                    key={routine.id}
                                    className={`p-2 rounded cursor-pointer ${activeRoutine && activeRoutine.id === routine.id ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'
                                        }`}
                                    onClick={() => {
                                        setActiveRoutine(routine);
                                        setActivePayload(null);
                                    }}
                                >
                                    {routine.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full md:w-2/4 space-y-6">
                    {/* API Configuration */}
                    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
                        <h2 className="text-2xl font-semibold mb-4">API Configuration</h2>
                        <div className="space-y-4">
                            <Input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Enter API URL"
                            />
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={useAuth}
                                    onChange={() => setUseAuth(!useAuth)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label>Use Authentication</label>
                            </div>
                            {useAuth && (
                                <Input
                                    value={bearerToken}
                                    onChange={(e) => setBearerToken(e.target.value)}
                                    placeholder="Enter Bearer Token"
                                />
                            )}
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs>
                        <div className="flex space-x-2 mb-4">
                            <Button
                                variant={activePayload ? 'primary' : 'ghost'}
                                onClick={() => {
                                    setActivePayload(activePayload);
                                    setActiveRoutine(null);
                                }}
                            >
                                Edit Payload
                            </Button>
                            <Button
                                variant={!activePayload && !activeRoutine ? 'primary' : 'ghost'}
                                onClick={() => {
                                    setActivePayload(null);
                                    setActiveRoutine(null);
                                }}
                            >
                                JSON Structure
                            </Button>
                            <Button
                                variant={activeRoutine ? 'primary' : 'ghost'}
                                onClick={() => {
                                    setActiveRoutine(activeRoutine);
                                    setActivePayload(null);
                                }}
                            >
                                Routine Editor
                            </Button>
                        </div>

                        {/* Edit Payload Tab */}
                        {activePayload && (
                            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
                                <h2 className="text-2xl font-semibold mb-4">Edit Payload</h2>
                                <div className="space-y-4">
                                    <Input
                                        value={activePayload.name}
                                        onChange={(e) => updatePayload(activePayload.id, { name: e.target.value })}
                                        placeholder="Payload Name"
                                    />
                                    <Input
                                        value={activePayload.description}
                                        onChange={(e) => updatePayload(activePayload.id, { description: e.target.value })}
                                        placeholder="Payload Description"
                                    />
                                    <Input
                                        value={activePayload.url}
                                        onChange={(e) => updatePayload(activePayload.id, { url: e.target.value })}
                                        placeholder="API URL"
                                    />
                                    <select
                                        value={activePayload.method}
                                        onChange={(e) => updatePayload(activePayload.id, { method: e.target.value })}
                                        className="px-3 py-2 bg-gray-700 bg-opacity-50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                                    >
                                        <option value="GET">GET</option>
                                        <option value="POST">POST</option>
                                        <option value="PUT">PUT</option>
                                        <option value="DELETE">DELETE</option>
                                    </select>
                                    <TextArea
                                        value={activePayload.headers}
                                        onChange={(e) => updatePayload(activePayload.id, { headers: e.target.value })}
                                        placeholder="Headers (JSON)"
                                        rows={4}
                                    />
                                    <TextArea
                                        value={activePayload.body}
                                        onChange={(e) => updatePayload(activePayload.id, { body: e.target.value })}
                                        placeholder="Body (JSON)"
                                        rows={8}
                                    />

                                    {/* Subtasks */}
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">Subtasks</h3>
                                        {activePayload.subtasks.map((subtask) => (
                                            <div key={subtask.id} className="bg-gray-700 bg-opacity-50 p-4 rounded mb-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <Input
                                                        value={subtask.name}
                                                        onChange={(e) => updateSubtask(activePayload.id, subtask.id, { name: e.target.value })}
                                                        placeholder="Subtask Name"
                                                        className="w-2/3"
                                                    />
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => deleteSubtask(activePayload.id, subtask.id)}
                                                    >
                                                        <Trash2 size={12} />
                                                    </Button>
                                                </div>
                                                <Input
                                                    value={subtask.url}
                                                    onChange={(e) => updateSubtask(activePayload.id, subtask.id, { url: e.target.value })}
                                                    placeholder="Subtask API URL"
                                                    className="mb-2"
                                                />
                                                <select
                                                    value={subtask.method}
                                                    onChange={(e) => updateSubtask(activePayload.id, subtask.id, { method: e.target.value })}
                                                    className="px-3 py-2 bg-gray-600 bg-opacity-50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2 w-full"
                                                >
                                                    <option value="GET">GET</option>
                                                    <option value="POST">POST</option>
                                                    <option value="PUT">PUT</option>
                                                    <option value="DELETE">DELETE</option>
                                                </select>
                                                <TextArea
                                                    value={subtask.headers}
                                                    onChange={(e) => updateSubtask(activePayload.id, subtask.id, { headers: e.target.value })}
                                                    placeholder="Subtask Headers (JSON)"
                                                    rows={2}
                                                    className="mb-2"
                                                />
                                                <TextArea
                                                    value={subtask.body}
                                                    onChange={(e) => updateSubtask(activePayload.id, subtask.id, { body: e.target.value })}
                                                    placeholder="Subtask Body (JSON)"
                                                    rows={4}
                                                />
                                            </div>
                                        ))}
                                        <Button onClick={() => addSubtask(activePayload.id)}>
                                            <Plus size={16} className="mr-1" /> Add Subtask
                                        </Button>
                                    </div>

                                    {/* Execution Buttons */}
                                    <div className="flex space-x-2">
                                        <Button onClick={() => executePayloadWithSubtasks(activePayload)}>
                                            <Play size={16} className="mr-1" /> Execute Payload
                                        </Button>
                                        <Button variant="destructive" onClick={() => deletePayload(activePayload.id)}>
                                            <Trash2 size={16} className="mr-1" /> Delete Payload
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* JSON Structure Tab */}
                        {!activePayload && !activeRoutine && (
                            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-semibold">Dynamic JSON Builder</h2>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const jsonStr = JSON.stringify(jsonStructure, null, 2);
                                                navigator.clipboard.writeText(jsonStr);
                                                toast.success('JSON copied to clipboard.');
                                            }}
                                        >
                                            <Copy size={16} className="mr-1" /> Copy
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleExportConfig()}
                                        >
                                            <Download size={16} className="mr-1" /> Export
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsImportModalOpen(true)}
                                        >
                                            <Upload size={16} className="mr-1" /> Import
                                        </Button>
                                    </div>
                                </div>
                                <Input
                                    className="mb-4"
                                    placeholder="Search JSON Structure..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    icon={<Search size={16} />}
                                />
                                <div className="border border-gray-700 rounded-lg p-4 max-h-96 overflow-auto bg-gray-700 bg-opacity-50">
                                    <TreeNode
                                        node={jsonStructure}
                                        onAdd={addNodeToJsonStructure}
                                        onDelete={deleteNodeFromJsonStructure}
                                        onToggle={toggleNodeInJsonStructure}
                                        onEdit={editNodeInJsonStructure}
                                        searchTerm={searchTerm}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Routine Editor Tab */}
                        {activeRoutine && (
                            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
                                <h2 className="text-2xl font-semibold mb-4">Routine Editor</h2>
                                <div className="space-y-4">
                                    <Input
                                        value={activeRoutine.name}
                                        onChange={(e) => updateRoutine(activeRoutine.id, { name: e.target.value })}
                                        placeholder="Routine Name"
                                    />
                                    <h3 className="text-xl font-semibold mb-2">Payloads in Routine</h3>
                                    {activeRoutine.payloads.length === 0 ? (
                                        <p className="text-gray-400">No payloads added to this routine.</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {activeRoutine.payloads.map(payloadId => {
                                                const payload = payloads.find(p => p.id === payloadId);
                                                return payload ? (
                                                    <li key={payloadId} className="flex justify-between items-center bg-gray-700 bg-opacity-50 p-2 rounded">
                                                        <span>{payload.name}</span>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removePayloadFromRoutine(activeRoutine.id, payloadId)}
                                                        >
                                                            <Trash2 size={12} />
                                                        </Button>
                                                    </li>
                                                ) : null;
                                            })}
                                        </ul>
                                    )}
                                    <div className="mt-4">
                                        <select
                                            onChange={(e) => {
                                                const selectedPayloadId = e.target.value;
                                                if (selectedPayloadId !== '')
                                                {
                                                    addPayloadToRoutine(activeRoutine.id, selectedPayloadId);
                                                    e.target.value = '';
                                                }
                                            }}
                                            className="px-3 py-2 bg-gray-700 bg-opacity-50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Add payload to routine</option>
                                            {payloads.map(payload => (
                                                <option key={payload.id} value={payload.id}>{payload.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={isAsyncExecution}
                                            onChange={() => setIsAsyncExecution(!isAsyncExecution)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label>Asynchronous Execution</label>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button onClick={() => executeRoutine(activeRoutine)}>
                                            <Play size={16} className="mr-1" /> Execute Routine
                                        </Button>
                                        <Button variant="destructive" onClick={() => deleteRoutine(activeRoutine.id)}>
                                            <Trash2 size={16} className="mr-1" /> Delete Routine
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Tabs>
                </div>

                {/* Right Panel */}
                <div className="w-full md:w-1/4 space-y-6">
                    {/* Global Variables */}
                    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
                        <h2 className="text-2xl font-semibold mb-4">Global Variables</h2>
                        <div className="flex space-x-2 mb-4">
                            <Input
                                value={Object.keys(globalVariables).length > 0 ? '' : ''}
                                onChange={() => { }}
                                placeholder="Set Variable Name"
                                className="flex-1"
                                readOnly
                                disabled
                            />
                            <Button onClick={() => {
                                const varName = prompt('Enter variable name:');
                                if (varName && !globalVariables[varName])
                                {
                                    const varValue = prompt('Enter variable value:');
                                    setGlobalVariables(prev => ({ ...prev, [varName]: varValue }));
                                    toast.success(`Variable "${varName}" added.`);
                                } else if (varName && globalVariables[varName])
                                {
                                    toast.error(`Variable "${varName}" already exists.`);
                                }
                            }}>
                                <Plus size={16} className="mr-1" /> Add
                            </Button>
                        </div>
                        {Object.keys(globalVariables).length === 0 ? (
                            <p className="text-gray-400">No variables available.</p>
                        ) : (
                            <ul className="space-y-2 max-h-64 overflow-auto">
                                {Object.entries(globalVariables).map(([key, value]) => (
                                    <li key={key} className="flex justify-between items-center bg-gray-700 bg-opacity-50 p-2 rounded">
                                        <div>
                                            <span className="font-semibold">{key}:</span> <span>{value}</span>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button
                                                variant="ghost"
                                                size="xs"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(JSON.stringify(value, null, 2));
                                                    toast.success(`Variable "${key}" copied to clipboard.`);
                                                }}
                                            >
                                                <Copy size={14} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="xs"
                                                onClick={() => {
                                                    const newValue = prompt(`Enter new value for "${key}":`, value);
                                                    if (newValue !== null)
                                                    {
                                                        setGlobalVariables(prev => ({ ...prev, [key]: newValue }));
                                                        toast.success(`Variable "${key}" updated.`);
                                                    }
                                                }}
                                            >
                                                <Edit size={14} />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="xs"
                                                onClick={() => {
                                                    if (confirm(`Delete variable "${key}"?`))
                                                    {
                                                        const updatedVariables = { ...globalVariables };
                                                        delete updatedVariables[key];
                                                        setGlobalVariables(updatedVariables);
                                                        toast.success(`Variable "${key}" deleted.`);
                                                    }
                                                }}
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Test Results */}
                    <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-filter backdrop-blur-lg">
                        <h2 className="text-2xl font-semibold mb-4">Test Results</h2>
                        {Object.keys(results).length === 0 ? (
                            <p className="text-gray-400">No results yet.</p>
                        ) : (
                                <div className="max-h-96 overflow-auto space-y-4">
                                {Object.entries(results).map(([id, result]) => {
                                    const payload = payloads.find(p => p.id === id) || routines.find(r => r.id === id);
                                    return payload ? (
                                        <div key={id} className="p-4 bg-gray-700 bg-opacity-50 rounded">
                                            <h3 className="font-semibold">{payload.name}</h3>
                                            <div className="mt-2">
                                                <p className="font-semibold">URL:</p>
                                                <p className="text-sm">{result.url}</p>
                                            </div>
                                            <div className="mt-2">
                                                <p className="font-semibold">Payload:</p>
                                                <JSONViewer json={result.payload} />
                                            </div>
                                            <div className="mt-2">
                                                <p className="font-semibold">Response:</p>
                                                <JSONViewer json={result.response} />
                                            </div>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Import Config Modal */}
            {isImportModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg w-11/12 md:w-1/2 lg:w-1/3">
                        <h2 className="text-2xl font-semibold mb-4">Import Configuration</h2>
                        <TextArea
                            value={importedConfig}
                            onChange={(e) => setImportedConfig(e.target.value)}
                            placeholder="Paste your configuration JSON here"
                            rows={10}
                            className="mb-4"
                        />
                        <div className="flex justify-end space-x-2">
                            <Button onClick={handleImportConfig} variant="success">
                                <Upload size={16} className="mr-1" /> Import
                            </Button>
                            <Button onClick={() => setIsImportModalOpen(false)} variant="secondary">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PayloadMakerUI;
