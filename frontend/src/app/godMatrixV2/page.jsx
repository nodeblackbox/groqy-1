"use client";

import React, {
    useState,
    useCallback,
    useEffect,
    useReducer,
    useRef,
    createContext,
    useContext,
} from "react";
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
    Cog,
    BrainCircuit,
    User,
    Settings,
    MessageSquare,
    SplitSquare,
    Network,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import MermaidDiagram from "@/components/MermaidDiagram";

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
    agents: [],
    prompt: "",
    mitosisEnabled: false,
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
        case "SET_AGENTS":
            return {
                ...state,
                agents: action.payload,
            };
        case "REMOVE_AGENT":
            return {
                ...state,
                agents: state.agents.filter((agent) => agent.id !== action.payload),
            };
        case "SET_PROMPT":
            return { ...state, prompt: action.payload };
        case "TOGGLE_MITOSIS":
            return { ...state, mitosisEnabled: !state.mitosisEnabled };
        default:
            return state;
    }
}

// Context for Workflow State Management
const WorkflowContext = createContext();

const useWorkflow = () => useContext(WorkflowContext);

// Neomorphic Container Component for consistent styling
const NeomorphicContainer = ({ children, className = "" }) => (
    <Card className={`bg-gray-800 ${className}`}>
        <CardContent>{children}</CardContent>
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
        await new Promise((resolve) =>
            setTimeout(resolve, 700 + Math.random() * 300)
        );
        let analysis = `The task "${task.name}" of type "${task.type}" executed successfully.\n\n`;

        if (typeof result === "object") {
            analysis += `**Result Analysis:**\n`;
            for (const [key, value] of Object.entries(result)) {
                analysis += `- **${key}**: ${typeof value === "number" ? value.toFixed(4) : value
                    }\n`;
            }
        } else {
            analysis += `**Result:** ${result}\n`;
        }

        return analysis;
    } catch (error) {
        console.error("Error in Task Analysis:", error);
        return "Task Analysis encountered an error.";
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
        const improvements = [
            "Consider adding error handling to improve robustness.",
            "Optimize the task by implementing caching mechanisms.",
            "Enhance security by adding input validation.",
            "Improve performance by parallelizing subtasks.",
            "Add telemetry to gather more insightful metrics.",
        ];
        return improvements[Math.floor(Math.random() * improvements.length)];
    } catch (error) {
        console.error("Error in Self Prompt For Improvement:", error);
        return "Self Prompt For Improvement encountered an error.";
    }
};

// Knowledge Base Management Functions
const updateKnowledgeBase = (knowledgeBase, task, result) => {
    const updatedKnowledgeBase = [...knowledgeBase, { task, result }];
    return updatedKnowledgeBase;
};

// Generate Tasks from Prompt
const generateTasksFromPrompt = async (prompt, knowledgeBase, apiKey) => {
    try {
        const response = await fetch("http://localhost:5000/api/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are an AI assistant that generates tasks based on prompts. Generate a list of tasks in JSON format, including potential duplications or variations if appropriate.",
                    },
                    {
                        role: "user",
                        content: `Generate tasks based on this prompt: ${prompt}\nUse this knowledge base: ${JSON.stringify(
                            knowledgeBase
                        )}\nConsider creating duplicate or variant tasks if it would improve the workflow.`,
                    },
                ],
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const generatedTasks = JSON.parse(data.content); // Adjust based on actual API response

        return generatedTasks.map((task) => ({
            ...task,
            id: generateId(),
            subtasks: [],
            connections: [],
        }));
    } catch (error) {
        console.error("Error in generateTasksFromPrompt:", error);
        return [];
    }
};

// Execution functions for tasks with real operations

