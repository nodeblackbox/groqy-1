'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"

// Utility function to generate random IDs
const generateRandomId = () => `id_${Math.floor(Math.random() * 1000000)}`

export default function Chatbot() {
    // State variables
    const [messages, setMessages] = useState([
        { role: 'bot', content: "Hello! I'm GravBot. How can I assist you today?" }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef(null)

    const BASE_URL = "http://localhost:8000"

    // Function to add a message to the chat
    const addMessage = (role, content) => {
        setMessages(prev => [...prev, { role, content }])
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!input.trim()) return

        // Add user message
        addMessage('user', input)
        setIsLoading(true)

        // Generate random IDs
        const objective_id = generateRandomId()
        const task_id = generateRandomId()

        try
        {
            // 1. Create Memory with User Message
            const createMemoryPayload = {
                content: input,
                metadata: {
                    objective_id,
                    task_id
                }
            }

            const createMemoryResponse = await fetch(`${BASE_URL}/gravrag/create_memory`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createMemoryPayload)
            })

            if (!createMemoryResponse.ok)
            {
                const errorData = await createMemoryResponse.json()
                throw new Error(errorData.error || 'Failed to create memory.')
            }

            addMessage('bot', "Memory created successfully.")

            // 2. Recall Memories Related to User Message
            const recallPayload = {
                query: input,
                top_k: 3
            }

            const recallResponse = await fetch(`${BASE_URL}/gravrag/recall_memory`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(recallPayload)
            })

            if (!recallResponse.ok)
            {
                const errorData = await recallResponse.json()
                throw new Error(errorData.error || 'Failed to recall memories.')
            }

            const recalledData = await recallResponse.json()
            const memories = recalledData.memories || []

            addMessage('bot', "Memories recalled successfully.")

            // 3. Route Query to Neural Resources API
            const routeQueryPayload = {
                content: input,
                model: 'llama3.1:latest' // Specify the model as needed
            }

            const routeQueryResponse = await fetch(`${BASE_URL}/neural_resources/route_query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(routeQueryPayload)
            })

            if (!routeQueryResponse.ok)
            {
                const errorData = await routeQueryResponse.json()
                throw new Error(errorData.error || 'Failed to route query.')
            }

            addMessage('bot', "Query routed successfully.")

            // 4. Generate AI Response with Context from Memories
            const context = memories.map(mem => mem.content).join("\n")
            const aiPayload = {
                prompt: `${context}\nUser: ${input}\nAI:`,
                max_tokens: 150
            }

            const aiResponse = await fetch(`${BASE_URL}/ai_model/generate_response`, { // Replace with actual AI model endpoint
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aiPayload)
            })

            if (!aiResponse.ok)
            {
                const errorData = await aiResponse.json()
                throw new Error(errorData.error || 'Failed to generate AI response.')
            }

            const aiData = await aiResponse.json()
            const aiMessage = aiData.response || "I'm sorry, I couldn't generate a response."

            // 5. Create Memory with AI Response
            const createAIResponsePayload = {
                content: aiMessage,
                metadata: {
                    objective_id: generateRandomId(),
                    task_id: generateRandomId()
                }
            }

            const createAIResponse = await fetch(`${BASE_URL}/gravrag/create_memory`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(createAIResponsePayload)
            })

            if (!createAIResponse.ok)
            {
                const errorData = await createAIResponse.json()
                throw new Error(errorData.error || 'Failed to create AI memory.')
            }

            addMessage('bot', aiMessage)

        } catch (error)
        {
            console.error(error)
            addMessage('bot', `Error: ${error.message}`)
        } finally
        {
            setIsLoading(false)
        }
    }

    // Auto-scroll to the latest message
    useEffect(() => {
        if (scrollRef.current)
        {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    return (
        <Card className="w-full max-w-4xl mx-auto my-8">
            <CardHeader>
                <CardTitle>GravBot Chatbot</CardTitle>
            </CardHeader>
            <CardContent>
                {/* Chat Messages */}
                <ScrollArea className="h-[500px] p-4 border rounded mb-4" ref={scrollRef}>
                    {messages.map((message, index) => (
                        <div key={index} className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <span className={`inline-block p-2 rounded-lg max-w-xs break-words ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                                }`}>
                                {message.content}
                            </span>
                        </div>
                    ))}
                </ScrollArea>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <Input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-1"
                        required
                    />
                    <Button type="submit" disabled={isLoading} className="whitespace-nowrap">
                        {isLoading ? 'Sending...' : 'Send'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
