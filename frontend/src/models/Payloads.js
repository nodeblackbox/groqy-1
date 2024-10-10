// models/Payloads.js
import mongoose from 'mongoose';

const payloadSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  method: { type: String, enum: ['GET', 'POST', 'PUT', 'DELETE'], required: true },
  headers: { type: mongoose.Schema.Types.Mixed, default: {} },
  body: { type: mongoose.Schema.Types.Mixed, default: {} },
  subtasks: [{ type: String }], // Assuming subtasks are IDs of other Payloads or specific task identifiers
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Payloads || mongoose.model('Payloads', payloadSchema);