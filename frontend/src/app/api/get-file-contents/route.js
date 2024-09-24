// app/api/get-file-contents/route.js
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(req) {
    try {
        const { files } = await req.json();
        const projectRoot = process.cwd();
        const fileContents = {};
        const errors = [];

        for (const file of files) {
            try {
                const filePath = path.join(projectRoot, file);
                const content = await fs.readFile(filePath, 'utf8');
                fileContents[file] = content;
            } catch (error) {
                console.error(`Error reading file ${file}:`, error);
                errors.push({ file, error: error.message });
                fileContents[file] = `Error reading file: ${error.message}`;
            }
        }

        return NextResponse.json({ fileContents, errors });
    } catch (error) {
        console.error('Error in get-file-contents route:', error);
        return NextResponse.json({ error: 'Failed to get file contents', details: error.message }, { status: 500 });
    }
}