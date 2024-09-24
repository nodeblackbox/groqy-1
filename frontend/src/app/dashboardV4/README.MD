Certainly! Let's create a comprehensive implementation that integrates all the functionalities you've described into your existing Chatbot UI. We'll ensure that the UI remains modular, maintains a consistent theme, and interacts intelligently with multiple APIs. Here's a step-by-step guide to achieve this:

1. **Refactor the Dashboard Component for Enhanced Navigation**
2. **Integrate AdvancedProjectAnalyzer and NexusFileAnalyzer Components**
3. **Enhance ChatView to Support File Selection and Prompt Generation**
4. **Implement a Prompt Helper**
5. **Ensure Consistent Theming and API Integration**
6. **Update API Routes as Needed**

---

## 1. Refactor the Dashboard Component for Enhanced Navigation

We'll enhance your `Dashboard` component to include additional navigation options for the new functionalities. We'll utilize React's state management to switch between different views seamlessly.

### **`Dashboard.jsx`**

```jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
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
    Settings,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { cn } from "@/lib/utils";
import { chatApi } from '@/components/ui/llamaapi/chatApi';

// Import new components
import ChatView from '@/components/ChatView';
import WorkflowBuilder from '@/components/WorkflowBuilder';
import FileUploader from '@/components/FileUploader';
import ToolingConfiguration from '@/components/ToolingConfiguration';
import AdvancedProjectAnalyzer from '@/components/AdvancedProjectAnalyzer';
import NexusFileAnalyzer from '@/components/NexusFileAnalyzer';

// Optional: Integrate React Toastify for notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Initial state
const initialState = {
    chats: [],
    currentChatId: null,
    apiKey: '',
    settings: {
        api: 'ollama',
        model: 'llama3-groq-70b-8192-tool-use-preview',
        temperature: 0.7,
        maxTokens: 1024,
        topP: 1,
        topK: 0,
        stream: false,
        darkMode: false,
        useGroq: false,
    },
    systemPrompt: '',
};

// Storage key for localStorage
const STORAGE_KEY = 'quantumNexusState';

// Load state from localStorage
const loadState = () => {
    if (typeof window === 'undefined') return initialState;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
};

// Save state to localStorage
const saveState = (state) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const AVAILABLE_MODELS = {
    ollama: [
        { label: 'llama3.1:latest', value: 'llama3.1:latest' },
        { label: 'llama3.1', value: 'llama3.1' },
        { label: 'LLaMA2 30B', value: 'llama2-30b' },
    ],
    groq: [
        { label: 'llama3-groq-70b-8192-tool-use-preview', value: 'llama3-groq-70b-8192-tool-use-preview' },
    ],
};

export default function Dashboard() {
    const [state, setState] = useState(loadState);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [newChatName, setNewChatName] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentView, setCurrentView] = useState('chat'); // New state for view switching

    const chatContainerRef = useRef(null);
    const speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
    const SpeechRecognition =
        typeof window !== 'undefined'
            ? window.SpeechRecognition || window.webkitSpeechRecognition
            : null;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    // Save state and handle dark mode
    useEffect(() => {
        saveState(state);
        if (state.settings.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [state]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [state.currentChatId, state.chats]);

    const currentChat = state.chats.find((chat) => chat.id === state.currentChatId) || null;

    // Handle form submission for sending messages
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || !currentChat || (state.settings.useGroq && !state.apiKey)) return;

        const newMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
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
        setInput('');
        setIsLoading(true);

        try {
            chatApi.setUseGroq(state.settings.useGroq);
            if (state.settings.useGroq) {
                chatApi.setApiKey(state.apiKey);
            }
            chatApi.setModel(state.settings.model);
            chatApi.setSystemPrompt(state.systemPrompt);
            chatApi.setTemperature(state.settings.temperature);
            chatApi.setMaxTokens(state.settings.maxTokens);
            chatApi.setTopP(state.settings.topP);
            chatApi.setTopK(state.settings.topK);
            chatApi.setStream(state.settings.stream);

            const response = await chatApi.sendMessage(updatedMessages);

            if (state.settings.stream) {
                const reader = response.getReader();
                const decoder = new TextDecoder();
                let botMessage = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    botMessage += decoder.decode(value);
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
            } else {
                const botMessage = response.content;
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

            toast.success('Message sent successfully!');
        } catch (error) {
            console.error('Error calling API:', error);
            toast.error('Error communicating with the chatbot. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Create a new chat
    const createNewChat = async () => {
        if (!newChatName.trim()) {
            toast.error('Chat name cannot be empty.');
            return;
        }

        try {
            const newChat = await chatApi.createNewChat(newChatName);
            setState((prev) => ({
                ...prev,
                chats: [...prev.chats, newChat],
                currentChatId: newChat.id,
            }));
            setNewChatName('');
            toast.success(`New chat "${newChat.name}" created!`);
        } catch (error) {
            console.error('Error creating chat:', error);
            toast.error('Failed to create a new chat.');
        }
    };

    // Load selected chat
    const loadSelectedChat = (chatId) => {
        setState((prev) => ({
            ...prev,
            currentChatId: chatId,
        }));
    };

    // Delete a chat
    const deleteChat = async (chatId) => {
        try {
            const result = await chatApi.deleteChat(chatId);
            if (result.success) {
                setState((prev) => ({
                    ...prev,
                    chats: prev.chats.filter((chat) => chat.id !== chatId),
                    currentChatId: prev.currentChatId === chatId ? null : prev.currentChatId,
                }));
                toast.success(result.message);
            } else {
                toast.error('Failed to delete the chat.');
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
            toast.error('Error deleting the chat.');
        }
    };

    // Clear current chat
    const clearChat = async () => {
        if (currentChat) {
            try {
                const result = await chatApi.clearChat(currentChat.id);
                if (result.success) {
                    setState((prev) => ({
                        ...prev,
                        chats: prev.chats.map((chat) =>
                            chat.id === currentChat.id ? { ...chat, messages: [], updatedAt: Date.now() } : chat
                        ),
                    }));
                    toast.success(result.message);
                } else {
                    toast.error('Failed to clear the chat.');
                }
            } catch (error) {
                console.error('Error clearing chat:', error);
                toast.error('Error clearing the chat.');
            }
        }
    };

    // Export chats
    const exportChats = async () => {
        try {
            const dataUri = await chatApi.exportChats(state.chats);
            const exportFileDefaultName = 'quantum_nexus_chats.json';
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            toast.success('Chats exported successfully!');
        } catch (error) {
            console.error('Error exporting chats:', error);
            toast.error('Failed to export chats.');
        }
    };

    // Import chats
    const importChats = async (event) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const content = e.target && e.target.result;
                if (typeof content === 'string') {
                    try {
                        const importedChats = await chatApi.importChats(content);
                        setState((prev) => ({
                            ...prev,
                            chats: [...prev.chats, ...importedChats]
                        }));
                        toast.success('Chats imported successfully!');
                    } catch (error) {
                        console.error('Error importing chats:', error);
                        toast.error('Failed to import chats. Please check the file format.');
                    }
                }
            };
            reader.readAsText(file);
        }
    };

    // Save API key
    const saveApiKey = (key) => {
        setState((prev) => ({ ...prev, apiKey: key }));
        toast.success('API Key saved successfully!');
    };

    // Set system prompt
    const setSystemPrompt = (prompt) => {
        setState((prev) => ({ ...prev, systemPrompt: prompt }));
        toast.success('System prompt set successfully!');
    };

    // Reset settings to default
    const resetSettings = () => {
        setState((prev) => ({
            ...prev,
            settings: initialState.settings,
        }));
        toast.success('Settings reset to default values!');
    };

    // Download chat transcript
    const downloadChatTranscript = () => {
        if (!currentChat) return;
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
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, darkMode: !prev.settings.darkMode },
        }));
    };

    // Start voice input
    const startVoiceInput = () => {
        if (recognition) {
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
            };
            recognition.start();
            toast.info('Listening...');
        } else {
            toast.error('Speech recognition not supported in this browser.');
        }
    };

    // Speak message using Text-to-Speech
    const speakMessage = (message) => {
        if (speechSynthesis) {
            if (isSpeaking) {
                speechSynthesis.cancel();
                setIsSpeaking(false);
            } else {
                const utterance = new SpeechSynthesisUtterance(message);
                utterance.onend = () => setIsSpeaking(false);
                speechSynthesis.speak(utterance);
                setIsSpeaking(true);
            }
        } else {
            toast.error('Text-to-speech not supported in this browser.');
        }
    };

    // Show notifications using React Toastify
    const showNotification = (message, type = 'info') => {
        switch (type) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
                toast.error(message);
                break;
            case 'info':
            default:
                toast.info(message);
                break;
        }
    };

    // Render the current view based on `currentView` state
    const renderCurrentView = () => {
        switch (currentView) {
            case 'chat':
                return (
                    <ChatView
                        state={state}
                        setState={setState}
                        input={input}
                        setInput={setInput}
                        isLoading={isLoading}
                        handleSubmit={handleSubmit}
                        startVoiceInput={startVoiceInput}
                        speakMessage={speakMessage}
                        downloadChatTranscript={downloadChatTranscript}
                        clearChat={clearChat}
                    />
                );
            case 'workflow':
                return <WorkflowBuilder />;
            case 'fileUpload':
                return <FileUploader />;
            case 'tooling':
                return (
                    <ToolingConfiguration
                        state={state}
                        setState={setState}
                        saveApiKey={saveApiKey}
                        setSystemPrompt={setSystemPrompt}
                        resetSettings={resetSettings}
                    />
                );
            case 'projectAnalyzer':
                return <AdvancedProjectAnalyzer />;
            case 'fileAnalyzer':
                return <NexusFileAnalyzer />;
            default:
                return <ChatView
                    state={state}
                    setState={setState}
                    input={input}
                    setInput={setInput}
                    isLoading={isLoading}
                    handleSubmit={handleSubmit}
                    startVoiceInput={startVoiceInput}
                    speakMessage={speakMessage}
                    downloadChatTranscript={downloadChatTranscript}
                    clearChat={clearChat}
                />;
        }
    };

    // Helper function to get header title based on view
    function getHeaderTitle(view) {
        switch (view) {
            case 'chat':
                return currentChat?.name || 'Select a chat';
            case 'workflow':
                return 'Agent Workflow Builder';
            case 'fileUpload':
                return 'File Uploader';
            case 'tooling':
                return 'Tooling & Configuration';
            case 'projectAnalyzer':
                return 'Advanced Project Analyzer';
            case 'fileAnalyzer':
                return 'Nexus File Analyzer';
            default:
                return 'Quantum Nexus';
        }
    }

    return (
        <div className={`flex h-screen w-full ${state.settings.darkMode ? 'dark' : ''}`}>
            {/* Triangle Navigation */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
                <Button variant="outline" size="icon" aria-label="Chat" onClick={() => setCurrentView('chat')}>
                    <Bot className="size-5 fill-foreground" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Workflow" onClick={() => setCurrentView('workflow')}>
                    <CornerDownLeft className="size-5 fill-foreground" />
                </Button>
                <Button variant="outline" size="icon" aria-label="File Upload" onClick={() => setCurrentView('fileUpload')}>
                    <Paperclip className="size-5 fill-foreground" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Tooling" onClick={() => setCurrentView('tooling')}>
                    <Settings2 className="size-5 fill-foreground" />
                </Button>
                <Button variant="outline" size="icon" aria-label="Project Analyzer" onClick={() => setCurrentView('projectAnalyzer')}>
                    <Settings className="size-5 fill-foreground" />
                </Button>
                <Button variant="outline" size="icon" aria-label="File Analyzer" onClick={() => setCurrentView('fileAnalyzer')}>
                    <File className="size-5 fill-foreground" />
                </Button>
            </div>

            {/* Sidebar */}
            <aside className="w-64 bg-gray-100 dark:bg-gray-900 border-r dark:border-gray-800 flex flex-col">
                <div className="p-4 border-b dark:border-gray-800">
                    <h1 className="text-2xl font-bold">Quantum Nexus</h1>
                </div>
                <nav className="flex-1 overflow-y-auto p-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={exportChats}
                        className="gap-1.5 text-sm mb-2 w-full"
                    >
                        <Download className="size-3.5" />
                        Export
                    </Button>
                    <label htmlFor="import-chats">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-sm mb-2 w-full"
                            as="span"
                        >
                            <Upload className="size-3.5" />
                            Import
                        </Button>
                    </label>
                    <input
                        id="import-chats"
                        type="file"
                        accept=".json"
                        onChange={importChats}
                        className="hidden"
                    />
                    {state.chats.map((chat) => (
                        <div
                            key={chat.id}
                            className={`flex items-center justify-between p-2 rounded-lg mb-2 cursor-pointer ${
                                state.currentChatId === chat.id
                                    ? 'bg-blue-100 dark:bg-blue-900'
                                    : 'hover:bg-gray-200 dark:hover:bg-gray-800'
                            }`}
                            onClick={() => loadSelectedChat(chat.id)}
                        >
                            <span className="truncate">{chat.name}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteChat(chat.id);
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </nav>
                <div className="p-4 border-t dark:border-gray-800">
                    <Button variant="outline" className="w-full mb-2" onClick={toggleDarkMode}>
                        {state.settings.darkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                        {state.settings.darkMode ? 'Light Mode' : 'Dark Mode'}
                    </Button>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant="outline" className="w-full">
                                <Settings2 className="mr-2 h-4 w-4" /> Settings
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Configuration</DrawerTitle>
                                <DrawerDescription>Configure the settings for the model and messages.</DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 space-y-4">
                                {/* Settings content */}
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="api-selection">Select API</Label>
                                        <Select
                                            value={state.settings.api}
                                            onValueChange={(value) => {
                                                const useGroq = value === 'groq';
                                                setState((prev) => ({
                                                    ...prev,
                                                    settings: { ...prev.settings, api: value, useGroq },
                                                }));
                                            }}
                                        >
                                            <SelectTrigger id="api-selection">
                                                <SelectValue placeholder="Select an API" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ollama">Ollama</SelectItem>
                                                <SelectItem value="groq">GROQ</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {state.settings.useGroq && (
                                        <div>
                                            <Label htmlFor="api-key">API Key (for GROQ)</Label>
                                            <Input
                                                id="api-key"
                                                type="password"
                                                value={state.apiKey}
                                                onChange={(e) => saveApiKey(e.target.value)}
                                                placeholder="Enter your GROQ API key"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <Label htmlFor="model">Model</Label>
                                        <Select
                                            value={state.settings.model}
                                            onValueChange={(value) =>
                                                setState((prev) => ({
                                                    ...prev,
                                                    settings: { ...prev.settings, model: value },
                                                }))
                                            }
                                        >
                                            <SelectTrigger id="model">
                                                <SelectValue placeholder="Select a model" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {AVAILABLE_MODELS[state.settings.api]?.map((model) => (
                                                    <SelectItem key={model.value} value={model.value}>
                                                        {model.label}
                                                    </SelectItem>
                                                )) || <p>No models available</p>}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
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
                                    <div>
                                        <Label htmlFor="max-tokens">Max Tokens: {state.settings.maxTokens}</Label>
                                        <Slider
                                            id="max-tokens"
                                            min={1}
                                            max={2048}
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
                                    <div>
                                        <Label htmlFor="top-p">Top P: {state.settings.topP}</Label>
                                        <Slider
                                            id="top-p"
                                            min={0}
                                            max={1}
                                            step={0.1}
                                            value={[state.settings.topP]}
                                            onValueChange={(value) =>
                                                setState((prev) => ({
                                                    ...prev,
                                                    settings: { ...prev.settings, topP: value[0] },
                                                }))
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="top-k">Top K: {state.settings.topK}</Label>
                                        <Slider
                                            id="top-k"
                                            min={0}
                                            max={100}
                                            step={1}
                                            value={[state.settings.topK]}
                                            onValueChange={(value) =>
                                                setState((prev) => ({
                                                    ...prev,
                                                    settings: { ...prev.settings, topK: value[0] },
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
                                        <Label htmlFor="stream">Stream responses</Label>
                                    </div>
                                    <div>
                                        <Label htmlFor="system-prompt">System Prompt</Label>
                                        <Textarea
                                            id="system-prompt"
                                            placeholder="Enter system prompt"
                                            value={state.systemPrompt}
                                            onChange={(e) => setSystemPrompt(e.target.value)}
                                        />
                                    </div>
                                    <Button onClick={resetSettings}>Reset to Defaults</Button>
                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{getHeaderTitle(currentView)}</h2>
                    <div className="space-x-2">
                        {currentView === 'chat' && (
                            <>
                                <Button variant="outline" size="sm" onClick={exportChats}>
                                    <Download className="mr-2 h-4 w-4" /> Export Chats
                                </Button>
                                <label htmlFor="import-chats">
                                    <Button variant="outline" size="sm" as="span">
                                        <Upload className="mr-2 h-4 w-4" /> Import Chats
                                    </Button>
                                </label>
                                <input
                                    id="import-chats"
                                    type="file"
                                    accept=".json"
                                    onChange={importChats}
                                    className="hidden"
                                />
                                {currentChat && (
                                    <>
                                        <Button variant="outline" size="sm" onClick={clearChat}>
                                            <Trash2 className="mr-2 h-4 w-4" /> Clear Chat
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={downloadChatTranscript}>
                                            <Download className="mr-2 h-4 w-4" /> Download Transcript
                                        </Button>
                                    </>
                                )}
                            </>
                        )}
                        {/* Additional actions can be added here based on currentView */}
                    </div>
                </header>

                {/* Main View */}
                <ScrollArea className="flex-1 p-4 overflow-x-hidden">
                    {renderCurrentView()}
                </ScrollArea>

                {/* Input Form (Only in Chat View) */}
                {currentView === 'chat' && (
                    <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex-shrink-0">
                        <div className="flex space-x-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1"
                            />
                            <Button type="submit" disabled={isLoading}>
                                <Send className="h-4 w-4 mr-2" /> Send
                            </Button>
                            <Button type="button" onClick={startVoiceInput}>
                                <Mic className="h-4 w-4" />
                            </Button>
                        </div>
                    </form>
                )}
            </main>

            {/* Toast Notifications */}
            <ToastContainer position="bottom-right" />
        </div>
    );
}
```

