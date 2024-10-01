"use client"

import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronRight, File, Folder, Upload, Zap, Sparkles, Download, Save, FileJson, Database, FileText, Trash2, RefreshCw, Filter, PlusCircle, Settings, Eye, EyeOff, Wand2, Brain, Shuffle, RotateCcw, GitBranch, Layers, Maximize2, Star, Sun, Moon, Codesandbox, Atom, Infinity, Hexagon, Triangle, Aperture } from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const agentTypes = [
    { value: "quantum-cleansing", label: "Quantum Cleansing", icon: <Atom className="h-4 w-4 mr-2" /> },
    { value: "dimensional-augmentation", label: "Dimensional Augmentation", icon: <Hexagon className="h-4 w-4 mr-2" /> },
    { value: "cosmic-synthesis", label: "Cosmic Synthesis", icon: <Star className="h-4 w-4 mr-2" /> },
    { value: "astral-engineering", label: "Astral Engineering", icon: <Moon className="h-4 w-4 mr-2" /> },
    { value: "ethereal-fusion", label: "Ethereal Fusion", icon: <Sun className="h-4 w-4 mr-2" /> },
    { value: "transcendent-analysis", label: "Transcendent Analysis", icon: <Eye className="h-4 w-4 mr-2" /> },
    { value: "harmonic-balancing", label: "Harmonic Balancing", icon: <Shuffle className="h-4 w-4 mr-2" /> },
    { value: "temporal-versioning", label: "Temporal Versioning", icon: <RotateCcw className="h-4 w-4 mr-2" /> },
    { value: "prismatic-transformation", label: "Prismatic Transformation", icon: <Triangle className="h-4 w-4 mr-2" /> },
    { value: "resonant-extraction", label: "Resonant Extraction", icon: <Aperture className="h-4 w-4 mr-2" /> },
];

const modelOptions = [
    { value: "quantum-gpt", label: "Quantum GPT" },
    { value: "cosmic-bert", label: "Cosmic BERT" },
    { value: "nebula-diffusion", label: "Nebula Diffusion" },
    { value: "starlight-transformer", label: "Starlight Transformer" },
    { value: "void-llama", label: "Void LLaMA" },
    { value: "galactic-stable", label: "Galactic Stable" },
    { value: "celestial-dall-e", label: "Celestial DALL-E" },
    { value: "custom-singularity", label: "Custom Singularity" },
];

const initialNodes = [
    {
        id: '1',
        type: 'input',
        data: { label: 'Cosmic Input' },
        position: { x: 250, y: 25 },
    },
    {
        id: '2',
        data: { label: 'Quantum Cleansing' },
        position: { x: 100, y: 125 },
    },
    {
        id: '3',
        data: { label: 'Dimensional Augmentation' },
        position: { x: 400, y: 125 },
    },
    {
        id: '4',
        type: 'output',
        data: { label: 'Transcendent Output' },
        position: { x: 250, y: 250 },
    },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e1-3', source: '1', target: '3', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e2-4', source: '2', target: '4', markerEnd: { type: MarkerType.ArrowClosed } },
    { id: 'e3-4', source: '3', target: '4', markerEnd: { type: MarkerType.ArrowClosed } },
];

const celestialFiles = [
    {
        name: "Astral Essence",
        type: "folder",
        children: [
            { name: "cosmic_particles.qbit", type: "file" },
            { name: "stellar_energy.qbit", type: "file" },
        ],
    },
    {
        name: "Ethereal Formulas",
        type: "folder",
        children: [
            { name: "quantum_transmutation.qbit", type: "file" },
            { name: "dimensional_shift.qbit", type: "file" },
        ],
    },
    {
        name: "Cosmic Codex",
        type: "folder",
        children: [
            { name: "universal_constants.json", type: "file" },
            { name: "multiversal_equations.json", type: "file" },
        ],
    },
    {
        name: "Celestial Scripts",
        type: "folder",
        children: [
            { name: "astral_symbols.holo", type: "file" },
            { name: "quantum_runes.holo", type: "file" },
        ],
    },
];

