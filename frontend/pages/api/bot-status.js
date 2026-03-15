const { store, ensureSeeded } = require('../../lib/store');
const { executeTrade } = require('../../lib/engine');
const { requireAuth } = require('../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  await ensureSeeded();
  const user = requireAuth(req, res);
  if (!user) return;

  const bot = store.bots.find((b) => b.ownerId === user.userId);
  if (!bot) return res.json({ running: false });

  if (bot.isRunning && bot.startedAt) {
    const elapsed = (Date.now() - new Date(bot.startedAt).getTime()) / 1000;
    const duration = bot.parameters.duration || 5;
    const tradesSinceStart = store.trades.filter(
      (t) => t.botId === bot._id && new Date(t.timestamp) >= new Date(bot.startedAt)
    ).length;
    const expectedTrades = Math.floor(elapsed / duration);

    if (expectedTrades > tradesSinceStart) {
      const toExecute = Math.min(expectedTrades - tradesSinceStart, 5);
      for (let i = 0; i < toExecute; i++) {
        try {
          executeTrade(user.userId, bot._id, bot.parameters.stake, bot.parameters.direction);
        } catch {
          bot.isRunning = false;
          break;
        }
      }
    }
  }

  res.json({ running: bot.isRunning, bot });
}
