// frontend/src/components/mainDashboardComponents/views/IDEView.jsx
"use client";
import React, { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import MonacoEditor from "@monaco-editor/react";
import { Tab } from "@headlessui/react";


// Lucide icon imports
import {
    Zap,
    Save,
    RefreshCw,
    X,
    File,
    Check,
    Terminal,
    Play,
    Settings,
    Bug,
    Trello,
    ChevronUp,
    ChevronDown,
    Keyboard,
    HelpCircle,
} from "lucide-react";

// Manual UI component imports
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

// Styles
// import styles from "./glitchnav.module.css";

// Dynamic Kanban Board Loading
const DynamicKanbanBoard = dynamic(
    () => import("@/components/KanbanBoard"),
    {
        ssr: false,
    }
);

// Hybrid Icon component
const Icon = ({ name, size = 24, className = "" }) => {
    const LucideIcon = {
        zap: Zap,
        save: Save,
        refresh: RefreshCw,
        x: X,
        file: File,
        check: Check,
        terminal: Terminal,
        play: Play,
        settings: Settings,
        bug: Bug,
        trello: Trello,
        chevronUp: ChevronUp,
        chevronDown: ChevronDown,
        keyboard: Keyboard,
    }[name];

    if (LucideIcon)
    {
        return <LucideIcon size={size} className={className} />;
    }

    // Custom SVG implementations for icons not in Lucide
    const customIcons = {
        folder: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
        ),
        code: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
        ),
        plus: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
            >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        ),
    };

    return customIcons[name] || null;
};





// API Config — focusing only on Groq API
const API_CONFIG = {
    groq: {
        url: "https://api.groq.com/openai/v1/chat/completions",
        model: "llama2-70b-4096",
        headers: (apiKey) => ({
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        }),
        prepareBody: (input) =>
            JSON.stringify({
                model: "llama2-70b-4096",
                messages: [{ role: "user", content: input }],
                max_tokens: 2048,
            }),
        extractContent: (data) => data.choices[0].message.content,
    },
};

// Neomorphic UI Container for visual appeal
const NeomorphicContainer = ({ children, className = "" }) => (
    <div
        className={`bg-gray-900 rounded-lg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ${className}`}
    >
        {children}
    </div>
);

// NavBar Component to control different sections of the app (Settings, Bug Tracker, Kanban)
const NavBar = ({ onOpenSettings, onOpenBugTracker, onOpenKanban }) => {
    return (
        <nav className="bg-gray-900 p-4 flex justify-between items-center mb-4">
            <div
                className={`${styles.glitch} text-cyan-400 font-bold text-2xl font-orbitron`}
                data-text="GROQY"
            >
                GROQY
            </div>
            <h1 className="text-3xl font-bold mb-4 text-center text-cyan-400 flex items-center justify-center font-orbitron">
                AI VENTURE STUDIO
                <Icon name="zap" size={32} className="mr-2" />
            </h1>

            <div className="flex space-x-4">
                <button
                    onClick={onOpenSettings}
                    className="bg-gray-800 hover:bg-gray-700 text-cyan-400 px-4 py-2 rounded-full flex items-center transition-colors duration-200"
                >
                    <Settings size={16} className="mr-2" /> Settings
                </button>
                <button
                    onClick={onOpenBugTracker}
                    className="bg-gray-800 hover:bg-gray-700 text-cyan-400 px-4 py-2 rounded-full flex items-center transition-colors duration-200"
                >
                    <Bug size={16} className="mr-2" /> Bug Tracker
                </button>
                <button
                    onClick={onOpenKanban}
                    className="bg-gray-800 hover:bg-gray-700 text-cyan-400 px-4 py-2 rounded-full flex items-center transition-colors duration-200"
                >
                    <Trello size={16} className="mr-2" /> Kanban
                </button>
            </div>
        </nav>
    );
};

