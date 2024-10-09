import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Task from '@/models/Task';
import { authenticateToken } from '@/utils/auth';

export async function GET(request) {
  try {
    const user = await authenticateToken(request);
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin only.' }, { status: 403 });
    }

    await connectToDatabase();

    const completed = await Task.countDocuments({ completed: true });
    const inProgress = await Task.countDocuments({ inProgress: true });
    const notStarted = await Task.countDocuments({ completed: false, inProgress: false });

    return NextResponse.json({
      completed,
      inProgress,
      notStarted
    });
  } catch (error) {
    console.error('Error fetching task status:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}