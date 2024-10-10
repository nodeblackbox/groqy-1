import { useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'

export function useTextToSpeech(selectedVoice, audioRef) {
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false)
    const [isPlayingAudio, setIsPlayingAudio] = useState(false)

    const playVoiceResponse = useCallback(async (text) => {
        if (!text || !selectedVoice)
        {
            console.error('Text or voice model not provided for text-to-speech')
            toast.error('Unable to play voice response. Missing text or voice model.')
            return
        }

        setIsGeneratingAudio(true)
        setIsPlayingAudio(false)

        try
        {
            toast.loading('Generating audio...', { id: 'generateAudio' })

            const response = await fetch('/api/openai/v1/text-to-speech', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, voice_id: selectedVoice }),
            })

            if (!response.ok)
            {
                const errorData = await response.json()
                throw new Error(`Failed to synthesize speech. Status: ${response.status}, Error: ${JSON.stringify(errorData)}`)
            }

            const audioBlob = await response.blob()
            if (audioBlob.size === 0)
            {
                throw new Error('Received empty audio blob')
            }

            const audioUrl = URL.createObjectURL(audioBlob)
            audioRef.current.src = audioUrl

            toast.success('Audio generated successfully', { id: 'generateAudio' })
            setIsGeneratingAudio(false)
            setIsPlayingAudio(true)

            await audioRef.current.play()
        } catch (error)
        {
            console.error('Error in playVoiceResponse:', error)
            if (error.message.includes("ffmpeg"))
            {
                toast.error('FFmpeg is not installed or configured properly. Please check the server configuration.', { id: 'generateAudio' })
            } else
            {
                toast.error(`Failed to play voice response: ${error.message}`, { id: 'generateAudio' })
            }
            setIsGeneratingAudio(false)
            setIsPlayingAudio(false)
        }
    }, [selectedVoice])

    const stopPlayback = useCallback(() => {
        if (audioRef.current)
        {
            audioRef.current.pause()
            audioRef.current.currentTime = 0
            setIsPlayingAudio(false)
            toast('Playback stopped.')
        }
    }, [])

    return { isGeneratingAudio, isPlayingAudio, playVoiceResponse, stopPlayback }
}