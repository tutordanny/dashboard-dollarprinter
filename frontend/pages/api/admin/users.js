const { store, ensureSeeded } = require('../../../lib/store');
const { requireAdmin } = require('../../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  await ensureSeeded();
  const user = requireAdmin(req, res);
  if (!user) return;

  const usersWithBalance = store.users.map((u) => {
    const balance = store.balances.find((b) => b.userId === u._id);
    const { passwordHash, ...safeUser } = u;
    return { ...safeUser, balance: balance ? balance.amount : 0 };
  });

  res.json(usersWithBalance);
}
