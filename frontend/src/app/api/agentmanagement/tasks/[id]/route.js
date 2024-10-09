import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Task from '@/models/Task';
import Submission from '@/models/Submission';
import { authenticateToken } from '@/utils/auth';

export async function GET(request, { params }) {
  try {
    const user = await authenticateToken(request);
    await connectToDatabase();

    const { id } = params;
    const task = await Task.findById(id).populate('user_id', 'username email').populate('project_id', 'title');

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await authenticateToken(request);
    await connectToDatabase();

    const { id } = params;
    const { completed, inProgress, code } = await request.json();

    const task = await Task.findById(id);
    if (!task || (task.user_id.toString() !== user._id.toString() && user.role !== 'admin')) {
      return NextResponse.json({ error: 'Not allowed to update this task' }, { status: 403 });
    }

    task.completed = completed ?? task.completed;
    task.inProgress = inProgress ?? task.inProgress;
    task.updated_at = new Date();

    if (code) {
      task.code = code;
      const newSubmission = new Submission({
        user_id: user._id,
        task_id: task._id,
        code: code,
        submission_type: 'code',
        status: 'pending'
      });
      await newSubmission.save();
    }

    await task.save();

    return NextResponse.json({ task, message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await authenticateToken(request);
    await connectToDatabase();

    const { id } = params;
    const task = await Task.findOneAndDelete({ _id: id, user_id: user._id });

    if (!task) {
      return NextResponse.json({ error: 'Task not found or not authorized to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}