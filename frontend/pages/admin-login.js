import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/login', { username, password });
      if (res.data.role !== 'admin') {
        setError('Access denied. Admin only.');
        setLoading(false);
        return;
      }
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      router.push('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0b0e17',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 20px' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔐</div>
            <div style={{ fontWeight: 700, fontSize: '1.3rem', color: '#22d3ee' }}>Admin Panel</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>Dollar Printer Bot Platform</div>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Username</label>
              <input
                className="input-field"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                required
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="label">Password</label>
              <input
                className="input-field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
            </div>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: '0.85rem', marginBottom: 16 }}>
                {error}
              </div>
            )}
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <a href="/" style={{ color: '#64748b', fontSize: '0.8rem', textDecoration: 'none' }}>
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
