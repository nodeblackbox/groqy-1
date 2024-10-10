"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Loader2, Send, Volume2 } from 'lucide-react';
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

const VoiceEnabledLLMInteractions = () => {
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [interactions, setInteractions] = useState([]);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState('');

    const recognitionRef = useRef(null);
    const audioRef = useRef(new Audio());

    useEffect(() => {
        fetchVoices();
        setupSpeechRecognition();

        return () => {
            if (recognitionRef.current)
            {
                recognitionRef.current.stop();
            }
            if (audioRef.current)
            {
                audioRef.current.pause();
            }
        };
    }, []);

    const fetchVoices = async () => {
        try
        {
            const response = await fetch('/api/openai/v1/voices');
            if (response.ok)
            {
                const data = await response.json();
                setVoices(data.voices);
                if (data.voices.length > 0)
                {
                    setSelectedVoice(data.voices[0].voice_id);
                }
            } else
            {
                toast.error('Failed to fetch voices.');
            }
        } catch (err)
        {
            console.error('Error fetching voices:', err);
            toast.error('An error occurred while fetching voices.');
        }
    };

    const setupSpeechRecognition = () => {
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
    };

    const handleSpeechResult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i)
        {
            if (event.results[i].isFinal)
            {
                finalTranscript += event.results[i][0].transcript;
                handleUserInput(finalTranscript, 'speech');
            } else
            {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        setInput(finalTranscript || interimTranscript);
    };

    const addInteraction = (type, content, role = 'user') => {
        const newInteraction = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type,
            content,
            role
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

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey)
        {
            e.preventDefault();
            handleUserInput(input, 'text');
        }
    };

    const handleUserInput = async (content, type) => {
        if (!content.trim()) return;

        addInteraction(type, content);
        setInput("");
        setIsLoading(true);

        try
        {
            const response = await fetch('http://localhost:3000/api/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Custom-Header': 'Custom Header Value'
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "user",
                            content: content
                        }
                    ],
                    model: "llama-3.1-8b-instant"
                })
            });

            if (!response.ok)
            {
                throw new Error('Failed to get response from API');
            }

            const data = await response.json();
            const assistantResponse = data.choices[0].message.content;
            addInteraction('llm', assistantResponse, 'assistant');
            playVoiceResponse(assistantResponse);
        } catch (error)
        {
            console.error('Error processing message:', error);
            toast.error('Failed to process message. Please try again.');
        } finally
        {
            setIsLoading(false);
        }
    };

    const playVoiceResponse = async (text) => {
        try
        {
            const response = await fetch('/api/text-to-speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, model: selectedVoice }),
            });

            if (response.ok)
            {
                const blob = await response.blob();
                const audioUrl = URL.createObjectURL(blob);
                audioRef.current.src = audioUrl;
                audioRef.current.play();
            } else
            {
                throw new Error('Failed to synthesize speech');
            }
        } catch (error)
        {
            console.error('Error playing voice response:', error);
            toast.error('Failed to play voice response.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-pink-100 to-purple-200 flex items-center justify-center p-4">
            <Toaster />
            <Card className="w-full max-w-4xl mx-auto shadow-xl">
                <CardContent className="p-6">
                    <div className="mb-4">
                        <textarea
                            value={input}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Type or speak your message..."
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none overflow-hidden"
                            style={{ minHeight: '40px', maxHeight: '120px' }}
                        />
                        <div className="mt-2 flex justify-between items-center">
                            <select
                                value={selectedVoice}
                                onChange={(e) => setSelectedVoice(e.target.value)}
                                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                            >
                                {voices.map((voice) => (
                                    <option key={voice.voice_id} value={voice.voice_id}>
                                        {voice.name}
                                    </option>
                                ))}
                            </select>
                            <div className="flex space-x-2">
                                <Button
                                    onClick={() => handleUserInput(input, 'text')}
                                    disabled={isLoading || !input.trim()}
                                    className="bg-pink-500 hover:bg-pink-600"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    Send
                                </Button>
                                <Button
                                    onClick={isListening ? stopListening : startListening}
                                    className={`bg-purple-500 hover:bg-purple-600 ${isListening ? 'animate-pulse' : ''}`}
                                >
                                    <Mic className={`h-4 w-4 ${isListening ? 'text-red-500' : ''}`} />
                                    {isListening ? 'Stop' : 'Start'} Listening
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Table>
                        <TableCaption>A list of your recent interactions</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Content</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {interactions.map((interaction) => (
                                <TableRow key={interaction.id}>
                                    <TableCell>{new Date(interaction.timestamp).toLocaleString()}</TableCell>
                                    <TableCell>{interaction.type}</TableCell>
                                    <TableCell>{interaction.role}</TableCell>
                                    <TableCell>{interaction.content}</TableCell>
                                    <TableCell>
                                        {interaction.role === 'assistant' && (
                                            <Button onClick={() => playVoiceResponse(interaction.content)} className="bg-blue-500 hover:bg-blue-600">
                                                <Volume2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default VoiceEnabledLLMInteractions;