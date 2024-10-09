import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Submission from '@/models/Submission';
import { authenticateToken } from '@/utils/auth';

export async function GET(request) {
  try {
    const user = await authenticateToken(request);
    await connectToDatabase();

    const userSubmissions = await Submission.find({ user_id: user._id }).populate('task_id', 'title');

    return NextResponse.json(userSubmissions);
  } catch (error) {
    console.error('Error fetching submission history:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await authenticateToken(request);
    await connectToDatabase();

    const { task_id, code, uploaded_file_url, submission_type } = await request.json();

    const newSubmission = new Submission({
      user_id: user._id,
      task_id,
      code,
      uploaded_file_url,
      submission_type,
      status: 'pending'
    });

    await newSubmission.save();

    return NextResponse.json(newSubmission, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}