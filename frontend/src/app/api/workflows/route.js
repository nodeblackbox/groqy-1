// src/app/api/workflows/route.js

import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

let workflows = []; // In-memory storage for workflows

export async function POST(req) {
    try {
        const { name, tools } = await req.json();

        if (!name || !Array.isArray(tools) || tools.length === 0) {
            return NextResponse.json({ error: 'Invalid workflow data' }, { status: 400 });
        }

        const newWorkflow = {
            id: uuidv4(),
            name,
            tools,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        workflows.push(newWorkflow);

        return NextResponse.json({ success: true, workflow: newWorkflow });
    } catch (error) {
        console.error('Error saving workflow:', error);
        return NextResponse.json({ error: 'Failed to save workflow' }, { status: 500 });
    }
}

export async function GET() {
    try {
        return NextResponse.json(workflows);
    } catch (error) {
        console.error('Error fetching workflows:', error);
        return NextResponse.json({ error: 'Failed to fetch workflows' }, { status: 500 });
    }
}