### **Explanation:**

1. **State for `currentView`:** Introduced a new state variable `currentView` to track which view is active. The possible values include `'chat'`, `'workflow'`, `'fileUpload'`, `'tooling'`, `'projectAnalyzer'`, and `'fileAnalyzer'`.

2. **Triangle Navigation:** Positioned absolutely at the top-left corner, it includes buttons with icons representing each view. Clicking these buttons updates the `currentView` state to render the respective component.

3. **Render Current View:** The `renderCurrentView` function conditionally renders the appropriate component based on `currentView`.

4. **Header Adjustments:** The header dynamically changes its title based on the current view. Additionally, chat-specific actions like exporting/importing chats are only shown when in the chat view.

5. **Toast Notifications:** Integrated `React Toastify` for better user notifications. Install it using `npm install react-toastify` if not already installed.

---

## 2. Integrate AdvancedProjectAnalyzer and NexusFileAnalyzer Components

Ensure that both `AdvancedProjectAnalyzer` and `NexusFileAnalyzer` components are correctly placed within your `components` directory.

### **Directory Structure**

```
src/
├── components/
│   ├── AdvancedProjectAnalyzer.jsx
│   ├── ChatView.jsx
│   ├── FileUploader.jsx
│   ├── NexusFileAnalyzer.jsx
│   ├── ToolingConfiguration.jsx
│   ├── WorkflowBuilder.jsx
│   ├── ui/
│   │   ├── button.jsx
│   │   ├── input.jsx
│   │   ├── label.jsx
│   │   ├── select.jsx
│   │   ├── slider.jsx
│   │   ├── switch.jsx
│   │   ├── textarea.jsx
│   │   ├── avatar.jsx
│   │   ├── drawer.jsx
│   │   ├── scroll-area.jsx
│   │   ├── badge.jsx
│   │   ├── tooltip.jsx
│   │   └── llamaapi/
│   │       └── chatApi.js
│   └── ...
├── pages/
│   └── dashboard.jsx
├── app/
│   └── api/
│       ├── get-file-structure/
│       │   └── route.js
│       ├── comprehensive-file-insights/
│       │   └── route.js
│       ├── get-file-contents/
│       │   └── route.js
│       └── file-insights/
│           └── route.js
└── ...
```

