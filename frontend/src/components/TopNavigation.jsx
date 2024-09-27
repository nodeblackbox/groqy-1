// src/components/TopNavigation.jsx

'use client';

import React from 'react';
import { Sun, Moon, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PropTypes from 'prop-types';

export default function TopNavigation({ toggleDarkMode, toggleSettings }) {
    return (
        <div className="w-full bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center shadow-sm">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Quantum Nexus</h1>
            <div className="flex space-x-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" onClick={toggleDarkMode} aria-label="Toggle Dark Mode">
                                <Sun className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Toggle Dark Mode</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" onClick={toggleSettings} aria-label="Open Settings">
                                <Settings2 className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Settings</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}

TopNavigation.propTypes = {
    toggleDarkMode: PropTypes.func.isRequired,
    toggleSettings: PropTypes.func.isRequired,
};