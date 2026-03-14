import { useState, useEffect, useCallback, useRef } from 'react';
import Head from 'next/head';
import {
  Chart as ChartJS, LineElement, PointElement, LinearScale,
  CategoryScale, Filler, Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '../utils/api';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

/* ─── tiny SVG icons ─── */
const Icon = ({ d, size = 18, color = 'currentColor', viewBox = '0 0 24 24', fill = 'none' }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={fill} stroke={color} strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);

/* ─── Login Modal ─── */
function LoginModal({ onClose, onSuccess, switchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.post('/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#999' }}>×</button>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ fontSize:28, marginBottom:8 }}>💵</div>
          <div style={{ fontWeight:700, fontSize:20, color:'#333' }}>Log in</div>
          <div style={{ color:'#999', fontSize:13, marginTop:4 }}>Dollar Printer Bot Platform</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#666', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Username</label>
            <input className="input-field" type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Enter your username" required />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#666', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Password</label>
            <input className="input-field" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" required />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button className="btn-red" type="submit" disabled={loading} style={{ width:'100%', padding:'12px' }}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <div style={{ textAlign:'center', marginTop:18, fontSize:13, color:'#666' }}>
          Don't have an account?{' '}
          <span onClick={switchToRegister} style={{ color:'#ff444f', fontWeight:700, cursor:'pointer' }}>Sign up</span>
        </div>
        <div style={{ textAlign:'center', marginTop:8, fontSize:12, color:'#999' }}>
          <a href="/admin-login" style={{ color:'#999' }}>Admin login →</a>
        </div>
      </div>
    </div>
  );
}

/* ─── Sign Up Modal ─── */
function SignupModal({ onClose, onSuccess, switchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      const res = await api.post('/register', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16, background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#999' }}>×</button>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ fontSize:28, marginBottom:8 }}>💵</div>
          <div style={{ fontWeight:700, fontSize:20, color:'#333' }}>Create free account</div>
          <div style={{ color:'#999', fontSize:13, marginTop:4 }}>Start trading with Dollar Printer</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#666', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Username</label>
            <input className="input-field" type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Choose a username" required />
          </div>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#666', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Password</label>
            <input className="input-field" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Create a password" required />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#666', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' }}>Confirm Password</label>
            <input className="input-field" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirm your password" required />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button className="btn-red" type="submit" disabled={loading} style={{ width:'100%', padding:'12px' }}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <div style={{ textAlign:'center', marginTop:18, fontSize:13, color:'#666' }}>
          Already have an account?{' '}
          <span onClick={switchToLogin} style={{ color:'#ff444f', fontWeight:700, cursor:'pointer' }}>Log in</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Top Bar ─── */
function TopBar({ user, onLogin, onSignup, onLogout }) {
  return (
    <header style={{
      height: 56, background: '#fff', borderBottom: '1px solid #e5e5e5',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Left brand */}
      <div style={{ display:'flex', alignItems:'center', gap:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, paddingRight:16, borderRight:'1px solid #e5e5e5', cursor:'pointer' }}>
          <div style={{
            width:32, height:32, background:'#000', borderRadius:4,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:16,
          }}>💵</div>
          <span style={{ fontWeight:700, fontSize:14, color:'#333' }}>Dollar Printers</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'0 16px', borderRight:'1px solid #e5e5e5', cursor:'pointer', color:'#666' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span style={{ fontSize:13 }}>Trader's Hub</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0 16px', cursor:'pointer' }}>
          <div style={{ width:24, height:24, background:'#ff444f', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:'#fff', fontWeight:700 }}>DB</div>
          <span style={{ fontSize:13, fontWeight:600, color:'#333' }}>deriv Bot</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
        </div>
      </div>

      {/* Right auth area */}
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        {user ? (
          <>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:32, height:32, background:'#ff444f', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:13 }}>
                {user.username[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:'#333' }}>{user.username}</div>
                <div style={{ fontSize:11, color:'#999' }}>
                  {user.role === 'admin' ? 'Administrator' : 'Trader'}
                </div>
              </div>
            </div>
            {user.role === 'admin' && (
              <a href="/admin" style={{ fontSize:13, color:'#ff444f', fontWeight:600, padding:'6px 12px', border:'1px solid #ff444f', borderRadius:4 }}>Admin Panel</a>
            )}
            <button onClick={onLogout} style={{ fontSize:13, color:'#666', background:'none', border:'1px solid #e5e5e5', borderRadius:4, padding:'6px 14px', cursor:'pointer' }}>Log out</button>
          </>
        ) : (
          <>
            <span style={{ fontSize:12, color:'#666', maxWidth:200, lineHeight:1.3, textAlign:'right' }}>
              New to Dollar Printer? Get your free account to unlock premium bots.
            </span>
            <button onClick={onLogin} style={{ fontSize:13, color:'#ff444f', fontWeight:700, background:'none', border:'none', cursor:'pointer', padding:'6px 8px' }}>Log in</button>
            <button onClick={onSignup} className="btn-red" style={{ padding:'8px 18px', fontSize:13 }}>Sign up</button>
          </>
        )}
      </div>
    </header>
  );
}

