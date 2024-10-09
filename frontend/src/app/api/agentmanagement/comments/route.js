import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Task from '@/models/Task';
import { authenticateToken } from '@/utils/auth';

export async function POST(request) {
  try {
    const user = await authenticateToken(request);
    await connectToDatabase();

    const { task_id, content } = await request.json();

    const task = await Task.findById(task_id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const newComment = new Comment({
      user_id: user._id,
      task_id,
      content,
    });

    await newComment.save();

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}