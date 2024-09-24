// src/components/ToolingConfiguration.jsx

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useNotification } from '@/components/ui/NotificationProvider';

const AVAILABLE_MODELS = {
    ollama: [
        { label: 'llama3.1:latest', value: 'llama3.1:latest' },
        { label: 'llama3.1', value: 'llama3.1' },
        { label: 'LLaMA2 30B', value: 'llama2-30b' },
    ],
    groq: [
        { label: 'llama3-groq-70b-8192-tool-use-preview', value: 'llama3-groq-70b-8192-tool-use-preview' },
    ],
};

const ToolingConfiguration = ({ state, setState, saveApiKey, setSystemPrompt, resetSettings }) => {
    const addNotification = useNotification();

    const handleApiChange = (value) => {
        const useGroq = value === 'groq';
        setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, api: value, useGroq },
        }));
    };

    const handleModelChange = (value) => {
        setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, model: value },
        }));
    };

    const handleTemperatureChange = (value) => {
        setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, temperature: value[0] },
        }));
    };

    const handleMaxTokensChange = (value) => {
        setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, maxTokens: value[0] },
        }));
    };

    const handleTopPChange = (value) => {
        setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, topP: value[0] },
        }));
    };

    const handleTopKChange = (value) => {
        setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, topK: value[0] },
        }));
    };

    const handleStreamChange = (checked) => {
        setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, stream: checked },
        }));
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4">Tooling & Configurations</h2>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="api-selection">Select API</Label>
                    <Select
                        value={state.settings.api}
                        onValueChange={handleApiChange}
                    >
                        <SelectTrigger id="api-selection">
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
                        <Label htmlFor="api-key">API Key (for GROQ)</Label>
                        <Input
                            id="api-key"
                            type="password"
                            value={state.apiKey}
                            onChange={(e) => saveApiKey(e.target.value)}
                            placeholder="Enter your GROQ API key"
                        />
                    </div>
                )}
                <div>
                    <Label htmlFor="model">Model</Label>
                    <Select
                        value={state.settings.model}
                        onValueChange={handleModelChange}
                    >
                        <SelectTrigger id="model">
                            <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                            {AVAILABLE_MODELS[state.settings.api]?.map((model) => (
                                <SelectItem key={model.value} value={model.value}>
                                    {model.label}
                                </SelectItem>
                            )) || <SelectItem disabled>No models available</SelectItem>}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="temperature">Temperature: {state.settings.temperature}</Label>
                    <Slider
                        id="temperature"
                        min={0}
                        max={1}
                        step={0.1}
                        value={[state.settings.temperature]}
                        onValueChange={handleTemperatureChange}
                    />
                </div>
                <div>
                    <Label htmlFor="max-tokens">Max Tokens: {state.settings.maxTokens}</Label>
                    <Slider
                        id="max-tokens"
                        min={1}
                        max={2048}
                        step={1}
                        value={[state.settings.maxTokens]}
                        onValueChange={handleMaxTokensChange}
                    />
                </div>
                <div>
                    <Label htmlFor="top-p">Top P: {state.settings.topP}</Label>
                    <Slider
                        id="top-p"
                        min={0}
                        max={1}
                        step={0.1}
                        value={[state.settings.topP]}
                        onValueChange={handleTopPChange}
                    />
                </div>
                <div>
                    <Label htmlFor="top-k">Top K: {state.settings.topK}</Label>
                    <Slider
                        id="top-k"
                        min={0}
                        max={100}
                        step={1}
                        value={[state.settings.topK]}
                        onValueChange={handleTopKChange}
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Switch
                        id="stream"
                        checked={state.settings.stream}
                        onCheckedChange={handleStreamChange}
                    />
                    <Label htmlFor="stream">Stream responses</Label>
                </div>
                <div>
                    <Label htmlFor="system-prompt">System Prompt</Label>
                    <Textarea
                        id="system-prompt"
                        placeholder="Enter system prompt"
                        value={state.systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                    />
                </div>
                <Button onClick={resetSettings}>Reset to Defaults</Button>
            </div>
        </div>
    );
};

export default ToolingConfiguration;
