// path to the file: /app/api/text-to-speech/route.js

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    try
    {
        const { text, model } = await request.json();

        if (!text || !model)
        {
            return NextResponse.json({ error: 'Text and model are required.' }, { status: 400 });
        }

        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${model}/stream`,
            {
                text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.8,
                    style: 0.0,
                    use_speaker_boost: true,
                },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
                },
                responseType: 'arraybuffer',
            }
        );

        if (response.status !== 200)
        {
            return NextResponse.json({ error: 'Failed to synthesize speech' }, { status: response.status });
        }

        return new NextResponse(response.data, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'inline; filename="synthesized-voice.mp3"',
            },
        });
    } catch (error)
    {
        console.error('Error synthesizing voice:', error.response?.data || error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}