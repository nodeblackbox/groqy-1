import { useState, useEffect, useCallback } from 'react'

export function useSpeechRecognition() {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window))
        {
            console.error('Speech recognition not supported')
            return
        }

        const recognition = new window.webkitSpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false

        recognition.onresult = (event) => {
            const finalTranscript = event.results[0][0].transcript
            setTranscript(finalTranscript)
        }

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error)
            setIsListening(false)
        }

        recognition.onend = () => {
            setIsListening(false)
        }

        if (isListening)
        {
            recognition.start()
        }

        return () => {
            recognition.stop()
        }
    }, [isListening])

    const startListening = useCallback(() => {
        setIsListening(true)
        setTranscript('')
    }, [])

    const stopListening = useCallback(() => {
        setIsListening(false)
    }, [])

    return { isListening, startListening, stopListening, transcript }
}