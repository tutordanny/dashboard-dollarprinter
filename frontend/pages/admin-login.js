import { useState } from 'react';
import Head from 'next/head';
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
    setLoading(true); setError('');
    try {
      const res = await api.post('/login', { username, password });
      if (res.data.role !== 'admin') {
        setError('Access denied. Admin credentials required.');
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
    <>
      <Head><title>Admin Login — Dollar Printer</title></Head>
      <div style={{
        minHeight:'100vh', background:'#f5f5f5',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        <div style={{ width:'100%', maxWidth:420, padding:'0 20px' }}>
          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <div style={{ width:36, height:36, background:'#000', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>💵</div>
              <span style={{ fontWeight:700, fontSize:18, color:'#333' }}>Dollar Printers</span>
            </div>
            <div style={{ fontSize:22, fontWeight:700, color:'#333', marginBottom:6 }}>Admin Panel Login</div>
            <div style={{ fontSize:13, color:'#999' }}>Restricted access — authorised personnel only</div>
          </div>

          {/* Card */}
          <div style={{ background:'#fff', borderRadius:8, padding:32, boxShadow:'0 2px 16px rgba(0,0,0,0.08)', border:'1px solid #e5e5e5' }}>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom:18 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#555', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                  Username
                </label>
                <input
                  style={{ width:'100%', border:'1px solid #d6d6d6', borderRadius:4, padding:'10px 14px', fontSize:14, outline:'none', color:'#333', fontFamily:'inherit' }}
                  onFocus={e=>e.target.style.borderColor='#ff444f'}
                  onBlur={e=>e.target.style.borderColor='#d6d6d6'}
                  type="text" value={username} onChange={e=>setUsername(e.target.value)}
                  placeholder="Enter admin username" autoComplete="username" required
                />
              </div>
              <div style={{ marginBottom:24 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:700, color:'#555', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                  Password
                </label>
                <input
                  style={{ width:'100%', border:'1px solid #d6d6d6', borderRadius:4, padding:'10px 14px', fontSize:14, outline:'none', color:'#333', fontFamily:'inherit' }}
                  onFocus={e=>e.target.style.borderColor='#ff444f'}
                  onBlur={e=>e.target.style.borderColor='#d6d6d6'}
                  type="password" value={password} onChange={e=>setPassword(e.target.value)}
                  placeholder="Enter admin password" autoComplete="current-password" required
                />
              </div>

              {error && (
                <div style={{ background:'#fff3f3', border:'1px solid #ffd5d5', borderRadius:4, padding:'10px 14px', color:'#cc0000', fontSize:13, marginBottom:16 }}>
                  ⚠️ {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width:'100%', padding:'12px', background:'#ff444f', color:'#fff',
                border:'none', borderRadius:4, fontWeight:700, fontSize:15,
                cursor:loading?'not-allowed':'pointer', opacity:loading?0.7:1, fontFamily:'inherit',
              }}>
                {loading ? 'Signing in...' : 'Sign in to Admin Panel'}
              </button>
            </form>

            <div style={{ marginTop:20, paddingTop:20, borderTop:'1px solid #f0f0f0', textAlign:'center' }}>
              <a href="/" style={{ fontSize:13, color:'#999', textDecoration:'none' }}>← Back to Dashboard</a>
            </div>
          </div>

          <div style={{ textAlign:'center', marginTop:16, fontSize:12, color:'#bbb' }}>
            Default: lightspeed / Thunes2020!
          </div>
        </div>
      </div>
    </>
  );
}
