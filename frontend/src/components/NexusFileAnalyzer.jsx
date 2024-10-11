"use client";

import React, { useState, useEffect, useCallback, useReducer, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sparkles, Brain, Clock, Zap, Eye, Database, Code, Cloud, Settings, Plus, ArrowRight, XCircle, Pause, Play, SkipForward, Save, Upload, Download, Trash2, RefreshCw, ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';

// Utility Functions
const generateUniqueId = () => Math.random().toString(36).substring(2, 15);

// Agent Class
class CosmicAgent {
    constructor(id, name, systemPrompt = "", userPrompt = "", structurePrompt = "") {
        this.id = id;
        this.name = name;
        this.systemPrompt = systemPrompt;
        this.userPrompt = userPrompt;
        this.structurePrompt = structurePrompt;
        this.connections = [];
        this.subAgents = [];
        this.knowledgeBase = {};
    }

    async queryKnowledgeBase(query) {
        try
        {
            const data = JSON.parse(localStorage.getItem("cosmicKnowledgeBase")) || {};
            this.knowledgeBase = data[query] || {};
        } catch (error)
        {
            console.error("Error fetching cosmic knowledge base:", error);
            this.knowledgeBase = null;
        }
    }

    async storeInKnowledgeBase(data) {
        try
        {
            const currentData = JSON.parse(localStorage.getItem("cosmicKnowledgeBase")) || {};
            currentData[data.key] = data.value;
            localStorage.setItem("cosmicKnowledgeBase", JSON.stringify(currentData));
        } catch (error)
        {
            console.error("Error updating cosmic knowledge base:", error);
        }
    }

    async generateResponse(input, apiKey) {
        await this.queryKnowledgeBase(this.structurePrompt);
        const userMessage = `${this.systemPrompt}\n\nUser Input: ${input}\n\nCosmic Knowledge Base Data: ${JSON.stringify(this.knowledgeBase)}`;

        try
        {
            const response = await fetch("api/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [{ role: "user", content: userMessage }],
                    model: "llama-3.2-90b-text-preview",
                }),
            });

            const data = await response.json();
            const result = data.choices[0].message.content;
            await this.storeInKnowledgeBase({ taskResult: result });
            return result;
        } catch (error)
        {
            console.error("Error:", error);
            return "An error occurred while generating the cosmic response.";
        }
    }
}

// Cosmic Discriminator Class
class CosmicDiscriminator {
    classifyTask(taskDescription) {
        const lowerDesc = taskDescription.toLowerCase();
        if (lowerDesc.includes("quantum")) return "QuantumComputing";
        if (lowerDesc.includes("neural")) return "NeuralNetworks";
        if (lowerDesc.includes("cosmic")) return "CosmicPatterns";
        return "UniversalKnowledge";
    }

    getStructurePrompt(classification, taskDescription) {
        switch (classification)
        {
            case "QuantumComputing":
                return `Analyze quantum algorithms for "${taskDescription}" and format the response in JSON as: { "quantumCircuits": [ ] }`;
            case "NeuralNetworks":
                return `Design neural network architecture for "${taskDescription}" and format it in JSON as: { "layers": [ ] }`;
            case "CosmicPatterns":
                return `Identify cosmic patterns in "${taskDescription}" and format them in JSON as: { "cosmicPatterns": { } }`;
            default:
                return `Synthesize universal knowledge for "${taskDescription}" and format it in JSON as: { "universalInsights": [ ] }`;
        }
    }
}

// Cosmic Agent Factory Class
class CosmicAgentFactory {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.discriminator = new CosmicDiscriminator();
    }

    async createAgentsFromPrompt(prompt) {
        try
        {
            const response = await fetch("https://localhost:3000/app/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "user",
                            content: `Divide the following cosmic prompt into a sequence of transcendent tasks:\n${prompt}`,
                        },
                    ],
                    model: "llama-3.2-90b-text-preview",
                    max_tokens: 500,
                    temperature: 0.7,
                }),
            });

            if (!response.ok)
            {
                const errorData = await response.text();
                throw new Error(`Cosmic API error: ${response.status} ${response.statusText} - ${errorData}`);
            }

            const taskData = await response.json();
            if (!taskData.choices || taskData.choices.length === 0)
            {
                throw new Error("Cosmic API returned no choices.");
            }

            const content = taskData.choices[0].message?.content;
            if (!content)
            {
                throw new Error("Cosmic API response is missing message content.");
            }

            const tasks = content.split("\n").filter((task) => task.trim() !== "");
            if (tasks.length === 0)
            {
                throw new Error("No cosmic tasks were extracted from the prompt.");
            }

            return tasks.map((task, index) => {
                const classification = this.discriminator.classifyTask(task);
                const structurePrompt = this.discriminator.getStructurePrompt(classification, task);
                return new CosmicAgent(
                    generateUniqueId(),
                    `Cosmic Agent ${index + 1}`,
                    `You are a cosmic entity tasked with: ${task}`,
                    `Analyze and process the following cosmic input: ${task}`,
                    structurePrompt
                );
            });
        } catch (error)
        {
            console.error("Error in createAgentsFromPrompt:", error);
            throw error;
        }
    }
}

