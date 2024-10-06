//src/app/chatbotliveV6/useRAG.js

import { useState, useEffect, useCallback } from 'react';
import { openDB } from 'idb';

const DB_NAME = 'RAGDatabase';
const STORE_NAME = 'documents';

const useRAG = (apiKey, selectedModel, temperature, maxTokens) => {
    const [db, setDb] = useState(null);

    useEffect(() => {
        const initDB = async () => {
            const database = await openDB(DB_NAME, 1, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains(STORE_NAME))
                    {
                        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                    }
                },
            });
            setDb(database);
        };
        initDB();
    }, []);

    const processDocuments = useCallback(async (newDocuments) => {
        if (!db) return;
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        for (const doc of newDocuments)
        {
            await store.add(doc);
        }
        await tx.done;
        console.log('Documents processed and stored in IndexedDB');
    }, [db]);

    const generateResponse = useCallback(async (query) => {
        if (!db) throw new Error('Database not initialized');

        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const allDocs = await store.getAll();
        const relevantDocs = allDocs.slice(0, 2); // Simple relevance, can be improved

        const prompt = `
            Based on the following context:
            ${relevantDocs.map(doc => doc.content).join('\n\n')}
            
            Please answer the following question: ${query}
        `;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                messages: [{ role: "user", content: prompt }],
                model: selectedModel,
                temperature,
                max_tokens: maxTokens,
            })
        });

        if (!response.ok)
        {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }, [db, apiKey, selectedModel, temperature, maxTokens]);

    const getVectorStoreInfo = useCallback(async () => {
        if (!db) return null;
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const count = await store.count();
        return { documentCount: count };
    }, [db]);

    return {
        processDocuments,
        generateResponse,
        getVectorStoreInfo,
    };
};

export default useRAG;