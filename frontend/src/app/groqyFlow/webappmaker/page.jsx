"use client";
import React, { createContext, useState, useCallback, useRef } from 'react';
import { AlertCircle, Loader2, Send, ZapIcon, RefreshCw, Plus, Trash, ArrowUp, ArrowDown, FileCode, ChevronRight, ChevronLeft, Settings } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';


const NeomorphicContainer = ({ children, className = "" }) => (
    <motion.div
        className={`bg-gray-900 rounded-lg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
    >
        {children}
    </motion.div>
);


const DynamicAppDesigner = () => {
    const [apiKey, setApiKey] = useState("");
    const [knowledgeBase, setKnowledgeBase] = useState({});
    const [blocks, setBlocks] = useState([
        { id: 1, name: 'Design', systemPrompt: '', userPrompt: '', structurePrompt: '', output: null }
    ]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [rawResponse, setRawResponse] = useState("");
    const [generatedFiles, setGeneratedFiles] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [configOptions, setConfigOptions] = useState({
        useTypeScript: true,
        useTailwind: true,
        useStateManagement: 'none',
        useTestingFramework: 'jest',
        useCICDPlatform: 'github',
    });

    const fileInputRef = useRef(null);

    const addBlock = useCallback(() => {
        setBlocks(prev => [...prev, {
            id: Date.now(),
            name: `Block ${prev.length + 1}`,
            systemPrompt: '',
            userPrompt: '',
            structurePrompt: '',
            output: null
        }]);
    }, []);

    const removeBlock = useCallback((id) => {
        setBlocks(prev => prev.filter(block => block.id !== id));
    }, []);

    const updateBlock = useCallback((id, field, value) => {
        setBlocks(prev => prev.map(block =>
            block.id === id ? { ...block, [field]: value } : block
        ));
    }, []);

    const moveBlock = useCallback((id, direction) => {
        setBlocks(prev => {
            const index = prev.findIndex(block => block.id === id);
            if ((direction === 'up' && index === 0) || (direction === 'down' && index === prev.length - 1))
            {
                return prev;
            }
            const newBlocks = [...prev];
            const [movedBlock] = newBlocks.splice(index, 1);
            newBlocks.splice(direction === 'up' ? index - 1 : index + 1, 0, movedBlock);
            return newBlocks;
        });
    }, []);

    const processBlocks = useCallback(async () => {
        setIsProcessing(true);
        setError(null);
        try
        {
            let context = JSON.stringify(knowledgeBase);
            for (let i = 0; i < blocks.length; i++)
            {
                const block = blocks[i];
                const response = await callGroqAPI(block.systemPrompt, `${context}\n\n${block.userPrompt}\n\n${block.structurePrompt}`);
                const output = await processBlockOutput(block.name, response);

                setBlocks(prev => prev.map((b, index) =>
                    index === i ? { ...b, output } : b
                ));

                context = JSON.stringify(output);
                updateKnowledgeBase(block.name, output);
            }
        } catch (error)
        {
            setError(`Error processing blocks: ${error.message}`);
        } finally
        {
            setIsProcessing(false);
        }
    }, [apiKey, blocks, knowledgeBase]);

    const callGroqAPI = useCallback(async (systemPrompt, userPrompt) => {
        try
        {
            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt },
                    ],
                    model: "llama-3.1-70b-versatile",
                    temperature: 0.7,
                    max_tokens: 2048,
                    top_p: 1,
                    stream: false,
                    stop: null,
                }),
            });

            if (!response.ok)
            {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content.trim();
            setRawResponse(content);
            return content;
        } catch (error)
        {
            console.error("API call failed:", error);
            throw new Error(`Failed to process with Groq API: ${error.message}`);
        }
    }, [apiKey]);

    const processBlockOutput = useCallback(async (blockName, output) => {
        switch (blockName.toLowerCase())
        {
            case 'design':
            case 'documentation':
                return output;
            case 'extract':
            case 'structure':
                return extractJsonFromResponse(output);
            case 'pages':
            case 'components':
            case 'styles':
            case 'api':
                return extractCodeFromResponse(output);
            default:
                return output;
        }
    }, []);

    const extractJsonFromResponse = (response) => {
        try
        {
            let jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
            if (jsonMatch && jsonMatch[1])
            {
                return JSON.parse(jsonMatch[1].trim());
            }
            jsonMatch = response.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
            if (jsonMatch)
            {
                return JSON.parse(jsonMatch[0].trim());
            }
            throw new Error("No valid JSON content found in the response");
        } catch (error)
        {
            console.error("Failed to extract or parse JSON:", error);
            console.log("Raw response:", response);
            throw new Error(`Failed to extract JSON from response: ${error.message}`);
        }
    };

    const extractCodeFromResponse = (response) => {
        const codeBlocks = response.match(/```[\s\S]*?```/g) || [];
        return codeBlocks.map(block => {
            const [, , code] = block.match(/```(\w+)?\s*([\s\S]*?)```/) || [];
            return code.trim();
        });
    };

    const updateKnowledgeBase = useCallback((blockName, data) => {
        setKnowledgeBase(prev => ({
            ...prev,
            [blockName.toLowerCase()]: data
        }));
    }, []);

    const handleConfigChange = useCallback((key, value) => {
        setConfigOptions(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleFileUpload = useCallback((e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            try
            {
                const config = JSON.parse(event.target.result);
                setApiKey(config.apiKey || '');
                setKnowledgeBase(config.knowledgeBase || {});
                setBlocks(config.blocks || []);
                setConfigOptions(config.configOptions || {});
            } catch (error)
            {
                setError('Failed to parse configuration file');
            }
        };
        reader.readAsText(file);
    }, []);

    const saveConfiguration = useCallback(() => {
        const config = {
            apiKey,
            knowledgeBase,
            blocks,
            configOptions
        };
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        saveAs(blob, 'app-designer-config.json');
    }, [apiKey, knowledgeBase, blocks, configOptions]);

    const downloadFiles = useCallback(() => {
        const zip = new JSZip();
        Object.entries(generatedFiles).forEach(([path, content]) => {
            zip.file(path, content);
        });
        zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, "generated-app.zip");
        });
    }, [generatedFiles]);

    return (
        <div className="min-h-screen bg-gray-950 text-cyan-300 p-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-cyan-400 flex items-center justify-center">
                <ZapIcon size={32} className="mr-2" />
                Dynamic AI Application Designer
            </h1>

            <NeomorphicContainer className="p-6 mb-8">
                <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter Groq API Key"
                    className="w-full p-2 bg-gray-800 text-cyan-300 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
            </NeomorphicContainer>

            <NeomorphicContainer className="p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-cyan-400">Configuration Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="useTypeScript" className="block text-sm font-medium mb-1">
                            Use TypeScript
                        </label>
                        <Checkbox
                            id="useTypeScript"
                            checked={configOptions.useTypeScript}
                            onCheckedChange={(checked) => handleConfigChange('useTypeScript', checked)}
                        />
                    </div>
                    <div>
                        <label htmlFor="useTailwind" className="block text-sm font-medium mb-1">
                            Use Tailwind CSS
                        </label>
                        <Checkbox
                            id="useTailwind"
                            checked={configOptions.useTailwind}
                            onCheckedChange={(checked) => handleConfigChange('useTailwind', checked)}
                        />
                    </div>
                    <div>
                        <label htmlFor="useStateManagement" className="block text-sm font-medium mb-1">
                            State Management
                        </label>
                        <select
                            id="useStateManagement"
                            value={configOptions.useStateManagement}
                            onChange={(e) => handleConfigChange('useStateManagement', e.target.value)}
                            className="w-full p-2 bg-gray-800 text-cyan-300 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="none">None</option>
                            <option value="redux">Redux</option>
                            <option value="mobx">MobX</option>
                            <option value="recoil">Recoil</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="useTestingFramework" className="block text-sm font-medium mb-1">
                            Testing Framework
                        </label>
                        <select
                            id="useTestingFramework"
                            value={configOptions.useTestingFramework}
                            onChange={(e) => handleConfigChange('useTestingFramework', e.target.value)}
                            className="w-full p-2 bg-gray-800 text-cyan-300 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="jest">Jest</option>
                            <option value="mocha">Mocha</option>
                            <option value="cypress">Cypress</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="useCICDPlatform" className="block text-sm font-medium mb-1">
                            CI/CD Platform
                        </label>
                        <select
                            id="useCICDPlatform"
                            value={configOptions.useCICDPlatform}
                            onChange={(e) => handleConfigChange('useCICDPlatform', e.target.value)}
                            className="w-full p-2 bg-gray-800 text-cyan-300 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="github">GitHub Actions</option>
                            <option value="gitlab">GitLab CI/CD</option>
                            <option value="circleci">CircleCI</option>
                            <option value="travisci">Travis CI</option>
                        </select>
                    </div>
                </div>
            </NeomorphicContainer>

            <NeomorphicContainer className="p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-cyan-400">Prompt Blocks</h2>
                {blocks.map((block, index) => (
                    <div key={block.id} className="mb-4 p-4 border rounded bg-gray-800">
                        <div className="flex justify-between items-center mb-2">
                            <Input
                                value={block.name}
                                onChange={(e) => updateBlock(block.id, 'name', e.target.value)}
                                className="font-bold bg-gray-700 text-cyan-300 border-gray-600"
                            />
                            <div>
                                <Button onClick={() => moveBlock(block.id, 'up')} disabled={index === 0} className="p-1 mr-1">
                                    <ArrowUp size={16} />
                                </Button>
                                <Button onClick={() => moveBlock(block.id, 'down')} disabled={index === blocks.length - 1} className="p-1 mr-1">
                                    <ArrowDown size={16} />
                                </Button>
                                <Button onClick={() => removeBlock(block.id)} className="p-1 text-red-500">
                                    <Trash size={16} />
                                </Button>
                            </div>
                        </div>
                        <Textarea
                            value={block.systemPrompt}
                            onChange={(e) => updateBlock(block.id, 'systemPrompt', e.target.value)}
                            placeholder="System Prompt"
                            className="w-full p-2 bg-gray-700 text-cyan-300 border-gray-600 rounded mb-2"
                        />
                        <Textarea
                            value={block.userPrompt}
                            onChange={(e) => updateBlock(block.id, 'userPrompt', e.target.value)}
                            placeholder="User Prompt"
                            className="w-full p-2 bg-gray-700 text-cyan-300 border-gray-600 rounded mb-2"
                        />
                        <Textarea
                            value={block.structurePrompt}
                            onChange={(e) => updateBlock(block.id, 'structurePrompt', e.target.value)}
                            placeholder="Structure Prompt"
                            className="w-full p-2 bg-gray-700 text-cyan-300 border-gray-600 rounded mb-2"
                        />
                        {block.output && (
                            <div className="mt-2">
                                <h4 className="font-semibold text-cyan-400">Output:</h4>
                                <pre className="bg-gray-900 p-2 rounded overflow-x-auto text-sm text-cyan-300">
                                    {typeof block.output === 'string'
                                        ? block.output
                                        : JSON.stringify(block.output, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                ))}
                <Button onClick={addBlock} className="mt-2 bg-cyan-600 text-white">
                    <Plus size={16} className="mr-2" /> Add Block
                </Button>
            </NeomorphicContainer>

            <NeomorphicContainer className="p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-cyan-400">Actions</h2>
                    <div>
                        <Button onClick={processBlocks} disabled={isProcessing || !apiKey} className="mr-2 bg-cyan-600 text-white">
                            {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" />}
                            Process Blocks
                        </Button>
                        <Button onClick={saveConfiguration} className="mr-2 bg-purple-600 text-white">
                            Save Configuration
                        </Button>
                        <label className="bg-orange-600 text-white p-2 rounded cursor-pointer">
                            Load Configuration
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2 text-cyan-400">Raw API Response:</h3>
                    <pre className="bg-gray-800 p-4 rounded overflow-x-auto text-sm text-cyan-300">
                        {rawResponse}
                    </pre>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2 text-cyan-400">Generated Files:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(generatedFiles).map(([path, content]) => (
                            <div key={path} className="bg-gray-800 p-4 rounded">
                                <h4 className="text-cyan-400 mb-2">{path}</h4>
                                <pre className="text-sm text-cyan-300 overflow-x-auto">
                                    <code>{typeof content === 'string' ? content.slice(0, 100) : JSON.stringify(content, null, 2).slice(0, 100)}...</code>
                                </pre>
                            </div>
                        ))}
                    </div>
                    {Object.keys(generatedFiles).length > 0 && (
                        <Button
                            onClick={downloadFiles}
                            className="mt-4 bg-cyan-600 text-white"
                        >
                            <FileCode className="mr-2" />
                            Download Generated Files
                        </Button>
                    )}
                </div>
            </NeomorphicContainer>
        </div>
    );
};

export default DynamicAppDesigner;