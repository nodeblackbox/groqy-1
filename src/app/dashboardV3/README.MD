Absolutely! Let's create a comprehensive implementation that modularizes your Dashboard into distinct views—**Chat View**, **Agent Workflow Builder**, **File Uploader**, and **Tooling & Configuration**—and integrates seamlessly with multiple APIs like GROQ and Ollama. We'll also ensure that your triangle navigation allows users to switch between these views effortlessly.

Here's a step-by-step guide to achieve this:

1. **Refactor the Dashboard Component for View Switching**
2. **Create Individual Components for Each View**
3. **Enhance the Triangle Navigation with Icons**
4. **Update the `chatApi.js` for Enhanced Functionality**
5. **Ensure State Management and API Integration**

---

## 1. Refactor the Dashboard Component for View Switching

We'll start by modifying your existing `Dashboard` component to support multiple views. We'll introduce a `currentView` state to manage which component is currently active.

### **`Dashboard.jsx`**

```jsx
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
            <div className="absolute top-4 left-4">
                <div className="flex flex-col space-y-2">
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
```

### **Explanation:**

1. **State for `currentView`:** We introduced a new state variable `currentView` to track which view is currently active. The possible values are `'chat'`, `'workflow'`, `'fileUpload'`, and `'tooling'`.

2. **Triangle Navigation:** The triangle navigation is positioned absolutely at the top-left corner. It contains buttons with icons representing each view. Clicking these buttons updates the `currentView` state.

3. **Render Current View:** The `renderCurrentView` function conditionally renders the appropriate component based on `currentView`.

4. **Main Content Adjustments:** The main content area now renders the selected view. Additionally, the input form (for chat) is only displayed when the `currentView` is `'chat'`.

5. **Header Adjustments:** The header dynamically changes its title based on the current view. Also, chat-specific actions like exporting/importing chats are only shown when in the chat view.

---

## 2. Create Individual Components for Each View

We'll create separate components for **ChatView**, **WorkflowBuilder**, **FileUploader**, and **ToolingConfiguration** to keep the code modular and maintainable.

### **2.1. ChatView Component**

Refactor your existing chat functionality into a `ChatView` component.

#### **`components/ChatView.jsx`**

```jsx
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReactMarkdown from 'react-markdown';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Send, Mic } from 'lucide-react';
import { Input } from '@/components/ui/input';

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

    React.useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [state.currentChatId, state.chats]);

    const currentChat = state.chats.find((chat) => chat.id === state.currentChatId) || null;

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
        </>
    );
};

export default ChatView;
```

### **2.2. WorkflowBuilder Component**

This component allows users to create and manage agent workflows by interacting with backend APIs.

#### **`components/WorkflowBuilder.jsx`**

```jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trash2, Plus } from 'lucide-react';

const WorkflowBuilder = () => {
    const [tools, setTools] = useState([]);
    const [availableTools, setAvailableTools] = useState([]);
    const [workflowName, setWorkflowName] = useState('');
    const [selectedTool, setSelectedTool] = useState('');

    useEffect(() => {
        // Fetch available tools from API
        async function fetchAvailableTools() {
            try {
                const response = await fetch('/api/tools'); // Replace with actual API endpoint
                const data = await response.json();
                setAvailableTools(data);
            } catch (error) {
                console.error('Error fetching tools:', error);
            }
        }

        fetchAvailableTools();
    }, []);

    const handleAddTool = () => {
        if (selectedTool) {
            setTools([...tools, selectedTool]);
            setSelectedTool('');
        }
    };

    const handleRemoveTool = (index) => {
        const updatedTools = [...tools];
        updatedTools.splice(index, 1);
        setTools(updatedTools);
    };

    const handleSaveWorkflow = async () => {
        if (!workflowName || tools.length === 0) {
            alert('Please provide a workflow name and add at least one tool.');
            return;
        }

        const workflow = {
            name: workflowName,
            tools: tools,
        };

        try {
            const response = await fetch('/api/workflows', { // Replace with actual API endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(workflow),
            });

            if (response.ok) {
                alert('Workflow saved successfully!');
                setWorkflowName('');
                setTools([]);
            } else {
                alert('Failed to save workflow.');
            }
        } catch (error) {
            console.error('Error saving workflow:', error);
            alert('An error occurred while saving the workflow.');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Agent Workflow Builder</h2>
            <div className="mb-4">
                <Label htmlFor="workflow-name">Workflow Name</Label>
                <Input
                    id="workflow-name"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    placeholder="Enter workflow name"
                />
            </div>
            <div className="mb-4">
                <Label htmlFor="select-tool">Select Tool</Label>
                <div className="flex space-x-2">
                    <Select
                        value={selectedTool}
                        onValueChange={(value) => setSelectedTool(value)}
                    >
                        <SelectTrigger id="select-tool">
                            <SelectValue placeholder="Select a tool" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableTools.map((tool) => (
                                <SelectItem key={tool.id} value={tool.name}>
                                    {tool.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handleAddTool} disabled={!selectedTool}>
                        <Plus className="h-4 w-4 mr-1" /> Add
                    </Button>
                </div>
            </div>
            <div className="mb-4">
                <Label>Selected Tools</Label>
                <ul className="list-disc list-inside">
                    {tools.map((tool, index) => (
                        <li key={index} className="flex justify-between items-center">
                            {tool}
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveTool(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
            <Button onClick={handleSaveWorkflow} disabled={!workflowName || tools.length === 0}>
                Save Workflow
            </Button>
        </div>
    );
};

export default WorkflowBuilder;
```

