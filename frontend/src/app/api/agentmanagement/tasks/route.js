import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Task from '@/models/Task';
import User from '@/models/User';
import { authenticateToken } from '@/utils/auth';

export async function GET(request) {
  try {
    const user = await authenticateToken(request);
    await connectToDatabase();

    let tasks;
    if (user.role === 'admin') {
      tasks = await Task.find().populate('user_id', 'username email');
    } else {
      tasks = await Task.find({ user_id: user._id }).populate('project_id', 'title');
    }

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await authenticateToken(request);
    await connectToDatabase();

    const {
      prompt,
      project_id,
      difficulty,
      due_date,
      required_skills,
      file_upload_required,
      title,
      description,
      prompt_type
    } = await request.json();

    const newTask = new Task({
      prompt,
      user_id: user._id,
      project_id: project_id || null,
      difficulty: difficulty || 'medium',
      due_date: due_date || null,
      required_skills: required_skills || [],
      title: title || '',
      description: description || '',
      file_upload_required: file_upload_required || false,
      prompt_type: prompt_type || 'text'
    });

    await newTask.save();

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}