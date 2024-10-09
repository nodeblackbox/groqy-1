import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Task from '@/models/Task';
import Submission from '@/models/Submission';
import { authenticateToken } from '@/utils/auth';
import { writeFile } from 'fs/promises';
import path from 'path';
import formidable from 'formidable';

// Disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {
  try {
    const user = await authenticateToken(request);
    await connectToDatabase();

    const form = new formidable.IncomingForm();
    const data = await new Promise((resolve, reject) => {
      form.parse(request, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const { taskId, code, description } = data.fields;
    const file = data.files.file;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await readFileAsync(file.filepath);
    const filename = `${Date.now()}-${file.originalFilename.replace(/\\s+/g, '-')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');

    // Ensure upload directory exists
    await ensureDir(uploadDir);

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const fileUrl = `/uploads/${filename}`;
    const fileType = file.mimetype;

    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: 'Associated task not found' }, { status: 404 });
    }

    task.downloadable_file_url = fileUrl;
    task.file_type = fileType;
    task.updated_at = new Date();

    if (task.prompt_type === 'code') {
      task.code = code;
    } else if (task.prompt_type === 'file') {
      task.file_description = description;
    }

    await task.save();

    const newSubmission = new Submission({
      user_id: user._id,
      task_id: taskId,
      uploaded_file_url: fileUrl,
      file_type: fileType,
      submission_type: task.prompt_type,
      status: 'pending'
    });
    await newSubmission.save();

    return NextResponse.json({
      message: 'File uploaded successfully',
      file: {
        url: fileUrl,
        type: fileType
      },
      submission: newSubmission
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}

// Utility functions for handling file uploads
import fs from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);
const ensureDir = async (dir) => {
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
};