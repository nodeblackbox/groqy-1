"use client";

import React, {
    useState,
    useCallback,
    useEffect,
    useReducer,
    useRef,
    createContext,
    useContext
} from 'react';
import {
    AlertCircle,
    Zap,
    Save,
    Upload,
    Download,
    Trash2,
    Eye,
    Code,
    PlusCircle,
    Loader,
    CogIcon,
    BrainCircuitIcon,
    UserIcon,
    SettingsIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import dynamic from 'next/dynamic';

// Dynamically import the MermaidDiagram component
const MermaidDiagram = dynamic(() => import('@/components/MermaidDiagram'), {
    ssr: false,
    loading: () => <p>Loading diagram...</p>
});

// Node and Edge Types
const NODE_TYPES = {
    architect: "Architect",
    taskForge: "Task Forge",
    componentLoom: "Component Loom",
    logicWeaver: "Logic Weaver",
    stateManager: "State Manager",
    apiAgent: "API Agent",
    processAgent: "Process Agent",
    conditionAgent: "Condition Agent",
    logicAgent: "Logic Agent",
    pageAgent: "Page Generation Agent",
    agentFixer: "Agent Fixer",
    knowledgeBase: "Knowledge Base",
    user: "User",
    ui: "Workflow Builder UI",
    orchestrator: "Agent Orchestrator",
    workflowExecution: "Workflow Execution Engine",
    configurationManagement: "Configuration Management",
    executionLog: "Execution Log",
    groqAPI: "GROQ API",
};

const EDGE_TYPES = {
    default: "Default",
    manages: "Manages",
    enhances: "Enhances",
    spawns: "Spawns",
    uses: "Uses",
    coordinates: "Coordinates",
    handles: "Handles",
    storesLoads: "Stores/Loads",
    records: "Records",
    views: "Views",
    provides: "Provides",
    influences: "Influences",
    corrects: "Corrects",
    updates: "Updates",
    creates: "Creates",
    refines: "Refines",
    queries: "Queries",
};

// Initial State
const initialState = {
    nodes: [],
    edges: [],
    mermaidCode: "",
    error: null,
    workflow: [],
    executionLog: [],
    apiKey: "",
    configName: "",
    savedConfigs: [],
    editingTask: null,
    inspectingConfig: null,
    knowledgeBase: [],
    currentTask: null,
    sidePanelOpen: true,
    isExecuting: false,
    agents: [], // New state for managing agents
};

// Reducer Function
function reducer(state, action) {
    switch (action.type) {
        case "ADD_NODE":
            return {
                ...state,
                nodes: [
                    ...state.nodes,
                    {
                        id: action.payload.id,
                        type: action.payload.type || "default",
                        label: action.payload.label || "New Node",
                    },
                ],
            };
        case "UPDATE_NODE":
            return {
                ...state,
                nodes: state.nodes.map((node) =>
                    node.id === action.payload.id
                        ? { ...node, ...action.payload.updates }
                        : node
                ),
            };
        case "REMOVE_NODE":
            return {
                ...state,
                nodes: state.nodes.filter((node) => node.id !== action.payload),
                edges: state.edges.filter(
                    (edge) => edge.from !== action.payload && edge.to !== action.payload
                ),
            };
        case "ADD_EDGE":
            return {
                ...state,
                edges: [
                    ...state.edges,
                    {
                        id: action.payload.id,
                        from: action.payload.from || "",
                        to: action.payload.to || "",
                        label: action.payload.label || "",
                        type: action.payload.type || "default",
                    },
                ],
            };
        case "UPDATE_EDGE":
            return {
                ...state,
                edges: state.edges.map((edge) =>
                    edge.id === action.payload.id
                        ? { ...edge, ...action.payload.updates }
                        : edge
                ),
            };
        case "REMOVE_EDGE":
            return {
                ...state,
                edges: state.edges.filter((edge) => edge.id !== action.payload),
            };
        case "SET_MERMAID_CODE":
            return { ...state, mermaidCode: action.payload };
        case "SET_ERROR":
            return { ...state, error: action.payload };
        case "LOAD_STATE":
            return { ...state, ...action.payload };
        case "SET_API_KEY":
            return { ...state, apiKey: action.payload };
        case "SET_CONFIG_NAME":
            return { ...state, configName: action.payload };
        case "SET_SAVED_CONFIGS":
            return { ...state, savedConfigs: action.payload };
        case "SET_WORKFLOW":
            return { ...state, workflow: action.payload };
        case "SET_EXECUTION_LOG":
            return { ...state, executionLog: action.payload };
        case "ADD_EXECUTION_LOG":
            return {
                ...state,
                executionLog: [...state.executionLog, action.payload],
            };
        case "SET_EDITING_TASK":
            return { ...state, editingTask: action.payload };
        case "SET_INSPECTING_CONFIG":
            return { ...state, inspectingConfig: action.payload };
        case "SET_KNOWLEDGE_BASE":
            return { ...state, knowledgeBase: action.payload };
        case "SET_CURRENT_TASK":
            return { ...state, currentTask: action.payload };
        case "TOGGLE_SIDE_PANEL":
            return { ...state, sidePanelOpen: !state.sidePanelOpen };
        case "UPDATE_WORKFLOW":
            return { ...state, workflow: action.payload };
        case "SET_IS_EXECUTING":
            return { ...state, isExecuting: action.payload };
        case "ADD_AGENT":
            return {
                ...state,
                agents: [...state.agents, action.payload],
            };
        case "REMOVE_AGENT":
            return {
                ...state,
                agents: state.agents.filter(agent => agent.id !== action.payload),
            };
        default:
            return state;
    }
}

// Context for Workflow State Management
const WorkflowContext = createContext();

const useWorkflow = () => useContext(WorkflowContext);

// Neomorphic Container Component for consistent styling
const NeomorphicContainer = ({ children, className = '' }) => (
    <Card className={`bg-gray-800 ${className}`}>
        <CardContent>
            {children}
        </CardContent>
    </Card>
);

// Utility Functions

// Helper function to generate unique IDs
const generateId = () => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// Task Analysis Function
const performTaskAnalysis = async (result, task) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 300));
        let analysis = `The task "${task.name}" of type "${task.type}" executed successfully.\n\n`;

        if (typeof result === 'object') {
            analysis += `**Result Analysis:**\n`;
            for (const [key, value] of Object.entries(result)) {
                analysis += `- **${key}**: ${typeof value === 'number' ? value.toFixed(4) : value}\n`;
            }
        } else {
            analysis += `**Result:** ${result}\n`;
        }

        return analysis;
    } catch (error) {
        console.error('Error in Task Analysis:', error);
        return 'Task Analysis encountered an error.';
    }
};