### **2.3. FileUploader Component**

This component handles uploading files (e.g., PDFs) to your models.

#### **`components/FileUploader.jsx`**

```jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

const FileUploader = () => {
    const [files, setFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleFileUpload = async () => {
        if (files.length === 0) {
            alert('Please select at least one file to upload.');
            return;
        }

        const formData = new FormData();
        for (const file of files) {
            formData.append('files', file);
        }

        try {
            const response = await fetch('/api/upload', { // Replace with actual API endpoint
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('Files uploaded successfully!');
                setFiles([]);
            } else {
                setUploadStatus('Failed to upload files.');
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            setUploadStatus('An error occurred during file upload.');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">File Uploader</h2>
            <div className="mb-4">
                <Label htmlFor="file-upload">Select Files</Label>
                <Input
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                />
            </div>
            <Button onClick={handleFileUpload} disabled={files.length === 0}>
                <Upload className="h-4 w-4 mr-1" /> Upload Files
            </Button>
            {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
        </div>
    );
};

export default FileUploader;
```

### **2.4. ToolingConfiguration Component**

This component allows users to configure API models and other settings.

#### **`components/ToolingConfiguration.jsx`**

```jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

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

const ToolingConfiguration = ({ state, setState, saveApiKey, setSystemPrompt, resetSettings }) => {
    const handleApiChange = (value) => {
        const useGroq = value === 'groq';
        setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, api: value, useGroq },
        }));
    };

    const handleModelChange = (value) => {
        setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, model: value },
        }));
    };

    const handleTemperatureChange = (value) => {
        setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, temperature: value[0] },
        }));
    };

    const handleMaxTokensChange = (value) => {
        setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, maxTokens: value[0] },
        }));
    };

    const handleTopPChange = (value) => {
        setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, topP: value[0] },
        }));
    };

    const handleTopKChange = (value) => {
        setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, topK: value[0] },
        }));
    };

    const handleStreamChange = (checked) => {
        setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, stream: checked },
        }));
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Tooling & Configurations</h2>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="api-selection">Select API</Label>
                    <Select
                        value={state.settings.api}
                        onValueChange={handleApiChange}
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
                        onValueChange={handleModelChange}
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
                        onValueChange={handleTemperatureChange}
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
                        onValueChange={handleMaxTokensChange}
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
                        onValueChange={handleTopPChange}
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
                        onValueChange={handleTopKChange}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="stream"
                        checked={state.settings.stream}
                        onCheckedChange={handleStreamChange}
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
    );
};

export default ToolingConfiguration;
```

### **Explanation:**

1. **`ChatView.jsx`:** This component handles rendering the chat messages. It leverages `ReactMarkdown` for markdown rendering and displays a loader when messages are being fetched.

2. **`WorkflowBuilder.jsx`:** Allows users to create workflows by selecting tools from a fetched list. Users can add or remove tools and save the workflow.

3. **`FileUploader.jsx`:** Enables users to upload multiple files. It provides feedback on the upload status.

4. **`ToolingConfiguration.jsx`:** Lets users select the API (Ollama or GROQ), enter API keys if necessary, select models, and adjust settings like temperature, max tokens, top P/K, and whether to stream responses.

---

## 3. Enhance the Triangle Navigation with Icons

We've already positioned the triangle navigation in the `Dashboard` component. Each button in the triangle is associated with a specific view and contains an icon for better visual representation.

### **Icons Used:**

- **Chat:** `Bot`
- **Workflow:** `CornerDownLeft`
- **File Upload:** `Paperclip`
- **Tooling:** `Settings2`

You can customize these icons as per your preference by selecting different icons from the `lucide-react` library.

---

## 4. Update the `chatApi.js` for Enhanced Functionality

Ensure your `chatApi.js` is correctly set up to handle multiple APIs and can be easily extended for future additions.

### **`src/components/ui/llamaapi/chatApi.js`**

