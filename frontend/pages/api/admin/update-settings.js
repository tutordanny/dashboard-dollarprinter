const { ensureSeeded } = require('../../../lib/store');
const { requireAdmin } = require('../../../lib/auth');
const { updateSettings } = require('../../../lib/engine');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await ensureSeeded();
  const user = requireAdmin(req, res);
  if (!user) return;
  try {
    const updated = updateSettings(req.body);
    res.json({ message: 'Settings updated', settings: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
