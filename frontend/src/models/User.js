import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, default: '' },
    email: { type: String, default: '' },
    password_hash: { type: String, default: '' },
    role: { type: String, default: 'user' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    bio: { type: String, default: '' },
    skills: { type: [String], default: [] },
    total_points: { type: Number, default: 0 },
    last_notification_at: { type: Date, default: null },
    last_email_at: { type: Date, default: null },
    last_task_viewed: { type: String, default: null }
});

const Users = mongoose.model('Users', userSchema);

export default Users;

