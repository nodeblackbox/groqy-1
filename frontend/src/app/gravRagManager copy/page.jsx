'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { ChevronDown, ChevronRight, File, Folder, Search, Settings, Code, Database, Brain, Play, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

import { toast } from "@/hooks/use-toast"


export default function ComprehensiveUI() {
    const [projectStructure, setProjectStructure] = useState({})
    const [selectedFile, setSelectedFile] = useState(null)
    const [fileContent, setFileContent] = useState('')
    const [analysis, setAnalysis] = useState(null)
    const [llmInsights, setLLMInsights] = useState('')
    const [collections, setCollections] = useState([])
    const [selectedCollection, setSelectedCollection] = useState('')
    const [queryInput, setQueryInput] = useState('')
    const [queryResult, setQueryResult] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        fetchProjectStructure()
        fetchCollections()
    }, [])

    const fetchProjectStructure = async () => {
        try {
            const response = await fetch('/api/get-file-structure')
            const data = await response.json()
            setProjectStructure(data.structure)
        } catch (error) {
            console.error('Error fetching project structure:', error)
            toast({
                title: 'Error',
                description: 'Failed to fetch project structure',
                variant: 'destructive',
            })
        }
    }

    const fetchCollections = async () => {
        try {
            const response = await fetch('/api/qdrant/collections')
            const data = await response.json()
            setCollections(data.collections)
        } catch (error) {
            console.error('Error fetching collections:', error)
            toast({
                title: 'Error',
                description: 'Failed to fetch Qdrant collections',
                variant: 'destructive',
            })
        }
    }

    const handleFileSelect = async (filePath) => {
        setSelectedFile(filePath)
        try {
            const response = await fetch('/api/get-file-contents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ files: [filePath] }),
            })
            const data = await response.json()
            setFileContent(data.fileContents[filePath])
        } catch (error) {
            console.error('Error fetching file content:', error)
            toast({
                title: 'Error',
                description: 'Failed to fetch file content',
                variant: 'destructive',
            })
        }
    }

    const handleAnalyze = async () => {
        if (!selectedFile) {
            toast({
                title: 'Error',
                description: 'Please select a file to analyze',
                variant: 'destructive',
            })
            return
        }
        setIsProcessing(true)
        try {
            const response = await fetch('/api/comprehensive-file-insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filePath: selectedFile }),
            })
            const data = await response.json()
            setAnalysis(data)
        } catch (error) {
            console.error('Error analyzing file:', error)
            toast({
                title: 'Error',
                description: 'Failed to analyze file',
                variant: 'destructive',
            })
        } finally {
            setIsProcessing(false)
        }
    }

    const handleGetLLMInsights = async () => {
        if (!analysis) {
            toast({
                title: 'Error',
                description: 'Please analyze a file first',
                variant: 'destructive',
            })
            return
        }
        setIsProcessing(true)
        try {
            const response = await fetch('/api/analyze-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: 'Provide insights on the analyzed file',
                    selectedItems: ['components', 'functions', 'imports'],
                    knowledgeBase: JSON.stringify(analysis),
                    promptType: 'comprehensive',
                    model: 'llama-3.1-70b-versatile',
                }),
            })
            const data = await response.json()
            setLLMInsights(data.markdown)
        } catch (error) {
            console.error('Error getting LLM insights:', error)
            toast({
                title: 'Error',
                description: 'Failed to get LLM insights',
                variant: 'destructive',
            })
        } finally {
            setIsProcessing(false)
        }
    }

    const handleCreateCollection = async (collectionName, vectorSize) => {
        try {
            const response = await fetch('/api/qdrant/create-collection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: collectionName, vectorSize }),
            })
            if (response.ok) {
                toast({
                    title: 'Success',
                    description: `Collection "${collectionName}" created successfully`,
                })
                fetchCollections()
            } else {
                throw new Error('Failed to create collection')
            }
        } catch (error) {
            console.error('Error creating collection:', error)
            toast({
                title: 'Error',
                description: 'Failed to create collection',
                variant: 'destructive',
            })
        }
    }

    const handleDeleteCollection = async (collectionName) => {
        try {
            const response = await fetch(`/api/qdrant/delete-collection/${collectionName}`, {
                method: 'DELETE',
            })
            if (response.ok) {
                toast({
                    title: 'Success',
                    description: `Collection "${collectionName}" deleted successfully`,
                })
                fetchCollections()
                if (selectedCollection === collectionName) {
                    setSelectedCollection('')
                }
            } else {
                throw new Error('Failed to delete collection')
            }
        } catch (error) {
            console.error('Error deleting collection:', error)
            toast({
                title: 'Error',
                description: 'Failed to delete collection',
                variant: 'destructive',
            })
        }
    }

    const handleQuery = async () => {
        if (!selectedCollection || !queryInput) {
            toast({
                title: 'Error',
                description: 'Please select a collection and enter a query',
                variant: 'destructive',
            })
            return
        }
        setIsProcessing(true)
        try {
            const response = await fetch('/api/qdrant/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ collection: selectedCollection, query: queryInput }),
            })
            const data = await response.json()
            setQueryResult(JSON.stringify(data, null, 2))
        } catch (error) {
            console.error('Error querying collection:', error)
            toast({
                title: 'Error',
                description: 'Failed to query collection',
                variant: 'destructive',
            })
        } finally {
            setIsProcessing(false)
        }
    }

    const renderFileTree = useCallback((structure, path = '') => {
        return Object.entries(structure).map(([key, value]) => {
            const fullPath = path ? `${path}/${key}` : key
            const isFolder = typeof value === 'object'
            return (
                <FileTreeItem
                    key={fullPath}
                    name={key}
                    path={fullPath}
                    isFolder={isFolder}
                    onSelect={handleFileSelect}
                >
                    {isFolder && renderFileTree(value, fullPath)}
                </FileTreeItem>
            )
        })
    }, [])

    return (
        <div className="flex h-screen">
            {/* Left Sidebar: File Explorer */}
            <div className="w-1/4 border-r p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Project Structure</h2>
                    <Button variant="ghost" size="icon" onClick={fetchProjectStructure}>
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
                <ScrollArea className="h-[calc(100vh-8rem)]">
                    {renderFileTree(projectStructure)}
                </ScrollArea>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 overflow-auto">
                <Tabs defaultValue="file-content">
                    <TabsList className="mb-4">
                        <TabsTrigger value="file-content">File Content</TabsTrigger>
                        <TabsTrigger value="analysis">Analysis</TabsTrigger>
                        <TabsTrigger value="insights">LLM Insights</TabsTrigger>
                        <TabsTrigger value="qdrant">Qdrant Management</TabsTrigger>
                    </TabsList>

                    <TabsContent value="file-content">
                        <Card>
                            <CardHeader>
                                <CardTitle>{selectedFile || 'No file selected'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <pre className="p-4 bg-muted rounded-md overflow-auto max-h-[60vh]">
                                    <code>{fileContent}</code>
                                </pre>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="analysis">
                        <Card>
                            <CardHeader>
                                <CardTitle>Analysis Results</CardTitle>
                                <CardDescription>Comprehensive insights about the selected file</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={handleAnalyze} disabled={isProcessing}>
                                    {isProcessing ? 'Analyzing...' : 'Analyze File'}
                                </Button>
                                {analysis && (
                                    <div className="mt-4">
                                        <h3 className="text-lg font-semibold mb-2">File: {analysis.filePath}</h3>
                                        <pre className="p-4 bg-muted rounded-md overflow-auto max-h-[50vh]">
                                            <code>{JSON.stringify(analysis, null, 2)}</code>
                                        </pre>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="insights">
                        <Card>
                            <CardHeader>
                                <CardTitle>LLM Insights</CardTitle>
                                <CardDescription>AI-generated insights about your project</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={handleGetLLMInsights} disabled={isProcessing}>
                                    {isProcessing ? 'Generating Insights...' : 'Get LLM Insights'}
                                </Button>
                                {llmInsights && (
                                    <div className="mt-4 prose max-w-none">
                                        <div dangerouslySetInnerHTML={{ __html: llmInsights }} />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="qdrant">
                        <Card>
                            <CardHeader>
                                <CardTitle>Qdrant Vector DB Management</CardTitle>
                                <CardDescription>Manage collections and perform queries</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Collections</h3>
                                        <div className="flex space-x-2">
                                            <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a collection" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {collections.map((collection) => (
                                                        <SelectItem key={collection} value={collection}>
                                                            {collection}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button>
                                                        <Plus className="mr-2 h-4 w-4" /> Create Collection
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Create New Collection</DialogTitle>
                                                        <DialogDescription>
                                                            Enter the details for the new Qdrant collection.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <CreateCollectionForm onSubmit={handleCreateCollection} />
                                                </DialogContent>
                                            </Dialog>
                                            <Button
                                                variant="destructive"
                                                onClick={() => handleDeleteCollection(selectedCollection)}
                                                disabled={!selectedCollection}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete Collection
                                            </Button>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Query Collection</h3>
                                        <div className="flex space-x-2">
                                            <Input
                                                placeholder="Enter your query"
                                                value={queryInput}
                                                onChange={(e) => setQueryInput(e.target.value)}
                                            />
                                            <Button onClick={handleQuery} disabled={isProcessing}>
                                                {isProcessing ? 'Querying...' : 'Query'}
                                            </Button>
                                        </div>
                                        {queryResult && (
                                            <pre className="mt-4 p-4 bg-muted rounded-md overflow-auto max-h-[30vh]">
                                                <code>{queryResult}</code>
                                            </pre>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

function FileTreeItem({ name, path, isFolder, onSelect, children }) {
    const [isOpen, setIsOpen] = useState(false)
    const Icon = isFolder ? (isOpen ? ChevronDown : ChevronRight) : File

    const handleClick = () => {
        if (isFolder) {
            setIsOpen(!isOpen)
        } else {
            onSelect(path)
        }
    }

    return (
        <div>
            <div
                className="flex items-center py-1 px-2 hover:bg-accent rounded-md cursor-pointer"
                onClick={handleClick}
            >
                <Icon className="h-4 w-4 mr-2" />
                <span>{name}</span>
            </div>
            {isOpen && isFolder && <div className="pl-4">{children}</div>}
        </div>
    )
}

function CreateCollectionForm({ onSubmit }) {
    const [name, setName] = useState('')
    const [vectorSize, setVectorSize] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(name, parseInt(vectorSize, 10))
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="name">Collection Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="vectorSize">Vector Size</Label>
                    <Input
                        id="vectorSize"
                        type="number"
                        value={vectorSize}
                        onChange={(e) => setVectorSize(e.target.value)}
                        required
                    />
                </div>
            </div>
            <DialogFooter className="mt-4">
                <Button type="submit">Create Collection</Button>
            </DialogFooter>
        </form>
    )
}