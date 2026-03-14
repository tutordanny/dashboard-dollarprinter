const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
  botId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bot' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stake: { type: Number, required: true },
  direction: { type: String, enum: ['up', 'down'] },
  result: { type: String, enum: ['win', 'loss'] },
  profitLoss: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Trade', TradeSchema);
