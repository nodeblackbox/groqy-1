// src/components/chatAPI.jsx

const OLLAMA_BASE_URL = 'http://localhost:11434/api';
const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';

class ChatAPI {
    constructor() {
        this.apiKey = '';
        this.model = 'deepseek-coder-v2';
        this.systemPrompt = '';
        this.temperature = 0.7;
        this.maxTokens = 1024;
        this.topP = 1;
        this.topK = 40;
        this.stream = false;
        this.useGroq = false;
        this.retryAttempts = 3;
        this.retryDelay = 1000;
    }

    setApiKey(key) {
        if (typeof key !== 'string' || key.trim() === '') {
            throw new Error('Invalid API key');
        }
        this.apiKey = key.trim();
    }

    setModel(model) {
        if (typeof model !== 'string' || model.trim() === '') {
            throw new Error('Invalid model name');
        }
        this.model = model.trim();
    }

    setSystemPrompt(prompt) {
        if (typeof prompt !== 'string') {
            throw new Error('System prompt must be a string');
        }
        this.systemPrompt = prompt;
    }

    setTemperature(temp) {
        if (typeof temp !== 'number' || temp < 0 || temp > 1) {
            throw new Error('Temperature must be a number between 0 and 1');
        }
        this.temperature = temp;
    }

    setMaxTokens(tokens) {
        if (!Number.isInteger(tokens) || tokens <= 0) {
            throw new Error('Max tokens must be a positive integer');
        }
        this.maxTokens = tokens;
    }

    setTopP(value) {
        if (typeof value !== 'number' || value < 0 || value > 1) {
            throw new Error('Top P must be a number between 0 and 1');
        }
        this.topP = value;
    }

    setTopK(value) {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error('Top K must be a non-negative integer');
        }
        this.topK = value;
    }

    setStream(value) {
        this.stream = Boolean(value);
    }

    setUseGroq(value) {
        this.useGroq = Boolean(value);
    }

    async sendMessage(messages) {
        if (!Array.isArray(messages) || messages.length === 0) {
            throw new Error('Messages must be a non-empty array');
        }

        if (this.systemPrompt && !messages.some(m => m.role === 'system')) {
            messages.unshift({ role: 'system', content: this.systemPrompt });
        }

        const url = this.useGroq ? `${GROQ_BASE_URL}/chat/completions` : `${OLLAMA_BASE_URL}/chat`;

        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.useGroq) {
            if (!this.apiKey) {
                throw new Error('GROQ API key is required');
            }
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

        for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(body),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(`API error (${response.status}): ${errorData.error || response.statusText}`);
                }

                if (this.stream) {
                    return this.handleStreamResponse(response);
                } else {
                    const data = await response.json();
                    return this.useGroq ? data.choices[0].message : data.message;
                }
            } catch (error) {
                if (attempt === this.retryAttempts - 1) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            }
        }
    }

    async *handleStreamResponse(response) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = JSON.parse(line.slice(6));
                    if (this.useGroq) {
                        yield data.choices[0].delta.content;
                    } else {
                        yield data.message.content;
                    }
                }
            }
        }
    }

    async createNewChat(name) {
        return {
            id: crypto.randomUUID(),
            name: name || `Chat ${new Date().toLocaleString()}`,
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
    }

    async deleteChat(chatId) {
        // Implement actual deletion logic if needed
        console.log(`Deleting chat with ID: ${chatId}`);
        return { success: true, message: 'Chat deleted successfully' };
    }

    async clearChat(chatId) {
        // Implement actual clear logic if needed
        console.log(`Clearing chat with ID: ${chatId}`);
        return { success: true, message: 'Chat cleared successfully' };
    }

    async exportChats(chats) {
        const dataStr = JSON.stringify(chats, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        return URL.createObjectURL(blob);
    }

    async importChats(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const chats = JSON.parse(event.target.result);
                    resolve(chats);
                } catch (error) {
                    reject(new Error('Invalid JSON file'));
                }
            };
            reader.onerror = () => reject(new Error('Error reading file'));
            reader.readAsText(file);
        });
    }
}

export const chatApi = new ChatAPI();
