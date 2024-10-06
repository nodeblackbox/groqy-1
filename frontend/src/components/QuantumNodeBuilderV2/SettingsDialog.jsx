// components/SettingsDialog.jsx
"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings } from 'lucide-react';

const SettingsDialog = ({ isDarkMode, setIsDarkMode, apiKey, setApiKey, selectedModel, setSelectedModel }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 text-cyan-400 border-cyan-500">
                <DialogHeader>
                    <DialogTitle className="text-cyan-400">Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="dark-mode" className="text-cyan-400">Dark Mode</Label>
                        <Switch
                            id="dark-mode"
                            checked={isDarkMode}
                            onCheckedChange={setIsDarkMode}
                        />
                    </div>
                    <div>
                        <Label htmlFor="api-key" className="text-cyan-400">OpenAI API Key</Label>
                        <Input
                            id="api-key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            type="password"
                            className="bg-gray-700 text-cyan-400 border-cyan-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="model-select" className="text-cyan-400">Select Model</Label>
                        <Select value={selectedModel} onValueChange={setSelectedModel}>
                            <SelectTrigger id="model-select" className="bg-gray-700 border-cyan-500">
                                <SelectValue placeholder="Select a model" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                                <SelectItem value="gpt-4">GPT-4</SelectItem>
                                <SelectItem value="gpt-4-32k">GPT-4 32k</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsDialog;