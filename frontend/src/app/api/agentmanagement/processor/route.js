import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import sanitizeHtml from 'sanitize-html';
import { authenticateToken } from '@/utils/auth';

export async function POST(request) {
  try {
    const user = await authenticateToken(request);

    const { prompt, response, timestamp } = await request.json();

    const sanitizedData = {
      prompt: sanitizeHtml(prompt),
      response: sanitizeHtml(response),
      timestamp: sanitizeHtml(timestamp)
    };

    const dataFilePath = path.join(process.cwd(), 'data.json');
    let existingData = [];

    try {
      const fileContent = await readFile(dataFilePath, 'utf8');
      existingData = JSON.parse(fileContent);
    } catch (error) {
      console.log('No existing data found, starting fresh');
    }

    existingData.push(sanitizedData);

    await writeFile(dataFilePath, JSON.stringify(existingData, null, 2));

    return NextResponse.json({ message: 'Data processed and saved successfully' });
  } catch (error) {
    console.error('Error processing data:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}