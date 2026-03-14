export default function TradeLog({ trades }) {
  if (!trades || trades.length === 0) {
    return (
      <div className="card">
        <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
          📋 Trade Log
        </div>
        <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
          No trades yet. Start the bot to begin trading.
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
        📋 Trade Log ({trades.length})
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr>
              {['Trade ID', 'Direction', 'Stake', 'Result', 'Profit / Loss', 'Time'].map((h) => (
                <th key={h} style={{
                  textAlign: 'left',
                  padding: '8px 12px',
                  borderBottom: '1px solid #1e2d45',
                  color: '#64748b',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((t) => (
              <tr key={t._id} style={{ borderBottom: '1px solid #1a2235' }}>
                <td style={{ padding: '12px', color: '#22d3ee', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {String(t._id).slice(-8).toUpperCase()}
                </td>
                <td style={{ padding: '12px', color: t.direction === 'up' ? '#4ade80' : '#f87171' }}>
                  {t.direction === 'up' ? '▲ Up' : '▼ Down'}
                </td>
                <td style={{ padding: '12px', color: '#e2e8f0' }}>${t.stake.toFixed(2)}</td>
                <td style={{ padding: '12px' }}>
                  <span className={t.result === 'win' ? 'badge-win' : 'badge-loss'}>
                    {t.result === 'win' ? 'WIN' : 'LOSS'}
                  </span>
                </td>
                <td style={{ padding: '12px', color: t.profitLoss >= 0 ? '#4ade80' : '#f87171', fontWeight: 600 }}>
                  {t.profitLoss >= 0 ? '+' : ''}${t.profitLoss.toFixed(2)}
                </td>
                <td style={{ padding: '12px', color: '#64748b', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                  {new Date(t.timestamp).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
