import mongoose from 'mongoose';

const payloadSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  url: { type: String },
  method: { type: String },
  headers: { type: Object },
  body: { type: Object },
  subtasks: { type: Array },
});

const Payload = mongoose.models.Payload || mongoose.model('Payload', payloadSchema);

export default Payload;
