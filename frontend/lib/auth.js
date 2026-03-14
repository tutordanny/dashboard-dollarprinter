const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dollarprinter_secret_2024';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function getTokenFromHeader(req) {
  const header = req.headers.authorization;
  if (!header) return null;
  return header.split(' ')[1] || null;
}

function requireAuth(req, res) {
  const token = getTokenFromHeader(req);
  if (!token) { res.status(401).json({ error: 'No token' }); return null; }
  try {
    return verifyToken(token);
  } catch {
    res.status(401).json({ error: 'Invalid token' });
    return null;
  }
}

function requireAdmin(req, res) {
  const user = requireAuth(req, res);
  if (!user) return null;
  if (user.role !== 'admin') { res.status(403).json({ error: 'Admin only' }); return null; }
  return user;
}

module.exports = { signToken, verifyToken, requireAuth, requireAdmin };
