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

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const taskCompletionTrend = await Promise.all(Array(7).fill(0).map(async (_, index) => {
      const date = new Date(now.getTime() - index * 24 * 60 * 60 * 1000);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      const completedTasksCount = await Task.countDocuments({
        completed: true,
        updated_at: { $gte: startOfDay, $lte: endOfDay }
      });

      return {
        date: startOfDay.toISOString().split('T')[0],
        completedTasks: completedTasksCount
      };
    }));

    return NextResponse.json(taskCompletionTrend.reverse());
  } catch (error) {
    console.error('Error fetching task completion trends:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}