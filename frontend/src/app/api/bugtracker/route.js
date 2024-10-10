import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const dataFilePath = path.join(dataDir, 'bugs.json');

async function ensureFileExists() {
    try
    {
        await fs.access(dataFilePath);
    } catch (error)
    {
        if (error.code === 'ENOENT')
        {
            // Create the data directory if it doesn't exist
            await fs.mkdir(dataDir, { recursive: true });
            // Create an empty JSON file with an empty array
            await fs.writeFile(dataFilePath, '[]');
        } else
        {
            throw error;
        }
    }
}

export async function GET() {
    try
    {
        await ensureFileExists();
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        const bugs = JSON.parse(fileContents);
        return NextResponse.json(bugs);
    } catch (error)
    {
        console.error('Error reading bugs:', error);
        return NextResponse.json({ error: 'Failed to read bugs' }, { status: 500 });
    }
}

export async function POST(request) {
    try
    {
        await ensureFileExists();
        const bug = await request.json();
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        const bugs = JSON.parse(fileContents);
        bug.id = bugs.length > 0 ? Math.max(...bugs.map(b => b.id)) + 1 : 1;
        bugs.push(bug);
        await fs.writeFile(dataFilePath, JSON.stringify(bugs, null, 2));
        return NextResponse.json(bug);
    } catch (error)
    {
        console.error('Error saving bug:', error);
        return NextResponse.json({ error: 'Failed to save bug' }, { status: 500 });
    }
}

export async function PUT(request) {
    try
    {
        await ensureFileExists();
        const updatedBug = await request.json();
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        let bugs = JSON.parse(fileContents);
        const index = bugs.findIndex(bug => bug.id === updatedBug.id);
        if (index !== -1)
        {
            bugs[index] = updatedBug;
            await fs.writeFile(dataFilePath, JSON.stringify(bugs, null, 2));
            return NextResponse.json(updatedBug);
        }
        return NextResponse.json({ error: 'Bug not found' }, { status: 404 });
    } catch (error)
    {
        console.error('Error updating bug:', error);
        return NextResponse.json({ error: 'Failed to update bug' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try
    {
        await ensureFileExists();
        const { id } = await request.json();
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        let bugs = JSON.parse(fileContents);
        bugs = bugs.filter(bug => bug.id !== id);
        await fs.writeFile(dataFilePath, JSON.stringify(bugs, null, 2));
        return NextResponse.json({ success: true });
    } catch (error)
    {
        console.error('Error deleting bug:', error);
        return NextResponse.json({ error: 'Failed to delete bug' }, { status: 500 });
    }
}