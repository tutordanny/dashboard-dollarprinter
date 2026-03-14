const bcrypt = require('bcryptjs');
const { store, ensureSeeded } = require('../../lib/store');
const { signToken } = require('../../lib/auth');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  await ensureSeeded();
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  const user = store.users.find((u) => u.username === username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken({ userId: user._id, role: user.role });
  res.json({ token, role: user.role, username: user.username });
}
