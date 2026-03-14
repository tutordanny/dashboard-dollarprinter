const bcrypt = require('bcryptjs');
const { store, nextId, ensureSeeded } = require('../../lib/store');
const { signToken } = require('../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await ensureSeeded();
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  const existing = store.users.find((u) => u.username === username);
  if (existing) return res.status(400).json({ error: 'Username already taken' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { _id: nextId(), username, passwordHash, role: 'user', createdAt: new Date() };
  store.users.push(user);
  store.balances.push({ _id: nextId(), userId: user._id, amount: store.settings.startingBalance });
  const token = signToken({ userId: user._id, role: user.role });
  res.json({ token, role: user.role, username: user.username });
}
