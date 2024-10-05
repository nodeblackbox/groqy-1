"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Send, VolumeX, Volume2, Loader2, Settings } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';


// {
//   "apikey": "eJ4Gu4w-wa4tCM92yosuZkikDP8wqrGv5r9Y21sWtkwx",
//   "iam_apikey_description": "Auto-generated for key crn:v1:bluemix:public:conversation:au-syd:a/0a4fcd1e81d249e18569d6133d43cb46:89006535-2693-4af5-a108-19e803647662:resource-key:c8e3781e-336d-4579-b80f-76963f0568f4",
//   "iam_apikey_id": "ApiKey-f006a7cc-3d70-4a02-ae62-eab74a1acae1",
//   "iam_apikey_name": "Auto-generated service credentials",
//   "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Manager",
//   "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/0a4fcd1e81d249e18569d6133d43cb46::serviceid:ServiceId-49cde297-2159-4939-97ad-01a9c79e16f3",
//   "url": "https://api.au-syd.assistant.watson.cloud.ibm.com/instances/89006535-2693-4af5-a108-19e803647662"
// }


const API_KEY_LOCAL_STORAGE_KEY = 'watsonApiKey';
const API_URL_LOCAL_STORAGE_KEY = 'watsonApiUrl';
const ASSISTANT_ID_LOCAL_STORAGE_KEY = 'watsonAssistantId';

