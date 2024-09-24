"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    Plus,
    Play,
    Settings,
    ArrowRight,
    XCircle,
    Pause,
    SkipForward,
    Save,
    Upload,
    Download,
    Trash2,
    Eye,
    Edit,
    ChevronDown,
    ChevronUp,
    Database,
    Zap,
    Send,
} from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Utility to generate unique IDs
const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 15);
};

// Knowledge Base Class
class KnowledgeBase {
    constructor() {
        this.data = {};
    }

    async query(prompt) {
        // Simulating a RAG query
        return new Promise((resolve) => {
            setTimeout(() => {
                const relevantData = Object.entries(this.data)
                    .filter(([key]) => prompt.toLowerCase().includes(key.toLowerCase()))
                    .map(([, value]) => value)
                    .join("\n");
                resolve(relevantData || "No relevant information found in the knowledge base.");
            }, 500);
        });
    }

    addEntry(key, value) {
        this.data[key] = value;
    }
}

// ACEAgent Class
class ACEAgent {
    constructor(id, name, knowledgeBase) {
        this.id = id;
        this.name = name;
        this.knowledgeBase = knowledgeBase;
        this.layers = {
            aspirational: {
                morality: "",
                ethics: "",
                mission: ""
            },
            globalStrategy: {
                environmentalContext: "",
                strategy: ""
            },
            agentModel: {
                capabilities: [],
                limitations: [],
                memory: {}
            },
            executiveFunction: {
                risks: [],
                resources: [],
                plans: []
            },
            cognitiveControl: {
                taskSelection: "",
                taskSwitching: ""
            },
            taskProsecution: {
                success: [],
                failure: [],
                individualTasks: []
            }
        };
        this.inputOutput = {
            motors: [],
            sensors: [],
            telemetry: [],
            devices: [],
            api: {}
        };
        this.connections = [];
        this.subAgents = [];
    }

    // Methods for each layer (unchanged)

    async generateResponse(input, apiKey) {
        try {
            const knowledgeBaseInfo = await this.knowledgeBase.query(input);
            const systemPrompt = `You are an ACE agent with the following layers:
${JSON.stringify(this.layers, null, 2)}

Knowledge Base Information:
${knowledgeBaseInfo}

Please respond to the user's input while considering your layers, especially your morality, ethics, and mission. Incorporate relevant knowledge base information in your response.`;

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: input }
                    ],
                    model: "mixtral-8x7b-32768",
                    temperature: 0.7,
                    max_tokens: 1000,
                    stream: true,
                }),
            });

            if (!response.ok) {
                throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let result = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value);
                const lines = chunk.split("\n");
                const parsedLines = lines
                    .map((line) => line.replace(/^data: /, "").trim())
                    .filter((line) => line !== "" && line !== "[DONE]")
                    .map((line) => JSON.parse(line));

                for (const parsedLine of parsedLines) {
                    const { choices } = parsedLine;
                    const { delta } = choices[0];
                    const { content } = delta;
                    if (content) {
                        result += content;
                    }
                }
            }

            return result;
        } catch (error) {
            console.error("Error:", error);
            return "An error occurred while generating the response.";
        }
    }
}

// AgentFactory Class
class AgentFactory {
    constructor(apiKey, knowledgeBase) {
        this.apiKey = apiKey;
        this.knowledgeBase = knowledgeBase;
    }

    async createAgentsFromPrompt(prompt) {
        try {
            const knowledgeBaseInfo = await this.knowledgeBase.query(prompt);
            const systemPrompt = `You are an AI assistant that creates ACE agents based on prompts. Generate a list of ACE agents with their layers in JSON format. Consider the following knowledge base information:

${knowledgeBaseInfo}

Create agents that align with this information and the user's prompt.`;

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `Create ACE agents based on this prompt: ${prompt}` },
                    ],
                    model: "mixtral-8x7b-32768",
                    temperature: 0.7,
                    max_tokens: 2000,
                }),
            });

            if (!response.ok) {
                throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const generatedAgents = JSON.parse(data.choices[0].message.content);

            return generatedAgents.map(agentData => {
                const agent = new ACEAgent(generateUniqueId(), agentData.name, this.knowledgeBase);
                agent.updateAspirationalLayer(agentData.layers.aspirational.morality, agentData.layers.aspirational.ethics, agentData.layers.aspirational.mission);
                agent.updateGlobalStrategy(agentData.layers.globalStrategy.environmentalContext, agentData.layers.globalStrategy.strategy);
                agent.updateAgentModel(agentData.layers.agentModel.capabilities, agentData.layers.agentModel.limitations, agentData.layers.agentModel.memory);
                agent.updateExecutiveFunction(agentData.layers.executiveFunction.risks, agentData.layers.executiveFunction.resources, agentData.layers.executiveFunction.plans);
                agent.updateCognitiveControl(agentData.layers.cognitiveControl.taskSelection, agentData.layers.cognitiveControl.taskSwitching);
                agent.updateTaskProsecution(agentData.layers.taskProsecution.success, agentData.layers.taskProsecution.failure, agentData.layers.taskProsecution.individualTasks);
                agent.updateInputOutput(agentData.inputOutput.motors, agentData.inputOutput.sensors, agentData.inputOutput.telemetry, agentData.inputOutput.devices, agentData.inputOutput.api);
                return agent;
            });
        } catch (error) {
            console.error("Error in createAgentsFromPrompt:", error);
            throw error;
        }
    }
}

