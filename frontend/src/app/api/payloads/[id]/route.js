// frontend/src/app/api/payloads/[id]/route.js

import connectDB from '../../../../lib/mongodb';
import Payload from '../../../../models/Payload';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectDB();
    const payload = await Payload.findOne({ id });
    if (!payload) {
      return new Response(JSON.stringify({ error: 'Payload not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(payload), { status: 200 });
  } catch (error) {
    console.error(`GET /api/payloads/${params.id} error:`, error);
    return new Response(JSON.stringify({ error: 'Failed to fetch payload' }), { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();
    await connectDB();
    const payload = await Payload.findOneAndUpdate({ id }, updates, { new: true });
    if (!payload) {
      return new Response(JSON.stringify({ error: 'Payload not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ data: payload }), { status: 200 });
  } catch (error) {
    console.error(`PUT /api/payloads/${params.id} error:`, error);
    return new Response(JSON.stringify({ error: 'Failed to update payload' }), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectDB();
    const payload = await Payload.findOneAndDelete({ id });
    if (!payload) {
      return new Response(JSON.stringify({ error: 'Payload not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: 'Payload deleted' }), { status: 200 });
  } catch (error) {
    console.error(`DELETE /api/payloads/${params.id} error:`, error);
    return new Response(JSON.stringify({ error: 'Failed to delete payload' }), { status: 500 });
  }
}