export default function WatsonAssistant() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [session, setSession] = useState(null);
    const [apiKey, setApiKey] = useState("");
    const [apiUrl, setApiUrl] = useState("");
    const [assistantId, setAssistantId] = useState("");
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);

    const recognitionRef = useRef(null);
    const synthRef = useRef(null);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        // Load settings from environment variables or local storage
        const envApiKey = process.env.REACT_APP_WATSON_API_KEY;
        const envApiUrl = process.env.REACT_APP_WATSON_API_URL;
        const envAssistantId = process.env.REACT_APP_WATSON_ASSISTANT_ID;

        setApiKey(localStorage.getItem(API_KEY_LOCAL_STORAGE_KEY) || envApiKey || "");
        setApiUrl(localStorage.getItem(API_URL_LOCAL_STORAGE_KEY) || envApiUrl || "");
        setAssistantId(localStorage.getItem(ASSISTANT_ID_LOCAL_STORAGE_KEY) || envAssistantId || "");

        // Load messages from local storage
        const savedMessages = localStorage.getItem('watsonMessages');
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }

        // Initialize Web Speech API for Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.onresult = handleSpeechResult;
            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                toast.error(`Speech recognition error: ${event.error}`);
                setIsListening(false);
            };
        } else {
            toast.error('Speech recognition not supported in this browser.');
        }

        // Initialize Web Speech API for Speech Synthesis
        if ('speechSynthesis' in window) {
            synthRef.current = window.speechSynthesis;
            loadVoices();
            if (synthRef.current.onvoiceschanged !== undefined) {
                synthRef.current.onvoiceschanged = loadVoices;
            }
        } else {
            toast.error('Text-to-speech not supported in this browser.');
        }

        // Create a new session
        if (apiKey && apiUrl && assistantId) {
            createSession();
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (synthRef.current) {
                synthRef.current.cancel();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        localStorage.setItem('watsonMessages', JSON.stringify(messages));
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const loadVoices = () => {
        if (synthRef.current) {
            const availableVoices = synthRef.current.getVoices();
            setVoices(availableVoices);
            // Set default voice
            if (availableVoices.length > 0 && !selectedVoice) {
                setSelectedVoice(availableVoices[0].name);
            }
        }
    };

    const createSession = async () => {
        if (!apiKey || !apiUrl || !assistantId) return;

        try {
            const response = await fetch(`${apiUrl}/v2/assistants/${assistantId}/sessions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setSession(data.session_id);
        } catch (error) {
            console.error('Error creating session:', error);
            toast.error('Failed to create session. Please check your API credentials.');
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || !session) return;

        const userMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch(`${apiUrl}/v2/assistants/${assistantId}/sessions/${session}/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    input: { text: input },
                    context: {}
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const assistantMessage = data.output.generic.find(item => item.response_type === 'text')?.text || "I'm sorry, I didn't understand that.";
            const assistantMessageObj = { role: 'assistant', content: assistantMessage };
            setMessages([...newMessages, assistantMessageObj]);

            if (isSpeaking) {
                speak(assistantMessage);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSpeechResult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
    };

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
            setIsListening(true);
            toast.success('Listening...');
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            toast.success('Stopped listening.');
        }
    };

    const toggleSpeech = () => {
        if (synthRef.current) {
            if (isSpeaking) {
                synthRef.current.cancel();
                setIsSpeaking(false);
            } else {
                setIsSpeaking(true);
            }
        } else {
            toast.error('Text-to-speech not supported.');
        }
    };

    const speak = (text) => {
        if (synthRef.current && selectedVoice) {
            const utterance = new SpeechSynthesisUtterance(text);
            const voice = voices.find(v => v.name === selectedVoice);
            if (voice) {
                utterance.voice = voice;
            }
            synthRef.current.speak(utterance);
        }
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const saveSettings = () => {
        if (!apiKey || !apiUrl || !assistantId) {
            toast.error('All fields are required.');
            return;
        }

        localStorage.setItem(API_KEY_LOCAL_STORAGE_KEY, apiKey);
        localStorage.setItem(API_URL_LOCAL_STORAGE_KEY, apiUrl);
        localStorage.setItem(ASSISTANT_ID_LOCAL_STORAGE_KEY, assistantId);
        createSession();
        toast.success('Settings saved and session created.');
    };

    const handleVoiceChange = (e) => {
        setSelectedVoice(e.target.value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-200 flex items-center justify-center p-4">
            <Toaster />
            <Card className="w-full max-w-4xl mx-auto shadow-xl">
                <Tabs defaultValue="chat" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="chat" className="text-lg font-semibold">Chat</TabsTrigger>
                        <TabsTrigger value="settings" className="text-lg font-semibold">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="chat" className="p-0">
                        <div className="h-[70vh] flex flex-col">
                            <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
                                {messages.map((message, index) => (
                                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-3 rounded-lg ${message.role === 'user' ? 'bg-pink-500 text-white' : 'bg-white text-gray-800'
                                            } shadow-md relative`}>
                                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                            {message.role === 'assistant' && (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="absolute bottom-0 right-0 translate-x-full translate-y-full"
                                                    onClick={() => speak(message.content)}
                                                    aria-label="Speak"
                                                >
                                                    <Volume2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-white border-t">
                                <div className="flex items-end space-x-2">
                                    <div className="flex-grow">
                                        <textarea
                                            value={input}
                                            onChange={handleInputChange}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Type your message..."
                                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none overflow-hidden"
                                            style={{ minHeight: '40px', maxHeight: '120px' }}
                                        />
                                    </div>
                                    <Button onClick={sendMessage} disabled={isLoading} className="bg-pink-500 hover:bg-pink-600">
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    </Button>
                                    <Button onClick={isListening ? stopListening : startListening} className={`bg-purple-500 hover:bg-purple-600 ${isListening ? 'animate-pulse' : ''}`}>
                                        <Mic className={`h-4 w-4 ${isListening ? 'text-red-500' : ''}`} />
                                    </Button>
                                    <Button onClick={toggleSpeech} className="bg-blue-500 hover:bg-blue-600">
                                        {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                    </Button>
                                </div>
                                {isSpeaking && (
                                    <div className="mt-2">
                                        <label htmlFor="voiceSelect" className="block text-sm font-medium text-gray-700">Select Voice:</label>
                                        <select
                                            id="voiceSelect"
                                            value={selectedVoice}
                                            onChange={handleVoiceChange}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
                                        >
                                            {voices.map((voice, index) => (
                                                <option key={index} value={voice.name}>{voice.name} ({voice.lang})</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="settings">
                        <CardContent className="space-y-4">
                            <div>
                                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">API Key</label>
                                <Input
                                    id="apiKey"
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="mt-1"
                                    placeholder="Enter your Watson API Key"
                                />
                            </div>
                            <div>
                                <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700">API URL</label>
                                <Input
                                    id="apiUrl"
                                    type="url"
                                    value={apiUrl}
                                    onChange={(e) => setApiUrl(e.target.value)}
                                    className="mt-1"
                                    placeholder="https://api.us-south.assistant.watson.cloud.ibm.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="assistantId" className="block text-sm font-medium text-gray-700">Assistant ID</label>
                                <Input
                                    id="assistantId"
                                    value={assistantId}
                                    onChange={(e) => setAssistantId(e.target.value)}
                                    className="mt-1"
                                    placeholder="Enter your Assistant ID"
                                />
                            </div>
                            <Button onClick={saveSettings} className="w-full bg-green-500 hover:bg-green-600">
                                <Settings className="h-4 w-4 mr-2" /> Save Settings
                            </Button>
                            <p className="text-xs text-gray-500">
                                Don't have API credentials? <a href="https://cloud.ibm.com/apidocs/assistant" target="_blank" rel="noopener noreferrer" className="text-pink-500 underline">Get them here</a>.
                            </p>
                        </CardContent>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}
