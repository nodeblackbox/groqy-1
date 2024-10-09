import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Task from '@/models/Task';
import Submission from '@/models/Submission';
import { authenticateToken } from '@/utils/auth';

export async function GET(request, { params }) {
  try {
    await authenticateToken(request);
    await connectToDatabase();

    const { id } = params;
    const user = await User.findById(id).select('-password_hash');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const authUser = await authenticateToken(request);
    if (authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin only.' }, { status: 403 });
    }

    await connectToDatabase();

    const { id } = params;
    const { username, email, role, bio, skills } = await request.json();

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          username,
          email,
          role,
          bio,
          skills,
          updated_at: new Date()
        }
      },
      { new: true, runValidators: true }
    ).select('-password_hash');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const authUser = await authenticateToken(request);
    if (authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin only.' }, { status: 403 });
    }

    await connectToDatabase();

    const { id } = params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await Task.deleteMany({ user_id: user._id });
    await Submission.deleteMany({ user_id: user._id });

    return NextResponse.json({ message: 'User and associated tasks/submissions deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}