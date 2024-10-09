import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { authenticateToken } from '@/utils/auth';

export async function POST(request) {
  try {
    const user = await authenticateToken(request);
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied. Admin only.' }, { status: 403 });
    }

    await connectToDatabase();

    const { email } = await request.json();
    const userToPromote = await User.findOne({ email: email.toLowerCase() });

    if (!userToPromote) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    userToPromote.role = 'admin';
    await userToPromote.save();

    return NextResponse.json({ message: 'User promoted to admin' });
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}