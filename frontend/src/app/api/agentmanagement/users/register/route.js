import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Task from '@/models/Task';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

export async function POST(request) {
  try {
    await connectToDatabase();

    const { username, email, password, role = 'user', bio = '', skills = [] } = await request.json();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      role,
      bio,
      skills,
    });

    await newUser.save();

    const welcomeTask = new Task({
      title: "Complete Your Profile",
      description: "Welcome to GROQY! Your first task is to complete your profile. Fill in your profile, add your skills, and tell us about yourself.",
      prompt: "Fill in your profile, add your skills, and tell us about yourself.",
      user_id: newUser._id,
      prompt_type: "text",
    });

    await welcomeTask.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    const userResponse = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      bio: newUser.bio,
      skills: newUser.skills
    };

    return NextResponse.json({
      token,
      user: userResponse,
      task: welcomeTask
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}