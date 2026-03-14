const { store, ensureSeeded } = require('../../lib/store');
const { requireAuth } = require('../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  await ensureSeeded();
  const user = requireAuth(req, res);
  if (!user) return;
  const trades = store.trades
    .filter((t) => t.userId === user.userId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 50);
  res.json(trades);
}