/* ─── Tab Bar ─── */
function TabBar({ activeTab, setActiveTab, botRunning, onRunBot, onStopBot, balance }) {
  const tabs = [
    { id:'dashboard', label:'Dashboard', icon:'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 3h7v4h-7zm0-3h3v2h-3z' },
    { id:'botbuilder', label:'Bot Builder', icon:'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
    { id:'charts', label:'Charts', icon:'M18 20V10M12 20V4M6 20v-6' },
    { id:'tutorials', label:'Tutorials', icon:'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664zM21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id:'freebots', label:'Free Bots', icon:'M12 2a10 10 0 100 20A10 10 0 0012 2zm0 0v20M2 12h20' },
    { id:'analysis', label:'Analysis Tool', icon:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  return (
    <div style={{
      background:'#fff', borderBottom:'1px solid #e5e5e5',
      display:'flex', alignItems:'stretch', justifyContent:'space-between',
      padding:'0 16px',
    }}>
      {/* Tabs */}
      <div style={{ display:'flex', alignItems:'stretch' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            display:'flex', alignItems:'center', gap:6,
            padding:'0 16px', height:48, border:'none', background:'none', cursor:'pointer',
            color: activeTab === tab.id ? '#ff444f' : '#666',
            fontWeight: activeTab === tab.id ? 700 : 400,
            fontSize:13,
            borderBottom: activeTab === tab.id ? '2px solid #ff444f' : '2px solid transparent',
            whiteSpace:'nowrap',
            transition:'color 0.15s',
          }}>
            <Icon d={tab.icon} size={16} color={activeTab === tab.id ? '#ff444f' : '#999'} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right controls */}
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        {balance !== null && (
          <div style={{ fontSize:13, color:'#333', fontWeight:600 }}>
            Balance: <span style={{ color:'#26a69a' }}>${balance?.toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 }) ?? '—'}</span>
          </div>
        )}
        <div style={{ width:1, height:24, background:'#e5e5e5' }} />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        <button onClick={botRunning ? onStopBot : onRunBot} style={{
          display:'flex', alignItems:'center', gap:6,
          background: botRunning ? '#ff444f' : '#26a69a',
          color:'#fff', border:'none', borderRadius:4,
          padding:'8px 16px', fontSize:13, fontWeight:700, cursor:'pointer',
          transition:'background 0.2s',
        }}>
          {botRunning ? (
            <><svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="6" width="12" height="12"/></svg> Stop</>
          ) : (
            <><svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><polygon points="5,3 19,12 5,21"/></svg> Run</>
          )}
        </button>
        <div style={{
          display:'flex', alignItems:'center', gap:8,
          background:'#f5f5f5', borderRadius:4, padding:'6px 14px',
          minWidth:180,
        }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background: botRunning ? '#26a69a' : '#bbb', flexShrink:0 }} />
          <span style={{ fontSize:12, color:'#666' }}>
            {botRunning ? 'Bot is running' : 'Bot is not running'}
          </span>
          {botRunning && (
            <div style={{ flex:1, height:3, background:'#e5e5e5', borderRadius:2, overflow:'hidden', marginLeft:4 }}>
              <div style={{ height:'100%', background:'#26a69a', animation:'progress 2s linear infinite', width:'30%' }} />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes progress { 0%{margin-left:0;width:30%} 50%{width:60%} 100%{margin-left:100%;width:30%} }
      `}</style>
    </div>
  );
}

/* ─── Dashboard (Load bot) ─── */
function DashboardTab({ user, onLogin, onBotStart, botRunning }) {
  const cards = [
    { icon:'🖥️', label:'My computer', desc:'Load a bot file from your device' },
    { icon:'▲', label:'Google Drive', desc:'Import from Google Drive', colored:true },
    { icon:'🔧', label:'Bot builder', desc:'Build your strategy visually' },
    { icon:'⚡', label:'Quick strategy', desc:'Start with a pre-built strategy' },
  ];

  const [activeCard, setActiveCard] = useState(null);

  const handleCard = (idx) => {
    if (!user) { onLogin(); return; }
    setActiveCard(idx);
    if (idx === 2 || idx === 3) onBotStart();
  };

  return (
    <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', padding:40 }}>
        {!botRunning ? (
          <>
            <h2 style={{ fontSize:22, fontWeight:700, color:'#333', marginBottom:12, textAlign:'center' }}>
              Load or build your bot
            </h2>
            <p style={{ color:'#666', fontSize:14, textAlign:'center', maxWidth:480, marginBottom:40, lineHeight:1.7 }}>
              Import a bot from your computer or Google Drive, build it from scratch, or start with a quick strategy.
            </p>
            <div style={{ display:'flex', gap:20, flexWrap:'wrap', justifyContent:'center' }}>
              {cards.map((c, i) => (
                <div key={i} onClick={() => handleCard(i)} style={{
                  width:130, padding:'24px 16px', background:'#fff',
                  border:'1px solid #e5e5e5', borderRadius:8, cursor:'pointer',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:12,
                  transition:'box-shadow 0.2s, border-color 0.2s',
                  boxShadow: activeCard === i ? '0 0 0 2px #ff444f' : 'none',
                  borderColor: activeCard === i ? '#ff444f' : '#e5e5e5',
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = activeCard === i ? '0 0 0 2px #ff444f' : 'none'}
                >
                  <div style={{
                    width:56, height:56, background: c.colored ? 'transparent' : '#f0f9ff',
                    borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:28,
                  }}>
                    {i === 0 && <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#26a69a" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>}
                    {i === 1 && (
                      <svg width="32" height="32" viewBox="0 0 87.3 78" fill="none">
                        <path d="M6.6 66.85 3.1 61.26a6 6 0 010-6L33.9 5.49a6 6 0 015.2-3h9l-32.5 56.3z" fill="#0066da"/>
                        <path d="M77.3 66.85h-56l-9-15.57 9-15.55h40.8l6.4-11.07h-47.2l-6.5-11.27h66.5a6 6 0 015.2 9L77.3 66.85z" fill="#00ac47"/>
                        <path d="M43.85 78l-9-15.57 9-15.57H21.2l-9 15.57L21.2 78h22.65z" fill="#ea4335"/>
                        <path d="M65.1 34.16l-9 15.57-9-15.57H21.2l9 15.57 9 15.57h25.9l9-15.57-9-15.57z" fill="#00832d"/>
                        <path d="M43.85 78H21.2l-9-15.57h22.65L43.85 78z" fill="#2684fc"/>
                        <path d="M6.6 66.85 3.1 61.26a6 6 0 010-6L33.9 5.49l9 15.57L6.6 66.85z" fill="#00ac47"/>
                      </svg>
                    )}
                    {i === 2 && <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#26a69a" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
                    {i === 3 && <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff444f" strokeWidth="1.5"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>}
                  </div>
                  <span style={{ fontSize:13, fontWeight:600, color:'#333', textAlign:'center' }}>{c.label}</span>
                </div>
              ))}
            </div>
            {!user && (
              <div style={{ marginTop:32, padding:'14px 24px', background:'#fff8f8', border:'1px solid #ffd5d5', borderRadius:8, textAlign:'center' }}>
                <span style={{ fontSize:13, color:'#666' }}>Please </span>
                <span onClick={onLogin} style={{ color:'#ff444f', fontWeight:700, cursor:'pointer', fontSize:13 }}>log in</span>
                <span style={{ fontSize:13, color:'#666' }}> or </span>
                <span onClick={onLogin} style={{ color:'#ff444f', fontWeight:700, cursor:'pointer', fontSize:13 }}>create a free account</span>
                <span style={{ fontSize:13, color:'#666' }}> to run your bot.</span>
              </div>
            )}
          </>
        ) : (
          <BotRunningView />
        )}
      </div>
    </div>
  );
}

/* ─── Bot Running View ─── */
function BotRunningView() {
  const [trades, setTrades] = useState([]);
  const [balance, setBalance] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [tRes, bRes] = await Promise.all([api.get('/trades'), api.get('/balance')]);
      setTrades(tRes.data.slice(0, 5));
      setBalance(bRes.data.amount);
    } catch {}
  }, []);

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 3000);
    return () => clearInterval(iv);
  }, [fetchData]);

  const wins = trades.filter(t => t.result === 'win').length;
  const totalPL = trades.reduce((s, t) => s + t.profitLoss, 0);

  return (
    <div style={{ width:'100%', maxWidth:700 }}>
      <div style={{ display:'flex', gap:16, marginBottom:20 }}>
        {[
          { label:'Balance', value:`$${balance?.toFixed(2) ?? '—'}`, color:'#26a69a' },
          { label:'Recent Trades', value:trades.length, color:'#333' },
          { label:'Wins', value:wins, color:'#26a69a' },
          { label:'Net P/L', value:`${totalPL>=0?'+':''}$${totalPL.toFixed(2)}`, color:totalPL>=0?'#26a69a':'#ff444f' },
        ].map(s => (
          <div key={s.label} style={{ flex:1, border:'1px solid #e5e5e5', borderRadius:8, padding:'16px', textAlign:'center' }}>
            <div style={{ fontSize:11, color:'#999', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>{s.label}</div>
            <div style={{ fontWeight:700, fontSize:20, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ border:'1px solid #e5e5e5', borderRadius:8, overflow:'hidden' }}>
        <div style={{ padding:'12px 16px', background:'#f9f9f9', borderBottom:'1px solid #e5e5e5', fontSize:13, fontWeight:600, color:'#333' }}>
          Recent Trades
        </div>
        {trades.length === 0 ? (
          <div style={{ padding:24, textAlign:'center', color:'#999', fontSize:13 }}>Waiting for trades...</div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ background:'#f9f9f9' }}>
                {['Direction','Stake','Result','P/L','Time'].map(h => (
                  <th key={h} style={{ padding:'8px 16px', textAlign:'left', color:'#999', fontWeight:600, fontSize:11, textTransform:'uppercase', borderBottom:'1px solid #e5e5e5' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trades.map(t => (
                <tr key={t._id} style={{ borderBottom:'1px solid #f0f0f0' }}>
                  <td style={{ padding:'10px 16px', color:t.direction==='up'?'#26a69a':'#ff444f', fontWeight:600 }}>
                    {t.direction==='up'?'▲ Up':'▼ Down'}
                  </td>
                  <td style={{ padding:'10px 16px' }}>${t.stake.toFixed(2)}</td>
                  <td style={{ padding:'10px 16px' }}>
                    <span style={{
                      padding:'2px 8px', borderRadius:12, fontSize:11, fontWeight:700,
                      background:t.result==='win'?'#e8f5e9':'#fce4e4',
                      color:t.result==='win'?'#2e7d32':'#c62828',
                    }}>{t.result.toUpperCase()}</span>
                  </td>
                  <td style={{ padding:'10px 16px', color:t.profitLoss>=0?'#26a69a':'#ff444f', fontWeight:600 }}>
                    {t.profitLoss>=0?'+':''}${t.profitLoss.toFixed(2)}
                  </td>
                  <td style={{ padding:'10px 16px', color:'#999', fontSize:12 }}>
                    {new Date(t.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ─── Bot Builder Tab ─── */
function BotBuilderTab({ user, onLogin, botRunning, onStartBot, onStopBot }) {
  const [stake, setStake] = useState(10);
  const [direction, setDirection] = useState('up');
  const [duration, setDuration] = useState(5);
  const [botName, setBotName] = useState('My Trading Bot');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!user) { onLogin(); return; }
    setLoading(true);
    try { await onStartBot({ stake:Number(stake), direction, duration:Number(duration), name:botName }); }
    catch {}
    setLoading(false);
  };

  return (
    <div style={{ flex:1, padding:32, overflowY:'auto' }}>
      <div style={{ maxWidth:800, margin:'0 auto' }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:'#333', marginBottom:6 }}>Bot Builder</h2>
        <p style={{ color:'#999', fontSize:13, marginBottom:28 }}>Configure your automated trading bot strategy below.</p>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
          {[
            { label:'Bot Name', content:(
              <input className="input-field" value={botName} onChange={e=>setBotName(e.target.value)} placeholder="My Trading Bot" />
            )},
            { label:'Stake Amount ($)', content:(
              <input className="input-field" type="number" value={stake} onChange={e=>setStake(e.target.value)} min={1} step={1} />
            )},
            { label:'Trade Direction', content:(
              <div style={{ display:'flex', gap:8 }}>
                {['up','down'].map(d => (
                  <button key={d} onClick={()=>setDirection(d)} style={{
                    flex:1, padding:'10px', borderRadius:4, cursor:'pointer', fontWeight:700, fontSize:13,
                    border:`1px solid ${direction===d?(d==='up'?'#26a69a':'#ff444f'):'#e5e5e5'}`,
                    background:direction===d?(d==='up'?'#e8f5e9':'#fce4e4'):'#fff',
                    color:direction===d?(d==='up'?'#26a69a':'#ff444f'):'#666',
                  }}>
                    {d==='up'?'▲ Rise':'▼ Fall'}
                  </button>
                ))}
              </div>
            )},
            { label:'Duration (seconds)', content:(
              <input className="input-field" type="number" value={duration} onChange={e=>setDuration(e.target.value)} min={2} max={60} />
            )},
          ].map(({ label, content }) => (
            <div key={label}>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'#666', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</label>
              {content}
            </div>
          ))}
        </div>

        <div style={{ padding:'16px 20px', background:'#f9f9f9', border:'1px solid #e5e5e5', borderRadius:8, marginBottom:24, fontSize:13, color:'#666' }}>
          <strong style={{ color:'#333' }}>Strategy summary:</strong> Stake <strong>${stake}</strong> in the{' '}
          <strong style={{ color:direction==='up'?'#26a69a':'#ff444f' }}>{direction==='up'?'▲ Rise':'▼ Fall'}</strong> direction every{' '}
          <strong>{duration} seconds</strong>
        </div>

        <div style={{ display:'flex', gap:12 }}>
          <button onClick={handleStart} disabled={botRunning || loading} style={{
            padding:'12px 32px', background:botRunning?'#ccc':'#ff444f', color:'#fff',
            border:'none', borderRadius:4, fontWeight:700, fontSize:14, cursor:botRunning?'not-allowed':'pointer',
          }}>
            {loading ? 'Starting...' : '▶ Run Bot'}
          </button>
          {botRunning && (
            <button onClick={onStopBot} style={{
              padding:'12px 32px', background:'#fff', color:'#ff444f',
              border:'1px solid #ff444f', borderRadius:4, fontWeight:700, fontSize:14, cursor:'pointer',
            }}>
              ■ Stop Bot
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Charts Tab ─── */
function ChartsTab({ botRunning }) {
  const [prices, setPrices] = useState([]);
  const ivRef = useRef(null);

  const loadHistory = async () => {
    try {
      const res = await api.get('/price-history');
      setPrices(res.data);
    } catch {
      setPrices(Array.from({ length:60 }, (_, i) => 1000 + Math.sin(i*0.3)*50 + Math.random()*20));
    }
  };

  useEffect(() => { loadHistory(); }, []);

  useEffect(() => {
    if (botRunning) {
      ivRef.current = setInterval(() => {
        setPrices(prev => {
          if (!prev.length) return prev;
          const last = prev[prev.length - 1];
          const next = Math.max(0.01, last + (Math.random()-0.5)*2*0.5*last*0.01);
          return [...prev.slice(-79), next];
        });
      }, 1000);
    } else clearInterval(ivRef.current);
    return () => clearInterval(ivRef.current);
  }, [botRunning]);

  const last = prices[prices.length - 1] || 0;
  const first = prices[0] || 0;
  const isUp = last >= first;
  const change = first > 0 ? ((last-first)/first*100).toFixed(2) : '0.00';

  const data = {
    labels: prices.map(() => ''),
    datasets: [{
      data: prices,
      borderColor: isUp ? '#26a69a' : '#ef5350',
      backgroundColor: isUp ? 'rgba(38,166,154,0.08)' : 'rgba(239,83,80,0.08)',
      borderWidth: 2, pointRadius: 0, tension: 0.4, fill: true,
    }],
  };
  const options = {
    responsive:true, maintainAspectRatio:false, animation:{ duration:200 },
    scales: {
      x: { display:false },
      y: { grid:{ color:'#f0f0f0' }, ticks:{ color:'#999', font:{ size:11 } } },
    },
    plugins: {
      legend:{ display:false },
      tooltip:{ backgroundColor:'#fff', borderColor:'#e5e5e5', borderWidth:1, titleColor:'#999', bodyColor:'#333' },
    },
  };

  return (
    <div style={{ flex:1, padding:24, overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'baseline', gap:12, marginBottom:20 }}>
        <h2 style={{ fontSize:20, fontWeight:700, color:'#333' }}>Simulated Market</h2>
        <span style={{ fontSize:22, fontWeight:700, color:isUp?'#26a69a':'#ef5350' }}>${last.toFixed(4)}</span>
        <span style={{ fontSize:14, color:isUp?'#26a69a':'#ef5350', fontWeight:600 }}>
          {isUp?'▲':'▼'} {Math.abs(Number(change))}%
        </span>
        {botRunning && <span style={{ fontSize:12, color:'#26a69a', background:'#e8f5e9', padding:'2px 8px', borderRadius:10 }}>● LIVE</span>}
      </div>
      <div style={{ background:'#fff', border:'1px solid #e5e5e5', borderRadius:8, padding:20, height:320 }}>
        {prices.length > 0 ? <Line data={data} options={options} /> : (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'#999' }}>Loading chart...</div>
        )}
      </div>

      <div style={{ display:'flex', gap:16, marginTop:16 }}>
        {[
          { label:'Open', value:`$${first.toFixed(4)}` },
          { label:'Current', value:`$${last.toFixed(4)}` },
          { label:'Change', value:`${isUp?'+':''}${change}%`, color:isUp?'#26a69a':'#ef5350' },
          { label:'Ticks', value:prices.length },
        ].map(s => (
          <div key={s.label} style={{ flex:1, border:'1px solid #e5e5e5', borderRadius:8, padding:'14px 16px' }}>
            <div style={{ fontSize:11, color:'#999', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>{s.label}</div>
            <div style={{ fontWeight:700, color:s.color||'#333', fontSize:16 }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Tutorials Tab ─── */
function TutorialsTab() {
  const items = [
    { title:'Getting Started with Dollar Printer Bot', dur:'5 min', level:'Beginner', icon:'🎓' },
    { title:'Understanding Win Probability & Payout Ratio', dur:'8 min', level:'Intermediate', icon:'📊' },
    { title:'Building Your First Trading Strategy', dur:'12 min', level:'Beginner', icon:'🔧' },
    { title:'Risk Management Best Practices', dur:'10 min', level:'Advanced', icon:'🛡️' },
    { title:'Reading Market Volatility Signals', dur:'15 min', level:'Intermediate', icon:'📈' },
    { title:'Optimizing Your Bot Parameters', dur:'20 min', level:'Advanced', icon:'⚙️' },
  ];
  return (
    <div style={{ flex:1, padding:32, overflowY:'auto' }}>
      <h2 style={{ fontSize:20, fontWeight:700, color:'#333', marginBottom:6 }}>Tutorials</h2>
      <p style={{ color:'#999', fontSize:13, marginBottom:28 }}>Learn how to build and optimize your trading bots.</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
        {items.map((item, i) => (
          <div key={i} style={{ border:'1px solid #e5e5e5', borderRadius:8, padding:20, cursor:'pointer', transition:'box-shadow 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.1)'}
            onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}
          >
            <div style={{ fontSize:32, marginBottom:12 }}>{item.icon}</div>
            <div style={{ fontWeight:700, fontSize:14, color:'#333', marginBottom:8, lineHeight:1.4 }}>{item.title}</div>
            <div style={{ display:'flex', gap:8 }}>
              <span style={{ fontSize:11, background:'#f0f0f0', color:'#666', padding:'2px 8px', borderRadius:10 }}>{item.dur}</span>
              <span style={{ fontSize:11, background: item.level==='Beginner'?'#e8f5e9':item.level==='Advanced'?'#fce4e4':'#fff8e1',
                color:item.level==='Beginner'?'#2e7d32':item.level==='Advanced'?'#c62828':'#f57c00',
                padding:'2px 8px', borderRadius:10 }}>{item.level}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Free Bots Tab ─── */
function FreeBotsTab({ user, onLogin }) {
  const bots = [
    { name:'Martingale Bot', desc:'Doubles stake after each loss to recover losses', win:'55%', risk:'High', tags:['Popular'] },
    { name:'D\'Alembert Bot', desc:'Increases stake by 1 unit after loss, decreases by 1 after win', win:'52%', risk:'Medium', tags:['Balanced'] },
    { name:'Fibonacci Bot', desc:'Follows Fibonacci sequence for stake sizing', win:'50%', risk:'Medium', tags:['Mathematical'] },
    { name:'RSI Bot', desc:'Trades based on RSI overbought/oversold signals', win:'58%', risk:'Low', tags:['Technical'] },
  ];
  return (
    <div style={{ flex:1, padding:32, overflowY:'auto' }}>
      <h2 style={{ fontSize:20, fontWeight:700, color:'#333', marginBottom:6 }}>Free Bots</h2>
      <p style={{ color:'#999', fontSize:13, marginBottom:28 }}>Choose from our library of pre-built bot strategies.</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:16 }}>
        {bots.map((bot, i) => (
          <div key={i} style={{ border:'1px solid #e5e5e5', borderRadius:8, padding:24 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div style={{ fontWeight:700, fontSize:15, color:'#333' }}>{bot.name}</div>
              <div style={{ display:'flex', gap:4 }}>
                {bot.tags.map(t => (
                  <span key={t} style={{ fontSize:11, background:'#fff3e0', color:'#f57c00', padding:'2px 8px', borderRadius:10, fontWeight:600 }}>{t}</span>
                ))}
              </div>
            </div>
            <p style={{ fontSize:13, color:'#666', marginBottom:16, lineHeight:1.5 }}>{bot.desc}</p>
            <div style={{ display:'flex', gap:16, marginBottom:16 }}>
              <div>
                <div style={{ fontSize:11, color:'#999', marginBottom:2 }}>WIN RATE</div>
                <div style={{ fontWeight:700, color:'#26a69a' }}>{bot.win}</div>
              </div>
              <div>
                <div style={{ fontSize:11, color:'#999', marginBottom:2 }}>RISK</div>
                <div style={{ fontWeight:700, color:bot.risk==='High'?'#ff444f':bot.risk==='Medium'?'#f57c00':'#26a69a' }}>{bot.risk}</div>
              </div>
            </div>
            <button onClick={() => user ? null : onLogin()} style={{
              width:'100%', padding:'9px', background:'#ff444f', color:'#fff',
              border:'none', borderRadius:4, fontWeight:700, fontSize:13, cursor:'pointer',
            }}>
              {user ? 'Load Bot' : 'Log in to use'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Analysis Tab ─── */
function AnalysisTab() {
  const [trades, setTrades] = useState([]);
  useEffect(() => { api.get('/trades').then(r => setTrades(r.data)).catch(()=>{}); }, []);

  const wins = trades.filter(t=>t.result==='win').length;
  const losses = trades.filter(t=>t.result==='loss').length;
  const winRate = trades.length ? (wins/trades.length*100).toFixed(1) : '0.0';
  const totalPL = trades.reduce((s,t)=>s+t.profitLoss, 0);
  const totalStake = trades.reduce((s,t)=>s+t.stake, 0);

  return (
    <div style={{ flex:1, padding:32, overflowY:'auto' }}>
      <h2 style={{ fontSize:20, fontWeight:700, color:'#333', marginBottom:6 }}>Analysis Tool</h2>
      <p style={{ color:'#999', fontSize:13, marginBottom:28 }}>Performance analytics for your trading activity.</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:16, marginBottom:28 }}>
        {[
          { label:'Total Trades', value:trades.length, color:'#333' },
          { label:'Win Rate', value:`${winRate}%`, color:Number(winRate)>=50?'#26a69a':'#ef5350' },
          { label:'Wins', value:wins, color:'#26a69a' },
          { label:'Losses', value:losses, color:'#ef5350' },
          { label:'Net P/L', value:`${totalPL>=0?'+':''}$${totalPL.toFixed(2)}`, color:totalPL>=0?'#26a69a':'#ef5350' },
        ].map(s => (
          <div key={s.label} style={{ border:'1px solid #e5e5e5', borderRadius:8, padding:'20px 16px', textAlign:'center' }}>
            <div style={{ fontSize:11, color:'#999', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>{s.label}</div>
            <div style={{ fontWeight:700, fontSize:22, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {trades.length > 0 && (
        <div style={{ border:'1px solid #e5e5e5', borderRadius:8, overflow:'hidden' }}>
          <div style={{ padding:'12px 16px', background:'#f9f9f9', borderBottom:'1px solid #e5e5e5', fontWeight:600, fontSize:13, color:'#333' }}>
            Trade History
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ background:'#f9f9f9' }}>
                {['ID','Direction','Stake','Result','P/L','Time'].map(h=>(
                  <th key={h} style={{ padding:'8px 16px', textAlign:'left', color:'#999', fontSize:11, textTransform:'uppercase', borderBottom:'1px solid #e5e5e5' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trades.slice(0, 20).map(t=>(
                <tr key={t._id} style={{ borderBottom:'1px solid #f0f0f0' }}>
                  <td style={{ padding:'10px 16px', color:'#999', fontFamily:'monospace', fontSize:11 }}>{String(t._id).slice(-6).toUpperCase()}</td>
                  <td style={{ padding:'10px 16px', color:t.direction==='up'?'#26a69a':'#ef5350', fontWeight:600 }}>{t.direction==='up'?'▲ Rise':'▼ Fall'}</td>
                  <td style={{ padding:'10px 16px' }}>${t.stake.toFixed(2)}</td>
                  <td style={{ padding:'10px 16px' }}>
                    <span style={{ padding:'2px 8px', borderRadius:10, fontSize:11, fontWeight:700, background:t.result==='win'?'#e8f5e9':'#fce4e4', color:t.result==='win'?'#2e7d32':'#c62828' }}>
                      {t.result.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding:'10px 16px', color:t.profitLoss>=0?'#26a69a':'#ef5350', fontWeight:600 }}>
                    {t.profitLoss>=0?'+':''}${t.profitLoss.toFixed(2)}
                  </td>
                  <td style={{ padding:'10px 16px', color:'#999', fontSize:12 }}>{new Date(t.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {trades.length === 0 && (
        <div style={{ textAlign:'center', padding:'60px 20px', color:'#999' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📊</div>
          <div style={{ fontSize:15, fontWeight:600, marginBottom:6, color:'#666' }}>No trading data yet</div>
          <div style={{ fontSize:13 }}>Run your bot to start collecting analytics.</div>
        </div>
      )}
    </div>
  );
}

/* ─── Right Welcome Panel ─── */
function WelcomePanel({ onClose }) {
  const faqs = [
    'What is Dollar Printer Bot?',
    'Where do I find the blocks I need?',
    'How do I set a loss/profit threshold?',
    'How do I run the bot on multiple markets?',
    'How do I save my bot?',
  ];
  return (
    <div style={{
      width:300, flexShrink:0, background:'#fff',
      borderLeft:'1px solid #e5e5e5', overflowY:'auto',
      display:'flex', flexDirection:'column',
    }}>
      <div style={{ padding:'16px 20px', borderBottom:'1px solid #e5e5e5', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontWeight:700, fontSize:16, color:'#333' }}>Welcome to Deriv Bot!</span>
        <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#999', lineHeight:1 }}>×</button>
      </div>
      <div style={{ padding:20, fontSize:13, color:'#666', lineHeight:1.7, borderBottom:'1px solid #e5e5e5' }}>
        Ready to automate your trading strategy without writing any code? You've come to the right place.
        Check out these guides and FAQs to learn more about building your bot:
      </div>
      <div style={{ padding:'16px 20px', borderBottom:'1px solid #e5e5e5' }}>
        <div style={{ fontWeight:700, fontSize:15, color:'#333', marginBottom:10 }}>Guide</div>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', border:'1px solid #e5e5e5', borderRadius:8, cursor:'pointer' }}
          onMouseEnter={e=>e.currentTarget.style.background='#f9f9f9'}
          onMouseLeave={e=>e.currentTarget.style.background='#fff'}
        >
          <span style={{ fontSize:20 }}>🤖</span>
          <div>
            <div style={{ fontWeight:600, fontSize:13, color:'#333' }}>Dollar Printer Bot</div>
            <div style={{ fontSize:12, color:'#999' }}>your automated trading partner</div>
          </div>
        </div>
      </div>
      <div style={{ padding:'16px 20px' }}>
        <div style={{ fontWeight:700, fontSize:15, color:'#333', marginBottom:12 }}>FAQs</div>
        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {faqs.map((q, i) => (
            <div key={i} style={{ padding:'10px 0', borderBottom:'1px solid #f0f0f0', cursor:'pointer', fontSize:13, color:'#444', display:'flex', justifyContent:'space-between', alignItems:'center' }}
              onMouseEnter={e=>e.currentTarget.style.color='#ff444f'}
              onMouseLeave={e=>e.currentTarget.style.color='#444'}
            >
              {q}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink:0 }}><path d="M9 18l6-6-6-6"/></svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Bottom Status Bar ─── */
function StatusBar() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toISOString().replace('T',' ').slice(0,19) + ' GMT');
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);

  const leftIcons = ['💬','📎','😊','🔔'];
  const rightIcons = ['☀️','❓','⚙️','🌐'];

  return (
    <div style={{
      height:40, background:'#f9f9f9', borderTop:'1px solid #e5e5e5',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 16px', flexShrink:0,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        {leftIcons.map((ic, i) => (
          <button key={i} style={{ background:'none', border:'none', fontSize:14, cursor:'pointer', opacity:0.6, padding:'0 2px' }}>{ic}</button>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#26a69a' }} />
        <span style={{ fontSize:12, color:'#666' }}>{time}</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {rightIcons.map((ic, i) => (
          <button key={i} style={{ background:'none', border:'none', fontSize:14, cursor:'pointer', opacity:0.6, padding:'0 2px' }}>{ic}</button>
        ))}
        <div style={{ display:'flex', alignItems:'center', gap:4, padding:'2px 8px', border:'1px solid #e5e5e5', borderRadius:4, cursor:'pointer' }}>
          <span style={{ fontSize:13 }}>🇬🇧</span>
          <span style={{ fontSize:12, color:'#333', fontWeight:600 }}>EN</span>
        </div>
        <button style={{ background:'none', border:'1px solid #e5e5e5', borderRadius:4, padding:'3px 6px', cursor:'pointer', fontSize:12, color:'#666' }}>⛶</button>
      </div>
    </div>
  );
}

/* ─── Main App ─── */
export default function App() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [botRunning, setBotRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ username: localStorage.getItem('username'), role: localStorage.getItem('role') });
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [bRes, sRes] = await Promise.all([api.get('/balance'), api.get('/bot-status')]);
      setBalance(bRes.data.amount);
      setBotRunning(sRes.data.running);
    } catch {}
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchData();
    const iv = setInterval(fetchData, 5000);
    return () => clearInterval(iv);
  }, [user, fetchData]);

  const handleLogin = (data) => {
    setUser({ username: data.username, role: data.role });
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setBalance(null);
    setBotRunning(false);
  };

  const handleStartBot = async (params) => {
    await api.post('/run-bot', params);
    setBotRunning(true);
    setTimeout(fetchData, 1500);
  };

  const handleStopBot = async () => {
    try { await api.post('/stop-bot'); } catch {}
    setBotRunning(false);
  };

  const openLogin = () => { setShowSignup(false); setShowLogin(true); };
  const openSignup = () => { setShowLogin(false); setShowSignup(true); };

  if (!mounted) return null;

  const renderTab = () => {
    switch (activeTab) {
      case 'botbuilder': return <BotBuilderTab user={user} onLogin={openLogin} botRunning={botRunning} onStartBot={handleStartBot} onStopBot={handleStopBot} />;
      case 'charts': return <ChartsTab botRunning={botRunning} />;
      case 'tutorials': return <TutorialsTab />;
      case 'freebots': return <FreeBotsTab user={user} onLogin={openLogin} />;
      case 'analysis': return <AnalysisTab />;
      default: return <DashboardTab user={user} onLogin={openLogin} onBotStart={handleStartBot} botRunning={botRunning} />;
    }
  };

  return (
    <>
      <Head>
        <title>Dollar Printer — Bot Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:'#fff' }}>
        <TopBar user={user} onLogin={openLogin} onSignup={openSignup} onLogout={handleLogout} />
        <TabBar
          activeTab={activeTab} setActiveTab={setActiveTab}
          botRunning={botRunning} onRunBot={() => { if(!user){openLogin();return;} setActiveTab('botbuilder'); }}
          onStopBot={handleStopBot}
          balance={user ? balance : null}
        />
        <div style={{ flex:1, display:'flex', overflow:'hidden', background:'#fff' }}>
          {renderTab()}
          {showWelcome && <WelcomePanel onClose={() => setShowWelcome(false)} />}
        </div>
        <StatusBar />
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={handleLogin} switchToRegister={openSignup} />}
      {showSignup && <SignupModal onClose={() => setShowSignup(false)} onSuccess={handleLogin} switchToLogin={openLogin} />}
    </>
  );
}
