import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Helper function for DB interaction
const getDB = async () => {
  const client = await clientPromise;
  return client.db('groqy');
};

// Fetch all configs or a single config by ID
export async function GET(req) {
  try {
    const db = await getDB();
    const id = req.nextUrl.searchParams.get('id');

    const configs = id
      ? await db.collection('configs').findOne({ id })
      : await db.collection('configs').find({}).toArray();

    return new Response(JSON.stringify({ success: true, data: configs }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error }), { status: 500 });
  }
}

// Create a new config
export async function POST(req) {
  try {
    const db = await getDB();
    const config = await req.json();

    const result = await db.collection('configs').insertOne({
      ...config,
      createdAt: new Date(),
    });

    return new Response(JSON.stringify({ success: true, data: result.insertedId }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error }), { status: 500 });
  }
}

// Update a config by ID
export async function PUT(req) {
  try {
    const db = await getDB();
    const id = req.nextUrl.searchParams.get('id');
    const configUpdate = await req.json();

    const result = await db.collection('configs').updateOne(
      { id },
      { $set: configUpdate }
    );

    return new Response(JSON.stringify({ success: true, updatedCount: result.modifiedCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error }), { status: 500 });
  }
}

// Delete a config by ID
export async function DELETE(req) {
  try {
    const db = await getDB();
    const id = req.nextUrl.searchParams.get('id');

    const result = await db.collection('configs').deleteOne({ id });

    return new Response(JSON.stringify({ success: true, deletedCount: result.deletedCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error }), { status: 500 });
  }
}
