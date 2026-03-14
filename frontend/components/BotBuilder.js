import { useState } from 'react';

export default function BotBuilder({ onStartBot, onStopBot, botRunning, loading }) {
  const [stake, setStake] = useState(10);
  const [direction, setDirection] = useState('up');
  const [duration, setDuration] = useState(5);
  const [botName, setBotName] = useState('My Bot');

  const handleStart = () => {
    onStartBot({ stake: Number(stake), direction, duration: Number(duration), name: botName });
  };

  return (
    <div className="card">
      <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
        🤖 Bot Strategy Builder
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <label className="label">Bot Name</label>
          <input
            className="input-field"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            placeholder="My Bot"
          />
        </div>
        <div>
          <label className="label">Stake ($)</label>
          <input
            className="input-field"
            type="number"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            min={1}
            step={1}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
        <div>
          <label className="label">Direction</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['up', 'down'].map((d) => (
              <button
                key={d}
                onClick={() => setDirection(d)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 8,
                  border: `1px solid ${direction === d ? (d === 'up' ? '#22c55e' : '#ef4444') : '#1e2d45'}`,
                  background: direction === d ? (d === 'up' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)') : '#1a2235',
                  color: direction === d ? (d === 'up' ? '#4ade80' : '#f87171') : '#64748b',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  transition: 'all 0.2s',
                }}
              >
                {d === 'up' ? '▲ Up' : '▼ Down'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Duration (seconds)</label>
          <input
            className="input-field"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min={2}
            max={60}
            step={1}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="btn-primary"
          onClick={handleStart}
          disabled={botRunning || loading}
          style={{ flex: 1 }}
        >
          {loading ? 'Starting...' : '▶ Start Bot'}
        </button>
        <button
          className="btn-danger"
          onClick={onStopBot}
          disabled={!botRunning || loading}
          style={{ flex: 1, opacity: !botRunning ? 0.4 : 1 }}
        >
          ■ Stop Bot
        </button>
      </div>

      <div style={{ marginTop: 14, padding: '10px 14px', background: '#1a2235', borderRadius: 8, fontSize: '0.8rem', color: '#64748b' }}>
        <strong style={{ color: '#94a3b8' }}>Strategy:</strong> Place ${stake} {direction === 'up' ? '▲' : '▼'} every {duration}s automatically
      </div>
    </div>
  );
}
