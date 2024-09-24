// src/app/api/chat-ollama/route.js

import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { messages, model, system_prompt, temperature, max_tokens, top_p, top_k, stream } = await req.json();

        const response = await fetch('http://localhost:11434/api/chat', { // Adjust the URL if different
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                messages,
                system_prompt,
                temperature,
                max_tokens,
                top_p,
                top_k,
                stream,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Ollama API error:', errorData);
            return NextResponse.json({ error: 'Error from Ollama API', details: errorData }, { status: response.status });
        }

        if (stream) {
            // Handle streaming response if necessary
            // For simplicity, we'll not handle streaming here
            return NextResponse.json({ error: 'Streaming not implemented in Ollama API route' }, { status: 501 });
        } else {
            const data = await response.json();
            return NextResponse.json(data);
        }
    } catch (error) {
        console.error('Error in chat-ollama API route:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
