// src/components/llamaapi/chatApi.js

const OLLAMA_BASE_URL = 'http://localhost:11434/api';
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';

class ChatAPI {
    constructor() {
        this.apiKey = '';
        this.model = 'llama3.1';
        this.systemPrompt = '';
        this.temperature = 0.7;
        this.maxTokens = 1024;
        this.topP = 1;
        this.topK = 0;
        this.stream = false;
        this.useGroq = false;
    }

    setApiKey(key) {
        this.apiKey = key;
    }

    setModel(model) {
        this.model = model;
    }

    setSystemPrompt(prompt) {
        this.systemPrompt = prompt;
    }

    setTemperature(temp) {
        this.temperature = temp;
    }

    setMaxTokens(tokens) {
        this.maxTokens = tokens;
    }

    setTopP(value) {
        this.topP = value;
    }

    setTopK(value) {
        this.topK = value;
    }

    setStream(value) {
        this.stream = value;
    }

    setUseGroq(value) {
        this.useGroq = value;
    }

    async sendMessage(messages) {
        if (this.systemPrompt && !messages.some(m => m.role === 'system')) {
            messages.unshift({ role: 'system', content: this.systemPrompt });
        }

        const url = this.useGroq ? `${GROQ_BASE_URL}/chat/completions` : `${OLLAMA_BASE_URL}/chat`;

        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.useGroq) {
            headers['Authorization'] = `Bearer ${this.apiKey}`;
        }

        const body = this.useGroq
            ? {
                model: this.model,
                messages: messages,
                temperature: this.temperature,
                max_tokens: this.maxTokens,
                top_p: this.topP,
                stream: this.stream,
            }
            : {
                model: this.model,
                messages: messages,
                stream: this.stream,
                options: {
                    temperature: this.temperature,
                    num_predict: this.maxTokens,
                    top_k: this.topK,
                    top_p: this.topP,
                },
            };

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Failed to communicate with ${this.useGroq ? 'GROQ' : 'Ollama'} API`);
        }

        if (this.stream) {
            return response.body;
        } else {
            const data = await response.json();
            return this.useGroq ? data.choices[0].message : data.message;
        }
    }

    async createNewChat(name) {
        return {
            id: Date.now().toString(),
            name: name || `Chat ${Date.now()}`,
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
    }

    async deleteChat(chatId) {
        // Implement actual deletion logic if necessary
        return { success: true, message: 'Chat deleted successfully' };
    }

    async clearChat(chatId) {
        // Implement actual clear logic if necessary
        return { success: true, message: 'Chat cleared successfully' };
    }

    async exportChats(chats) {
        const dataStr = JSON.stringify(chats, null, 2);
        return 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    }

    async importChats(fileContent) {
        return JSON.parse(fileContent);
    }
}

export const chatApi = new ChatAPI();