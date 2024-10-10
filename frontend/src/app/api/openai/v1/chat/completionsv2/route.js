// app/api/openai/v1/chat/completions/route.js

import { NextResponse } from 'next/server';
import axios from 'axios';

// Retrieve configurations from environment variables
const BASE_URL = 'http://127.0.0.1:8000'; // Use IPv4 to avoid connection issues
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://127.0.0.1:11434/'; // Ensure IPv4
const AIMLAPI_API_KEY = process.env.AIMLAPI_API_KEY;
const EMBEDDING_API_URL = process.env.EMBEDDING_API_URL; // Embedding API URL
const EMBEDDING_API_KEY = process.env.EMBEDDING_API_KEY; // Embedding API Key

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
    embedding: {
        apiUrl: EMBEDDING_API_URL,
        apiKey: EMBEDDING_API_KEY,
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

    if (!payload)
    {
        errors.push("Payload is missing.");
        return { isValid: false, errors };
    }

    const { model, messages, ...rest } = payload;

    if (!model || typeof model !== 'string')
    {
        errors.push('Invalid or missing "model" field.');
    }

    if (!messages || !Array.isArray(messages))
    {
        errors.push('"messages" must be a non-empty array.');
    } else if (messages.length === 0)
    {
        errors.push('"messages" array cannot be empty.');
    } else
    {
        messages.forEach((msg, index) => {
            if (!msg.role || typeof msg.role !== 'string')
            {
                errors.push(`Message at index ${index} is missing a valid "role".`);
            }
            if (!msg.content || typeof msg.content !== 'string')
            {
                errors.push(`Message at index ${index} is missing valid "content".`);
            }
        });
    }

    return { isValid: errors.length === 0, errors };
}

/**
 * Embedding utility functions.
 */