// Reducer for state management
const cosmicReducer = (state, action) => {
    switch (action.type)
    {
        case 'SET_AGENTS':
            return { ...state, agents: action.payload };
        case 'SET_CONNECTIONS':
            return { ...state, connections: action.payload };
        case 'SET_WORKFLOW_INPUT':
            return { ...state, workflowInput: action.payload };
        case 'SET_WORKFLOW_OUTPUT':
            return { ...state, workflowOutput: action.payload };
        case 'SET_IS_RUNNING':
            return { ...state, isRunning: action.payload };
        case 'SET_API_KEY':
            return { ...state, apiKey: action.payload };
        case 'SET_THINKING_LOG':
            return { ...state, thinkingLog: action.payload };
        case 'SET_PAUSED':
            return { ...state, paused: action.payload };
        case 'SET_EDITING':
            return { ...state, editing: action.payload };
        case 'SET_CONFIG_NAME':
            return { ...state, configName: action.payload };
        case 'SET_SAVED_CONFIGS':
            return { ...state, savedConfigs: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'SET_SELECTED_FILES':
            return { ...state, selectedFiles: action.payload };
        case 'SET_FILE_STRUCTURE':
            return { ...state, fileStructure: action.payload };
        case 'SET_ANALYSIS':
            return { ...state, analysis: action.payload };
        case 'SET_SELECTED_MODEL':
            return { ...state, selectedModel: action.payload };
        case 'SET_KNOWLEDGE_BASE':
            return { ...state, knowledgeBase: action.payload };
        case 'SET_DEBUG_INFO':
            return { ...state, debugInfo: action.payload };
        case 'SET_FILE_CONTENTS':
            return { ...state, fileContents: { ...state.fileContents, ...action.payload } };
        case 'SET_EXPANDED_FOLDERS':
            return { ...state, expandedFolders: action.payload };
        default:
            return state;
    }
};

// Main Component
const CosmicNexusOrchestrator = () => {
    const [state, dispatch] = useReducer(cosmicReducer, {
        agents: [],
        connections: [],
        workflowInput: "",
        workflowOutput: "",
        isRunning: false,
        apiKey: "",
        thinkingLog: [],
        paused: false,
        editing: false,
        configName: "",
        savedConfigs: [],
        error: null,
        selectedFiles: [],
        fileStructure: null,
        analysis: "",
        selectedModel: "llama-3.2-90b-text-preview",
        knowledgeBase: "",
        debugInfo: "",
        fileContents: {},
        expandedFolders: {},
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        const storedApiKey = localStorage.getItem("cosmicApiKey");
        const storedConfigs = JSON.parse(localStorage.getItem("cosmicSavedConfigs")) || [];
        const storedKnowledgeBase = localStorage.getItem("cosmicKnowledgeBase");

        if (storedApiKey) dispatch({ type: 'SET_API_KEY', payload: storedApiKey });
        if (storedConfigs) dispatch({ type: 'SET_SAVED_CONFIGS', payload: storedConfigs });
        if (storedKnowledgeBase) dispatch({ type: 'SET_KNOWLEDGE_BASE', payload: storedKnowledgeBase });

        fetchFileStructure();
    }, []);

    const fetchFileStructure = async () => {
        dispatch({ type: 'SET_IS_RUNNING', payload: true });
        try
        {
            const response = await fetch("/api/get-file-structure");
            const data = await response.json();
            dispatch({ type: 'SET_FILE_STRUCTURE', payload: data.structure });
        } catch (error)
        {
            console.error("Error fetching cosmic file structure:", error);
            dispatch({ type: 'SET_ERROR', payload: "Failed to fetch cosmic file structure. Please try again." });
        } finally
        {
            dispatch({ type: 'SET_IS_RUNNING', payload: false });
        }
    };

    const handleFileSelect = useCallback((filePath) => {
        dispatch({
            type: 'SET_SELECTED_FILES',
            payload: state.selectedFiles.includes(filePath)
                ? state.selectedFiles.filter(f => f !== filePath)
                : [...state.selectedFiles, filePath]
        });
        fetchFileContents(filePath);
    }, [state.selectedFiles]);

    const fetchFileContents = async (filePath) => {
        if (state.fileContents[filePath]) return; // If we already have the contents, don't fetch again
        try
        {
            const response = await fetch('/api/get-file-contents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ files: [filePath] }),
            });
            const data = await response.json();
            dispatch({ type: 'SET_FILE_CONTENTS', payload: { [filePath]: data.fileContents[filePath] } });
        } catch (error)
        {
            console.error("Error fetching file contents:", error);
            dispatch({ type: 'SET_ERROR', payload: "Failed to fetch file contents. Please try again." });
        }
    };

    const toggleFolder = (path) => {
        dispatch({
            type: 'SET_EXPANDED_FOLDERS',
            payload: { ...state.expandedFolders, [path]: !state.expandedFolders[path] }
        });
    };

    const addCosmicAgent = () => {
        const newAgent = new CosmicAgent(generateUniqueId(), `Cosmic Agent ${state.agents.length + 1}`);
        dispatch({ type: 'SET_AGENTS', payload: [...state.agents, newAgent] });
    };

    const removeCosmicAgent = (index) => {
        const agentId = state.agents[index].id;
        const newAgents = state.agents.filter((_, i) => i !== index);
        dispatch({ type: 'SET_AGENTS', payload: newAgents });
        dispatch({
            type: 'SET_CONNECTIONS',
            payload: state.connections.filter((conn) => conn.from !== agentId && conn.to !== agentId)
        });
    };

    const moveCosmicAgent = (fromIndex, toIndex) => {
        const newAgents = [...state.agents];
        const [movedAgent] = newAgents.splice(fromIndex, 1);
        newAgents.splice(toIndex, 0, movedAgent);
        dispatch({ type: 'SET_AGENTS', payload: newAgents });
    };

    const updateCosmicAgent = (index, updatedAgent) => {
        const newAgents = [...state.agents];
        newAgents[index] = updatedAgent;
        dispatch({ type: 'SET_AGENTS', payload: newAgents });
    };

    const addCosmicConnection = (fromIndex, toIndex) => {
        const fromAgentId = state.agents[fromIndex].id;
        const toAgentId = state.agents[toIndex].id;

        if (fromAgentId !== toAgentId && !state.connections.some((conn) => conn.from === fromAgentId && conn.to === toAgentId))
        {
            dispatch({ type: 'SET_CONNECTIONS', payload: [...state.connections, { from: fromAgentId, to: toAgentId }] });
        }
    };

    const runCosmicWorkflow = async () => {
        if (!state.apiKey)
        {
            alert("Please enter your Cosmic API Key in the settings.");
            return;
        }

        dispatch({ type: 'SET_IS_RUNNING', payload: true });
        dispatch({ type: 'SET_WORKFLOW_OUTPUT', payload: "" });
        dispatch({ type: 'SET_THINKING_LOG', payload: [] });
        dispatch({ type: 'SET_ERROR', payload: null });

        try
        {
            const cosmicAgentFactory = new CosmicAgentFactory(state.apiKey);
            const generatedAgents = await cosmicAgentFactory.createAgentsFromPrompt(state.workflowInput);

            dispatch({ type: 'SET_AGENTS', payload: generatedAgents });
            dispatch({ type: 'SET_CONNECTIONS', payload: createCosmicConnections(generatedAgents) });

            let currentInput = state.workflowInput;
            let outputLog = "";

            for (const agent of generatedAgents)
            {
                if (state.paused)
                {
                    await new Promise((resolve) => {
                        const interval = setInterval(() => {
                            if (!state.paused)
                            {
                                clearInterval(interval);
                                resolve();
                            }
                        }, 100);
                    });
                }

                const startTime = Date.now();
                const thinkingUpdate = `${agent.name} is processing the cosmic energies...`;
                dispatch({ type: 'SET_THINKING_LOG', payload: [...state.thinkingLog, thinkingUpdate] });

                const response = await agent.generateResponse(currentInput, state.apiKey);

                const endTime = Date.now();
                const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

                const condensedUnderstanding = `${agent.name} has grasped the essence of the task in ${timeTaken} cosmic seconds.`;
                const insightGained = `Insight: ${response.substring(0, 100)}...`; // Truncate for brevity

                outputLog += `### ${agent.name}\n**Cosmic Input:**\n${currentInput}\n\n**Cosmic Output:**\n${response}\n\n*Time taken: ${timeTaken} cosmic seconds*\n\n**Condensed Understanding:**\n${condensedUnderstanding}\n\n**Insight Gained:**\n${insightGained}\n\n`;

                dispatch({ type: 'SET_THINKING_LOG', payload: [...state.thinkingLog, condensedUnderstanding, insightGained] });

                currentInput = response;
            }

            dispatch({ type: 'SET_WORKFLOW_OUTPUT', payload: outputLog });
        } catch (err)
        {
            console.error("Error running cosmic workflow:", err);
            dispatch({ type: 'SET_ERROR', payload: err.message || "An unexpected cosmic disturbance occurred." });
        } finally
        {
            dispatch({ type: 'SET_IS_RUNNING', payload: false });
        }
    };

    const createCosmicConnections = (generatedAgents) => {
        return generatedAgents.slice(0, -1).map((agent, index) => ({
            from: agent.id,
            to: generatedAgents[index + 1].id,
        }));
    };

    const saveCosmicConfiguration = () => {
        if (!state.configName)
        {
            alert("Please enter a cosmic configuration name.");
            return;
        }
        const newConfig = {
            id: generateUniqueId(),
            name: state.configName,
            agents: state.agents,
            connections: state.connections,
        };
        const updatedConfigs = [...state.savedConfigs, newConfig];
        dispatch({ type: 'SET_SAVED_CONFIGS', payload: updatedConfigs });
        localStorage.setItem("cosmicSavedConfigs", JSON.stringify(updatedConfigs));
        dispatch({ type: 'SET_CONFIG_NAME', payload: "" });
        alert("Cosmic configuration saved successfully!");
    };

    const loadCosmicConfiguration = (config) => {
        dispatch({ type: 'SET_AGENTS', payload: config.agents });
        dispatch({ type: 'SET_CONNECTIONS', payload: config.connections });
        alert(`Cosmic configuration "${config.name}" loaded successfully!`);
    };

    const deleteCosmicConfiguration = (configId) => {
        const updatedConfigs = state.savedConfigs.filter((cfg) => cfg.id !== configId);
        dispatch({ type: 'SET_SAVED_CONFIGS', payload: updatedConfigs });
        localStorage.setItem("cosmicSavedConfigs", JSON.stringify(updatedConfigs));
        alert("Cosmic configuration deleted successfully!");
    };

    const exportCosmicConfiguration = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ agents: state.agents, connections: state.connections }, null, 2));
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `cosmic_workflow_configuration_${Date.now()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const importCosmicConfiguration = (event) => {
        const file = event.target.files[0];
        if (file)
        {
            const reader = new FileReader();
            reader.onload = (e) => {
                try
                {
                    const importedData = JSON.parse(e.target.result);
                    dispatch({ type: 'SET_AGENTS', payload: importedData.agents });
                    dispatch({ type: 'SET_CONNECTIONS', payload: importedData.connections });
                    alert("Cosmic configuration imported successfully!");
                } catch (error)
                {
                    alert("Error importing cosmic configuration: Invalid JSON file.");
                }
            };
            reader.readAsText(file);
        }
    };

    const CosmicAgentNode = ({ agent, index, moveAgent, removeAgent, updateAgent }) => {
        const [{ isDragging }, drag] = useDrag({
            type: "COSMIC_AGENT",
            item: { index },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        });

        const [, drop] = useDrop({
            accept: "COSMIC_AGENT",
            hover: (draggedItem) => {
                if (draggedItem.index !== index)
                {
                    moveAgent(draggedItem.index, index);
                    draggedItem.index = index;
                }
            },
        });

        return (
            <motion.div
                ref={(node) => drag(drop(node))}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className={`bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-lg shadow-lg mb-4 ${isDragging ? 'opacity-50' : ''}`}
            >
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                    <button
                        onClick={() => removeAgent(index)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-300"
                        aria-label={`Remove ${agent.name}`}
                    >
                        <XCircle size={20} />
                    </button>
                </div>
                <div className="space-y-2">
                    <Input
                        value={agent.systemPrompt}
                        onChange={(e) => updateAgent(index, { ...agent, systemPrompt: e.target.value })}
                        placeholder="System Prompt"
                        className="bg-purple-700 text-white placeholder-purple-300"
                    />
                    <Input
                        value={agent.userPrompt}
                        onChange={(e) => updateAgent(index, { ...agent, userPrompt: e.target.value })}
                        placeholder="User Prompt"
                        className="bg-purple-700 text-white placeholder-purple-300"
                    />
                    <Input
                        value={agent.structurePrompt}
                        onChange={(e) => updateAgent(index, { ...agent, structurePrompt: e.target.value })}
                        placeholder="Structure Prompt"
                        className="bg-purple-700 text-white placeholder-purple-300"
                    />
                </div>
            </motion.div>
        );
    };

    const CosmicFileTree = ({ data, onSelect, selectedFiles, expandedFolders, toggleFolder }) => {
        const renderTree = (node, path = '') => {
            if (typeof node === 'string')
            {
                return (
                    <div key={path} className="flex items-center space-x-2 py-1">
                        <Checkbox
                            checked={selectedFiles.includes(path)}
                            onCheckedChange={() => onSelect(path)}
                        />
                        <FileText className="w-4 h-4 text-purple-500" />
                        <span className="cursor-pointer hover:text-purple-600">{node}</span>
                    </div>
                );
            }

            return (
                <div key={path}>
                    <div
                        className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-purple-50"
                        onClick={() => toggleFolder(path)}
                    >
                        {expandedFolders[path] ? <ChevronDown className="w-4 h-4 text-purple-500" /> : <ChevronRight className="w-4 h-4 text-purple-500" />}
                        <Folder className="w-4 h-4 text-purple-500" />
                        <span>{path.split('/').pop() || ''}</span>
                    </div>
                    {expandedFolders[path] && (
                        <div className="pl-4">
                            {Object.entries(node).map(([key, value]) => renderTree(value, `${path}/${key}`))}
                        </div>
                    )}
                </div>
            );
        };

        return <div className="pl-2">{renderTree(data)}</div>;
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="min-h-screen bg-gray-900 text-white p-8">
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        Cosmic Nexus: Omniscient Project Orchestrator and Workflow Analyzer
                    </h1>
                    <p className="text-2xl text-purple-300">Transcend the boundaries of mortal development and analysis</p>
                </header>

                {state.error && (
                    <div className="mb-8 p-4 bg-red-800 rounded-lg">
                        <p className="text-red-300">{state.error}</p>
                    </div>
                )}

                <Tabs defaultValue="cosmic-agents">
                    <TabsList className="mb-8">
                        <TabsTrigger value="cosmic-agents">Cosmic Agents</TabsTrigger>
                        <TabsTrigger value="project-analysis">Project Analysis</TabsTrigger>
                        <TabsTrigger value="cosmic-settings">Cosmic Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="cosmic-agents">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-purple-300">
                                        <Sparkles className="mr-2" />
                                        Cosmic Agent Collective
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Button onClick={addCosmicAgent} className="mb-4 bg-purple-600 hover:bg-purple-700">
                                        <Plus size={16} className="mr-2" />
                                        Add Cosmic Agent
                                    </Button>
                                    <ScrollArea className="h-[400px]">
                                        <AnimatePresence>
                                            {state.agents.map((agent, index) => (
                                                <CosmicAgentNode
                                                    key={agent.id}
                                                    agent={agent}
                                                    index={index}
                                                    moveAgent={moveCosmicAgent}
                                                    removeAgent={removeCosmicAgent}
                                                    updateAgent={updateCosmicAgent}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </ScrollArea>
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-purple-300">
                                        <Brain className="mr-2" />
                                        Cosmic Workflow Execution
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <textarea
                                        value={state.workflowInput}
                                        onChange={(e) => dispatch({ type: 'SET_WORKFLOW_INPUT', payload: e.target.value })}
                                        placeholder="Enter the cosmic prompt to initiate the workflow..."
                                        className="w-full h-32 p-2 mb-4 bg-gray-700 text-white border border-purple-500 rounded-lg"
                                    />
                                    <div className="flex space-x-2 mb-4">
                                        <Button
                                            onClick={runCosmicWorkflow}
                                            disabled={state.isRunning}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            {state.isRunning ? (
                                                <span className="animate-pulse">Cosmic Processing...</span>
                                            ) : (
                                                <>
                                                    <Play size={16} className="mr-2" />
                                                    Execute Cosmic Workflow
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            onClick={() => dispatch({ type: 'SET_PAUSED', payload: !state.paused })}
                                            disabled={!state.isRunning}
                                            className="bg-yellow-600 hover:bg-yellow-700"
                                        >
                                            {state.paused ? (
                                                <>
                                                    <Play size={16} className="mr-2" />
                                                    Resume Cosmic Flow
                                                </>
                                            ) : (
                                                <>
                                                    <Pause size={16} className="mr-2" />
                                                    Pause Cosmic Flow
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold mb-2 text-purple-300">Cosmic Thinking Log:</h3>
                                        <ScrollArea className="h-40 bg-gray-700 p-2 rounded-lg">
                                            {state.thinkingLog.map((log, index) => (
                                                <div key={index} className="text-purple-200">{log}</div>
                                            ))}
                                        </ScrollArea>
                                    </div>
                                    {state.workflowOutput && (
                                        <Collapsible>
                                            <CollapsibleTrigger asChild>
                                                <Button variant="outline" className="mb-2">
                                                    Toggle Cosmic Workflow Output
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <ScrollArea className="h-96 bg-gray-700 p-2 rounded-lg">
                                                    <ReactMarkdown
                                                        components={{
                                                            code({ node, inline, className, children, ...props }) {
                                                                const match = /language-(\w+)/.exec(className || '');
                                                                return !inline && match ? (
                                                                    <SyntaxHighlighter
                                                                        language={match[1]}
                                                                        style={dracula}
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
                                                        {state.workflowOutput}
                                                    </ReactMarkdown>
                                                </ScrollArea>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="project-analysis">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-purple-300">
                                        <Folder className="mr-2" />
                                        Cosmic Project Structure
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Button onClick={fetchFileStructure} className="mb-4 bg-purple-600 hover:bg-purple-700">
                                        <RefreshCw size={16} className="mr-2" />
                                        Refresh Cosmic Structure
                                    </Button>
                                    <ScrollArea className="h-[400px] border border-purple-500 rounded-lg p-2">
                                        {state.fileStructure && (
                                            <CosmicFileTree
                                                data={state.fileStructure}
                                                onSelect={handleFileSelect}
                                                selectedFiles={state.selectedFiles}
                                                expandedFolders={state.expandedFolders}
                                                toggleFolder={toggleFolder}
                                            />
                                        )}
                                    </ScrollArea>
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-purple-300">
                                        <Zap className="mr-2" />
                                        Cosmic Project Analysis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Select onValueChange={(value) => dispatch({ type: 'SET_SELECTED_MODEL', payload: value })}>
                                        <SelectTrigger className="mb-4">
                                            <SelectValue placeholder="Select Cosmic Model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="llama-3.2-90b-text-preview">Cosmic Llama 70B Versatile</SelectItem>
                                            <SelectItem value="llama-3.2-90b-text-preview">Cosmic Llama 70B Tool Use</SelectItem>
                                            <SelectItem value="llama-3.2-90b-text-preview">Cosmic Llama 8B Instant</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <textarea
                                        className="w-full h-32 p-2 mb-4 bg-gray-700 text-white border border-purple-500 rounded-lg"
                                        placeholder="Enter your cosmic analysis prompt..."
                                        value={state.workflowInput}
                                        onChange={(e) => dispatch({ type: 'SET_WORKFLOW_INPUT', payload: e.target.value })}
                                    />
                                    <Button
                                        onClick={runCosmicWorkflow}
                                        disabled={state.isRunning}
                                        className="mb-4 bg-green-600 hover:bg-green-700"
                                    >
                                        {state.isRunning ? 'Analyzing Cosmic Patterns...' : 'Analyze Cosmic Project'}
                                    </Button>
                                    {state.analysis && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2 text-purple-300">Cosmic Analysis Results:</h3>
                                            <ScrollArea className="h-[400px] bg-gray-700 p-4 rounded-lg">
                                                <ReactMarkdown
                                                    components={{
                                                        code({ node, inline, className, children, ...props }) {
                                                            const match = /language-(\w+)/.exec(className || '');
                                                            return !inline && match ? (
                                                                <SyntaxHighlighter
                                                                    language={match[1]}
                                                                    style={dracula}
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
                                                    {state.analysis}
                                                </ReactMarkdown>
                                            </ScrollArea>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                        <Card className="bg-gray-800 mt-8">
                            <CardHeader>
                                <CardTitle className="flex items-center text-purple-300">
                                    <Code className="mr-2" />
                                    Cosmic File Contents
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[400px]">
                                    {state.selectedFiles.map((filePath) => (
                                        <Collapsible key={filePath}>
                                            <CollapsibleTrigger asChild>
                                                <Button variant="outline" className="mb-2 w-full justify-start">
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    {filePath}
                                                </Button>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                <SyntaxHighlighter
                                                    language="javascript"
                                                    style={dracula}
                                                    className="mt-2 rounded-lg"
                                                >
                                                    {state.fileContents[filePath] || 'Loading...'}
                                                </SyntaxHighlighter>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ))}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="cosmic-settings">
                        <Card className="bg-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center text-purple-300">
                                    <Settings className="mr-2" />
                                    Cosmic Nexus Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="apiKey" className="block text-sm font-medium text-purple-300">
                                            Cosmic API Key
                                        </label>
                                        <Input
                                            id="apiKey"
                                            type="password"
                                            value={state.apiKey}
                                            onChange={(e) => dispatch({ type: 'SET_API_KEY', payload: e.target.value })}
                                            placeholder="Enter your cosmic API key"
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="knowledgeBase" className="block text-sm font-medium text-purple-300">
                                            Cosmic Knowledge Base
                                        </label>
                                        <textarea
                                            id="knowledgeBase"
                                            className="w-full h-32 mt-1 p-2 bg-gray-700 text-white border border-purple-500 rounded-lg"
                                            value={state.knowledgeBase}
                                            onChange={(e) => dispatch({ type: 'SET_KNOWLEDGE_BASE', payload: e.target.value })}
                                            placeholder="Enter cosmic knowledge base information..."
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="configName" className="block text-sm font-medium text-purple-300">
                                            Cosmic Configuration Name
                                        </label>
                                        <div className="flex mt-1">
                                            <Input
                                                id="configName"
                                                value={state.configName}
                                                onChange={(e) => dispatch({ type: 'SET_CONFIG_NAME', payload: e.target.value })}
                                                placeholder="Enter configuration name"
                                                className="mr-2"
                                            />
                                            <Button onClick={saveCosmicConfiguration} className="bg-green-600 hover:bg-green-700">
                                                <Save size={16} className="mr-2" />
                                                Save Cosmic Config
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button onClick={exportCosmicConfiguration} className="bg-blue-600 hover:bg-blue-700">
                                            <Download size={16} className="mr-2" />
                                            Export Cosmic Config
                                        </Button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={importCosmicConfiguration}
                                            style={{ display: "none" }}
                                            accept=".json"
                                        />
                                        <Button onClick={() => fileInputRef.current.click()} className="bg-yellow-600 hover:bg-yellow-700">
                                            <Upload size={16} className="mr-2" />
                                            Import Cosmic Config
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4 text-purple-300">Saved Cosmic Configurations</h3>
                                    {state.savedConfigs.length === 0 ? (
                                        <p className="text-purple-200">No saved cosmic configurations.</p>
                                    ) : (
                                        <ScrollArea className="h-64 bg-gray-700 rounded-lg p-4">
                                            {state.savedConfigs.map((config) => (
                                                <div key={config.id} className="flex items-center justify-between bg-gray-600 p-2 rounded mb-2">
                                                    <span className="text-purple-200">{config.name}</span>
                                                    <div className="flex items-center space-x-2">
                                                        <Button onClick={() => loadCosmicConfiguration(config)} className="bg-green-600 hover:bg-green-700">
                                                            <Download size={16} />
                                                        </Button>
                                                        <Button onClick={() => deleteCosmicConfiguration(config.id)} className="bg-red-600 hover:bg-red-700">
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </ScrollArea>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DndProvider>
    );
};

export default CosmicNexusOrchestrator;