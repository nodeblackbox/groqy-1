import mongoose from 'mongoose';
const { Schema } = mongoose;
// Tasks Schema

// Tasks Schema
const taskSchema = new Schema({
    prompt: { type: String, default: '' },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    completed: { type: Boolean, default: false },
    inProgress: { type: Boolean, default: false },
    code: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    project_id: { type: Schema.Types.ObjectId, ref: 'Project', default: null },
    difficulty: { type: String, default: '' }, // Updated field from priority to difficulty
    due_date: { type: Date, default: null },
    required_skills: { type: [String], default: [] },
    last_notification_at: { type: Date, default: null },
    last_email_at: { type: Date, default: null },
    title: { type: String, default: 'Default Task Title' },
    description: { type: String, default: 'Default Task Description' },
    task_url: { type: String, default: '' },
    file_upload_required: { type: Boolean, default: false },
    downloadable_file_url: { type: String, default: null },
    prompt_type: { type: String, default: 'text' }
});

const Tasks = mongoose.model('Tasks', taskSchema);

export default Tasks;


