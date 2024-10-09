import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Task from '@/models/Task';
import User from '@/models/User';
import { authenticateToken } from '@/utils/auth';

export async function POST(request) {
  try {
    const user = await authenticateToken(request);
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin only.' }, { status: 403 });
    }

    await connectToDatabase();

    const {
      user_id,
      prompt,
      difficulty,
      prompt_type,
      due_date,
      project_id,
      required_skills,
      title,
      description,
      task_url,
      file_upload_required,
      downloadable_file_url
    } = await request.json();

    const assignedUser = await User.findById(user_id);
    if (!assignedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newTask = new Task({
      prompt: prompt || '',
      user_id,
      difficulty: difficulty || '',
      due_date: due_date ? new Date(due_date) : null,
      project_id: project_id || null,
      required_skills: required_skills || [],
      title: title || 'Default Task Title',
      description: description || 'Default Task Description',
      task_url: task_url || '',
      file_upload_required: file_upload_required || false,
      downloadable_file_url: downloadable_file_url || null,
      prompt_type: prompt_type || 'text'
    });

    await newTask.save();

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error assigning task:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}