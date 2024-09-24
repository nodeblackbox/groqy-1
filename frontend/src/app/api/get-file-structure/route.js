// app/api/get-file-structure/route.js
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    try {
        const projectRoot = process.cwd();
        const structure = await getDirectoryStructure(projectRoot);
        return NextResponse.json({ structure });
    } catch (error) {
        console.error('Error getting file structure:', error);
        return NextResponse.json({ error: 'Failed to get file structure' }, { status: 500 });
    }
}

async function getDirectoryStructure(dir) {
    const files = await fs.readdir(dir);
    const structure = {};

    for (const file of files) {
        if (file.startsWith('.') || file === 'node_modules') continue;

        const filePath = path.join(dir, file);
        const stats = await fs.stat(filePath);

        if (stats.isDirectory()) {
            structure[file] = await getDirectoryStructure(filePath);
        } else {
            structure[file] = file;
        }
    }

    return structure;
}