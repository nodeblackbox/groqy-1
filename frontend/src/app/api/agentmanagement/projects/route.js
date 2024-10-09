import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/models/Project';
import { authenticateToken } from '@/utils/auth';

export async function GET(request) {
  try {
    const user = await authenticateToken(request);
    await connectToDatabase();

    const projects = await Project.find().populate('created_by', 'username email');

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await authenticateToken(request);
    await connectToDatabase();

    const { title, description, status = 'planning' } = await request.json();

    const newProject = new Project({
      title,
      description,
      created_by: user._id,
      status,
    });

    await newProject.save();

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}