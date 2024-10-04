// http://0.0.0.0:8888

import { NextResponse } from 'next/server';

const API_BASE_URL = 'http://qdrant:6333/gravrag';

async function makeRequest(endpoint, method, body) {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();
    return { status: response.status, data };
}

async function testCreateMemory() {
    const payload = {
        content: "This is a test memory for GravRAG",
        metadata: {
            source: "API Test",
            importance: "high",
            tags: ["test", "gravrag", "memory"],
        }
    };

    try {
        const result = await makeRequest('/memory/create', 'POST', payload);
        return { endpoint: 'Create Memory', status: result.status, data: result.data, payload };
    } catch (error) {
        return { endpoint: 'Create Memory', error: error.message, payload };
    }
}

async function testRecallMemory() {
    const query = "test memory";
    const top_k = 3;

    try {
        const result = await makeRequest(`/memory/recall?query=${encodeURIComponent(query)}&top_k=${top_k}`, 'GET');
        return { endpoint: 'Recall Memory', status: result.status, data: result.data, query, top_k };
    } catch (error) {
        return { endpoint: 'Recall Memory', error: error.message, query, top_k };
    }
}

async function testPruneMemories() {
    try {
        const result = await makeRequest('/memory/prune', 'POST');
        return { endpoint: 'Prune Memories', status: result.status, data: result.data };
    } catch (error) {
        return { endpoint: 'Prune Memories', error: error.message };
    }
}

async function runTests() {
    const results = [];

    // Test Create Memory
    results.push(await testCreateMemory());

    // Test Recall Memory
    results.push(await testRecallMemory());

    // Test Prune Memories
    results.push(await testPruneMemories());

    return results;
}

export async function GET(request) {
    try {
        const results = await runTests();
        return NextResponse.json({ success: true, results });
    } catch (error) {
        console.error('Error in GravRAG API test:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { testType } = body;

        let result;
        switch (testType) {
            case 'createMemory':
                result = await testCreateMemory();
                break;
            case 'recallMemory':
                result = await testRecallMemory();
                break;
            case 'pruneMemories':
                result = await testPruneMemories();
                break;
            default:
                return NextResponse.json({ error: 'Invalid test type' }, { status: 400 });
        }

        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error('Error in GravRAG API test:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}