// Find Task By ID
const findTaskById = (workflow, id) => {
    for (const task of workflow) {
        if (task.id === id) return task;
        if (task.subtasks) {
            const found = findTaskById(task.subtasks, id);
            if (found) return found;
        }
    }
    return null;
};

// Self Prompt For Improvement
const selfPromptForImprovement = async (task, result, analysis) => {
    try {
        // This function would ideally call an AI model for suggestions.
        // For now, we'll simulate it with some predefined improvements.
        const improvements = [
            "Consider adding error handling to improve robustness.",
            "Optimize the task by implementing caching mechanisms.",
            "Enhance security by adding input validation.",
            "Improve performance by parallelizing subtasks.",
            "Add telemetry to gather more insightful metrics."
        ];
        return improvements[Math.floor(Math.random() * improvements.length)];
    } catch (error) {
        console.error('Error in Self Prompt For Improvement:', error);
        return 'Self Prompt For Improvement encountered an error.';
    }
};

// Agent Management Functions
const createAgent = (agentData) => {
    return {
        id: generateId(),
        ...agentData
    };
};

const delegateTaskToAgent = (agent, task) => {
    // Implement delegation logic here
    // For example, assign the task to the agent's queue
    console.log(`Delegating task "${task.name}" to agent "${agent.name}"`);
    // Simulate asynchronous task execution
};

