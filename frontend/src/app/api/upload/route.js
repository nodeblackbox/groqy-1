// src/app/api/upload/route.js

import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';

// Disable Next.js's default body parser for file uploads
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req) {
    const form = new formidable.IncomingForm();

    form.uploadDir = './public/uploads'; // Ensure this directory exists
    form.keepExtensions = true;

    try {
        const data = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });

        // Process uploaded files as needed
        // For example, you could move them to a permanent location, store metadata in a database, etc.

        return NextResponse.json({ success: true, message: 'Files uploaded successfully' });
    } catch (error) {
        console.error('Error in upload API route:', error);
        return NextResponse.json({ error: 'File upload failed', details: error.message }, { status: 500 });
    }
}
