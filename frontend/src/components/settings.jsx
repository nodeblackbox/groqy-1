'use client';

import React, { useState, useEffect } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Settings2, Sun, Moon } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

export default function Settings({
    state,
    setState,
    saveApiKey,
    setSystemPrompt,
    resetSettings,
    toggleDarkMode,
}) {
    const [availableModels, setAvailableModels] = useState({
        ollama: [],
        groq: [{ label: 'llama-3.1-70b-versatile', value: 'llama-3.1-70b-versatile' }],
    });

    useEffect(() => {
        fetchOllamaModels();
    }, []);

    const fetchOllamaModels = async () => {
        try {
            const response = await fetch('/api/ollama-models');
            if (!response.ok) {
                throw new Error('Failed to fetch Ollama models');
            }
            const data = await response.json();
            setAvailableModels(prev => ({
                ...prev,
                ollama: data.models.map(model => ({ label: model, value: model })),
            }));
        } catch (error) {
            console.error('Error fetching Ollama models:', error);
            // You might want to show an error notification here
        }
    };

    const handleApiChange = (value) => {
        const useGroq = value === 'groq';
        setState(prev => ({
            ...prev,
            settings: { ...prev.settings, api: value, useGroq },
        }));
    };

    const handleModelChange = (value) => {
        setState(prev => ({
            ...prev,
            settings: { ...prev.settings, model: value },
        }));
    };

    const handleTemperatureChange = (value) => {
        setState(prev => ({
            ...prev,
            settings: { ...prev.settings, temperature: value[0] },
        }));
    };

    const handleMaxTokensChange = (value) => {
        setState(prev => ({
            ...prev,
            settings: { ...prev.settings, maxTokens: value[0] },
        }));
    };

    const handleStreamChange = (checked) => {
        setState(prev => ({
            ...prev,
            settings: { ...prev.settings, stream: checked },
        }));
    };

    return (
        <div className="space-y-4">
            <Button variant="outline" className="w-full mb-2" onClick={toggleDarkMode}>
                {state.settings.darkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                {state.settings.darkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
            <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="outline" className="w-full">
                        <Settings2 className="mr-2 h-4 w-4" /> Settings
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Configuration</DrawerTitle>
                        <DrawerDescription>Configure the settings for the model and messages.</DrawerDescription>
                    </DrawerHeader>
                    <ScrollArea className="h-[calc(100vh-10rem)] p-4 space-y-4">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="api-selection" className="text-sm font-medium">Select API</Label>
                                <Select
                                    value={state.settings.api}
                                    onValueChange={handleApiChange}
                                >
                                    <SelectTrigger id="api-selection" className="w-full">
                                        <SelectValue placeholder="Select an API" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ollama">Ollama</SelectItem>
                                        <SelectItem value="groq">GROQ</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {state.settings.useGroq && (
                                <div>
                                    <Label htmlFor="api-key" className="text-sm font-medium">API Key (for GROQ)</Label>
                                    <Input
                                        id="api-key"
                                        type="password"
                                        value={state.apiKey}
                                        onChange={(e) => saveApiKey(e.target.value)}
                                        placeholder="Enter your GROQ API key"
                                        className="w-full mt-1"
                                    />
                                </div>
                            )}
                            <div>
                                <Label htmlFor="model" className="text-sm font-medium">Model</Label>
                                <Select
                                    value={state.settings.model}
                                    onValueChange={handleModelChange}
                                >
                                    <SelectTrigger id="model" className="w-full">
                                        <SelectValue placeholder="Select a model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableModels[state.settings.api]?.map((model) => (
                                            <SelectItem key={model.value} value={model.value}>
                                                {model.label}
                                            </SelectItem>
                                        )) || <SelectItem disabled>No models available</SelectItem>}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="temperature" className="text-sm font-medium">Temperature: {state.settings.temperature}</Label>
                                <Slider
                                    id="temperature"
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    value={[state.settings.temperature]}
                                    onValueChange={handleTemperatureChange}
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <Label htmlFor="max-tokens" className="text-sm font-medium">Max Tokens: {state.settings.maxTokens}</Label>
                                <Slider
                                    id="max-tokens"
                                    min={1}
                                    max={2048}
                                    step={1}
                                    value={[state.settings.maxTokens]}
                                    onValueChange={handleMaxTokensChange}
                                    className="mt-2"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="stream"
                                    checked={state.settings.stream}
                                    onCheckedChange={handleStreamChange}
                                />
                                <Label htmlFor="stream" className="text-sm font-medium">Stream responses</Label>
                            </div>
                            <div>
                                <Label htmlFor="system-prompt" className="text-sm font-medium">System Prompt</Label>
                                <Textarea
                                    id="system-prompt"
                                    placeholder="Enter system prompt"
                                    value={state.systemPrompt}
                                    onChange={(e) => setSystemPrompt(e.target.value)}
                                    className="mt-1 w-full"
                                />
                            </div>
                            <Button onClick={resetSettings} className="w-full">Reset to Defaults</Button>
                        </div>
                    </ScrollArea>
                </DrawerContent>
            </Drawer>
        </div>
    );
}