"use client";


import React, { useState } from 'react';
import axios from 'axios';

const FileInsightToMemory = () => {
    const [filePath, setFilePath] = useState('');
    const [insights, setInsights] = useState(null);
    const [error, setError] = useState(null);

    const handleAnalyzeFile = async () => {
        try {
            const insightResponse = await axios.post('http://localhost:3000/api/comprehensive-file-insights', {
                filePath: filePath
            });

            const insightsData = insightResponse.data;
            setInsights(insightsData);

            // Prepare the payload for GravRAG API
            const memoryPayload = {
                content: JSON.stringify(insightsData), // You can structure this further if needed
                metadata: {
                    objective_id: "file_analysis_objective",
                    task_id: "store_file_insights_task"
                }
            };

            // Send the structured insights to the GravRAG API
            const memoryResponse = await axios.post('http://localhost:8000/gravrag/create_memory', memoryPayload);

            if (memoryResponse.status === 200) {
                console.log('Memory stored successfully:', memoryResponse.data);
            } else {
                console.error('Failed to store memory:', memoryResponse.data);
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
            console.error('Error analyzing or storing file insights:', err);
        }
    };

    return (
        <div>
            <h1>File Insight to Memory</h1>
            <input
                type="text"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                placeholder="Enter file path (e.g., src/app/APIMAKERV2/page.jsx)"
            />
            <button onClick={handleAnalyzeFile}>Analyze File and Store Insights</button>

            {insights && (
                <div>
                    <h3>Insights Generated</h3>
                    <pre>{JSON.stringify(insights, null, 2)}</pre>
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default FileInsightToMemory;
