const { store, ensureSeeded } = require('../../../lib/store');
const { requireAdmin } = require('../../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  await ensureSeeded();
  const user = requireAdmin(req, res);
  if (!user) return;

  const totalUsers = store.users.length;
  const totalTrades = store.trades.length;
  const totalVolume = store.trades.reduce((s, t) => s + t.stake, 0);
  const totalPL = store.trades.reduce((s, t) => s + t.profitLoss, 0);

  res.json({ totalUsers, totalTrades, totalVolume, totalPL });
}
