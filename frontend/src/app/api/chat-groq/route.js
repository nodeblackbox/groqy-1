// src/app/api/chat-groq/route.js

import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        console.log('Received request to chat-groq API');
        const { content, provider, model } = await req.json();
        console.log(`Request details: provider=${provider}, model=${model}`);

        const authHeader = req.headers.get('Authorization') || '';
        const apiKeyMatch = authHeader.match(/^Bearer (.+)$/);
        const apiKey = apiKeyMatch ? apiKeyMatch[1] : '';

        if (!apiKey) {
            console.error('API key is missing');
            return NextResponse.json({ error: 'API key is missing' }, { status: 401 });
        }

        console.log('Sending request to backend API');
        const response = await fetch(`http://localhost:8000/neural_resources/create_message/${provider}/${model}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ content }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Backend API error:', errorData);
            return NextResponse.json({ error: 'Error from Backend API', details: errorData }, { status: response.status });
        }

        const data = await response.json();
        console.log('Received successful response from backend API');
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error in chat-groq API route:', error);

        if (error instanceof SyntaxError) {
            console.error('JSON parsing error:', error.message);
            return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
        }

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.error('Network error:', error.message);
            return NextResponse.json({ error: 'Unable to connect to backend API' }, { status: 503 });
        }

        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
    }
}
