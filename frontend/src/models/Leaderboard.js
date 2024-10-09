import mongoose from 'mongoose';
const { Schema } = mongoose;
// Leaderboard Schema
const leaderboardSchema = new Schema({
    user_id: { type: String, default: null },
    points: { type: Number, default: 0 },
    tasks_completed: { type: Number, default: 0 },
    last_updated: { type: Date, default: Date.now }
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

export default Leaderboard;

