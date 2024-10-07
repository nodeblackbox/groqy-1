import { NextResponse } from 'next/server';
import axios from 'axios';
import { Configuration, OpenAIApi } from 'openai';
import { OllamaApi } from 'ollama-node';
import { GroqApi } from 'groq-sdk';
import { GravityRAG } from '../../../utils/gravityRAG';

const API_MAKER_SECRET_KEY = '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';
// 1. Create a model fetcher function:
async function fetchAvailableModels() {
    const models = {
        ollama: [],
        groq: [],
        openai: []
    };

    try {
        // Fetch Ollama models
        const ollamaApi = new OllamaApi();
        const ollamaModels = await ollamaApi.listModels();
        models.ollama = ollamaModels.map(model => ({ name: model.name, provider: 'ollama' }));

        // Fetch Groq models
        const groqApi = new GroqApi(process.env.GROQ_API_KEY);
        const groqModels = await groqApi.listModels();
        models.groq = groqModels.map(model => ({ name: model.id, provider: 'groq' }));

        // Fetch OpenAI models
        const openaiConfig = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
        const openaiApi = new OpenAIApi(openaiConfig);
        const openaiModels = await openaiApi.listModels();
        models.openai = openaiModels.data.data.map(model => ({ name: model.id, provider: 'openai' }));
    } catch (error) {
        console.error('Error fetching models:', error);
    }

    return models;
}

// 2. Create a model selector function:
function selectModel(task, availableModels) {
    const modelPreferences = {
        apiMaker: ['gpt-4', 'claude-3-opus', 'llama2'],
        codeInterpreter: ['gpt-4', 'claude-3-opus', 'starcoder'],
        codeTranslator: ['gpt-3.5-turbo', 'claude-3-sonnet', 'codet5'],
        codeGenerator: ['gpt-4', 'claude-3-opus', 'starcoder'],
        codeOptimizer: ['gpt-4', 'claude-3-opus', 'wizardcoder'],
        codeRefactorer: ['gpt-4', 'claude-3-opus', 'wizardcoder'],
        codeReviewer: ['gpt-4', 'claude-3-opus', 'starcoder'],
        codeDebugger: ['gpt-4', 'claude-3-opus', 'wizardcoder'],
        codeFormatter: ['gpt-3.5-turbo', 'claude-3-haiku', 'codet5'],
        codeAnalyzer: ['gpt-4', 'claude-3-opus', 'starcoder']
    };

    const preferredModels = modelPreferences[task] || ['gpt-3.5-turbo', 'claude-3-sonnet', 'llama2'];

    for (const modelName of preferredModels) {
        for (const provider in availableModels) {
            const model = availableModels[provider].find(m => m.name.includes(modelName));
            if (model) {
                return model;
            }
        }
    }

    // If no preferred model is available, return the first available model
    for (const provider in availableModels) {
        if (availableModels[provider].length > 0) {
            return availableModels[provider][0];
        }
    }

    throw new Error('No suitable model found');
}

// 3. Create a unified API caller function:
async function unifiedApiCall(model, messages, parameters) {
    switch (model.provider) {
        case 'ollama':

            const ollamaApi = new OllamaApi();
            const ollamaResponse = await ollamaApi.chat({
                model: model.name,
                messages: messages,
                ...parameters
            });
            return ollamaResponse;

        case 'groq':

            const groqApi = new GroqApi(process.env.GROQ_API_KEY);
            const groqResponse = await groqApi.chat.completions.create({
                model: model.name,
                messages: messages,
                ...parameters
            });
            return groqResponse;

        case 'openai':

            const openaiConfig = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
            const openaiApi = new OpenAIApi(openaiConfig);
            const openaiResponse = await openaiApi.createChatCompletion({
                model: model.name,
                messages: messages,
                ...parameters
            });
            return openaiResponse.data;

        default:
            throw new Error(`Unsupported model provider: ${model.provider}`);
    }
}

