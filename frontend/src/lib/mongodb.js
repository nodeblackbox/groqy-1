// lib/mongodb.js

import mongoose from 'mongoose';

let isConnected = false; // track the connection

export default async function connectDB() {
  if (isConnected) {
    console.log('=> Using existing database connection');
    return;
  }

  console.log('=> Creating new database connection');
  
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  isConnected = db.connections[0].readyState;
}