class EmbeddingUtil {
    /**
     * Generates embeddings for a given text using the embedding API.
     * @param {string} text - The text to embed.
     * @returns {Array} - The embedding vector.
     */
    static async generateEmbedding(text) {
        try
        {
            const response = await axios.post(
                `${config.embedding.apiUrl}/embed`,
                { text },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${config.embedding.apiKey}`,
                    },
                }
            );
            if (response.data && response.data.embedding)
            {
                return response.data.embedding;
            } else
            {
                throw new Error('Invalid response from embedding API');
            }
        } catch (error)
        {
            logError('Error generating embedding', { error: error.message });
            throw error;
        }
    }

    /**
     * Computes cosine similarity between two vectors.
     * @param {Array} vecA - First vector.
     * @param {Array} vecB - Second vector.
     * @returns {number} - Cosine similarity.
     */
    static cosineSimilarity(vecA, vecB) {
        const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
        const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
        const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
        return dotProduct / (magnitudeA * magnitudeB);
    }
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
        const metadata = this.generateMetadata(messages, response);
        try
        {
            const result = await this.createMemory(content, metadata);
            return result;
        } catch (error)
        {
            logError('Failed to process GravityRAG memory creation', { error: error.message });
            throw error;
        }
    }

    /**
     * Generates metadata for memory creation.
     * @param {Array} messages - Array of message objects.
     * @param {string} assistantResponse - Assistant's response.
     * @returns {Object} - Metadata object.
     */
    generateMetadata(messages, assistantResponse) {
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
     * Creates a new memory in GravityRAG.
     * @param {string} content - The content of the memory.
     * @param {Object} metadata - Metadata associated with the memory.
     * @returns {Object} - The created memory or error details.
     */
    async createMemory(content, metadata) {
        try
        {
            const response = await axios.post(
                `${BASE_URL}/gravrag/create_memory`,
                {
                    content: content,
                    metadata: metadata,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200)
            {
                logInfo("Memory created successfully in GravityRAG", { result: response.data });
                return response.data;
            } else
            {
                logError("Failed to create memory in GravityRAG", { status: response.status, data: response.data });
                throw new Error(`GravityRAG memory creation failed with status ${response.status}`);
            }
        } catch (error)
        {
            logError('Error creating memory in GravityRAG', { error: error.message });
            throw error;
        }
    }

    /**
     * Recalls relevant memories from GravityRAG based on a query.
     * @param {string} userMessage - The user's message.
     * @param {number} top_k - Number of top memories to recall.
     * @returns {Array} - Retrieved memories.
     */
    async recall(userMessage, top_k = 3) {
        try
        {
            const response = await axios.post(
                `${BASE_URL}/gravrag/recall_memory`,
                {
                    query: userMessage,
                    top_k: top_k,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200 && response.data.memories)
            {
                logInfo('Memories recalled successfully from GravityRAG', { memories: response.data.memories });
                return response.data.memories;
            } else
            {
                logError('Failed to recall memories from GravityRAG', { status: response.status, data: response.data });
                return [];
            }
        } catch (error)
        {
            logError('Error recalling memories from GravityRAG', { error: error.message });
            return [];
        }
    }
}

/**
 * Embeds the logic for Retrieval-Augmented Generation (RAG).
 */
class RAGProcessor {
    constructor() {
        this.gravityRAG = new GravityRAG();
    }

    /**
     * Retrieves relevant context using RAG.
     * @param {Array} messages - The processed messages.
     * @returns {string} - The retrieved context.
     */
    async retrieveRAGContext(messages) {
        try
        {
            const lastUserMessage = messages.slice().reverse().find(msg => msg.role === 'user');
            if (!lastUserMessage)
            {
                return '';
            }

            // Generate embedding for the last user message
            const queryEmbedding = await EmbeddingUtil.generateEmbedding(lastUserMessage.content);

            // Retrieve similar documents from the database or RAG system
            const similarDocuments = await this.findSimilarDocuments(queryEmbedding);

            // Concatenate the content of similar documents to form the context
            const context = similarDocuments.map(doc => doc.content).join('\n\n');

            return context;

        } catch (error)
        {
            logError('Error retrieving RAG context', { error: error.message });
            return ''; // Return empty context on error
        }
    }

    /**
     * Finds similar documents based on the query embedding.
     * @param {Array} queryEmbedding - The embedding of the query.
     * @param {number} top_k - Number of top documents to retrieve.
     * @returns {Array} - Array of similar documents.
     */
    async findSimilarDocuments(queryEmbedding, top_k = 5) {
        // Implement logic to retrieve documents from your database
        // For example, fetch documents from an index and compute cosine similarity
        // Using EmbeddingUtil.cosineSimilarity()
        // Return the top_k most similar documents

        // Placeholder implementation: Recall from GravityRAG
        const memories = await this.gravityRAG.recall(queryEmbedding, top_k);
        return memories; // Assuming each memory has a 'content' field
    }

    /**
     * Injects context into the messages for the LLM.
     * @param {Array} messages - The processed messages.
     * @param {string} context - The context to inject.
     * @returns {Array} - The augmented messages.
     */
    injectContextIntoMessages(messages, context) {
        if (!context)
        {
            return messages;
        }

        // Prepend the context as a system message
        return [
            { role: 'system', content: `Use the following context to answer the user's question:\n\n${context}` },
            ...messages,
        ];
    }

    /**
     * Processes the messages by injecting context.
     * @param {Array} messages - The processed messages.
     * @returns {Promise<Array>} - The augmented messages.
     */
    async processMessagesWithRAG(messages) {
        const context = await this.retrieveRAGContext(messages);
        const augmentedMessages = this.injectContextIntoMessages(messages, context);
        return augmentedMessages;
    }

    /**
     * Enhances the response with GravityRAG memories.
     * @param {Array} messages - Array of message objects.
     * @param {string} response - Assistant's response.
     * @returns {Promise<Object>} - Enhanced response.
     */
    async enhanceWithGravityRag(messages, response) {
        try
        {
            await this.gravityRAG.process(messages, response);
            return response;
        } catch (error)
        {
            // Proceed without enhancing if GravityRAG fails
            logError('GravityRAG enhancement failed', { error: error.message });
            return response;
        }
    }
}

/**
 * Processes and standardizes the LLM response.
 */
class ResponseProcessor {
    /**
     * Post-processes the LLM response to ensure it's well-formatted.
     * @param {Object} llmResponse - The response from the LLM.
     * @param {Object} parameters - Additional parameters.
     * @returns {Object} - The post-processed response.
     */
    async postProcessResponse(llmResponse, parameters) {
        try
        {
            const assistantMessage = llmResponse.choices[0].message.content;

            // If the expected output is JSON, validate and format it
            if (parameters.expected_format === 'json')
            {
                const validatedOutput = await this.validateAndFormatJSON(assistantMessage);
                llmResponse.choices[0].message.content = validatedOutput;
            }

            // Implement multi-modal processing if needed
            if (parameters.expected_modalities)
            {
                llmResponse = await this.processMultiModalOutput(llmResponse, parameters.expected_modalities);
            }

            // Optionally, implement other post-processing steps
            // ...

            return llmResponse;

        } catch (error)
        {
            logError('Error in post-processing LLM response', { error: error.message });
            throw error;
        }
    }

