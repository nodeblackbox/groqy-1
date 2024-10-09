import mongoose from 'mongoose';
const { Schema } = mongoose;
// Projects Schema
const projectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    created_by: { type: String, required: true },
    status: { type: String, default: 'planning' }, // e.g., 'planning', 'in_progress', 'completed'
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Projects = mongoose.model('Projects', projectSchema);

export default Projects;