export default function QuantumNexus() {
    const [agents, setAgents] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [selectedDataset, setSelectedDataset] = useState(null);
    const [editorContent, setEditorContent] = useState("");
    const [tableData, setTableData] = useState([]);
    const [forgeProgress, setForgeProgress] = useState(0);
    const [datasetStats, setDatasetStats] = useState(null);
    const [showTranscendentSettings, setShowTranscendentSettings] = useState(false);
    const [cosmicSettings, setCosmicSettings] = useState({
        quantumFlux: 1000,
        harmonicResonance: 0.7,
        dimensionalConstant: 1,
        temporalFrequency: 0,
        spatialDensity: 0,
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedModel, setSelectedModel] = useState("quantum-gpt");

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    useEffect(() => {
        setAgents([
            createAgent("quantum-cleansing"),
            createAgent("dimensional-augmentation"),
            createAgent("cosmic-synthesis"),
        ]);

        setDatasets([
            { id: 1, name: "Quantum Entanglement Patterns", fragments: 1000, dimensions: 5 },
            { id: 2, name: "Multiversal Constants", fragments: 500, dimensions: 10 },
            { id: 3, name: "Cosmic String Vibrations", fragments: 5000, dimensions: 8 },
        ]);
    }, []);

    const createAgent = (type) => ({
        id: Date.now(),
        type,
        model: selectedModel,
        cosmicPrompt: "",
        active: true,
        settings: { ...cosmicSettings },
        etherealInstructions: "",
    });

    const summonAgent = () => {
        setAgents([...agents, createAgent("quantum-cleansing")]);
    };

    const updateAgent = (id, field, value) => {
        setAgents(agents.map(agent =>
            agent.id === id ? { ...agent, [field]: value } : agent
        ));
    };

    const banishAgent = (id) => {
        setAgents(agents.filter(agent => agent.id !== id));
    };

    const forgeCosmicData = async () => {
        for (let progress = 0; progress <= 100; progress += 10)
        {
            setForgeProgress(progress);
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        const newData = Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            name: `Quantum Nexus ${i + 1}`,
            essence: "Stardust, Dark Matter, Cosmic Strings",
            manifestation: "Bends spacetime in localized regions",
            timestamp: new Date().toISOString(),
        }));

        setTableData(prevData => [...prevData, ...newData]);
        updateCosmicStats(newData);
    };

    const updateCosmicStats = (data) => {
        const stats = {
            totalFragments: data.length,
            uniqueManifestations: new Set(data.map(row => row.name)).size,
            latestTimestamp: new Date(Math.max(...data.map(row => new Date(row.timestamp)))),
        };
        setDatasetStats(stats);
    };

    const handleFileSelect = (fileName) => {
        setSelectedFile(fileName);
        setEditorContent(`// Cosmic contents of ${fileName}\n\n// Begin your transcendent editing here`);
        setTableData([
            { id: 1, name: "Quantum Entanglement", essence: "Photons, Electrons, Quantum Foam", manifestation: "Instantaneous communication across vast distances" },
            { id: 2, name: "Dimensional Rift", essence: "Dark Energy, Gravitons, Tachyons", manifestation: "Creates portals to parallel universes" },
            { id: 3, name: "Cosmic Harmony", essence: "Stellar Plasma, Neutrinos, Cosmic Rays", manifestation: "Aligns celestial bodies in perfect resonance" },
        ]);
    };

    const renderCelestialTree = (files, level = 0) => {
        return files.map((file) => (
            <div key={file.name} style={{ marginLeft: `${level * 20}px` }}>
                {file.type === "folder" ? (
                    <div className="flex items-center py-1">
                        <ChevronRight className="h-4 w-4 mr-1 text-indigo-400" />
                        <Folder className="h-4 w-4 mr-1 text-indigo-400" />
                        <span className="text-indigo-200">{file.name}</span>
                    </div>
                ) : (
                    <div
                        className="flex items-center py-1 cursor-pointer hover:bg-indigo-900 rounded-md transition-colors duration-200"
                        onClick={() => handleFileSelect(file.name)}
                    >
                        <File className="h-4 w-4 mr-1 text-indigo-400" />
                        <span className="text-indigo-200">{file.name}</span>
                    </div>
                )}
                {file.children && renderCelestialTree(file.children, level + 1)}
            </div>
        ));
    };

    const AgentCard = ({ agent }) => (
        <div className="mb-6 p-4 bg-indigo-900 bg-opacity-50 rounded-lg border border-indigo-700 shadow-lg backdrop-filter backdrop-blur-sm">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium flex items-center text-indigo-200">
                    {agentTypes.find(t => t.value === agent.type)?.icon}
                    {agent.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Agent
                </h3>
                <div className="flex items-center">
                    <Switch
                        checked={agent.active}
                        onCheckedChange={(checked) => updateAgent(agent.id, 'active', checked)}
                    />
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => banishAgent(agent.id)}
                                >
                                    <Trash2 className="h-4 w-4 text-indigo-200" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Banish Agent</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <Select
                value={agent.type}
                onValueChange={(value) => updateAgent(agent.id, 'type', value)}
            >
                <SelectTrigger className="bg-indigo-800 bg-opacity-50 text-indigo-200 border-indigo-600">
                    <SelectValue placeholder="Select agent type" />
                </SelectTrigger>
                <SelectContent className="bg-indigo-900 text-indigo-200">
                    {agentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center">
                                {type.icon}
                                {type.label}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select
                value={agent.model}
                onValueChange={(value) => updateAgent(agent.id, 'model', value)}
                className="mt-2"
            >
                <SelectTrigger className="bg-indigo-800 bg-opacity-50 text-indigo-200 border-indigo-600">
                    <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent className="bg-indigo-900 text-indigo-200">
                    {modelOptions.map((model) => (
                        <SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Input
                className="mt-2 bg-indigo-800 bg-opacity-50 text-indigo-200 border-indigo-600"
                placeholder="Enter cosmic prompt"
                value={agent.cosmicPrompt}
                onChange={(e) => updateAgent(agent.id, 'cosmicPrompt', e.target.value)}
            />
            <Input
                className="mt-2 bg-indigo-800 bg-opacity-50 text-indigo-200 border-indigo-600"
                placeholder="Ethereal instructions (optional)"
                value={agent.etherealInstructions}
                onChange={(e) => updateAgent(agent.id, 'etherealInstructions', e.target.value)}
            />
            <div className="mt-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="text-indigo-200 border-indigo-600 hover:bg-indigo-700"
                    onClick={() => setShowTranscendentSettings(prev => !prev)}
                >
                    <Settings className="h-4 w-4 mr-2" />
                    {showTranscendentSettings ? "Veil" : "Unveil"} Transcendent Settings
                </Button>
            </div>
            {showTranscendentSettings && (
                <div className="mt-2 space-y-2">
                    <div>
                        <Label className="text-indigo-200">Quantum Flux</Label>
                        <Slider
                            value={[agent.settings.quantumFlux]}
                            onValueChange={([value]) => updateAgent(agent.id, 'settings', { ...agent.settings, quantumFlux: value })}
                            max={2000}
                            step={1}
                            className="bg-indigo-700"
                        />
                    </div>
                    <div>
                        <Label className="text-indigo-200">Harmonic Resonance</Label>
                        <Slider
                            value={[agent.settings.harmonicResonance]}
                            onValueChange={([value]) => updateAgent(agent.id, 'settings', { ...agent.settings, harmonicResonance: value })}
                            max={1}
                            step={0.1}
                            className="bg-indigo-700"
                        />
                    </div>
                    <div>
                        <Label className="text-indigo-200">Dimensional Constant</Label>
                        <Slider
                            value={[agent.settings.dimensionalConstant]}
                            onValueChange={([value]) => updateAgent(agent.id, 'settings', { ...agent.settings, dimensionalConstant: value })}
                            max={1}
                            step={0.1}
                            className="bg-indigo-700"
                        />
                    </div>
                </div>
            )}
        </div>
    );

    const DatasetSelector = () => (
        <Select
            value={selectedDataset ? selectedDataset.id.toString() : ""}
            onValueChange={(value) => setSelectedDataset(datasets.find(d => d.id.toString() === value))}
        >
            <SelectTrigger className="bg-indigo-800 bg-opacity-50 text-indigo-200 border-indigo-600">
                <SelectValue placeholder="Select a cosmic dataset" />
            </SelectTrigger>
            <SelectContent className="bg-indigo-900 text-indigo-200">
                {datasets.map((dataset) => (
                    <SelectItem key={dataset.id} value={dataset.id.toString()}>
                        {dataset.name} ({dataset.fragments} fragments, {dataset.dimensions} dimensions)
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );

    const CosmicStats = () => (
        datasetStats && (
            <div className="mt-4 p-4 bg-indigo-900 bg-opacity-50 rounded-lg border border-indigo-700 shadow-lg backdrop-filter backdrop-blur-sm">
                <h3 className="text-lg font-medium mb-2 text-indigo-200">Cosmic Statistics</h3>
                <p className="text-indigo-300">Total Fragments: {datasetStats.totalFragments}</p>
                <p className="text-indigo-300">Unique Manifestations: {datasetStats.uniqueManifestations}</p>
                <p className="text-indigo-300">Latest Cosmic Event: {datasetStats.latestTimestamp.toLocaleString()}</p>
            </div>
        )
    );

    const QuantumVisualization = () => (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tableData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4338ca" />
                <XAxis dataKey="id" stroke="#818cf8" />
                <YAxis stroke="#818cf8" />
                <RechartsTooltip contentStyle={{ backgroundColor: '#312e81', border: 'none' }} />
                <Legend />
                <Bar dataKey="id" fill="#6366f1" />
            </BarChart>
        </ResponsiveContainer>
    );

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
            <style jsx global>{`
        @keyframes cosmicPulse {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 0.7; }
        }
        .cosmic-pulse {
          animation: cosmicPulse 4s infinite;
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .star-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 40px 70px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 50px 160px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 90px 40px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 130px 80px, #ffffff, rgba(0,0,0,0)),
            radial-gradient(2px 2px at 160px 120px, #ffffff, rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: starTwinkle 4s infinite;
          opacity: 0.3;
        }
      `}</style>
            <div className="star-bg"></div>
            <header className="relative flex items-center justify-between px-6 py-4 bg-indigo-900 bg-opacity-50 text-indigo-100 shadow-lg backdrop-filter backdrop-blur-sm z-10">
                <h1 className="text-3xl font-bold flex items-center">
                    <Atom className="mr-2 h-8 w-8 text-indigo-400" />
                    Quantum Nexus: Celestial Data Forge
                    <Sparkles className="ml-2 h-6 w-6 text-yellow-400 cosmic-pulse" />
                </h1>
                <div className="flex items-center space-x-4">
                    <DatasetSelector />
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-indigo-100">
                        <Upload className="mr-2 h-4 w-4" /> Channel Cosmic Data
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="text-indigo-200 border-indigo-600 hover:bg-indigo-700">
                                <Settings className="mr-2 h-4 w-4" /> Cosmic Configurations
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-indigo-900 text-indigo-200">
                            <DropdownMenuItem onSelect={() => setShowTranscendentSettings(!showTranscendentSettings)}>
                                {showTranscendentSettings ? "Veil" : "Unveil"} Transcendent Protocols
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => { /* TODO: Implement settings reset */ }}>
                                Reset to Primordial Constants
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <ResizablePanelGroup direction="horizontal" className="flex-grow">
                <ResizablePanel defaultSize={20} minSize={15}>
                    <div className="h-full flex flex-col bg-indigo-900 bg-opacity-50 text-indigo-100 backdrop-filter backdrop-blur-sm">
                        <div className="p-4 border-b border-indigo-700">
                            <h2 className="text-lg font-semibold mb-2">Celestial Codex</h2>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-indigo-100">
                                <Upload className="mr-2 h-4 w-4" /> Channel Cosmic Fragment
                            </Button>
                        </div>
                        <ScrollArea className="flex-grow">
                            <div className="p-4">{renderCelestialTree(celestialFiles)}</div>
                        </ScrollArea>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={60}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={70}>
                            <Tabs defaultValue="editor" className="h-full flex flex-col">
                                <TabsList className="px-4 py-2 bg-indigo-900 bg-opacity-50 backdrop-filter backdrop-blur-sm">
                                    <TabsTrigger value="editor" className="data-[state=active]:bg-indigo-600 text-indigo-200">Quantum Codex</TabsTrigger>
                                    <TabsTrigger value="preview" className="data-[state=active]:bg-indigo-600 text-indigo-200">Astral Projection</TabsTrigger>
                                    <TabsTrigger value="visualization" className="data-[state=active]:bg-indigo-600 text-indigo-200">Cosmic Lens</TabsTrigger>
                                    <TabsTrigger value="flow" className="data-[state=active]:bg-indigo-600 text-indigo-200">Quantum Flow</TabsTrigger>
                                    <TabsTrigger value="nexus" className="data-[state=active]:bg-indigo-600 text-indigo-200">Celestial Nexus</TabsTrigger>
                                </TabsList>
                                <TabsContent value="editor" className="flex-grow p-4 bg-indigo-900 bg-opacity-75 backdrop-filter backdrop-blur-sm">
                                    <Editor
                                        height="100%"
                                        defaultLanguage="javascript"
                                        value={editorContent}
                                        onChange={setEditorContent}
                                        theme="vs-dark"
                                        options={{
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            lineNumbers: 'on',
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            background: '#1e1b4b',
                                        }}
                                    />
                                </TabsContent>
                                <TabsContent value="preview" className="flex-grow p-4 bg-indigo-900 bg-opacity-75 backdrop-filter backdrop-blur-sm">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-indigo-200">ID</TableHead>
                                                <TableHead className="text-indigo-200">Name</TableHead>
                                                <TableHead className="text-indigo-200">Essence</TableHead>
                                                <TableHead className="text-indigo-200">Manifestation</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tableData.map((row) => (
                                                <TableRow key={row.id} className="hover:bg-indigo-800">
                                                    <TableCell className="text-indigo-300">{row.id}</TableCell>
                                                    <TableCell className="text-indigo-300">{row.name}</TableCell>
                                                    <TableCell className="text-indigo-300">{row.essence}</TableCell>
                                                    <TableCell className="text-indigo-300">{row.manifestation}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TabsContent>
                                <TabsContent value="visualization" className="flex-grow p-4 bg-indigo-900 bg-opacity-75 backdrop-filter backdrop-blur-sm">
                                    <QuantumVisualization />
                                </TabsContent>
                                <TabsContent value="flow" className="flex-grow bg-indigo-900 bg-opacity-75 backdrop-filter backdrop-blur-sm">
                                    <div style={{ width: '100%', height: '100%' }}>
                                        <ReactFlow
                                            nodes={nodes}
                                            edges={edges}
                                            onNodesChange={onNodesChange}
                                            onEdgesChange={onEdgesChange}
                                            onConnect={onConnect}
                                        >
                                            <Controls />
                                            <MiniMap />
                                            <Background variant="dots" gap={12} size={1} color="#4338ca" />
                                        </ReactFlow>
                                    </div>
                                </TabsContent>
                                <TabsContent value="nexus" className="flex-grow p-4 bg-indigo-900 bg-opacity-75 backdrop-filter backdrop-blur-sm">
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-bold text-indigo-200">Celestial Nexus</h3>
                                        <p className="text-indigo-300">Harmonize and transmute cosmic datasets in this ethereal realm.</p>
                                        <div className="flex space-x-4">
                                            <Select
                                                value={selectedModel}
                                                onValueChange={setSelectedModel}
                                            >
                                                <SelectTrigger className="bg-indigo-800 bg-opacity-50 text-indigo-200 border-indigo-600">
                                                    <SelectValue placeholder="Select a quantum model" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-indigo-900 text-indigo-200">
                                                    {modelOptions.map((model) => (
                                                        <SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-indigo-100">
                                                <Codesandbox className="mr-2 h-4 w-4" /> Initiate Cosmic Synthesis
                                            </Button>
                                        </div>
                                        <div className="relative pt-1">
                                            <div className="flex mb-2 items-center justify-between">
                                                <div>
                                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-200 bg-indigo-700">
                                                        Quantum Forging Progress
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-semibold inline-block text-indigo-200">
                                                        {forgeProgress}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-700">
                                                <div style={{ width: `${forgeProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={30}>
                            <div className="h-full flex flex-col bg-indigo-900 bg-opacity-50 text-indigo-100 p-4 backdrop-filter backdrop-blur-sm">
                                <h2 className="text-xl font-semibold mb-4 flex items-center">
                                    <Sparkles className="mr-2 h-5 w-5 text-yellow-400" />
                                    Quantum Transmutation
                                </h2>
                                <div className="flex space-x-4 mb-4">
                                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-indigo-100" onClick={forgeCosmicData}>
                                        <Zap className="mr-2 h-4 w-4" /> Forge Cosmic Data
                                    </Button>
                                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-indigo-100">
                                        <RefreshCw className="mr-2 h-4 w-4" /> Harmonize Data
                                    </Button>
                                    <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-indigo-100">
                                        <Filter className="mr-2 h-4 w-4" /> Apply Quantum Filters
                                    </Button>
                                </div>
                                {forgeProgress > 0 && (
                                    <div className="mb-4">
                                        <Label className="text-indigo-200">Cosmic Forging Progress</Label>
                                        <div className="w-full bg-indigo-700 rounded-full h-2.5">
                                            <div
                                                className="bg-indigo-400 h-2.5 rounded-full"
                                                style={{ width: `${forgeProgress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                                <CosmicStats />
                                <div className="mt-auto">
                                    <Button className="w-full bg-green-600 hover:bg-green-700 text-indigo-100">
                                        <Download className="mr-2 h-4 w-4" /> Crystallize Cosmic Essence
                                    </Button>
                                </div>
                            </div>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={20} minSize={15}>
                    <div className="h-full flex flex-col bg-indigo-900 bg-opacity-50 text-indigo-100 p-4 backdrop-filter backdrop-blur-sm">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <Infinity className="mr-2 h-5 w-5 text-indigo-400" />
                            Quantum Agents
                        </h2>
                        <ScrollArea className="flex-grow">
                            {agents.map((agent) => (
                                <AgentCard key={agent.id} agent={agent} />
                            ))}
                        </ScrollArea>
                        <Button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-indigo-100" onClick={summonAgent}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Summon Quantum Agent
                        </Button>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>

        </div>
    );
}