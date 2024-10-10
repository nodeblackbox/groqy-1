// frontend/src/models/Payload.js

import mongoose from 'mongoose';

const SubtaskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  method: { type: String, required: true, enum: ['GET', 'POST', 'PUT', 'DELETE'] },
  headers: { type: Object, default: {} },
  body: { type: Object, default: {} },
});

const PayloadSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  method: { type: String, required: true, enum: ['GET', 'POST', 'PUT', 'DELETE'] },
  headers: { type: Object, default: {} },
  body: { type: Object, default: {} },
  subtasks: { type: [SubtaskSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Payload || mongoose.model('Payload', PayloadSchema);