import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Task from '@/models/Task';
import { authenticateToken } from '@/utils/auth';

export async function PUT(request, { params }) {
  try {
    const user = await authenticateToken(request);
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin only.' }, { status: 403 });
    }

    await connectToDatabase();

    const { id } = params;
    const { prompt, user_id, completed, inProgress, difficulty, due_date, project_id } = await request.json();

    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    task.prompt = prompt || task.prompt;
    task.user_id = user_id || task.user_id;
    task.completed = completed !== undefined ? completed : task.completed;
    task.inProgress = inProgress !== undefined ? inProgress : task.inProgress;
    task.difficulty = difficulty || task.difficulty;
    task.due_date = due_date || task.due_date;
    task.project_id = project_id || task.project_id;
    task.updated_at = new Date();

    await task.save();

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await authenticateToken(request);
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin only.' }, { status: 403 });
    }

    await connectToDatabase();

    const { id } = params;
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}