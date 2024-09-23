'use client';

import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';
import {
    Bird,
    Book,
    Bot,
    Code2,
    CornerDownLeft,
    LifeBuoy,
    Mic,
    Paperclip,
    Rabbit,
    Settings,
    Settings2,
    Share,
    SquareTerminal,
    SquareUser,
    Triangle,
    Turtle,
    Loader2,
    Moon,
    Sun,
    Trash2,
    Download,
    Upload,
    Plus,
    X,
    Volume2,
    VolumeX,
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
        model: 'llama2-70b-4096',
        temperature: 0.7,
        maxTokens: 1024,
        topP: 1,
        topK: 0,
        stream: false,
        darkMode: false,
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

const callGroqAPI = async (messages, apiKey, model, temperature, maxTokens, topP, topK, stream) => {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            messages: messages.map(({ role, content }) => ({ role, content })),
            model,
            temperature,
            max_tokens: maxTokens,
            top_p: topP,
            top_k: topK,
            stream,
            stop: null,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to communicate with GROQ API');
    }

    if (stream) {
        return response.body;
    } else {
        const data = await response.json();
        return data.choices[0].message;
    }
};

export default function Dashboard() {
    const [state, setState] = useState(loadState);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [newChatName, setNewChatName] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);

    const chatContainerRef = useRef(null);
    const speechSynthesis =
        typeof window !== 'undefined' ? window.speechSynthesis : null;
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
        if (!input.trim() || !currentChat || !state.apiKey) return;

        const newMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: Date.now()
        };
        const updatedMessages = [...currentChat.messages, newMessage];
        if (state.systemPrompt && !currentChat.messages.some((m) => m.role === 'system')) {
            updatedMessages.unshift({
                id: 'system-' + Date.now().toString(),
                role: 'system',
                content: state.systemPrompt,
                timestamp: Date.now()
            });
        }

        setState((prev) => ({
            ...prev,
            chats: prev.chats.map((chat) =>
                chat.id === currentChat.id
                    ? { ...chat, messages: updatedMessages, updatedAt: Date.now() }
                    : chat
            )
        }));
        setInput('');
        setIsLoading(true);

        try {
            const response = await callGroqAPI(
                updatedMessages,
                state.apiKey,
                state.settings.model,
                state.settings.temperature,
                state.settings.maxTokens,
                state.settings.topP,
                state.settings.topK,
                state.settings.stream
            );

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
                                        timestamp: Date.now()
                                    }
                                ],
                                updatedAt: Date.now()
                            }
                            : chat
                    )
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
                                        timestamp: Date.now()
                                    }
                                ],
                                updatedAt: Date.now()
                            }
                            : chat
                    )
                }));
            }
        } catch (error) {
            console.error('Error calling GROQ API:', error);
            showNotification('Error communicating with the chatbot. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const createNewChat = () => {
        const newChat = {
            id: Date.now().toString(),
            name: newChatName || `Chat ${state.chats.length + 1}`,
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        setState((prev) => ({
            ...prev,
            chats: [...prev.chats, newChat],
            currentChatId: newChat.id
        }));
        setNewChatName('');
        showNotification(`New chat "${newChat.name}" created!`, 'success');
    };

    const loadSelectedChat = (chatId) => {
        setState((prev) => ({
            ...prev,
            currentChatId: chatId
        }));
    };

    const deleteChat = (chatId) => {
        setState((prev) => ({
            ...prev,
            chats: prev.chats.filter((chat) => chat.id !== chatId),
            currentChatId: prev.currentChatId === chatId ? null : prev.currentChatId
        }));
        showNotification('Chat deleted successfully!', 'success');
    };

    const clearChat = () => {
        if (currentChat) {
            setState((prev) => ({
                ...prev,
                chats: prev.chats.map((chat) =>
                    chat.id === currentChat.id ? { ...chat, messages: [], updatedAt: Date.now() } : chat
                )
            }));
            showNotification('Chat cleared successfully!', 'success');
        }
    };

    const exportChats = () => {
        const dataStr = JSON.stringify(state.chats, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'quantum_nexus_chats.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        showNotification('Chats exported successfully!', 'success');
    };

    const importChats = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result;
                if (typeof content === 'string') {
                    const importedChats = JSON.parse(content);
                    setState((prev) => ({
                        ...prev,
                        chats: [...prev.chats, ...importedChats]
                    }));
                    showNotification('Chats imported successfully!', 'success');
                }
            };
            reader.readAsText(file);
        }
    };

    const renderMessage = (role, content) => {
        const htmlContent = marked(content);
        return `
      <div class="${role === 'user' ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'} p-2 rounded">
        <strong>${role === 'user' ? 'You' : 'Bot'}:</strong>
        ${hljs.highlightAuto(htmlContent).value}
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
            settings: initialState.settings
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
            settings: { ...prev.settings, darkMode: !prev.settings.darkMode }
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
    };


    return (
        <div className={`grid h-screen w-full pl-[53px] ${state.settings.darkMode ? 'dark' : ''}`}>
            <aside className="inset-y fixed left-0 z-20 flex h-full flex-col border-r dark: border-gray-800">
                <div className="border-b p-2 dark:border-gray-800">
                    <Button variant="outline" size="icon" aria-label="Home">
                        <Triangle className="size-5 fill-foreground" />
                    </Button>
                </div>
                <nav className="grid gap-1 p-2 overflow-y-auto">
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
                    {state.chats.map(chat => (
                        <TooltipProvider>
                            <Tooltip key={chat.id}>
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
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="mt-auto rounded-lg"
                                    aria-label="Settings"
                                >
                                    <Settings2 className="size-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={5}>
                                Settings
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </nav>
            </aside>
            <div className="flex flex-col">
                <header className="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4 dark:border-gray-800">
                    <h1 className="text-xl font-semibold">{currentChat?.name || 'Quantum Nexus'}</h1>
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Settings className="size-4" />
                                <span className="sr-only">Settings</span>
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
                                {/* Settings content */}
                            </div>
                        </DrawerContent>
                    </Drawer>
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
                                    <Download className="size-3.5" />
                                    Download Transcript
                                </Button>
                            </>
                        )}
                    </div>
                </header>
                <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="relative hidden flex-col items-start gap-8 md:flex">
                        <form className="grid w-full items-start gap-6">
                            <fieldset className="grid gap-6 rounded-lg border p-4 dark:border-gray-800">
                                <legend className="-ml-1 px-1 text-sm font-medium">
                                    Settings
                                </legend>
                                <div className="grid gap-3">
                                    <Label htmlFor="api-key">API Key</Label>
                                    <Input
                                        id="api-key"
                                        type="password"
                                        value={state.apiKey}
                                        onChange={(e) => saveApiKey(e.target.value)}
                                        placeholder="Enter your GROQ API key"
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="model">Model</Label>
                                    <Select
                                        value={state.settings.model}
                                        onValueChange={(value) => setState(prev => ({
                                            ...prev,
                                            settings: { ...prev.settings, model: value }
                                        }))}
                                    >
                                        <SelectTrigger
                                            id="model"
                                            className="items-start [&_[data-description]]:hidden"
                                        >
                                            <SelectValue placeholder="Select a model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="llama2-70b-4096">
                                                <div className="flex items-start gap-3 text-muted-foreground">
                                                    <Rabbit className="size-5" />
                                                    <div className="grid gap-0.5">
                                                        <p>
                                                            <span className="font-medium text-foreground">
                                                                LLaMA2 70B
                                                            </span>
                                                        </p>
                                                        <p className="text-xs" data-description>
                                                            Versatile model for general use cases.
                                                        </p>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="temperature">Temperature: {state.settings.temperature}</Label>
                                    <Slider
                                        id="temperature"
                                        min={0}
                                        max={1}
                                        step={0.1}
                                        value={[state.settings.temperature]}
                                        onValueChange={(value) => setState(prev => ({
                                            ...prev,
                                            settings: { ...prev.settings, temperature: value[0] }
                                        }))}
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
                                        onValueChange={(value) => setState(prev => ({
                                            ...prev,
                                            settings: { ...prev.settings, maxTokens: value[0] }
                                        }))}
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
                                        onValueChange={(value) => setState(prev => ({
                                            ...prev,
                                            settings: { ...prev.settings, topP: value[0] }
                                        }))}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="top-k">Top K: {state.settings.topK}</Label>
                                    <Slider
                                        id="top-k"
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={[state.settings.topK]}
                                        onValueChange={(value) => setState(prev => ({
                                            ...prev,
                                            settings: { ...prev.settings, topK: value[0] }
                                        }))}
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="stream"
                                        checked={state.settings.stream}
                                        onCheckedChange={(checked) => setState(prev => ({
                                            ...prev,
                                            settings: { ...prev.settings, stream: checked }
                                        }))}
                                    />
                                    <Label htmlFor="stream">Stream responses</Label>
                                </div>
                                <Button onClick={resetSettings}>Reset to Defaults</Button>
                            </fieldset>
                            <fieldset className="grid gap-6 rounded-lg border p-4 dark:border-gray-800">
                                <legend className="-ml-1 px-1 text-sm font-medium">
                                    System Message
                                </legend>
                                <div className="grid gap-3">
                                    <Label htmlFor="system-message">System Message</Label>
                                    <Textarea
                                        id="system-message"
                                        placeholder="You are a helpful assistant..."
                                        className="min-h-[9.5rem]"
                                        value={state.systemPrompt}
                                        onChange={(e) => setSystemPrompt(e.target.value)}
                                    />
                                </div>
                            </fieldset>
                        </form>
                    </div>
                    <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2 dark:bg-gray-800/50">
                        <Badge variant="outline" className="absolute right-3 top-3">
                            Chat
                        </Badge>
                        <div ref={chatContainerRef} className="flex-1 overflow-auto space-y-4">
                            {currentChat?.messages.map((message) => (
                                <div key={message.id} dangerouslySetInnerHTML={{ __html: renderMessage(message.role, message.content) }} />
                            ))}
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring mt-4 dark:border-gray-700"
                        >
                            <Label htmlFor="message" className="sr-only">
                                Message
                            </Label>
                            <Textarea
                                id="message"
                                placeholder="Type your message here..."
                                className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <div className="flex items-center p-3 pt-0">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Paperclip className="size-4" />
                                                <span className="sr-only">Attach file</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">Attach File</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={startVoiceInput}>
                                                <Mic className="size-4" />
                                                <span className="sr-only">Use Microphone</span>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">Use Microphone</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <Button type="submit" size="sm" className="ml-auto gap-1.5" disabled={isLoading || !state.apiKey}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <CornerDownLeft className="size-3.5" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div >
    )
}