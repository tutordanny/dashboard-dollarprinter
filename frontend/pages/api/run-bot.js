const { store, nextId, ensureSeeded } = require('../../lib/store');
const { requireAuth } = require('../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await ensureSeeded();
  const user = requireAuth(req, res);
  if (!user) return;

  const { stake, direction, duration, name } = req.body;
  if (!stake || !direction) return res.status(400).json({ error: 'stake and direction required' });

  let bot = store.bots.find((b) => b.ownerId === user.userId && b.name === (name || 'My Bot'));
  if (!bot) {
    bot = {
      _id: nextId(),
      name: name || 'My Bot',
      ownerId: user.userId,
      parameters: { stake, direction, duration: duration || 5 },
      isRunning: true,
      startedAt: new Date(),
    };
    store.bots.push(bot);
  } else {
    bot.parameters = { stake, direction, duration: duration || 5 };
    bot.isRunning = true;
    bot.startedAt = new Date();
  }

  res.json({ message: 'Bot started', botId: bot._id });
}
