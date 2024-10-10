// components/VoiceForm.js

import { useState, useEffect } from 'react';

export default function VoiceForm() {
    const [text, setText] = useState('');
    const [voiceId, setVoiceId] = useState('');
    const [voices, setVoices] = useState([]);
    const [audioSrc, setAudioSrc] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch available voices on component mount
    useEffect(() => {
        const fetchVoices = async () => {
            try
            {
                const response = await fetch('/api/openai/v1/voices');
                if (response.ok)
                {
                    const data = await response.json();
                    setVoices(data.voices);
                    if (data.voices.length > 0)
                    {
                        setVoiceId(data.voices[0].voice_id);
                    }
                } else
                {
                    setError('Failed to fetch voices.');
                }
            } catch (err)
            {
                console.error('Error fetching voices:', err);
                setError('An error occurred while fetching voices.');
            }
        };

        fetchVoices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setAudioSrc(null);
        setError('');

        try
        {
            const response = await fetch('/api/openai/v1/voice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, model: voiceId }),
            });

            if (response.ok)
            {
                const blob = await response.blob();
                const audioUrl = URL.createObjectURL(blob);
                setAudioSrc(audioUrl);
            } else
            {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to synthesize voice.');
            }
        } catch (err)
        {
            console.error('Error synthesizing voice:', err);
            setError('An error occurred during synthesis.');
        } finally
        {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Text-to-Speech</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="voice" className="block text-sm font-medium text-white mb-2">
                        Select Voice
                    </label>
                    <select
                        id="voice"
                        value={voiceId}
                        onChange={(e) => setVoiceId(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                    >
                        {voices.map((voice) => (
                            <option key={voice.voice_id} value={voice.voice_id}>
                                {voice.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="text" className="block text-sm font-medium text-white mb-2">
                        Enter Text
                    </label>
                    <textarea
                        id="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows="5"
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                        placeholder="Type your text here..."
                        required
                    ></textarea>
                </div>

                <div>
                    <button
                        type="submit"
                        className={`w-full py-3 px-4 rounded-md text-white font-semibold ${isLoading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-700'
                            } transition duration-200 ease-in-out`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Synthesizing...' : 'Synthesize Voice'}
                    </button>
                </div>

                {error && <p className="text-red-200 text-center">{error}</p>}

                {audioSrc && (
                    <div className="mt-6 text-center">
                        <h3 className="text-xl font-semibold text-white mb-2">Synthesized Audio:</h3>
                        <audio controls src={audioSrc} className="w-full" />
                    </div>
                )}
            </form>
        </div>
    );
}
