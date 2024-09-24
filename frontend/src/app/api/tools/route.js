// src/app/api/tools/route.js

import { NextResponse } from 'next/server';

const MOCK_TOOLS = [
    { id: 'tool1', name: 'Tool One' },
    { id: 'tool2', name: 'Tool Two' },
    { id: 'tool3', name: 'Tool Three' },
    // Add more tools as needed
];

export async function GET() {
    try {
        return NextResponse.json(MOCK_TOOLS);
    } catch (error) {
        console.error('Error fetching tools:', error);
        return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 });
    }
}
