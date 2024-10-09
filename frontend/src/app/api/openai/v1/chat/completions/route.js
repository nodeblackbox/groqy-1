// app/api/openai/v1/chat/completions/route.js

import { NextResponse } from 'next/server';
import axios from 'axios';

// Retrieve configurations from environment variables
const BASE_URL = 'http://127.0.0.1:8000'; // Use IPv4 to avoid connection issues
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://127.0.0.1:11434/'; // Ensure IPv4
const AIMLAPI_API_KEY = process.env.AIMLAPI_API_KEY;

// Configuration for different providers
const config = {
    groq: {
        apiKey: GROQ_API_KEY,
        provider: 'groq',
        listModelsUrl: 'https://api.groq.com/openai/v1/models',
        chatCompletionUrl: 'https://api.groq.com/openai/v1/chat/completions',
    },
    ollama: {
        apiUrl: OLLAMA_API_URL,
        provider: 'ollama',
        listModelsEndpoint: '/api/tags',
        chatCompletionEndpoint: '/api/chat',
    },
    aimlapi: {
        apiKey: AIMLAPI_API_KEY,
        provider: 'aimlapi',
        listModelsUrl: 'https://api.aimlapi.com/models',
        chatCompletionUrl: 'https://api.aimlapi.com/chat/completions',
    },
};

// Role Mapping Strategy
const roleMappings = {
    groq: (role) => role, // No change needed
    aimlapi: (role) => role, // No change needed
    ollama: (role) => (role === 'function' ? 'user' : role),
    // Add more providers here if needed
};

/**
 * Logs informational messages.
 * @param {string} message - The message to log.
 * @param {Object} meta - Additional metadata.
 */
function logInfo(message, meta = {}) {
    console.log(JSON.stringify({ level: 'info', message, ...meta }));
}

/**
 * Logs error messages.
 * @param {string} message - The error message to log.
 * @param {Object} meta - Additional metadata.
 */
function logError(message, meta = {}) {
    console.error(JSON.stringify({ level: 'error', message, ...meta }));
}

/**
 * Validates the incoming request payload.
 * Ensures that 'model' is a string and 'messages' is a non-empty array of objects with 'role' and 'content'.
 * @param {Object} payload - The request payload.
 * @returns {Object} - An object containing 'isValid' and 'errors'.
 */
function validateRequestPayload(payload) {
    const errors = [];

    if (!payload) {
        errors.push("Payload is missing.");
        return { isValid: false, errors };
    }

    const { model, messages, ...rest } = payload;

    if (!model || typeof model !== 'string') {
        errors.push('Invalid or missing "model" field.');
    }

    if (!messages || !Array.isArray(messages)) {
        errors.push('"messages" must be a non-empty array.');
    } else if (messages.length === 0) {
        errors.push('"messages" array cannot be empty.');
    } else {
        messages.forEach((msg, index) => {
            if (!msg.role || typeof msg.role !== 'string') {
                errors.push(`Message at index ${index} is missing a valid "role".`);
            }
            if (!msg.content || typeof msg.content !== 'string') {
                errors.push(`Message at index ${index} is missing valid "content".`);
            }
        });
    }

    return { isValid: errors.length === 0, errors };
}

/**
 * Recalls relevant memories from GravityRAG based on a query.
 * @param {string} title - The query title.
 * @param {number} top_k - Number of top memories to recall.
 * @returns {Object} - Retrieved memories or error details.
 */
async function recallRelevantMemories(title, top_k) {
    const url = `${BASE_URL}/gravrag/recall_memory`;
    const headers = {
        'Content-Type': 'application/json',
    };
    const body = {
        query: title,
        top_k: top_k,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        if (response.ok) {
            const data = await response.json();
            logInfo('Memories recalled successfully from GravityRAG', { data });
            return data;
        } else {
            const errorText = await response.text();
            logError('GravityRAG recall request failed', { status: response.status, errorText });
            return {
                error: `Request failed with status code ${response.status}`,
                details: errorText,
            };
        }
    } catch (error) {
        logError('Error recalling memories from GravityRAG', { error: error.message });
        return {
            error: 'Request failed',
            details: error.message,
        };
    }
}

/**
 * Creates a new memory in GravityRAG.
 * @param {string} content - The content of the memory.
 * @param {Object} metadata - Metadata associated with the memory.
 * @returns {Object} - The created memory or error details.
 */
