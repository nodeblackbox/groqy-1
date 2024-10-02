'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Triangle,
    Download,
    Upload,
    Settings2,
    Trash2,
    Sun,
    Moon,
    Send,
    Mic,
    Bot,
    CornerDownLeft,
    Paperclip,
    Plus,
    Loader2,
    ChevronRight,
    ChevronLeft,
    MessageSquare,
    Workflow,
    FileUp,
    Wrench,
    Code,
    HelpCircle,
    Eye,
    EyeOff,
    Star,
    Save,
    PenBox,
    Phone,
    Video,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from 'react-markdown';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { toast, Toaster } from 'react-hot-toast';

// Assume these components are implemented elsewhere
import ChatView from '@/components/ChatView';
import WorkflowBuilder from '@/components/WorkflowBuilder';
import FileUploader from '@/components/FileUploader';
import ToolingConfiguration from '@/components/ToolingConfiguration';
import Settings from '@/components/Settings';
import { chatApi } from '@/components/chatApi';

const taskTypes = [
    { value: "text", label: "Text Task", points: 5 },
    { value: "code", label: "Code Task", points: 10 },
    { value: "design", label: "Design Task", points: 15 },
    { value: "research", label: "Research Task", points: 8 },
    { value: "planning", label: "Planning Task", points: 12 }
];

const initialState = {
    chats: [],
    currentChatId: null,
    apiKey: '',
    settings: {
        api: 'ollama',
        model: 'deepseek-coder-v2',
        temperature: 0.7,
        maxTokens: 1024,
        topP: 1,
        topK: 0,
        stream: false,
        darkMode: false,
        useGroq: false,
    },
    systemPrompt: '',
    projectName: 'My Project',
    tasks: [],
    users: [],
    projectMethodology: 'agile',
    integrations: [],
};

const STORAGE_KEY = 'advancedChatAppState';

const loadState = () => {
    if (typeof window === 'undefined') return initialState;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
};

const saveState = (state) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const calculateWorkload = (tasks, userId) => {
    return tasks
        .filter(task => task.assignedTo === userId)
        .reduce((total, task) => total + task.estimatedEffort, 0);
};

const suggestAssignments = (tasks, users) => {
    return tasks.map(task => {
        const bestMatch = users.reduce((best, user) => {
            const skillMatch = task.requiredSkills.filter(skill => user.skills.includes(skill)).length;
            const workload = calculateWorkload(tasks, user.id);
            const score = skillMatch - (workload * 0.1);
            return score > best.score ? { userId: user.id, score } : best;
        }, { userId: null, score: -Infinity });
        return { ...task, suggestedAssignee: bestMatch.userId };
    });
};

const assessProjectRisks = (tasks, users) => {
    const risks = [];
    const skillGap = tasks.some(task =>
        task.requiredSkills.some(skill => !users.some(user => user.skills.includes(skill)))
    );
    if (skillGap)
    {
        risks.push({ type: 'Skill Gap', description: 'Some required skills are not present in the team.' });
    }

    const tightDeadlines = tasks.filter(task => {
        const daysUntilDue = (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24);
        return daysUntilDue < 7 && task.estimatedEffort > 20;
    });
    if (tightDeadlines.length > 0)
    {
        risks.push({ type: 'Tight Deadlines', description: `${tightDeadlines.length} tasks have tight deadlines.` });
    }

    return risks;
};

