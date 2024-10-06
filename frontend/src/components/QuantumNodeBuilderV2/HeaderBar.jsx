// src/components/QuantumNodeBuilderV2/HeaderBar.jsx
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import AddTaskDialog from './AddTaskDialog';
import SettingsDialog from './SettingsDialog';
import { Save, Upload, Play } from 'lucide-react';

const HeaderBar = ({
    onAddTask,
    onSaveWorkflow,
    onLoadWorkflow,
    onRunTests,
    loadWorkflowInputRef,
    isDarkMode,
    setIsDarkMode,
    apiKey,
    setApiKey,
    selectedModel,
    setSelectedModel,
}) => {
    return (
        <div className="p-4 bg-gray-900 border-b border-cyan-700 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-cyan-400">Quantum API Node Workflow Builder</h1>
            <div className="flex space-x-2">
                <AddTaskDialog onAddTask={onAddTask} />
                <Button onClick={onSaveWorkflow} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    <Save className="mr-2 h-4 w-4" /> Save Workflow
                </Button>
                <Button onClick={() => loadWorkflowInputRef.current.click()} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    <Upload className="mr-2 h-4 w-4" /> Load Workflow
                </Button>
                <input
                    id="load-workflow"
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={onLoadWorkflow}
                    ref={loadWorkflowInputRef}
                />
                <SettingsDialog
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                    apiKey={apiKey}
                    setApiKey={setApiKey}
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                />
                <Button onClick={onRunTests} className="bg-green-600 hover:bg-green-700 text-white">
                    <Play className="mr-2 h-4 w-4" /> Run Workflow Tests
                </Button>
            </div>
        </div>
    );
};

export default HeaderBar;
