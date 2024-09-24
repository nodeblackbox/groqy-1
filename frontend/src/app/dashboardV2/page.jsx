// src/components/Dashboard.js

'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import {
    Bot,
    Settings2,
    Moon,
    Sun,
    Plus,
    Trash2,
    Download,
    Upload,
    Mic,
    Loader2,
    Triangle,
    Settings,
    Download as DownloadIcon,
    Upload as UploadIcon,
} from 'lucide-react';

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
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';




const initialState = {
    chats: [],
    currentChatId: null,
    apiKey: '',
    settings: {
        api: 'ollama', // Default to 'ollama' or set your desired default
        model: 'llama3.1',
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

// Define available models
const AVAILABLE_MODELS = {
    ollama: [
        { label: 'llama3.1:latest', value: 'llama3.1:latest' },
        { label: 'llama3.1', value: 'llama3.1' },
        { label: 'LLaMA2 30B', value: 'llama2-30b' },
        // Add more Ollama models here
    ],
    groq: [
        { label: 'LLaMA2 70B', value: 'llama2-70b-4096' },
        // Add more GROQ models here
    ],
};

export default function Dashboard() {
    const [state, setState] = useState(loadState);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [newChatName, setNewChatName] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);

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
            // Configure ChatAPI based on current settings
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
                let messageElement = null;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    botMessage += decoder.decode(value);
                    if (!messageElement) {
                        messageElement = document.createElement('div');
                        messageElement.classList.add('message', 'bot-message');
                        chatContainerRef.current?.appendChild(messageElement);
                    }
                    messageElement.innerHTML = renderMessage('assistant', botMessage);
                    messageElement.scrollIntoView({ behavior: 'smooth' });
                }

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
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const content = e.target?.result;
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

    const renderMessage = (role, content) => {
        const htmlContent = marked(content);
        return `
      <div class="${role === 'user' ? 'bg-blue-100 dark:bg-blue-900 text-right' : 'bg-gray-100 dark:bg-gray-800 text-left'} p-2 rounded">
        <strong>${role === 'user' ? 'You' : 'Bot'}:</strong>
        <pre><code>${hljs.highlightAuto(htmlContent).value}</code></pre>
      </div>
    `;
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
        // Implement a proper notification system as per your UI library
        // For demonstration, using console.log
        console.log(`${type.toUpperCase()}: ${message}`);
    };

    return (
        <div className={`grid h-screen w-full pl-[53px] ${state.settings.darkMode ? 'dark' : ''}`}>
            {/* Sidebar */}
            <aside className="inset-y fixed left-0 z-20 flex h-full flex-col border-r dark:border-gray-800 bg-background">
                <div className="border-b p-2 dark:border-gray-800">
                    <Button variant="outline" size="icon" aria-label="Home">
                        <Triangle className="size-5 fill-foreground" />
                    </Button>
                </div>
                <nav className="grid gap-1 p-2 overflow-y-auto flex-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-lg bg-muted"
                                    aria-label="New Chat"
                                    onClick={createNewChat}
                                >
                                    <Plus className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                New Chat
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {state.chats.map((chat) => (
                        <TooltipProvider key={chat.id}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`rounded-lg ${state.currentChatId === chat.id ? 'bg-muted' : ''}`}
                                        aria-label={chat.name}
                                        onClick={() => loadSelectedChat(chat.id)}
                                    >
                                        <Bot className="size-5" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={5}>
                                    {chat.name}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ))}
                </nav>
                <nav className="mt-auto grid gap-1 p-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="mt-auto rounded-lg"
                                    aria-label="Toggle Dark Mode"
                                    onClick={toggleDarkMode}
                                >
                                    {state.settings.darkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                Toggle Dark Mode
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Drawer>
                                    <DrawerTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="mt-auto rounded-lg"
                                            aria-label="Settings"
                                        >
                                            <Settings2 className="size-5" />
                                        </Button>
                                    </DrawerTrigger>
                                    <DrawerContent className="max-h-[80vh]">
                                        <DrawerHeader>
                                            <DrawerTitle>Configuration</DrawerTitle>
                                            <DrawerDescription>
                                                Configure the settings for the model and messages.
                                            </DrawerDescription>
                                        </DrawerHeader>
                                        <div className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
                                            {/* Settings Content */}
                                            <form className="grid w-full items-start gap-6">
                                                {/* API Selection */}
                                                <fieldset className="grid gap-6 rounded-lg border p-4 dark:border-gray-800">
                                                    <legend className="-ml-1 px-1 text-sm font-medium">API Configuration</legend>
                                                    <div className="grid gap-3">
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
                                                            <SelectTrigger id="api-selection" className="w-full">
                                                                <SelectValue placeholder="Select an API" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="ollama">Ollama</SelectItem>
                                                                <SelectItem value="groq">GROQ</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    {state.settings.useGroq && (
                                                        <div className="grid gap-3">
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
                                                </fieldset>

                                                {/* Model Selection */}
                                                <fieldset className="grid gap-6 rounded-lg border p-4 dark:border-gray-800">
                                                    <legend className="-ml-1 px-1 text-sm font-medium">Model Settings</legend>
                                                    <div className="grid gap-3">
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
                                                            <SelectTrigger id="model" className="w-full">
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
                                                </fieldset>

                                                {/* Other Settings */}
                                                <fieldset className="grid gap-6 rounded-lg border p-4 dark:border-gray-800">
                                                    <legend className="-ml-1 px-1 text-sm font-medium">Advanced Settings</legend>
                                                    <div className="grid gap-3">
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
                                                    <div className="grid gap-3">
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
                                                    <div className="grid gap-3">
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
                                                    {state.settings.api === 'ollama' && (
                                                        <div className="grid gap-3">
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
                                                    )}
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
                                                    <Button onClick={resetSettings}>Reset to Defaults</Button>
                                                </fieldset>

                                                {/* System Prompt */}
                                                <fieldset className="grid gap-6 rounded-lg border p-4 dark:border-gray-800">
                                                    <legend className="-ml-1 px-1 text-sm font-medium">System Message</legend>
                                                    <div className="grid gap-3">
                                                        <Label htmlFor="system-message">System Message</Label>
                                                        <Textarea
                                                            id="system-message"
                                                            value={state.systemPrompt}
                                                            onChange={(e) => setSystemPrompt(e.target.value)}
                                                            placeholder="Enter a system message"
                                                        />
                                                    </div>
                                                </fieldset>
                                            </form>
                                        </div>
                                    </DrawerContent>
                                </Drawer>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                Settings
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex flex-col flex-1">
                {/* Header */}
                <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4 dark:border-gray-800">
                    <h1 className="text-xl font-semibold">{currentChat?.name || 'Quantum Nexus'}</h1>
                    <div className="ml-auto flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={exportChats}
                            className="gap-1.5 text-sm"
                        >
                            <Download className="size-3.5" />
                            Export
                        </Button>
                        <label htmlFor="import-chats">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-sm"
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
                        {currentChat && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearChat}
                                    className="gap-1.5 text-sm"
                                >
                                    <Trash2 className="size-3.5" />
                                    Clear Chat
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={downloadChatTranscript}
                                    className="gap-1.5 text-sm"
                                >
                                    <DownloadIcon className="size-3.5" />
                                    Download Transcript
                                </Button>
                            </>
                        )}
                    </div>
                </header>

                {/* Chat and Settings */}
                <main className="flex-1 flex flex-col gap-4 overflow-auto p-4">
                    {/* Chat Container */}
                    <div
                        ref={chatContainerRef}
                        className="flex-1 overflow-auto rounded-lg border p-4 dark:border-gray-800"
                    >
                        {currentChat?.messages.map((message) => (
                            <div
                                key={message.id}
                                className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
                                dangerouslySetInnerHTML={{
                                    __html: renderMessage(message.role, message.content),
                                }}
                            />
                        ))}
                        {isLoading && (
                            <div className="flex items-center justify-center">
                                <Loader2 className="size-4 animate-spin" />
                            </div>
                        )}
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <Button type="submit" disabled={isLoading}>
                            Send
                        </Button>
                        <Button type="button" onClick={startVoiceInput}>
                            <Mic className="size-4" />
                        </Button>
                    </form>
                </main>
            </div>
        </div >
    );
}