### **2.1. AdvancedProjectAnalyzer Component**

This component allows users to analyze projects by selecting multiple files, generating prompts, and interacting with the compiler.

#### **`components/AdvancedProjectAnalyzer.jsx`**

*(You already provided this component. Ensure it's placed correctly and functional.)*

### **2.2. NexusFileAnalyzer Component**

This component provides detailed insights into selected files, including code quality scores and AI-powered insights.

#### **`components/NexusFileAnalyzer.jsx`**

*(You already provided this component. Ensure it's placed correctly and functional.)*

---

## 3. Enhance ChatView to Support File Selection and Prompt Generation

To integrate file selection and prompt generation within the ChatView, we'll modify the `ChatView` component to include these functionalities.

### **`components/ChatView.jsx`**

```jsx
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from 'react-markdown';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Send, Mic, Paperclip, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'react-toastify';

const ChatView = ({
    state,
    setState,
    input,
    setInput,
    isLoading,
    handleSubmit,
    startVoiceInput,
    speakMessage,
    downloadChatTranscript,
    clearChat,
}) => {
    const chatContainerRef = React.useRef(null);
    const [selectedFiles, setSelectedFiles] = React.useState([]);
    const [showFileSelector, setShowFileSelector] = React.useState(false);
    const [promptHelper, setPromptHelper] = React.useState('');

    React.useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [state.currentChatId, state.chats]);

    const currentChat = state.chats.find((chat) => chat.id === state.currentChatId) || null;

    // Handle file selection
    const handleFileSelection = (e) => {
        const files = Array.from(e.target.files).map(file => file.name);
        setSelectedFiles(files);
        setShowFileSelector(false);
        toast.success('Files selected successfully!');
    };

    // Remove a selected file
    const removeSelectedFile = (fileName) => {
        setSelectedFiles(prev => prev.filter(file => file !== fileName));
    };

    // Generate prompt based on selected files
    const generatePrompt = () => {
        if (selectedFiles.length === 0) {
            toast.error('No files selected.');
            return;
        }

        const prompt = `Analyze the following files for improvements:\n${selectedFiles.join('\n')}`;
        setInput(prompt);
        toast.info('Prompt generated based on selected files.');
    };

    return (
        <>
            {/* Chat Messages */}
            <ScrollArea className="flex-1 p-4 overflow-x-hidden" ref={chatContainerRef}>
                {currentChat?.messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                        <div className={`flex ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[80%]`}>
                            <Avatar className="w-8 h-8 flex-shrink-0">
                                <AvatarImage src={message.role === 'user' ? '/user-avatar.png' : '/bot-avatar.png'} />
                                <AvatarFallback>{message.role === 'user' ? 'U' : 'B'}</AvatarFallback>
                            </Avatar>
                            <div className={`mx-2 ${message.role === 'user' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'} p-3 rounded-lg shadow overflow-hidden`}>
                                <ReactMarkdown
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <pre className="bg-gray-800 text-white p-2 rounded">
                                                    <code {...props} className={className}>
                                                        {children}
                                                    </code>
                                                </pre>
                                            ) : (
                                                <code {...props} className={className}>
                                                    {children}
                                                </code>
                                            );
                                        }
                                    }}
                                    className="prose dark:prose-invert max-w-none break-words"
                                >
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                )}
            </ScrollArea>

            {/* Selected Files and Prompt Helper */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600 flex flex-col space-y-2">
                {/* File Selection */}
                <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={() => setShowFileSelector(true)}>
                        <Paperclip className="h-4 w-4 mr-2" /> Select Files
                    </Button>
                    <Button variant="secondary" onClick={generatePrompt} disabled={selectedFiles.length === 0}>
                        <Plus className="h-4 w-4 mr-2" /> Generate Prompt
                    </Button>
                </div>
                {/* Display Selected Files */}
                {selectedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {selectedFiles.map((file) => (
                            <span key={file} className="flex items-center space-x-1 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                <span>{file}</span>
                                <Button size="xs" variant="ghost" onClick={() => removeSelectedFile(file)}>
                                    ×
                                </Button>
                            </span>
                        ))}
                    </div>
                )}
                {/* Prompt Helper */}
                <Textarea
                    placeholder="Add additional context or instructions for the prompt..."
                    value={promptHelper}
                    onChange={(e) => setPromptHelper(e.target.value)}
                    className="w-full"
                />
                {/* Hidden File Selector */}
                <input
                    type="file"
                    multiple
                    accept=".js,.jsx,.ts,.tsx,.json,.md,.txt,.pdf"
                    onChange={handleFileSelection}
                    className="hidden"
                    id="file-selector"
                />
                <label htmlFor="file-selector">
                    <Button variant="outline" size="sm" className="mt-2">
                        <Upload className="h-4 w-4 mr-2" /> Upload Files
                    </Button>
                </label>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex-shrink-0">
                <div className="flex space-x-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading}>
                        <Send className="h-4 w-4 mr-2" /> Send
                    </Button>
                    <Button type="button" onClick={startVoiceInput}>
                        <Mic className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </>
    );

};