// 4. Create individual route handler functions for each API endpoint:
async function handleApiMaker(req) {
    const body = await req.json();
    const availableModels = await fetchAvailableModels();
    const selectedModel = selectModel('apiMaker', availableModels);
    const apiResponse = await unifiedApiCall(selectedModel, body.messages, body.parameters);
    const enhancedResponse = useGravityRag(body.messages, apiResponse);
    return NextResponse.json(enhancedResponse);
}

// ... (create similar functions for all other endpoints)

// 5. Set up the main route handler:
export async function POST(req) {
    const pathname = new URL(req.url).pathname;

    switch (pathname) {
        case '/api/openai/v1/chat/completions':
            return handleChatCompletions(req);
        case '/api/openai/v1/apiMaker':
            return handleApiMaker(req);
        case '/api/openai/v1/codeInterpreter':
            return handleCodeInterpreter(req);
        // ... (add cases for all other endpoints)
        default:
            return NextResponse.json({ error: 'Not Found' }, { status: 404 });
    }
}

// 6. Implement the Gravity RAG integration:
function useGravityRag(messages, response) {
    const gravityRag = new GravityRAG();
    const enhancedResponse = gravityRag.process(messages, response);
    return enhancedResponse;
}

// 7. Create a function to convert between different API formats:
function convertApiFormat(input, fromFormat, toFormat) {
    if (fromFormat === toFormat) {
        return input;
    }

    const formatters = {
        openai: {
            ollama: (input) => ({
                model: input.model,
                messages: input.messages,
                stream: input.stream,
                options: {
                    temperature: input.temperature,
                    top_p: input.top_p,
                    frequency_penalty: input.frequency_penalty,
                    presence_penalty: input.presence_penalty,
                    max_tokens: input.max_tokens,
                }
            }),
            groq: (input) => ({
                model: input.model,
                messages: input.messages,
                temperature: input.temperature,
                top_p: input.top_p,
                max_tokens: input.max_tokens,
                stream: input.stream,
            }),
        },
        ollama: {
            openai: (input) => ({
                model: input.model,
                messages: input.messages,
                temperature: input.options?.temperature,
                top_p: input.options?.top_p,
                frequency_penalty: input.options?.frequency_penalty,
                presence_penalty: input.options?.presence_penalty,
                max_tokens: input.options?.max_tokens,
                stream: input.stream,
            }),
            groq: (input) => ({
                model: input.model,
                messages: input.messages,
                temperature: input.options?.temperature,
                top_p: input.options?.top_p,
                max_tokens: input.options?.max_tokens,
                stream: input.stream,
            }),
        },
        groq: {
            openai: (input) => ({
                model: input.model,
                messages: input.messages,
                temperature: input.temperature,
                top_p: input.top_p,
                max_tokens: input.max_tokens,
                stream: input.stream,
            }),
            ollama: (input) => ({
                model: input.model,
                messages: input.messages,
                stream: input.stream,
                options: {
                    temperature: input.temperature,
                    top_p: input.top_p,
                    max_tokens: input.max_tokens,
                }
            }),
        },
    };

    return formatters[fromFormat][toFormat](input);
}

// Main chat completions handler
async function handleChatCompletions(req) {
    try {
        const body = await req.json();
        const availableModels = await fetchAvailableModels();
        const selectedModel = selectModel('chat', availableModels);

        // Convert input format if necessary
        const convertedInput = convertApiFormat(body, 'openai', selectedModel.provider);

        const apiResponse = await unifiedApiCall(selectedModel, convertedInput.messages, convertedInput);
        const enhancedResponse = useGravityRag(convertedInput.messages, apiResponse);

        // Convert output format back to OpenAI format
        const convertedOutput = convertApiFormat(enhancedResponse, selectedModel.provider, 'openai');

        return NextResponse.json(convertedOutput);
    } catch (error) {
        console.error('Error in chat completions:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export { POST };