// src/app/api/ollama-models/route.js

import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('http://localhost:11434/api/tags');

        if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.statusText}`);
        }

        const data = await response.json();
        const models = data.models.map(model => model.name);
        return NextResponse.json({ models });
    } catch (error) {
        console.error('Error fetching models:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
