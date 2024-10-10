// frontend/src/app/api/payloads/route.js

import connectDB from '../../../lib/mongodb';
import Payload from '../../../models/Payloads'

export async function GET(request) {
  try {
    await connectDB();
    const payloads = await Payload.find({});
    return new Response(JSON.stringify(payloads), { status: 200 });
  } catch (error) {
    console.error("GET /api/payloads error:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch payloads' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    await connectDB();

    // Check if payload with the same ID already exists
    const existingPayload = await Payload.findOne({ id: data.id });
    if (existingPayload) {
      return new Response(JSON.stringify({ error: 'Payload with this ID already exists' }), { status: 400 });
    }

    const payload = new Payload(data);
    await payload.save();
    return new Response(JSON.stringify({ data: payload }), { status: 201 });
  } catch (error) {
    console.error("POST /api/payloads error:", error);
    return new Response(JSON.stringify({ error: 'Failed to create payload' }), { status: 500 });
  }
}