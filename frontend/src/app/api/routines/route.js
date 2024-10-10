import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// Helper function for DB interaction
const getDB = async () => {
  const client = await clientPromise;
  return client.db('groqy');
};

// Fetch all routines or a single routine by ID
export async function GET(req) {
  try {
    const db = await getDB();
    const id = req.nextUrl.searchParams.get('id');

    const routines = id
      ? await db.collection('routines').findOne({ id })
      : await db.collection('routines').find({}).toArray();

    return new Response(JSON.stringify({ success: true, data: routines }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error }), { status: 500 });
  }
}

// Create a new routine
export async function POST(req) {
  try {
    const db = await getDB();
    const routine = await req.json();

    const result = await db.collection('routines').insertOne({
      ...routine,
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

// Update a routine by ID
export async function PUT(req) {
  try {
    const db = await getDB();
    const id = req.nextUrl.searchParams.get('id');
    const routineUpdate = await req.json();

    const result = await db.collection('routines').updateOne(
      { id },
      { $set: routineUpdate }
    );

    return new Response(JSON.stringify({ success: true, updatedCount: result.modifiedCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error }), { status: 500 });
  }
}

// Delete a routine by ID
export async function DELETE(req) {
  try {
    const db = await getDB();
    const id = req.nextUrl.searchParams.get('id');

    const result = await db.collection('routines').deleteOne({ id });

    return new Response(JSON.stringify({ success: true, deletedCount: result.deletedCount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error }), { status: 500 });
  }
}
