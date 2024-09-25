// app/api/analyze-project/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { prompt, selectedItems, knowledgeBase, promptType, model } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const GROQ_API_KEY = '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';

        if (!GROQ_API_KEY) {
            console.error('GROQ_API_KEY is not set');
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

        console.log('Preparing to send request to Groq API');

        const systemPrompt = `You are a helpful assistant that analyzes project structures and provides improvement suggestions. 
Focus on the following items: ${selectedItems.join(', ')}. 
Consider this project-specific knowledge: ${knowledgeBase}
The user is requesting a ${promptType} analysis.`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: prompt }
                ],
                model: model || 'llama-3.1-70b-versatile', // Use the provided model or default
                temperature: 0.7,
                max_tokens: 8000,
            }),
        });

        if (!response.ok) {
            console.error('Groq API response not OK:', response.status, response.statusText);
            const errorBody = await response.text();
            console.error('Error body:', errorBody);
            throw new Error('Failed to fetch from Groq API');
        }

        const data = await response.json();
        const markdown = data.choices[0].message.content;

        return NextResponse.json({ markdown });
    } catch (error) {
        console.error('Error in analyze-project API route:', error);
        return NextResponse.json({ error: 'Failed to analyze project', details: error.message }, { status: 500 });
    }
}
