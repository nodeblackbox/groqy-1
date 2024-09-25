"use client";

import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { RefreshCw, ChevronRight, ChevronDown, File, Folder, Copy, Settings } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';

// Action types for reducer
const ActionTypes = {
    SET_FILE_STRUCTURE: 'SET_FILE_STRUCTURE',
    SET_SELECTED_FILES: 'SET_SELECTED_FILES',
    SET_ANALYSIS: 'SET_ANALYSIS',
    SET_ERROR: 'SET_ERROR',
    SET_LOADING: 'SET_LOADING',
    SET_API_KEY: 'SET_API_KEY',
    SET_KNOWLEDGE_BASE: 'SET_KNOWLEDGE_BASE',
    ADD_TO_PROMPT_HISTORY: 'ADD_TO_PROMPT_HISTORY',
    SET_DEBUG_INFO: 'SET_DEBUG_INFO',
    SET_MODEL: 'SET_MODEL',
};

// Reducer function for state management
const analyzerReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.SET_FILE_STRUCTURE:
            return { ...state, fileStructure: action.payload };
        case ActionTypes.SET_SELECTED_FILES:
            return { ...state, selectedFiles: action.payload };
        case ActionTypes.SET_ANALYSIS:
            return { ...state, analysis: action.payload };
        case ActionTypes.SET_ERROR:
            return { ...state, error: action.payload };
        case ActionTypes.SET_LOADING:
            return { ...state, isLoading: action.payload };
        case ActionTypes.SET_API_KEY:
            return { ...state, apiKey: action.payload };
        case ActionTypes.SET_KNOWLEDGE_BASE:
            return { ...state, knowledgeBase: action.payload };
        case ActionTypes.ADD_TO_PROMPT_HISTORY:
            return { ...state, promptHistory: [...state.promptHistory, action.payload] };
        case ActionTypes.SET_DEBUG_INFO:
            return { ...state, debugInfo: action.payload };
        case ActionTypes.SET_MODEL:
            return { ...state, selectedModel: action.payload };
        default:
            return state;
    }
};

const FileTree = ({ data, onSelect, selectedFiles }) => {
    const [expanded, setExpanded] = useState({});

    const toggleExpand = (path) => {
        setExpanded(prev => ({ ...prev, [path]: !prev[path] }));
    };

    const FileItem = ({ path, name }) => {
        const [{ isDragging }, drag] = useDrag(() => ({
            type: 'FILE',
            item: { path },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }));

        return (
            <div
                ref={drag}
                className={`flex items-center space-x-2 py-1 ${selectedFiles.includes(path) ? 'bg-blue-100 rounded' : ''} ${isDragging ? 'opacity-50' : ''}`}
            >
                <Checkbox
                    checked={selectedFiles.includes(path)}
                    onCheckedChange={() => onSelect(path)}
                />
                <File className="w-4 h-4" />
                <span className="cursor-pointer hover:text-blue-600">{name}</span>
            </div>
        );
    };

    const FolderItem = ({ path, name, children }) => {
        const [{ isOver }, drop] = useDrop(() => ({
            accept: 'FILE',
            drop: (item) => console.log(`Dropped ${item.path} into ${path}`),
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
            }),
        }));

        return (
            <div ref={drop} className={isOver ? 'bg-yellow-100' : ''}>
                <div
                    className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleExpand(path)}
                >
                    {expanded[path] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    <Folder className="w-4 h-4" />
                    <span>{name}</span>
                </div>
                {expanded[path] && <div className="pl-4">{children}</div>}
            </div>
        );
    };

    const renderTree = (node, path = '') => {
        if (typeof node === 'string') {
            return <FileItem key={path} path={path} name={node} />;
        }

        return (
            <FolderItem key={path} path={path} name={path.split('/').pop() || ''}>
                {Object.entries(node).map(([key, value]) => renderTree(value, `${path}/${key}`))}
            </FolderItem>
        );
    };

    return <div className="pl-2">{renderTree(data)}</div>;
};

const CodeBlock = ({ code, language }) => (
    <SyntaxHighlighter language={language} style={dracula}>
        {code}
    </SyntaxHighlighter>
);

