// pages/api/openai/v1/voices.js
import { NextResponse } from 'next/server';

import axios from 'axios';

export async function GET() {
    try
    {
        const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
            headers: {
                'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
                'Accept': 'application/json',
            },
        });

        if (response.status !== 200)
        {
            return NextResponse.json({ error: 'Failed to fetch voices.' }, { status: response.status });
        }

        const voices = response.data.voices.map((voice) => ({
            name: voice.name,
            voice_id: voice.voice_id,
            preview_url: voice.preview_url,
        }));

        return NextResponse.json({ voices });
    } catch (error)
    {
        console.error('Error fetching voices:', error.response?.data || error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}