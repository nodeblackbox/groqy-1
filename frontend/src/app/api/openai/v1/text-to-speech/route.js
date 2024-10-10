// /src/app/api/openai/v1/text-to-speech/route.js

import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
    try
    {
        const { text, voice_id } = await request.json();

        if (!text || !voice_id)
        {
            console.error('Text or voice_id not provided');
            return NextResponse.json({ error: 'Text and voice_id are required.' }, { status: 400 });
        }

        console.log(`Received text: "${text}" with voice_id: "${voice_id}"`);

        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}/stream`, // Correct endpoint
            {
                text,
                // 'model_id' might not be required; verify with ElevenLabs API docs
                // Remove or adjust based on API requirements
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                },
            },
            {
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
                },
                responseType: 'arraybuffer', // Ensure binary data is handled correctly
            }
        );

        if (response.status !== 200)
        {
            console.error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
            return NextResponse.json({ error: 'Failed to synthesize speech' }, { status: response.status });
        }

        console.log('Successfully synthesized speech');

        return new NextResponse(response.data, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'attachment; filename="synthesized_speech.mp3"',
            },
        });
    } catch (error)
    {
        console.error('Error synthesizing voice:', error.response?.data || error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