// Settings Modal to manage API keys
const SettingsModal = ({ isOpen, onClose, apiKeys, onUpdateApiKey }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold text-cyan-400 mb-4">Settings</h2>
                {Object.entries(apiKeys).map(([key, value]) => (
                    <div key={key} className="mb-4">
                        <label className="block text-cyan-400 mb-2">{key} API Key</label>
                        <input
                            type="password"
                            value={value}
                            onChange={(e) => onUpdateApiKey(key, e.target.value)}
                            className="w-full p-2 bg-gray-800 text-cyan-400 rounded"
                        />
                    </div>
                ))}
                <button
                    onClick={onClose}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-full w-full"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

// Bug Tracker Modal
const BugTrackerModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-lg w-3/4 h-3/4 overflow-auto">
                <h2 className="text-xl font-bold text-cyan-400 mb-4">Bug Tracker</h2>
                {/* Add your bug tracker implementation here */}
                <p className="text-cyan-400">Bug tracker content goes here...</p>
                <button
                    onClick={onClose}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-full mt-4"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

// Kanban Modal
const KanbanModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6 rounded-lg w-11/12 max-w-7xl h-5/6 overflow-hidden"
            >
                <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-10"></div>
                <div className="relative z-10 flex flex-col h-full">
                    <header className="py-4">
                        <div className="flex justify-between items-center">
                            <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
                            >
                                Futuristic Kanban
                            </motion.h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors text-lg"
                            >
                                Close
                            </button>
                        </div>
                        <nav className="mt-6">
                            <ul className="flex space-x-6">
                                <motion.li
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <a
                                        href="#"
                                        className="text-base hover:text-cyan-400 transition-colors"
                                    >
                                        Dashboard
                                    </a>
                                </motion.li>
                                <motion.li
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <a
                                        href="#"
                                        className="text-base hover:text-cyan-400 transition-colors"
                                    >
                                        Projects
                                    </a>
                                </motion.li>
                                <motion.li
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <a
                                        href="#"
                                        className="text-base hover:text-cyan-400 transition-colors"
                                    >
                                        Team
                                    </a>
                                </motion.li>
                            </ul>
                        </nav>
                    </header>
                    <main className="flex-grow overflow-hidden mt-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="h-full"
                        >
                            <DynamicKanbanBoard className="h-full" />
                        </motion.div>
                    </main>
                </div>
            </motion.div>
        </div>
    );
};

