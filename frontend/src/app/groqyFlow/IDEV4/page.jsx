"use client";
import React, { useState, useCallback, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import { debounce } from "lodash";
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
    Folder,
    FolderPlus,
    FilePlus,
    Edit,
    Trash,
    Download,
    Search,
    GitCommit,
    GitPullRequest,
    GitBranch,
} from "lucide-react";
import { Tab } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./glitchnav.module.css";
import dynamic from 'next/dynamic';
import Alert, { AlertDescription, AlertTitle } from "@/components/ui/alert";
import Checkbox from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger, Panel, Group, List } from "@/components/ui/tabs";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";


const DynamicKanbanBoard = dynamic(() => import("../../components/KanbanBoard"), { ssr: false });


const QuantumContainer = ({ children, className = "" }) => (
    <motion.div
        className={`bg-gray-900 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.1)] ${className}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
    >
        {children}
    </motion.div>
);
const NexusIcon = ({ name, size = 24, className = "" }) => {
    const icons = {
        folder: <Folder size={size} className={className} />,
        file: <File size={size} className={className} />,
        code: <Terminal size={size} className={className} />,
        plus: <Plus size={size} className={className} />,
        save: <Save size={size} className={className} />,
        x: <X size={size} className={className} />,
        terminal: <Terminal size={size} className={className} />,
        zap: <Zap size={size} className={className} />,
        play: <Play size={size} className={className} />,
        refresh: <RefreshCw size={size} className={className} />,
        folderPlus: <FolderPlus size={size} className={className} />,
        filePlus: <FilePlus size={size} className={className} />,
        edit: <Edit size={size} className={className} />,
        trash: <Trash size={size} className={className} />,
        download: <Download size={size} className={className} />,
        search: <Search size={size} className={className} />,
        gitCommit: <GitCommit size={size} className={className} />,
        gitPull: <GitPullRequest size={size} className={className} />,
        gitBranch: <GitBranch size={size} className={className} />,
    };

    return icons[name] || null;
};
const parseFileStructure = (data) => {
    const processNode = (node) => {
        if (typeof node === 'object' && node !== null)
        {
            return Object.entries(node).reduce((acc, [key, value]) => {
                acc[key] = processNode(value);
                return acc;
            }, {});
        } else
        {
            return { type: 'file', name: node };
        }
    };
};



const QuantumFileExplorer = ({
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
    const renderQuantumTree = (node, path = "") => {
        if (!node || typeof node !== "object") return null;

        return (
            <motion.ul
                className="pl-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
            >
                {Object.entries(node).map(([key, value]) => {
                    const fullPath = path ? `${path}/${key}` : key;
                    const isDirectory = value.type !== 'file';

                    return (
                        <motion.li
                            key={fullPath}
                            className="py-1"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                        >
                            <div className="flex items-center group">
                                <input
                                    type="checkbox"
                                    checked={selectedFiles.includes(fullPath)}
                                    onChange={(e) => {
                                        if (e.target.checked)
                                        {
                                            setSelectedFiles([...selectedFiles, fullPath]);
                                        } else
                                        {
                                            setSelectedFiles(selectedFiles.filter((file) => file !== fullPath));
                                        }
                                    }}
                                    className="mr-2"
                                />
                                <NexusIcon
                                    name={isDirectory ? "folder" : "file"}
                                    size={16}
                                    className={`mr-2 ${isDirectory ? "text-yellow-400" : "text-cyan-400"}`}
                                />
                                <button
                                    className="text-gray-300 hover:text-cyan-400 transition-colors duration-200"
                                    onClick={() => !isDirectory && onSelectFile(fullPath)}
                                >
                                    {key}
                                </button>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {isDirectory && (
                                        <>
                                            <button
                                                onClick={() => onCreateFile(fullPath)}
                                                className="text-gray-500 hover:text-cyan-400 mr-2"
                                            >
                                                <NexusIcon name="filePlus" size={14} />
                                            </button>
                                            <button
                                                onClick={() => onCreateFolder(fullPath)}
                                                className="text-gray-500 hover:text-purple-400 mr-2"
                                            >
                                                <NexusIcon name="folderPlus" size={14} />
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => onRenameFile(fullPath, prompt("Enter new name:", key))}
                                        className="text-gray-500 hover:text-yellow-400 mr-2"
                                    >
                                        <NexusIcon name="edit" size={14} />
                                    </button>
                                    <button
                                        onClick={() => onDeleteFile(fullPath)}
                                        className="text-gray-500 hover:text-red-400 mr-2"
                                    >
                                        <NexusIcon name="trash" size={14} />
                                    </button>
                                    {!isDirectory && (
                                        <button
                                            onClick={() => onDownloadFile(fullPath)}
                                            className="text-gray-500 hover:text-green-400"
                                        >
                                            <NexusIcon name="download" size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {isDirectory && renderQuantumTree(value, fullPath)}
                        </motion.li>
                    );
                })}
            </motion.ul>
        );
    };

    return (
        <QuantumContainer className="p-4 h-full overflow-auto border border-gray-800">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-cyan-400 flex items-center">
                    <NexusIcon name="code" size={24} className="mr-2" />
                    Quantum File Nexus
                </h2>
                <div>
                    <button
                        onClick={() => onCreateFile("")}
                        className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 mr-2"
                    >
                        <NexusIcon name="filePlus" size={20} />
                    </button>
                    <button
                        onClick={() => onCreateFolder("")}
                        className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                    >
                        <NexusIcon name="folderPlus" size={20} />
                    </button>
                </div>
            </div>
            {files && typeof files === "object" && Object.keys(files).length > 0 ? (
                renderQuantumTree(files.contents)
            ) : (
                <p>Quantum void detected. No files to display.</p>
            )}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded transition-colors duration-200"
                onClick={onRefresh}
            >
                <NexusIcon name="refresh" size={16} className="mr-2" />
                Synchronize Quantum State
            </motion.button>
        </QuantumContainer>
    );
};



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
    anthropic: {
        url: "https://api.anthropic.com/v1/complete",
        model: "claude-2",
        headers: (apiKey) => ({
            "Content-Type": "application/json",
            "X-API-Key": apiKey,
        }),
        prepareBody: (input) =>
            JSON.stringify({
                prompt: `Human: ${input}\n\nAssistant:`,
                model: "claude-2",
                max_tokens_to_sample: 2048,
            }),
        extractContent: (data) => data.completion,
    },
    gpt4: {
        url: "https://api.openai.com/v1/chat/completions",
        model: "gpt-4",
        headers: (apiKey) => ({
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        }),
        prepareBody: (input) =>
            JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: input }],
                max_tokens: 2048,
            }),
        extractContent: (data) => data.choices[0].message.content,
    },
};

const NeomorphicContainer = ({ children, className = "" }) => (
    <div
        className={`bg-gray-900 rounded-lg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ${className}`}
    >
        {children}
    </div>
);


const Icon = ({ name, size = 24, className = "" }) => {
    const icons = {
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
        file: (
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
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
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
        save: (
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
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
        ),
        x: (
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        ),
        terminal: (
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
                <polyline points="4 17 10 11 4 5"></polyline>
                <line x1="12" y1="19" x2="20" y2="19"></line>
            </svg>
        ),
        zap: (
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
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
        ),
        play: (
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
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
        ),
        refresh: (
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
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.33-3.36L23 10"></path>
                <path d="M20.49 15a9 9 0 0 1-14.33 3.36L1 14"></path>
            </svg>
        ),
    };

    return icons[name] || null;
};

// FileExplorer component handles file system navigation and basic file operations

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
                {Object.entries(node).map(([key, value]) => {
                    const fullPath = path ? `${path}/${key}` : key;
                    const isDirectory = value.type !== 'file';

                    return (
                        <li key={fullPath} className="py-1">
                            <div className="flex items-center group">
                                <input
                                    type="checkbox"
                                    checked={selectedFiles.includes(fullPath)}
                                    onChange={(e) => {
                                        if (e.target.checked)
                                        {
                                            setSelectedFiles([...selectedFiles, fullPath]);
                                        } else
                                        {
                                            setSelectedFiles(selectedFiles.filter((file) => file !== fullPath));
                                        }
                                    }}
                                    className="mr-2"
                                />
                                {isDirectory ? (
                                    <Icon
                                        name="folder"
                                        size={16}
                                        className="mr-2 text-yellow-400"
                                    />
                                ) : (
                                    <Icon name="file" size={16} className="mr-2 text-cyan-400" />
                                )}
                                <button
                                    className="text-gray-300 hover:text-cyan-400 transition-colors duration-200"
                                    onClick={() => !isDirectory && onSelectFile(fullPath)}
                                >
                                    {key}
                                </button>
                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {isDirectory && (
                                        <>
                                            <button
                                                onClick={() => onCreateFile(fullPath)}
                                                className="text-gray-500 hover:text-cyan-400 mr-2"
                                            >
                                                <Icon name="file-plus" size={14} />
                                            </button>
                                            <button
                                                onClick={() => onCreateFolder(fullPath)}
                                                className="text-gray-500 hover:text-purple-400 mr-2"
                                            >
                                                <Icon name="folder-plus" size={14} />
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => onRenameFile(fullPath, prompt("Enter new name:", key))}
                                        className="text-gray-500 hover:text-yellow-400 mr-2"
                                    >
                                        <Icon name="edit" size={14} />
                                    </button>
                                    <button
                                        onClick={() => onDeleteFile(fullPath)}
                                        className="text-gray-500 hover:text-red-400 mr-2"
                                    >
                                        <Icon name="trash" size={14} />
                                    </button>
                                    {!isDirectory && (
                                        <button
                                            onClick={() => onDownloadFile(fullPath)}
                                            className="text-gray-500 hover:text-green-400"
                                        >
                                            <Icon name="download" size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {isDirectory && renderTree(value, fullPath)}
                        </li>
                    );
                })}
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
                renderTree(files.contents)
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




const NexusCodeEditor = ({
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
        const isNextjsComponent = activeFile.startsWith("components/");
        const isNextjsPage = activeFile.startsWith("pages/");

        const input = useCodeAsInput
            ? `${promptInput}\n\nExisting code:\n${currentCode}\n\n${isNextjsComponent
                ? "This is a Next.js component. Ensure the generated code is a valid React component."
                : isNextjsPage
                    ? "This is a Next.js page. Ensure the generated code is a valid Next.js page component."
                    : ""
            }`
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
                            <NexusIcon name="file" size={14} className="mr-2 text-cyan-400" />
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
                                <NexusIcon name="x" size={14} />
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
                                    <option value="anthropic">Anthropic Claude</option>
                                    <option value="gpt4">GPT-4</option>
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
                            {/* Add more settings here if needed */}
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
        const isNextjsComponent = activeFile.startsWith("components/");
        const isNextjsPage = activeFile.startsWith("pages/");

        const input = useCodeAsInput
            ? `${promptInput}\n\nExisting code:\n${currentCode}\n\n${isNextjsComponent
                ? "This is a Next.js component. Ensure the generated code is a valid React component."
                : isNextjsPage
                    ? "This is a Next.js page. Ensure the generated code is a valid Next.js page component."
                    : ""
            }`
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
                                    <option value="anthropic">Anthropic Claude</option>
                                    <option value="gpt4">GPT-4</option>
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
                            {/* Add more settings here if needed */}
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
                        {page.replace(/\.(js|tsx?)$/, "").replace(/^index$/, "/")}
                    </Tab>
                ))}
            </Tab.List>
        </Tab.Group>
    );
};

const QuantumPageTabs = ({ pages, activePage, setActivePage }) => {
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
                        {page.replace(/\.(js|tsx?)$/, "").replace(/^index$/, "/")}
                    </Tab>
                ))}
            </Tab.List>
        </Tab.Group>
    );
};


const QuantumNexusLinuxIDE = () => {
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
    const [apiKeys, setApiKeys] = useState({
        groq: "",
        anthropic: "",
        gpt4: "",
    });

    const API_URL = `${baseUrl.replace(/\/$/, "")}/api/execute-command`;

    // useEffect(() => {
    //   if (baseUrl) {
    //     fetchFileStructure();
    //     fetchPages();
    //     fetchGitBranch();
    //   }
    // }, [baseUrl]);
    const synchronizeQuantumState = useCallback(async () => {
        await fetchFileStructure();
        await fetchPages();
        await fetchGitBranch();
        setCommandOutput("Quantum state synchronized.");
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
            // Optionally refresh file structure if the command might have changed it
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
            const output = await executeCommand(
                "tree -J -L 4 /content/my-nextjs-app"
            );
            const parsedStructure = parseFileStructure(JSON.parse(output)[0]);
            setFileStructure(parsedStructure);
        } catch (error)
        {
            console.error("Error fetching file structure:", error);
            setCommandOutput(`Error fetching file structure: ${error.message}`);
            setFileStructure({});
        }
    };

    const fetchPages = async () => {
        try
        {
            const output = await executeCommand(
                "ls /content/my-nextjs-app/src/pages"
            );
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






















    // const handleQuantumFileSelection = async (filePath, content) => {
    //   try {
    //     const escapedContent = content.replace(/'/g, "'\\''");
    //     await executeCommand(
    //       `echo '${escapedContent}' > /content/my-nextjs-app/${filePath}`
    //     );
    //     setCommandOutput(`File ${filePath} saved successfully.`);
    //     if (autoRefresh) {
    //       refreshPreview();
    //     }
    //   } catch (error) {
    //     console.error(`Error saving file ${filePath}:`, error);
    //     setCommandOutput(`Error saving file ${filePath}: ${error.message}`);
    //   }
    // };



    const handleQuantumFileSelection = useCallback(async (filePath) => {
        if (!openFiles[filePath])
        {
            try
            {
                const content = await executeCommand(
                    `cat /content/my-nextjs-app/${filePath}`
                );
                setOpenFiles((prevFiles) => ({ ...prevFiles, [filePath]: content }));
            } catch (error)
            {
                console.error(`Error in quantum entanglement for ${filePath}:`, error);
                setOpenFiles((prevFiles) => ({
                    ...prevFiles,
                    [filePath]: `// Quantum decoherence detected for ${filePath}`,
                }));
            }
        }
        setActiveFile(filePath);
    }, [openFiles, executeCommand]);



    // const handleQuantumFileSelectFile = async (filePath) => {
    //   if (!openFiles[filePath]) {
    //     try {
    //       const content = await executeCommand(
    //         `cat /content/my-nextjs-app/${filePath}`
    //       );
    //       setOpenFiles({ ...openFiles, [filePath]: content });
    //     } catch (error) {
    //       console.error(`Error fetching file content for ${filePath}:`, error);
    //       setOpenFiles({
    //         ...openFiles,
    //         [filePath]: `// Error loading content for ${filePath}`,
    //       });
    //     }
    //   }
    //   setActiveFile(filePath);
    // };

    const handleQuantumFileCreation = async (path) => {
        const fileName = prompt("Enter file name:");
        if (fileName)
        {
            const fullPath = path ? `${path}/${fileName}` : fileName;
            try
            {
                await executeCommand(
                    `touch /content/my-nextjs-app/${fullPath}`
                );
                setCommandOutput(`File ${fullPath} created successfully.`);
                fetchFileStructure();
            } catch (error)
            {
                console.error(`Error creating file ${fullPath}:`, error);
                setCommandOutput(
                    `Error creating file ${fullPath}: ${error.message}`
                );
            }
        }
    };

    const handleQuantumFileCreateFolder = async (path) => {
        const folderName = prompt("Enter folder name:");
        if (folderName)
        {
            const fullPath = path ? `${path}/${folderName}` : folderName;
            try
            {
                await executeCommand(
                    `mkdir -p /content/my-nextjs-app/${fullPath}`
                );
                setCommandOutput(`Folder ${fullPath} created successfully.`);
                fetchFileStructure();
            } catch (error)
            {
                console.error(`Error creating folder ${fullPath}:`, error);
                setCommandOutput(
                    `Error creating folder ${fullPath}: ${error.message}`
                );
            }
        }
    };

    const handleQuantumFileDeleteFile = async (filePath) => {
        if (confirm(`Are you sure you want to delete ${filePath}?`))
        {
            try
            {
                await executeCommand(`rm -r /content/my-nextjs-app/${filePath}`);
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



















    const handleQuantumFileRenameFile = async (oldPath, newName) => {
        const dirName = oldPath.split('/').slice(0, -1).join('/');
        const newPath = dirName ? `${dirName}/${newName}` : newName;
        try
        {
            await executeCommand(
                `mv /content/my-nextjs-app/${oldPath} /content/my-nextjs-app/${newPath}`
            );
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
    const handleQuantumFileDownloadFile = async (filePath) => {
        try
        {
            const content = await executeCommand(
                `cat /content/my-nextjs-app/${filePath}`
            );
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

    const handleQuantumFileSearch = async () => {
        try
        {
            const output = await executeCommand(
                `grep -r "${searchQuery}" /content/my-nextjs-app/src`
            );
            setCommandOutput(output);
        } catch (error)
        {
            console.error("Error searching files:", error);
            setCommandOutput(`Error searching files: ${error.message}`);
        }
    };

    const handleQuantumFileGitCommit = async () => {
        const message = prompt("Enter commit message:");
        if (message)
        {
            try
            {
                await executeCommand("cd /content/my-nextjs-app && git add .");
                const output = await executeCommand(`cd /content/my-nextjs-app && git commit -m "${message}"`);
                setCommandOutput(output);
                fetchGitBranch();
            } catch (error)
            {
                console.error("Error making git commit:", error);
                setCommandOutput(`Error making git commit: ${error.message}`);
            }
        }
    };

    const handleQuantumFileGitPush = async () => {
        try
        {
            const output = await executeCommand("cd /content/my-nextjs-app && git push");
            setCommandOutput(output);
        } catch (error)
        {
            console.error("Error pushing to git:", error);
            setCommandOutput(`Error pushing to git: ${error.message}`);
        }
    };

    const handleQuantumFileGitPull = async () => {
        try
        {
            const output = await executeCommand("cd /content/my-nextjs-app && git pull");
            setCommandOutput(output);
            fetchFileStructure();
            fetchGitBranch();
        } catch (error)
        {
            console.error("Error pulling from git:", error);
            setCommandOutput(`Error pulling from git: ${error.message}`);
        }
    };

    const handleQuantumFileRefresh = () => {
        fetchFileStructure();
        fetchPages();
        setCommandOutput("File structure and pages refreshed.");
    };

    const debouncedSave = useCallback(
        debounce((filePath, content) => {
            handleQuantumFileSelection(filePath, content);
        }, 1000),
        []
    );

    const handleQuantumFileCodeChange = (filePath, newContent) => {
        setOpenFiles({ ...openFiles, [filePath]: newContent });
        debouncedSave(filePath, newContent);
    };

    const refreshPreview = () => {
        setPreviewKey((prevKey) => prevKey + 1);
        const pageRoute = activePage === "index.js" ? "" : activePage.replace(/\.(js|tsx?)$/, "");
        setPreviewUrl(`${baseUrl}/${pageRoute}`);
    };

    const CommandExecutor = ({ onExecute, commandOutput }) => {
        const [command, setCommand] = useState("");

        const handleQuantumFileSubmit = (e) => {
            e.preventDefault();
            onExecute(command);
            setCommand("");
        };

        return (
            <NeomorphicContainer className="p-4 border border-gray-800">
                <div className="flex items-center mb-4">
                    <Terminal size={24} className="mr-2 text-green-400" />
                    <h2 className="text-xl font-bold text-green-400">Terminal</h2>
                </div>
                <form onSubmit={handleQuantumFileSubmit} className="flex mb-4">
                    <input
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        placeholder="Enter command"
                        className="flex-grow mr-2 p-2 bg-gray-800 text-green-400 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500 border-r border-gray-700"
                    />
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-black px-4 py-2 rounded-r flex items-center transition-colors duration-200 shadow-lg shadow-green-500/50"
                    >
                        <Play size={16} className="mr-2" /> Run
                    </button>
                </form>
                <NeomorphicContainer className="p-4">
                    <h3 className="text-lg font-semibold mb-2 text-green-400">Output</h3>
                    <pre className="bg-gray-800 p-3 rounded-lg overflow-x-auto text-sm h-40 text-green-300 font-mono">
                        {commandOutput}
                    </pre>
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

            <div className="mb-4 flex items-center">
                <input
                    type="text"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="Enter quantum entanglement URL (e.g., https://your-ngrok-url.ngrok.io)"
                    className="flex-grow mr-2 p-2 bg-gray-800 text-cyan-400 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <div className="text-sm text-gray-400">
                    Current Quantum State: {gitBranch}
                </div>
            </div>
            <div className="flex-grow grid grid-cols-5 gap-4 mb-4">
                <div className="col-span-1">
                    <QuantumFileExplorer
                        files={fileStructure || {}}
                        onSelectFile={handleQuantumFileSelection}
                        onCreateFile={handleQuantumFileCreation}
                        onCreateFolder={handleQuantumFileFolderCreation}
                        onDeleteFile={handleQuantumFileDeletion}
                        onRenameFile={handleQuantumFileRename}
                        onDownloadFile={handleQuantumFileDownload}
                        selectedFiles={selectedFiles}
                        setSelectedFiles={setSelectedFiles}
                        onRefresh={synchronizeQuantumState}
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
                            onClick={handleQuantumFileSearch}
                            className="mt-2 w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded transition-colors duration-200"
                        >
                            Search
                        </button>
                    </div>
                    <div className="mt-4 flex justify-between">
                        <button
                            onClick={handleQuantumFileGitCommit}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors duration-200"
                        >
                            Commit
                        </button>
                        <button
                            onClick={handleQuantumFileGitPush}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors duration-200"
                        >
                            Push
                        </button>
                        <button
                            onClick={handleQuantumFileGitPull}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors duration-200"
                        >
                            Pull
                        </button>
                    </div>
                </div>
                <div className="col-span-2">
                    <CodeEditor
                        files={openFiles}
                        onSave={handleQuantumFileSelection}
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
                        onChange={handleQuantumFileCodeChange}
                    />
                </div>
                <div className="col-span-2">
                    <NeomorphicContainer className="h-full p-4 flex flex-col border border-gray-800">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-purple-400 flex items-center">
                                <Icon name="play" size={24} className="mr-2" />
                                Live Preview
                            </h2>
                            <div className="flex items-center">
                                <button
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full flex items-center transition-colors duration-200 shadow-lg shadow-purple-500/50 mr-2"
                                    onClick={refreshPreview}
                                >
                                    <Icon name="refresh" size={16} className="mr-2" /> Refresh
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
                                src={previewUrl}
                                className="w-full flex-grow border-2 border-gray-800 rounded-lg bg-white mt-4"
                                title="Live Preview"
                            />
                        ) : (
                            <div className="w-full flex-grow flex items-center justify-center text-gray-500">
                                Enter a base URL to preview your website
                            </div>
                        )}
                    </NeomorphicContainer>
                </div>
            </div>
            <div className="h-60">
                <CommandExecutor
                    onExecute={handleQuantumFileExecuteCommand}
                    commandOutput={commandOutput}
                />
            </div>
            <div className="mt-4 bg-gray-800 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-cyan-400">
                    Keyboard Shortcuts
                </h3>
                <ul className="text-sm">
                    <li>
                        <kbd>Ctrl + S</kbd>: Save current file
                    </li>
                    <li>
                        <kbd>Ctrl + F</kbd>: Search in files
                    </li>
                    <li>
                        <kbd>Ctrl + P</kbd>: Quick file open
                    </li>
                    <li>
                        <kbd>Ctrl + `</kbd>: Toggle terminal
                    </li>
                    <li>
                        <kbd>Ctrl + B</kbd>: Toggle file explorer
                    </li>
                </ul>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                apiKeys={apiKeys}
                onUpdateApiKey={handleQuantumFileUpdateApiKey}
            />
            <BugTrackerModal
                isOpen={isBugTrackerOpen}
                onClose={() => setIsBugTrackerOpen(false)}
            />
            <KanbanModal
                isOpen={isKanbanOpen}
                onClose={() => setIsKanbanOpen(false)}
            />
        </div>
    );
};

export default QuantumNexusLinuxIDE;
