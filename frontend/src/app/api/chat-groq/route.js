// src/app/api/chat-groq/route.js

import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { messages, model, temperature, max_tokens, top_p, stream } = await req.json();
        const authHeader = req.headers.get('Authorization') || '';
        const apiKeyMatch = authHeader.match(/^Bearer (.+)$/);
        const apiKey = apiKeyMatch ? apiKeyMatch[1] : '';

        if (!apiKey) {
            return NextResponse.json({ error: 'GROQ API key is missing' }, { status: 401 });
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages,
                temperature,
                max_tokens,
                top_p,
                stream,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('GROQ API error:', errorData);
            return NextResponse.json({ error: 'Error from GROQ API', details: errorData }, { status: response.status });
        }

        if (stream) {
            // Handle streaming response if necessary
            // For simplicity, we'll not handle streaming here
            return NextResponse.json({ error: 'Streaming not implemented in GROQ API route' }, { status: 501 });
        } else {
            const data = await response.json();
            return NextResponse.json(data);
        }
    } catch (error) {
        console.error('Error in chat-groq API route:', error);
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
