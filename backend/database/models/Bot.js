const mongoose = require('mongoose');

const BotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parameters: {
    stake: { type: Number, default: 10 },
    direction: { type: String, enum: ['up', 'down'], default: 'up' },
    duration: { type: Number, default: 5 },
  },
  isRunning: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Bot', BotSchema);
