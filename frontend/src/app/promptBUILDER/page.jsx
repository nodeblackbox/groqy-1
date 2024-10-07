
"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, ChevronDown, File, Folder, PlusCircle, MinusCircle, Copy, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// CustomButton Component
const CustomButton = ({ children, onClick, disabled, variant = 'default', className = '', ...props }) => {
    const baseStyles = 'px-4 py-2 rounded focus:outline-none focus:ring-2';
    const variants = {
        default: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-200 focus:ring-gray-200',
        destructive: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

// TreeView Component
const TreeView = ({ data, onSelect, selectedItems, currentFile }) => {
    const [expanded, setExpanded] = useState({});

    const toggleExpand = (path) => {
        setExpanded(prev => ({ ...prev, [path]: !prev[path] }));
    };

    const renderTree = (node, path = '') => {
        if (typeof node === 'string')
        {
            const isSelected = selectedItems.includes(path);
            return (
                <div key={path} className={`flex items-center space-x-2 py-1 ${currentFile === path ? 'bg-blue-100 rounded' : ''}`}>
                    <File className="w-4 h-4" />
                    <span
                        className={`cursor-pointer hover:text-blue-600 ${isSelected ? 'font-bold' : ''}`}
                        onClick={() => onSelect(path)}
                    >
                        {node}
                    </span>
                </div>
            );
        }

        return Object.entries(node).map(([key, value]) => {
            const currentPath = path ? `${path}/${key}` : key;
            const isExpanded = expanded[currentPath];

            return (
                <div key={currentPath}>
                    <div
                        className="flex items-center space-x-2 py-1 cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleExpand(currentPath)}
                    >
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <Folder className="w-4 h-4" />
                        <span>{key}</span>
                    </div>
                    {isExpanded && (
                        <div className="pl-4">
                            {renderTree(value, currentPath)}
                        </div>
                    )}
                </div>
            );
        });
    };

    return <div className="pl-2">{renderTree(data)}</div>;
};

// SelectedFiles Component
const SelectedFiles = ({ files, onRemove }) => (
    <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">Selected Files:</h4>
        {files.map((file) => (
            <div key={file} className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2">
                <span>{file}</span>
                <CustomButton size="sm" variant="ghost" onClick={() => onRemove(file)}>
                    <MinusCircle className="w-4 h-4" />
                </CustomButton>
            </div>
        ))}
    </div>
);

// CodeBlock Component
const CodeBlock = ({ code, language }) => (
    <SyntaxHighlighter language={language} style={dracula}>
        {code}
    </SyntaxHighlighter>
);

// ComponentGraph Component
const ComponentGraph = ({ components }) => {
    const graphRef = React.useRef(null);

    React.useEffect(() => {
        if (!components || !graphRef.current) return;

        const nodes = Object.keys(components).map(name => ({ id: name, label: name }));
        const edges = [];

        Object.entries(components).forEach(([name, details]) => {
            details.childComponents.forEach(child => {
                edges.push({ from: name, to: child });
            });
        });

        const data = { nodes, edges };
        const options = {
            nodes: {
                shape: 'box',
                font: {
                    face: 'Arial',
                    size: 14,
                },
            },
            edges: {
                arrows: 'to',
            },
            layout: {
                hierarchical: {
                    direction: 'UD',
                    sortMethod: 'directed',
                },
            },
        };

        // Note: You'll need to import the vis-network library and use it here
        // const network = new vis.Network(graphRef.current, data, options);
        // network.on('selectNode', (params) => {
        //     console.log('Selected node:', params.nodes[0]);
        // });

        // return () => {
        //     network.destroy();
        // };
    }, [components]);

    return <div ref={graphRef} style={{ height: '400px', width: '100%' }} />;
};

// CodeComplexityChart Component
const CodeComplexityChart = ({ complexity }) => {
    const data = [
        { name: 'Cyclomatic', size: complexity.cyclomatic },
        { name: 'Cognitive', size: complexity.cognitive },
        { name: 'Halstead', size: complexity.halstead },
    ];

    return (
        <div style={{ width: '100%', height: 200 }}>
            {/* Note: You'll need to import and use a charting library here */}
            {/* <ResponsiveContainer width="100%" height="100%">
                <Treemap
                    data={data}
                    dataKey="size"
                    ratio={4 / 3}
                    stroke="#fff"
                    fill="#8884d8"
                >
                    <Tooltip content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                                <div className="bg-white p-2 border rounded shadow">
                                    <p>{`${data.name}: ${data.size}`}</p>
                                </div>
                            );
                        }
                        return null;
                    }} />
                </Treemap>
            </ResponsiveContainer> */}
        </div>
    );
};

// NexusFileAnalyzer Component
const NexusFileAnalyzer = ({ fileInsights }) => {
    const renderCodeQualityScore = (score) => {
        const getColor = (value) => {
            if (value >= 80) return 'bg-green-500';
            if (value >= 60) return 'bg-yellow-500';
            return 'bg-red-500';
        };

        return (
            <div className="mt-4">
                <h4 className="font-semibold mb-2">Code Quality Score</h4>
                <div className="flex items-center">
                    <div className={`text-2xl font-bold ${getColor(score)} text-white rounded-full w-12 h-12 flex items-center justify-center`}>
                        {score}
                    </div>
                    <div className="ml-4 w-full bg-gray-200 rounded-full h-4">
                        <div className={`${getColor(score)} h-4 rounded-full`} style={{ width: `${score}%` }}></div>
                    </div>
                </div>
            </div>
        );
    };

    const renderAIInsights = (insights) => {
        return (
            <div className="mt-6">
                <h4 className="font-semibold mb-2">AI-Powered Insights</h4>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                    <p className="font-medium">{insights.summary}</p>
                    <ul className="list-disc pl-5 mt-2">
                        {insights.suggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <Tabs defaultValue="overview">
            <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="state">State & Hooks</TabsTrigger>
                <TabsTrigger value="functions">Functions</TabsTrigger>
                <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
                <h4 className="font-semibold">File Path: {fileInsights.filePath}</h4>
                <h4 className="font-semibold mt-2">Imports:</h4>
                <ul className="list-disc pl-5">
                    {fileInsights.imports.map((imp, index) => (
                        <li key={index}>
                            From "{imp.source}":
                            {imp.specifiers
                                .map(
                                    (spec) =>
                                        ` ${spec.name}${spec.importedName && spec.importedName !== spec.name
                                            ? ` (as ${spec.importedName})`
                                            : ""
                                        }`
                                )
                                .join(", ")}
                        </li>
                    ))}
                </ul>
                <h4 className="font-semibold mt-2">Exports:</h4>
                <ul className="list-disc pl-5">
                    {fileInsights.exports.map((exp, index) => (
                        <li key={index}>{exp}</li>
                    ))}
                </ul>
                {renderCodeQualityScore(fileInsights.codeQualityScore)}
                {renderAIInsights(fileInsights.aiInsights)}
            </TabsContent>
            <TabsContent value="components">
                {Object.entries(fileInsights.components || {}).map(([component, details]) => (
                    <div key={component} className="mb-8">
                        <h4 className="font-semibold text-lg">{component}</h4>
                        <p>Type: {details.type}</p>
                        <p>Child Components: {details.childComponents.join(', ') || 'None'}</p>
                        <p>Props: {details.props.join(', ') || 'None'}</p>
                        <p>State Variables: {details.stateVariables.join(', ') || 'None'}</p>
                        <p>Hooks Used: {details.hooks.join(', ') || 'None'}</p>
                        <h5 className="font-semibold mt-2">Code:</h5>
                        <CodeBlock code={details.code} language="jsx" />
                        <h5 className="font-semibold mt-2">Usages:</h5>
                        {details.usages.length > 0 ? (
                            <ul>
                                {details.usages.map((usage, index) => (
                                    <li key={index}>
                                        Line {usage.start.line}, Column {usage.start.column}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No usages found in this file.</p>
                        )}
                    </div>
                ))}
            </TabsContent>
            <TabsContent value="state">
                <h4 className="font-semibold">State Variables:</h4>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Variable</TableHead>
                            <TableHead>Component</TableHead>
                            <TableHead>Initial Value</TableHead>
                            <TableHead>Setter</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Object.entries(fileInsights.stateVariables || {}).map(
                            ([variable, details]) => (
                                <TableRow key={variable}>
                                    <TableCell>{variable}</TableCell>
                                    <TableCell>{details.component}</TableCell>
                                    <TableCell>{details.initialValue}</TableCell>
                                    <TableCell>{details.setterName}</TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
                <h4 className="font-semibold mt-4">Hooks Usage:</h4>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Hook</TableHead>
                            <TableHead>Used In Components</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Object.entries(fileInsights.hooks || {}).map(
                            ([hook, components]) => (
                                <TableRow key={hook}>
                                    <TableCell>{hook}</TableCell>
                                    <TableCell>{components.join(", ")}</TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </TabsContent>
            <TabsContent value="functions">
                {Object.entries(fileInsights.functions || {}).map(([func, details]) => (
                    <div key={func} className="mb-8">
                        <h4 className="font-semibold text-lg">{func}</h4>
                        <p>Parameters: {details.params.join(', ') || 'None'}</p>
                        <p>Calls: {details.calls.join(', ') ||
                            'None'}</p>
                        <p>Body Structure: {details.body.join(', ')}</p>
                        <h5 className="font-semibold mt-2">Code:</h5>
                        <CodeBlock code={details.code} language="jsx" />
                        <h5 className="font-semibold mt-2">Usages:</h5>
                        {details.usages.length > 0 ? (
                            <ul>
                                {details.usages.map((usage, index) => (
                                    <li key={index}>
                                        Line {usage.start.line}, Column {usage.start.column}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No usages found in this file.</p>
                        )}
                    </div>
                ))}
            </TabsContent>
            <TabsContent value="dependencies">
                <h4 className="font-semibold">External Dependencies:</h4>
                <ul className="list-disc pl-5">
                    {fileInsights.dependencies.map((dep, index) => (
                        <li key={index}>{dep}</li>
                    ))}
                </ul>
                <h4 className="font-semibold mt-2">File References:</h4>
                <ul className="list-disc pl-5">
                    {fileInsights.fileReferences.map((ref, index) => (
                        <li key={index}>{ref}</li>
                    ))}
                </ul>
            </TabsContent>
        </Tabs>
    );
};

// Main AdvancedProjectAnalyzer Component
const AdvancedProjectAnalyzer = () => {
    const [apiKey, setApiKey] = useState('');
    const [apiKeyVerified, setApiKeyVerified] = useState(false);
    const [isVerifyingApiKey, setIsVerifyingApiKey] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [knowledgeBase, setKnowledgeBase] = useState('');
    const [promptHistory, setPromptHistory] = useState([]);
    const [selectedPromptType, setSelectedPromptType] = useState('general');
    const [fileStructure, setFileStructure] = useState(null);
    const [fileInsights, setFileInsights] = useState(null);
    const [error, setError] = useState(null);
    const [debugInfo, setDebugInfo] = useState('');

    useEffect(() => {
        // Load saved data from localStorage
        const storedApiKey = localStorage.getItem('groqApiKey');
        if (storedApiKey)
        {
            setApiKey(storedApiKey);
            verifyApiKey(storedApiKey);
        }

        const storedKnowledgeBase = localStorage.getItem('knowledgeBase');
        if (storedKnowledgeBase) setKnowledgeBase(storedKnowledgeBase);

        const storedPromptHistory = localStorage.getItem('promptHistory');
        if (storedPromptHistory) setPromptHistory(JSON.parse(storedPromptHistory));

        // Fetch file structure
        fetchFileStructure();
    }, []);

    const verifyApiKey = async (key) => {
        setIsVerifyingApiKey(true);
        setError(null);
        try
        {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer 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`,
                },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: 'Test' }],
                    model: 'llama-3.2-90b-text-preview', // Ensure the model is specified correctly
                    max_tokens: 5,
                }),
            });

            // Check if the response is okay
            if (!response.ok)
            {
                const errorDetails = await response.json(); // Get the error details
                console.error('API call failed:', errorDetails); // Log the error details
                throw new Error(`API request failed with status ${response.status}: ${JSON.stringify(errorDetails)}`);
            }

            const data = await response.json();
        } catch (error)
        {
            console.error('Error verifying API key:', error);
            setApiKeyVerified(false);
            setError("Failed to verify API key. Please check your key and try again.");
            setDebugInfo(prev => prev + `\nError verifying API key: ${error.message}`);
        } finally
        {
            setIsVerifyingApiKey(false);
        }
    };

    const fetchFileStructure = async () => {
        try
        {
            const response = await fetch("/api/get-file-structure");
            const data = await response.json();
            setFileStructure(data.structure);
            setDebugInfo(prev => prev + `\nFetched file structure.`);
        } catch (error)
        {
            console.error("Error fetching file structure:", error);
            setError("Failed to fetch file structure. Please try again.");
            setDebugInfo(prev => prev + `\nError fetching file structure: ${error.message}`);
        }
    };

    const handleFileSelect = useCallback(async (filePath) => {
        setSelectedItems(prev =>
            prev.includes(filePath)
                ? prev.filter(i => i !== filePath)
                : [...prev, filePath]
        );
    }, []);

    const handleItemRemove = (item) => {
        setSelectedItems(prev => prev.filter(i => i !== item));
    };

    const saveApiKey = () => {
        localStorage.setItem('groqApiKey', apiKey);
        verifyApiKey(apiKey);
    };

    const saveKnowledgeBase = () => {
        localStorage.setItem('knowledgeBase', knowledgeBase);
        alert('Knowledge base saved successfully!');
    };

    const analyzeProject = async () => {
        if (selectedItems.length === 0)
        {
            setError('Please select at least one file for analysis.');
            return;
        }

        if (!apiKeyVerified)
        {
            setError('Please enter and verify your API key before analyzing.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysis('');
        setDebugInfo('Starting analysis...');

        try
        {
            // Fetch file contents
            const fileContentsResponse = await fetch('/api/get-file-contents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ files: selectedItems }),
            });
            const fileContentsData = await fileContentsResponse.json();
            setDebugInfo(prev => prev + `\nFetched file contents.`);
            setFileInsights(fileContentsData);

            // Prepare system prompt
            const systemPrompt = `You are a helpful assistant that analyzes project structures and provides improvement suggestions. 
Focus on the following items: ${selectedItems.join(', ')}. 
Consider this project-specific knowledge: ${knowledgeBase}
The user is requesting a ${selectedPromptType} analysis.
Here are the contents of the selected files:

${selectedItems.map(file => `
File: ${file}
Content:
${fileContentsData.fileContents[file] || 'Content not available'}
`).join('\n\n')}`;

            setDebugInfo(prev => prev + `\nSystem prompt prepared.`);

            // Call AI API
            const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: prompt }
                    ],
                    model: 'gpt-4',
                    temperature: 0.7,
                    max_tokens: 5000,
                }),
            });

            if (!aiResponse.ok)
            {
                throw new Error(`AI API error! Status: ${aiResponse.status}`);
            }

            const aiData = await aiResponse.json();
            setAnalysis(aiData.choices[0].message.content);
            setDebugInfo(prev => prev + `\nAI analysis completed.`);

            // Save prompt to history
            const updatedHistory = [...promptHistory, prompt];
            setPromptHistory(updatedHistory);
            localStorage.setItem('promptHistory', JSON.stringify(updatedHistory));

        } catch (error)
        {
            console.error('Error analyzing project:', error);
            setError("Failed to analyze project. Please check your API key and try again.");
            setDebugInfo(prev => prev + `\nError during analysis: ${error.message}`);
        } finally
        {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <Card className="w-full max-w-6xl mx-auto p-4">
            <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-2xl font-bold">Advanced Project Analyzer</h2>
                <CustomButton onClick={fetchFileStructure} variant="ghost">
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                </CustomButton>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="analyze">
                    <TabsList className="mb-4">
                        <TabsTrigger value="analyze">Analyze</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="analyze">
                        {!apiKeyVerified && (
                            <Alert variant="warning" className="mb-4">
                                <AlertTitle>API Key Not Verified</AlertTitle>
                                <AlertDescription>
                                    Please go to the Settings tab to enter and verify your Groq API key before analyzing.
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Project Structure</h3>
                                <ScrollArea className="h-96 border rounded p-2">
                                    {fileStructure ? (
                                        <TreeView
                                            data={fileStructure}
                                            onSelect={handleFileSelect}
                                            selectedItems={selectedItems}
                                            currentFile={null}
                                        />
                                    ) : (
                                        <p>Loading file structure...</p>
                                    )}
                                </ScrollArea>
                                <SelectedFiles files={selectedItems} onRemove={handleItemRemove} />
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
                                <textarea
                                    className="w-full h-32 p-2 border rounded mt-2"
                                    placeholder="Enter your analysis prompt..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                                <CustomButton onClick={analyzeProject} disabled={isLoading} className="mt-2">
                                    {isLoading ? 'Analyzing...' : 'Analyze Project'}
                                </CustomButton>
                            </div>
                        </div>
                        {analysis && (
                            <div className="mt-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold">Analysis Results:</h3>
                                    <CustomButton onClick={() => copyToClipboard(analysis)} variant="ghost">
                                        <Copy className="mr-2 h-4 w-4" /> Copy Markdown
                                    </CustomButton>
                                </div>
                                <ScrollArea className="h-96 w-full rounded-md border p-4">
                                    <ReactMarkdown
                                        components={{
                                            code({ node, inline, className, children, ...props }) {
                                                const match = /language-(\w+)/.exec(className || '');
                                                return !inline && match ? (
                                                    <SyntaxHighlighter
                                                        language={match[1]}
                                                        style={dracula}
                                                        PreTag="div"
                                                        {...props}
                                                    >
                                                        {String(children).replace(/\n$/, '')}
                                                    </SyntaxHighlighter>
                                                ) : (
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            }
                                        }}
                                    >
                                        {analysis}
                                    </ReactMarkdown>
                                </ScrollArea>
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold">Debug Information:</h3>
                                    <pre className="bg-gray-100 p-2 rounded mt-2 whitespace-pre-wrap">
                                        {debugInfo}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="settings">
                        <div className="space-y-4">
                            <div>
                                <Input
                                    type="password"
                                    placeholder="Enter Groq API Key"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                />
                                <CustomButton
                                    onClick={saveApiKey}
                                    className="mt-2"
                                    disabled={isVerifyingApiKey}
                                >
                                    {isVerifyingApiKey ? 'Verifying...' : 'Save & Verify API Key'}
                                </CustomButton>
                                {apiKeyVerified && (
                                    <Alert variant="success" className="mt-2">
                                        <AlertTitle>API Key Verified</AlertTitle>
                                        <AlertDescription>Your API key has been successfully verified.</AlertDescription>
                                    </Alert>
                                )}
                            </div>
                            <div>
                                <textarea
                                    className="w-full h-32 p-2 border rounded"
                                    placeholder="Enter knowledge base information..."
                                    value={knowledgeBase}
                                    onChange={(e) => setKnowledgeBase(e.target.value)}
                                />
                                <CustomButton onClick={saveKnowledgeBase} className="mt-2">
                                    Save Knowledge Base
                                </CustomButton>
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="history">
                        <ScrollArea className="h-72 w-full rounded-md border p-4">
                            {promptHistory.length > 0 ? (
                                promptHistory.map((historyPrompt, index) => (
                                    <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
                                        {historyPrompt}
                                    </div>
                                ))
                            ) : (
                                <p>No prompt history available.</p>
                            )}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
                {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
};

export default AdvancedProjectAnalyzer;