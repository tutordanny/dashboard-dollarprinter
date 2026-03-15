const { ensureSeeded } = require('../../../lib/store');
const { requireAdmin } = require('../../../lib/auth');
const { getSettings } = require('../../../lib/engine');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  await ensureSeeded();
  const user = requireAdmin(req, res);
  if (!user) return;
  res.json(getSettings());
}
