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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from "@/components/ui/progress";
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
        try {
            const data = JSON.parse(localStorage.getItem("cosmicKnowledgeBase")) || {};
            this.knowledgeBase = data[query] || {};
        } catch (error) {
            console.error("Error fetching cosmic knowledge base:", error);
            this.knowledgeBase = null;
        }
    }

    async storeInKnowledgeBase(data) {
        try {
            const currentData = JSON.parse(localStorage.getItem("cosmicKnowledgeBase")) || {};
            currentData[data.key] = data.value;
            localStorage.setItem("cosmicKnowledgeBase", JSON.stringify(currentData));
        } catch (error) {
            console.error("Error updating cosmic knowledge base:", error);
        }
    }

    async generateResponse(input, apiKey) {
        await this.queryKnowledgeBase(this.structurePrompt);
        const userMessage = `${this.systemPrompt}\n\nUser Input: ${input}\n\nCosmic Knowledge Base Data: ${JSON.stringify(this.knowledgeBase)}`;

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
        } catch (error) {
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
        switch (classification) {
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
        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Cosmic API error: ${response.status} ${response.statusText} - ${errorData}`);
            }

            const taskData = await response.json();
            if (!taskData.choices || taskData.choices.length === 0) {
                throw new Error("Cosmic API returned no choices.");
            }

            const content = taskData.choices[0].message?.content;
            if (!content) {
                throw new Error("Cosmic API response is missing message content.");
            }

            const tasks = content.split("\n").filter((task) => task.trim() !== "");
            if (tasks.length === 0) {
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
        } catch (error) {
            console.error("Error in createAgentsFromPrompt:", error);
            throw error;
        }
    }
}

// Reducer for state management
const cosmicReducer = (state, action) => {
    switch (action.type) {
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
        case 'SET_FILE_INSIGHTS':
            return { ...state, fileInsights: action.payload };
        case 'SET_SELECTED_FILE':
            return { ...state, selectedFile: action.payload };
        case 'SET_EXTRACTED_COMPONENTS':
            return { ...state, extractedComponents: action.payload };
        default:
            return state;
    }
};

const ComponentExtractor = ({ filePath, fileContent, onExtracted }) => {
  const extractComponents = async () => {
    try {
      const response = await fetch('/api/extract-components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath, fileContent }),
      });
      const extractedComponents = await response.json();
      onExtracted(extractedComponents);
    } catch (error) {
      console.error('Error extracting components:', error);
    }
  };

  return (
    <Button onClick={extractComponents} className="mb-4 bg-purple-600 hover:bg-purple-700">
      Extract and Organize Components
    </Button>
  );
};

const CodeBlock = ({ code, language }) => (
  <SyntaxHighlighter language={language} style={dracula}>
    {code}
  </SyntaxHighlighter>
);

// Main Component
const CosmicPrecisionPrompterV2 = () => {
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
        fileInsights: null,
        selectedFile: null,
        extractedComponents: null,
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
        try {
            const response = await fetch("/api/get-file-structure");
            const data = await response.json();
            dispatch({ type: 'SET_FILE_STRUCTURE', payload: data.structure });
        } catch (error) {
            console.error("Error fetching cosmic file structure:", error);
            dispatch({ type: 'SET_ERROR', payload: "Failed to fetch cosmic file structure. Please try again." });
        } finally {
            dispatch({ type: 'SET_IS_RUNNING', payload: false });
        }
    };

    const handleFileSelect = useCallback(async (filePath) => {
        dispatch({ type: 'SET_SELECTED_FILE', payload: filePath });
        dispatch({ type: 'SET_IS_RUNNING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        try {
            const response = await fetch("/api/comprehensive-file-insights", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filePath }),
            });
            const insights = await response.json();
            dispatch({ type: 'SET_FILE_INSIGHTS', payload: insights });
            fetchFileContents(filePath);
        } catch (error) {
            console.error("Error fetching file insights:", error);
            dispatch({ type: 'SET_ERROR', payload: "Failed to fetch file insights. Please try again." });
        } finally {
            dispatch({ type: 'SET_IS_RUNNING', payload: false });
        }
    }, []);

    const fetchFileContents = async (filePath) => {
        if (state.fileContents[filePath]) return;
        try {
            const response = await fetch('/api/get-file-contents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ files: [filePath] }),
            });
            const data = await response.json();
            dispatch({ type: 'SET_FILE_CONTENTS', 
                payload: { [filePath]:   data.fileContents[filePath] }
            });
        } catch (error) {
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

    const handleExtractedComponents = (components) => {
        dispatch({ type: 'SET_EXTRACTED_COMPONENTS', payload: components });
    };

    const runCosmicWorkflow = async () => {
        if (!state.apiKey) {
            alert("Please enter your Cosmic API Key in the settings.");
            return;
        }

        dispatch({ type: 'SET_IS_RUNNING', payload: true });
        dispatch({ type: 'SET_WORKFLOW_OUTPUT', payload: "" });
        dispatch({ type: 'SET_THINKING_LOG', payload: [] });
        dispatch({ type: 'SET_ERROR', payload: null });

        try {
            const cosmicAgentFactory = new CosmicAgentFactory(state.apiKey);
            const generatedAgents = await cosmicAgentFactory.createAgentsFromPrompt(state.workflowInput);

            dispatch({ type: 'SET_AGENTS', payload: generatedAgents });
            dispatch({ type: 'SET_CONNECTIONS', payload: createCosmicConnections(generatedAgents) });

            let currentInput = state.workflowInput;
            let outputLog = "";

            for (const agent of generatedAgents) {
                if (state.paused) {
                    await new Promise((resolve) => {
                        const interval = setInterval(() => {
                            if (!state.paused) {
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
                const insightGained = `Insight: ${response.substring(0, 100)}...`;

                outputLog += `### ${agent.name}\n**Cosmic Input:**\n${currentInput}\n\n**Cosmic Output:**\n${response}\n\n*Time taken: ${timeTaken} cosmic seconds*\n\n**Condensed Understanding:**\n${condensedUnderstanding}\n\n**Insight Gained:**\n${insightGained}\n\n`;

                dispatch({ type: 'SET_THINKING_LOG', payload: [...state.thinkingLog, condensedUnderstanding, insightGained] });

                currentInput = response;
            }

            dispatch({ type: 'SET_WORKFLOW_OUTPUT', payload: outputLog });
        } catch (err) {
            console.error("Error running cosmic workflow:", err);
            dispatch({ type: 'SET_ERROR', payload: err.message || "An unexpected cosmic disturbance occurred." });
        } finally {
            dispatch({ type: 'SET_IS_RUNNING', payload: false });
        }
    };

    const createCosmicConnections = (generatedAgents) => {
        return generatedAgents.slice(0, -1).map((agent, index) => ({
            from: agent.id,
            to: generatedAgents[index + 1].id,
        }));
    };

    const FileTree = ({ data, onSelect, selectedFile, expandedFolders, toggleFolder }) => {
        const renderTree = (node, path = '') => {
            if (typeof node === 'string') {
                return (
                    <div key={path} className="flex items-center space-x-2 py-1">
                        <Checkbox
                            checked={selectedFile === path}
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

    const renderInsights = () => {
        if (!state.fileInsights) return null;

        return (
            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="components">Components</TabsTrigger>
                    <TabsTrigger value="state">State & Hooks</TabsTrigger>
                    <TabsTrigger value="functions">Functions</TabsTrigger>
                    <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
                    <TabsTrigger value="extracted-components">Extracted Components</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <h4 className="font-semibold">File Path: {state.fileInsights.filePath || 'N/A'}</h4>
                    <h4 className="font-semibold mt-2">Imports:</h4>
                    <ul className="list-disc pl-5">
                        {state.fileInsights.imports && state.fileInsights.imports.map((imp, index) => (
                            <li key={index}>
                                From "{imp.source || 'Unknown'}":
                                {imp.specifiers && imp.specifiers.map(spec => 
                                    ` ${spec.name || 'Unknown'}${spec.importedName && spec.importedName !== spec.name ? ` (as ${spec.importedName})` : ""}`
                                ).join(", ")}
                            </li>
                        ))}
                    </ul>
                </TabsContent>

                <TabsContent value="components">
                    {state.fileInsights.components && Object.entries(state.fileInsights.components).map(([component, details]) => (
                        <div key={component} className="mb-8">
                            <h4 className="font-semibold text-lg">{component}</h4>
                            <p>Type: {details.type}</p>
                            <p>Child Components: {details.childComponents.join(', ') || 'None'}</p>
                            <p>Props: {details.props.join(', ') || 'None'}</p>
                            <p>State Variables: {details.stateVariables.join(', ') || 'None'}</p>
                            <p>Hooks Used: {details.hooks.join(', ') || 'None'}</p>
                            <h5 className="font-semibold mt-2">Code:</h5>
                            <CodeBlock code={details.code} language="jsx" />
                        </div>
                    ))}
                </TabsContent>

                <TabsContent value="state">
                    <h4 className="font-semibold">State Variables:</h4>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Variable</TableHead>
                                <TableHead>Component</TableHead>
                                <TableHead>Initial Value</TableHead>
                                <TableHead>Setter</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {state.fileInsights.stateVariables && Object.entries(state.fileInsights.stateVariables).map(([variable, details]) => (
                                <TableRow key={variable}>
                                    <TableCell>{variable}</TableCell>
                                    <TableCell>{details.component}</TableCell>
                                    <TableCell>{details.initialValue}</TableCell>
                                    <TableCell>{details.setterName}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>

                <TabsContent value="functions">
                    {state.fileInsights.functions && Object.entries(state.fileInsights.functions).map(([func, details]) => (
                        <div key={func} className="mb-8">
                            <h4 className="font-semibold text-lg">{func}</h4>
                            <p>Parameters: {details.params.join(', ') || 'None'}</p>
                            <p>Calls: {details.calls.join(', ') || 'None'}</p>
                            <p>Body Structure: {details.body.join(', ')}</p>
                            <h5 className="font-semibold mt-2">Code:</h5>
                            <CodeBlock code={details.code} language="jsx" />
                        </div>
                    ))}
                </TabsContent>

                <TabsContent value="dependencies">
                    <h4 className="font-semibold">External Dependencies:</h4>
                    <ul className="list-disc pl-5">
                        {state.fileInsights.dependencies && state.fileInsights.dependencies.map((dep, index) => (
                            <li key={index}>{dep}</li>
                        ))}
                    </ul>
                    <h4 className="font-semibold mt-2">File References:</h4>
                    <ul className="list-disc pl-5">
                        {state.fileInsights.fileReferences && state.fileInsights.fileReferences.map((ref, index) => (
                            <li key={index}>{ref}</li>
                        ))}
                    </ul>
                </TabsContent>

                <TabsContent value="extracted-components">
                    {state.extractedComponents ? (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Extracted Components:</h3>
                            {Object.entries(state.extractedComponents).map(([name, component]) => (
                                <div key={name} className="mb-4">
                                    <h4 className="text-md font-semibold">{name}</h4>
                                    <p>Type: {component.type}</p>
                                    <p>Props: {component.props.join(', ')}</p>
                                    <p>Child Components: {component.childComponents.join(', ')}</p>
                                    <p>State Variables: {component.stateVariables.join(', ')}</p>
                                    <p>Hooks: {component.hooks.join(', ')}</p>
                                    <p>New File: {component.path}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No components extracted yet. Use the "Extract and Organize Components" button above.</p>
                    )}
                </TabsContent>
            </Tabs>
        );
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="min-h-screen bg-gray-900 text-white p-8">
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                        Cosmic Precision Prompter V2
                    </h1>
                    <p className="text-2xl text-purple-300">Analyze, Extract, and Orchestrate with Cosmic Precision</p>
                </header>

                {state.error && (
                    <Alert variant="destructive" className="mb-8">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                )}

                <Tabs defaultValue="file-analysis">
                    <TabsList className="mb-8">
                        <TabsTrigger value="file-analysis">File Analysis</TabsTrigger>
                        <TabsTrigger value="workflow-orchestration">Workflow Orchestration</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="file-analysis">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-purple-300">
                                        <Folder className="mr-2" />
                                        Project Structure
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Button onClick={fetchFileStructure} className="mb-4 bg-purple-600 hover:bg-purple-700">
                                        <RefreshCw size={16} className="mr-2" />
                                        Refresh Structure
                                    </Button>
                                    <ScrollArea className="h-[400px] border border-purple-500 rounded-lg p-2">
                                        {state.fileStructure && (
                                            <FileTree
                                                data={state.fileStructure}
                                                onSelect={handleFileSelect}
                                                selectedFile={state.selectedFile}
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
                                        File Insights
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {state.isRunning ? (
                                        <p className="text-xl font-bold animate-pulse">
                                            Analyzing cosmic patterns... 🌌
                                        </p>
                                    ) : state.selectedFile && state.fileInsights ? (
                                        <ScrollArea className="h-[600px]">
                                            <ComponentExtractor
                                                filePath={state.selectedFile}
                                                fileContent={state.fileInsights.fileContent}
                                                onExtracted={handleExtractedComponents}
                                            />
                                            {renderInsights()}
                                        </ScrollArea>
                                    ) : (
                                        <div className="text-center p-8">
                                            <p className="text-xl font-semibold mb-4">
                                                👈 Select a file to begin cosmic analysis
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="workflow-orchestration">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <Card className="bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-purple-300">
                                        <Brain className="mr-2" />
                                        Cosmic Workflow
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <textarea
                                        value={state.workflowInput}
                                        onChange={(e) => dispatch({ type: 'SET_WORKFLOW_INPUT', payload: e.target.value })}
                                        placeholder="Enter the cosmic prompt to initiate the workflow..."
                                        className="w-full h-32 p-2 mb-4 bg-gray-700 text-white border border-purple-500 rounded-lg"
                                    />
                                    <Button
                                        onClick={runCosmicWorkflow}
                                        disabled={state.isRunning}
                                        className="w-full bg-purple-600 hover:bg-purple-700"
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
                                </CardContent>
                            </Card>

                            <Card className="bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center text-purple-300">
                                        <Eye className="mr-2" />
                                        Workflow Output
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-[400px] bg-gray-700 p-2 rounded-lg">
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
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="settings">
                        <Card className="bg-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center text-purple-300">
                                    <Settings className="mr-2" />
                                    Cosmic Settings
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
                                    <Button onClick={() => alert('Settings saved!')} className="w-full bg-purple-600 hover:bg-purple-700">
                                        Save Cosmic Settings
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DndProvider>
    );
};

export default CosmicPrecisionPrompterV2;