const mongoose = require('mongoose');

const BalanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  amount: { type: Number, default: 10000 },
}, { timestamps: true });

module.exports = mongoose.model('Balance', BalanceSchema);
