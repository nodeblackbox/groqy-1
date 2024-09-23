// src/app/dashboardV3/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
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
import { chatApi } from '@/components/ui/llamaapi/chatApi';

// Import new components
import ChatView from '@/components/ChatView';
import WorkflowBuilder from '@/components/WorkflowBuilder';
import FileUploader from '@/components/FileUploader';
import ToolingConfiguration from '@/components/ToolingConfiguration';

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

const STORAGE_KEY = 'quantumNexusState';

const loadState = () => {
    if (typeof window === 'undefined') return initialState;
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
};

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

    useEffect(() => {
        saveState(state);
        if (state.settings.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [state]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [state.currentChatId, state.chats]);

    const currentChat = state.chats.find((chat) => chat.id === state.currentChatId) || null;

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
        } catch (error) {
            console.error('Error calling API:', error);
            showNotification('Error communicating with the chatbot. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const createNewChat = async () => {
        const newChat = await chatApi.createNewChat(newChatName);
        setState((prev) => ({
            ...prev,
            chats: [...prev.chats, newChat],
            currentChatId: newChat.id,
        }));
        setNewChatName('');
        showNotification(`New chat "${newChat.name}" created!`, 'success');
    };

    const loadSelectedChat = (chatId) => {
        setState((prev) => ({
            ...prev,
            currentChatId: chatId,
        }));
    };

    const deleteChat = async (chatId) => {
        const result = await chatApi.deleteChat(chatId);
        if (result.success) {
            setState((prev) => ({
                ...prev,
                chats: prev.chats.filter((chat) => chat.id !== chatId),
                currentChatId: prev.currentChatId === chatId ? null : prev.currentChatId,
            }));
            showNotification(result.message, 'success');
        }
    };

    const clearChat = async () => {
        if (currentChat) {
            const result = await chatApi.clearChat(currentChat.id);
            if (result.success) {
                setState((prev) => ({
                    ...prev,
                    chats: prev.chats.map((chat) =>
                        chat.id === currentChat.id ? { ...chat, messages: [], updatedAt: Date.now() } : chat
                    ),
                }));
                showNotification(result.message, 'success');
            }
        }
    };

    const exportChats = async () => {
        const dataUri = await chatApi.exportChats(state.chats);
        const exportFileDefaultName = 'quantum_nexus_chats.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        showNotification('Chats exported successfully!', 'success');
    };

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
                            chats: [...prev.chats, ...importedChats],
                        }));
                        showNotification('Chats imported successfully!', 'success');
                    } catch (error) {
                        console.error('Error importing chats:', error);
                        showNotification('Failed to import chats. Please check the file format.', 'error');
                    }
                }
            };
            reader.readAsText(file);
        }
    };

    const saveApiKey = (key) => {
        setState((prev) => ({ ...prev, apiKey: key }));
        showNotification('API Key saved successfully!', 'success');
    };

    const setSystemPrompt = (prompt) => {
        setState((prev) => ({ ...prev, systemPrompt: prompt }));
        showNotification('System prompt set successfully!', 'success');
    };

    const resetSettings = () => {
        setState((prev) => ({
            ...prev,
            settings: initialState.settings,
        }));
        showNotification('Settings reset to default values!', 'success');
    };

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
        showNotification('Chat transcript downloaded successfully!', 'success');
    };

    const toggleDarkMode = () => {
        setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, darkMode: !prev.settings.darkMode },
        }));
    };

    const startVoiceInput = () => {
        if (recognition) {
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
            };
            recognition.start();
            showNotification('Listening...', 'info');
        } else {
            showNotification('Speech recognition not supported in this browser.', 'error');
        }
    };

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
            showNotification('Text-to-speech not supported in this browser.', 'error');
        }
    };

    const showNotification = (message, type = 'info') => {
        console.log(`${type.toUpperCase()}: ${message}`);
        // Implement a proper notification system as needed
    };

    const renderCurrentView = () => {
        switch (currentView) {
            case 'chat':
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

    return (
        <div className={`flex h-screen w-full ${state.settings.darkMode ? 'dark' : ''}`}>
            {/* Triangle Navigation */}

            <div className="border-b p-2 dark:border-gray-800">

                <div className="flex flex-col space-y-2">
                    <Button variant="outline" size="icon" aria-label="Home">
                        <Triangle className="size-5 fill-foreground" />
                    </Button>
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
                </div>

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
                        className="gap-1.5 text-sm mb-2"
                    >
                        <Download className="size-3.5" />
                        Export
                    </Button>
                    <label htmlFor="import-chats">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-sm mb-2"
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
                            className={`flex items-center justify-between p-2 rounded-lg mb-2 cursor-pointer ${state.currentChatId === chat.id
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
                                    <Textarea
                                        placeholder="Enter system prompt"
                                        value={state.systemPrompt}
                                        onChange={(e) => setSystemPrompt(e.target.value)}
                                    />
                                    <Button onClick={resetSettings}>Reset to Defaults</Button>
                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Chat Header */}
                <header className="bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{currentView === 'chat' ? (currentChat?.name || 'Select a chat') : getHeaderTitle(currentView)}</h2>
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
        </div>
    );

    // Helper function to get header title based on view
    function getHeaderTitle(view) {
        switch (view) {
            case 'workflow':
                return 'Agent Workflow Builder';
            case 'fileUpload':
                return 'File Uploader';
            case 'tooling':
                return 'Tooling & Configuration';
            default:
                return 'Quantum Nexus';
        }
    }
}