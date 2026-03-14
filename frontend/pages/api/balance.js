const { store, ensureSeeded } = require('../../lib/store');
const { requireAuth } = require('../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  await ensureSeeded();
  const user = requireAuth(req, res);
  if (!user) return;
  const balance = store.balances.find((b) => b.userId === user.userId);
  res.json({ amount: balance ? balance.amount : 0 });
}
