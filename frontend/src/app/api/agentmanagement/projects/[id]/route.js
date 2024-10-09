import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Project from '@/models/Project';
import { authenticateToken } from '@/utils/auth';

export async function GET(request, { params }) {
  try {
    const user = await authenticateToken(request);
    await connectToDatabase();

    const { id } = params;
    const project = await Project.findById(id).populate('created_by', 'username email');

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const user = await authenticateToken(request);
    await connectToDatabase();

    const { id } = params;
    const { title, description, status } = await request.json();

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.created_by.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized to update this project' }, { status: 403 });
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.status = status || project.status;
    project.updated_at = new Date();

    await project.save();

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = await authenticateToken(request);
    await connectToDatabase();

    const { id } = params;
    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.created_by.toString() !== user._id.toString() && user.role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized to delete this project' }, { status: 403 });
    }

    await Project.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}