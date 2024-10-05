
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Send, VolumeX, Volume2, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const EnhancedSpeechAssistant = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [interactions, setInteractions] = useState([]);

    const recognitionRef = useRef(null);
    const synthRef = useRef(null);
    const audioRef = useRef(null);
    const chatContainerRef = useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window)
        {
            recognitionRef.current = new window.webkitSpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.onresult = handleSpeechResult;
            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                toast.error(`Speech recognition error: ${event.error}`);
                setIsListening(false);
            };
        } else
        {
            toast.error('Speech recognition not supported in this browser.');
        }

        if ('speechSynthesis' in window)
        {
            synthRef.current = window.speechSynthesis;
            loadVoices();
            if (synthRef.current.onvoiceschanged !== undefined)
            {
                synthRef.current.onvoiceschanged = loadVoices;
            }
        } else
        {
            toast.error('Text-to-speech not supported in this browser.');
        }

        audioRef.current = new Audio();

        return () => {
            if (recognitionRef.current)
            {
                recognitionRef.current.stop();
            }
            if (synthRef.current)
            {
                synthRef.current.cancel();
            }
            if (audioRef.current)
            {
                audioRef.current.pause();
            }
        };
    }, []);

    useEffect(() => {
        if (chatContainerRef.current)
        {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const loadVoices = () => {
        if (synthRef.current)
        {
            const availableVoices = synthRef.current.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0 && !selectedVoice)
            {
                setSelectedVoice(availableVoices[0].name);
            }
        }
    };

    const handleSpeechResult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i)
        {
            if (event.results[i].isFinal)
            {
                finalTranscript += event.results[i][0].transcript;
                addInteraction('speech', finalTranscript);
            } else
            {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        setInput(finalTranscript || interimTranscript);
    };

    const addInteraction = (type, content, correctedContent) => {
        const newInteraction = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type,
            content,
            correctedContent
        };
        setInteractions(prev => [...prev, newInteraction]);
    };

    const startListening = () => {
        if (recognitionRef.current && !isListening)
        {
            recognitionRef.current.start();
            setIsListening(true);
            toast.success('Listening...');
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening)
        {
            recognitionRef.current.stop();
            setIsListening(false);
            toast.success('Stopped listening.');
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        addInteraction('text', input);
        const userMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try
        {
            const response = await fetch('/api/openai/v1/speak', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: input,
                    model: 'eleven_monolingual_v1'
                }),
            });

            if (!response.ok)
            {
                throw new Error('Failed to get response from API');
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            const assistantMessage = { role: 'assistant', content: 'Audio response received' };
            setMessages([...newMessages, assistantMessage]);

            if (isSpeaking && audioRef.current)
            {
                audioRef.current.src = audioUrl;
                audioRef.current.play();
            }
        } catch (error)
        {
            console.error('Error processing message:', error);
            toast.error('Failed to process message. Please try again.');
        } finally
        {
            setIsLoading(false);
        }
    };

    const toggleSpeech = () => {
        setIsSpeaking(!isSpeaking);
        if (isSpeaking && audioRef.current)
        {
            audioRef.current.pause();
        }
    };

    const speak = (text) => {
        if (synthRef.current && selectedVoice)
        {
            const utterance = new SpeechSynthesisUtterance(text);
            const voice = voices.find(v => v.name === selectedVoice);
            if (voice)
            {
                utterance.voice = voice;
            }
            synthRef.current.speak(utterance);
        }
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey)
        {
            e.preventDefault();
            sendMessage();
        }
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
                        <TabsTrigger value="interactions" className="text-lg font-semibold">Interactions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="chat" className="p-0">
                        <div className="h-[70vh] flex flex-col">
                            <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
                                {messages.map((message, index) => (
                                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-3 rounded-lg ${message.role === 'user' ? 'bg-pink-500 text-white' : 'bg-white text-gray-800'} shadow-md relative`}>
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
                                            value={selectedVoice || ''}
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
                    <TabsContent value="interactions">
                        <CardContent>
                            <Table>
                                <TableCaption>A list of your recent interactions</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Timestamp</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Content</TableHead>
                                        <TableHead>Corrected Content</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {interactions.map((interaction) => (
                                        <TableRow key={interaction.id}>
                                            <TableCell>{new Date(interaction.timestamp).toLocaleString()}</TableCell>
                                            <TableCell>{interaction.type}</TableCell>
                                            <TableCell>{interaction.content}</TableCell>
                                            <TableCell>{interaction.correctedContent || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
};

export default EnhancedSpeechAssistant;