async function createMemoryInGravityRag(content, metadata) {
    // Ensure content is a string
    content = JSON.stringify(content);  // Stringify if content is not already a string

    // If metadata is already an object, there's no need to parse it
    // If it's coming in as a string, parse it, otherwise just use it directly
    if (typeof metadata === 'string') {
        try {
            metadata = JSON.parse(metadata);  // Parse if it's a JSON string
        } catch (error) {
            logError("Invalid JSON in metadata", { error: error.message });
            throw new Error("Invalid JSON in metadata");
        }
    }

    // Logging the content and metadata to be sent
    logInfo("Sending to GravityRAG", { content, metadata });

    try {
        const response = await fetch(`${BASE_URL}/gravrag/create_memory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
                metadata: metadata,
            }),
        });

        logInfo("Response status from GravityRAG:", { status: response.status });

        if (!response.ok) {
            // Log the full response text for more details in case of error
            const errorText = await response.text();
            throw new Error(`Error creating memory: ${response.statusText} - ${errorText}`);
        }

        const result = await response.json();
        logInfo("Memory created successfully in GravityRAG", { result });
        return result;

    } catch (error) {
        // Log full error object for better debugging
        logError('Error creating memory in GravityRAG', { error: error });
        throw error;
    }
}

/**
 * Generates metadata for memory creation.
 * @param {Array} messages - Array of message objects.
 * @param {string} assistantResponse - Assistant's response.
 * @returns {Object} - Metadata object.
 */
function generateMetadataForCreate(messages, assistantResponse) {
    return {
        user: {
            role: 'user',
            question: messages.map(msg => msg.content).join(' '),
        },
        assistant: {
            role: 'assistant',
            response: assistantResponse,
        },
    };
}

/**
 * Processes the relevant data retrieved from GravityRAG.
 * @param {Object} data - Retrieved data.
 * @returns {Object} - Processed data.
 */
function processRelevantData(data) {
    // Implement any necessary processing logic here
    return data;
}

/**
 * Class to handle GravityRAG integrations.
 */
class GravityRAG {
    /**
     * Stores the conversation in GravityRAG.
     * @param {Array} messages - Array of message objects.
     * @param {string} response - Assistant's response.
     * @returns {Promise<Object>} - Result of the createMemory operation.
     */
    async process(messages, response) {
        const content = `Previous Conversation between the User and the Model: ${JSON.stringify(messages)}`;
        const metadata = generateMetadataForCreate(messages, response);
        try {
            const result = await createMemoryInGravityRag(content, metadata);
            return result;
        } catch (error) {
            logError('Failed to process GravityRAG memory creation', { error: error.message });
            throw error;
        }
    }

    /**
     * Recalls relevant data from GravityRAG.
     * @param {string} userMessage - The user's message.
     * @param {number} top_k - Number of memories to recall.
     * @returns {Promise<Object>} - Retrieved memories.
     */
    async recall(userMessage, top_k = 3) {
        try {
            const relevantData = await recallRelevantMemories(userMessage, top_k);
            return processRelevantData(relevantData);
        } catch (error) {
            logError('Error recalling from GravityRAG', { error: error.message });
            throw error;
        }
    }
}

/**
 * Fetches available models from all providers.
 * @returns {Object} - Available models categorized by provider.
 */
async function fetchAvailableModels() {
    const modelFetchPromises = [
        getGroqModels(),
        getOllamaModels(),
        getAIMLAPIModels(),
    ];
    const [groqModels, ollamaModels, aimlapiModels] = await Promise.all(modelFetchPromises);

    return {
        groq: groqModels,
        ollama: ollamaModels,
        aimlapi: aimlapiModels,
    };
}

/**
 * Fetches available models from Groq.
 * @returns {Array} - Array of Groq models.
 */
async function getGroqModels() {
    if (!config.groq.apiKey) {
        logInfo('GROQ_API_KEY not set. Skipping Groq models.');
        return [];
    }
    try {
        const response = await axios.get(config.groq.listModelsUrl, {
            headers: {
                Authorization: `Bearer ${config.groq.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.data && response.data.data) {
            return response.data.data.map((model) => ({
                name: model.id,
                provider: config.groq.provider,
                type: model.type,
            }));
        }
        return [];
    } catch (error) {
        logError('Error fetching Groq models', { error: error.message });
        return [];
    }
}

/**
 * Fetches available models from Ollama.
 * @returns {Array} - Array of Ollama models.
 */
async function getOllamaModels() {
    if (!config.ollama.apiUrl) {
        logInfo('OLLAMA_API_URL not set. Skipping Ollama models.');
        return [];
    }
    try {
        const response = await axios.get(`${config.ollama.apiUrl}${config.ollama.listModelsEndpoint}`, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000, // 5 seconds timeout to prevent hanging
        });
        if (response.data && Array.isArray(response.data)) {
            return response.data.map((model) => ({
                name: model.name || model,
                provider: config.ollama.provider,
                type: 'chat-completion',
            }));
        }
        return [];
    } catch (error) {
        logError('Error fetching Ollama models', { error: error.message });
        return [];
    }
}

