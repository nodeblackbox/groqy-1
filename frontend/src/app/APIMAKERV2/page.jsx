import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Cpu, Database, Layers, Zap, Plus, Trash2, ChevronRight, ChevronDown, Play, Edit, Save, Copy, Trash, FolderPlus, FolderMinus } from "lucide-react"

// TreeNode Component for JSON Structure Builder
const TreeNode = ({ node, onAdd, onDelete, onToggle, onEdit }) => {
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

    return (
        <div className="ml-4">
            <div className="flex items-center space-x-2 my-1">
                {node.type === 'object' || node.type === 'array' ? (
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
                    <span className="text-green-400 text-xs" onDoubleClick={() => setIsEditing(true)}>{node.name}</span>
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
                        <span className="text-yellow-400 text-xs" onDoubleClick={() => setIsEditing(true)}>: {node.value}</span>
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
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default function Component() {
    // Tabs State
    const [activeTab, setActiveTab] = useState('structure')

    // JSON Structure State
    const [jsonStructure, setJsonStructure] = useState({
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
    })

    // AI Command Center State
    const [aiCommand, setAiCommand] = useState('')
    const [complexity, setComplexity] = useState(50)
    const [isRealTime, setIsRealTime] = useState(false)
    const [aiLogs, setAiLogs] = useState([])

    // Database Interactions State
    const [databases, setDatabases] = useState([
        { id: 1, name: 'ProductsDB', type: 'PostgreSQL', host: 'localhost', port: 5432 },
        { id: 2, name: 'UsersDB', type: 'MongoDB', host: 'localhost', port: 27017 },
    ])
    const [queries, setQueries] = useState([
        'SELECT * FROM Users WHERE last_login > \'2023-01-01\'',
        'UPDATE Products SET stock = stock - 1 WHERE id = 1234',
        'INSERT INTO Orders (user_id, product_id, quantity) VALUES (1, 2, 3)',
    ])
    const [currentQuery, setCurrentQuery] = useState('')
    const [queryResult, setQueryResult] = useState(null)

    // API Tester State
    const [apiEndpoints, setApiEndpoints] = useState([
        { id: 1, name: 'Get Users', url: '/api/users', method: 'GET', payload: null },
        { id: 2, name: 'Create Order', url: '/api/orders', method: 'POST', payload: { productId: '', quantity: 1 } },
    ])
    const [newEndpoint, setNewEndpoint] = useState({ name: '', url: '', method: 'GET', payload: '' })
    const [testUrl, setTestUrl] = useState('')
    const [testMethod, setTestMethod] = useState('GET')
    const [testPayload, setTestPayload] = useState('')
    const [testResult, setTestResult] = useState('')
    const [testHistory, setTestHistory] = useState([])

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

    // AI Command Center Handlers
    const handleExecuteAI = () => {
        if (aiCommand.trim() === '') return
        const response = `AI Response to "${aiCommand}" with complexity ${complexity}% and ${isRealTime ? 'real-time' : 'batch'} processing.`
        setAiLogs([...aiLogs, { command: aiCommand, response }])
        setAiCommand('')
    }

    // Database Interactions Handlers
    const addDatabase = () => {
        const newDb = { id: Date.now(), name: 'NewDB', type: 'MySQL', host: 'localhost', port: 3306 }
        setDatabases([...databases, newDb])
    }

    const deleteDatabase = (dbId) => {
        setDatabases(databases.filter(db => db.id !== dbId))
    }

    const executeQuery = () => {
        if (currentQuery.trim() === '') return
        // Simulate query execution
        const simulatedResult = `Executed Query: ${currentQuery}`
        setQueryResult(simulatedResult)
        setQueries([...queries, currentQuery])
        setCurrentQuery('')
    }

    // API Tester Handlers
    const addApiEndpoint = () => {
        if (newEndpoint.name.trim() === '' || newEndpoint.url.trim() === '') return
        const endpoint = { ...newEndpoint, id: Date.now() }
        setApiEndpoints([...apiEndpoints, endpoint])
        setNewEndpoint({ name: '', url: '', method: 'GET', payload: '' })
    }

    const deleteApiEndpoint = (id) => {
        setApiEndpoints(apiEndpoints.filter(ep => ep.id !== id))
    }

    const handleTest = () => {
        if (testUrl.trim() === '') return
        setTestResult('Testing API...')
        // Simulate API call
        setTimeout(() => {
            const response = `API test completed for ${testUrl} with method ${testMethod}. Status: 200 OK`
            setTestResult(response)
            setTestHistory([{ url: testUrl, method: testMethod, result: response }, ...testHistory])
        }, 1500)
    }

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
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
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col p-8 overflow-auto">
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
                            <h2 className="text-2xl mb-4 font-semibold">Dynamic JSON Builder</h2>
                            <div className="border border-gray-700 rounded-lg p-4 max-h-96 overflow-auto">
                                <TreeNode
                                    node={jsonStructure}
                                    onAdd={addNode}
                                    onDelete={deleteNode}
                                    onToggle={toggleNode}
                                    onEdit={editNode}
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
                            <h2 className="text-2xl mb-4 font-semibold">AI Command Center</h2>
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
                                <span>Complexity Level: {complexity}%</span>
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
                            <h2 className="text-2xl mb-4 font-semibold">Database Connections</h2>
                            <div className="flex space-x-2 mb-4">
                                <Button variant="ghost" onClick={addDatabase} className="flex items-center">
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
                                        <Button variant="ghost" size="sm" onClick={() => deleteDatabase(db.id)}>
                                            <Trash size={14} />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-black p-6 rounded-xl">
                            <h2 className="text-2xl mb-4 font-semibold">Query Editor</h2>
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
                                    <pre className="text-sm">{queryResult}</pre>
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
                            <div className="flex space-x-4 mb-4">
                                <select
                                    value={testMethod}
                                    onChange={(e) => setTestMethod(e.target.value)}
                                    className="bg-gray-800 border border-gray-700 text-white rounded px-2"
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
                                <Button className="bg-yellow-600 hover:bg-yellow-700" onClick={handleTest}>
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
                            <div className="flex space-x-4 mb-4">
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
                                    className="bg-gray-800 border border-gray-700 text-white rounded px-2"
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
                                            {ep.payload && <pre className="text-xs bg-gray-700 p-1 rounded mt-1">{JSON.stringify(ep.payload)}</pre>}
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => deleteApiEndpoint(ep.id)}>
                                            <Trash size={14} />
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
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
