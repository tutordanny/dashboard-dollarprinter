const { store, ensureSeeded } = require('../../../lib/store');
const { requireAdmin } = require('../../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await ensureSeeded();
  const user = requireAdmin(req, res);
  if (!user) return;

  const { userId, amount } = req.body;
  const balance = store.balances.find((b) => b.userId === userId);
  if (balance) {
    balance.amount = amount;
  } else {
    store.balances.push({ userId, amount });
  }
  res.json({ message: 'Balance updated', balance: { userId, amount } });
}