// Task Editor Component for editing tasks
const TaskEditor = ({ task, onSave, onCancel }) => {
    const [name, setName] = useState(task.name);
    const [type, setType] = useState(task.type);
    const [config, setConfig] = useState(task.config);
    const [subtasks, setSubtasks] = useState(task.subtasks || []);
    const [error, setError] = useState(null);

    const handleSave = () => {
        // Validate JSON fields for API tasks
        if (type === "API") {
            try {
                if (config.headers) JSON.parse(JSON.stringify(config.headers));
                if (config.body) JSON.parse(JSON.stringify(config.body));
                onSave({ ...task, name, type, config, subtasks });
            } catch (e) {
                setError("Invalid JSON in headers or body.");
            }
        } else {
            onSave({ ...task, name, type, config, subtasks });
        }
    };

    const addSubtask = () => {
        setSubtasks([
            ...subtasks,
            {
                id: generateId(),
                name: "New Subtask",
                type: "Process",
                config: {},
                subtasks: [],
            },
        ]);
    };

    const removeSubtask = (index) => {
        setSubtasks(subtasks.filter((_, i) => i !== index));
    };
    const TaskEditor = ({ task, onSave, onCancel }) => {
        const [name, setName] = useState(task.name);
        const [type, setType] = useState(task.type);
        const [config, setConfig] = useState(task.config);
        const [subtasks, setSubtasks] = useState(task.subtasks || []);
        const [error, setError] = useState(null);

        const handleSave = () => {
            // Validate JSON fields for API tasks
            if (type === "API") {
                try {
                    if (config.headers) JSON.parse(JSON.stringify(config.headers));
                    if (config.body) JSON.parse(JSON.stringify(config.body));
                    onSave({ ...task, name, type, config, subtasks });
                } catch (e) {
                    setError("Invalid JSON in headers or body.");
                }
            } else {
                onSave({ ...task, name, type, config, subtasks });
            }
        };

        const addSubtask = () => {
            setSubtasks([
                ...subtasks,
                {
                    id: generateId(),
                    name: "New Subtask",
                    type: "Process",
                    config: {},
                    subtasks: [],
                },
            ]);
        };

        const removeSubtask = (index) => {
            setSubtasks(subtasks.filter((_, i) => i !== index));
        };

        const updateSubtask = (index, updatedSubtask) => {
            const updatedSubtasks = [...subtasks];
            updatedSubtasks[index] = updatedSubtask;
            setSubtasks(updatedSubtasks);
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-3/4 max-h-screen overflow-auto">
                    <h2 className="text-xl font-bold mb-4 text-blue-400">Edit Task</h2>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Task Name"
                        className="mb-4 text-gray-100"
                    />
                    <Select
                        value={type}
                        onValueChange={(value) => setType(value)}
                        className="mb-4 text-gray-100"
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Task Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {["API", "Process", "Condition", "Logic", "Page"].map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {/* Conditional Config Input Fields */}
                    {type === "API" && (
                        <>
                            <Input
                                value={config.url || ""}
                                onChange={(e) =>
                                    setConfig({ ...config, url: e.target.value })
                                }
                                placeholder="API URL"
                                className="mb-4 text-gray-100"
                            />
                            <Select
                                value={config.method || "GET"}
                                onValueChange={(value) =>
                                    setConfig({ ...config, method: value })
                                }
                                className="mb-4 text-gray-100"
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Method" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["GET", "POST", "PUT", "DELETE"].map((method) => (
                                        <SelectItem key={method} value={method}>
                                            {method}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Textarea
                                value={JSON.stringify(config.headers || {}, null, 2)}
                                onChange={(e) => {
                                    try {
                                        setConfig({
                                            ...config,
                                            headers: JSON.parse(e.target.value),
                                        });
                                    } catch {
                                        // Handle invalid JSON gracefully
                                    }
                                }}
                                placeholder="Headers (JSON)"
                                className="mb-4 text-gray-100"
                                rows={3}
                            />
                            <Textarea
                                value={JSON.stringify(config.body || {}, null, 2)}
                                onChange={(e) => {
                                    try {
                                        setConfig({
                                            ...config,
                                            body: JSON.parse(e.target.value),
                                        });
                                    } catch {
                                        // Handle invalid JSON gracefully
                                    }
                                }}
                                placeholder="Body (JSON)"
                                className="mb-4 text-gray-100"
                                rows={3}
                            />
                        </>
                    )}
                    {type === "Process" && (
                        <Textarea
                            value={config.process || ""}
                            onChange={(e) =>
                                setConfig({ ...config, process: e.target.value })
                            }
                            placeholder="Process Description"
                            className="mb-4 text-gray-100"
                            rows={3}
                        />
                    )}
                    {type === "Condition" && (
                        <Input
                            value={config.condition || ""}
                            onChange={(e) =>
                                setConfig({ ...config, condition: e.target.value })
                            }
                            placeholder="Condition Expression"
                            className="mb-4 text-gray-100"
                        />
                    )}
                    {type === "Logic" && (
                        <Textarea
                            value={config.logic || ""}
                            onChange={(e) =>
                                setConfig({ ...config, logic: e.target.value })
                            }
                            placeholder="JavaScript Logic Code"
                            className="mb-4 text-gray-100"
                            rows={5}
                        />
                    )}
                    {type === "Page" && (
                        <Input
                            value={config.path || ""}
                            onChange={(e) =>
                                setConfig({ ...config, path: e.target.value })
                            }
                            placeholder="Page Path"
                            className="mb-4 text-gray-100"
                        />
                    )}
                    {/* Subtasks Management */}
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2 text-blue-400">
                            Subtasks
                        </h3>
                        {subtasks.map((subtask, index) => (
                            <div
                                key={subtask.id}
                                className="mb-2 p-2 bg-gray-700 rounded"
                            >
                                <div className="flex justify-between items-center">
                                    <span>
                                        {subtask.name} ({subtask.type})
                                    </span>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => {
                                                // Open subtask editor (Optional: Implement nested editing)
                                            }}
                                        >
                                            <Eye size={14} />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removeSubtask(index)}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>
                                {/* Display Subtask Configuration based on Type */}
                                {subtask.type === "API" && (
                                    <p className="text-blue-300">
                                        URL: {subtask.config.url}
                                    </p>
                                )}
                                {subtask.type === "Process" && (
                                    <p className="text-blue-300">
                                        Process: {subtask.config.process}
                                    </p>
                                )}
                                {subtask.type === "Condition" && (
                                    <p className="text-blue-300">
                                        Condition: {subtask.config.condition}
                                    </p>
                                )}
                                {subtask.type === "Page" && (
                                    <p className="text-blue-300">
                                        Page: {subtask.config.path}
                                    </p>
                                )}
                            </div>
                        ))}
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={addSubtask}
                            className="flex items-center"
                        >
                            <PlusCircle size={16} className="mr-2" />
                            Add Subtask
                        </Button>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex justify-end">
                        <Button variant="ghost" onClick={onCancel} className="mr-2">
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </div>
            </div>
        );
    };


    // Configuration Inspector Component
    const ConfigurationInspector = ({ config, onClose }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-3/4 max-h-screen overflow-auto">
                <h2 className="text-xl font-bold mb-4 text-blue-400">
                    Inspecting Configuration: {config.name}
                </h2>
                <ScrollArea className="h-[500px]">
                    <pre className="bg-gray-700 p-4 rounded overflow-x-auto text-sm text-blue-300">
                        {JSON.stringify(config.workflow, null, 2)}
                    </pre>
                </ScrollArea>
                <Button onClick={onClose} className="mt-4">Close</Button>
            </div>
        </div>
    );

    // Agent Interconnection Panel
    const AgentInterconnectionPanel = () => {
        const { state, connectTasks, addAgent, removeAgent } = useWorkflow();
        const [sourceAgent, setSourceAgent] = useState('');
        const [targetAgent, setTargetAgent] = useState('');

        const handleConnect = () => {
            if (sourceAgent && targetAgent) {
                connectTasks(sourceAgent, targetAgent);
                setSourceAgent('');
                setTargetAgent('');
            }
        };

        const handleAddAgent = () => {
            const agentName = prompt("Enter Agent Name:");
            if (agentName) {
                const newAgent = {
                    id: generateId(),
                    name: agentName,
                    tasks: []
                };
                addAgent(newAgent);
            }
        };

        const handleRemoveAgent = (agentId) => {
            if (window.confirm("Are you sure you want to remove this agent?")) {
                removeAgent(agentId);
            }
        };

        return (
            <NeomorphicContainer className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-400">Agent Interconnection Panel</h3>
                <div className="flex space-x-2 mb-2">
                    <Select value={sourceAgent} onValueChange={setSourceAgent}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select source agent" />
                        </SelectTrigger>
                        <SelectContent>
                            {state.agents.map(agent => (
                                <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={targetAgent} onValueChange={setTargetAgent}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select target agent" />
                        </SelectTrigger>
                        <SelectContent>
                            {state.agents.map(agent => (
                                <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleConnect}>Connect</Button>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-md font-semibold text-blue-300">Registered Agents</h4>
                    <Button onClick={handleAddAgent} variant="secondary" size="sm">
                        <PlusCircle size={14} className="mr-1" /> Add Agent
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {state.agents.map(agent => (
                        <div key={agent.id} className="flex items-center bg-gray-700 p-2 rounded">
                            <UserIcon className="mr-2 text-blue-300" />
                            <span className="text-blue-300">{agent.name}</span>
                            <Button
                                variant="destructive"
                                size="xs"
                                className="ml-2"
                                onClick={() => handleRemoveAgent(agent.id)}
                            >
                                <Trash2 size={12} />
                            </Button>
                        </div>
                    ))}
                </div>
            </NeomorphicContainer>
        );
    };

    // Workflow State Observer Component
    const WorkflowStateObserver = () => {
        const { state } = useWorkflow();

        return (
            <NeomorphicContainer className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-400">Workflow State Observer</h3>
                <div className="flex justify-between items-center">
                    <div className="p-2 rounded bg-blue-600 text-white">
                        Current State: {state.isExecuting ? 'Executing' : 'Idle'}
                    </div>
                    <p className="mt-2 text-sm">
                        Tasks in Workflow: {state.workflow.length}
                    </p>
                </div>
            </NeomorphicContainer>
        );
    };

    // Header Component
    const Header = () => (
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-400 flex items-center justify-center">
            <CogIcon size={32} className="mr-2" />
            Workflow Builder
        </h1>
    );

    // Configuration Management Component
    const ConfigurationManagement = () => {
        const {
            state,
            dispatch,
            saveConfiguration,
            loadConfiguration,
            deleteConfiguration,
            exportConfiguration,
            importConfiguration,
            fileInputRef
        } = useWorkflow();

        return (
            <NeomorphicContainer className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
                    <Save size={24} className="mr-2" />
                    Configuration Management
                </h2>
                <div className="flex items-center mb-4">
                    <Input
                        value={state.configName}
                        onChange={(e) => dispatch({ type: "SET_CONFIG_NAME", payload: e.target.value })}
                        placeholder="Configuration Name"
                        className="mr-2 text-gray-100"
                    />
                    <Button onClick={saveConfiguration}>Save Config</Button>
                </div>
                <div className="flex justify-between mb-4">
                    <Button onClick={exportConfiguration} className="flex items-center">
                        <Download size={18} className="mr-2" /> Export Config
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={importConfiguration}
                        style={{ display: 'none' }}
                        accept=".json"
                    />
                    <Button onClick={() => fileInputRef.current.click()} className="flex items-center">
                        <Upload size={18} className="mr-2" /> Import Config
                    </Button>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-blue-400">Saved Configurations</h3>
                <ScrollArea className="h-60">
                    {state.savedConfigs.length === 0 && <p className="text-blue-300">No saved configurations.</p>}
                    {state.savedConfigs.map((config) => (
                        <div key={config.id} className="flex justify-between items-center mb-2 p-2 bg-gray-700 rounded">
                            <span>{config.name}</span>
                            <div className="flex space-x-2">
                                <Button onClick={() => loadConfiguration(config)} variant="secondary" size="sm">
                                    Load
                                </Button>
                                <Button onClick={() => dispatch({ type: "SET_INSPECTING_CONFIG", payload: config })} variant="secondary" size="sm">
                                    <Eye size={14} />
                                </Button>
                                <Button onClick={() => deleteConfiguration(config.id)} variant="destructive" size="sm">
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </NeomorphicContainer>
        );
    };

    // API Key Section Component
    const ApiKeySection = () => {
        const { state, handleApiKeyChange } = useWorkflow();

        return (
            <NeomorphicContainer className="mb-6">
                <div className="flex flex-col space-y-4">
                    <div className="flex items-center">
                        <Input
                            type="text"
                            value={state.apiKey}
                            onChange={handleApiKeyChange}
                            placeholder="Enter GROQ API Key"
                            className="flex-grow text-gray-100"
                        />
                        <div className="ml-4 flex items-center">
                            <SettingsIcon size={24} className="mr-2 text-blue-400" />
                            <span className="text-blue-400">API Key Configured</span>
                        </div>
                    </div>
                </div>
            </NeomorphicContainer>
        );
    };

    // Workflow Component
    const Workflow = () => {
        const { state, addTask, executeWorkflow, editTask, deleteTask, connectTasks, agents, delegateTaskToAgent, addAgent, removeAgent } = useWorkflow();

        return (
            <NeomorphicContainer className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-blue-400 flex items-center">
                        <BrainCircuitIcon size={24} className="mr-2" />
                        Workflow
                    </h2>
                    <div className="flex space-x-2">
                        <Button onClick={() => addTask()} variant="secondary">
                            <PlusCircle size={16} className="mr-2" /> Add Task
                        </Button>
                        <Button onClick={executeWorkflow} disabled={state.isExecuting}>
                            {state.isExecuting ? (
                                <>
                                    <Loader className="mr-2 animate-spin" size={16} /> Executing...
                                </>
                            ) : (
                                <>
                                    <Zap size={16} className="mr-2" /> Execute Workflow
                                </>
                            )}
                        </Button>
                    </div>
                </div>
                <ScrollArea className="h-[400px]">
                    {state.workflow.length === 0 ? (
                        <p className="text-center text-gray-500">No tasks in the workflow. Add a task to get started.</p>
                    ) : (
                        <div className="space-y-4">
                            {state.workflow.map(task => (
                                <Task
                                    key={task.id}
                                    task={task}
                                    onEdit={editTask}
                                    onAddSubtask={addTask}
                                    onConnect={connectTasks}
                                    onDelete={deleteTask}
                                />
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </NeomorphicContainer>
        );
    };

    // Execution Log Component
    const ExecutionLog = () => {
        const { state } = useWorkflow();

        return (
            <NeomorphicContainer className="mb-6">
                <h2 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
                    <CogIcon size={24} className="mr-2" />
                    Execution Log
                </h2>
                <ScrollArea className="h-[400px]">
                    {state.executionLog.length === 0 ? (
                        <p className="text-center text-gray-500">No execution logs yet. Execute the workflow to see results.</p>
                    ) : (
                        state.executionLog.map((log, index) => (
                            <div key={index} className="mb-4 p-2 rounded bg-gray-700">
                                <ReactMarkdown
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <SyntaxHighlighter
                                                    style={atomDark}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        }
                                    }}
                                >
                                    {log}
                                </ReactMarkdown>
                            </div>
                        ))
                    )}
                </ScrollArea>
            </NeomorphicContainer>
        );
    };

    // Error Alert Component
    const ErrorAlert = () => {
        const { state, dispatch } = useWorkflow();

        if (!state.error) return null;

        return (
            <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>An Error Occurred</AlertTitle>
                <AlertDescription>
                    <ReactMarkdown
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={atomDark}
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            }
                        }}
                    >
                        {state.error}
                    </ReactMarkdown>
                </AlertDescription>
                <Button
                    variant="link"
                    className="ml-auto"
                    onClick={() => dispatch({ type: "SET_ERROR", payload: null })}
                >
                    Dismiss
                </Button>
            </Alert>
        );
    };

    // Task Component to display individual tasks and handle subtasks recursively
    const Task = ({ task, onEdit, onAddSubtask, onConnect, onDelete, depth = 0 }) => {
        return (
            <NeomorphicContainer className={`m-2 ml-${depth * 5}`}>
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-blue-400">
                            {task.name} ({task.type})
                        </h3>
                        <div className="flex space-x-2">
                            <Button onClick={() => onEdit(task.id)} variant="secondary" size="sm">
                                <Code size={16} />
                            </Button>
                            <Button onClick={() => onAddSubtask(task.id)} variant="secondary" size="sm">
                                <PlusCircle size={16} />
                            </Button>
                            <Button onClick={() => onConnect(task.id)} variant="secondary" size="sm">
                                <Zap size={16} />
                            </Button>
                            <Button onClick={() => onDelete(task.id)} variant="destructive" size="sm">
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </div>
                    {/* Display Task Configuration based on Type */}
                    {task.type === "API" && <p className="text-blue-300">URL: {task.config.url}</p>}
                    {task.type === "Process" && <p className="text-blue-300">Process: {task.config.process}</p>}
                    {task.type === "Condition" && <p className="text-blue-300">Condition: {task.config.condition}</p>}
                    {task.type === "Logic" && <p className="text-blue-300">Logic: {task.config.logic}</p>}
                    {task.type === "Page" && <p className="text-blue-300">Page: {task.config.path}</p>}
                </div>
                {/* Render Subtasks Recursively */}
                {task.subtasks && task.subtasks.map(subtask => (
                    <Task
                        key={subtask.id}
                        task={subtask}
                        onEdit={onEdit}
                        onAddSubtask={onAddSubtask}
                        onConnect={onConnect}
                        onDelete={onDelete}
                        depth={depth + 1}
                    />
                ))}
            </NeomorphicContainer>
        );
    };

    // Task Form Modal Component
    const TaskFormModal = () => {
        const { state, saveTask, dispatch, agents, delegateTaskToAgent } = useWorkflow();

        if (!state.editingTask) return null;

        const handleSave = (updatedTask) => {
            saveTask(updatedTask);
            // Optionally assign the task to an agent
            if (agents.length > 0) {
                const agent = agents[0]; // Assign to the first agent for simplicity
                delegateTaskToAgent(agent, updatedTask);
            }
        };

        return (
            <TaskEditor
                task={state.editingTask}
                onSave={handleSave}
                onCancel={() => dispatch({ type: "SET_EDITING_TASK", payload: null })}
            />
        );
    };

    // Configuration Inspector Modal Component
    const ConfigurationInspectorModal = () => {
        const { state, dispatch } = useWorkflow();

        if (!state.inspectingConfig) return null;

        return (
            <ConfigurationInspector
                config={state.inspectingConfig}
                onClose={() => dispatch({ type: "SET_INSPECTING_CONFIG", payload: null })}
            />
        );
    };

    // Agent System Context
    const AgentContext = createContext();

    const useAgents = () => useContext(AgentContext);

    // Main Workflow Builder Component
    const EnhancedWorkflowBuilder = () => {
        const [state, dispatch] = useReducer(reducer, initialState);
        const fileInputRef = useRef(null);

        // Load initial data from localStorage
        useEffect(() => {
            const storedWorkflow = localStorage.getItem('workflowBuilderWorkflow');
            const storedApiKey = localStorage.getItem('groqApiKey');
            const storedConfigs = localStorage.getItem('workflowBuilderConfigs');
            const storedAgents = localStorage.getItem('workflowBuilderAgents');

            if (storedWorkflow) dispatch({ type: "SET_WORKFLOW", payload: JSON.parse(storedWorkflow) });
            if (storedApiKey) dispatch({ type: "SET_API_KEY", payload: storedApiKey });
            if (storedConfigs) dispatch({ type: "SET_SAVED_CONFIGS", payload: JSON.parse(storedConfigs) });
            if (storedAgents) dispatch({ type: "ADD_AGENT", payload: JSON.parse(storedAgents) });

            // Example: Initialize agents or perform periodic checks
            // This can be expanded based on specific requirements

        }, []);

        // Persist workflow changes to localStorage
        useEffect(() => {
            localStorage.setItem('workflowBuilderWorkflow', JSON.stringify(state.workflow));
        }, [state.workflow]);

        // Persist agents to localStorage
        useEffect(() => {
            localStorage.setItem('workflowBuilderAgents', JSON.stringify(state.agents));
        }, [state.agents]);

        // Generate Mermaid Code
        const generateMermaidCode = useCallback(() => {
            try {
                let code = "graph TB\n";
                state.nodes.forEach((node) => {
                    code += `  ${node.id}["${node.label} (${NODE_TYPES[node.type]})"]\n`;
                });
                state.edges.forEach((edge) => {
                    let edgeSymbol = "-->";
                    if (edge.type && edge.type !== "default") {
                        edgeSymbol = `--|${EDGE_TYPES[edge.type]}|-->`;
                    }
                    code += `  ${edge.from} ${edgeSymbol} ${edge.to}\n`;
                });

                dispatch({ type: "SET_MERMAID_CODE", payload: code });
                dispatch({ type: "SET_ERROR", payload: null });
            } catch (err) {
                dispatch({
                    type: "SET_ERROR",
                    payload: "Error generating Mermaid code. Please check your inputs.",
                });
            }
        }, [state.nodes, state.edges]);

        useEffect(() => {
            generateMermaidCode();
        }, [state.nodes, state.edges, generateMermaidCode]);

        // Handler Functions
        const handleApiKeyChange = (e) => {
            const newApiKey = e.target.value;
            dispatch({ type: "SET_API_KEY", payload: newApiKey });
            localStorage.setItem('groqApiKey', newApiKey);
        };

        // Add Task Function
        const addTask = useCallback((parentId = null) => {
            const newTask = {
                id: generateId(),
                name: 'New Task',
                type: "Process",
                config: {},
                subtasks: [],
                connections: [],
            };

            dispatch({
                type: "ADD_NODE",
                payload: {
                    id: newTask.id,
                    type: newTask.type + "Agent",
                    label: newTask.name,
                }
            });

            if (!parentId) {
                dispatch({ type: "SET_WORKFLOW", payload: [...state.workflow, newTask] });
            } else {
                const updateWorkflow = (tasks) =>
                    tasks.map(task =>
                        task.id === parentId
                            ? { ...task, subtasks: [...task.subtasks, newTask] }
                            : { ...task, subtasks: updateWorkflow(task.subtasks) }
                    );
                dispatch({ type: "SET_WORKFLOW", payload: updateWorkflow(state.workflow) });
            }

            return newTask;
        }, [state.workflow]);

        // Edit Task Function
        const editTask = useCallback((taskId) => {
            const taskToEdit = findTaskById(state.workflow, taskId);
            if (taskToEdit) dispatch({ type: "SET_EDITING_TASK", payload: taskToEdit });
        }, [state.workflow]);

        // Save Task Function
        const saveTask = useCallback((updatedTask) => {
            const updateWorkflow = (tasks) =>
                tasks.map(task =>
                    task.id === updatedTask.id
                        ? updatedTask
                        : { ...task, subtasks: updateWorkflow(task.subtasks) }
                );

            dispatch({ type: "SET_WORKFLOW", payload: updateWorkflow(state.workflow) });
            dispatch({ type: "SET_EDITING_TASK", payload: null });

            // Update node in Mermaid diagram
            dispatch({
                type: "UPDATE_NODE",
                payload: {
                    id: updatedTask.id,
                    updates: {
                        label: updatedTask.name,
                        type: updatedTask.type.toLowerCase() + "Agent"
                    }
                }
            });

            generateMermaidCode();
        }, [state.workflow, generateMermaidCode]);

        // Delete Task Function
        const deleteTask = useCallback((taskId) => {
            const removeTask = (tasks) =>
                tasks.filter(task => {
                    if (task.id === taskId) {
                        dispatch({ type: "REMOVE_NODE", payload: taskId });
                        return false;
                    }
                    task.subtasks = removeTask(task.subtasks);
                    return true;
                });

            dispatch({ type: "SET_WORKFLOW", payload: removeTask(state.workflow) });
            generateMermaidCode();
        }, [state.workflow, generateMermaidCode]);

        // Connect Tasks Function
        const connectTasks = useCallback((sourceId, targetId) => {
            if (sourceId === targetId) {
                dispatch({ type: "SET_ERROR", payload: "Cannot connect a task to itself." });
                return;
            }
            const updateWorkflow = (tasks) =>
                tasks.map(task => {
                    if (task.id === sourceId) {
                        return { ...task, connections: [...task.connections, targetId] };
                    }
                    if (task.subtasks) {
                        return { ...task, subtasks: updateWorkflow(task.subtasks) };
                    }
                    return task;
                });

            dispatch({ type: "SET_WORKFLOW", payload: updateWorkflow(state.workflow) });

            dispatch({
                type: "ADD_EDGE",
                payload: {
                    id: generateId(),
                    from: sourceId,
                    to: targetId,
                    type: "default"
                }
            });

            generateMermaidCode();
        }, [state.workflow, generateMermaidCode]);

        // Execute Workflow Function
        const executeWorkflow = useCallback(async () => {
            dispatch({ type: "SET_EXECUTION_LOG", payload: [] });
            dispatch({ type: "SET_ERROR", payload: null });
            dispatch({ type: "SET_IS_EXECUTING", payload: true });

            const executeTask = async (task, depth = 0) => {
                const logEntry = `${'#'.repeat(depth + 2)} Executing Task: ${task.name} (${task.type})
            - Task ID: \`${task.id}\``;
                dispatch({ type: "ADD_EXECUTION_LOG", payload: logEntry });

                try {
                    let result;
                    switch (task.type) {
                        case "API":
                            result = await simulateApiCall(task.config.url, state.apiKey);
                            break;
                        case "Process":
                            result = await simulateProcess(task.config.process);
                            break;
                        case "Condition":
                            result = await evaluateCondition(task.config.condition);
                            break;
                        case "Logic":
                            result = await executeLogic(task.config.logic);
                            break;
                        case "Page":
                            result = await generatePage(task.config.path);
                            break;
                        default:
                            throw new Error(`Unknown task type: ${task.type}`);
                    }

                    const resultLog = `### Task Result:
            \`\`\`json
            ${JSON.stringify(result, null, 2)}
            \`\`\``;
                    dispatch({ type: "ADD_EXECUTION_LOG", payload: resultLog });

                    const analysis = await performTaskAnalysis(result, task);
                    dispatch({ type: "ADD_EXECUTION_LOG", payload: analysis });

                    const improvement = await selfPromptForImprovement(task, result, analysis);
                    dispatch({ type: "ADD_EXECUTION_LOG", payload: `**Self-Improvement Suggestion:** ${improvement}` });

                    // Delegate Subtasks
                    for (const subtask of task.subtasks || []) {
                        await executeTask(subtask, depth + 1);
                    }

                    // Delegate Connected Tasks
                    for (const connectionId of task.connections || []) {
                        const connectedTask = findTaskById(state.workflow, connectionId);
                        if (connectedTask) {
                            await executeTask(connectedTask, depth + 1);
                        }
                    }

                } catch (error) {
                    const errorLog = `### Error in Execution:
            \`\`\`
            Error executing task ${task.name}: ${error.message}
            Stack Trace: ${error.stack}
            \`\`\``;
                    dispatch({ type: "SET_ERROR", payload: errorLog });
                }
            };

            // Start executing from root tasks
            for (const task of state.workflow) {
                await executeTask(task);
            }

            dispatch({ type: "SET_IS_EXECUTING", payload: false });
        }, [state.workflow, state.apiKey]);

        // Configuration Management Functions
        const saveConfiguration = useCallback(async () => {
            if (!state.configName) {
                dispatch({ type: "SET_ERROR", payload: "Please enter a configuration name" });
                return;
            }
            const newConfig = {
                id: generateId(),
                name: state.configName,
                workflow: state.workflow,
                timestamp: new Date().toISOString(),
            };
            try {
                dispatch({ type: "SET_SAVED_CONFIGS", payload: [...state.savedConfigs, newConfig] });
                dispatch({ type: "SET_CONFIG_NAME", payload: "" });
                await localStorage.setItem("workflowBuilderConfigs", JSON.stringify([...state.savedConfigs, newConfig]));
            } catch (error) {
                dispatch({ type: "SET_ERROR", payload: "Error saving configuration. Please try again." });
                console.error("Error saving configuration:", error);
            }
        }, [state.configName, state.workflow, state.savedConfigs]);

        const loadConfiguration = useCallback(async (config) => {
            try {
                dispatch({ type: "SET_WORKFLOW", payload: config.workflow });
                generateMermaidCode();
            } catch (error) {
                dispatch({ type: "SET_ERROR", payload: "Error loading configuration. Please try again." });
                console.error("Error loading configuration:", error);
            }
        }, [generateMermaidCode]);

        const deleteConfiguration = useCallback(async (configId) => {
            try {
                const updatedConfigs = state.savedConfigs.filter(config => config.id !== configId);
                dispatch({ type: "SET_SAVED_CONFIGS", payload: updatedConfigs });
                await localStorage.setItem("workflowBuilderConfigs", JSON.stringify(updatedConfigs));
            } catch (error) {
                dispatch({ type: "SET_ERROR", payload: "Error deleting configuration. Please try again." });
                console.error("Error deleting configuration:", error);
            }
        }, [state.savedConfigs]);

        const exportConfiguration = useCallback(async () => {
            try {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.workflow, null, 2));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", "workflow_builder_workflow.json");
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
            } catch (error) {
                dispatch({ type: "SET_ERROR", payload: "Error exporting configuration. Please try again." });
                console.error("Error exporting configuration:", error);
            }
        }, [state.workflow]);

        const importConfiguration = useCallback(async (event) => {
            try {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const importedWorkflow = JSON.parse(e.target.result);
                            dispatch({ type: "SET_WORKFLOW", payload: importedWorkflow });
                            generateMermaidCode();
                        } catch (error) {
                            dispatch({ type: "SET_ERROR", payload: "Error importing configuration: Invalid JSON" });
                            console.error("Error importing configuration:", error);
                        }
                    };
                    reader.readAsText(file);
                }
            } catch (error) {
                dispatch({ type: "SET_ERROR", payload: "Error importing configuration. Please try again." });
                console.error("Error importing configuration:", error);
            }
        }, [generateMermaidCode]);

        // Agent Management Functions
        const addAgent = (agent) => {
            dispatch({ type: "ADD_AGENT", payload: agent });
        };

        const removeAgent = (agentId) => {
            dispatch({ type: "REMOVE_AGENT", payload: agentId });
        };

        // Agent Delegation Logic
        const delegateTaskToAgent = useCallback((agent, task) => {
            // Implement intelligent delegation logic here
            // For example, assigning tasks based on agent specialization
            console.log(`Delegating task "${task.name}" to agent "${agent.name}"`);
            // Simulate task assignment
            // In a real-world scenario, this could involve API calls or more complex logic
        }, []);

        // Render the main component
        return (
            <WorkflowContext.Provider value={{
                state,
                dispatch,
                addTask,
                editTask,
                saveTask,
                deleteTask,
                connectTasks,
                executeWorkflow,
                handleApiKeyChange,
                saveConfiguration,
                loadConfiguration,
                deleteConfiguration,
                exportConfiguration,
                importConfiguration,
                agents: state.agents,
                addAgent,
                removeAgent,
                delegateTaskToAgent,
                fileInputRef
            }}>
                <div className="min-h-screen bg-gray-900 text-blue-300 p-8">
                    <Header />
                    <ConfigurationManagement />
                    <ApiKeySection />
                    <Workflow />
                    <ExecutionLog />
                    <ErrorAlert />
                    <TaskFormModal />
                    <ConfigurationInspectorModal />
                    <AgentInterconnectionPanel />
                    <MermaidDiagram code={state.mermaidCode} />
                    <WorkflowStateObserver />
                </div>
            </WorkflowContext.Provider>
        );
    };

    // Simulation functions for tasks with intelligent handling
    const simulateApiCall = async (url, apiKey) => {
        try {
            const response = await fetch(url, {
                method: 'GET', // or other methods based on config
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`API call failed with status ${response.status}`);
            }

            const data = await response.json();
            return {
                status: response.status,
                data: data,
                responseTime: `${Math.floor(Math.random() * 1000)}ms`
            };
        } catch (error) {
            console.error('Error in simulateApiCall:', error);
            throw error;
        }
    };

    const simulateProcess = async (processDescription) => {
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
        return {
            output: `Process "${processDescription}" executed successfully.`,
            duration: `${Math.floor(Math.random() * 500)}ms`
        };
    };

    const evaluateCondition = async (conditionExpression) => {
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));
        const result = Math.random() < 0.5;
        return {
            condition: conditionExpression,
            result: result,
            evaluationTime: `${Math.floor(Math.random() * 500)}ms`
        };
    };

    const executeLogic = async (logicCode) => {
        try {
            // Safely evaluate the logic code
            // WARNING: Using eval can be dangerous. In production, consider using a safe evaluation method.
            const func = new Function(logicCode);
            const result = func();
            return {
                logic: logicCode,
                result: `Logic executed successfully.`,
                executionTime: `${Math.floor(Math.random() * 500)}ms`
            };
        } catch (error) {
            console.error('Error in executeLogic:', error);
            throw error;
        }
    };

    const generatePage = async (path) => {
        await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 600));
        return {
            path: path,
            content: `Generated page content for ${path}.`,
            generationTime: `${Math.floor(Math.random() * 1000)}ms`
        };
    };
}

export default EnhancedWorkflowBuilder;

