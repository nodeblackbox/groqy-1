// src/components/SideNavigation.jsx

'use client';

import React from 'react';
import {
    MessageSquare,
    Workflow,
    FileUp,
    Wrench,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PropTypes from 'prop-types';

const navigationItems = [
    { id: 'chat', label: 'Chat', icon: <MessageSquare className="h-5 w-5 mr-2" /> },
    { id: 'workflow', label: 'Workflow', icon: <Workflow className="h-5 w-5 mr-2" /> },
    { id: 'fileUpload', label: 'File Upload', icon: <FileUp className="h-5 w-5 mr-2" /> },
    { id: 'tooling', label: 'Tooling', icon: <Wrench className="h-5 w-5 mr-2" /> },
];

export default function SideNavigation({
    isSidebarExpanded,
    toggleSidebar,
    currentView,
    setCurrentView,
    availableModels,
    state,
    setState,
    saveApiKey,
    setSystemPrompt,
    resetSettings,
}) {
    return (
        <aside className={`transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-16'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                {isSidebarExpanded && (
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Quantum Nexus</h1>
                )}
                <Button variant="ghost" size="sm" onClick={toggleSidebar}>
                    {isSidebarExpanded ? <ChevronLeft /> : <ChevronRight />}
                </Button>
            </div>
            <div className="flex-1 p-4">
                <nav className="space-y-2">
                    <TooltipProvider>
                        {navigationItems.map(item => (
                            <Tooltip key={item.id}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size={isSidebarExpanded ? "default" : "icon"}
                                        onClick={() => setCurrentView(item.id)}
                                        className={`w-full justify-start ${currentView === item.id ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300' : ''}`}
                                    >
                                        {item.icon}
                                        {isSidebarExpanded && item.label}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">{item.label}</TooltipContent>
                            </Tooltip>
                        ))}
                    </TooltipProvider>
                </nav>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {/* Additional Sidebar Content if needed */}
            </div>
        </aside>
    );
}

SideNavigation.propTypes = {
    isSidebarExpanded: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
    currentView: PropTypes.string.isRequired,
    setCurrentView: PropTypes.func.isRequired,
    availableModels: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
    saveApiKey: PropTypes.func.isRequired,
    setSystemPrompt: PropTypes.func.isRequired,
    resetSettings: PropTypes.func.isRequired,
};