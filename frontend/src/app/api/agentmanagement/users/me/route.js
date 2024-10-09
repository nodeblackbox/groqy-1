import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { authenticateToken } from '@/utils/auth';

export async function GET(request) {
  try {
    const user = await authenticateToken(request);
    await connectToDatabase();

    const userProfile = await User.findById(user._id).select('-password_hash');

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = await authenticateToken(request);
    await connectToDatabase();

    const { username, email, bio, skills } = await request.json();

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          username,
          email,
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
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}