    /**
     * Validates and formats the assistant's message as JSON.
     * @param {string} message - The assistant's message.
     * @returns {string} - The validated and formatted JSON string.
     */
    async validateAndFormatJSON(message) {
        try
        {
            // Parse the message as JSON
            const jsonData = JSON.parse(message);

            // Optionally, validate the JSON schema here
            // ...

            // Return the formatted JSON string
            return JSON.stringify(jsonData, null, 2);

        } catch (error)
        {
            logError('Error validating JSON output', { error: error.message });

            // Use an LLM to correct the JSON format
            const correctedJSON = await this.correctJSONFormat(message);
            return correctedJSON;
        }
    }

    /**
     * Uses an LLM to correct the JSON format.
     * @param {string} message - The assistant's message.
     * @returns {string} - The corrected JSON string.
     */
    async correctJSONFormat(message) {
        try
        {
            const prompt = `The following text is intended to be a JSON object but contains errors. Correct the errors and provide a valid JSON object.\n\n${message}`;
            const corrected = await this.callLLM(prompt);
            return corrected;
        } catch (error)
        {
            logError('Failed to correct JSON format using LLM', { error: error.message });
            return '{}'; // Fallback to empty JSON
        }
    }

    /**
     * Calls an LLM to process a prompt.
     * This function should be implemented to interact with your LLM service.
     * @param {string} prompt - The prompt to send to the LLM.
     * @returns {string} - The LLM's response.
     */
    async callLLM(prompt) {
        // Implement the logic to call your dedicated LLM for post-processing
        // For example, using Groq API or another provider
        // Placeholder implementation:
        try
        {
            const response = await axios.post(
                config.groq.chatCompletionUrl, // Assuming Groq is used for post-processing
                {
                    model: 'post-processing-model', // Replace with your dedicated LLM model
                    messages: [
                        { role: 'system', content: 'You are an assistant that corrects and formats JSON.' },
                        { role: 'user', content: prompt },
                    ],
                    temperature: 0.2, // Lower temperature for deterministic output
                    max_tokens: 500,
                },
                {
                    headers: {
                        Authorization: `Bearer ${config.groq.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data && response.data.choices && response.data.choices.length > 0)
            {
                return response.data.choices[0].message.content;
            } else
            {
                throw new Error('Invalid response from LLM');
            }

        } catch (error)
        {
            logError('Error calling LLM for JSON correction', { error: error.message });
            throw error;
        }
    }

    /**
     * Processes multi-modal outputs.
     * @param {Object} llmResponse - The response from the LLM.
     * @param {Array} modalities - Expected modalities (e.g., ['text', 'image']).
     * @returns {Object} - The processed multi-modal response.
     */
    async processMultiModalOutput(llmResponse, modalities) {
        // Implement multi-modal processing based on expected modalities
        // For example, parsing image URLs, handling audio data, etc.
        // Placeholder implementation:
        return llmResponse;
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
    if (!config.groq.apiKey)
    {
        logInfo('GROQ_API_KEY not set. Skipping Groq models.');
        return [];
    }
    try
    {
        const response = await axios.get(config.groq.listModelsUrl, {
            headers: {
                Authorization: `Bearer ${config.groq.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.data && response.data.data)
        {
            return response.data.data.map((model) => ({
                name: model.id,
                provider: config.groq.provider,
                type: model.type,
            }));
        }
        return [];
    } catch (error)
    {
        logError('Error fetching Groq models', { error: error.message });
        return [];
    }
}

/**
 * Fetches available models from Ollama.
 * @returns {Array} - Array of Ollama models.
 */
async function getOllamaModels() {
    if (!config.ollama.apiUrl)
    {
        logInfo('OLLAMA_API_URL not set. Skipping Ollama models.');
        return [];
    }
    try
    {
        const response = await axios.get(`${config.ollama.apiUrl}${config.ollama.listModelsEndpoint}`, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 5000, // 5 seconds timeout to prevent hanging
        });
        if (response.data && Array.isArray(response.data))
        {
            return response.data.map((model) => ({
                name: model.name || model,
                provider: config.ollama.provider,
                type: 'chat-completion',
            }));
        }
        return [];
    } catch (error)
    {
        logError('Error fetching Ollama models', { error: error.message });
        return [];
    }
}

/**
 * Fetches available models from AIMLAPI.
 * @returns {Array} - Array of AIMLAPI models.
 */
async function getAIMLAPIModels() {
    if (!config.aimlapi.apiKey)
    {
        logInfo('AIMLAPI_API_KEY not set. Skipping AIMLAPI models.');
        return [];
    }
    try
    {
        const response = await axios.get(config.aimlapi.listModelsUrl, {
            headers: {
                Authorization: `Bearer ${config.aimlapi.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        if (response.data && response.data.data)
        {
            return response.data.data.map((model) => ({
                name: model.id,
                provider: config.aimlapi.provider,
                type: model.type,
            }));
        }
        return [];
    } catch (error)
    {
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
    for (const provider in availableModels)
    {
        const model = availableModels[provider].find((m) => m.name === modelName);
        if (model) return model;
    }
    return null;
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

    for (let message of messages)
    {
        let mappedRole = mapRole(provider, message.role);

        if (provider === 'anthropic' && message.role === 'system')
        {
            systemMessage = message.content;
            continue;
        }

        processedMessages.push({
            role: mappedRole,
            content: message.content,
        });
    }

    if (provider === 'anthropic' && systemMessage)
    {
        if (processedMessages.length > 0)
        {
            processedMessages[0].content = `${systemMessage}\n\nHuman: ${processedMessages[0].content}`;
        } else
        {
            processedMessages.push({
                role: 'user',
                content: `${systemMessage}`,
            });
        }
    }

    return processedMessages;
}

/**
 * Maps the role based on the provider's role mapping strategy.
 * @param {string} provider - The provider name.
 * @param {string} role - The original role.
 * @returns {string} - The mapped role.
 */
function mapRole(provider, role) {
    if (roleMappings[provider])
    {
        return roleMappings[provider](role);
    }
    // Default to 'user' if provider or role mapping not defined
    return 'user';
}

/**
 * Class to handle Retrieval-Augmented Generation (RAG) processing.
 */
class RAGProcessor {
    constructor() {
        this.gravityRAG = new GravityRAG();
    }

    /**
     * Processes messages with RAG to inject relevant context.
     * @param {Array} messages - The processed messages.
     * @returns {Promise<Array>} - The augmented messages with context.
     */
    async processMessagesWithRAG(messages) {
        const context = await this.retrieveRAGContext(messages);
        const augmentedMessages = this.injectContextIntoMessages(messages, context);
        return augmentedMessages;
    }

    /**
     * Retrieves relevant context using RAG.
     * @param {Array} messages - The processed messages.
     * @returns {string} - The retrieved context.
     */
    async retrieveRAGContext(messages) {
        try
        {
            const lastUserMessage = messages.slice().reverse().find(msg => msg.role === 'user');
            if (!lastUserMessage)
            {
                return '';
            }

            // Generate embedding for the last user message
            const queryEmbedding = await EmbeddingUtil.generateEmbedding(lastUserMessage.content);

            // Retrieve similar documents from the GravityRAG system
            const similarDocuments = await this.findSimilarDocuments(queryEmbedding);

            // Concatenate the content of similar documents to form the context
            const context = similarDocuments.map(doc => doc.content).join('\n\n');

            return context;

        } catch (error)
        {
            logError('Error retrieving RAG context', { error: error.message });
            return ''; // Return empty context on error
        }
    }

    /**
     * Finds similar documents based on the query embedding.
     * @param {Array} queryEmbedding - The embedding of the query.
     * @param {number} top_k - Number of top documents to retrieve.
     * @returns {Array} - Array of similar documents.
     */
    async findSimilarDocuments(queryEmbedding, top_k = 5) {
        // Implement logic to retrieve documents from your database
        // For example, fetch documents from an index and compute cosine similarity
        // Using EmbeddingUtil.cosineSimilarity()
        // Return the top_k most similar documents

        // Placeholder implementation: Recall from GravityRAG
        const memories = await this.gravityRAG.recall(queryEmbedding, top_k);
        return memories; // Assuming each memory has a 'content' field
    }

    /**
     * Injects context into the messages for the LLM.
     * @param {Array} messages - The processed messages.
     * @param {string} context - The context to inject.
     * @returns {Array} - The augmented messages.
     */
    injectContextIntoMessages(messages, context) {
        if (!context)
        {
            return messages;
        }

        // Prepend the context as a system message
        return [
            { role: 'system', content: `Use the following context to answer the user's question:\n\n${context}` },
            ...messages,
        ];
    }

    /**
     * Enhances the response with GravityRAG memories.
     * @param {Array} messages - Array of message objects.
     * @param {string} response - Assistant's response.
     * @returns {Promise<Object>} - Enhanced response.
     */
    async enhanceWithGravityRag(messages, response) {
        try
        {
            await this.gravityRAG.process(messages, response);
            return response;
        } catch (error)
        {
            // Proceed without enhancing if GravityRAG fails
            logError('GravityRAG enhancement failed', { error: error.message });
            return response;
        }
    }
}

/**
 * Processes and standardizes the LLM response.
 */
class ResponseProcessor {
    /**
     * Post-processes the LLM response to ensure it's well-formatted.
     * @param {Object} llmResponse - The response from the LLM.
     * @param {Object} parameters - Additional parameters.
     * @returns {Object} - The post-processed response.
     */
    async postProcessResponse(llmResponse, parameters) {
        try
        {
            const assistantMessage = llmResponse.choices[0].message.content;

            // If the expected output is JSON, validate and format it
            if (parameters.expected_format === 'json')
            {
                const validatedOutput = await this.validateAndFormatJSON(assistantMessage);
                llmResponse.choices[0].message.content = validatedOutput;
            }

            // Implement multi-modal processing if needed
            if (parameters.expected_modalities)
            {
                llmResponse = await this.processMultiModalOutput(llmResponse, parameters.expected_modalities);
            }

            // Optionally, implement other post-processing steps
            // ...

            return llmResponse;

        } catch (error)
        {
            logError('Error in post-processing LLM response', { error: error.message });
            throw error;
        }
    }

    /**
     * Validates and formats the assistant's message as JSON.
     * @param {string} message - The assistant's message.
     * @returns {string} - The validated and formatted JSON string.
     */
    async validateAndFormatJSON(message) {
        try
        {
            // Parse the message as JSON
            const jsonData = JSON.parse(message);

            // Optionally, validate the JSON schema here
            // ...

            // Return the formatted JSON string
            return JSON.stringify(jsonData, null, 2);

        } catch (error)
        {
            logError('Error validating JSON output', { error: error.message });

            // Use an LLM to correct the JSON format
            const correctedJSON = await this.correctJSONFormat(message);
            return correctedJSON;
        }
    }

    /**
     * Uses an LLM to correct the JSON format.
     * @param {string} message - The assistant's message.
     * @returns {string} - The corrected JSON string.
     */
    async correctJSONFormat(message) {
        try
        {
            const prompt = `The following text is intended to be a JSON object but contains errors. Correct the errors and provide a valid JSON object.\n\n${message}`;
            const corrected = await this.callLLM(prompt);
            return corrected;
        } catch (error)
        {
            logError('Failed to correct JSON format using LLM', { error: error.message });
            return '{}'; // Fallback to empty JSON
        }
    }

    /**
     * Calls an LLM to process a prompt.
     * This function should be implemented to interact with your LLM service.
     * @param {string} prompt - The prompt to send to the LLM.
     * @returns {string} - The LLM's response.
     */
    async callLLM(prompt) {
        // Implement the logic to call your dedicated LLM for post-processing
        // For example, using Groq API or another provider
        // Placeholder implementation:
        try
        {
            const response = await axios.post(
                config.groq.chatCompletionUrl, // Assuming Groq is used for post-processing
                {
                    model: 'post-processing-model', // Replace with your dedicated LLM model
                    messages: [
                        { role: 'system', content: 'You are an assistant that corrects and formats JSON.' },
                        { role: 'user', content: prompt },
                    ],
                    temperature: 0.2, // Lower temperature for deterministic output
                    max_tokens: 500,
                },
                {
                    headers: {
                        Authorization: `Bearer ${config.groq.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data && response.data.choices && response.data.choices.length > 0)
            {
                return response.data.choices[0].message.content;
            } else
            {
                throw new Error('Invalid response from LLM');
            }

        } catch (error)
        {
            logError('Error calling LLM for JSON correction', { error: error.message });
            throw error;
        }
    }

    /**
     * Processes multi-modal outputs.
     * @param {Object} llmResponse - The response from the LLM.
     * @param {Array} modalities - Expected modalities (e.g., ['text', 'image']).
     * @returns {Object} - The processed multi-modal response.
     */
    async processMultiModalOutput(llmResponse, modalities) {
        // Implement multi-modal processing based on expected modalities
        // For example, parsing image URLs, handling audio data, etc.
        // Placeholder implementation:
        return llmResponse;
    }
}

/**
 * Class to handle Retrieval-Augmented Generation (RAG) processing.
 */
class RAGProcessor {
    constructor() {
        this.gravityRAG = new GravityRAG();
    }

    /**
     * Processes messages with RAG to inject relevant context.
     * @param {Array} messages - The processed messages.
     * @returns {Promise<Array>} - The augmented messages with context.
     */
    async processMessagesWithRAG(messages) {
        const context = await this.retrieveRAGContext(messages);
        const augmentedMessages = this.injectContextIntoMessages(messages, context);
        return augmentedMessages;
    }

    /**
     * Retrieves relevant context using RAG.
     * @param {Array} messages - The processed messages.
     * @returns {string} - The retrieved context.
     */
    async retrieveRAGContext(messages) {
        try
        {
            const lastUserMessage = messages.slice().reverse().find(msg => msg.role === 'user');
            if (!lastUserMessage)
            {
                return '';
            }

            // Generate embedding for the last user message
            const queryEmbedding = await EmbeddingUtil.generateEmbedding(lastUserMessage.content);

            // Retrieve similar documents from the GravityRAG system
            const similarDocuments = await this.findSimilarDocuments(queryEmbedding);

            // Concatenate the content of similar documents to form the context
            const context = similarDocuments.map(doc => doc.content).join('\n\n');

            return context;

        } catch (error)
        {
            logError('Error retrieving RAG context', { error: error.message });
            return ''; // Return empty context on error
        }
    }

    /**
     * Finds similar documents based on the query embedding.
     * @param {Array} queryEmbedding - The embedding of the query.
     * @param {number} top_k - Number of top documents to retrieve.
     * @returns {Array} - Array of similar documents.
     */
    async findSimilarDocuments(queryEmbedding, top_k = 5) {
        // Implement logic to retrieve documents from your database
        // For example, fetch documents from an index and compute cosine similarity
        // Using EmbeddingUtil.cosineSimilarity()
        // Return the top_k most similar documents

        // Placeholder implementation: Recall from GravityRAG
        const memories = await this.gravityRAG.recall(queryEmbedding, top_k);
        return memories; // Assuming each memory has a 'content' field
    }

    /**
     * Injects context into the messages for the LLM.
     * @param {Array} messages - The processed messages.
     * @param {string} context - The context to inject.
     * @returns {Array} - The augmented messages.
     */
    injectContextIntoMessages(messages, context) {
        if (!context)
        {
            return messages;
        }

        // Prepend the context as a system message
        return [
            { role: 'system', content: `Use the following context to answer the user's question:\n\n${context}` },
            ...messages,
        ];
    }

    /**
     * Enhances the response with GravityRAG memories.
     * @param {Array} messages - Array of message objects.
     * @param {string} response - Assistant's response.
     * @returns {Promise<Object>} - Enhanced response.
     */
    async enhanceWithGravityRag(messages, response) {
        try
        {
            await this.gravityRAG.process(messages, response);
            return response;
        } catch (error)
        {
            // Proceed without enhancing if GravityRAG fails
            logError('GravityRAG enhancement failed', { error: error.message });
            return response;
        }
    }
}

/**
 * Processes and standardizes the LLM response.
 */
class ResponseProcessor {
    /**
     * Post-processes the LLM response to ensure it's well-formatted.
     * @param {Object} llmResponse - The response from the LLM.
     * @param {Object} parameters - Additional parameters.
     * @returns {Object} - The post-processed response.
     */
    async postProcessResponse(llmResponse, parameters) {
        try
        {
            const assistantMessage = llmResponse.choices[0].message.content;

            // If the expected output is JSON, validate and format it
            if (parameters.expected_format === 'json')
            {
                const validatedOutput = await this.validateAndFormatJSON(assistantMessage);
                llmResponse.choices[0].message.content = validatedOutput;
            }

            // Implement multi-modal processing if needed
            if (parameters.expected_modalities)
            {
                llmResponse = await this.processMultiModalOutput(llmResponse, parameters.expected_modalities);
            }

            // Optionally, implement other post-processing steps
            // ...

            return llmResponse;

        } catch (error)
        {
            logError('Error in post-processing LLM response', { error: error.message });
            throw error;
        }
    }

    /**
     * Validates and formats the assistant's message as JSON.
     * @param {string} message - The assistant's message.
     * @returns {string} - The validated and formatted JSON string.
     */
    async validateAndFormatJSON(message) {
        try
        {
            // Parse the message as JSON
            const jsonData = JSON.parse(message);

            // Optionally, validate the JSON schema here
            // ...

            // Return the formatted JSON string
            return JSON.stringify(jsonData, null, 2);

        } catch (error)
        {
            logError('Error validating JSON output', { error: error.message });

            // Use an LLM to correct the JSON format
            const correctedJSON = await this.correctJSONFormat(message);
            return correctedJSON;
        }
    }

    /**
     * Uses an LLM to correct the JSON format.
     * @param {string} message - The assistant's message.
     * @returns {string} - The corrected JSON string.
     */
    async correctJSONFormat(message) {
        try
        {
            const prompt = `The following text is intended to be a JSON object but contains errors. Correct the errors and provide a valid JSON object.\n\n${message}`;
            const corrected = await this.callLLM(prompt);
            return corrected;
        } catch (error)
        {
            logError('Failed to correct JSON format using LLM', { error: error.message });
            return '{}'; // Fallback to empty JSON
        }
    }

    /**
     * Calls an LLM to process a prompt.
     * This function should be implemented to interact with your LLM service.
     * @param {string} prompt - The prompt to send to the LLM.
     * @returns {string} - The LLM's response.
     */
    async callLLM(prompt) {
        // Implement the logic to call your dedicated LLM for post-processing
        // For example, using Groq API or another provider
        // Placeholder implementation:
        try
        {
            const response = await axios.post(
                config.groq.chatCompletionUrl, // Assuming Groq is used for post-processing
                {
                    model: 'post-processing-model', // Replace with your dedicated LLM model
                    messages: [
                        { role: 'system', content: 'You are an assistant that corrects and formats JSON.' },
                        { role: 'user', content: prompt },
                    ],
                    temperature: 0.2, // Lower temperature for deterministic output
                    max_tokens: 500,
                },
                {
                    headers: {
                        Authorization: `Bearer ${config.groq.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data && response.data.choices && response.data.choices.length > 0)
            {
                return response.data.choices[0].message.content;
            } else
            {
                throw new Error('Invalid response from LLM');
            }

        } catch (error)
        {
            logError('Error calling LLM for JSON correction', { error: error.message });
            throw error;
        }
    }

    /**
     * Processes multi-modal outputs.
     * @param {Object} llmResponse - The response from the LLM.
     * @param {Array} modalities - Expected modalities (e.g., ['text', 'image']).
     * @returns {Object} - The processed multi-modal response.
     */
    async processMultiModalOutput(llmResponse, modalities) {
        // Implement multi-modal processing based on expected modalities
        // For example, parsing image URLs, handling audio data, etc.
        // Placeholder implementation:
        return llmResponse;
    }
}

/**
 * Standardizes the response from different providers.
 * @param {string} provider - The provider name.
 * @param {Object} response - The provider's response.
 * @returns {Object} - Standardized response.
 */
function standardizeResponse(provider, response) {
    switch (provider)
    {
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
 * Post-processes and standardizes the LLM response.
 * @param {Object} llmResponse - The raw response from the LLM.
 * @param {Object} parameters - Additional parameters.
 * @returns {Object} - The final, processed response.
 */
async function processLLMResponse(llmResponse, parameters) {
    const responseProcessor = new ResponseProcessor();
    const finalResponse = await responseProcessor.postProcessResponse(llmResponse, parameters);
    return finalResponse;
}

/**
 * Handles the POST request for chat completions.
 * @param {Request} request - The incoming request.
 * @returns {Response} - The API response.
 */
export async function POST(request) {
    try
    {
        const payload = await request.json();
        logInfo('Received POST request', { payload });

        // Validate payload
        const { isValid, errors } = validateRequestPayload(payload);
        if (!isValid)
        {
            logError('Invalid request payload', { errors });
            return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
        }

        const { model, messages, ...parameters } = payload;

        // Fetch available models with caching
        const currentTime = Date.now();
        if (!global.cachedModels || currentTime - global.lastFetchTime > 5 * 60 * 1000)
        { // 5 minutes cache
            global.cachedModels = await fetchAvailableModels();
            global.lastFetchTime = currentTime;
            logInfo('Fetched available models', { models: global.cachedModels });
        }

        // Find the selected model
        const selectedModel = findModelByName(model, global.cachedModels);
        if (!selectedModel)
        {
            logError('Model not found', { model });
            return NextResponse.json({ error: `Model "${model}" not found.` }, { status: 404 });
        }

        // Process messages (role mapping)
        const processedMessages = processMessages(selectedModel.provider, messages);
        logInfo('Processed messages', { processedMessages });

        // Initialize RAG Processor
        const ragProcessor = new RAGProcessor();

        // Process messages with RAG to inject context
        const augmentedMessages = await ragProcessor.processMessagesWithRAG(processedMessages);
        logInfo('Augmented messages with RAG context', { augmentedMessages });

        // Make the API call
        let apiResponse;
        try
        {
            apiResponse = await unifiedApiCall(selectedModel, augmentedMessages, parameters);
        } catch (apiError)
        {
            logError('API call failed', { error: apiError.message });
            return NextResponse.json({ error: apiError.message }, { status: 500 });
        }

        // Standardize the response format
        let standardizedResponse;
        try
        {
            standardizedResponse = standardizeResponse(selectedModel.provider, apiResponse);
        } catch (error)
        {
            logError('Failed to standardize response', { error: error.message });
            return NextResponse.json({ error: 'Failed to process response from provider.' }, { status: 500 });
        }

        // Post-process the response
        const responseProcessor = new ResponseProcessor();
        const finalResponse = await processLLMResponse(standardizedResponse, parameters);

        // Enhance response with GravityRAG memories
        await ragProcessor.enhanceWithGravityRag(processedMessages, finalResponse.choices[0].message.content);

        // Return the final response
        return NextResponse.json(finalResponse, { status: 200 });

    } catch (error)
    {
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
    try
    {
        // Fetch available models with caching
        const currentTime = Date.now();
        if (!global.cachedModels || currentTime - global.lastFetchTime > 5 * 60 * 1000)
        { // 5 minutes cache
            global.cachedModels = await fetchAvailableModels();
            global.lastFetchTime = currentTime;
            logInfo('Fetched available models', { models: global.cachedModels });
        }

        return NextResponse.json(global.cachedModels, { status: 200 });
    } catch (error)
    {
        logError('Error handling GET request', { error: error.message });
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

/**
 * Makes an API call to the specified provider.
 * @param {Object} model - The model object containing provider and name.
 * @param {Array} messages - The array of message objects.
 * @param {Object} parameters - Additional parameters for the API call.
 * @returns {Object} - The API response.
 */
async function unifiedApiCall(model, messages, parameters = {}) {
    switch (model.provider)
    {
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
    try
    {
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
    } catch (error)
    {
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
    try
    {
        const response = await axios.post(
            `${config.ollama.apiUrl}${config.ollama.chatCompletionEndpoint}`,
            {
                model: model.name,
                prompt: messages.map((m) => m.content).join('\n'),
                options: {
                    temperature: parameters.temperature,
                    top_p: parameters.top_p,
                    max_tokens: parameters.max_tokens,
                },
                stream: parameters.stream,
            },
            {
                headers: { 'Content-Type': 'application/json' },
                responseType: parameters.stream ? 'stream' : 'json',
                timeout: 5000, // 5 seconds timeout to prevent hanging
            }
        );
        logInfo('Ollama API call successful', { model: model.name });
        return response;
    } catch (error)
    {
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
    try
    {
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
    } catch (error)
    {
        logError('Error calling AIMLAPI', { error: error.response?.data || error.message });
        throw new Error(error.response?.data?.error || 'AIMLAPI API error');
    }
}
