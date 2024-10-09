import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Task from '@/models/Task';
import { authenticateToken } from '@/utils/auth';

export async function GET(request) {
  try {
    const user = await authenticateToken(request);
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin only.' }, { status: 403 });
    }

    await connectToDatabase();

    const users = await User.find();
    const usersWithTaskSummary = await Promise.all(users.map(async (user) => {
      const userTasks = await Task.find({ user_id: user._id });
      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        totalTasks: userTasks.length,
        completedTasks: userTasks.filter(task => task.completed).length,
        inProgressTasks: userTasks.filter(task => task.inProgress).length
      };
    }));

    return NextResponse.json(usersWithTaskSummary);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}