export default function AdvancedDashboard() {
    const [state, setState] = useState(loadState());
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentView, setCurrentView] = useState('chat');
    const [isChatCollapsed, setIsChatCollapsed] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [totalPoints, setTotalPoints] = useState(0);
    const [projectRisks, setProjectRisks] = useState([]);
    const [expandedTaskIndex, setExpandedTaskIndex] = useState(null);

    const [inputMode, setInputMode] = useState('text');
    const [textInput, setTextInput] = useState('');
    const [codeInput, setCodeInput] = useState('');
    const [gptPrompt, setGptPrompt] = useState('');

    const chatContainerRef = useRef(null);
    const speechSynthesisInstance = typeof window !== 'undefined' ? window.speechSynthesis : null;
    const SpeechRecognition =
        typeof window !== 'undefined'
            ? window.SpeechRecognition || window.webkitSpeechRecognition
            : null;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    const [availableModels, setAvailableModels] = useState({
        ollama: ['deepseek-coder-v2'],
        groq: [
            {
                label: 'llama-3.1-70b-versatile',
                value: 'llama-3.1-70b-versatile',
            },
        ],
    });

    useEffect(() => {
        fetchOllamaModels();
    }, []);

    useEffect(() => {
        saveState(state);
        if (state.settings.darkMode)
        {
            document.documentElement.classList.add('dark');
        } else
        {
            document.documentElement.classList.remove('dark');
        }
    }, [state]);

    useEffect(() => {
        if (chatContainerRef.current)
        {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [state.currentChatId, state.chats]);

    useEffect(() => {
        const points = Array.isArray(state.tasks)
            ? state.tasks.reduce((total, task) => total + (task.points || 0), 0)
            : 0;
        setTotalPoints(points);
        setProjectRisks(assessProjectRisks(state.tasks || [], state.users || []));
    }, [state.tasks, state.users]);

    const fetchOllamaModels = async () => {
        try
        {
            const response = await fetch('/api/ollama-models');
            const data = await response.json();
            if (!response.ok)
            {
                throw new Error(data.error || 'Failed to fetch models');
            }
            const formattedModels = data.models.map((model) => ({
                label: model,
                value: model,
            }));
            setAvailableModels((prev) => ({ ...prev, ollama: formattedModels }));
        } catch (error)
        {
            console.error('Error fetching Ollama models:', error);
            toast.error("Failed to fetch Ollama models");
        }
    };

    const currentChat = state.chats.find((chat) => chat.id === state.currentChatId) || null;

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey)
        {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const currentInput = inputMode === 'text' ? textInput : codeInput;
        if (!currentInput.trim() || !currentChat) return;

        const newMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: currentInput,
            timestamp: Date.now(),
        };
        const updatedMessages = [...currentChat.messages, newMessage];

        setState((prev) => ({
            ...prev,
            chats: prev.chats.map((chat) =>
                chat.id === currentChat.id
                    ? { ...chat, messages: updatedMessages, updatedAt: Date.now() }
                    : chat
            ),
        }));

        if (inputMode === 'text')
        {
            setTextInput('');
        } else
        {
            setCodeInput('');
        }
        setIsLoading(true);

        try
        {
            let response;
            if (state.settings.api === 'groq')
            {
                if (!state.apiKey)
                {
                    throw new Error('GROQ API key is not set');
                }
                response = await fetch('/api/chat-groq', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${state.apiKey}`,
                    },
                    body: JSON.stringify({
                        messages: updatedMessages,
                        model: state.settings.model,
                        temperature: state.settings.temperature,
                        max_tokens: state.settings.maxTokens,
                        top_p: state.settings.topP,
                        stream: state.settings.stream,
                    }),
                });

                if (!response.ok)
                {
                    const errorData = await response.json();
                    console.error('Error from GROQ API:', errorData);
                    throw new Error(`GROQ API error: ${errorData.error || 'Unknown error'}`);
                }
            } else if (state.settings.api === 'ollama')
            {
                response = await fetch('/api/chat-ollama', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        messages: updatedMessages,
                        model: state.settings.model,
                        system_prompt: state.systemPrompt,
                        temperature: state.settings.temperature,
                        max_tokens: state.settings.maxTokens,
                        top_p: state.settings.topP,
                        top_k: state.settings.topK,
                        stream: state.settings.stream
                    })
                });
            } else
            {
                throw new Error('Invalid API selected');
            }

            if (!response.ok)
            {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            if (state.settings.stream)
            {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let botMessage = '';

                while (true)
                {
                    const { done, value } = await reader.read();
                    if (done) break;
                    botMessage += decoder.decode(value, { stream: true });
                    setState((prev) => ({
                        ...prev,
                        chats: prev.chats.map((chat) =>
                            chat.id === currentChat.id
                                ? {
                                    ...chat,
                                    messages: [
                                        ...updatedMessages,
                                        {
                                            id: 'assistant-' + Date.now().toString(),
                                            role: 'assistant',
                                            content: botMessage,
                                            timestamp: Date.now(),
                                        },
                                    ],
                                    updatedAt: Date.now(),
                                }
                                : chat
                        ),
                    }));
                }
            } else
            {
                const data = await response.json();
                const assistantMessage = state.settings.api === 'groq' ? data.choices[0].message.content : data.message.content;
                setState((prev) => ({
                    ...prev,
                    chats: prev.chats.map((chat) =>
                        chat.id === currentChat.id
                            ? {
                                ...chat,
                                messages: [
                                    ...updatedMessages,
                                    {
                                        id: 'assistant-' + Date.now().toString(),
                                        role: 'assistant',
                                        content: assistantMessage,
                                        timestamp: Date.now(),
                                    },
                                ],
                                updatedAt: Date.now(),
                            }
                            : chat
                    ),
                }));
            }
        } catch (error)
        {
            console.error('Error calling API:', error);
            toast.error(`Error communicating with the chatbot: ${error.message}`);
        } finally
        {
            setIsLoading(false);
        }
    }, [inputMode, textInput, codeInput, currentChat, state.settings, state.apiKey, state.systemPrompt]);

    const createNewChat = async () => {
        try
        {
            const newChat = await chatApi.createNewChat(`New Chat ${state.chats.length + 1}`);
            setState((prev) => ({
                ...prev,
                chats: [...prev.chats, newChat],
                currentChatId: newChat.id,
            }));
            toast.success(`New chat "${newChat.name}" created!`);
        } catch (error)
        {
            console.error('Error creating new chat:', error);
            toast.error("Failed to create a new chat.");
        }
    };

    const loadSelectedChat = (chatId) => {
        setState((prev) => ({
            ...prev,
            currentChatId: chatId,
        }));
    };

    const deleteChat = async (chatId) => {
        try
        {
            const result = await chatApi.deleteChat(chatId);
            if (result.success)
            {
                setState((prev) => ({
                    ...prev,
                    chats: prev.chats.filter((chat) => chat.id !== chatId),
                    currentChatId: prev.currentChatId === chatId ? null : prev.currentChatId,
                }));
                toast.success(result.message);
            } else
            {
                throw new Error(result.message);
            }
        } catch (error)
        {
            console.error('Error deleting chat:', error);
            toast.error("Failed to delete chat.");
        }
    };

    const clearChat = async () => {
        if (currentChat)
        {
            try
            {
                const result = await chatApi.clearChat(currentChat.id);
                if (result.success)
                {
                    setState((prev) => ({
                        ...prev,
                        chats: prev.chats.map((chat) =>
                            chat.id === currentChat.id ? { ...chat, messages: [], updatedAt: Date.now() } : chat
                        ),
                    }));
                    toast.success(result.message);
                } else
                {
                    throw new Error(result.message);
                }
            } catch (error)
            {
                console.error('Error clearing chat:', error);
                toast.error("Failed to clear chat.");
            }
        }
    };

    const exportChats = async () => {
        try
        {
            const dataUri = await chatApi.exportChats(state.chats);
            const exportFileDefaultName = 'quantum_nexus_chats.json';
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            document.body.appendChild(linkElement);
            linkElement.click();
            document.body.removeChild(linkElement);
            URL.revokeObjectURL(dataUri);
            toast.success('Chats exported successfully!');
        } catch (error)
        {
            console.error('Error exporting chats:', error);
            toast.error("Failed to export chats.");
        }
    };

    const importChats = async (event) => {
        const file = event.target.files && event.target.files[0];
        if (file)
        {
            try
            {
                const importedChats = await chatApi.importChats(file);
                setState((prev) => ({
                    ...prev,
                    chats: [...prev.chats, ...importedChats],
                }));
                toast.success('Chats imported successfully!');
            } catch (error)
            {
                console.error('Error importing chats:', error);
                toast.error("Failed to import chats. Please check the file format.");
            }
        }
    };

    const saveApiKey = (key) => {
        setState((prev) => ({ ...prev, apiKey: key }));
        toast.success('API Key saved successfully!');
    };

    const setSystemPrompt = (prompt) => {
        setState((prev) => ({ ...prev, systemPrompt: prompt }));
        toast.success('System prompt set successfully!');
    };

    const resetSettings = () => {
        setState((prev) => ({
            ...prev,
            settings: initialState.settings,
        }));
        toast.success('Settings reset to default values!');
    };

    const downloadChatTranscript = () => {
        if (!currentChat) return;
        try
        {
            const transcript = currentChat.messages.map((m) => `${m.role}: ${m.content}`).join('\n\n');
            const blob = new Blob([transcript], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${currentChat.name}_transcript.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success('Chat transcript downloaded successfully!');
        } catch (error)
        {
            console.error('Error downloading transcript:', error);
            toast.error("Failed to download transcript.");
        }
    };

    const toggleDarkMode = () => {
        setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, darkMode: !prev.settings.darkMode },
        }));
    };

    const startVoiceInput = () => {
        if (recognition)
        {
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setTextInput(transcript);
            };
            recognition.start();
            toast.info('Listening...');
        } else
        {
            toast.error("Speech recognition not supported in this browser.");
        }
    };

    const speakMessage = (message) => {
        if (speechSynthesisInstance)
        {
            if (isSpeaking)
            {
                speechSynthesisInstance.cancel();
                setIsSpeaking(false);
            } else
            {
                const utterance = new SpeechSynthesisUtterance(message);
                utterance.onend = () => setIsSpeaking(false);
                speechSynthesisInstance.speak(utterance);
                setIsSpeaking(true);
            }
        } else
        {
            toast.error("Text-to-speech not supported in this browser.");
        }
    };

    const toggleChatCollapse = () => {
        setIsChatCollapsed(!isChatCollapsed);
    };

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    const appendContentType = (type) => {
        const prefix = type === 'code' ? '\n```\n' : '\n';
        const suffix = type === 'code' ? '\n```\n' : '\n';

        if (inputMode === 'text')
        {
            setTextInput((prev) => prev + prefix + suffix);
        } else
        {
            setCodeInput((prev) => prev + prefix + suffix);
        }
    };

    const addTask = () => {
        const newTask = {
            id: Date.now().toString(),
            title: "",
            description: "",
            type: "text",
            points: 5,
            dueDate: "",
            requiredSkills: [],
            fileUploadRequired: false,
            assignedTo: "",
            dependencies: [],
            estimatedEffort: 0,
            subTasks: []
        };
        setState((prev) => ({
            ...prev,
            tasks: [...prev.tasks, newTask],
        }));
        setExpandedTaskIndex(state.tasks.length);
    };

    const updateTask = (index, updatedTask) => {
        setState((prev) => {
            const updatedTasks = [...prev.tasks];
            updatedTasks[index] = updatedTask;
            return { ...prev, tasks: updatedTasks };
        });
    };

    const removeTask = (index) => {
        setState((prev) => ({
            ...prev,
            tasks: prev.tasks.filter((_, i) => i !== index),
        }));
        setExpandedTaskIndex(null);
    };

    const moveTask = (fromIndex, toIndex) => {
        setState((prev) => {
            const updatedTasks = [...prev.tasks];
            const [movedTask] = updatedTasks.splice(fromIndex, 1);
            updatedTasks.splice(toIndex, 0, movedTask);
            return { ...prev, tasks: updatedTasks };
        });
    };

    const toggleTaskExpand = (index) => {
        setExpandedTaskIndex(expandedTaskIndex === index ? null : index);
    };

    const saveProject = () => {
        const projectData = {
            name: state.projectName,
            tasks: state.tasks,
            users: state.users
        };
        const projectJson = JSON.stringify(projectData, null, 2);
        const blob = new Blob([projectJson], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${state.projectName}.json`;
        link.href = url;
        link.click();
        toast.success('Project saved successfully!');
    };

    const loadProject = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            try
            {
                const projectData = JSON.parse(e.target.result);
                setState((prev) => ({
                    ...prev,
                    projectName: projectData.name,
                    tasks: projectData.tasks,
                    users: projectData.users,
                }));
                toast.success('Project loaded successfully!');
            } catch (error)
            {
                console.error('Error parsing project file:', error);
                toast.error("Failed to load project. Invalid file format.");
            }
        };
        reader.readAsText(file);
    };

    const handleMethodologyChange = (methodology) => {
        setState((prev) => ({
            ...prev,
            projectMethodology: methodology,
        }));
        // Adjust UI and task structure based on the selected methodology
        toast.info(`Project methodology changed to ${methodology}.`);
    };

    const addIntegration = (integration) => {
        setState((prev) => ({
            ...prev,
            integrations: [...prev.integrations, integration],
        }));
        // Set up webhook or API connection for the new integration
        toast.success(`${integration} integration added successfully!`);
    };

    const generateTasks = async () => {
        if (!state.apiKey)
        {
            toast.error("Please enter your API key.");
            return;
        }
        setIsLoading(true);
        try
        {
            const response = await fetch(
                "https://api.groq.com/openai/v1/chat/completions",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${state.apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        messages: [{ role: "user", content: gptPrompt }],
                        model: "llama-3.1-70b-versatile",
                    }),
                }
            );
            if (!response.ok)
            {
                throw new Error(`API request failed with status ${response.status}`);
            }
            const data = await response.json();
            const generatedTasks = data.choices[0].message.content;
            setState((prev) => ({
                ...prev,
                tasks: [...prev.tasks, ...JSON.parse(generatedTasks)],
            }));
            toast.success('Tasks generated successfully!');
        } catch (error)
        {
            console.error("Error generating tasks:", error);
            toast.error("An error occurred while generating tasks.");
        }
        setIsLoading(false);
    };

    const renderCurrentView = () => {
        switch (currentView)
        {
            case 'chat':
                return (
                    <div className={`transition-all duration-300 ${isChatCollapsed ? 'h-16' : 'h-full'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-primary">Chat</h2>
                            <Button onClick={toggleChatCollapse} variant="ghost" size="sm">
                                {isChatCollapsed ? <ChevronRight /> : <ChevronLeft />}
                            </Button>
                        </div>
                        {!isChatCollapsed && (
                            <div className="space-y-4">
                                {currentChat?.messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                            }`}
                                    >
                                        <div
                                            className={`max-w-3/4 p-4 rounded-lg ${message.role === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted'
                                                }`}
                                        >
                                            <ReactMarkdown>{message.content}</ReactMarkdown>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'workflow':
                return <WorkflowBuilder />;
            case 'fileUpload':
                return <FileUploader />;
            case 'tooling':
                return <ToolingConfiguration
                    state={state}
                    setState={setState}
                    saveApiKey={saveApiKey}
                    setSystemPrompt={setSystemPrompt}
                    resetSettings={resetSettings}
                />;
            case 'tasks':
                return (
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-blue-400">Tasks</h2>
                        {state.tasks.map((task, index) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                index={index}
                                updateTask={updateTask}
                                removeTask={removeTask}
                                isExpanded={expandedTaskIndex === index}
                                toggleExpand={toggleTaskExpand}
                                moveTask={moveTask}
                                users={state.users}
                                allTasks={state.tasks}
                            />
                        ))}
                        <Button
                            onClick={addTask}
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all duration-300 shadow-lg"
                        >
                            <Plus size={24} className="mr-2" />
                            Add New Task
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`flex h-screen w-full bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-900 dark:to-indigo-950 transition-colors duration-300 ${state.settings.darkMode ? 'dark' : ''}`}>
            {/* Sidebar */}
            <aside className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64'
                : 'w-16'}`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    {isSidebarExpanded ? (
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Quantum Nexus</h1>
                    ) : (
                        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    )}
                </div>
                <ScrollArea className="flex-1 p-4">
                    <nav className="space-y-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={createNewChat}
                            className="w-full mb-2 bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/80 hover:to-secondary/80 transition-all duration-200"
                        >
                            <Plus className="mr-2 h-4 w-4" /> {isSidebarExpanded ? 'New Chat' : ''}
                        </Button>
                        {isSidebarExpanded && (
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={exportChats}
                                    className="flex-1 text-sm"
                                >
                                    <Download className="size-3.5 mr-1" />
                                    Export
                                </Button>
                                <label htmlFor="import-chats-sidebar" className="flex-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-sm"
                                        as="span"
                                    >
                                        <Upload className="size-3.5 mr-1" />
                                        Import
                                    </Button>
                                </label>
                                <input
                                    id="import-chats-sidebar"
                                    type="file"
                                    accept=".json"
                                    onChange={importChats}
                                    className="hidden"
                                />
                            </div>
                        )}
                        {state.chats.map((chat) => (
                            <Button
                                key={chat.id}
                                variant={chat.id === state.currentChatId ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => loadSelectedChat(chat.id)}
                                className="w-full justify-start"
                            >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                {isSidebarExpanded ? chat.name : ''}
                            </Button>
                        ))}
                    </nav>
                </ScrollArea>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentView('chat')}
                        className={`w-full justify-start mb-2 ${currentView === 'chat' ? 'bg-primary/10' : ''}`}
                    >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {isSidebarExpanded ? 'Chat' : ''}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentView('workflow')}
                        className={`w-full justify-start mb-2 ${currentView === 'workflow' ? 'bg-primary/10' : ''}`}
                    >
                        <Workflow className="mr-2 h-4 w-4" />
                        {isSidebarExpanded ? 'Workflow' : ''}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentView('fileUpload')}
                        className={`w-full justify-start mb-2 ${currentView === 'fileUpload' ? 'bg-primary/10' : ''}`}
                    >
                        <FileUp className="mr-2 h-4 w-4" />
                        {isSidebarExpanded ? 'File Upload' : ''}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentView('tooling')}
                        className={`w-full justify-start mb-2 ${currentView === 'tooling' ? 'bg-primary/10' : ''}`}
                    >
                        <Wrench className="mr-2 h-4 w-4" />
                        {isSidebarExpanded ? 'Tooling' : ''}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentView('tasks')}
                        className={`w-full justify-start mb-2 ${currentView === 'tasks' ? 'bg-primary/10' : ''}`}
                    >
                        <Code className="mr-2 h-4 w-4" />
                        {isSidebarExpanded ? 'Tasks' : ''}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleDarkMode}
                        className="w-full justify-start"
                    >
                        {state.settings.darkMode ? (
                            <Sun className="mr-2 h-4 w-4" />
                        ) : (
                            <Moon className="mr-2 h-4 w-4" />
                        )}
                        {isSidebarExpanded ? (state.settings.darkMode ? 'Light Mode' : 'Dark Mode') : ''}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {currentChat ? currentChat.name : 'Quantum Nexus'}
                    </h1>
                    <div className="flex items-center space-x-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" onClick={clearChat}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Clear Chat</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" onClick={downloadChatTranscript}>
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Download Transcript</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" onClick={() => setShowAdvanced(!showAdvanced)}>
                                        <Settings2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Advanced Settings</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </header>

                {/* Chat Container */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Main Chat Area */}
                    <div className="flex-1 flex flex-col">
                        <ScrollArea className="flex-1 p-4" ref={chatContainerRef}>
                            {renderCurrentView()}
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="flex space-x-2">
                                    <Button
                                        type="button"
                                        variant={inputMode === 'text' ? 'secondary' : 'outline'}
                                        onClick={() => setInputMode('text')}
                                    >
                                        Text
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={inputMode === 'code' ? 'secondary' : 'outline'}
                                        onClick={() => setInputMode('code')}
                                    >
                                        Code
                                    </Button>
                                </div>
                                {inputMode === 'text' ? (
                                    <Textarea
                                        value={textInput}
                                        onChange={(e) => setTextInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type your message..."
                                        rows={3}
                                        className="w-full p-2 border rounded"
                                    />
                                ) : (
                                    <Textarea
                                        value={codeInput}
                                        onChange={(e) => setCodeInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Enter your code..."
                                        rows={5}
                                        className="w-full p-2 border rounded font-mono"
                                    />
                                )}
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-2">
                                        <Button type="button" variant="outline" onClick={() => appendContentType('code')}>
                                            <Code className="h-4 w-4 mr-2" />
                                            Code Block
                                        </Button>
                                        <Button type="button" variant="outline" onClick={startVoiceInput}>
                                            <Mic className="h-4 w-4 mr-2" />
                                            Voice Input
                                        </Button>
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            onChange={(e) => {
                                                // Handle file upload logic here
                                                console.log(e.target.files);
                                            }}
                                        />
                                        <label htmlFor="file-upload">
                                            <Button as="span" variant="outline">
                                                <Paperclip className="h-4 w-4 mr-2" />
                                                Attach
                                            </Button>
                                        </label>
                                    </div>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4 mr-2" />
                                        )}
                                        Send
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Advanced Settings Drawer */}
                    <Drawer open={showAdvanced} onOpenChange={setShowAdvanced}>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Advanced Settings</DrawerTitle>
                                <DrawerDescription>Configure your chat experience</DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="api-select">API</Label>
                                    <Select
                                        value={state.settings.api}
                                        onValueChange={(value) =>
                                            setState((prev) => ({
                                                ...prev,
                                                settings: { ...prev.settings, api: value },
                                            }))
                                        }
                                    >
                                        <SelectTrigger id="api-select">
                                            <SelectValue placeholder="Select API" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ollama">Ollama</SelectItem>
                                            <SelectItem value="groq">GROQ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="model-select">Model</Label>
                                    <Select
                                        value={state.settings.model}
                                        onValueChange={(value) =>
                                            setState((prev) => ({
                                                ...prev,
                                                settings: { ...prev.settings, model: value },
                                            }))
                                        }
                                    >
                                        <SelectTrigger id="model-select">
                                            <SelectValue placeholder="Select Model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableModels[state.settings.api].map((model) => (
                                                <SelectItem key={model.value} value={model.value}>
                                                    {model.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="temperature">Temperature: {state.settings.temperature}</Label>
                                    <Slider
                                        id="temperature"
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        value={[state.settings.temperature]}
                                        onValueChange={(value) =>
                                            setState((prev) => ({
                                                ...prev,
                                                settings: { ...prev.settings, temperature: value[0] },
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="max-tokens">Max Tokens: {state.settings.maxTokens}</Label>
                                    <Slider
                                        id="max-tokens"
                                        min={1}
                                        max={4096}
                                        step={1}
                                        value={[state.settings.maxTokens]}
                                        onValueChange={(value) =>
                                            setState((prev) => ({
                                                ...prev,
                                                settings: { ...prev.settings, maxTokens: value[0] },
                                            }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="stream"
                                        checked={state.settings.stream}
                                        onCheckedChange={(checked) =>
                                            setState((prev) => ({
                                                ...prev,
                                                settings: { ...prev.settings, stream: checked },
                                            }))
                                        }
                                    />
                                    <Label htmlFor="stream">Stream Responses</Label>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="system-prompt">System Prompt</Label>
                                    <Textarea
                                        id="system-prompt"
                                        value={state.systemPrompt}
                                        onChange={(e) => setSystemPrompt(e.target.value)}
                                        placeholder="Enter system prompt..."
                                        rows={3}
                                    />
                                </div>
                                {state.settings.api === 'groq' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="api-key">GROQ API Key</Label>
                                        <Input
                                            id="api-key"
                                            type="password"
                                            value={state.apiKey}
                                            onChange={(e) => saveApiKey(e.target.value)}
                                            placeholder="Enter your GROQ API key"
                                        />
                                    </div>
                                )}
                                <Button onClick={resetSettings} variant="outline">
                                    Reset to Defaults
                                </Button>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            </main>

            {/* Project Management Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4 text-primary">Project Management</h2>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="project-name">Project Name</Label>
                        <Input
                            id="project-name"
                            value={state.projectName}
                            onChange={(e) => setState(prev => ({ ...prev, projectName: e.target.value }))}
                            placeholder="Enter project name"
                        />
                    </div>
                    <div>
                        <Label>Methodology</Label>
                        <Select
                            value={state.projectMethodology}
                            onValueChange={handleMethodologyChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select methodology" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="agile">Agile</SelectItem>
                                <SelectItem value="waterfall">Waterfall</SelectItem>
                                <SelectItem value="kanban">Kanban</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Integrations</Label>
                        <Select onValueChange={addIntegration}>
                            <SelectTrigger>
                                <SelectValue placeholder="Add integration" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="github">GitHub</SelectItem>
                                <SelectItem value="jira">Jira</SelectItem>
                                <SelectItem value="slack">Slack</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="gpt-prompt">GPT Prompt for Task Generation</Label>
                        <Textarea
                            id="gpt-prompt"
                            value={gptPrompt}
                            onChange={(e) => setGptPrompt(e.target.value)}
                            placeholder="Describe your project to generate tasks..."
                            rows={3}
                        />
                        <Button onClick={generateTasks} className="mt-2" disabled={isLoading}>
                            {isLoading ? 'Generating...' : 'Generate Tasks'}
                        </Button>
                    </div>
                    <div className="flex space-x-2">
                        <Button onClick={saveProject} variant="outline">Save Project</Button>
                        <label htmlFor="load-project">
                            <Button as="span" variant="outline">Load Project</Button>
                        </label>
                        <input
                            id="load-project"
                            type="file"
                            accept=".json"
                            onChange={loadProject}
                            className="hidden"
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Project Stats</h3>
                        <p>Total Tasks: {state.tasks.length}</p>
                        <p>Total Points: {totalPoints}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Project Risks</h3>
                        {projectRisks.map((risk, index) => (
                            <Badge key={index} variant="destructive" className="mr-2 mb-2">
                                {risk.type}
                            </Badge>
                        ))}
                    </div>
                </div>
            </aside>

            <Toaster />
        </div>
    );
}

function TaskCard({ task, index, updateTask, removeTask, isExpanded, toggleExpand, moveTask, users, allTasks }) {
    const [localTask, setLocalTask] = useState(task);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalTask(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        updateTask(index, localTask);
        toggleExpand(index);
    };

    const handleMoveUp = () => {
        if (index > 0) moveTask(index, index - 1);
    };

    const handleMoveDown = () => {
        if (index < allTasks.length - 1) moveTask(index, index + 1);
    };

    return (
        <Card className="mb-4 overflow-hidden">
            <CardContent className="p-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{task.title || 'New Task'}</h3>
                    <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => toggleExpand(index)}>
                            {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleMoveUp}>
                            <ChevronLeft size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleMoveDown}>
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
                {isExpanded && (
                    <div className="mt-4 space-y-4">
                        <div>
                            <Label htmlFor={`title-${task.id}`}>Title</Label>
                            <Input
                                id={`title-${task.id}`}
                                name="title"
                                value={localTask.title}
                                onChange={handleChange}
                                placeholder="Task title"
                            />
                        </div>
                        <div>
                            <Label htmlFor={`description-${task.id}`}>Description</Label>
                            <Textarea
                                id={`description-${task.id}`}
                                name="description"
                                value={localTask.description}
                                onChange={handleChange}
                                placeholder="Task description"
                                rows={3}
                            />
                        </div>
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <Label htmlFor={`type-${task.id}`}>Type</Label>
                                <Select
                                    value={localTask.type}
                                    onValueChange={(value) => setLocalTask(prev => ({ ...prev, type: value }))}
                                >
                                    <SelectTrigger id={`type-${task.id}`}>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {taskTypes.map(type => (
                                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1">
                                <Label htmlFor={`points-${task.id}`}>Points</Label>
                                <Input
                                    id={`points-${task.id}`}
                                    name="points"
                                    type="number"
                                    value={localTask.points}
                                    onChange={handleChange}
                                    min={0}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor={`dueDate-${task.id}`}>Due Date</Label>
                            <Input
                                id={`dueDate-${task.id}`}
                                name="dueDate"
                                type="date"
                                value={localTask.dueDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor={`assignedTo-${task.id}`}>Assigned To</Label>
                            <Select
                                value={localTask.assignedTo}
                                onValueChange={(value) => setLocalTask(prev => ({ ...prev, assignedTo: value }))}
                            >
                                <SelectTrigger id={`assignedTo-${task.id}`}>
                                    <SelectValue placeholder="Assign to..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map(user => (
                                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => removeTask(index)}>Delete</Button>
                            <Button onClick={handleSave}>Save</Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}