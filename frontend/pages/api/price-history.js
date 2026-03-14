const { ensureSeeded } = require('../../lib/store');
const { generatePriceHistory } = require('../../lib/engine');
const { requireAuth } = require('../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  await ensureSeeded();
  const user = requireAuth(req, res);
  if (!user) return;
  res.json(generatePriceHistory(60));
}
