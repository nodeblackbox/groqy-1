// frontend/src/app/api/configurations/route.js

import connectDB from '../../../lib/mongodb';
import Configuration from '../../../models/Configuration';

export async function GET(request) {
  try {
    await connectDB();
    const configs = await Configuration.find({});
    return new Response(JSON.stringify(configs), { status: 200 });
  } catch (error) {
    console.error("GET /api/configurations error:", error);
    return new Response(JSON.stringify({ error: 'Failed to fetch configurations' }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    await connectDB();

    // Check if config with the same ID already exists
    const existingConfig = await Configuration.findOne({ id: data.id });
    if (existingConfig) {
      return new Response(JSON.stringify({ error: 'Configuration with this ID already exists' }), { status: 400 });
    }

    const config = new Configuration(data);
    await config.save();
    return new Response(JSON.stringify({ data: config }), { status: 201 });
  } catch (error) {
    console.error("POST /api/configurations error:", error);
    return new Response(JSON.stringify({ error: 'Failed to create configuration' }), { status: 500 });
  }
}