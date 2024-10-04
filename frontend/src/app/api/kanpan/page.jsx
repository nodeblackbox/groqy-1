import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const dataFilePath = path.join(dataDir, 'kanban.json');

async function ensureFileExists() {
    try
    {
        await fs.access(dataFilePath);
    } catch (error)
    {
        if (error.code === 'ENOENT')
        {
            await fs.mkdir(dataDir, { recursive: true });
            await fs.writeFile(dataFilePath, JSON.stringify({
                projectName: "Campaign 2026: Cyber Outreach",
                columns: [
                    {
                        id: "icebox",
                        title: "Icebox",
                        tasks: []
                    },
                    {
                        id: "todo",
                        title: "To Do",
                        tasks: []
                    },
                    {
                        id: "inProgress",
                        title: "In Progress",
                        tasks: []
                    },
                    {
                        id: "review",
                        title: "Review",
                        tasks: []
                    },
                    {
                        id: "done",
                        title: "Done",
                        tasks: []
                    }
                ]
            }, null, 2));
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
        const boardData = JSON.parse(fileContents);
        return NextResponse.json(boardData);
    } catch (error)
    {
        console.error('Error reading kanban data:', error);
        return NextResponse.json({ error: 'Failed to read kanban data' }, { status: 500 });
    }
}

export async function POST(request) {
    try
    {
        await ensureFileExists();
        const boardData = await request.json();
        await fs.writeFile(dataFilePath, JSON.stringify(boardData, null, 2));
        return NextResponse.json({ success: true });
    } catch (error)
    {
        console.error('Error saving kanban data:', error);
        return NextResponse.json({ error: 'Failed to save kanban data' }, { status: 500 });
    }
}

export async function PUT(request) {
    try
    {
        await ensureFileExists();
        const updatedData = await request.json();
        await fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2));
        return NextResponse.json({ success: true });
    } catch (error)
    {
        console.error('Error updating kanban data:', error);
        return NextResponse.json({ error: 'Failed to update kanban data' }, { status: 500 });
    }
}

export async function DELETE(request) {
    try
    {
        await ensureFileExists();
        await fs.writeFile(dataFilePath, JSON.stringify({
            projectName: "Campaign 2026: Cyber Outreach",
            columns: [
                { id: "icebox", title: "Icebox", tasks: [] },
                { id: "todo", title: "To Do", tasks: [] },
                { id: "inProgress", title: "In Progress", tasks: [] },
                { id: "review", title: "Review", tasks: [] },
                { id: "done", title: "Done", tasks: [] }
            ]
        }, null, 2));
        return NextResponse.json({ success: true });
    } catch (error)
    {
        console.error('Error resetting kanban data:', error);
        return NextResponse.json({ error: 'Failed to reset kanban data' }, { status: 500 });
    }
}
