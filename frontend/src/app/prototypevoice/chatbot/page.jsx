'use client'
import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, Mic, MicOff } from "lucide-react"
import { toast, Toaster } from 'react-hot-toast'

const Message = ({ role, content }) => (
    <div
        className={`mb-4 p-4 rounded-lg ${role === 'user'
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto'
            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
            } max-w-[80%] ${role === 'user' ? 'ml-auto' : 'mr-auto'} shadow-lg`}
    >
        <p className="whitespace-pre-wrap">{content}</p>
    </div>
)

export default function ChatComponent() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [apiSelection, setApiSelection] = useState('ollama')
    const [apiKey, setApiKey] = useState('')
    const [isListening, setIsListening] = useState(false)
    const scrollAreaRef = useRef(null)
    const recognition = useRef(null)

    useEffect(() => {
        if (apiSelection === 'groq')
        {
            const storedApiKey = localStorage.getItem('groqApiKey') || ''
            setApiKey(storedApiKey)
        }

        if ('webkitSpeechRecognition' in window)
        {
            recognition.current = new window.webkitSpeechRecognition()
            recognition.current.continuous = true
            recognition.current.interimResults = true

            recognition.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0])
                    .map(result => result.transcript)
                    .join('')

                setInput(prevInput => prevInput + ' ' + transcript)
            }

            recognition.current.onerror = (event) => {
                console.error('Speech recognition error', event.error)
                setIsListening(false)
            }
        }

        return () => {
            if (recognition.current)
            {
                recognition.current.stop()
            }
        }
    }, [apiSelection])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        if (scrollAreaRef.current)
        {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
    }

    const handleApiKeyChange = (e) => {
        const key = e.target.value
        setApiKey(key)
        localStorage.setItem('groqApiKey', key)
    }

    const toggleListening = () => {
        if (isListening)
        {
            recognition.current.stop()
        } else
        {
            recognition.current.start()
        }
        setIsListening(!isListening)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!input.trim()) return

        const userMessage = { role: 'user', content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setLoading(true)

        try
        {
            let res, data

            if (apiSelection === 'ollama')
            {
                res = await fetch('http://localhost:11434/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: "llama3.1",
                        messages: [
                            { "role": "system", "content": "You are a very intellectual programmer and you are very good at programming. You're just going to answer in a programming way." },
                            userMessage
                        ],
                        stream: false
                    }),
                })
            } else if (apiSelection === 'groq')
            {
                res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        model: "llama-3.2-90b-text-preview",
                        messages: [
                            { "role": "system", "content": "You are a very intellectual programmer and you are very good at programming. You're just going to answer in a programming way." },
                            userMessage
                        ],
                        temperature: 1,
                        max_tokens: 1024,
                        top_p: 1,
                        stream: false,
                        stop: null
                    }),
                })
            }

            if (!res.ok)
            {
                const errorData = await res.json()
                throw new Error(errorData.error || 'Failed to fetch')
            }

            data = await res.json()

            let assistantMessage
            if (apiSelection === 'ollama')
            {
                assistantMessage = { role: 'assistant', content: data.message.content }
            } else if (apiSelection === 'groq')
            {
                if (data.choices && data.choices.length > 0 && data.choices[0].message)
                {
                    assistantMessage = { role: 'assistant', content: data.choices[0].message.content }
                } else
                {
                    throw new Error('Unexpected response structure from Groq API')
                }
            }

            setMessages(prev => [...prev, assistantMessage])
        } catch (error)
        {
            console.error('Error:', error)
            toast.error(`Error: ${error.message}`, {
                duration: 5000,
                position: 'top-right',
            })
            const errorMessage = { role: 'assistant', content: 'An error occurred while fetching the response.' }
            setMessages(prev => [...prev, errorMessage])
        } finally
        {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-3xl mx-auto h-[700px] flex flex-col bg-gradient-to-b from-gray-50 to-white shadow-2xl rounded-xl overflow-hidden">
            <Toaster />
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-6">
                <CardTitle className="text-2xl font-bold text-center">AI Chat Interface</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden p-6 flex flex-col">
                <div className="mb-4 flex justify-between items-center">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Select API:</label>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="ollama"
                                    checked={apiSelection === 'ollama'}
                                    onChange={() => setApiSelection('ollama')}
                                    className="form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2">Ollama</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="groq"
                                    checked={apiSelection === 'groq'}
                                    onChange={() => setApiSelection('groq')}
                                    className="form-radio h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2">Groq</span>
                            </label>
                        </div>
                    </div>
                    {apiSelection === 'groq' && (
                        <div className="flex-grow ml-4">
                            <label className="block text-gray-700 font-semibold mb-2">Groq API Key:</label>
                            <Input
                                type="password"
                                placeholder="Enter your Groq API Key"
                                value={apiKey}
                                onChange={handleApiKeyChange}
                                className="w-full bg-white border-2 border-blue-300 focus:border-blue-500 rounded px-4 py-2"
                            />
                        </div>
                    )}
                </div>
                <ScrollArea className="flex-grow mb-4 pr-4" ref={scrollAreaRef}>
                    {messages.map((message, index) => (
                        <Message key={index} role={message.role} content={message.content} />
                    ))}
                    {loading && (
                        <div className="flex justify-center items-center h-8">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
            <CardFooter className="bg-gray-100 p-4">
                <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                    <Input
                        placeholder="Type your message here..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-grow bg-white border-2 border-blue-300 focus:border-blue-500 rounded-full px-4 py-2"
                    />
                    <Button
                        type="button"
                        onClick={toggleListening}
                        className={`rounded-full p-2 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                        {isListening ? <MicOff className="h-5 w-5 text-white" /> : <Mic className="h-5 w-5 text-white" />}
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading || (apiSelection === 'groq' && !apiKey.trim())}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-6 py-2 transition-all duration-200 ease-in-out transform hover:scale-105 flex items-center"
                    >
                        {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Send className="h-5 w-5 mr-2" />}
                        Send
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}