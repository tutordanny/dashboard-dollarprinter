const { store, ensureSeeded } = require('../../../lib/store');
const { requireAdmin } = require('../../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  await ensureSeeded();
  const user = requireAdmin(req, res);
  if (!user) return;

  const trades = store.trades
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 100)
    .map((t) => {
      const tradeUser = store.users.find((u) => u._id === t.userId);
      return { ...t, username: tradeUser ? tradeUser.username : 'unknown' };
    });

  res.json(trades);
}
