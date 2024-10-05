// utils/groqApi.js
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: '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'
});

const RATE_LIMIT_DELAY = 2000; // 2 seconds delay between requests

let lastRequestTime = 0;

export async function callGroqApi(messages) {
    const now = Date.now();
    if (now - lastRequestTime < RATE_LIMIT_DELAY)
    {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - (now - lastRequestTime)));
    }

    lastRequestTime = Date.now();

    try
    {
        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.1-70b-versatile",
            temperature: 1,
            max_tokens: 5000,
            top_p: 1,
            stream: true,
            stop: null
        });

        let fullResponse = '';
        for await (const chunk of chatCompletion)
        {
            fullResponse += chunk.choices[0]?.delta?.content || '';
        }

        return fullResponse;
    } catch (error)
    {
        console.error('Error calling Groq API:', error);
        throw error;
    }
}