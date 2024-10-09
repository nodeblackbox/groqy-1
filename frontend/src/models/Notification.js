import mongoose from 'mongoose';
const { Schema } = mongoose;
// Notification Schema
// Notifications Schema
const notificationSchema = new Schema({
    user_id: { type: String, default: null },
    type: { type: String, default: '' },
    content: { type: String, default: '' },
    related_id: { type: String, default: null },
    read: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    read_at: { type: Date, default: null }
});

const Notifications = mongoose.model('Notifications', notificationSchema);

export default Notifications;

