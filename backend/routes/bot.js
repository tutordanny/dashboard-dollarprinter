const express = require('express');
const jwt = require('jsonwebtoken');
const Bot = require('../database/models/Bot');
const Trade = require('../database/models/Trade');
const Balance = require('../database/models/Balance');
const engine = require('../bot-engine');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dollarprinter_secret_2024';

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.get('/balance', auth, async (req, res) => {
  try {
    const balance = await Balance.findOne({ userId: req.user.userId });
    res.json({ amount: balance ? balance.amount : 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/trades', auth, async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.user.userId }).sort({ timestamp: -1 }).limit(50);
    res.json(trades);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/run-bot', auth, async (req, res) => {
  try {
    const { stake, direction, duration, name } = req.body;
    if (!stake || !direction) return res.status(400).json({ error: 'stake and direction required' });

    let bot = await Bot.findOne({ ownerId: req.user.userId, name: name || 'My Bot' });
    if (!bot) {
      bot = await Bot.create({
        name: name || 'My Bot',
        ownerId: req.user.userId,
        parameters: { stake, direction, duration: duration || 5 },
      });
    } else {
      bot.parameters = { stake, direction, duration: duration || 5 };
      await bot.save();
    }

    if (engine.isBotRunning(bot._id)) {
      return res.json({ message: 'Bot already running', botId: bot._id });
    }

    bot.isRunning = true;
    await bot.save();

    engine.startBot(req.user.userId, bot._id, { stake, direction, duration: duration || 5 }, async ({ trade, newBalance }) => {
      console.log(`Trade: ${trade.result} | P/L: ${trade.profitLoss} | Balance: ${newBalance}`);
    });

    res.json({ message: 'Bot started', botId: bot._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/stop-bot', auth, async (req, res) => {
  try {
    const bot = await Bot.findOne({ ownerId: req.user.userId });
    if (!bot) return res.status(404).json({ error: 'Bot not found' });

    engine.stopBot(bot._id);
    bot.isRunning = false;
    await bot.save();
    res.json({ message: 'Bot stopped' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/trade', auth, async (req, res) => {
  try {
    const { stake, direction } = req.body;
    if (!stake || !direction) return res.status(400).json({ error: 'stake and direction required' });
    const { trade, newBalance } = await engine.executeTrade(req.user.userId, null, stake, direction);
    res.json({ trade, newBalance });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/price-history', auth, (req, res) => {
  res.json(engine.generatePriceHistory(60));
});

router.get('/bot-status', auth, async (req, res) => {
  try {
    const bot = await Bot.findOne({ ownerId: req.user.userId });
    if (!bot) return res.json({ running: false });
    res.json({ running: engine.isBotRunning(bot._id), bot });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
