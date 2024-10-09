import mongoose from 'mongoose';
const { Schema } = mongoose;
// Comments Schema
const commentSchema = new Schema({
    user_id: { type: String, default: null },
    task_id: { type: String, default: null },
    content: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Comments = mongoose.model('Comments', commentSchema);

export default Comments;

