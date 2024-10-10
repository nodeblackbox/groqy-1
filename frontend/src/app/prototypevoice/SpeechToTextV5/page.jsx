// C:\Users\nasan\Downloads\GROQYHackathon\groqy-1\frontend\src\app\prototypevoice\SpeechToTextV5
"use client";


import Head from 'next/head';
import VoiceForm from '@/components/VoiceForm';

export default function PrototypeVoice() {
    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <Head>
                <title>GROQY Hackathon - Voice Synthesis</title>
                <meta name="description" content="Text-to-Speech Implementation with 11 Labs" />
            </Head>
            <VoiceForm />
        </div>
    );
}