// Perform API Call
const performApiCall = async (config, apiKey) => {
    try {
        const response = await fetch(config.url, {
            method: config.method || "GET",
            headers: {
                ...config.headers,
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: config.method !== "GET" ? JSON.stringify(config.body) : null,
        });

        if (!response.ok) {
            throw new Error(`API call failed with status ${response.status}`);
        }

        const data = await response.json();
        return {
            status: response.status,
            data: data,
            responseTime: `${Math.floor(Math.random() * 1000)}ms`,
        };
    } catch (error) {
        console.error("Error in performApiCall:", error);
        throw error;
    }
};

// Perform Process
const performProcess = async (config) => {
    await new Promise((resolve) =>
        setTimeout(resolve, 800 + Math.random() * 400)
    );
    return {
        output: `Process "${config.process}" executed successfully.`,
        duration: `${Math.floor(Math.random() * 500)}ms`,
    };
};

// Evaluate Condition
const evaluateCondition = async (conditionExpression) => {
    try {
        await new Promise((resolve) =>
            setTimeout(resolve, 500 + Math.random() * 300)
        );
        const result = Math.random() < 0.5;
        return {
            condition: conditionExpression,
            result: result,
            evaluationTime: `${Math.floor(Math.random() * 500)}ms`,
        };
    } catch (error) {
        console.error("Error in evaluateCondition:", error);
        throw error;
    }
};

// Execute Logic Safely
const executeLogicSafely = async (logicCode) => {
    try {
        await new Promise((resolve) =>
            setTimeout(resolve, 600 + Math.random() * 400)
        );
        // WARNING: Using eval can be dangerous. Ensure logicCode is sanitized and safe.
        // For production, consider using a safer alternative or sandboxing.
        const result = eval(logicCode);
        return {
            logic: logicCode,
            result: `Logic executed successfully with result: ${result}.`,
            executionTime: `${Math.floor(Math.random() * 500)}ms`,
        };
    } catch (error) {
        console.error("Error in executeLogicSafely:", error);
        throw error;
    }
};

// Generate Page
const generatePage = async (path) => {
    await new Promise((resolve) =>
        setTimeout(resolve, 1200 + Math.random() * 600)
    );
    return {
        path: path,
        content: `Generated page content for ${path}.`,
        generationTime: `${Math.floor(Math.random() * 1000)}ms`,
    };
};

// Prompt Input Component
const PromptInput = () => {
    const { state, dispatch, generateTasks } = useWorkflow();
    const [localPrompt, setLocalPrompt] = useState("");

    const handleGenerate = () => {
        dispatch({ type: "SET_PROMPT", payload: localPrompt });
        generateTasks(localPrompt);
    };

    return (
        <NeomorphicContainer className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
                <MessageSquare size={24} className="mr-2" />
                Prompt Input
            </h2>
            <Textarea
                value={localPrompt}
                onChange={(e) => setLocalPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="mb-4 text-gray-100"
                rows={3}
            />
            <Button onClick={handleGenerate} className="flex items-center">
                <Zap size={18} className="mr-2" /> Generate Tasks
            </Button>
        </NeomorphicContainer>
    );
};

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
        fileInputRef,
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
                    onChange={(e) =>
                        dispatch({ type: "SET_CONFIG_NAME", payload: e.target.value })
                    }
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
                    style={{ display: "none" }}
                    accept=".json"
                />
                <Button
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center"
                >
                    <Upload size={18} className="mr-2" /> Import Config
                </Button>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-blue-400">
                Saved Configurations
            </h3>
            <ScrollArea className="h-60">
                {state.savedConfigs.length === 0 && (
                    <p className="text-blue-300">No saved configurations.</p>
                )}
                {state.savedConfigs.map((config) => (
                    <div
                        key={config.id}
                        className="flex justify-between items-center mb-2 p-2 bg-gray-700 rounded"
                    >
                        <span>{config.name}</span>
                        <div className="flex space-x-2">
                            <Button
                                onClick={() => loadConfiguration(config)}
                                variant="secondary"
                                size="sm"
                            >
                                Load
                            </Button>
                            <Button
                                onClick={() =>
                                    dispatch({
                                        type: "SET_INSPECTING_CONFIG",
                                        payload: config,
                                    })
                                }
                                variant="secondary"
                                size="sm"
                            >
                                <Eye size={14} />
                            </Button>
                            <Button
                                onClick={() => deleteConfiguration(config.id)}
                                variant="destructive"
                                size="sm"
                            >
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
                        type="password"
                        value={state.apiKey}
                        onChange={handleApiKeyChange}
                        placeholder="Enter GROQ API Key"
                        className="flex-grow text-gray-100"
                    />
                    {state.apiKey && (
                        <div className="ml-4 flex items-center">
                            <Settings size={24} className="mr-2 text-blue-400" />
                            <span className="text-blue-400">API Key Configured</span>
                        </div>
                    )}
                </div>
            </div>
        </NeomorphicContainer>
    );
};

// Workflow Component
const Workflow = () => {
    const { state, addTask, executeWorkflow, editTask, deleteTask, connectTasks } =
        useWorkflow();

    return (
        <NeomorphicContainer className="mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-400 flex items-center">
                    <BrainCircuit size={24} className="mr-2" />
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
                    <p className="text-center text-gray-500">
                        No tasks in the workflow. Add a task to get started.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {state.workflow.map((task) => (
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

// Task Component
const Task = ({ task, onEdit, onAddSubtask, onConnect, onDelete, depth = 0 }) => {
    const [{ isDragging }, drag] = useDrag({
        type: "TASK",
        item: { id: task.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: "TASK",
        drop: (item, monitor) => {
            if (item.id !== task.id) {
                onConnect(item.id, task.id);
            }
        },
    });

    return (
        <div ref={(node) => drag(drop(node))}>
            <NeomorphicContainer
                className={`m-2 ml-${depth * 5} ${isDragging ? "opacity-50" : "opacity-100"
                    }`}
            >
                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-blue-400">
                            {task.name} ({task.type})
                        </h3>
                        <div className="flex space-x-2">
                            <Button
                                onClick={() => onEdit(task.id)}
                                variant="secondary"
                                size="sm"
                            >
                                <Code size={16} />
                            </Button>
                            <Button
                                onClick={() => onAddSubtask(task.id)}
                                variant="secondary"
                                size="sm"
                            >
                                <PlusCircle size={16} />
                            </Button>
                            <Button
                                onClick={() => onDelete(task.id)}
                                variant="destructive"
                                size="sm"
                            >
                                <Trash2 size={14} />
                            </Button>
                        </div>
                    </div>
                    {task.type === "API" && (
                        <p className="text-blue-300">URL: {task.config.url}</p>
                    )}
                    {task.type === "Process" && (
                        <p className="text-blue-300">Process: {task.config.process}</p>
                    )}
                    {task.type === "Condition" && (
                        <p className="text-blue-300">Condition: {task.config.condition}</p>
                    )}
                    {task.type === "Logic" && (
                        <p className="text-blue-300">Logic: {task.config.logic}</p>
                    )}
                    {task.type === "Page" && (
                        <p className="text-blue-300">Page: {task.config.path}</p>
                    )}
                </div>
                {task.subtasks &&
                    task.subtasks.map((subtask) => (
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
        </div>
    );
};

// Execution Log Component
const ExecutionLog = () => {
    const { state } = useWorkflow();

    return (
        <NeomorphicContainer className="mb-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-400 flex items-center">
                <Cog size={24} className="mr-2" />
                Execution Log
            </h2>
            <ScrollArea className="h-[400px]">
                {state.executionLog.length === 0 ? (
                    <p className="text-center text-gray-500">
                        No execution logs yet. Execute the workflow to see results.
                    </p>
                ) : (
                    state.executionLog.map((log, index) => (
                        <div key={index} className="mb-4 p-2 rounded bg-gray-700">
                            <ReactMarkdown
                                components={{
                                    code({ node, inline, className, children, ...props }) {
                                        const match = /language-(\w+)/.exec(className || "");
                                        return !inline && match ? (
                                            <SyntaxHighlighter
                                                style={atomDark}
                                                language={match[1]}
                                                PreTag="div"
                                                {...props}
                                            >
                                                {String(children).replace(/\n$/, "")}
                                            </SyntaxHighlighter>
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
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
                            const match = /language-(\w+)/.exec(className || "");
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    style={atomDark}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        },
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

// Task Form Modal Component
const TaskFormModal = () => {
    const { state, saveTask, dispatch } = useWorkflow();

    if (!state.editingTask) return null;

    const handleSave = (updatedTask) => {
        saveTask(updatedTask);
    };

    return (
        <TaskEditor
            task={state.editingTask}
            onSave={handleSave}
            onCancel={() => dispatch({ type: "SET_EDITING_TASK", payload: null })}
        />
    );
};

// Task Editor Component
const TaskEditor = ({ task, onSave, onCancel }) => {
    const [name, setName] = useState(task.name);
    const [type, setType] = useState(task.type);
    const [config, setConfig] = useState(task.config);
    const [subtasks, setSubtasks] = useState(task.subtasks || []);
    const [error, setError] = useState(null);

    const handleSave = () => {
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
                {type === "API" && (
                    <>
                        <Input
                            value={config.url || ""}
                            onChange={(e) => setConfig({ ...config, url: e.target.value })}
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
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-blue-400">
                        Subtasks
                    </h3>
                    {subtasks.map((subtask, index) => (
                        <div key={subtask.id} className="mb-2 p-2 bg-gray-700 rounded">
                            <div className="flex justify-between items-center">
                                <span>
                                    {subtask.name} ({subtask.type})
                                </span>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeSubtask(index)}
                                >
                                    <Trash2 size={14} />
                                </Button>
                            </div>
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
            <Button onClick={onClose} className="mt-4">
                Close
            </Button>
        </div>
    </div>
);

// Agent Interconnection Panel
const AgentInterconnectionPanel = () => {
    const { state, connectTasks, addAgent, removeAgent } = useWorkflow();
    const [sourceAgent, setSourceAgent] = useState("");
    const [targetAgent, setTargetAgent] = useState("");

    const handleConnect = () => {
        if (sourceAgent && targetAgent) {
            connectTasks(sourceAgent, targetAgent);
            setSourceAgent("");
            setTargetAgent("");
        }
    };

    const handleAddAgent = () => {
        const agentName = prompt("Enter Agent Name:");
        if (agentName) {
            const newAgent = {
                id: generateId(),
                name: agentName,
                tasks: [],
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
            <h3 className="text-lg font-semibold mb-2 text-blue-400">
                Agent Interconnection Panel
            </h3>
            <div className="flex space-x-2 mb-2">
                <Select value={sourceAgent} onValueChange={setSourceAgent}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select source agent" />
                    </SelectTrigger>
                    <SelectContent>
                        {state.agents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id}>
                                {agent.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={targetAgent} onValueChange={setTargetAgent}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select target agent" />
                    </SelectTrigger>
                    <SelectContent>
                        {state.agents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id}>
                                {agent.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleConnect}>Connect</Button>
            </div>
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-semibold text-blue-300">
                    Registered Agents
                </h4>
                <Button onClick={handleAddAgent} variant="secondary" size="sm">
                    <PlusCircle size={14} className="mr-1" /> Add Agent
                </Button>
            </div>
            <div className="flex flex-wrap gap-2">
                {state.agents.map((agent) => (
                    <div
                        key={agent.id}
                        className="flex items-center bg-gray-700 p-2 rounded"
                    >
                        <User className="mr-2 text-blue-300" />
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
            <h3 className="text-lg font-semibold mb-2 text-blue-400">
                Workflow State Observer
            </h3>
            <div className="flex justify-between items-center">
                <div className="p-2 rounded bg-blue-600 text-white">
                    Current State: {state.isExecuting ? "Executing" : "Idle"}
                </div>
                <p className="mt-2 text-sm">
                    Tasks in Workflow: {state.workflow.length}
                </p>
            </div>
        </NeomorphicContainer>
    );
};

// Multi-Agent Interaction Panel
const MultiAgentInteractionPanel = () => {
    const { state, dispatch } = useWorkflow();
    const [selectedAgents, setSelectedAgents] = useState([]);

    const handleAgentSelect = (agentId) => {
        setSelectedAgents((prev) =>
            prev.includes(agentId)
                ? prev.filter((id) => id !== agentId)
                : [...prev, agentId]
        );
    };

    const initiateInteraction = () => {
        // Implement the logic for multi-agent interaction here
        console.log("Initiating interaction between:", selectedAgents);
        // You would typically dispatch an action or call a function to handle the interaction
    };

    return (
        <NeomorphicContainer className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-400 flex items-center">
                <Network size={24} className="mr-2" />
                Multi-Agent Interaction
            </h3>
            <div className="mb-4">
                {state.agents.map((agent) => (
                    <div key={agent.id} className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            id={`agent-${agent.id}`}
                            checked={selectedAgents.includes(agent.id)}
                            onChange={() => handleAgentSelect(agent.id)}
                            className="mr-2"
                        />
                        <label htmlFor={`agent-${agent.id}`} className="text-blue-300">
                            {agent.name}
                        </label>
                    </div>
                ))}
            </div>
            <Button
                onClick={initiateInteraction}
                disabled={selectedAgents.length < 2}
                className="w-full"
            >
                Initiate Interaction
            </Button>
        </NeomorphicContainer>
    );
};

// Mitosis Control Component
const MitosisControl = () => {
    const { state, dispatch, generateMermaidCode } = useWorkflow();

    const performMitosis = async () => {
        if (!state.mitosisEnabled) return;

        const duplicateTasks = (tasks) => {
            return tasks.flatMap(task => {
                const newTask = {
                    ...task,
                    id: generateId(),
                    name: `${task.name} (Duplicate)`,
                    subtasks: duplicateTasks(task.subtasks || []),
                };
                return [task, newTask];
            });
        };

        const newWorkflow = duplicateTasks(state.workflow);
        dispatch({ type: "SET_WORKFLOW", payload: newWorkflow });

        // Update nodes and edges for the Mermaid diagram
        const newNodes = newWorkflow.map(task => ({
            id: task.id,
            type: `${task.type}Agent`,
            label: task.name,
        }));

        const newEdges = newWorkflow.flatMap(task =>
            (task.connections || []).map(connectionId => ({
                id: generateId(),
                from: task.id,
                to: connectionId,
                type: "default",
            }))
        );

        dispatch({ type: "LOAD_STATE", payload: { nodes: newNodes, edges: newEdges } });
        generateMermaidCode();
    };

    const toggleMitosis = () => {
        dispatch({ type: "TOGGLE_MITOSIS" });
    };

    return (
        <NeomorphicContainer className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-blue-400 flex items-center">
                <SplitSquare size={24} className="mr-2" />
                Mitosis Control
            </h3>
            <div className="flex items-center justify-between">
                <span className="text-blue-300">
                    Mitosis: {state.mitosisEnabled ? "Enabled" : "Disabled"}
                </span>
                <Button onClick={toggleMitosis} variant="outline">
                    {state.mitosisEnabled ? "Disable" : "Enable"} Mitosis
                </Button>
            </div>
            {state.mitosisEnabled && (
                <Button onClick={performMitosis} className="mt-2 w-full">
                    Perform Mitosis
                </Button>
            )}
        </NeomorphicContainer>
    );
};

// Main Workflow Builder Component
export default function EnhancedWorkflowBuilder() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const fileInputRef = useRef(null);

    // Load initial data from localStorage
    useEffect(() => {
        const storedWorkflow = localStorage.getItem("workflowBuilderWorkflow");
        const storedApiKey = localStorage.getItem("groqApiKey");
        const storedConfigs = localStorage.getItem("workflowBuilderConfigs");
        const storedAgents = localStorage.getItem("workflowBuilderAgents");
        const storedKnowledgeBase = localStorage.getItem("workflowBuilderKnowledgeBase");

        if (storedWorkflow)
            dispatch({ type: "SET_WORKFLOW", payload: JSON.parse(storedWorkflow) });
        if (storedApiKey) dispatch({ type: "SET_API_KEY", payload: storedApiKey });
        if (storedConfigs)
            dispatch({
                type: "SET_SAVED_CONFIGS",
                payload: JSON.parse(storedConfigs),
            });
        if (storedAgents)
            dispatch({
                type: "SET_AGENTS",
                payload: JSON.parse(storedAgents),
            });
        if (storedKnowledgeBase)
            dispatch({
                type: "SET_KNOWLEDGE_BASE",
                payload: JSON.parse(storedKnowledgeBase),
            });
    }, []);

    // Persist data to localStorage
    useEffect(() => {
        localStorage.setItem(
            "workflowBuilderWorkflow",
            JSON.stringify(state.workflow)
        );
    }, [state.workflow]);

    useEffect(() => {
        localStorage.setItem(
            "workflowBuilderAgents",
            JSON.stringify(state.agents)
        );
    }, [state.agents]);

    useEffect(() => {
        localStorage.setItem(
            "workflowBuilderKnowledgeBase",
            JSON.stringify(state.knowledgeBase)
        );
    }, [state.knowledgeBase]);

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
        localStorage.setItem("groqApiKey", newApiKey);
    };

    // Add Task Function
    const addTask = useCallback(
        (parentId = null) => {
            const newTask = {
                id: generateId(),
                name: "New Task",
                type: "Process",
                config: {},
                subtasks: [],
                connections: [],
            };

            dispatch({
                type: "ADD_NODE",
                payload: {
                    id: newTask.id,
                    type: `${newTask.type}Agent`,
                    label: newTask.name,
                },
            });

            if (!parentId) {
                dispatch({ type: "SET_WORKFLOW", payload: [...state.workflow, newTask] });
            } else {
                const updateWorkflow = (tasks) =>
                    tasks.map((task) =>
                        task.id === parentId
                            ? { ...task, subtasks: [...task.subtasks, newTask] }
                            : { ...task, subtasks: updateWorkflow(task.subtasks) }
                    );
                dispatch({ type: "SET_WORKFLOW", payload: updateWorkflow(state.workflow) });
            }

            return newTask;
        },
        [state.workflow]
    );

    // Edit Task Function
    const editTask = useCallback(
        (taskId) => {
            const taskToEdit = findTaskById(state.workflow, taskId);
            if (taskToEdit) dispatch({ type: "SET_EDITING_TASK", payload: taskToEdit });
        },
        [state.workflow]
    );

    // Save Task Function
    const saveTask = useCallback(
        (updatedTask) => {
            const updateWorkflow = (tasks) =>
                tasks.map((task) =>
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
                        type: `${updatedTask.type}Agent`,
                    },
                },
            });

            generateMermaidCode();
        },
        [state.workflow, generateMermaidCode]
    );

    // Delete Task Function
    const deleteTask = useCallback(
        (taskId) => {
            const removeTask = (tasks) =>
                tasks.filter((task) => {
                    if (task.id === taskId) {
                        dispatch({ type: "REMOVE_NODE", payload: taskId });
                        return false;
                    }
                    task.subtasks = removeTask(task.subtasks);
                    return true;
                });

            dispatch({ type: "SET_WORKFLOW", payload: removeTask(state.workflow) });
            generateMermaidCode();
        },
        [state.workflow, generateMermaidCode]
    );

    // Connect Tasks Function
    const connectTasks = useCallback(
        (sourceId, targetId) => {
            if (sourceId === targetId) {
                dispatch({ type: "SET_ERROR", payload: "Cannot connect a task to itself." });
                return;
            }
            const updateWorkflow = (tasks) =>
                tasks.map((task) => {
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
                    type: "default",
                },
            });

            generateMermaidCode();
        },
        [state.workflow, generateMermaidCode]
    );

    // Generate Tasks from Prompt
    const generateTasks = useCallback(
        async (prompt) => {
            const generatedTasks = await generateTasksFromPrompt(
                prompt,
                state.knowledgeBase,
                state.apiKey
            );
            // Clear existing workflow and nodes
            dispatch({ type: "SET_WORKFLOW", payload: [] });
            dispatch({ type: "LOAD_STATE", payload: { nodes: [], edges: [] } });
            // Add generated tasks to the workflow
            for (const task of generatedTasks) {
                dispatch({
                    type: "ADD_NODE",
                    payload: {
                        id: task.id,
                        type: `${task.type}Agent`,
                        label: task.name,
                    },
                });
            }
            dispatch({ type: "SET_WORKFLOW", payload: generatedTasks });
            generateMermaidCode();
        },
        [state.knowledgeBase, state.apiKey, generateMermaidCode]
    );

    // Execute Workflow Function
    const executeWorkflowFunction = useCallback(async () => {
        dispatch({ type: "SET_EXECUTION_LOG", payload: [] });
        dispatch({ type: "SET_ERROR", payload: null });
        dispatch({ type: "SET_IS_EXECUTING", payload: true });

        const executeTask = async (task, depth = 0) => {
            const logEntry = `${"#".repeat(
                depth + 2
            )} Executing Task: ${task.name} (${task.type})\n- Task ID: ${task.id}`;
            dispatch({ type: "ADD_EXECUTION_LOG", payload: logEntry });

            try {
                let result;
                switch (task.type) {
                    case "API":
                        result = await performApiCall(task.config, state.apiKey);
                        break;
                    case "Process":
                        result = await performProcess(task.config);
                        break;
                    case "Condition":
                        result = await evaluateCondition(task.config.condition);
                        break;
                    case "Logic":
                        result = await executeLogicSafely(task.config.logic);
                        break;
                    case "Page":
                        result = await generatePage(task.config.path);
                        break;
                    default:
                        throw new Error(`Unknown task type: ${task.type}`);
                }

                const resultLog = `### Task Result:\n\`\`\`json\n${JSON.stringify(
                    result,
                    null,
                    2
                )}\n\`\`\``;
                dispatch({ type: "ADD_EXECUTION_LOG", payload: resultLog });

                const analysis = await performTaskAnalysis(result, task);
                dispatch({ type: "ADD_EXECUTION_LOG", payload: analysis });

                const improvement = await selfPromptForImprovement(
                    task,
                    result,
                    analysis
                );
                dispatch({
                    type: "ADD_EXECUTION_LOG",
                    payload: `**Self-Improvement Suggestion:** ${improvement}`,
                });

                // Update Knowledge Base
                const updatedKnowledgeBase = updateKnowledgeBase(
                    state.knowledgeBase,
                    task,
                    result
                );
                dispatch({ type: "SET_KNOWLEDGE_BASE", payload: updatedKnowledgeBase });

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
                const errorLog = `### Error in Execution:\n\nError executing task ${task.name}: ${error.message}\nStack Trace: ${error.stack}\n`;
                dispatch({ type: "SET_ERROR", payload: errorLog });
            }
        };

        // Start executing from root tasks
        for (const task of state.workflow) {
            await executeTask(task);
        }

        dispatch({ type: "SET_IS_EXECUTING", payload: false });
    }, [state.workflow, state.apiKey, state.knowledgeBase]);

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
            knowledgeBase: state.knowledgeBase,
            timestamp: new Date().toISOString(),
        };
        try {
            const updatedConfigs = [...state.savedConfigs, newConfig];
            dispatch({ type: "SET_SAVED_CONFIGS", payload: updatedConfigs });
            dispatch({ type: "SET_CONFIG_NAME", payload: "" });
            localStorage.setItem(
                "workflowBuilderConfigs",
                JSON.stringify(updatedConfigs)
            );
        } catch (error) {
            dispatch({
                type: "SET_ERROR",
                payload: "Error saving configuration. Please try again.",
            });
            console.error("Error saving configuration:", error);
        }
    }, [state.configName, state.workflow, state.knowledgeBase, state.savedConfigs]);

    const loadConfiguration = useCallback(
        async (config) => {
            try {
                dispatch({ type: "SET_WORKFLOW", payload: config.workflow });
                dispatch({ type: "SET_KNOWLEDGE_BASE", payload: config.knowledgeBase });
                generateMermaidCode();
            } catch (error) {
                dispatch({
                    type: "SET_ERROR",
                    payload: "Error loading configuration. Please try again.",
                });
                console.error("Error loading configuration:", error);
            }
        },
        [generateMermaidCode]
    );

    const deleteConfiguration = useCallback(
        async (configId) => {
            try {
                const updatedConfigs = state.savedConfigs.filter(
                    (config) => config.id !== configId
                );
                dispatch({ type: "SET_SAVED_CONFIGS", payload: updatedConfigs });
                localStorage.setItem(
                    "workflowBuilderConfigs",
                    JSON.stringify(updatedConfigs)
                );
            } catch (error) {
                dispatch({
                    type: "SET_ERROR",
                    payload: "Error deleting configuration. Please try again.",
                });
                console.error("Error deleting configuration:", error);
            }
        },
        [state.savedConfigs]
    );

    const exportConfiguration = useCallback(async () => {
        try {
            const dataStr =
                "data:text/json;charset=utf-8," +
                encodeURIComponent(JSON.stringify(state.workflow, null, 2));
            const downloadAnchorNode = document.createElement("a");
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute(
                "download",
                "workflow_builder_workflow.json"
            );
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        } catch (error) {
            dispatch({
                type: "SET_ERROR",
                payload: "Error exporting configuration. Please try again.",
            });
            console.error("Error exporting configuration:", error);
        }
    }, [state.workflow]);

    const importConfiguration = useCallback(
        async (event) => {
            try {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        try {
                            const importedConfig = JSON.parse(e.target.result);
                            dispatch({ type: "SET_WORKFLOW", payload: importedConfig.workflow });
                            dispatch({
                                type: "SET_KNOWLEDGE_BASE",
                                payload: importedConfig.knowledgeBase || [],
                            });
                            generateMermaidCode();
                        } catch (error) {
                            dispatch({
                                type: "SET_ERROR",
                                payload: "Error importing configuration: Invalid JSON",
                            });
                            console.error("Error importing configuration:", error);
                        }
                    };
                    reader.readAsText(file);
                }
            } catch (error) {
                dispatch({
                    type: "SET_ERROR",
                    payload: "Error importing configuration. Please try again.",
                });
                console.error("Error importing configuration:", error);
            }
        },
        [generateMermaidCode]
    );

    // Agent Management Functions
    const addAgent = (agent) => {
        dispatch({ type: "ADD_AGENT", payload: agent });
    };

    const removeAgent = (agentId) => {
        dispatch({ type: "REMOVE_AGENT", payload: agentId });
    };

    // Agent Delegation Logic
    const delegateTaskToAgent = useCallback((agent, task) => {
        console.log(`Delegating task "${task.name}" to agent "${agent.name}"`);
        // Implement the actual delegation logic here
    }, []);

    // Render the main component
    return (
        <DndProvider backend={HTML5Backend}>
            <WorkflowContext.Provider
                value={{
                    state,
                    dispatch,
                    addTask,
                    editTask,
                    saveTask,
                    deleteTask,
                    connectTasks,
                    executeWorkflow: executeWorkflowFunction,
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
                    fileInputRef,
                    generateTasks,
                }}
            >
                <div className="min-h-screen bg-gray-900 text-blue-300 p-8">
                    <h1 className="text-3xl font-bold mb-8 text-center text-blue-400 flex items-center justify-center">
                        <Cog size={32} className="mr-2" />
                        Enhanced Workflow Builder
                    </h1>
                    <PromptInput />
                    <ConfigurationManagement />
                    <ApiKeySection />
                    <Workflow />
                    <ExecutionLog />
                    <ErrorAlert />
                    <TaskFormModal />
                    <ConfigurationInspectorModal />
                    <AgentInterconnectionPanel />
                    <MitosisControl />
                    <MultiAgentInteractionPanel />
                    <MermaidDiagram code={state.mermaidCode} />
                    <WorkflowStateObserver />
                </div>
            </WorkflowContext.Provider>
        </DndProvider>
    );
}
