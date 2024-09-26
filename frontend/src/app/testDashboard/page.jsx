'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const API_BASE_URL = 'http://localhost:8000'  // Adjust this to match your backend URL

export default function AIAssistant() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [selectedProvider, setSelectedProvider] = useState('')
    const [selectedModel, setSelectedModel] = useState('')
    const [availableProviders, setAvailableProviders] = useState([])
    const [availableModels, setAvailableModels] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchAvailableModels()
    }, [])

    const fetchAvailableModels = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/neural_resources/available_models`)
            if (response.ok) {
                const data = await response.json()
                setAvailableProviders(data.available_models)
                if (data.available_models.length > 0) {
                    setSelectedProvider(data.available_models[0])
                }
            }
        } catch (error) {
            setError('Error fetching available models: ' + error.message)
        }
    }

    useEffect(() => {
        if (selectedProvider) {
            // In a real implementation, you would fetch the available models for the selected provider
            // For this example, we'll use dummy data
            setAvailableModels(['gpt-3.5-turbo', 'gpt-4', 'claude-v1', 'claude-instant-v1'])
            setSelectedModel('gpt-3.5-turbo')
        }
    }, [selectedProvider])

    const handleSend = async () => {
        if (!input.trim()) return

        const newMessage = { content: input, is_user: true }
        setMessages([...messages, newMessage])
        setInput('')
        setIsLoading(true)
        setError(null)

        try {
            const response = await fetch(`${API_BASE_URL}/neural_resources/create_message/${selectedProvider}/${selectedModel}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: input }),
            })

            if (!response.ok) {
                throw new Error('Failed to get response')
            }

            const data = await response.json()
            const botMessage = { content: data.response, is_user: false }
            setMessages(prevMessages => [...prevMessages, botMessage])
        } catch (error) {
            setError('Error: ' + error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSetApiKey = async (event) => {
        event.preventDefault()
        const provider = event.target.provider.value
        const apiKey = event.target.apiKey.value
        setError(null)

        try {
            const response = await fetch(`${API_BASE_URL}/neural_resources/set_api_key`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ provider, api_key: apiKey }),
            })

            if (response.ok) {
                const data = await response.json()
                alert(data.message)
            } else {
                throw new Error('Failed to set API key')
            }
        } catch (error) {
            setError('Error setting API key: ' + error.message)
        }
    }

    const handleCollectData = async (event) => {
        event.preventDefault()
        const sourceType = event.target.sourceType.value
        const query = event.target.query.value
        const maxResults = parseInt(event.target.maxResults.value)
        setError(null)

        try {
            const response = await fetch(`${API_BASE_URL}/agentchef/collect_data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ source_type: sourceType, query, max_results: maxResults }),
            })

            if (response.ok) {
                const data = await response.json()
                alert(data.message)
            } else {
                throw new Error('Failed to collect data')
            }
        } catch (error) {
            setError('Error collecting data: ' + error.message)
        }
    }

    const handleStructureData = async (event) => {
        event.preventDefault()
        const structureData = JSON.parse(event.target.structureData.value)
        const templateName = event.target.templateName.value
        setError(null)

        try {
            const response = await fetch(`${API_BASE_URL}/agentchef/structure_data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: structureData, template_name: templateName }),
            })

            if (response.ok) {
                const data = await response.json()
                alert(data.message)
            } else {
                throw new Error('Failed to structure data')
            }
        } catch (error) {
            setError('Error structuring data: ' + error.message)
        }
    }

    const handleAugmentData = async (event) => {
        event.preventDefault()
        const inputFile = event.target.inputFile.value
        const numSamples = parseInt(event.target.numSamples.value)
        const agentName = event.target.agentName.value
        setError(null)

        try {
            const response = await fetch(`${API_BASE_URL}/agentchef/augment_data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input_file: inputFile, num_samples: numSamples, agent_name: agentName }),
            })

            if (response.ok) {
                const data = await response.json()
                alert(data.message)
            } else {
                throw new Error('Failed to augment data')
            }
        } catch (error) {
            setError('Error augmenting data: ' + error.message)
        }
    }

    const handlePushToHuggingFace = async (event) => {
        event.preventDefault()
        const filePath = event.target.filePath.value
        const repoId = event.target.repoId.value
        const token = event.target.token.value
        setError(null)

        try {
            const response = await fetch(`${API_BASE_URL}/agentchef/push_to_huggingface`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ file_path: filePath, repo_id: repoId, token }),
            })

            if (response.ok) {
                const data = await response.json()
                alert(data.message)
            } else {
                throw new Error('Failed to push to Hugging Face')
            }
        } catch (error) {
            setError('Error pushing to Hugging Face: ' + error.message)
        }
    }

    const handleCreateMemory = async (event) => {
        event.preventDefault()
        const content = event.target.memoryContent.value
        const objectiveId = event.target.objectiveId.value
        const taskId = event.target.taskId.value
        setError(null)

        try {
            const response = await fetch(`${API_BASE_URL}/gravrag/api/memory/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    metadata: {
                        objective_id: objectiveId,
                        task_id: taskId
                    }
                }),
            })

            if (response.ok) {
                const data = await response.json()
                alert(data.message)
            } else {
                throw new Error('Failed to create memory')
            }
        } catch (error) {
            setError('Error creating memory: ' + error.message)
        }
    }

    const handleRecallMemory = async (event) => {
        event.preventDefault()
        const query = event.target.recallQuery.value
        setError(null)

        try {
            const response = await fetch(`${API_BASE_URL}/gravrag/api/memory/recall?query=${encodeURIComponent(query)}`)

            if (response.ok) {
                const data = await response.json()
                alert(JSON.stringify(data.results, null, 2))
            } else {
                throw new Error('Failed to recall memory')
            }
        } catch (error) {
            setError('Error recalling memory: ' + error.message)
        }
    }

    const handlePruneMemory = async () => {
        setError(null)

        try {
            const response = await fetch(`${API_BASE_URL}/gravrag/api/memory/prune`, {
                method: 'POST',
            })

            if (response.ok) {
                const data = await response.json()
                alert(data.message)
            } else {
                throw new Error('Failed to prune memory')
            }
        } catch (error) {
            setError('Error pruning memory: ' + error.message)
        }
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="chat">
                    <TabsList>
                        <TabsTrigger value="chat">Chat</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                        <TabsTrigger value="agentchef">AgentChef</TabsTrigger>
                        <TabsTrigger value="gravrag">GravRAG</TabsTrigger>
                    </TabsList>
                    <TabsContent value="chat">
                        <div className="h-[400px] overflow-y-auto mb-4">
                            {messages.map((message, index) => (
                                <div key={index} className={`mb-4 ${message.is_user ? 'text-right' : 'text-left'}`}>
                                    <span className={`inline-block p-2 rounded-lg ${message.is_user ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                        {message.content}
                                    </span>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="text-center">
                                    <span className="inline-block p-2 rounded-lg bg-gray-200 text-black">Thinking...</span>
                                </div>
                            )}
                        </div>
                        <div className="flex space-x-2 mb-4">
                            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableProviders.map((provider) => (
                                        <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedModel} onValueChange={setSelectedModel}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select model" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableModels.map((model) => (
                                        <SelectItem key={model} value={model}>{model}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex space-x-2">
                            <Input
                                type="text"
                                placeholder="Type your message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <Button onClick={handleSend} disabled={isLoading}>Send</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="settings">
                        <form onSubmit={handleSetApiKey} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="provider">Provider</Label>
                                <Input id="provider" name="provider" placeholder="e.g., openai, anthropic" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="apiKey">API Key</Label>
                                <Input id="apiKey" name="apiKey" type="password" placeholder="Enter API Key" required />
                            </div>
                            <Button type="submit">Set API Key</Button>
                        </form>
                    </TabsContent>
                    <TabsContent value="agentchef">
                        <div className="space-y-8">
                            <form onSubmit={handleCollectData} className="space-y-4">
                                <h3 className="text-lg font-semibold">Collect Data</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="sourceType">Source Type</Label>
                                    <Select name="sourceType" required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select source type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="arxiv">arXiv</SelectItem>
                                            <SelectItem value="wikipedia">Wikipedia</SelectItem>
                                            <SelectItem value="huggingface">Hugging Face</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="query">Query</Label>
                                    <Input id="query" name="query" placeholder="Enter search query" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxResults">Max Results</Label>
                                    <Input id="maxResults" name="maxResults" type="number" placeholder="Enter max results" required />
                                </div>
                                <Button type="submit">Collect Data</Button>
                            </form>

                            <form onSubmit={handleStructureData} className="space-y-4">
                                <h3 className="text-lg font-semibold">Structure Data</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="structureData">Data (JSON)</Label>
                                    <Textarea id="structureData" name="structureData" placeholder="Enter JSON data" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="templateName">Template Name</Label>
                                    <Input id="templateName" name="templateName" placeholder="Enter template name" required />
                                </div>
                                <Button type="submit">Structure Data</Button>
                            </form>

                            <form onSubmit={handleAugmentData} className="space-y-4">
                                <h3 className="text-lg font-semibold">Augment Data</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="inputFile">Input File</Label>
                                    <Input id="inputFile" name="inputFile" placeholder="Enter input file path" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="numSamples">Number of Samples</Label>
                                    <Input id="numSamples" name="numSamples" type="number" placeholder="Enter number of samples" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="agentName">Agent Name</Label>
                                    <Input id="agentName" name="agentName" placeholder="Enter agent name" required />
                                </div>
                                <Button type="submit">Augment Data</Button>
                            </form>

                            <form onSubmit={handlePushToHuggingFace} className="space-y-4">
                                <h3 className="text-lg font-semibold">Push to Hugging Face</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="filePath">File Path</Label>
                                    <Input id="filePath" name="filePath" placeholder="Enter file path" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="repoId">Repository ID</Label>
                                    <Input id="repoId" name="repoId" placeholder="Enter Hugging Face repo ID" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="token">Hugging Face Token</Label>
                                    <Input id="token" name="token" type="password" placeholder="Enter Hugging Face token" required />
                                </div>
                                <Button type="submit">Push to Hugging Face</Button>
                            </form>
                        </div>
                    </TabsContent>
                    <TabsContent value="gravrag">
                        <div className="space-y-8">
                            <form onSubmit={handleCreateMemory} className="space-y-4">
                                <h3 className="text-lg font-semibold">Create Memory</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="memoryContent">Memory Content</Label>
                                    <Textarea id="memoryContent" name="memoryContent" placeholder="Enter memory content" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="objectiveId">Objective ID</Label>
                                    <Input id="objectiveId" name="objectiveId" placeholder="Enter objective ID" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="taskId">Task ID</Label>
                                    <Input id="taskId" name="taskId" placeholder="Enter task ID" required />
                                </div>
                                <Button type="submit">Create Memory</Button>
                            </form>

                            <form onSubmit={handleRecallMemory} className="space-y-4">
                                <h3 className="text-lg font-semibold">Recall Memory</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="recallQuery">Recall Query</Label>
                                    <Input id="recallQuery" name="recallQuery" placeholder="Enter recall query" required />
                                </div>
                                <Button type="submit">Recall Memory</Button>
                            </form>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Prune Memory</h3>
                                <Button onClick={handlePruneMemory}>Prune Memory</Button>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </Card>
    )
}