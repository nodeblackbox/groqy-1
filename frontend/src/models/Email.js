import mongoose from 'mongoose';
const { Schema } = mongoose;
// Emails Schema
const emailSchema = new Schema({
    user_id: { type: String, default: null },
    subject: { type: String, default: '' },
    content: { type: String, default: '' },
    related_id: { type: String, default: null },
    sent_at: { type: Date, default: Date.now },
    status: { type: String, default: 'sent' }
});

const Emails = mongoose.model('Emails', emailSchema);

export default Emails;

