// frontend/src/app/api/configurations/[id]/route.js

import connectDB from '../../../../lib/mongodb';
import Configuration from '../../../../models/Configuration';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    await connectDB();
    const config = await Configuration.findOne({ id });
    if (!config) {
      return new Response(JSON.stringify({ error: 'Configuration not found' }), { status: 404 });
    }
    return new Response(JSON.stringify(config), { status: 200 });
  } catch (error) {
    console.error(`GET /api/configurations/${params.id} error:`, error);
    return new Response(JSON.stringify({ error: 'Failed to fetch configuration' }), { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();
    await connectDB();
    const config = await Configuration.findOneAndUpdate({ id }, updates, { new: true });
    if (!config) {
      return new Response(JSON.stringify({ error: 'Configuration not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ data: config }), { status: 200 });
  } catch (error) {
    console.error(`PUT /api/configurations/${params.id} error:`, error);
    return new Response(JSON.stringify({ error: 'Failed to update configuration' }), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await connectDB();
    const config = await Configuration.findOneAndDelete({ id });
    if (!config) {
      return new Response(JSON.stringify({ error: 'Configuration not found' }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: 'Configuration deleted' }), { status: 200 });
  } catch (error) {
    console.error(`DELETE /api/configurations/${params.id} error:`, error);
    return new Response(JSON.stringify({ error: 'Failed to delete configuration' }), { status: 500 });
  }
}