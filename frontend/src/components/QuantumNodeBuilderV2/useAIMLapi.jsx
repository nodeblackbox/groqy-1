// src/api/useAIMLApi.js
"use client";

import { useState } from 'react';

const AIML_API_BASE_URL = "https://api.aimlapi.com";

const useAIMLApi = (aimlApiKey) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");

    const sendAIMLRequest = async (userMessage) => {
        setLoading(true);
        setError(null);
        setResponseMessage("");

        try {
            const response = await fetch(`${AIML_API_BASE_URL}/chat/completions`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${aimlApiKey}`,
                },
                body: JSON.stringify({
                    model: "o1-mini",
                    messages: [
                        {
                            role: "user",
                            content: userMessage,
                        },
                    ],
                    max_tokens: 1000,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch from AIML API.");
            }

            const data = await response.json();
            const message = data.choices[0].message.content;
            setResponseMessage(message);
            return message;
        } catch (err) {
            setError(err.message);
            console.error("AIML API Error:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { sendAIMLRequest, loading, error, responseMessage };
};

export default useAIMLApi;