```javascript
const OLLAMA_BASE_URL = 'http://localhost:11434/api';
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';

class ChatAPI {
    constructor() {
        this.apiKey = '';
        this.model = 'llama3.1';
        this.systemPrompt = '';
        this.temperature = 0.7;
        this.maxTokens = 1024;
        this.topP = 1;
        this.topK = 0;
        this.stream = false;
        this.useGroq = false;
    }

    setApiKey(key) {
        this.apiKey = key;
    }

    setModel(model) {
        this.model = model;
    }

    setSystemPrompt(prompt) {
        this.systemPrompt = prompt;
    }

    setTemperature(temp) {
        this.temperature = temp;
    }

    setMaxTokens(tokens) {
        this.maxTokens = tokens;
    }

    setTopP(value) {
        this.topP = value;
    }

    setTopK(value) {
        this.topK = value;
    }

    setStream(value) {
        this.stream = value;
    }

    setUseGroq(value) {
        this.useGroq = value;
    }

    async sendMessage(messages) {
        if (this.systemPrompt && !messages.some(m => m.role === 'system')) {
            messages.unshift({ role: 'system', content: this.systemPrompt });
        }

        const url = this.useGroq ? `${GROQ_BASE_URL}/chat/completions` : `${OLLAMA_BASE_URL}/chat`;

        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.useGroq) {
            headers['Authorization'] = `Bearer ${this.apiKey}`;
        }

        const body = this.useGroq
            ? {
                model: this.model,
                messages: messages,
                temperature: this.temperature,
                max_tokens: this.maxTokens,
                top_p: this.topP,
                stream: this.stream,
            }
            : {
                model: this.model,
                messages: messages,
                stream: this.stream,
                options: {
                    temperature: this.temperature,
                    num_predict: this.maxTokens,
                    top_k: this.topK,
                    top_p: this.topP,
                },
            };

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Failed to communicate with ${this.useGroq ? 'GROQ' : 'Ollama'} API`);
        }

        if (this.stream) {
            return response.body;
        } else {
            const data = await response.json();
            return this.useGroq ? data.choices[0].message : data.message;
        }
    }

    async createNewChat(name) {
        return {
            id: Date.now().toString(),
            name: name || `Chat ${Date.now()}`,
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
    }

    async deleteChat(chatId) {
        // Implement actual deletion logic if necessary
        return { success: true, message: 'Chat deleted successfully' };
    }

    async clearChat(chatId) {
        // Implement actual clear logic if necessary
        return { success: true, message: 'Chat cleared successfully' };
    }

    async exportChats(chats) {
        const dataStr = JSON.stringify(chats, null, 2);
        return 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    }

    async importChats(fileContent) {
        return JSON.parse(fileContent);
    }
}

export const chatApi = new ChatAPI();
```

### **Explanation:**

- **API Selection:** The `ChatAPI` class can switch between GROQ and Ollama based on the `useGroq` flag.
- **Dynamic Headers and Body:** Depending on the selected API, the headers and body of the request are adjusted accordingly.
- **Error Handling:** Proper error messages are thrown if the API call fails.
- **Stream Support:** The API supports streaming responses if enabled.

---

## 5. Ensure State Management and API Integration

All components interact with the shared `state` managed in the `Dashboard` component. This ensures that settings and data persist across different views.

### **State Flow:**

- **Tooling Configuration:** Updates settings like API selection, model, temperature, etc.
- **Chat View:** Utilizes the settings to interact with the selected API and model.
- **Workflow Builder & File Uploader:** Can be further integrated to use the settings as needed.

### **Notification System:**

Currently, `showNotification` logs messages to the console. For a better user experience, consider integrating a notification library like [React Toastify](https://github.com/fkhadra/react-toastify) or similar.

#### **Example Integration with React Toastify:**

1. **Install React Toastify:**

   ```bash
   npm install react-toastify
   ```

2. **Configure Toastify in `Dashboard.jsx`:**

   ```jsx
   import { ToastContainer, toast } from 'react-toastify';
   import 'react-toastify/dist/ReactToastify.css';

   // Update showNotification function
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

   // Add ToastContainer to the JSX
   return (
       <div className={`flex h-screen w-full ${state.settings.darkMode ? 'dark' : ''}`}>
           {/* ...existing code... */}
           <ToastContainer position="bottom-right" />
       </div>
   );
   ```

3. **Remove `console.log` from `showNotification`:**

   Replace the existing `console.log` with the toast notifications as shown above.

---

## Final Directory Structure

For clarity, here's how your directory structure should look after these changes:

```
src/
├── components/
│   ├── ChatView.jsx
│   ├── FileUploader.jsx
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
├── pages/
│   └── dashboard.jsx
├── lib/
│   └── utils.js
└── ... other files
```

---

## Additional Recommendations

1. **API Endpoints:**
   - Ensure that your backend has the necessary API endpoints (`/api/tools`, `/api/workflows`, `/api/upload`, etc.) to handle requests from the frontend.
   - Implement proper authentication and validation for sensitive operations like uploading files or managing workflows.

2. **Error Handling:**
   - Enhance error handling across all components to provide users with meaningful feedback.

3. **Styling:**
   - Utilize a consistent design system or CSS framework (like Tailwind CSS, which seems to be in use) to maintain a cohesive UI.

4. **Accessibility:**
   - Ensure all interactive elements are accessible (e.g., proper `aria` labels, keyboard navigation).

5. **Performance:**
   - Optimize API calls and component rendering to ensure smooth user experience, especially when dealing with large data like file uploads.

6. **Testing:**
   - Implement unit and integration tests to ensure the reliability of each component and the overall application.

---

By following this comprehensive implementation, you'll achieve a modular, scalable, and maintainable Dashboard that seamlessly integrates multiple views and interacts with various APIs. This structure also allows for easy addition of new features in the future. Let me know if you need further assistance or specific enhancements!