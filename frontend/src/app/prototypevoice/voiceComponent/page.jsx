'use client'

import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

const VoiceSection = () => {
    const [selectedVoice, setSelectedVoice] = useState('User');
    const [voices, setVoices] = useState(['User', 'AI', 'System']);
    const [isRecording, setIsRecording] = useState(false);

    useEffect(() => {
        if ('speechSynthesis' in window)
        {
            const getVoices = () => {
                const availableVoices = speechSynthesis.getVoices();
                setVoices(availableVoices.map(voice => voice.name));
            };

            speechSynthesis.onvoiceschanged = getVoices;
            getVoices();
        }
    }, []);

    const handleMicClick = () => {
        setIsRecording(!isRecording);
        // Here you would typically start/stop actual voice recording
    };

    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
            <div className="mb-6 w-full">
                <div className="flex justify-center items-end h-20 space-x-1">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-pulse"
                            style={{
                                height: `${20 + Math.random() * 60}%`,
                                animationDelay: `${i * 0.1}s`
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <DropdownMenu>
                    <DropdownMenuTrigger className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-bold py-2 px-4 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 ease-in-out transform hover:scale-105">
                        Voice Selection
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border border-purple-500">
                        {voices.map((voice, index) => (
                            <DropdownMenuItem
                                key={index}
                                onSelect={() => setSelectedVoice(voice)}
                                className="text-white hover:bg-purple-600 focus:bg-purple-600"
                            >
                                {voice}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <button
                    onClick={handleMicClick}
                    className={`bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full p-3 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 ease-in-out transform hover:scale-110 ${isRecording ? 'animate-pulse' : ''}`}
                >
                    <Mic size={24} className={isRecording ? 'animate-spin' : ''} />
                </button>
            </div>
            <div className="mt-2 text-center text-sm text-purple-300">
                Selected Voice: {selectedVoice}
            </div>
        </div>
    );
};

export default VoiceSection;