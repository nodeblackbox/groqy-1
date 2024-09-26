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
    Plus,
    Loader2,
    ChevronRight,
    ChevronLeft,
    MessageSquare,
    Workflow,
    FileUp,
    Wrench,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from "@/lib/utils";
import { chatApi } from '@/components/ui/llamaapi/chatApi';
import ChatView from '@/components/ChatView';
import WorkflowBuilder from '@/components/WorkflowBuilder';
import FileUploader from '@/components/FileUploader';
import ToolingConfiguration from '@/components/ToolingConfiguration';
import NotificationProvider, { useNotification } from '@/components/ui/NotificationProvider';
import Settings from '@/components/Settings';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';

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

export default function Dashboard() {
    const addNotification = useNotification();
    const [state, setState] = useState(loadState);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentView, setCurrentView] = useState('chat');
    const [isChatCollapsed, setIsChatCollapsed] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

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

    const fetchOllamaModels = async () => {
        try {
            const response = await fetch('/api/ollama-models');
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch models');
            }
            const formattedModels = data.models.map((model) => ({
                label: model,
                value: model,
            }));
            setAvailableModels((prev) => ({ ...prev, ollama: formattedModels }));
        } catch (error) {
            console.error('Error fetching Ollama models:', error);
            addNotification('Failed to fetch Ollama models', 'error');
        }
    };

    const currentChat = state.chats.find((chat) => chat.id === state.currentChatId) || null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || !currentChat) return;

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
            let response;
            if (state.settings.api === 'groq') {
                if (!state.apiKey) {
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

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error from GROQ API:', errorData);
                    throw new Error(`GROQ API error: ${errorData.error || 'Unknown error'}`);
                }
            } else if (state.settings.api === 'ollama') {
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
            } else {
                throw new Error('Invalid API selected');
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            if (state.settings.stream) {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let botMessage = '';

                while (true) {
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
            } else {
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
        } catch (error) {
            console.error('Error calling API:', error);
            addNotification(`Error communicating with the chatbot: ${error.message}`, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const createNewChat = async () => {
        try {
            const newChat = await chatApi.createNewChat(`New Chat ${state.chats.length + 1}`);
            setState((prev) => ({
                ...prev,
                chats: [...prev.chats, newChat],
                currentChatId: newChat.id,
            }));
            addNotification(`New chat "${newChat.name}" created!`, 'success');
        } catch (error) {
            console.error('Error creating new chat:', error);
            addNotification('Failed to create a new chat.', 'error');
        }
    };

    const loadSelectedChat = (chatId) => {
        setState((prev) => ({
            ...prev,
            currentChatId: chatId,
        }));
    };

    const deleteChat = async (chatId) => {
        try {
            const result = await chatApi.deleteChat(chatId);
            if (result.success) {
                setState((prev) => ({
                    ...prev,
                    chats: prev.chats.filter((chat) => chat.id !== chatId),
                    currentChatId: prev.currentChatId === chatId ? null : prev.currentChatId,
                }));
                addNotification(result.message, 'success');
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
            addNotification('Failed to delete chat.', 'error');
        }
    };

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
                    addNotification(result.message, 'success');
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error('Error clearing chat:', error);
                addNotification('Failed to clear chat.', 'error');
            }
        }
    };

    const exportChats = async () => {
        try {
            const dataUri = await chatApi.exportChats(state.chats);
            const exportFileDefaultName = 'quantum_nexus_chats.json';
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            document.body.appendChild(linkElement);
            linkElement.click();
            document.body.removeChild(linkElement);
            URL.revokeObjectURL(dataUri);
            addNotification('Chats exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting chats:', error);
            addNotification('Failed to export chats.', 'error');
        }
    };

    const importChats = async (event) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            try {
                const importedChats = await chatApi.importChats(file);
                setState((prev) => ({
                    ...prev,
                    chats: [...prev.chats, ...importedChats],
                }));
                addNotification('Chats imported successfully!', 'success');
            } catch (error) {
                console.error('Error importing chats:', error);
                addNotification('Failed to import chats. Please check the file format.', 'error');
            }
        }
    };

    const saveApiKey = (key) => {
        setState((prev) => ({ ...prev, apiKey: key }));
        addNotification('API Key saved successfully!', 'success');
    };

    const setSystemPrompt = (prompt) => {
        setState((prev) => ({ ...prev, systemPrompt: prompt }));
        addNotification('System prompt set successfully!', 'success');
    };

    const resetSettings = () => {
        setState((prev) => ({
            ...prev,
            settings: initialState.settings,
        }));
        addNotification('Settings reset to default values!', 'success');
    };

    const downloadChatTranscript = () => {
        if (!currentChat) return;
        try {
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
            addNotification('Chat transcript downloaded successfully!', 'success');
        } catch (error) {
            console.error('Error downloading transcript:', error);
            addNotification('Failed to download transcript.', 'error');
        }
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
            addNotification('Listening...', 'info');
        } else {
            addNotification('Speech recognition not supported in this browser.', 'error');
        }
    };

    const speakMessage = (message) => {
        if (speechSynthesisInstance) {
            if (isSpeaking) {
                speechSynthesisInstance.cancel();
                setIsSpeaking(false);
            } else {
                const utterance = new SpeechSynthesisUtterance(message);
                utterance.onend = () => setIsSpeaking(false);
                speechSynthesisInstance.speak(utterance);
                setIsSpeaking(true);
            }
        } else {
            addNotification('Text-to-speech not supported in this browser.', 'error');
        }
    };

    const toggleChatCollapse = () => {
        setIsChatCollapsed(!isChatCollapsed);
    };

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    const renderCurrentView = () => {
        switch (currentView) {
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
            default:
                return null;
        }
    };

    return (
        <NotificationProvider>
            <div className={`flex h-screen w-full bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-900 dark:to-indigo-950 transition-colors duration-300 ${state.settings.darkMode ? 'dark' : ''}`}>
                {/* Collapsible Sidebar */}
                <div className={`transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-16'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg`}>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        {isSidebarExpanded && (
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Quantum Nexus</h1>
                        )}
                        <Button variant="ghost" size="sm" onClick={toggleSidebar}>
                            {isSidebarExpanded ? <ChevronLeft /> : <ChevronRight />}
                        </Button>
                    </div>
                    <ScrollArea className="flex-1 p-4">
                        <nav className="space-y-2">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size={isSidebarExpanded ? "default" : "icon"}
                                            onClick={() => setCurrentView('chat')}
                                            className={`w-full justify-start ${currentView === 'chat' ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300' : ''}`}
                                        >
                                            <MessageSquare className="h-5 w-5 mr-2" />
                                            {isSidebarExpanded && "Chat"}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">Chat</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size={isSidebarExpanded ? "default" : "icon"}
                                            onClick={() => setCurrentView('workflow')}
                                            className={`w-full justify-start ${currentView === 'workflow' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300' : ''}`}
                                        >
                                            <Workflow className="h-5 w-5 mr-2" />
                                            {isSidebarExpanded && "Workflow"}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">Workflow</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size={isSidebarExpanded ? "default" : "icon"}
                                            onClick={() => setCurrentView('fileUpload')}
                                            className={`w-full justify-start ${currentView === 'fileUpload' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : ''}`}
                                        >
                                            <FileUp className="h-5 w-5 mr-2" />
                                            {isSidebarExpanded && "File Upload"}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">File Upload</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size={isSidebarExpanded ? "default" : "icon"}
                                            onClick={() => setCurrentView('tooling')}
                                            className={`w-full justify-start ${currentView === 'tooling' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' : ''}`}
                                        >
                                            <Wrench className="h-5 w-5 mr-2" />
                                            {isSidebarExpanded && "Tooling"}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">Tooling</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </nav>
                    </ScrollArea>
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
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
                                <ScrollArea className="h-[calc(100vh-10rem)] p-4 space-y-4">
                                    <Settings
                                        state={state}
                                        setState={setState}
                                        saveApiKey={saveApiKey}
                                        setSystemPrompt={setSystemPrompt}
                                        resetSettings={resetSettings}
                                        toggleDarkMode={toggleDarkMode}
                                        availableModels={availableModels}
                                    />
                                </ScrollArea>
                            </DrawerContent>
                        </Drawer>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
                    {/* Header */}
                    <header className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shadow-sm">
                        <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            {currentView === 'chat' ? (currentChat?.name || 'Select a chat') : getHeaderTitle(currentView)}
                        </h2>
                        <div className="space-x-2">
                            {currentView === 'chat' && (
                                <>
                                    <Button variant="outline" size="sm" onClick={exportChats} className="transition-all duration-200 hover:bg-purple-100 dark:hover:bg-purple-900">
                                        <Download className="mr-2 h-4 w-4" /> Export Chats
                                    </Button>
                                    <label htmlFor="import-chats-main">
                                        <Button variant="outline" size="sm" as="span" className="transition-all duration-200 hover:bg-indigo-100 dark:hover:bg-indigo-900">
                                            <Upload className="mr-2 h-4 w-4" /> Import Chats
                                        </Button>
                                    </label>
                                    <input
                                        id="import-chats-main"
                                        type="file"
                                        accept=".json"
                                        onChange={importChats}
                                        className="hidden"
                                    />
                                    {currentChat && (
                                        <>
                                            <Button variant="outline" size="sm" onClick={clearChat} className="transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900">
                                                <Trash2 className="mr-2 h-4 w-4 text-red-500" /> Clear Chat
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={downloadChatTranscript} className="transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-900">
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
                    {currentView === 'chat' && !isChatCollapsed && (
                        <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 shadow-lg">
                            <div className="flex space-x-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                                />
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-200">
                                                {isLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}
                                                Send
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Send message</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button type="button" onClick={startVoiceInput} disabled={isLoading} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200">
                                                <Mic className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Start voice input</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </form>
                    )}
                </main>
            </div>
        </NotificationProvider>
    );
}

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