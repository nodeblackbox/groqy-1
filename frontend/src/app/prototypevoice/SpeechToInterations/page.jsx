'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Loader2, Send, Volume2, RefreshCcw, StopCircle } from 'lucide-react'
import { toast, Toaster } from 'react-hot-toast'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function VoiceEnabledLLMInteractions() {
    const [input, setInput] = useState("")
    const [isListening, setIsListening] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isPlayingAudio, setIsPlayingAudio] = useState(false)
    const [interactions, setInteractions] = useState([])
    const [voices, setVoices] = useState([])
    const [selectedVoice, setSelectedVoice] = useState('')
    const [conversationContext, setConversationContext] = useState([])

    const recognitionRef = useRef(null)
    const audioRef = useRef(new Audio())
    const abortControllerRef = useRef(null)

    useEffect(() => {
        setupSpeechRecognition()
        fetchVoices()

        return () => {
            if (recognitionRef.current)
            {
                recognitionRef.current.stop()
            }
            if (audioRef.current)
            {
                audioRef.current.pause()
                audioRef.current.src = ""
            }
            if (abortControllerRef.current)
            {
                abortControllerRef.current.abort()
            }
        }
    }, [])

    const fetchVoices = async () => {
        try
        {
            const response = await fetch('/api/openai/v1/voices')
            if (response.ok)
            {
                const data = await response.json()
                setVoices(data.voices)
                if (data.voices.length > 0)
                {
                    setSelectedVoice(data.voices[0].voice_id)
                }
            } else
            {
                throw new Error('Failed to fetch voices')
            }
        } catch (err)
        {
            console.error('Error fetching voices:', err)
            toast.error('An error occurred while fetching voices.')
        }
    }

    const setupSpeechRecognition = () => {
        if ('webkitSpeechRecognition' in window)
        {
            recognitionRef.current = new window.webkitSpeechRecognition()
            recognitionRef.current.continuous = false
            recognitionRef.current.interimResults = false
            recognitionRef.current.onresult = handleSpeechResult
            recognitionRef.current.onerror = handleSpeechError
            recognitionRef.current.onend = () => setIsListening(false)
        } else
        {
            toast.error('Speech recognition not supported in this browser.')
        }
    }

    const handleSpeechResult = (event) => {
        const finalTranscript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('')

        setInput(finalTranscript)
        handleUserInput(finalTranscript, 'speech')
    }

    const handleSpeechError = (event) => {
        console.error('Speech recognition error', event.error)
        toast.error(`Speech recognition error: ${event.error}`)
        setIsListening(false)
    }

    const addInteraction = (type, content, role = 'user') => {
        const newInteraction = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type,
            content,
            role
        }
        setInteractions(prev => [...prev, newInteraction])
        setConversationContext(prev => [...prev, { role, content }])
    }

    const startListening = () => {
        if (recognitionRef.current && !isListening)
        {
            recognitionRef.current.start()
            setIsListening(true)
            toast.success('Listening...')
        }
    }

    const stopListening = () => {
        if (recognitionRef.current && isListening)
        {
            recognitionRef.current.stop()
            setIsListening(false)
            toast.success('Stopped listening.')
        }
    }

    const handleInputChange = (e) => {
        setInput(e.target.value)
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey)
        {
            e.preventDefault()
            handleUserInput(input, 'text')
        }
    }

    const handleUserInput = useCallback(async (content, type) => {
        if (!content.trim()) return

        addInteraction(type, content)
        setInput("")
        setIsLoading(true)

        if (abortControllerRef.current)
        {
            abortControllerRef.current.abort()
        }
        abortControllerRef.current = new AbortController()

        try
        {
            const response = await fetch('/api/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                      ...conversationContext,
                      { role: "user", content }
                  ],
                  model: "llama-3.1-8b-instant"
              }),
                signal: abortControllerRef.current.signal
            })

            if (!response.ok)
            {
                throw new Error(`Failed to get response from API. Status: ${response.status}`)
            }

            const data = await response.json()

            if (!data.choices || data.choices.length === 0 || !data.choices[0].message)
            {
                throw new Error('Invalid response format from LLM API')
            }

            const assistantResponse = data.choices[0].message.content
            addInteraction('llm', assistantResponse, 'assistant')

            await playVoiceResponse(assistantResponse)
        } catch (error)
        {
            if (error.name === 'AbortError')
            {
                console.log('Request was aborted')
            } else
            {
                console.error('Error in handleUserInput:', error)
                toast.error(`Failed to process message: ${error.message}`)
            }
        } finally
        {
            setIsLoading(false)
        }
    }, [conversationContext, selectedVoice])

    const playVoiceResponse = useCallback(async (text) => {
        if (!text || !selectedVoice)
        {
            console.error('Text or voice model not provided for text-to-speech')
            toast.error('Unable to play voice response. Missing text or voice model.')
            return
        }

        setIsPlayingAudio(true)
        try
        {
            const response = await fetch('/api/openai/v1/text-to-speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, model: selectedVoice }),
            })

            if (!response.ok)
            {
                const errorText = await response.text()
                throw new Error(`Failed to synthesize speech. Status: ${response.status}, Error: ${errorText}`)
            }

            const blob = await response.blob()

            if (blob.size === 0)
            {
                throw new Error('Received empty audio blob')
            }

            const audioUrl = URL.createObjectURL(blob)
            audioRef.current.src = audioUrl
            await audioRef.current.play()
        } catch (error)
        {
            console.error('Error in playVoiceResponse:', error)
            toast.error(`Failed to play voice response: ${error.message}`)
        } finally
        {
            setIsPlayingAudio(false)
        }
    }, [selectedVoice])

    const stopPlayback = () => {
        if (audioRef.current)
        {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
            setIsPlayingAudio(false)
            toast('Playback stopped.')
        }
    }

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
                            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Select a voice" />
                                </SelectTrigger>
                                <SelectContent>
                                    {voices.map((voice) => (
                                        <SelectItem key={voice.voice_id} value={voice.voice_id}>
                                            {voice.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                <Button
                                    onClick={stopPlayback}
                                    disabled={!isPlayingAudio}
                                    className="bg-red-500 hover:bg-red-600"
                                >
                                    <StopCircle className="h-4 w-4" />
                                    Stop Playback
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
                                            <Button
                                                onClick={() => playVoiceResponse(interaction.content)}
                                                className="bg-blue-500 hover:bg-blue-600"
                                            >
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
    )
}