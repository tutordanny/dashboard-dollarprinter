import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';

export default function Admin() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState(null);
  const [users, setUsers] = useState([]);
  const [trades, setTrades] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [editSettings, setEditSettings] = useState({});
  const [editBalance, setEditBalance] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMounted(true);
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      router.push('/admin-login');
      return;
    }
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [settingsRes, usersRes, tradesRes, statsRes] = await Promise.all([
        api.get('/admin/settings'),
        api.get('/admin/users'),
        api.get('/admin/trades'),
        api.get('/admin/stats'),
      ]);
      setSettings(settingsRes.data);
      setEditSettings(settingsRes.data);
      setUsers(usersRes.data);
      setTrades(tradesRes.data);
      setStats(statsRes.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        router.push('/admin-login');
      }
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await api.post('/admin/update-settings', editSettings);
      setSettings(editSettings);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateUserBalance = async (userId) => {
    const amount = editBalance[userId];
    if (!amount) return;
    try {
      await api.post('/admin/update-balance', { userId, amount: Number(amount) });
      setMessage('Balance updated!');
      setTimeout(() => setMessage(''), 3000);
      fetchAll();
    } catch {
      setMessage('Failed to update balance');
    }
  };

  const logout = () => {
    localStorage.clear();
    router.push('/admin-login');
  };

  if (!mounted) return null;

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'settings', label: '⚙️ Sim Settings' },
    { id: 'users', label: '👥 Users' },
    { id: 'trades', label: '📋 Trades' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#0b0e17' }}>
      <header style={{
        background: '#111827', borderBottom: '1px solid #1e2d45',
        padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.5rem' }}>💵</span>
          <div>
            <div style={{ fontWeight: 700, color: '#22d3ee', fontSize: '1rem' }}>Dollar Printer</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Admin Control Panel</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/" style={{ color: '#64748b', fontSize: '0.85rem', textDecoration: 'none' }}>← Dashboard</a>
          <button onClick={logout} className="btn-danger" style={{ padding: '7px 14px', fontSize: '0.8rem' }}>Logout</button>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        {message && (
          <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '10px 16px', color: '#4ade80', fontSize: '0.85rem', marginBottom: 20 }}>
            {message}
          </div>
        )}

        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#111827', borderRadius: 12, padding: 6, border: '1px solid #1e2d45' }}>
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
              background: activeTab === tab.id ? '#1a2235' : 'transparent',
              color: activeTab === tab.id ? '#22d3ee' : '#64748b',
              transition: 'all 0.2s',
            }}>{tab.label}</button>
          ))}
        </div>

        {activeTab === 'overview' && stats && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Total Users', value: stats.totalUsers, color: '#22d3ee' },
                { label: 'Total Trades', value: stats.totalTrades, color: '#818cf8' },
                { label: 'Total Volume', value: `$${stats.totalVolume?.toFixed(2) || 0}`, color: '#f472b6' },
                { label: 'Platform P/L', value: `${stats.totalPL >= 0 ? '+' : ''}$${stats.totalPL?.toFixed(2) || 0}`, color: stats.totalPL >= 0 ? '#4ade80' : '#f87171' },
              ].map((s) => (
                <div key={s.label} className="card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontWeight: 700, fontSize: '1.6rem', color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>
            {settings && (
              <div className="card">
                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>Current Simulation Settings</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                  {[
                    { label: 'Win Probability', value: `${(settings.winProbability * 100).toFixed(0)}%` },
                    { label: 'Payout Ratio', value: `${(settings.payoutRatio * 100).toFixed(0)}%` },
                    { label: 'Volatility', value: settings.marketVolatility },
                    { label: 'Starting Balance', value: `$${settings.startingBalance}` },
                  ].map((s) => (
                    <div key={s.label} style={{ textAlign: 'center', padding: 16, background: '#1a2235', borderRadius: 10 }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: 6 }}>{s.label}</div>
                      <div style={{ fontWeight: 700, color: '#22d3ee', fontSize: '1.2rem' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && editSettings && (
          <div className="card" style={{ maxWidth: 600 }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>Simulation Configuration</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                { key: 'winProbability', label: 'Win Probability', hint: '0.0 – 1.0 (e.g. 0.55 = 55%)' },
                { key: 'payoutRatio', label: 'Payout Ratio', hint: '0.0 – 2.0 (e.g. 0.85 = 85% of stake)' },
                { key: 'marketVolatility', label: 'Market Volatility', hint: '0.1 – 2.0 (higher = more movement)' },
                { key: 'startingBalance', label: 'Starting Balance ($)', hint: 'Default balance for new users' },
              ].map(({ key, label, hint }) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <input
                    className="input-field"
                    type="number"
                    step="0.01"
                    value={editSettings[key] ?? ''}
                    onChange={(e) => setEditSettings((prev) => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                  />
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4 }}>{hint}</div>
                </div>
              ))}
              <button className="btn-primary" onClick={saveSettings} disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card">
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>User Management ({users.length})</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  {['Username', 'Role', 'Balance', 'Set Balance', ''].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #1e2d45', color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #1a2235' }}>
                    <td style={{ padding: '12px', color: '#e2e8f0', fontWeight: 600 }}>{u.username}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: u.role === 'admin' ? 'rgba(130,100,246,0.15)' : 'rgba(34,211,238,0.1)',
                        color: u.role === 'admin' ? '#a78bfa' : '#22d3ee',
                        padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600,
                      }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '12px', color: '#4ade80', fontWeight: 600 }}>${u.balance?.toFixed(2)}</td>
                    <td style={{ padding: '12px' }}>
                      <input
                        type="number"
                        className="input-field"
                        placeholder="New amount"
                        style={{ width: 140 }}
                        value={editBalance[u._id] || ''}
                        onChange={(e) => setEditBalance((prev) => ({ ...prev, [u._id]: e.target.value }))}
                      />
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button className="btn-primary" onClick={() => updateUserBalance(u._id)} style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'trades' && (
          <div className="card">
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>All Trades ({trades.length})</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    {['User', 'Direction', 'Stake', 'Result', 'P/L', 'Time'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid #1e2d45', color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t) => (
                    <tr key={t._id} style={{ borderBottom: '1px solid #1a2235' }}>
                      <td style={{ padding: '12px', color: '#22d3ee' }}>{t.userId?.username || 'Unknown'}</td>
                      <td style={{ padding: '12px', color: t.direction === 'up' ? '#4ade80' : '#f87171' }}>
                        {t.direction === 'up' ? '▲ Up' : '▼ Down'}
                      </td>
                      <td style={{ padding: '12px' }}>${t.stake.toFixed(2)}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={t.result === 'win' ? 'badge-win' : 'badge-loss'}>
                          {t.result?.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: t.profitLoss >= 0 ? '#4ade80' : '#f87171', fontWeight: 600 }}>
                        {t.profitLoss >= 0 ? '+' : ''}${t.profitLoss.toFixed(2)}
                      </td>
                      <td style={{ padding: '12px', color: '#64748b', fontSize: '0.75rem' }}>
                        {new Date(t.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