/**
 * Fetches available models from AIMLAPI.
 * @returns {Array} - Array of AIMLAPI models.
 */
async function getAIMLAPIModels() {
    if (!config.aimlapi.apiKey) {
        logInfo('AIMLAPI_API_KEY not set. Skipping AIMLAPI models.');
        return [];
    }
    try {
        const response = await axios.get(config.aimlapi.listModelsUrl, {
            headers: {
                Authorization: `Bearer ${config.aimlapi.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.data && response.data.data) {
            return response.data.data.map((model) => ({
                name: model.id,
                provider: config.aimlapi.provider,
                type: model.type,
            }));
        }
        return [];
    } catch (error) {
        logError('Error fetching AIMLAPI models', { error: error.message });
        return [];
    }
}

/**
 * Finds a model by name across all providers.
 * @param {string} modelName - The name of the model to find.
 * @param {Object} availableModels - The available models categorized by provider.
 * @returns {Object|null} - The model object or null if not found.
 */
function findModelByName(modelName, availableModels) {
    for (const provider in availableModels) {
        const model = availableModels[provider].find((m) => m.name === modelName);
        if (model) return model;
    }
    return null;
}

/**
 * Maps the role based on the provider's role mapping strategy.
 * @param {string} provider - The provider name.
 * @param {string} role - The original role.
 * @returns {string} - The mapped role.
 */
function mapRole(provider, role) {
    if (roleMappings[provider]) {
        return roleMappings[provider](role);
    }
    // Default to 'user' if provider or role mapping not defined
    return 'user';
}

/**
 * Processes messages by mapping roles and handling system messages for specific providers.
 * @param {string} provider - The provider name.
 * @param {Array} messages - The array of message objects.
 * @returns {Array} - The processed array of message objects.
 */
function processMessages(provider, messages) {
    let processedMessages = [];
    let systemMessage = '';

    for (let message of messages) {
        let mappedRole = mapRole(provider, message.role);

        if (provider === 'anthropic' && message.role === 'system') {
            systemMessage = message.content;
            continue;
        }

        processedMessages.push({
            role: mappedRole,
            content: message.content,
        });
    }

    if (provider === 'anthropic' && systemMessage) {
        if (processedMessages.length > 0) {
            processedMessages[0].content = `${systemMessage}\n\nHuman: ${processedMessages[0].content}`;
        } else {
            processedMessages.push({
                role: 'user',
                content: `${systemMessage}`,
            });
        }
    }

    return processedMessages;
}

/**
 * Converts input to provider-specific format.
 * @param {Object} input - The input object containing model, messages, and parameters.
 * @param {string} fromFormat - The format to convert from.
 * @param {string} toFormat - The format to convert to.
 * @returns {Object} - The converted input object.
 */
function convertApiFormat(input, fromFormat, toFormat) {
    if (fromFormat === toFormat) return input;

    const formatters = {
        universal: {
            groq: (input) => ({
                model: input.model,
                messages: input.messages,
                temperature: input.parameters?.temperature,
                top_p: input.parameters?.top_p,
                max_tokens: input.parameters?.max_tokens,
                stream: input.parameters?.stream,
                stop: input.parameters?.stop,
                tools: input.parameters?.tools || [],
                tool_choice: input.parameters?.tool_choice || 'auto',
            }),
            ollama: (input) => ({
                model: input.model,
                prompt: input.messages.map((m) => m.content).join('\n'),
                options: {
                    temperature: input.parameters?.temperature,
                    top_p: input.parameters?.top_p,
                    max_tokens: input.parameters?.max_tokens,
                },
                stream: input.parameters?.stream,
            }),
            aimlapi: (input) => ({
                model: input.model,
                messages: input.messages,
                temperature: input.parameters?.temperature || 1,
                top_p: input.parameters?.top_p || 1,
                max_tokens: input.parameters?.max_tokens || 150,
                stream: input.parameters?.stream || false,
                stop: input.parameters?.stop || null,
            }),
        },
    };

    if (!formatters[fromFormat] || !formatters[fromFormat][toFormat]) {
        throw new Error(`No formatter defined for ${fromFormat} to ${toFormat}`);
    }

    return formatters[fromFormat][toFormat](input);
}

/**
 * Makes an API call to the specified provider.
 * @param {Object} model - The model object containing provider and name.
 * @param {Array} messages - The array of message objects.
 * @param {Object} parameters - Additional parameters for the API call.
 * @returns {Object} - The API response.
 */
async function unifiedApiCall(model, messages, parameters = {}) {
    switch (model.provider) {
        case 'groq':
            return await callGroqAPI(model, messages, parameters);
        case 'ollama':
            return await callOllamaAPI(model, messages, parameters);
        case 'aimlapi':
            return await callAIMLAPIApi(model, messages, parameters);
        default:
            throw new Error(`Unsupported provider: ${model.provider}`);
    }
}

/**
 * Calls the Groq API for chat completions.
 * @param {Object} model - The model object.
 * @param {Array} messages - The array of message objects.
 * @param {Object} parameters - Additional parameters.
 * @returns {Object} - The API response.
 */
async function callGroqAPI(model, messages, parameters) {
    try {
        const response = await axios.post(
            config.groq.chatCompletionUrl,
            {
                model: model.name,
                messages,
                temperature: parameters.temperature,
                top_p: parameters.top_p,
                max_tokens: parameters.max_tokens,
                stream: parameters.stream,
                stop: parameters.stop,
                tools: parameters.tools || [],
                tool_choice: parameters.tool_choice || 'auto',
            },
            {
                headers: {
                    Authorization: `Bearer ${config.groq.apiKey}`,
                    'Content-Type': 'application/json',
                },
                responseType: parameters.stream ? 'stream' : 'json',
            }
        );
        logInfo('Groq API call successful', { model: model.name });
        return response;
    } catch (error) {
        logError('Error calling Groq API', { error: error.response?.data || error.message });
        throw new Error(error.response?.data?.error || 'Groq API error');
    }
}

/**
 * Calls the Ollama API for chat completions.
 * @param {Object} model - The model object.
 * @param {Array} messages - The array of message objects.
 * @param {Object} parameters - Additional parameters.
 * @returns {Object} - The API response.
 */
async function callOllamaAPI(model, messages, parameters) {
    try {
        const response = await axios.post(
            `${config.ollama.apiUrl}${config.ollama.chatCompletionEndpoint}`,
            {
                model: model.name,
                prompt: messages.map((m) => m.content).join('\n'), // Adjust based on Ollama's API
                options: {
                    temperature: parameters.temperature,
                    top_p: parameters.top_p,
                    max_tokens: parameters.max_tokens,
                },
            },
            {
                headers: { 'Content-Type': 'application/json' },
                responseType: parameters.stream ? 'stream' : 'json',
                timeout: 5000, // 5 seconds timeout to prevent hanging
            }
        );
        logInfo('Ollama API call successful', { model: model.name });
        return response;
    } catch (error) {
        logError('Error calling Ollama API', { error: error.response?.data || error.message });
        throw new Error(error.response?.data?.error || 'Ollama API error');
    }
}

/**
 * Calls the AIMLAPI API for chat completions.
 * @param {Object} model - The model object.
 * @param {Array} messages - The array of message objects.
 * @param {Object} parameters - Additional parameters.
 * @returns {Object} - The API response.
 */
async function callAIMLAPIApi(model, messages, parameters) {
    try {
        const response = await axios.post(
            config.aimlapi.chatCompletionUrl,
            {
                model: model.name,
                messages,
                temperature: parameters.temperature || 1,
                top_p: parameters.top_p || 1,
                max_tokens: parameters.max_tokens || 150,
                stream: parameters.stream || false,
                stop: parameters.stop || null,
            },
            {
                headers: {
                    Authorization: `Bearer ${config.aimlapi.apiKey}`,
                    'Content-Type': 'application/json',
                },
                responseType: parameters.stream ? 'stream' : 'json',
            }
        );
        logInfo('AIMLAPI call successful', { model: model.name });
        return response;
    } catch (error) {
        logError('Error calling AIMLAPI', { error: error.response?.data || error.message });
        throw new Error(error.response?.data?.error || 'AIMLAPI API error');
    }
}

/**
 * Standardizes the response from different providers.
 * @param {string} provider - The provider name.
 * @param {Object} response - The provider's response.
 * @returns {Object} - Standardized response.
 */
function standardizeResponse(provider, response) {
    switch (provider) {
        case 'groq':
        case 'aimlapi':
            return response.data; // Assuming both return in standard format
        case 'ollama':
            // Assuming Ollama returns responses in a specific format
            return {
                id: response.data.id || null,
                object: 'chat.completion',
                created: Math.floor(Date.now() / 1000),
                model: response.data.model || null,
                choices: [
                    {
                        message: {
                            role: 'assistant',
                            content: response.data.response || '', // Adjust based on Ollama's response format
                        },
                        finish_reason: 'stop',
                        index: 0,
                    },
                ],
            };
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
}

/**
 * Enhances the response with GravityRAG memories.
 * @param {Array} messages - Array of message objects.
 * @param {Object} response - The standardized response.
 * @returns {Object} - Enhanced response.
 */
async function enhanceWithGravityRag(messages, response) {
    const gravityRag = new GravityRAG();
    try {
        await gravityRag.process(messages, response.choices[0].message.content);
        return response;
    } catch (error) {
        // Proceed without enhancing if GravityRAG fails
        logError('GravityRAG enhancement failed', { error: error.message });
        return response;
    }
}

/**
 * Handles the POST request for chat completions.
 * @param {Request} request - The incoming request.
 * @returns {Response} - The API response.
 */
export async function POST(request) {
    try {
        const payload = await request.json();
        logInfo('Received POST request', { payload });

        // Validate payload
        const { isValid, errors } = validateRequestPayload(payload);
        if (!isValid) {
            logError('Invalid request payload', { errors });
            return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
        }

        const { model, messages, ...parameters } = payload;

        // Fetch available models with caching
        const currentTime = Date.now();
        if (!global.cachedModels || currentTime - global.lastFetchTime > 5 * 60 * 1000) { // 5 minutes cache
            global.cachedModels = await fetchAvailableModels();
            global.lastFetchTime = currentTime;
            logInfo('Fetched available models', { models: global.cachedModels });
        }

        // Find the selected model
        const selectedModel = findModelByName(model, global.cachedModels);
        if (!selectedModel) {
            logError('Model not found', { model });
            return NextResponse.json({ error: `Model "${model}" not found.` }, { status: 404 });
        }

        // Process messages (role mapping)
        const processedMessages = processMessages(selectedModel.provider, messages);
        logInfo('Processed messages', { processedMessages });

        // Convert input to provider-specific format
        const convertedInput = convertApiFormat(
            { model: selectedModel.name, messages: processedMessages, parameters },
            'universal',
            selectedModel.provider
        );
        logInfo('Converted input format', { convertedInput });

        // Make the API call
        let apiResponse;
        try {
            apiResponse = await unifiedApiCall(selectedModel, convertedInput.messages, convertedInput);
        } catch (apiError) {
            logError('API call failed', { error: apiError.message });
            return NextResponse.json({ error: apiError.message }, { status: 500 });
        }

        // Handle streaming responses
        if (parameters.stream) {
            logInfo('Handling streaming response');
            const stream = apiResponse.data; // Assuming responseType is 'stream'
            const encoder = new TextEncoder();

            return new Response(
                new ReadableStream({
                    async start(controller) {
                        stream.on('data', (chunk) => {
                            const data = chunk.toString();
                            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                        });
                        stream.on('end', () => {
                            controller.close();
                        });
                        stream.on('error', (err) => {
                            logError('Stream error', { error: err.message });
                            controller.error(err);
                        });
                    },
                }),
                {
                    headers: { 'Content-Type': 'text/event-stream' },
                }
            );
        }

        // Standardize the response format
        let standardizedResponse;
        try {
            standardizedResponse = standardizeResponse(selectedModel.provider, apiResponse);
        } catch (error) {
            logError('Failed to standardize response', { error: error.message });
            return NextResponse.json({ error: 'Failed to process response from provider.' }, { status: 500 });
        }

        // Enhance response with GravityRAG
        try {
            standardizedResponse = await enhanceWithGravityRag(processedMessages, standardizedResponse);
        } catch (error) {
            // Proceed without GravityRAG enhancement if it fails
            logError('GravityRAG enhancement failed', { error: error.message });
        }

        // Return the final response
        return NextResponse.json(standardizedResponse, { status: 200 });
    } catch (error) {
        logError('Unhandled error in POST request handler', { error: error.message });
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

/**
 * Handles the GET request to fetch available models.
 * @param {Request} request - The incoming request.
 * @returns {Response} - The API response.
 */
export async function GET(request) {
    try {
        // Fetch available models with caching
        const currentTime = Date.now();
        if (!global.cachedModels || currentTime - global.lastFetchTime > 5 * 60 * 1000) { // 5 minutes cache
            global.cachedModels = await fetchAvailableModels();
            global.lastFetchTime = currentTime;
            logInfo('Fetched available models', { models: global.cachedModels });
        }

        return NextResponse.json(global.cachedModels, { status: 200 });
    } catch (error) {
        logError('Error handling GET request', { error: error.message });
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}