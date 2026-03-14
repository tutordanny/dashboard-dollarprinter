const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../database/models/User');
const Balance = require('../database/models/Balance');
const Trade = require('../database/models/Trade');
const engine = require('../bot-engine');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dollarprinter_secret_2024';

function adminAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.get('/settings', adminAuth, (req, res) => {
  res.json(engine.getSettings());
});

router.post('/update-settings', adminAuth, (req, res) => {
  try {
    const { winProbability, payoutRatio, marketVolatility, startingBalance } = req.body;
    const updated = engine.updateSettings({ winProbability, payoutRatio, marketVolatility, startingBalance });
    res.json({ message: 'Settings updated', settings: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({}, '-passwordHash');
    const usersWithBalance = await Promise.all(users.map(async (u) => {
      const balance = await Balance.findOne({ userId: u._id });
      return { ...u.toObject(), balance: balance ? balance.amount : 0 };
    }));
    res.json(usersWithBalance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/update-balance', adminAuth, async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const balance = await Balance.findOneAndUpdate(
      { userId },
      { amount },
      { new: true, upsert: true }
    );
    res.json({ message: 'Balance updated', balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/trades', adminAuth, async (req, res) => {
  try {
    const trades = await Trade.find({}).sort({ timestamp: -1 }).limit(100).populate('userId', 'username');
    res.json(trades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTrades = await Trade.countDocuments();
    const trades = await Trade.find({});
    const totalVolume = trades.reduce((s, t) => s + t.stake, 0);
    const totalPL = trades.reduce((s, t) => s + t.profitLoss, 0);
    res.json({ totalUsers, totalTrades, totalVolume, totalPL });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
