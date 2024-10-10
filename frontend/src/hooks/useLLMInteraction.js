import { useCallback } from 'react'

export function useLLMInteraction() {
    const sendLLMRequest = useCallback(async (conversationContext, content) => {
        const response = await fetch('/api/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    ...conversationContext,
                    { role: "user", content }
                ],
                model: "llama-3.1-8b-instant"
            }),
        })

        if (!response.ok)
        {
            throw new Error(`Failed to get response from API. Status: ${response.status}`)
        }

        const data = await response.json()

        if (!data.choices || data.choices.length === 0 || !data.choices[0].message)
        {
            throw new Error('Invalid response format from LLM API')
        }

        return data.choices[0].message.content
    }, [])

    return { sendLLMRequest }
}