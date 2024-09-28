'use client'

import { useState } from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { PlayIcon, PauseIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000"

export default function ComprehensiveAPITester() {
    const [activeTab, setActiveTab] = useState('neural-resources')
    const [isRunningAll, setIsRunningAll] = useState(false)
    const [allResults, setAllResults] = useState({})
    const [neuralResults, setNeuralResults] = useState({})
    const [agentChefResults, setAgentChefResults] = useState({})
    const [gravRAGResults, setGravRAGResults] = useState({})

    // Generic API Test Function
    const testApi = async (endpoint, options = {}) => {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, options)
            const data = await response.json()
            return { status: response.status, data }
        } catch (error) {
            return { error: error.message }
        }
    }

    // Run All Tests
    const runAllTests = async () => {
        setIsRunningAll(true)
        setAllResults({})
        setNeuralResults({})
        setAgentChefResults({})
        setGravRAGResults({})

        const neural = await runNeuralResourcesTests()
        const agentChef = await runAgentChefTests()
        const gravRAG = await runGravRAGTests()

        setAllResults({
            'Neural Resources': neural,
            'AgentChef': agentChef,
            'GravRAG': gravRAG
        })

        setIsRunningAll(false)
    }

    // Neural Resources API Tests
    const runNeuralResourcesTests = async () => {
        const results = {}
        results.routeQuery = await testRouteQuery()
        results.setApiKey = await testSetApiKey()
        results.availableModels = await testAvailableModels()
        results.createMessage = await testCreateMessage()
        setNeuralResults(results)
        return results
    }

    const testRouteQuery = async () => {
        return await testApi('/neural_resources/route_query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: "Hello, how are you?" })
        })
    }

    const testSetApiKey = async () => {
        return await testApi('/neural_resources/set_api_key', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider: "openai", api_key: "test_key" })
        })
    }

    const testAvailableModels = async () => {
        return await testApi('/neural_resources/available_models', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
    }

    const testCreateMessage = async () => {
        return await testApi('/neural_resources/create_message/openai/gpt-3.5-turbo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: "What is AI?" })
        })
    }

    // AgentChef API Tests
    const runAgentChefTests = async () => {
        const results = {}
        results.collectData = await testCollectData()
        results.structureData = await testStructureData()
        results.augmentData = await testAugmentData()
        results.pushToHuggingFace = await testPushToHuggingFace()
        setAgentChefResults(results)
        return results
    }

    const testCollectData = async () => {
        return await testApi('/agentchef/collect_data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source_type: "arxiv", query: "machine learning", max_results: 5 })
        })
    }

    const testStructureData = async () => {
        return await testApi('/agentchef/structure_data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: [{ title: "Test", content: "This is a test content" }],
                template_name: "instruction_input_output"
            })
        })
    }

    const testAugmentData = async () => {
        return await testApi('/agentchef/augment_data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                input_file: "structured_data.parquet",
                num_samples: 3,
                agent_name: "openai"
            })
        })
    }

    const testPushToHuggingFace = async () => {
        return await testApi('/agentchef/push_to_huggingface', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                file_path: "augmented_data.parquet",
                repo_id: "test/dataset",
                token: "hf_test_token"
            })
        })
    }

    // GravRAG API Tests
    const runGravRAGTests = async () => {
        const results = {}
        results.createMemory = await testCreateMemory()
        results.recallMemory = await testRecallMemory()
        results.pruneMemories = await testPruneMemories()
        setGravRAGResults(results)
        return results
    }

    const testCreateMemory = async () => {
        return await testApi('/gravrag/api/memory/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: "This is a test memory",
                metadata: { objective_id: "obj_1", task_id: "task_1" }
            })
        })
    }

    const testRecallMemory = async () => {
        return await testApi('/gravrag/api/memory/recall?query=test memory', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
    }

    const testPruneMemories = async () => {
        return await testApi('/gravrag/api/memory/prune', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        })
    }

    // Helper Function to Render Results with Status Icons
    const renderResult = (result) => {
        if (result.error) {
            return (
                <div className="flex items-center text-red-600">
                    <XCircleIcon className="mr-2 h-5 w-5" />
                    {result.error}
                </div>
            )
        }

        if (result.status >= 200 && result.status < 300) {
            return (
                <div className="flex items-center text-green-600">
                    <CheckCircleIcon className="mr-2 h-5 w-5" />
                    {JSON.stringify(result.data, null, 2)}
                </div>
            )
        }

        return (
            <div className="flex items-center text-yellow-600">
                <span>Unexpected status: {result.status}</span>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center">Comprehensive API Tester</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center mb-4">
                        <Button
                            onClick={runAllTests}
                            disabled={isRunningAll}
                            className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105"
                        >
                            {isRunningAll ? (
                                <>
                                    <PauseIcon className="mr-2 h-4 w-4" />
                                    Running All Tests...
                                </>
                            ) : (
                                <>
                                    <PlayIcon className="mr-2 h-4 w-4" />
                                    Run All Tests
                                </>
                            )}
                        </Button>
                    </div>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="neural-resources">Neural Resources</TabsTrigger>
                            <TabsTrigger value="agentchef">AgentChef</TabsTrigger>
                            <TabsTrigger value="gravrag">GravRAG</TabsTrigger>
                        </TabsList>
                        <TabsContent value="neural-resources">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Neural Resources API</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <Button
                                            onClick={async () => {
                                                const res = await testRouteQuery()
                                                setNeuralResults(prev => ({ ...prev, routeQuery: res }))
                                            }}
                                            className="bg-blue-500 hover:bg-blue-600"
                                        >
                                            Test Route Query
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                const res = await testSetApiKey()
                                                setNeuralResults(prev => ({ ...prev, setApiKey: res }))
                                            }}
                                            className="bg-blue-500 hover:bg-blue-600"
                                        >
                                            Test Set API Key
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                const res = await testAvailableModels()
                                                setNeuralResults(prev => ({ ...prev, availableModels: res }))
                                            }}
                                            className="bg-blue-500 hover:bg-blue-600"
                                        >
                                            Test Available Models
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                const res = await testCreateMessage()
                                                setNeuralResults(prev => ({ ...prev, createMessage: res }))
                                            }}
                                            className="bg-blue-500 hover:bg-blue-600"
                                        >
                                            Test Create Message
                                        </Button>
                                    </div>
                                    <ScrollArea className="h-[300px]">
                                        <pre className="text-sm overflow-auto">
                                            {Object.keys(neuralResults).length > 0
                                                ? JSON.stringify(neuralResults, null, 2)
                                                : "No results yet."}
                                        </pre>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="agentchef">
                            <Card>
                                <CardHeader>
                                    <CardTitle>AgentChef API</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <Button
                                            onClick={async () => {
                                                const res = await testCollectData()
                                                setAgentChefResults(prev => ({ ...prev, collectData: res }))
                                            }}
                                            className="bg-green-500 hover:bg-green-600"
                                        >
                                            Test Collect Data
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                const res = await testStructureData()
                                                setAgentChefResults(prev => ({ ...prev, structureData: res }))
                                            }}
                                            className="bg-green-500 hover:bg-green-600"
                                        >
                                            Test Structure Data
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                const res = await testAugmentData()
                                                setAgentChefResults(prev => ({ ...prev, augmentData: res }))
                                            }}
                                            className="bg-green-500 hover:bg-green-600"
                                        >
                                            Test Augment Data
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                const res = await testPushToHuggingFace()
                                                setAgentChefResults(prev => ({ ...prev, pushToHuggingFace: res }))
                                            }}
                                            className="bg-green-500 hover:bg-green-600"
                                        >
                                            Test Push to HuggingFace
                                        </Button>
                                    </div>
                                    <ScrollArea className="h-[300px]">
                                        <pre className="text-sm overflow-auto">
                                            {Object.keys(agentChefResults).length > 0
                                                ? JSON.stringify(agentChefResults, null, 2)
                                                : "No results yet."}
                                        </pre>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="gravrag">
                            <Card>
                                <CardHeader>
                                    <CardTitle>GravRAG API</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <Button
                                            onClick={async () => {
                                                const res = await testCreateMemory()
                                                setGravRAGResults(prev => ({ ...prev, createMemory: res }))
                                            }}
                                            className="bg-purple-500 hover:bg-purple-600"
                                        >
                                            Test Create Memory
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                const res = await testRecallMemory()
                                                setGravRAGResults(prev => ({ ...prev, recallMemory: res }))
                                            }}
                                            className="bg-purple-500 hover:bg-purple-600"
                                        >
                                            Test Recall Memory
                                        </Button>
                                        <Button
                                            onClick={async () => {
                                                const res = await testPruneMemories()
                                                setGravRAGResults(prev => ({ ...prev, pruneMemories: res }))
                                            }}
                                            className="bg-purple-500 hover:bg-purple-600"
                                        >
                                            Test Prune Memories
                                        </Button>
                                    </div>
                                    <ScrollArea className="h-[300px]">
                                        <pre className="text-sm overflow-auto">
                                            {Object.keys(gravRAGResults).length > 0
                                                ? JSON.stringify(gravRAGResults, null, 2)
                                                : "No results yet."}
                                        </pre>
                                    </ScrollArea>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                    {isRunningAll && (
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle>All Test Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[300px]">
                                    <pre className="text-sm overflow-auto">
                                        {JSON.stringify(allResults, null, 2)}
                                    </pre>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
// yyy