// FileExplorer for navigating project files
const FileExplorer = ({
    files,
    onSelectFile,
    onCreateFile,
    onCreateFolder,
    onDeleteFile,
    onRenameFile,
    onDownloadFile,
    selectedFiles,
    setSelectedFiles,
    onRefresh,
}) => {
    const renderTree = (node, path = "") => {
        if (!node || typeof node !== "object")
        {
            return null;
        }

        return (
            <ul className="pl-4">
                {node.contents.map((item) => (
                    <li key={item.name} className="py-1">
                        <div className="flex items-center group">
                            {item.type === "directory" ? (
                                <Icon name="folder" size={16} className="mr-2 text-yellow-400" />
                            ) : (
                                <Icon name="file" size={16} className="mr-2 text-cyan-400" />
                            )}
                            <button
                                className="text-gray-300 hover:text-cyan-400 transition-colors duration-200"
                                onClick={() =>
                                    item.type === "file" ? onSelectFile(`${path}${item.name}`) : null
                                }
                            >
                                {item.name}
                            </button>
                        </div>
                        {item.type === "directory" &&
                            renderTree(item, `${path}${item.name}/`)}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <NeomorphicContainer className="p-4 h-full overflow-auto border border-gray-800">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-cyan-400 flex items-center">
                    <Icon name="code" size={24} className="mr-2" />
                    File Explorer
                </h2>
                <div>
                    <button
                        onClick={() => onCreateFile("")}
                        className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 mr-2"
                    >
                        <Icon name="file-plus" size={20} />
                    </button>
                    <button
                        onClick={() => onCreateFolder("")}
                        className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                    >
                        <Icon name="folder-plus" size={20} />
                    </button>
                </div>
            </div>
            {files && typeof files === "object" && Object.keys(files).length > 0 ? (
                renderTree(files)
            ) : (
                <p>No files to display</p>
            )}
            <button
                className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded transition-colors duration-200"
                onClick={onRefresh}
            >
                Refresh
            </button>
        </NeomorphicContainer>
    );
};

// Code Editor component with Groq API integration for code generation
const CodeEditor = ({
    files,
    onSave,
    activeFile,
    setActiveFile,
    closeFile,
    onChange,
}) => {
    const [apiType, setApiType] = useState("groq");
    const [apiKey, setApiKey] = useState("");
    const [useCodeAsInput, setUseCodeAsInput] = useState(true);
    const [promptInput, setPromptInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState(null);
    const [showApiKeyInput, setShowApiKeyInput] = useState(false);
    const [generatedCode, setGeneratedCode] = useState("");
    const [previewMode, setPreviewMode] = useState(false);

    useEffect(() => {
        const storedApiKey = localStorage.getItem(`${apiType}_api_key`);
        if (storedApiKey)
        {
            setApiKey(storedApiKey);
        }
    }, [apiType]);

    const handleApiKeyChange = (e) => {
        const newApiKey = e.target.value;
        setApiKey(newApiKey);
        localStorage.setItem(`${apiType}_api_key`, newApiKey);
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        setGenerationError(null);

        const currentCode = files[activeFile] || "";
        const input = useCodeAsInput
            ? `${promptInput}\n\nExisting code:\n${currentCode}`
            : promptInput;

        try
        {
            const config = API_CONFIG[apiType];
            const response = await fetch(config.url, {
                method: "POST",
                headers: config.headers(apiKey),
                body: config.prepareBody(input),
            });

            if (!response.ok)
            {
                throw new Error(
                    `${apiType.toUpperCase()} API error: ${response.statusText}`
                );
            }

            const data = await response.json();
            const content = config.extractContent(data);
            const extractedCode = extractCodeFromResponse(content);
            setGeneratedCode(extractedCode);
            setPreviewMode(true);

            console.log(`Code generated successfully using ${apiType} API`);
        } catch (error)
        {
            console.error("Error generating code:", error);
            setGenerationError(error.message);
        } finally
        {
            setIsGenerating(false);
        }
    };

    const extractCodeFromResponse = (response) => {
        const codeBlockRegex =
            /```(?:javascript|js|jsx|typescript|ts|tsx)?\s*([\s\S]*?)```/g;
        const codeBlocks = [];
        let match;

        while ((match = codeBlockRegex.exec(response)) !== null)
        {
            codeBlocks.push(match[1].trim());
        }

        return codeBlocks.join("\n\n");
    };

    const applyGeneratedCode = () => {
        onChange(activeFile, generatedCode);
        setPreviewMode(false);
        setGeneratedCode("");
    };

    const cancelPreview = () => {
        setPreviewMode(false);
        setGeneratedCode("");
    };

    const debouncedOnChange = useCallback(
        debounce((value) => onChange(activeFile, value), 500),
        [activeFile, onChange]
    );

    return (
        <motion.div
            className="flex flex-col h-full border border-gray-800 bg-gray-900 rounded-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex border-b border-gray-800 bg-gray-900 overflow-x-auto">
                <AnimatePresence>
                    {Object.keys(files).map((filePath) => (
                        <motion.div
                            key={filePath}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className={`px-4 py-2 flex items-center cursor-pointer transition-colors duration-200 ${activeFile === filePath
                                ? "bg-cyan-900 text-cyan-400"
                                : "hover:bg-gray-800"
                                }`}
                            onClick={() => setActiveFile(filePath)}
                        >
                            <File size={14} className="mr-2 text-cyan-400" />
                            <span className="truncate max-w-xs">
                                {filePath.split("/").pop()}
                            </span>
                            <button
                                className="ml-2 text-gray-500 hover:text-cyan-400 transition-colors duration-200"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    closeFile(filePath);
                                }}
                            >
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <div className="flex-grow overflow-hidden">
                {activeFile && (
                    <MonacoEditor
                        height="100%"
                        language="javascript"
                        theme="vs-dark"
                        value={previewMode ? generatedCode : files[activeFile]}
                        onChange={previewMode ? undefined : debouncedOnChange}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineNumbers: "on",
                            readOnly: previewMode,
                            wordWrap: "on",
                            automaticLayout: true,
                        }}
                    />
                )}
            </div>
            <div className="p-4 border-t border-gray-800 bg-gray-900">
                <Tab.Group>
                    <Tab.List className="flex space-x-1 rounded-xl bg-gray-800 p-1 mb-4">
                        <Tab
                            className={({ selected }) =>
                                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-cyan-400 ring-white ring-opacity-60 ring-offset-2 ring-offset-cyan-400 focus:outline-none focus:ring-2 ${selected
                                    ? "bg-gray-900 shadow"
                                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                }`
                            }
                        >
                            AI Code Generation
                        </Tab>
                        <Tab
                            className={({ selected }) =>
                                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-cyan-400 ring-white ring-opacity-60 ring-offset-2 ring-offset-cyan-400 focus:outline-none focus:ring-2 ${selected
                                    ? "bg-gray-900 shadow"
                                    : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                }`
                            }
                        >
                            Settings
                        </Tab>
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel>
                            <div className="flex mb-4">
                                <select
                                    value={apiType}
                                    onChange={(e) => setApiType(e.target.value)}
                                    className="mr-2 p-2 bg-gray-800 text-cyan-400 rounded-full shadow-inner"
                                >
                                    <option value="groq">Groq API</option>
                                </select>
                                <label className="flex items-center text-cyan-400">
                                    <input
                                        type="checkbox"
                                        checked={useCodeAsInput}
                                        onChange={(e) => setUseCodeAsInput(e.target.checked)}
                                        className="mr-2"
                                    />
                                    Use code as input
                                </label>
                            </div>
                            <div className="flex mb-4">
                                <input
                                    type="text"
                                    value={promptInput}
                                    onChange={(e) => setPromptInput(e.target.value)}
                                    placeholder="Enter prompt for code generation"
                                    className="flex-grow mr-2 p-2 bg-gray-800 text-cyan-400 rounded-full shadow-inner"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !apiKey}
                                    className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full flex items-center transition-colors duration-200 shadow-lg ${isGenerating || !apiKey
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                        }`}
                                >
                                    {isGenerating ? (
                                        <RefreshCw className="animate-spin mr-2" />
                                    ) : (
                                        <Zap size={16} className="mr-2" />
                                    )}
                                    {isGenerating ? "Generating..." : "Generate"}
                                </motion.button>
                            </div>
                            {generationError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-4 p-2 bg-red-600 text-white rounded-full shadow-lg"
                                >
                                    Error: {generationError}
                                </motion.div>
                            )}
                            {previewMode && (
                                <div className="flex justify-end space-x-2 mt-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={applyGeneratedCode}
                                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-full flex items-center"
                                    >
                                        <Check size={16} className="mr-2" /> Apply Changes
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={cancelPreview}
                                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full flex items-center"
                                    >
                                        <X size={16} className="mr-2" /> Cancel
                                    </motion.button>
                                </div>
                            )}
                        </Tab.Panel>
                        <Tab.Panel>
                            <div className="mb-4">
                                <label className="block text-cyan-400 mb-2">
                                    API Key for {apiType}
                                </label>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={handleApiKeyChange}
                                    placeholder={`Enter ${apiType} API Key`}
                                    className="w-full p-2 bg-gray-800 text-cyan-400 rounded-full shadow-inner"
                                />
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-full flex items-center justify-center transition-colors duration-200 shadow-lg shadow-cyan-500/50 mt-4"
                    onClick={() => activeFile && onSave(activeFile, files[activeFile])}
                >
                    <Save size={16} className="mr-2" /> Save
                </motion.button>
            </div>
        </motion.div>
    );
};

// Page Tabs for the Preview mode
const PageTabs = ({ pages, activePage, setActivePage }) => {
    return (
        <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-gray-800 p-1">
                {pages.map((page) => (
                    <Tab
                        key={page}
                        className={({ selected }) =>
                            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-cyan-400 ring-white ring-opacity-60 ring-offset-2 ring-offset-cyan-400 focus:outline-none focus:ring-2 ${selected
                                ? "bg-gray-900 shadow"
                                : "text-gray-400 hover:bg-gray-700 hover:text-white"
                            }`
                        }
                        onClick={() => setActivePage(page)}
                    >
                        {page}
                    </Tab>
                ))}
            </Tab.List>
        </Tab.Group>
    );
};

