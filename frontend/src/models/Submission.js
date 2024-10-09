import mongoose from 'mongoose';
const { Schema } = mongoose;
// Submissions Schema
const submissionSchema = new Schema({
    user_id: { type: String, default: null },
    task_id: { type: String, default: null },
    code: { type: String, default: null },
    submitted_at: { type: Date, default: Date.now },
    uploaded_file_url: { type: String, default: null },
    status: { type: String, default: '' },
    feedback: { type: String, default: null },
    submission_type: { type: String, default: 'code' }
});

const Submissions = mongoose.model('Submissions', submissionSchema);

export default Submissions;

