const { ensureSeeded } = require('../../lib/store');
const { executeTrade } = require('../../lib/engine');
const { requireAuth } = require('../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await ensureSeeded();
  const user = requireAuth(req, res);
  if (!user) return;
  const { stake, direction } = req.body;
  if (!stake || !direction) return res.status(400).json({ error: 'stake and direction required' });
  try {
    const result = executeTrade(user.userId, null, stake, direction);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
