export default function TopBar({ balance, botRunning, onStart, onStop, username }) {
  return (
    <div style={{
      height: '64px',
      background: '#111827',
      borderBottom: '1px solid #1e2d45',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Balance</span>
          <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#4ade80' }}>
            ${typeof balance === 'number' ? balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: botRunning ? '#22c55e' : '#64748b',
            boxShadow: botRunning ? '0 0 8px #22c55e' : 'none',
          }} />
          <span style={{ fontSize: '0.8rem', color: botRunning ? '#22c55e' : '#64748b' }}>
            Bot {botRunning ? 'Running' : 'Idle'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {username && (
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>👤 {username}</span>
        )}
        <button
          className="btn-primary"
          onClick={onStart}
          disabled={botRunning}
          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
        >
          ▶ Start Bot
        </button>
        <button
          className="btn-danger"
          onClick={onStop}
          disabled={!botRunning}
          style={{ padding: '8px 16px', fontSize: '0.85rem', opacity: !botRunning ? 0.4 : 1 }}
        >
          ■ Stop Bot
        </button>
      </div>
    </div>
  );
}
