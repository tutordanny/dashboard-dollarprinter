const { store, ensureSeeded } = require('../../lib/store');
const { requireAuth } = require('../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await ensureSeeded();
  const user = requireAuth(req, res);
  if (!user) return;

  const bot = store.bots.find((b) => b.ownerId === user.userId && b.isRunning);
  if (!bot) return res.status(404).json({ error: 'No running bot found' });

  bot.isRunning = false;
  bot.startedAt = null;
  res.json({ message: 'Bot stopped' });
}
