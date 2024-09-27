// src/app/components/SideNavigation.jsx
// Written by: @Borch
// fitted for dashboardV9 <- cloned from dashboardV7, and modulated with gpt4o readme.md suggestions

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

const navigationItems = [
    { id: 'chat', label: 'Chat', icon: <MessageSquare className="h-5 w-5" /> },
    { id: 'workflow', label: 'Workflow', icon: <Workflow className="h-5 w-5" /> },
    { id: 'fileUpload', label: 'File Upload', icon: <FileUp className="h-5 w-5" /> },
    { id: 'tooling', label: 'Tooling', icon: <Wrench className="h-5 w-5" /> },
];

export default function SideNavigation({
    isSidebarExpanded,
    toggleSidebar,
    currentView,
    setCurrentView,
}) {
    return (
        <aside className={`transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-16'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                {isSidebarExpanded && (
                    <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Menu</h2>
                )}
                <Button variant="ghost" size="sm" onClick={toggleSidebar}>
                    {isSidebarExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                </Button>
            </div>
            <nav className="flex-1 p-4">
                <TooltipProvider>
                    {navigationItems.map(item => (
                        <Tooltip key={item.id}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size={isSidebarExpanded ? "default" : "icon"}
                                    onClick={() => setCurrentView(item.id)}
                                    className={`w-full justify-start mb-2 ${currentView === item.id ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300' : ''}`}
                                >
                                    {item.icon}
                                    {isSidebarExpanded && <span className="ml-2">{item.label}</span>}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">{item.label}</TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </nav>
        </aside>
    );
}