// AgentDelegator Class
class AgentDelegator {
    constructor(knowledgeBase, apiKey) {
        this.knowledgeBase = knowledgeBase;
        this.apiKey = apiKey;
    }

    async delegateTask(task, agents) {
        const knowledgeBaseInfo = await this.knowledgeBase.query(task);
        const agentDescriptions = agents.map(agent => `${agent.name}: ${JSON.stringify(agent.layers.agentModel)}`).join("\n");

        const systemPrompt = `You are an AI assistant responsible for delegating tasks to the most suitable ACE agent. Consider the following knowledge base information and available agents:

Knowledge Base Information:
${knowledgeBaseInfo}

Available Agents:
${agentDescriptions}

Delegate the task to the most suitable agent and provide any necessary additional instructions or data from the knowledge base.`;

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `Delegate this task: ${task}` },
                    ],
                    model: "mixtral-8x7b-32768",
                    temperature: 0.7,
                    max_tokens: 1000,
                }),
            });

            if (!response.ok) {
                throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const delegation = data.choices[0].message.content;

            return delegation;
        } catch (error) {
            console.error("Error in delegateTask:", error);
            throw error;
        }
    }
}

// ACEAgentNode Component
const ACEAgentNode = ({ agent, index, moveAgent, removeAgent, updateAgent }) => {
    const [, drag] = useDrag({
        type: "AGENT",
        item: { index },
    });

    const [, drop] = useDrop({
        accept: "AGENT",
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveAgent(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    const handleInputChange = (e, field, layer) => {
        const updatedAgent = { ...agent };
        if (layer) {
            updatedAgent.layers[layer][field] = e.target.value;
        } else {
            updatedAgent[field] = e.target.value;
        }
        updateAgent(index, updatedAgent);
    };

    return (
        <Card ref={(node) => drag(drop(node))} className="mb-4 bg-gray-800 border-blue-500">
            <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-blue-300">{agent.name}</h3>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAgent(index)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-300"
                    >
                        <XCircle size={20} />
                        <span className="sr-only">Remove agent</span>
                    </Button>
                </div>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="aspirational">
                        <AccordionTrigger>Aspirational Layer</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2">
                                <Input
                                    value={agent.layers.aspirational.morality}
                                    onChange={(e) => handleInputChange(e, "morality", "aspirational")}
                                    placeholder="Morality"
                                    className="w-full bg-gray-700 text-white"
                                />
                                <Input
                                    value={agent.layers.aspirational.ethics}
                                    onChange={(e) => handleInputChange(e, "ethics", "aspirational")}
                                    placeholder="Ethics"
                                    className="w-full bg-gray-700 text-white"
                                />
                                <Input
                                    value={agent.layers.aspirational.mission}
                                    onChange={(e) => handleInputChange(e, "mission", "aspirational")}
                                    placeholder="Mission"
                                    className="w-full bg-gray-700 text-white"
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="globalStrategy">
                        <AccordionTrigger>Global Strategy Layer</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2">
                                <Textarea
                                    value={agent.layers.globalStrategy.environmentalContext}
                                    onChange={(e) => handleInputChange(e, "environmentalContext", "globalStrategy")}
                                    placeholder="Environmental Context"
                                    className="w-full bg-gray-700 text-white"
                                />
                                <Textarea
                                    value={agent.layers.globalStrategy.strategy}
                                    onChange={(e) => handleInputChange(e, "strategy", "globalStrategy")}
                                    placeholder="Strategy"
                                    className="w-full bg-gray-700 text-white"
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    {/* Add similar AccordionItems for other layers */}
                </Accordion>
            </CardContent>
        </Card>
    );
};

// Chat Message Component
const ChatMessage = ({ message, isUser }) => (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-3/4 p-3 rounded-lg ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
            {message}
        </div>
    </div>
);

// Main Application Component
export default function EnhancedACEWorkflowBuilder() {
    const [agents, setAgents] = useState([]);
    const [connections, setConnections] = useState([]);
    const [workflow, setWorkflow] = useState({ input: "", output: "" });
    const [isRunning, setIsRunning] = useState(false);
    const [apiKey, setApiKey] = useState("");
    const [showSettings, setShowSettings] = useState(false);
    const [thinkingLog, setThinkingLog] = useState([]);
    const [paused, setPaused] = useState(false);
    const [editing, setEditing] = useState(false);
    const [configName, setConfigName] = useState("");
    const [savedConfigs, setSavedConfigs] = useState([]);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const [knowledgeBase] = useState(new KnowledgeBase());
    const [showKnowledgeBaseDialog, setShowKnowledgeBaseDialog] = useState(false);
    const [knowledgeBaseEntry, setKnowledgeBaseEntry] = useState({ key: "", value: "" });
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [suggestedPrompt, setSuggestedPrompt] = useState("");

    useEffect(() => {
        const storedApiKey = localStorage.getItem("apiKey");
        const storedConfigs = JSON.parse(localStorage.getItem("savedConfigs")) || [];

        if (storedApiKey) setApiKey(storedApiKey);
        if (storedConfigs) setSavedConfigs(storedConfigs);
    }, []);

    useEffect(() => {
        localStorage.setItem("apiKey", apiKey);
    }, [apiKey]);

    const addAgent = () => {
        const newAgent = new ACEAgent(generateUniqueId(), `Agent ${agents.length + 1}`, knowledgeBase);
        setAgents([...agents, newAgent]);
    };

    const removeAgent = (index) => {
        const agentId = agents[index].id;
        const newAgents = agents.filter((_, i) => i !== index);
        setAgents(newAgents);
        setConnections(connections.filter((conn) => conn.from !== agentId && conn.to !== agentId));
    };

    const moveAgent = (fromIndex, toIndex) => {
        const newAgents = [...agents];
        const [movedAgent] = newAgents.splice(fromIndex, 1);
        newAgents.splice(toIndex, 0, movedAgent);
        setAgents(newAgents);
    };

    const updateAgent = (index, updatedAgent) => {
        const newAgents = [...agents];
        newAgents[index] = updatedAgent;
        setAgents(newAgents);
    };

    const addConnection = (fromIndex, toIndex) => {
        const fromAgentId = agents[fromIndex].id;
        const toAgentId = agents[toIndex].id;

        if (fromAgentId !== toAgentId && !connections.some((conn) => conn.from === fromAgentId && conn.to === toAgentId)) {
            setConnections([...connections, { from: fromAgentId, to: toAgentId }]);
        }
    };

    const saveConfiguration = () => {
        if (!configName) {
            setError("Please enter a configuration name.");
            return;
        }
        const newConfig = {
            id: generateUniqueId(),
            name: configName,
            agents,
            connections,
        };
        const updatedConfigs = [...savedConfigs, newConfig];
        setSavedConfigs(updatedConfigs);
        localStorage.setItem("savedConfigs", JSON.stringify(updatedConfigs));
        setConfigName("");
        setError("Configuration saved successfully!");
    };

    const loadConfiguration = (config) => {
        setAgents(config.agents);
        setConnections(config.connections);
        setError(`Configuration "${config.name}" loaded successfully!`);
    };

    const deleteConfiguration = (configId) => {
        const updatedConfigs = savedConfigs.filter((cfg) => cfg.id !== configId);
        setSavedConfigs(updatedConfigs);
        localStorage.setItem("savedConfigs", JSON.stringify(updatedConfigs));
        setError("Configuration deleted successfully!");
    };

    const exportConfiguration = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ agents, connections }, null, 2));
        const downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `ace_workflow_configuration_${Date.now()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const importConfiguration = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    setAgents(importedData.agents);
                    setConnections(importedData.connections);
                    setError("Configuration imported successfully!");
                } catch (error) {
                    setError("Error importing configuration: Invalid JSON file.");
                }
            };
            reader.readAsText(file);
        }
    };

    const addKnowledgeBaseEntry = () => {
        if (knowledgeBaseEntry.key && knowledgeBaseEntry.value) {
            knowledgeBase.addEntry(knowledgeBaseEntry.key, knowledgeBaseEntry.value);
            setKnowledgeBaseEntry({ key: "", value: "" });
            setError("Knowledge base entry added successfully!");
        } else {
            setError("Please provide both key and value for the knowledge base entry.");
        }
    };

    const runWorkflow = async () => {
        if (!apiKey) {
            setError("Please enter your API Key in the settings.");
            return;
        }

        setIsRunning(true);
        setWorkflow(prev => ({ ...prev, output: "" }));
        setThinkingLog([]);
        setError(null);
        let currentInput = workflow.input;

        try {
            const agentFactory = new AgentFactory(apiKey, knowledgeBase);
            const generatedAgents = await agentFactory.createAgentsFromPrompt(workflow.input);

            setAgents(generatedAgents);
            setConnections(createConnections(generatedAgents));

            const agentDelegator = new AgentDelegator(knowledgeBase, apiKey);

            for (const agent of generatedAgents) {
                if (paused) {
                    await new Promise((resolve) => {
                        const interval = setInterval(() => {
                            if (!paused) {
                                clearInterval(interval);
                                resolve();
                            }
                        }, 100);
                    });
                }

                const startTime = Date.now();
                setThinkingLog((prevLog) => [...prevLog, `${agent.name} is processing...`]);

                const delegation = await agentDelegator.delegateTask(currentInput, generatedAgents);
                setThinkingLog((prevLog) => [...prevLog, `Task delegated: ${delegation}`]);

                const response = await agent.generateResponse(currentInput, apiKey);

                const endTime = Date.now();
                const timeTaken = ((endTime - startTime) / 1000).toFixed(2);

                setWorkflow(prev => ({
                    ...prev,
                    output: prev.output + `### ${agent.name}\n**Input:**\n${currentInput}\n\n**Delegation:**\n${delegation}\n\n**Output:**\n${response}\n\n*Time taken: ${timeTaken} seconds*\n\n`
                }));

                setThinkingLog((prevLog) => [...prevLog, `${agent.name} finished in ${timeTaken} seconds.`]);

                currentInput = response;

                // Implement mitosis (agent splitting) based on task complexity
                if (response.length > 500) { // Arbitrary threshold for demonstration
                    const newAgent = new ACEAgent(generateUniqueId(), `${agent.name} Clone`, knowledgeBase);
                    newAgent.layers = JSON.parse(JSON.stringify(agent.layers)); // Deep copy of layers
                    setAgents((prevAgents) => [...prevAgents, newAgent]);
                    setThinkingLog((prevLog) => [...prevLog, `${agent.name} performed mitosis due to task complexity.`]);
                }
            }
        } catch (err) {
            console.error("Error running workflow:", err);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsRunning(false);
        }
    };

    const createConnections = (generatedAgents) => {
        return generatedAgents.slice(0, -1).map((agent, index) => ({
            from: agent.id,
            to: generatedAgents[index + 1].id,
        }));
    };

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        setChatMessages([...chatMessages, { text: chatInput, isUser: true }]);
        setChatInput("");

        try {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: "You are an AI assistant helping to create an initial prompt for an ACE Workflow. Provide concise and relevant responses." },
                        ...chatMessages.map(msg => ({ role: msg.isUser ? "user" : "assistant", content: msg.text })),
                        { role: "user", content: chatInput }
                    ],
                    model: "mixtral-8x7b-32768",
                    temperature: 0.7,
                    max_tokens: 1000,
                }),
            });

            if (!response.ok) {
                throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            setChatMessages(prev => [...prev, { text: aiResponse, isUser: false }]);

            // Generate suggested prompt
            const promptResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: "Based on the chat history, generate a concise initial prompt for the ACE Workflow." },
                        ...chatMessages.map(msg => ({ role: msg.isUser ? "user" : "assistant", content: msg.text })),
                        { role: "user", content: chatInput },
                        { role: "assistant", content: aiResponse },
                        { role: "user", content: "Generate a concise initial prompt based on our conversation." }
                    ],
                    model: "mixtral-8x7b-32768",
                    temperature: 0.7,
                    max_tokens: 500,
                }),
            });

            if (!promptResponse.ok) {
                throw new Error(`Groq API error: ${promptResponse.status} ${promptResponse.statusText}`);
            }

            const promptData = await promptResponse.json();
            const suggestedPrompt = promptData.choices[0].message.content;

            setSuggestedPrompt(suggestedPrompt);
            setWorkflow(prev => ({ ...prev, input: suggestedPrompt }));

        } catch (error) {
            console.error("Error in chat:", error);
            setChatMessages(prev => [...prev, { text: "An error occurred. Please try again.", isUser: false }]);
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="container mx-auto p-8 bg-gray-900 min-h-screen text-gray-100">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-400">Enhanced ACE Workflow Builder</h1>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowKnowledgeBaseDialog(true)}
                            className="bg-gray-800 text-blue-300 hover:bg-gray-700"
                        >
                            <Database size={20} className="mr-2" />
                            Knowledge Base
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setShowSettings(!showSettings)}
                            className="bg-gray-800 text-blue-300 hover:bg-gray-700"
                        >
                            <Settings size={20} className="mr-2" />
                            Settings
                        </Button>
                    </div>
                </div>

                {error && (
                    <Alert variant={error.includes("successfully") ? "default" : "destructive"} className="mb-8">
                        <AlertTitle>Notification</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Chat Interface */}
                <Card className="mb-8 bg-gray-800">
                    <CardContent className="p-4">
                        <h2 className="text-xl font-semibold text-blue-300 mb-4">Chat</h2>
                        <ScrollArea className="h-64 mb-4">
                            {chatMessages.map((message, index) => (
                                <ChatMessage key={index} message={message.text} isUser={message.isUser} />
                            ))}
                        </ScrollArea>
                        <form onSubmit={handleChatSubmit} className="flex space-x-2">
                            <Input
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-grow bg-gray-700 text-white"
                            />
                            <Button type="submit">
                                <Send size={20} />
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Suggested Prompt */}
                {suggestedPrompt && (
                    <Card className="mb-8 bg-gray-800">
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold text-blue-300 mb-2">Suggested Initial Prompt</h2>
                            <p className="text-gray-300">{suggestedPrompt}</p>
                        </CardContent>
                    </Card>
                )}

                {showSettings && (
                    <Card className="mb-8 bg-gray-800">
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold text-blue-300 mb-4">Settings</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="apiKey" className="block text-sm font-medium text-blue-400 mb-1">
                                        API Key:
                                    </label>
                                    <Input
                                        id="apiKey"
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        className="w-full bg-gray-700 text-white"
                                        placeholder="Enter your API Key"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-blue-300 mb-2">Configuration Management</h3>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Input
                                            value={configName}
                                            onChange={(e) => setConfigName(e.target.value)}
                                            className="flex-grow bg-gray-700 text-white"
                                            placeholder="Configuration Name"
                                        />
                                        <Button onClick={saveConfiguration} variant="secondary">
                                            <Save size={16} className="mr-1" />
                                            Save Config
                                        </Button>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button onClick={exportConfiguration} variant="outline">
                                            <Download size={16} className="mr-1" />
                                            Export Config
                                        </Button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={importConfiguration}
                                            style={{ display: "none" }}
                                            accept=".json"
                                        />
                                        <Button onClick={() => fileInputRef.current.click()} variant="outline">
                                            <Upload size={16} className="mr-1" />
                                            Import Config
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-md font-semibold text-blue-300 mb-2">Saved Configurations</h4>
                                    {savedConfigs.length === 0 ? (
                                        <p className="text-blue-200">No saved configurations.</p>
                                    ) : (
                                        <ScrollArea className="h-48">
                                            {savedConfigs.map((config) => (
                                                <div key={config.id} className="flex items-center justify-between bg-gray-700 p-2 rounded mb-2">
                                                    <span>{config.name}</span>
                                                    <div className="flex items-center space-x-2">
                                                        <Button onClick={() => loadConfiguration(config)} variant="ghost" size="sm">
                                                            <Download size={16} />
                                                        </Button>
                                                        <Button onClick={() => deleteConfiguration(config.id)} variant="ghost" size="sm">
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </ScrollArea>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Dialog open={showKnowledgeBaseDialog} onOpenChange={setShowKnowledgeBaseDialog}>
                    <DialogContent className="bg-gray-800 text-white">
                        <DialogHeader>
                            <DialogTitle>Knowledge Base Management</DialogTitle>
                            <DialogDescription>
                                Add or view entries in the knowledge base.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="flex space-x-2">
                                <Input
                                    value={knowledgeBaseEntry.key}
                                    onChange={(e) => setKnowledgeBaseEntry({ ...knowledgeBaseEntry, key: e.target.value })}
                                    placeholder="Key"
                                    className="flex-1 bg-gray-700 text-white"
                                />
                                <Input
                                    value={knowledgeBaseEntry.value}
                                    onChange={(e) => setKnowledgeBaseEntry({ ...knowledgeBaseEntry, value: e.target.value })}
                                    placeholder="Value"
                                    className="flex-1 bg-gray-700 text-white"
                                />
                                <Button onClick={addKnowledgeBaseEntry} variant="secondary">
                                    Add Entry
                                </Button>
                            </div>
                            <ScrollArea className="h-64">
                                {Object.entries(knowledgeBase.data).map(([key, value]) => (
                                    <div key={key} className="bg-gray-700 p-2 rounded mb-2">
                                        <strong>{key}:</strong> {value}
                                    </div>
                                ))}
                            </ScrollArea>
                        </div>
                    </DialogContent>
                </Dialog>

                <Button onClick={addAgent} className="mb-8 bg-blue-600 hover:bg-blue-500">
                    <Plus size={24} className="mr-2" />
                    Add Agent
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {agents.map((agent, index) => (
                        <ACEAgentNode
                            key={agent.id}
                            agent={agent}
                            index={index}
                            moveAgent={moveAgent}
                            removeAgent={removeAgent}
                            updateAgent={updateAgent}
                        />
                    ))}
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-300">Workflow Connections</h2>
                    <div className="flex flex-wrap gap-4">
                        {connections.map((conn, index) => (
                            <div key={index} className="flex items-center p-2 bg-gray-800 rounded-lg text-blue-200">
                                <span>{agents.find((a) => a.id === conn.from)?.name || `Agent ${conn.from}`}</span>
                                <ArrowRight size={20} className="mx-2 text-blue-400" />
                                <span>{agents.find((a) => a.id === conn.to)?.name || `Agent ${conn.to}`}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-300">Run Workflow</h2>
                    <Textarea
                        value={workflow.input}
                        onChange={(e) => setWorkflow(prev => ({ ...prev, input: e.target.value }))}
                        placeholder="Enter initial input for the workflow"
                        className="w-full p-4 bg-gray-800 border border-blue-500 rounded-lg text-white mb-4"
                        rows="3"
                        disabled={isRunning}
                    />
                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={runWorkflow}
                            disabled={isRunning || agents.length === 0}
                            className={`bg-green-600 hover:bg-green-500 ${isRunning || agents.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isRunning ? (
                                <span className="animate-pulse">Running...</span>
                            ) : (
                                <>
                                    <Play size={24} className="mr-2" />
                                    Run Workflow
                                </>
                            )}
                        </Button>
                        <Button
                            onClick={paused ? () => setPaused(false) : () => setPaused(true)}
                            disabled={!isRunning}
                            className={`bg-yellow-600 hover:bg-yellow-500 ${!isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {paused ? (
                                <>
                                    <Play size={24} className="mr-2" />
                                    Resume
                                </>
                            ) : (
                                <>
                                    <Pause size={24} className="mr-2" />
                                    Pause
                                </>
                            )}
                        </Button>
                        <Button
                            onClick={() => setEditing(true)}
                            disabled={!paused}
                            className={`bg-blue-600 hover:bg-blue-500 ${!paused ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <Edit size={24} className="mr-2" />
                            Edit Workflow
                        </Button>
                        {editing && (
                            <Button
                                onClick={() => {
                                    setEditing(false);
                                    setPaused(false);
                                }}
                                className="bg-green-600 hover:bg-green-500"
                            >
                                <SkipForward size={24} className="mr-2" />
                                Save and Resume
                            </Button>
                        )}
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-blue-300">Thinking Log:</h3>
                    <ScrollArea className="h-48 bg-gray-800 p-4 rounded-lg border border-blue-500">
                        {thinkingLog.map((log, index) => (
                            <div key={index} className="text-green-300 mb-1">{log}</div>
                        ))}
                    </ScrollArea>
                </div>

                {workflow.output && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-blue-300">Workflow Output:</h3>
                        <ScrollArea className="h-96 bg-gray-800 p-4 rounded-lg border border-blue-500">
                            <pre className="text-green-300 whitespace-pre-wrap">{workflow.output}</pre>
                        </ScrollArea>
                    </div>
                )}
            </div>
        </DndProvider>
    );
}