// Main Component
const IDEView = () => {
    const [activeFile, setActiveFile] = useState(null);
    const [commandOutput, setCommandOutput] = useState("");
    const [openFiles, setOpenFiles] = useState({});
    const [fileStructure, setFileStructure] = useState(null);
    const [previewKey, setPreviewKey] = useState(0);
    const [previewUrl, setPreviewUrl] = useState("");
    const [pages, setPages] = useState([]);
    const [activePage, setActivePage] = useState("");
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [gitBranch, setGitBranch] = useState("");
    const [baseUrl, setBaseUrl] = useState("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isBugTrackerOpen, setIsBugTrackerOpen] = useState(false);
    const [isKanbanOpen, setIsKanbanOpen] = useState(false);
    const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(true); // Start collapsed
    const [apiKeys, setApiKeys] = useState({
        groq: "",
    });

    const API_URL = `${baseUrl.replace(/\/$/, "")}/api/execute-command`;

    useEffect(() => {
        if (baseUrl)
        {
            fetchFileStructure();
            fetchPages();
            fetchGitBranch();
        }
    }, [baseUrl]);

    const handleUpdateApiKey = (key, value) => {
        setApiKeys((prevKeys) => ({ ...prevKeys, [key]: value }));
        localStorage.setItem(`${key}_api_key`, value);
    };

    const handleExecuteCommand = async (command) => {
        try
        {
            const output = await executeCommand(command);
            setCommandOutput(output);
            if (
                command.startsWith("mkdir") ||
                command.startsWith("touch") ||
                command.startsWith("rm")
            )
            {
                fetchFileStructure();
            }
        } catch (error)
        {
            console.error("Error executing command:", error);
            setCommandOutput(`Error executing command: ${error.message}`);
        }
    };

    const executeCommand = async (command) => {
        try
        {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ command }),
            });
            if (!res.ok)
            {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            if (data.error)
            {
                throw new Error(data.error);
            }
            return data.output;
        } catch (error)
        {
            console.error("Error executing command:", error);
            setCommandOutput(`Error: ${error.message}`);
            throw error;
        }
    };

    const fetchFileStructure = async () => {
        try
        {
            const output = await executeCommand("tree -J -L 4 src");
            const parsedStructure = JSON.parse(output);
            setFileStructure(parsedStructure[0]);
        } catch (error)
        {
            console.error("Error fetching file structure:", error);
            setFileStructure({});
        }
    };

    const fetchPages = async () => {
        try
        {
            const output = await executeCommand("ls src/pages");
            const pageFiles = output
                .split("\n")
                .filter((file) => file.endsWith(".js") || file.endsWith(".tsx"));
            setPages(["index.js", ...pageFiles]);
            setActivePage("index.js");
        } catch (error)
        {
            console.error("Error fetching pages:", error);
            setCommandOutput(`Error fetching pages: ${error.message}`);
        }
    };

    const fetchGitBranch = async () => {
        try
        {
            const branch = await executeCommand("git rev-parse --abbrev-ref HEAD");
            setGitBranch(branch.trim());
        } catch (error)
        {
            console.error("Error fetching git branch:", error);
            setCommandOutput(`Error fetching git branch: ${error.message}`);
        }
    };

    const handleSelectFile = async (filePath) => {
        if (!openFiles[filePath])
        {
            try
            {
                const content = await executeCommand(`cat src/${filePath}`);
                setOpenFiles({ ...openFiles, [filePath]: content });
            } catch (error)
            {
                console.error(`Error fetching file content for ${filePath}:`, error);
                setOpenFiles({
                    ...openFiles,
                    [filePath]: `// Error loading content for ${filePath}`,
                });
            }
        }
        setActiveFile(filePath);
    };

    const handleSaveFile = async (filePath, content) => {
        try
        {
            const escapedContent = content.replace(/'/g, "'\\''");
            await executeCommand(`echo '${escapedContent}' > src/${filePath}`);
            setCommandOutput(`File ${filePath} saved successfully.`);
            if (autoRefresh)
            {
                refreshPreview();
            }
        } catch (error)
        {
            console.error(`Error saving file ${filePath}:`, error);
            setCommandOutput(`Error saving file ${filePath}: ${error.message}`);
        }
    };

    const handleCreateFile = async (path) => {
        const fileName = prompt("Enter file name:");
        if (fileName)
        {
            try
            {
                await executeCommand(`touch src/${path}${fileName}`);
                setCommandOutput(`File ${path}${fileName} created successfully.`);
                fetchFileStructure();
            } catch (error)
            {
                console.error(`Error creating file ${path}${fileName}:`, error);
                setCommandOutput(
                    `Error creating file ${path}${fileName}: ${error.message}`
                );
            }
        }
    };

    const handleCreateFolder = async (path) => {
        const folderName = prompt("Enter folder name:");
        if (folderName)
        {
            try
            {
                await executeCommand(`mkdir -p src/${path}${folderName}`);
                setCommandOutput(`Folder ${path}${folderName} created successfully.`);
                fetchFileStructure();
            } catch (error)
            {
                console.error(`Error creating folder ${path}${folderName}:`, error);
                setCommandOutput(
                    `Error creating folder ${path}${folderName}: ${error.message}`
                );
            }
        }
    };

    const handleDeleteFile = async (filePath) => {
        if (confirm(`Are you sure you want to delete ${filePath}?`))
        {
            try
            {
                await executeCommand(`rm src/${filePath}`);
                setCommandOutput(`File ${filePath} deleted successfully.`);
                fetchFileStructure();
                const newOpenFiles = { ...openFiles };
                delete newOpenFiles[filePath];
                setOpenFiles(newOpenFiles);
                if (activeFile === filePath)
                {
                    setActiveFile(Object.keys(newOpenFiles)[0] || null);
                }
            } catch (error)
            {
                console.error(`Error deleting file ${filePath}:`, error);
                setCommandOutput(`Error deleting file ${filePath}: ${error.message}`);
            }
        }
    };

    const handleRenameFile = async (oldPath, newPath) => {
        try
        {
            await executeCommand(`mv src/${oldPath} src/${newPath}`);
            setCommandOutput(
                `File renamed from ${oldPath} to ${newPath} successfully.`
            );
            fetchFileStructure();
            const newOpenFiles = { ...openFiles };
            newOpenFiles[newPath] = newOpenFiles[oldPath];
            delete newOpenFiles[oldPath];
            setOpenFiles(newOpenFiles);
            if (activeFile === oldPath)
            {
                setActiveFile(newPath);
            }
        } catch (error)
        {
            console.error(
                `Error renaming file from ${oldPath} to ${newPath}:`,
                error
            );
            setCommandOutput(`Error renaming file: ${error.message}`);
        }
    };

    const handleDownloadFile = async (filePath) => {
        try
        {
            const content = await executeCommand(`cat src/${filePath}`);
            const blob = new Blob([content], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filePath.split("/").pop();
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error)
        {
            console.error(`Error downloading file ${filePath}:`, error);
            setCommandOutput(`Error downloading file: ${error.message}`);
        }
    };

    const handleSearch = async () => {
        try
        {
            const output = await executeCommand(`grep -r "${searchQuery}" src`);
            setCommandOutput(output);
        } catch (error)
        {
            console.error("Error searching files:", error);
            setCommandOutput(`Error searching files: ${error.message}`);
        }
    };

    const handleGitCommit = async () => {
        const message = prompt("Enter commit message:");
        if (message)
        {
            try
            {
                await executeCommand("git add .");
                const output = await executeCommand(`git commit -m "${message}"`);
                setCommandOutput(output);
                fetchGitBranch();
            } catch (error)
            {
                console.error("Error making git commit:", error);
                setCommandOutput(`Error making git commit: ${error.message}`);
            }
        }
    };

    const handleGitPush = async () => {
        try
        {
            const output = await executeCommand("git push");
            setCommandOutput(output);
        } catch (error)
        {
            console.error("Error pushing to git:", error);
            setCommandOutput(`Error pushing to git: ${error.message}`);
        }
    };

    const handleGitPull = async () => {
        try
        {
            const output = await executeCommand("git pull");
            setCommandOutput(output);
            fetchFileStructure();
            fetchGitBranch();
        } catch (error)
        {
            console.error("Error pulling from git:", error);
            setCommandOutput(`Error pulling from git: ${error.message}`);
        }
    };

    const handleRefresh = () => {
        fetchFileStructure();
        fetchPages();
        setCommandOutput("File structure and pages refreshed.");
    };



    const handleCodeChange = (filePath, newContent) => {
        setOpenFiles({ ...openFiles, [filePath]: newContent });
        debouncedSave(filePath, newContent);
    };

    const debouncedSave = useCallback(
        debounce((filePath, content) => {
            handleSaveFile(filePath, content);
        }, 1000),
        []
    );

    const refreshPreview = () => {
        setPreviewKey((prevKey) => prevKey + 1);
    };


    const HelpDropdown = () => {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                        <HelpCircle className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuItem>
                        <span className="font-semibold">Ctrl + S:</span> Save file
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span className="font-semibold">Ctrl + F:</span> Search in files
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span className="font-semibold">Ctrl + P:</span> Quick file open
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span className="font-semibold">Ctrl + `:</span> Toggle terminal
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span className="font-semibold">Ctrl + B:</span> Toggle file explorer
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };

    const TerminalSection = ({ isCollapsed, toggleCollapse, onExecute, commandOutput }) => {
        const [activeTab, setActiveTab] = useState("terminal");

        const tabContent = {
            terminal: (
                <CommandExecutor onExecute={onExecute} commandOutput={commandOutput} />
            ),
            output: (
                <div className="p-2">
                    <h3 className="text-lg font-semibold mb-2 text-green-400">Output Log</h3>
                    <pre className="bg-gray-800 p-3 rounded-lg text-sm text-green-300 font-mono overflow-x-auto">
                        {commandOutput}
                    </pre>
                </div>
            ),
            debug: (
                <div className="p-2">
                    <h3 className="text-lg font-semibold mb-2 text-green-400">Debug Console</h3>
                    <pre className="bg-gray-800 p-3 rounded-lg text-sm text-green-300 font-mono overflow-x-auto">
                        {/* Add your debug console content here */}
                        Debug console content...
                    </pre>
                </div>
            ),
        };

        return (
            <NeomorphicContainer className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'h-12' : 'h-60'}`}>
                <div className="flex justify-between items-center p-2 bg-gray-800">
                    <div className="flex items-center">
                        <Terminal size={24} className="mr-2 text-green-400" />
                        <h2 className="text-xl font-bold text-green-400">Console</h2>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="ml-2">
                                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onSelect={() => setActiveTab("terminal")}>Terminal</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setActiveTab("output")}>Output</DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => setActiveTab("debug")}>Debug</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <Button variant="ghost" size="sm" onClick={toggleCollapse}>
                        {isCollapsed ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </Button>
                </div>
                {!isCollapsed && (
                    <ScrollArea className="h-48">
                        {tabContent[activeTab]}
                    </ScrollArea>
                )}
            </NeomorphicContainer>
        );
    };



    const CommandExecutor = ({ onExecute, commandOutput }) => {
        const [command, setCommand] = useState("");
        const [history, setHistory] = useState([]);
        const [historyIndex, setHistoryIndex] = useState(-1);

        useEffect(() => {
            const handleKeyDown = (e) => {
                if (e.key === 'ArrowUp')
                {
                    e.preventDefault();
                    setHistoryIndex(prev => Math.min(prev + 1, history.length - 1));
                } else if (e.key === 'ArrowDown')
                {
                    e.preventDefault();
                    setHistoryIndex(prev => Math.max(prev - 1, -1));
                }
            };

            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }, [history]);

        useEffect(() => {
            if (historyIndex >= 0)
            {
                setCommand(history[historyIndex]);
            } else
            {
                setCommand('');
            }
        }, [historyIndex, history]);

        const handleSubmit = (e) => {
            e.preventDefault();
            if (command.trim())
            {
                onExecute(command);
                setHistory(prev => [command, ...prev].slice(0, 50));
                setHistoryIndex(-1);
                setCommand("");
            }
        };

        return (
            <NeomorphicContainer className="p-4 border border-gray-800">
                <form onSubmit={handleSubmit} className="flex mb-4">
                    <input
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        placeholder="Enter command"
                        className="flex-grow mr-2 p-2 bg-gray-800 text-green-400 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500 border-r border-gray-700"
                    />
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-black px-4 py-2 rounded-r flex items-center transition-colors duration-200 shadow-lg shadow-green-500/50">
                        <Play size={16} className="mr-2" /> Run
                    </Button>
                </form>
                <NeomorphicContainer className="p-4">
                    <h3 className="text-lg font-semibold mb-2 text-green-400">Output</h3>
                    <ScrollArea className="h-40">
                        <pre className="bg-gray-800 p-3 rounded-lg text-sm text-green-300 font-mono whitespace-pre-wrap">
                            {commandOutput}
                        </pre>
                    </ScrollArea>
                </NeomorphicContainer>
            </NeomorphicContainer>
        );
    };

    return (
        <div className="flex flex-col h-screen bg-gray-950 text-cyan-300 p-4 overflow-hidden">
            <NavBar
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenBugTracker={() => setIsBugTrackerOpen(true)}
                onOpenKanban={() => setIsKanbanOpen(true)}
            />

            <div className="mb-4 flex items-center justify-between">
                <div className="flex-grow mr-2">
                    <input
                        type="text"
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        placeholder="Enter base URL (e.g., https://your-ngrok-url.ngrok.io)"
                        className="w-full p-2 bg-gray-800 text-cyan-400 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>
                <div className="text-sm text-gray-400 mr-2">
                    Current Git Branch: {gitBranch}
                </div>
                <HelpDropdown />
            </div>

            <div className="flex-grow grid grid-cols-5 gap-4 mb-4 overflow-hidden">
                <div className="col-span-1 overflow-auto">
                    <FileExplorer
                        files={fileStructure || {}}
                        onSelectFile={handleSelectFile}
                        onCreateFile={handleCreateFile}
                        onCreateFolder={handleCreateFolder}
                        onDeleteFile={handleDeleteFile}
                        onRenameFile={handleRenameFile}
                        onDownloadFile={handleDownloadFile}
                        selectedFiles={selectedFiles}
                        setSelectedFiles={setSelectedFiles}
                        onRefresh={handleRefresh}
                    />
                    <div className="mt-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search files..."
                            className="w-full p-2 bg-gray-800 text-cyan-400 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <button
                            onClick={handleSearch}
                            className="mt-2 w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded transition-colors duration-200"
                        >
                            Search
                        </button>
                    </div>
                    <div className="mt-4 flex justify-between">
                        <button
                            onClick={handleGitCommit}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors duration-200"
                        >
                            Commit
                        </button>
                        <button
                            onClick={handleGitPush}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors duration-200"
                        >
                            Push
                        </button>
                        <button
                            onClick={handleGitPull}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors duration-200"
                        >
                            Pull
                        </button>
                    </div>
                </div>
                <div className="col-span-2 overflow-auto">
                    <CodeEditor
                        files={openFiles}
                        onSave={handleSaveFile}
                        activeFile={activeFile}
                        setActiveFile={setActiveFile}
                        closeFile={(filePath) => {
                            const newOpenFiles = { ...openFiles };
                            delete newOpenFiles[filePath];
                            setOpenFiles(newOpenFiles);
                            if (activeFile === filePath)
                            {
                                setActiveFile(Object.keys(newOpenFiles)[0] || null);
                            }
                        }}
                        onChange={handleCodeChange}
                    />
                </div>
                <div className="col-span-2 overflow-auto">
                    <div className="h-full p-4 flex flex-col border border-gray-800 bg-gray-900 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-purple-400 flex items-center">
                                <Play size={24} className="mr-2" />
                                Live Preview
                            </h2>
                            <div className="flex items-center">
                                <button
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full flex items-center transition-colors duration-200 shadow-lg shadow-purple-500/50 mr-2"
                                    onClick={refreshPreview}
                                >
                                    <RefreshCw size={16} className="mr-2" /> Refresh
                                </button>
                                <label className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        checked={autoRefresh}
                                        onChange={(e) => setAutoRefresh(e.target.checked)}
                                        className="mr-2"
                                    />
                                    Auto-refresh
                                </label>
                            </div>
                        </div>
                        <PageTabs
                            pages={pages}
                            activePage={activePage}
                            setActivePage={setActivePage}
                        />
                        {baseUrl ? (
                            <iframe
                                key={previewKey}
                                src={`${baseUrl}/${activePage === "index.js" ? "" : activePage.replace(".js", "")}`}
                                className="w-full flex-grow border-2 border-gray-800 rounded-lg bg-white mt-4"
                                title="Live Preview"
                            />
                        ) : (
                            <div className="w-full flex-grow flex items-center justify-center text-gray-500">
                                Enter a base URL to preview your website
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <TerminalSection
                isCollapsed={isTerminalCollapsed}
                toggleCollapse={() => setIsTerminalCollapsed(!isTerminalCollapsed)}
                onExecute={handleExecuteCommand}
                commandOutput={commandOutput}
            />


            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                apiKeys={apiKeys}
                onUpdateApiKey={handleUpdateApiKey}
            />
            <BugTrackerModal
                isOpen={isBugTrackerOpen}
                onClose={() => setIsBugTrackerOpen(false)}
            />
            <KanbanModal
                isOpen={isKanbanOpen}
                onClose={() => setIsKanbanOpen(false)}
            />
            <KanbanModal
                isOpen={isKanbanOpen}
                onClose={() => setIsKanbanOpen(false)}
            />
        </div>
    );
};

export default IDEView;