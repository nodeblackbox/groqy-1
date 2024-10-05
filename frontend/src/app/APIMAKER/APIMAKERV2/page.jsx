"use client";
import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Cpu, Database, Layers, Zap, Plus, Trash2, ChevronRight, ChevronDown, Play, Edit, Save, Download, Upload, Search, Sun, Moon } from "lucide-react"
import { useHotkeys } from 'react-hotkeys-hook'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter } from "@/components/ui/dialog"
import { toast, Toaster } from 'react-hot-toast'

const TreeNode = ({ node, onAdd, onDelete, onToggle, onEdit, searchTerm }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [nodeType, setNodeType] = useState(node.type)

    const handleEdit = (e) => {
        if (e.key === 'Enter') {
            onEdit(node, 'name', e.target.value)
            setIsEditing(false)
        }
    }

    const handleTypeChange = (e) => {
        onEdit(node, 'type', e.target.value)
        setNodeType(e.target.value)
    }

    const matchesSearch = node?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false

    return (
        <div className={`ml-4 ${searchTerm && !matchesSearch ? 'hidden' : ''}`}>
            <div className="flex items-center space-x-2 my-1">
                {(node.type === 'object' || node.type === 'array') ? (
                    <button onClick={() => onToggle(node)} className="text-gray-400 hover:text-white">
                        {node.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                ) : (
                    <span className="w-4" /> // Placeholder for alignment
                )}
                <select
                    value={nodeType}
                    onChange={handleTypeChange}
                    className="bg-gray-800 text-white rounded px-1 py-0.5 text-xs"
                >
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="boolean">Boolean</option>
                    <option value="object">Object</option>
                    <option value="array">Array</option>
                </select>
                {isEditing ? (
                    <Input
                        value={node.name}
                        onChange={(e) => onEdit(node, 'name', e.target.value)}
                        onKeyDown={handleEdit}
                        onBlur={() => setIsEditing(false)}
                        className="h-6 py-0 px-1 w-24 bg-gray-800 border border-gray-700 text-white text-xs"
                    />
                ) : (
                        <span className={`text-green-400 text-xs ${!matchesSearch && searchTerm ? 'hidden' : ''}`} onDoubleClick={() => setIsEditing(true)}>{node.name}</span>
                )}
                {node.value !== undefined && node.type !== 'object' && node.type !== 'array' && (
                    isEditing ? (
                        <Input
                            value={node.value}
                            onChange={(e) => onEdit(node, 'value', e.target.value)}
                            onKeyDown={handleEdit}
                            onBlur={() => setIsEditing(false)}
                            className="h-6 py-0 px-1 w-24 bg-gray-800 border border-gray-700 text-white text-xs"
                        />
                    ) : (
                            <span className={`text-yellow-400 text-xs ${!matchesSearch && searchTerm ? 'hidden' : ''}`} onDoubleClick={() => setIsEditing(true)}>: {node.value}</span>
                    )
                )}
                <div className="ml-auto flex space-x-1">
                    <Button size="xs" variant="ghost" onClick={() => onAdd(node)} className="h-6 w-6 p-0">
                        <Plus size={12} />
                    </Button>
                    <Button size="xs" variant="ghost" onClick={() => onDelete(node)} className="h-6 w-6 p-0">
                        <Trash2 size={12} />
                    </Button>
                </div>
            </div>
            {node.isOpen && node.children && (
                <div className="ml-4">
                    {node.children.map((child, index) => (
                        <TreeNode
                            key={index}
                            node={child}
                            onAdd={onAdd}
                            onDelete={onDelete}
                            onToggle={onToggle}
                            onEdit={onEdit}
                            searchTerm={searchTerm}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default function ComprehensiveComponent() {
    // Dark Mode State
    const [darkMode, setDarkMode] = useState(() => {
        const stored = localStorage.getItem('darkMode')
        return stored ? JSON.parse(stored) : false
    })

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode))
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [darkMode])

    // Tabs State
    const [activeTab, setActiveTab] = useState('structure')

    // JSON Structure State
    const [jsonStructure, setJsonStructure] = useState(() => {
        const stored = localStorage.getItem('jsonStructure')
        return stored ? JSON.parse(stored) : {
            type: 'object',
            name: 'root',
            isOpen: true,
            children: [
                { type: 'string', name: 'name', value: 'John Doe' },
                { type: 'number', name: 'age', value: 30 },
                {
                    type: 'object',
                    name: 'address',
                    isOpen: true,
                    children: [
                        { type: 'string', name: 'street', value: '123 Main St' },
                        { type: 'string', name: 'city', value: 'Anytown' },
                    ],
                },
            ],
        }
    })

    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        localStorage.setItem('jsonStructure', JSON.stringify(jsonStructure))
    }, [jsonStructure])

    // AI Command Center State
    const [aiCommand, setAiCommand] = useState('')
    const [complexity, setComplexity] = useState(50)
    const [isRealTime, setIsRealTime] = useState(false)
    const [aiLogs, setAiLogs] = useState(() => {
        const stored = localStorage.getItem('aiLogs')
        return stored ? JSON.parse(stored) : []
    })
    const [aiTemplates, setAiTemplates] = useState(() => {
        const stored = localStorage.getItem('aiTemplates')
        return stored ? JSON.parse(stored) : []
    })

    useEffect(() => {
        localStorage.setItem('aiLogs', JSON.stringify(aiLogs))
    }, [aiLogs])

    useEffect(() => {
        localStorage.setItem('aiTemplates', JSON.stringify(aiTemplates))
    }, [aiTemplates])

    // Database Interactions State
    const [databases, setDatabases] = useState(() => {
        const stored = localStorage.getItem('databases')
        return stored ? JSON.parse(stored) : [
            { id: 1, name: 'ProductsDB', type: 'PostgreSQL', host: 'localhost', port: 5432 },
            { id: 2, name: 'UsersDB', type: 'MongoDB', host: 'localhost', port: 27017 },
        ]
    })
    const [queries, setQueries] = useState(() => {
        const stored = localStorage.getItem('queries')
        return stored ? JSON.parse(stored) : [
            'SELECT * FROM Users WHERE last_login > \'2023-01-01\'',
            'UPDATE Products SET stock = stock - 1 WHERE id = 1234',
            'INSERT INTO Orders (user_id, product_id, quantity) VALUES (1, 2, 3)',
        ]
    })
    const [currentQuery, setCurrentQuery] = useState('')
    const [queryResult, setQueryResult] = useState(null)
    const [queryPage, setQueryPage] = useState(1)
    const [queryPageSize, setQueryPageSize] = useState(10)

    useEffect(() => {
        localStorage.setItem('databases', JSON.stringify(databases))
    }, [databases])

    useEffect(() => {
        localStorage.setItem('queries', JSON.stringify(queries))
    }, [queries])

    // API Tester State
    const [apiEndpoints, setApiEndpoints] = useState(() => {
        const stored = localStorage.getItem('apiEndpoints')
        return stored ? JSON.parse(stored) : [
            { id: 1, name: 'Get Users', url: 'https://jsonplaceholder.typicode.com/users', method: 'GET', headers: { 'Content-Type': 'application/json' }, payload: null },
            { id: 2, name: 'Create Post', url: 'https://jsonplaceholder.typicode.com/posts', method: 'POST', headers: { 'Content-Type': 'application/json' }, payload: { title: '', body: '', userId: 1 } },
        ]
    })
    const [newEndpoint, setNewEndpoint] = useState({ name: '', url: '', method: 'GET', headers: '{"Content-Type": "application/json"}', payload: '' })
    const [testUrl, setTestUrl] = useState('')
    const [testMethod, setTestMethod] = useState('GET')
    const [testHeaders, setTestHeaders] = useState('{}')
    const [testPayload, setTestPayload] = useState('')
    const [testResult, setTestResult] = useState('')
    const [testHistory, setTestHistory] = useState(() => {
        const stored = localStorage.getItem('testHistory')
        return stored ? JSON.parse(stored) : []
    })
    const [authKeys, setAuthKeys] = useState(() => {
        const stored = localStorage.getItem('authKeys')
        return stored ? JSON.parse(stored) : { openai: '', anthropic: '', groq: '' }
    })

    useEffect(() => {
        localStorage.setItem('apiEndpoints', JSON.stringify(apiEndpoints))
    }, [apiEndpoints])

    useEffect(() => {
        localStorage.setItem('testHistory', JSON.stringify(testHistory))
    }, [testHistory])

    useEffect(() => {
        localStorage.setItem('authKeys', JSON.stringify(authKeys))
    }, [authKeys])

    // Chatbot Testing State (Placeholder)
    const [chatHistory, setChatHistory] = useState([])

    // UI Customization State
    const [customLayout, setCustomLayout] = useState('default')

    // Dialog States
    const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)

    // Hotkeys
    useHotkeys('ctrl+s, command+s', (event) => {
        event.preventDefault()
        handleSaveJSON()
    }, { enableOnTags: ['INPUT', 'TEXTAREA'] })

    // JSON Structure Handlers
    const addNode = (parent) => {
        const newNode = { type: 'string', name: 'newField', value: 'value' }
        if (parent.type === 'object' || parent.type === 'array') {
            parent.children = parent.children || []
            parent.children.push(newNode)
            parent.isOpen = true
            setJsonStructure({ ...jsonStructure })
        }
    }

    const deleteNode = (nodeToDelete) => {
        const deleteRecursive = (node) => {
            if (node.children) {
                node.children = node.children.filter((child) => child !== nodeToDelete)
                node.children.forEach(deleteRecursive)
            }
        }
        if (jsonStructure !== nodeToDelete) {
            deleteRecursive(jsonStructure)
            setJsonStructure({ ...jsonStructure })
        }
    }

    const toggleNode = (node) => {
        node.isOpen = !node.isOpen
        setJsonStructure({ ...jsonStructure })
    }

    const editNode = (node, field, value) => {
        node[field] = value
        setJsonStructure({ ...jsonStructure })
    }

    const handleSaveJSON = () => {
        toast.success('JSON Structure Saved!')
        localStorage.setItem('jsonStructure', JSON.stringify(jsonStructure))
    }

    const handleImportJSON = (importedJSON) => {
        try {
            const parsed = JSON.parse(importedJSON)
            setJsonStructure(parsed)
            toast.success('JSON Structure Imported!')
        } catch (error) {
            toast.error('Invalid JSON Structure')
        }
    }

    const handleExportJSON = () => {
        const dataStr = JSON.stringify(jsonStructure, null, 2)
        const blob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'jsonStructure.json'
        link.click()
        toast.success('JSON Structure Exported!')
    }

    const validateJSON = () => {
        try {
            JSON.stringify(jsonStructure)
            toast.success('JSON Structure is Valid')
        } catch (error) {
            toast.error('Invalid JSON Structure')
        }
    }

    // AI Command Center Handlers
    const handleExecuteAI = () => {
        if (aiCommand.trim() === '') {
            toast.error('AI Command cannot be empty')
            return
        }
        // Mock AI processing
        const response = `AI Response to "${aiCommand}" with Gravitational pull ${complexity}% and ${isRealTime ? 'real-time' : 'batch'} processing.`
        setAiLogs([...aiLogs, { command: aiCommand, response, timestamp: new Date().toLocaleString() }])
        setAiCommand('')
        toast.success('AI Command Executed')
    }

    const handleSaveTemplate = (templateName) => {
        if (!templateName) {
            toast.error('Template name is required')
            return
        }
        setAiTemplates([...aiTemplates, { name: templateName, command: aiCommand, complexity, isRealTime }])
        toast.success('AI Template Saved')
    }

    const handleLoadTemplate = (template) => {
        setAiCommand(template.command)
        setComplexity(template.complexity)
        setIsRealTime(template.isRealTime)
        toast.success(`AI Template "${template.name}" Loaded`)
    }

    // Database Interactions Handlers
    const addDatabase = () => {
        const newDb = { id: Date.now(), name: 'NewDB', type: 'MySQL', host: 'localhost', port: 3306 }
        setDatabases([...databases, newDb])
        toast.success('Database Added')
    }

    const deleteDatabaseHandler = (dbId) => {
        setDatabases(databases.filter(db => db.id !== dbId))
        toast.success('Database Deleted')
    }

    const executeQuery = () => {
        if (currentQuery.trim() === '') {
            toast.error('Query cannot be empty')
            return
        }
        // Mock query execution
        if (!currentQuery.toLowerCase().startsWith('select')) {
            setQueryResult('Only SELECT queries are supported in this mock.')
            toast.error('Unsupported Query Type')
            return
        }
        const simulatedResult = [
            { id: 1, name: 'Alice', last_login: '2023-05-10' },
            { id: 2, name: 'Bob', last_login: '2023-06-15' },
            // Add more mock data as needed
        ]
        setQueryResult(simulatedResult)
        setQueries([...queries, currentQuery])
        setCurrentQuery('')
        toast.success('Query Executed')
    }

    const getPaginatedResults = () => {
        if (!queryResult) return []
        const start = (queryPage - 1) * queryPageSize
        return queryResult.slice(start, start + queryPageSize)
    }

    const suggestQueryOptimization = () => {
        // Mock optimization suggestion
        toast.info('Consider adding indexes to improve query performance.')
    }

    // API Tester Handlers
    const addApiEndpoint = () => {
        if (newEndpoint.name.trim() === '' || newEndpoint.url.trim() === '') {
            toast.error('Endpoint name and URL are required')
            return
        }
        try {
            JSON.parse(newEndpoint.headers)
            if ((newEndpoint.method === 'POST' || newEndpoint.method === 'PUT') && newEndpoint.payload) {
                JSON.parse(newEndpoint.payload)
            }
        } catch (error) {
            toast.error('Invalid JSON in headers or payload')
            return
        }
        const endpoint = { ...newEndpoint, id: Date.now() }
        setApiEndpoints([...apiEndpoints, endpoint])
        setNewEndpoint({ name: '', url: '', method: 'GET', headers: '{"Content-Type": "application/json"}', payload: '' })
        toast.success('API Endpoint Added')
    }

    const deleteApiEndpoint = (id) => {
        setApiEndpoints(apiEndpoints.filter(ep => ep.id !== id))
        toast.success('API Endpoint Deleted')
    }

    const handleTestAPI = async () => {
        if (testUrl.trim() === '') {
            toast.error('API URL is required')
            return
        }
        setTestResult('Testing API...')
        try {
            const headers = JSON.parse(testHeaders)
            let options = {
                method: testMethod,
                headers,
            }
            if (testMethod === 'POST' || testMethod === 'PUT') {
                options.body = JSON.stringify(JSON.parse(testPayload))
            }
            const response = await fetch(testUrl, options)
            const data = await response.json()
            const result = `Status: ${response.status}\nResponse: ${JSON.stringify(data, null, 2)}`
            setTestResult(result)
            setTestHistory([{ url: testUrl, method: testMethod, result, timestamp: new Date().toLocaleString() }, ...testHistory])
            toast.success('API Tested Successfully')
        } catch (error) {
            setTestResult(`Error: ${error.message}`)
            setTestHistory([{ url: testUrl, method: testMethod, result: `Error: ${error.message}`, timestamp: new Date().toLocaleString() }, ...testHistory])
            toast.error('API Test Failed')
        }
    }

    const handleAuthKeysSave = () => {
        toast.success('Authentication Keys Saved')
        setIsAuthDialogOpen(false)
    }

    // Render Component
    return (
        <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'} text-white overflow-hidden`}>
            <Toaster position="top-right" />
            {/* Sidebar */}
            <div className="w-16 bg-black flex flex-col items-center py-8 space-y-8">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" className="h-12 w-12" onClick={() => setActiveTab('structure')}>
                                <Layers className="w-6 h-6 text-green-400" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>JSON Structure</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" className="h-12 w-12" onClick={() => setActiveTab('ai')}>
                                <Cpu className="w-6 h-6 text-blue-400" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>AI Processing</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" className="h-12 w-12" onClick={() => setActiveTab('database')}>
                                <Database className="w-6 h-6 text-purple-400" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Database</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" className="h-12 w-12" onClick={() => setActiveTab('test')}>
                                <Zap className="w-6 h-6 text-yellow-400" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>API Tester</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" className="h-12 w-12" onClick={() => setIsAuthDialogOpen(true)}>
                                <Edit className="w-6 h-6 text-red-400" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Auth Keys</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" className="h-12 w-12" onClick={() => setDarkMode(!darkMode)}>
                                {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-400" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>{darkMode ? 'Light Mode' : 'Dark Mode'}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col p-8 overflow-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} text-white`}>
                <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                    Nexus: Advanced LLM API Architect
                </h1>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
                    <TabsList className="mb-4">
                        <TabsTrigger value="structure">JSON Structure</TabsTrigger>
                        <TabsTrigger value="ai">AI Command Center</TabsTrigger>
                        <TabsTrigger value="database">Database Interactions</TabsTrigger>
                        <TabsTrigger value="test">API Tester</TabsTrigger>
                    </TabsList>

                    {/* JSON Structure Tab */}
                    <TabsContent value="structure" className="flex-1 overflow-auto">
                        <div className="bg-black p-6 rounded-xl mb-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold">Dynamic JSON Builder</h2>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="sm" onClick={handleSaveJSON}>
                                        <Save size={16} className="mr-1" /> Save
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleImportJSON(prompt('Paste JSON here:'))}>
                                        <Upload size={16} className="mr-1" /> Import
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={handleExportJSON}>
                                        <Download size={16} className="mr-1" /> Export
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={validateJSON}>
                                        <Edit size={16} className="mr-1" /> Validate
                                    </Button>
                                </div>
                            </div>
                            <Input
                                className="mb-4 bg-gray-800 border-gray-700 text-white"
                                placeholder="Search JSON Structure..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search size={16} />}
                            />
                            <div className="border border-gray-700 rounded-lg p-4 max-h-96 overflow-auto">
                                <TreeNode
                                    node={jsonStructure}
                                    onAdd={addNode}
                                    onDelete={deleteNode}
                                    onToggle={toggleNode}
                                    onEdit={editNode}
                                    searchTerm={searchTerm}
                                />
                            </div>
                        </div>
                        <div className="bg-black p-6 rounded-xl">
                            <h2 className="text-2xl mb-4 font-semibold">JSON Preview</h2>
                            <pre className="bg-gray-800 p-4 rounded-lg overflow-auto max-h-64">
                                {JSON.stringify(jsonStructure, null, 2)}
                            </pre>
                        </div>
                    </TabsContent>

                    {/* AI Command Center Tab */}
                    <TabsContent value="ai" className="space-y-4">
                        <div className="bg-black p-6 rounded-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold">AI Command Center</h2>
                                <Button variant="outline" size="sm" onClick={() => setIsTemplateDialogOpen(true)}>
                                    <Save size={16} className="mr-1" /> Save Template
                                </Button>
                            </div>
                            <div className="flex space-x-4 mb-4">
                                <Input
                                    className="flex-1 bg-gray-800 border-gray-700 text-white"
                                    placeholder="Enter your command or query..."
                                    value={aiCommand}
                                    onChange={(e) => setAiCommand(e.target.value)}
                                />
                                <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleExecuteAI}>
                                    Execute
                                </Button>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <span>Gravitational pull: {complexity}%</span>
                                <Slider
                                    max={100}
                                    step={1}
                                    value={[complexity]}
                                    onValueChange={(value) => setComplexity(value[0])}
                                    className="w-64"
                                />
                            </div>
                            <div className="flex items-center justify-between mb-4">
                                <span>Real-time Processing</span>
                                <Switch
                                    checked={isRealTime}
                                    onCheckedChange={setIsRealTime}
                                />
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg max-h-64 overflow-auto">
                                <h3 className="text-lg mb-2">AI Logs:</h3>
                                <ul className="space-y-2">
                                    {aiLogs.map((log, index) => (
                                        <li key={index} className="border-b border-gray-700 pb-2">
                                            <p className="text-sm"><strong>Command:</strong> {log.command}</p>
                                            <p className="text-sm"><strong>Response:</strong> {log.response}</p>
                                            <p className="text-xs text-gray-400">{log.timestamp}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="bg-black p-6 rounded-xl">
                            <h2 className="text-2xl mb-4 font-semibold">AI Suggestions</h2>
                            <ul className="space-y-2">
                                <li className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">Apply</Button>
                                    <span>Optimize API endpoint for better performance</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">Apply</Button>
                                    <span>Add caching layer to reduce database load</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">Apply</Button>
                                    <span>Implement rate limiting for security</span>
                                </li>
                            </ul>
                        </div>
                    </TabsContent>

                    {/* Database Interactions Tab */}
                    <TabsContent value="database" className="space-y-4">
                        <div className="bg-black p-6 rounded-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold">Database Connections</h2>
                                <Button variant="outline" size="sm" onClick={addDatabase}>
                                    <Plus size={16} className="mr-1" /> Add Database
                                </Button>
                            </div>
                            <ul className="space-y-2">
                                {databases.map(db => (
                                    <li key={db.id} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                                        <div>
                                            <p className="font-semibold">{db.name}</p>
                                            <p className="text-sm">{db.type} - {db.host}:{db.port}</p>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => deleteDatabaseHandler(db.id)}>
                                            <Trash2 size={14} />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-black p-6 rounded-xl">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold">Query Editor</h2>
                                <Button variant="outline" size="sm" onClick={suggestQueryOptimization}>
                                    Optimize Query
                                </Button>
                            </div>
                            <Input
                                as="textarea"
                                rows={4}
                                className="bg-gray-800 border border-gray-700 text-white p-2 rounded w-full mb-4"
                                placeholder="Enter your SQL query here..."
                                value={currentQuery}
                                onChange={(e) => setCurrentQuery(e.target.value)}
                            />
                            <Button className="bg-green-600 hover:bg-green-700 mb-4" onClick={executeQuery}>
                                Execute Query
                            </Button>
                            {queryResult && (
                                <div className="bg-gray-800 p-4 rounded-lg">
                                    <h3 className="text-lg mb-2">Query Result:</h3>
                                    <pre className="text-sm">
                                        {Array.isArray(queryResult) ? JSON.stringify(getPaginatedResults(), null, 2) : queryResult}
                                    </pre>
                                    {Array.isArray(queryResult) && (
                                        <div className="flex justify-between items-center mt-2">
                                            <span>Page {queryPage}</span>
                                            <div className="flex space-x-2">
                                                <Button variant="ghost" size="sm" onClick={() => setQueryPage(prev => Math.max(prev - 1, 1))} disabled={queryPage === 1}>
                                                    Previous
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => setQueryPage(prev => prev + 1)} disabled={(queryPage * queryPageSize) >= queryResult.length}>
                                                    Next
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="mt-4">
                                <h3 className="text-lg mb-2">Recent Queries:</h3>
                                <ul className="space-y-2 text-sm">
                                    {queries.map((q, idx) => (
                                        <li key={idx} className="bg-gray-700 p-2 rounded">
                                            {q}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="bg-black p-6 rounded-xl">
                            <h2 className="text-2xl mb-4 font-semibold">Data Visualization</h2>
                            <div className="h-64 flex items-center justify-center bg-gray-800 rounded-lg">
                                <span className="text-gray-400">Interactive data visualizations would be displayed here</span>
                            </div>
                        </div>
                    </TabsContent>

                    {/* API Tester Tab */}
                    <TabsContent value="test" className="space-y-4">
                        <div className="bg-black p-6 rounded-xl mb-4">
                            <h2 className="text-2xl mb-4 font-semibold">API Tester</h2>
                            <div className="flex space-x-4 mb-4 flex-wrap">
                                <select
                                    value={testMethod}
                                    onChange={(e) => setTestMethod(e.target.value)}
                                    className="bg-gray-800 border border-gray-700 text-white rounded px-2 py-1"
                                >
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                    <option value="PUT">PUT</option>
                                    <option value="DELETE">DELETE</option>
                                </select>
                                <Input
                                    className="flex-1 bg-gray-800 border-gray-700 text-white"
                                    placeholder="Enter API URL to test..."
                                    value={testUrl}
                                    onChange={(e) => setTestUrl(e.target.value)}
                                />
                                {(testMethod === 'POST' || testMethod === 'PUT') && (
                                    <Input
                                        className="flex-1 bg-gray-800 border-gray-700 text-white"
                                        placeholder="Enter JSON payload..."
                                        value={testPayload}
                                        onChange={(e) => setTestPayload(e.target.value)}
                                    />
                                )}
                                <Input
                                    className="flex-1 bg-gray-800 border-gray-700 text-white"
                                    placeholder="Enter JSON headers..."
                                    value={testHeaders}
                                    onChange={(e) => setTestHeaders(e.target.value)}
                                />
                                <Button className="bg-yellow-600 hover:bg-yellow-700" onClick={handleTestAPI}>
                                    <Play className="mr-2 h-4 w-4" /> Test API
                                </Button>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <h3 className="text-lg mb-2">Test Result:</h3>
                                <pre className="text-sm">{testResult}</pre>
                            </div>
                        </div>
                        <div className="bg-black p-6 rounded-xl mb-4">
                            <h2 className="text-2xl mb-4 font-semibold">Manage API Endpoints</h2>
                            <div className="flex space-x-4 mb-4 flex-wrap">
                                <Input
                                    placeholder="Endpoint Name"
                                    value={newEndpoint.name}
                                    onChange={(e) => setNewEndpoint({ ...newEndpoint, name: e.target.value })}
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                                <Input
                                    placeholder="URL"
                                    value={newEndpoint.url}
                                    onChange={(e) => setNewEndpoint({ ...newEndpoint, url: e.target.value })}
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                                <select
                                    value={newEndpoint.method}
                                    onChange={(e) => setNewEndpoint({ ...newEndpoint, method: e.target.value })}
                                    className="bg-gray-800 border border-gray-700 text-white rounded px-2 py-1"
                                >
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                    <option value="PUT">PUT</option>
                                    <option value="DELETE">DELETE</option>
                                </select>
                                {(newEndpoint.method === 'POST' || newEndpoint.method === 'PUT') && (
                                    <Input
                                        placeholder="Payload (JSON)"
                                        value={newEndpoint.payload}
                                        onChange={(e) => setNewEndpoint({ ...newEndpoint, payload: e.target.value })}
                                        className="bg-gray-800 border-gray-700 text-white"
                                    />
                                )}
                                <Input
                                    placeholder="Headers (JSON)"
                                    value={newEndpoint.headers}
                                    onChange={(e) => setNewEndpoint({ ...newEndpoint, headers: e.target.value })}
                                    className="bg-gray-800 border-gray-700 text-white"
                                />
                                <Button variant="ghost" onClick={addApiEndpoint}>
                                    <Plus size={16} />
                                </Button>
                            </div>
                            <ul className="space-y-2">
                                {apiEndpoints.map(ep => (
                                    <li key={ep.id} className="flex items-center justify-between bg-gray-800 p-2 rounded">
                                        <div>
                                            <p className="font-semibold">{ep.name}</p>
                                            <p className="text-sm">{ep.method} - {ep.url}</p>
                                            {ep.payload && <pre className="text-xs bg-gray-700 p-1 rounded mt-1">{JSON.stringify(ep.payload, null, 2)}</pre>}
                                            {ep.headers && <pre className="text-xs bg-gray-700 p-1 rounded mt-1">{JSON.stringify(ep.headers, null, 2)}</pre>}
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => deleteApiEndpoint(ep.id)}>
                                            <Trash2 size={14} />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-black p-6 rounded-xl">
                            <h2 className="text-2xl mb-4 font-semibold">Test History</h2>
                            <ul className="space-y-2">
                                {testHistory.map((test, index) => (
                                    <li key={index} className="bg-gray-800 p-2 rounded">
                                        <p className="text-sm"><strong>Method:</strong> {test.method}</p>
                                        <p className="text-sm"><strong>URL:</strong> {test.url}</p>
                                        <p className="text-sm"><strong>Result:</strong> {test.result}</p>
                                        <p className="text-xs text-gray-400">{test.timestamp}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* AI Template Save Dialog */}
            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Save AI Command Template</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <Input
                            placeholder="Template Name"
                            onChange={(e) => setNewEndpoint({ ...newEndpoint, name: e.target.value })}
                        />
                    </DialogBody>
                    <DialogFooter>
                        <Button onClick={() => {
                            const templateName = prompt('Enter Template Name:')
                            handleSaveTemplate(templateName)
                        }}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Authentication Keys Dialog */}
            <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Set Authentication Keys</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1">OpenAI API Key</label>
                                <Input
                                    value={authKeys.openai}
                                    onChange={(e) => setAuthKeys({ ...authKeys, openai: e.target.value })}
                                    placeholder="Enter OpenAI API Key"
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Anthropic API Key</label>
                                <Input
                                    value={authKeys.anthropic}
                                    onChange={(e) => setAuthKeys({ ...authKeys, anthropic: e.target.value })}
                                    placeholder="Enter Anthropic API Key"
                                />
                            </div>
                            <div>
                                <label className="block mb-1">Groq API Key</label>
                                <Input
                                    value={authKeys.groq}
                                    onChange={(e) => setAuthKeys({ ...authKeys, groq: e.target.value })}
                                    placeholder="Enter Groq API Key"
                                />
                            </div>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button onClick={handleAuthKeysSave}>
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
