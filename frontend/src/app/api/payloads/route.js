import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Helper function for DB interaction
const getDB = async () => {
  const client = await clientPromise;
  return client.db('groqy'); // Change the DB name if needed
};

// Fetch all payloads or a single payload by ID
export async function GET(req) {
  try {
    const db = await getDB();
    const id = req.nextUrl.searchParams.get('id'); // Get ID from query

    const payloads = id
      ? await db.collection('payloads').findOne({ id })
      : await db.collection('payloads').find({}).toArray();

    return new Response(JSON.stringify({ success: true, data: payloads }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error }), { status: 500 });
  }
}

// Create a new payload
export async function POST(req) {
  try {
    const db = await getDB();
    const payload = await req.json();

    const result = await db.collection('payloads').insertOne({
      ...payload,
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

// Update a payload by ID
export async function PUT(req) {
  try {
    const db = await getDB();
    const id = req.nextUrl.searchParams.get('id');
    const payloadUpdate = await req.json();

    const result = await db.collection('payloads').updateOne(
      { id },
      { $set: payloadUpdate }
    );

    return new Response(JSON.stringify({ success: true, updatedCount: result.modifiedCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error }), { status: 500 });
  }
}

// Delete a payload by ID
export async function DELETE(req) {
  try {
    const db = await getDB();
    const id = req.nextUrl.searchParams.get('id');

    const result = await db.collection('payloads').deleteOne({ id });

    return new Response(JSON.stringify({ success: true, deletedCount: result.deletedCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error }), { status: 500 });
  }
}
