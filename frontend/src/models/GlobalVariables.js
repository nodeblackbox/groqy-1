// models/GlobalVariables.js
import mongoose from 'mongoose';

const globalVariableSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.GlobalVariables || mongoose.model('GlobalVariables', globalVariableSchema);