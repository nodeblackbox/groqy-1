'use client'

import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// WARNING: Embedding API keys in frontend code is a severe security risk.
// This is for demonstration purposes only and should never be done in a production environment.
const GROQ_API_KEY = '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';

export default function ScreenshotAnalyzer() {
    const [analysis, setAnalysis] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        // Ensure the container takes up the full viewport
        if (containerRef.current)
        {
            containerRef.current.style.minHeight = '100vh';
        }
    }, []);

    const captureAndAnalyze = async () => {
        if (!containerRef.current) return;

        setIsLoading(true);
        try
        {
            // Capture screenshot of the entire page
            const dataUrl = await toPng(document.documentElement, {
                quality: 0.95,
                width: document.documentElement.scrollWidth,
                height: document.documentElement.scrollHeight,
            });
            setCapturedImage(dataUrl);

            // Convert dataUrl to base64
            const base64Image = dataUrl.split(',')[1];

            // Prepare and send request to Groq API
            const response = await axios.post(
                'https://api.groq.com/openai/v1/chat/completions',
                {
                    messages: [
                        {
                            role: 'user',
                            content: [
                                { type: 'text', text: "Analyze this screenshot and describe in detail what you see, including all UI elements, text content, and visual layout." },
                                { type: 'image_url', image_url: { url: `data:image/png;base64,${base64Image}` } }
                            ]
                        }
                    ],
                    model: 'llava-v1.5-7b-4096-preview',
                    temperature: 0,
                    max_tokens: 1024,
                    top_p: 1,
                    stream: false,
                    stop: null
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${GROQ_API_KEY}`
                    }
                }
            );

            setAnalysis(response.data.choices[0].message.content);
        } catch (error)
        {
            console.error('Error capturing or analyzing screenshot:', error);
            setAnalysis('Error analyzing the image. Please try again.');
        } finally
        {
            setIsLoading(false);
        }
    };

    return (
        <div ref={containerRef} className="p-4 min-h-screen">
            <Card className="mb-4">
                <CardHeader>
                    <CardTitle>Screenshot Analyzer</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button onClick={captureAndAnalyze} disabled={isLoading}>
                        {isLoading ? 'Analyzing...' : 'Capture and Analyze Full Screen'}
                    </Button>
                </CardContent>
            </Card>

            <div className="mb-4 p-4 border border-gray-300 rounded">
                <h1 className="text-2xl font-bold mb-2">Welcome to My Website</h1>
                <p className="mb-2">This is an example page that will be captured and analyzed.</p>
                <div className="flex space-x-2">
                    <div className="w-16 h-16 bg-red-500 rounded-full"></div>
                    <div className="w-16 h-16 bg-blue-500 rounded-full"></div>
                    <div className="w-16 h-16 bg-green-500 rounded-full"></div>
                </div>
            </div>

            {capturedImage && (
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle>Captured Screenshot</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <img src={capturedImage} alt="Captured screenshot" className="max-w-full h-auto" />
                    </CardContent>
                </Card>
            )}

            {analysis && (
                <Card>
                    <CardHeader>
                        <CardTitle>Analysis Result</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{analysis}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}