import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

/**
 * Authenticate the user by verifying the JWT token.
 * Returns the decoded user object if valid.
 * Throws an error if invalid or missing.
 */
export async function authenticateToken(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader)
    {
        throw new Error('No authorization header provided');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token)
    {
        throw new Error('Invalid authorization header format');
    }

    try
    {
        const decoded = jwt.verify(token, SECRET_KEY);
        // Optionally, you can fetch the user from the database to ensure they still exist
        await connectToDatabase();
        const user = await User.findById(decoded.id);
        if (!user)
        {
            throw new Error('User not found');
        }
        return user;
    } catch (error)
    {
        throw new Error('Invalid or expired token');
    }
}