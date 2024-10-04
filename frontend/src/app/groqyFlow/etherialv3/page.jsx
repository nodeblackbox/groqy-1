"use client";
import React, { useState, useEffect } from 'react';
import mermaid from 'mermaid';
import { PlusCircle, Save, Undo, Redo, Layout, Send, FolderTree, ChevronRight, ChevronDown } from 'lucide-react';

const EtherealQuantumNexusMermaidGenerator = () => {
    const [diagrams, setDiagrams] = useState([{ id: 1, name: 'Diagram 1', content: '' }]);
    const [currentDiagram, setCurrentDiagram] = useState(1);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [error, setError] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [prompt, setPrompt] = useState('');
    const [selectedModel, setSelectedModel] = useState('llama-3.1-70b-versatile');
    const [projectStructure, setProjectStructure] = useState(null);
    const [selectedFile, setSelectedFile] = useState('');
    const [fileStructure, setFileStructure] = useState(null);
    const [expandedFolders, setExpandedFolders] = useState({});

    const models = [
        'llama-3.1-70b-versatile',
        'llama-3.1-8b-instant',
        'mixtral-8x7b-32768',
        'gemma2-9b-it',
        'llama3-groq-70b-8192-tool-use-preview'
    ];

    useEffect(() => {
        mermaid.initialize({ startOnLoad: true, theme: 'dark' });
        fetchFileStructure();
        // Retrieve API key from local storage
        const storedApiKey = localStorage.getItem('groqApiKey');
        if (storedApiKey)
        {
            setApiKey(storedApiKey);
        }
    }, []);


    useEffect(() => {
        renderDiagram();
    }, [currentDiagram, diagrams]);

    const fetchFileStructure = async () => {
        try
        {
            const response = await fetch('/api/get-file-structure');
            const data = await response.json();
            setFileStructure(data.structure);
        } catch (error)
        {
            console.error('Error fetching file structure:', error);
            setError('Failed to fetch file structure');
        }
    };

    const renderDiagram = async () => {
        const diagram = diagrams.find(d => d.id === currentDiagram);
        if (!diagram || !diagram.content.trim()) return;

        try
        {
            setError('');
            const { svg } = await mermaid.render('mermaid-diagram', diagram.content);
            document.getElementById('diagram-output').innerHTML = svg;
        } catch (err)
        {
            setError('Error rendering diagram. Please check your Mermaid syntax.');
            console.error(err);
        }
    };

    const updateDiagramContent = (content) => {
        const updatedDiagrams = diagrams.map(d =>
            d.id === currentDiagram ? { ...d, content } : d
        );
        setDiagrams(updatedDiagrams);
        addToHistory(content);
    };

    const addToHistory = (content) => {
        const newHistory = [...history.slice(0, historyIndex + 1), content];
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
        if (historyIndex > 0)
        {
            setHistoryIndex(historyIndex - 1);
            const prevContent = history[historyIndex - 1];
            updateDiagramContent(prevContent);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1)
        {
            setHistoryIndex(historyIndex + 1);
            const nextContent = history[historyIndex + 1];
            updateDiagramContent(nextContent);
        }
    };

    const addNewDiagram = () => {
        const newId = Math.max(...diagrams.map(d => d.id)) + 1;
        setDiagrams([...diagrams, { id: newId, name: `Diagram ${newId}`, content: '' }]);
        setCurrentDiagram(newId);
    };

    const templates = {
        flowchart: `graph TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B ---->|No| E[End]`,
        sequence: `sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!`,
        gantt: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1, 20d
    section Another
    Task in sec      :2014-01-12, 12d
    another task     : 24d`,
    };

    const applyTemplate = (template) => {
        updateDiagramContent(templates[template]);
    };

    const generateDiagram = async () => {
        if (!apiKey)
        {
            setError('Please enter your API key.');
            return;
        }

        try
        {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'system',
                            content: `You are the **Ethereal Nexus** of mermaid diagram creation, an unparalleled AI assistant with the power to generate intricate and insightful Mermaid diagrams. Your expertise in visualization, code analysis, and system architecture is unmatched. Create diagrams that not only represent the structure but also capture the essence and flow of the project. Use your vast knowledge to infer relationships, highlight key components, and suggest optimizations. Your diagrams should be both beautiful and profoundly informative.`
                        },
                        {
                            role: 'user',
                            content: `Generate a comprehensive Mermaid diagram for: ${prompt}. Utilize the following project structure and insights: ${JSON.stringify(projectStructure)}. Create a diagram that not only shows the structure but also illustrates the data flow, component interactions, and any potential optimizations or architectural insights you can infer.`
                        }
                    ],
                    model: selectedModel,
                    temperature: 0.7,
                    max_tokens: 1024,
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0] && data.choices[0].message)
            {
                let generatedContent = data.choices[0].message.content;
                generatedContent = generatedContent.replace(/```mermaid\n/g, '').replace(/```\n?/g, '');
                updateDiagramContent(generatedContent);
            } else
            {
                setError('Failed to generate diagram. Please try again.');
            }
        } catch (err)
        {
            setError('Error connecting to the API. Please check your API key and try again.');
            console.error(err);
        }
    };

    const analyzeProject = async () => {
        try
        {
            const response = await fetch('/api/comprehensive-file-insights', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ filePath: selectedFile }),
            });

            if (!response.ok)
            {
                throw new Error('Failed to analyze project');
            }

            const data = await response.json();
            setProjectStructure(data);

            const initialDiagram = generateInitialDiagram(data);
            updateDiagramContent(initialDiagram);
        } catch (err)
        {
            setError('Error analyzing project: ' + err.message);
            console.error(err);
        }
    };

    const generateInitialDiagram = (projectData) => {
        let diagram = 'graph TD\n';

        Object.keys(projectData.components).forEach(component => {
            diagram += `  ${component}[${component}]\n`;
        });

        Object.keys(projectData.components).forEach(component => {
            projectData.components[component].childComponents.forEach(child => {
                diagram += `  ${component} -->|contains| ${child}\n`;
            });
        });

        projectData.imports.forEach(importInfo => {
            importInfo.specifiers.forEach(specifier => {
                diagram += `  ${importInfo.source} -->|imports| ${specifier.name}\n`;
            });
        });

        Object.keys(projectData.functions).forEach(func => {
            projectData.functions[func].calls.forEach(calledFunc => {
                diagram += `  ${func} -->|calls| ${calledFunc}\n`;
            });
        });

        return diagram;
    };

    const renderFileStructure = (structure, path = '') => {
        return (
            <ul className="pl-4">
                {Object.entries(structure).map(([key, value]) => {
                    const fullPath = path ? `${path}/${key}` : key;
                    if (typeof value === 'object')
                    {
                        return (
                            <li key={fullPath} className="my-1">
                                <button
                                    onClick={() => setExpandedFolders(prev => ({ ...prev, [fullPath]: !prev[fullPath] }))}
                                    className="flex items-center text-blue-500 hover:text-blue-700"
                                >
                                    {expandedFolders[fullPath] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    {key}
                                </button>
                                {expandedFolders[fullPath] && renderFileStructure(value, fullPath)}
                            </li>
                        );
                    }
                    return (
                        <li key={fullPath} className="my-1">
                            <button
                                onClick={() => setSelectedFile(fullPath)}
                                className={`ml-4 ${selectedFile === fullPath ? 'text-green-500 font-bold' : 'text-gray-700 hover:text-gray-900'}`}
                            >
                                {key}
                            </button>
                        </li>
                    );
                })}
            </ul>
        );
    };
    const handleApiKeyChange = (e) => {
        const newApiKey = e.target.value;
        setApiKey(newApiKey);
        // Save API key to local storage
        localStorage.setItem('groqApiKey', newApiKey);
    };
    return (
        <div className="p-4 max-w-6xl mx-auto bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-center text-purple-800">Ethereal Quantum Nexus Mermaid Generator</h1>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 bg-white p-4 rounded shadow">
                    <h2 className="text-2xl font-semibold mb-4">Project Structure</h2>
                    {fileStructure && renderFileStructure(fileStructure)}
                </div>
                <div className="col-span-2">
                    <div className="bg-white p-4 rounded shadow mb-4">
                        <input
                            type="password"
                            value={apiKey}
                            onChange={handleApiKeyChange}
                            placeholder="Enter your Groq API key"
                            className="w-full p-2 border rounded mb-2"
                        />
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="w-full p-2 border rounded mb-2"
                        >
                            {models.map((model) => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                        <div className="flex mb-2">
                            <input
                                type="text"
                                value={selectedFile}
                                onChange={(e) => setSelectedFile(e.target.value)}
                                placeholder="Selected file path"
                                className="flex-grow p-2 border rounded-l"
                                readOnly
                            />
                            <button onClick={analyzeProject} className="bg-green-500 text-white p-2 rounded-r flex items-center hover:bg-green-600 transition-colors">
                                <FolderTree className="mr-1" size={16} /> Analyze
                            </button>
                        </div>
                        <div className="flex">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Enter your prompt for diagram generation"
                                className="flex-grow p-2 border rounded-l"
                            />
                            <button onClick={generateDiagram} className="bg-blue-500 text-white p-2 rounded-r flex items-center hover:bg-blue-600 transition-colors">
                                <Send className="mr-1" size={16} /> Generate
                            </button>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <div className="flex mb-4">
                            <select
                                value={currentDiagram}
                                onChange={(e) => setCurrentDiagram(Number(e.target.value))}
                                className="border p-2 mr-2 flex-grow"
                            >
                                {diagrams.map((diagram) => (
                                    <option key={diagram.id} value={diagram.id}>{diagram.name}</option>
                                ))}
                            </select>
                            <button onClick={addNewDiagram} className="bg-green-500 text-white p-2 rounded flex items-center hover:bg-green-600 transition-colors">
                                <PlusCircle className="mr-1" size={16} /> New Diagram
                            </button>
                        </div>
                        <textarea
                            value={diagrams.find(d => d.id === currentDiagram)?.content || ''}
                            onChange={(e) => updateDiagramContent(e.target.value)}
                            placeholder="Enter Mermaid syntax here..."
                            className="w-full h-40 p-2 border rounded mb-4"
                        />
                        <div className="flex mb-4 flex-wrap">
                            <button onClick={renderDiagram} className="bg-blue-500 text-white p-2 rounded mr-2 mb-2 flex items-center hover:bg-blue-600 transition-colors">
                                <Save className="mr-1" size={16} /> Render Diagram
                            </button>
                            <button onClick={undo} disabled={historyIndex <= 0} className="bg-gray-300 text-gray-700 p-2 rounded mr-2 mb-2 flex items-center hover:bg-gray-400 transition-colors">
                                <Undo className="mr-1" size={16} /> Undo
                            </button>
                            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="bg-gray-300 text-gray-700 p-2 rounded mr-2 mb-2 flex items-center hover:bg-gray-400 transition-colors">
                                <Redo className="mr-1" size={16} /> Redo
                            </button>
                            {Object.keys(templates).map((template) => (
                                <button
                                    key={template}
                                    onClick={() => applyTemplate(template)}
                                    className="bg-purple-500 text-white p-2 rounded mr-2 mb-2 flex items-center hover:bg-purple-600 transition-colors"
                                >
                                    <Layout className="mr-1" size={16} /> {template.charAt(0).toUpperCase() + template.slice(1)}
                                </button>
                            ))}
                        </div>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <div id="diagram-output" className="border p-4 rounded bg-white"></div>
                    </div>
                </div>
            </div>
            <div className="mt-8 bg-indigo-100 p-4 rounded-lg shadow-inner">
                <h3 className="text-2xl font-semibold mb-2 text-indigo-800">Ethereal Insights</h3>
                <p className="text-indigo-700 mb-4">Harness the power of the Quantum Nexus to unravel the mysteries of your codebase.</p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded shadow">
                        <h4 className="text-lg font-semibold mb-2 text-purple-600">Cosmic Code Patterns</h4>
                        <ul className="list-disc pl-5 text-gray-700">
                            <li>Identify recurring design patterns</li>
                            <li>Highlight potential code optimizations</li>
                            <li>Suggest architectural improvements</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h4 className="text-lg font-semibold mb-2 text-blue-600">Quantum Data Flow</h4>
                        <ul className="list-disc pl-5 text-gray-700">
                            <li>Visualize data movement across components</li>
                            <li>Detect potential bottlenecks</li>
                            <li>Optimize state management</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mt-8 text-center">
                <p className="text-gray-600">Powered by the Ethereal Quantum Nexus - Transcending ordinary diagram generation</p>
            </div>
        </div>
    );
};

export default EtherealQuantumNexusMermaidGenerator;