export default ChatView;
```

### **Explanation:**

1. **File Selection:**
    - **Select Files Button:** Opens a file selector to choose multiple files.
    - **Selected Files Display:** Shows the list of selected files with an option to remove each.
    - **Generate Prompt Button:** Generates a prompt based on the selected files and populates the input field.

2. **Prompt Helper:**
    - **Textarea:** Allows users to add additional context or instructions to the prompt.

3. **File Upload Integration:**
    - **Upload Files Button:** Enables uploading of selected files to the server for processing.

4. **Notifications:**
    - Uses `toast` to provide feedback to the user.

---

## 4. Implement a Prompt Helper

The Prompt Helper facilitates the creation of structured prompts by combining user inputs and selected files. It's already partially integrated into the `ChatView` as a `Textarea`. We can further enhance it by interacting with the `chatApi` to preprocess or refine prompts before sending them.

### **Enhance Prompt Generation Logic**

Modify the `generatePrompt` function to incorporate the `promptHelper` content.

```jsx
const generatePrompt = () => {
    if (selectedFiles.length === 0) {
        toast.error('No files selected.');
        return;
    }

    const basePrompt = `Analyze the following files for improvements:\n${selectedFiles.join('\n')}`;
    const completePrompt = promptHelper.trim()
        ? `${basePrompt}\n\nAdditional Instructions:\n${promptHelper}`
        : basePrompt;

    setInput(completePrompt);
    toast.info('Prompt generated based on selected files and additional instructions.');
};
```

### **Explanation:**

- **Base Prompt:** Includes the list of selected files.
- **Additional Instructions:** Appends any extra context provided by the user in the `promptHelper` textarea.
- **Combined Prompt:** Sets the combined prompt into the input field for sending.

---

## 5. Ensure Consistent Theming and API Integration

All components should adhere to the same design system (e.g., Tailwind CSS) to maintain a cohesive UI. Ensure that all buttons, inputs, and other UI elements use the predefined classes and styles.

### **Consistent Styling:**

- **Buttons:** Use variant and size props consistently.
- **Inputs and Textareas:** Ensure they have consistent padding, borders, and rounded corners.
- **Colors:** Utilize theme-based classes (`dark:` variants) to support dark mode.

### **API Integration:**

Ensure that all API interactions are handled through the `chatApi` where applicable. For components like `AdvancedProjectAnalyzer` and `NexusFileAnalyzer`, ensure they use dedicated API routes you've set up.

---

## 6. Update API Routes as Needed

Ensure your API routes are correctly implemented to handle the new functionalities. Here's a summary based on the provided code snippets.

### **6.1. Get File Structure**

#### **`app/api/get-file-structure/route.js`**

*(You already provided this. Ensure it's functional and accessible.)*

### **6.2. Get File Contents**

#### **`app/api/get-file-contents/route.js`**

*(You already provided this. Ensure it's functional and accessible.)*

### **6.3. Comprehensive File Insights**

#### **`app/api/comprehensive-file-insights/route.js`**

*(You already provided this. Ensure it's functional and accessible.)*

### **6.4. File Insights**

#### **`app/api/file-insights/route.js`**

*(You already provided this. Ensure it's functional and accessible.)*

---

## Final Directory Structure

Ensure your project follows a clear and organized directory structure for maintainability.

```
src/
├── components/
│   ├── AdvancedProjectAnalyzer.jsx
│   ├── ChatView.jsx
│   ├── FileUploader.jsx
│   ├── NexusFileAnalyzer.jsx
│   ├── ToolingConfiguration.jsx
│   ├── WorkflowBuilder.jsx
│   ├── ui/
│   │   ├── button.jsx
│   │   ├── input.jsx
│   │   ├── label.jsx
│   │   ├── select.jsx
│   │   ├── slider.jsx
│   │   ├── switch.jsx
│   │   ├── textarea.jsx
│   │   ├── avatar.jsx
│   │   ├── drawer.jsx
│   │   ├── scroll-area.jsx
│   │   ├── badge.jsx
│   │   ├── tooltip.jsx
│   │   └── llamaapi/
│   │       └── chatApi.js
│   └── ...
├── pages/
│   └── dashboard.jsx
├── app/
│   └── api/
│       ├── get-file-structure/
│       │   └── route.js
│       ├── comprehensive-file-insights/
│       │   └── route.js
│       ├── get-file-contents/
│       │   └── route.js
│       └── file-insights/
│       │    └── route.js
│       dashboard/
│       └── page.jsx/
└── ...
```

---

## Additional Recommendations

1. **API Authentication:**
    - Secure your API endpoints, especially those that handle file uploads or sensitive data.
    - Implement authentication and authorization mechanisms as needed.

2. **Error Handling:**
    - Enhance error handling in all components to provide meaningful feedback to users.
    - Display user-friendly error messages instead of console logs.

3. **Performance Optimization:**
    - Lazy-load components that are not immediately needed to improve initial load times.
    - Optimize API calls to reduce latency and handle large data efficiently.

4. **Accessibility:**
    - Ensure all interactive elements are accessible via keyboard navigation.
    - Use appropriate `aria` attributes for better screen reader support.

5. **Testing:**
    - Implement unit and integration tests for critical components to ensure reliability.
    - Use testing libraries like Jest and React Testing Library.

6. **Documentation:**
    - Document your components and APIs to facilitate future maintenance and onboarding of new developers.

---

## Conclusion

By following this comprehensive guide, you've successfully integrated advanced functionalities into your Chatbot UI, including project analysis, file uploading, workflow building, and tooling configurations. This modular approach ensures scalability and maintainability, allowing you to add more features seamlessly in the future. Ensure consistent theming and robust API integration to provide users with a cohesive and intuitive experience.

Feel free to reach out if you need further assistance or specific enhancements!