import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import ChartPanel from '../components/ChartPanel';
import BotBuilder from '../components/BotBuilder';
import TradeLog from '../components/TradeLog';
import api from '../utils/api';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const endpoint = isRegister ? '/register' : '/login';
      const res = await api.post(endpoint, { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0b0e17',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 20px' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>💵</div>
            <div style={{ fontWeight: 700, fontSize: '1.4rem', color: '#22d3ee' }}>Dollar Printer</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 4 }}>Bot Simulation Platform</div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: '#1a2235', borderRadius: 10, padding: 4 }}>
            {['Login', 'Register'].map((t, i) => (
              <button key={t} onClick={() => setIsRegister(i === 1)} style={{
                flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                background: isRegister === (i === 1) ? '#243352' : 'transparent',
                color: isRegister === (i === 1) ? '#22d3ee' : '#64748b',
                transition: 'all 0.2s',
              }}>{t}</button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Username</label>
              <input className="input-field" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" required />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="label">Password</label>
              <input className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
            </div>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: '0.85rem', marginBottom: 16 }}>{error}</div>
            )}
            <button className="btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <a href="/admin-login" style={{ color: '#64748b', fontSize: '0.8rem', textDecoration: 'none' }}>Admin login →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryPage() {
  const [trades, setTrades] = useState([]);
  const [stats, setStats] = useState({ wins: 0, losses: 0, totalPL: 0 });
  useEffect(() => {
    api.get('/trades').then((res) => {
      setTrades(res.data);
      const wins = res.data.filter((t) => t.result === 'win').length;
      const losses = res.data.filter((t) => t.result === 'loss').length;
      const totalPL = res.data.reduce((s, t) => s + t.profitLoss, 0);
      setStats({ wins, losses, totalPL });
    }).catch(() => {});
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: '#f1f5f9', marginBottom: 20, fontSize: '1.2rem', fontWeight: 700 }}>Trade History</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Wins', value: stats.wins, color: '#4ade80' },
          { label: 'Total Losses', value: stats.losses, color: '#f87171' },
          { label: 'Net P/L', value: `${stats.totalPL >= 0 ? '+' : ''}$${stats.totalPL.toFixed(2)}`, color: stats.totalPL >= 0 ? '#4ade80' : '#f87171' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontWeight: 700, fontSize: '1.8rem', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <TradeLog trades={trades} />
    </div>
  );
}

function SettingsPage() {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: '#f1f5f9', marginBottom: 20, fontSize: '1.2rem', fontWeight: 700 }}>Settings</h2>
      <div className="card" style={{ maxWidth: 500 }}>
        <div style={{ marginBottom: 16, color: '#64748b', fontSize: '0.9rem' }}>
          Simulation settings are managed by the admin. Contact your administrator to adjust win probability, payout ratio, and market volatility.
        </div>
        <a href="/admin-login" style={{ color: '#22d3ee', fontSize: '0.85rem', textDecoration: 'none' }}>Admin Panel →</a>
      </div>
    </div>
  );
}

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [trades, setTrades] = useState([]);
  const [botRunning, setBotRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (token) {
      const username = localStorage.getItem('username');
      const role = localStorage.getItem('role');
      setUser({ username, role });
      setAuthenticated(true);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [balRes, tradeRes, statusRes] = await Promise.all([
        api.get('/balance'),
        api.get('/trades'),
        api.get('/bot-status'),
      ]);
      setBalance(balRes.data.amount);
      setTrades(tradeRes.data);
      setBotRunning(statusRes.data.running);
    } catch {}
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [authenticated, fetchData]);

  const handleLogin = (data) => {
    setUser({ username: data.username, role: data.role });
    setAuthenticated(true);
  };

  const handleStartBot = async (params) => {
    setLoading(true);
    try {
      await api.post('/run-bot', params);
      setBotRunning(true);
      setTimeout(fetchData, 1500);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to start bot');
    } finally {
      setLoading(false);
    }
  };

  const handleStopBot = async () => {
    try {
      await api.post('/stop-bot');
      setBotRunning(false);
    } catch {}
  };

  if (!mounted) return null;
  if (!authenticated) return <LoginForm onLogin={handleLogin} />;

  const renderPage = () => {
    switch (activePage) {
      case 'history': return <HistoryPage />;
      case 'settings': return <SettingsPage />;
      case 'bots':
      case 'dashboard':
      default:
        return (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <ChartPanel botRunning={botRunning} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <BotBuilder onStartBot={handleStartBot} onStopBot={handleStopBot} botRunning={botRunning} loading={loading} />
              <div className="card">
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>📊 Statistics</div>
                {(() => {
                  const wins = trades.filter((t) => t.result === 'win').length;
                  const losses = trades.filter((t) => t.result === 'loss').length;
                  const winRate = trades.length > 0 ? ((wins / trades.length) * 100).toFixed(1) : '0.0';
                  const totalPL = trades.reduce((s, t) => s + t.profitLoss, 0);
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {[
                        { label: 'Total Trades', value: trades.length, color: '#e2e8f0' },
                        { label: 'Win Rate', value: `${winRate}%`, color: Number(winRate) >= 50 ? '#4ade80' : '#f87171' },
                        { label: 'Wins', value: wins, color: '#4ade80' },
                        { label: 'Losses', value: losses, color: '#f87171' },
                        { label: 'Net P/L', value: `${totalPL >= 0 ? '+' : ''}$${totalPL.toFixed(2)}`, color: totalPL >= 0 ? '#4ade80' : '#f87171' },
                      ].map((s) => (
                        <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1e2d45' }}>
                          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{s.label}</span>
                          <span style={{ fontWeight: 700, color: s.color }}>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
            <TradeLog trades={trades.slice(0, 10)} />
          </div>
        );
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar
          balance={balance}
          botRunning={botRunning}
          onStart={() => setActivePage('bots')}
          onStop={handleStopBot}
          username={user?.username}
        />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
