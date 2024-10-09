import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Comment from '@/models/Comment';
import { authenticateToken } from '@/utils/auth';

export async function GET(request, { params }) {
  try {
    const user = await authenticateToken(request);
    await connectToDatabase();

    const { taskId } = params;
    const comments = await Comment.find({ task_id: taskId }).populate('user_id', 'username');

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}