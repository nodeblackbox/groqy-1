"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, ChevronDown, File, Folder, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Network } from 'vis-network/standalone';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const FileTree = ({ data, onSelect, currentFile }) => {
    const [expanded, setExpanded] = useState({});

    const toggleExpand = (path) => {
        setExpanded(prev => ({ ...prev, [path]: !prev[path] }));
    };

    const renderTree = (node, path = '') => {
        if (typeof node === 'string')
        {
            return (
                <div key={path} className={`flex items-center space-x-2 py-1 ${currentFile === path ? 'bg-blue-100 rounded' : ''}`}>
                    <File className="w-4 h-4" />
                    <span
                        className="cursor-pointer hover:text-blue-600"
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

const ComponentGraph = ({ components }) => {
    const graphRef = React.useRef(null);

    useEffect(() => {
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

        const network = new Network(graphRef.current, data, options);
        network.on('selectNode', (params) => {
            console.log('Selected node:', params.nodes[0]);
        });

        return () => {
            network.destroy();
        };
    }, [components]);

    return <div ref={graphRef} style={{ height: '400px', width: '100%' }} />;
};

const CodeComplexityChart = ({ complexity }) => {
    const data = [
        { name: 'Cyclomatic', size: complexity.cyclomatic },
        { name: 'Cognitive', size: complexity.cognitive },
        { name: 'Halstead', size: complexity.halstead },
    ];

    return (
        <ResponsiveContainer width="100%" height={200}>
            <Treemap
                data={data}
                dataKey="size"
                ratio={4 / 3}
                stroke="#fff"
                fill="#8884d8"
            >
                <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length)
                    {
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
        </ResponsiveContainer>
    );
};

const CodeBlock = ({ code, language }) => (
    <SyntaxHighlighter language={language} style={dracula}>
        {code}
    </SyntaxHighlighter>
);

const NexusFileAnalyzer = () => {
    const [fileStructure, setFileStructure] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileInsights, setFileInsights] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFileStructure();
    }, []);
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
                    <Progress value={score} className="ml-4 flex-grow" />
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


    const fetchFileStructure = async () => {
        try
        {
            const response = await fetch("/api/get-file-structure");
            const data = await response.json();
            setFileStructure(data.structure);
        } catch (error)
        {
            console.error("Error fetching file structure:", error);
            setError("Failed to fetch file structure. Please try again.");
        }
    };

    const handleFileSelect = useCallback(async (filePath) => {
        setSelectedFile(filePath);
        setIsLoading(true);
        setError(null);
        try
        {
            const response = await fetch("/api/comprehensive-file-insights", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ filePath }),
            });
            const insights = await response.json();
            setFileInsights(insights);
        } catch (error)
        {
            console.error("Error fetching file insights:", error);
            setError("Failed to fetch file insights. Please try again.");
        } finally
        {
            setIsLoading(false);
        }
    }, []);



    const renderInsights = () => {
        if (!fileInsights) return null;

        return (
            <Tabs defaultValue="overview">
                <TabsList>
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
                            <p>Calls: {details.calls.join(', ') || 'None'}</p>
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

    return (
        <Card className="w-full max-w-7xl mx-auto">
            <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-2xl font-bold">Nexus File Analyzer</h2>
                <Button onClick={fetchFileStructure}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                        <h3 className="text-lg font-semibold mb-2">Project Structure</h3>
                        <ScrollArea className="h-[800px] border rounded p-2">
                            {fileStructure && (
                                <FileTree
                                    data={fileStructure}
                                    onSelect={handleFileSelect}
                                    currentFile={selectedFile}
                                />
                            )}
                        </ScrollArea>
                    </div>
                    <div className="col-span-2">
                        <h3 className="text-lg font-semibold mb-2">File Insights</h3>
                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {isLoading ? (
                            <p className="text-xl font-bold animate-pulse">
                                Analyzing code... 🧠💻
                            </p>
                        ) : selectedFile && fileInsights ? (
                            <ScrollArea className="h-[800px] border rounded p-4">
                                <div className="mb-4">
                                    <h4 className="text-lg font-semibold">
                                        🔍 Analyzing: {selectedFile}
                                    </h4>
                                </div>
                                {renderInsights()}
                            </ScrollArea>
                        ) : (
                            <div className="text-center p-8">
                                <p className="text-xl font-semibold mb-4">
                                    👈 Select a file to begin analysis
                                </p>
                                <p className="text-gray-600">
                                    Choose a file from the project structure to see detailed
                                    insights.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default NexusFileAnalyzer;