const AdvancedProjectAnalyzer = () => {
    const [state, dispatch] = useReducer(analyzerReducer, {
        fileStructure: null,
        selectedFiles: [],
        analysis: '',
        error: null,
        isLoading: false,
        apiKey: '',
        knowledgeBase: '',
        promptHistory: [],
        debugInfo: '',
        selectedModel: 'llama-3.1-70b-versatile',
    });

    const [prompt, setPrompt] = useState('');
    const [selectedPromptType, setSelectedPromptType] = useState('general');

    useEffect(() => {
        // Load saved data from localStorage
        const storedApiKey = localStorage.getItem('groqApiKey');
        if (storedApiKey) dispatch({ type: ActionTypes.SET_API_KEY, payload: storedApiKey });

        const storedKnowledgeBase = localStorage.getItem('knowledgeBase');
        if (storedKnowledgeBase) dispatch({ type: ActionTypes.SET_KNOWLEDGE_BASE, payload: storedKnowledgeBase });

        const storedPromptHistory = localStorage.getItem('promptHistory');
        if (storedPromptHistory) dispatch({ type: ActionTypes.ADD_TO_PROMPT_HISTORY, payload: JSON.parse(storedPromptHistory) });

        // Fetch file structure
        fetchFileStructure();
    }, []);

    const fetchFileStructure = async () => {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        try {
            const response = await fetch("/api/get-file-structure");
            const data = await response.json();
            dispatch({ type: ActionTypes.SET_FILE_STRUCTURE, payload: data.structure });
        } catch (error) {
            console.error("Error fetching file structure:", error);
            dispatch({ type: ActionTypes.SET_ERROR, payload: "Failed to fetch file structure. Please try again." });
        } finally {
            dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        }
    };

    const handleFileSelect = useCallback((filePath) => {
        dispatch({
            type: ActionTypes.SET_SELECTED_FILES, payload:
                state.selectedFiles.includes(filePath)
                    ? state.selectedFiles.filter(f => f !== filePath)
                    : [...state.selectedFiles, filePath]
        });
    }, [state.selectedFiles]);

    const fetchFileContentsAndInsights = async (files) => {
        try {
            // Fetch file contents
            const responseContents = await fetch('/api/get-file-contents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ files }),
            });
            const dataContents = await responseContents.json();
            dispatch({ type: ActionTypes.SET_DEBUG_INFO, payload: `Fetched file contents: ${JSON.stringify(dataContents.fileContents, null, 2)}` });

            // Fetch file insights
            const insightsPromises = files.map(async (file) => {
                const responseInsights = await fetch('/api/comprehensive-file-insights', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filePath: file }),
                });
                const dataInsights = await responseInsights.json();
                return { [file]: dataInsights };
            });
            const insightsArray = await Promise.all(insightsPromises);
            const fileInsights = Object.assign({}, ...insightsArray);
            dispatch({ type: ActionTypes.SET_DEBUG_INFO, payload: `Fetched file insights: ${JSON.stringify(fileInsights, null, 2)}` });

            return { contents: dataContents.fileContents, insights: fileInsights };
        } catch (error) {
            console.error('Error fetching file contents and insights:', error);
            dispatch({ type: ActionTypes.SET_DEBUG_INFO, payload: `Error fetching file contents and insights: ${error.message}` });
            return { contents: {}, insights: {} };
        }
    };

    const analyzeProject = async () => {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        dispatch({ type: ActionTypes.SET_DEBUG_INFO, payload: 'Starting analysis...' });
        try {
            const { contents, insights } = await fetchFileContentsAndInsights(state.selectedFiles);

            const systemPrompt = `You are an advanced AI assistant that analyzes project structures, understands correlations between files, and provides comprehensive insights and suggestions. 
Focus on the following files: ${state.selectedFiles.join(', ')}. 
Utilize the following project-specific knowledge: ${state.knowledgeBase}
The user is requesting a ${selectedPromptType} analysis.
Here are the insights of the selected files:

${state.selectedFiles.map(file => `
File: ${file}
Insights:
${JSON.stringify(insights[file], null, 2)}
Content:
${contents[file] || 'Content not available'}
`).join('\n\n')}

Utilize the information above to provide a detailed analysis, understanding the relationships between files, components, and offering suggestions if appropriate.`;

            dispatch({ type: ActionTypes.SET_DEBUG_INFO, payload: `System prompt: ${systemPrompt}` });

            const response = await fetch('/api/analyze-project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    selectedItems: state.selectedFiles,
                    knowledgeBase: state.knowledgeBase,
                    promptType: selectedPromptType,
                    model: state.selectedModel,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to analyze project');
            }

            const data = await response.json();
            dispatch({ type: ActionTypes.SET_ANALYSIS, payload: data.markdown });
            dispatch({ type: ActionTypes.SET_DEBUG_INFO, payload: `Analysis response: ${data.markdown}` });

            // Save prompt to history
            dispatch({ type: ActionTypes.ADD_TO_PROMPT_HISTORY, payload: prompt });
            localStorage.setItem('promptHistory', JSON.stringify([...state.promptHistory, prompt]));
        } catch (error) {
            console.error('Error analyzing project:', error);
            dispatch({ type: ActionTypes.SET_DEBUG_INFO, payload: `Error analyzing project: ${error.message}` });
            dispatch({ type: ActionTypes.SET_ERROR, payload: 'Error analyzing project. Please check your API key and try again.' });
        } finally {
            dispatch({ type: ActionTypes.SET_LOADING, payload: false });
        }
    };

    const handleApiKeyChange = (e) => {
        dispatch({ type: ActionTypes.SET_API_KEY, payload: e.target.value });
    };

    const saveApiKey = () => {
        localStorage.setItem('groqApiKey', state.apiKey);
        alert('API Key saved successfully!');
    };

    const handleKnowledgeBaseChange = (e) => {
        dispatch({ type: ActionTypes.SET_KNOWLEDGE_BASE, payload: e.target.value });
    };

    const saveKnowledgeBase = () => {
        localStorage.setItem('knowledgeBase', state.knowledgeBase);
        alert('Knowledge base saved successfully!');
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const handleModelChange = (value) => {
        dispatch({ type: ActionTypes.SET_MODEL, payload: value });
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <Card className="w-full max-w-7xl mx-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                    <h2 className="text-2xl font-bold">Advanced Project Analyzer</h2>
                    <div className="flex space-x-2">
                        <Button onClick={fetchFileStructure}>
                            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <Settings className="w-4 h-4 mr-2" /> Settings
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Analyzer Settings</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                                            API Key
                                        </label>
                                        <Input
                                            id="apiKey"
                                            type="password"
                                            value={state.apiKey}
                                            onChange={handleApiKeyChange}
                                            placeholder="Enter your API key"
                                        />
                                        <Button onClick={saveApiKey} className="mt-2">Save API Key</Button>
                                    </div>
                                    <div>
                                        <label htmlFor="knowledgeBase" className="block text-sm font-medium text-gray-700">
                                            Knowledge Base
                                        </label>
                                        <textarea
                                            id="knowledgeBase"
                                            className="w-full h-32 p-2 border rounded"
                                            value={state.knowledgeBase}
                                            onChange={handleKnowledgeBaseChange}
                                            placeholder="Enter knowledge base information..."
                                        />
                                        <Button onClick={saveKnowledgeBase} className="mt-2">Save Knowledge Base</Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="analyze">
                        <TabsList>
                            <TabsTrigger value="analyze">Analyze</TabsTrigger>
                            <TabsTrigger value="history">History</TabsTrigger>
                            <TabsTrigger value="debug">Debug</TabsTrigger>
                        </TabsList>
                        <TabsContent value="analyze">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Project Structure</h3>
                                    <ScrollArea className="h-[400px] border rounded p-2">
                                        {state.fileStructure && (
                                            <FileTree
                                                data={state.fileStructure}
                                                onSelect={handleFileSelect}
                                                selectedFiles={state.selectedFiles}
                                            />
                                        )}
                                    </ScrollArea>
                                    <div className="mt-4">
                                        <h4 className="font-semibold">Selected Files:</h4>
                                        <ul className="list-disc pl-5">
                                            {state.selectedFiles.map(file => (
                                                <li key={file}>{file}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <Select onValueChange={setSelectedPromptType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select prompt type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="general">General Analysis</SelectItem>
                                            <SelectItem value="improvement">Improvement Suggestions</SelectItem>
                                            <SelectItem value="structure">Project Structure</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select onValueChange={handleModelChange} className="mt-2">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="llama-3.1-70b-versatile">llama-3.1-70b-versatile</SelectItem>
                                            <SelectItem value="llama3-groq-70b-8192-tool-use-preview">llama3-groq-70b-8192-tool-use-preview</SelectItem>
                                            <SelectItem value="llama-3.1-8b-instant">llama-3.1-8b-instant</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <textarea
                                        className="w-full h-32 p-2 border rounded mt-2"
                                        placeholder="Enter your analysis prompt..."
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                    />
                                    <Button onClick={analyzeProject} disabled={state.isLoading} className="mt-2">
                                        {state.isLoading ? 'Analyzing...' : 'Analyze Project'}
                                    </Button>
                                </div>
                            </div>
                            {state.analysis && (
                                <div className="mt-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-semibold">Analysis Results:</h3>
                                        <Button onClick={() => copyToClipboard(state.analysis)}>
                                            <Copy className="mr-2 h-4 w-4" /> Copy Markdown
                                        </Button>
                                    </div>
                                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                                        <ReactMarkdown
                                            components={{
                                                code({ node, inline, className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || '');
                                                    return !inline && match ? (
                                                        <CodeBlock
                                                            language={match[1]}
                                                            code={String(children).replace(/\n$/, '')}
                                                            {...props}
                                                        />
                                                    ) : (
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    );
                                                }
                                            }}
                                        >
                                            {state.analysis}
                                        </ReactMarkdown>
                                    </ScrollArea>
                                </div>
                            )}
                        </TabsContent>
                        <TabsContent value="history">
                            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                                {state.promptHistory.map((historyPrompt, index) => (
                                    <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                                        {historyPrompt}
                                    </div>
                                ))}
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="debug">
                            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                                <pre className="whitespace-pre-wrap">{state.debugInfo}</pre>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </DndProvider>
    );
};

export default AdvancedProjectAnalyzer;
