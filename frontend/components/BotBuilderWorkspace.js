import { useState, useRef, useCallback } from 'react';
import api from '../utils/api';

/* ─── Block shape constants (Blockly-like) ─── */
const TAB_W = 15, TAB_H = 10, TAB_X = 22, R = 4;

function blockPath(w, h, { hasPrev = true, hasNext = true } = {}) {
  const topY = hasPrev ? TAB_H : 0;
  let d = `M ${R} ${topY}`;
  if (hasPrev) {
    d += ` H ${TAB_X} l 5,-${TAB_H} h ${TAB_W} l 5,${TAB_H}`;
  }
  d += ` H ${w - R} q ${R},0 ${R},${R}`;
  d += ` V ${topY + h - R} q 0,${R} -${R},${R}`;
  if (hasNext) {
    d += ` H ${TAB_X + TAB_W + 10} l -5,${TAB_H} h -${TAB_W} l -5,-${TAB_H}`;
  }
  d += ` H ${R} q -${R},0 -${R},-${R}`;
  d += ` V ${topY + R} q 0,-${R} ${R},-${R} Z`;
  return d;
}

function containerPath(w, innerH, headerH, { hasPrev = true, hasNext = true } = {}) {
  const ARM_W = 28;
  const TAB_IN_X = 22 + ARM_W;
  const topY = hasPrev ? TAB_H : 0;
  const totalH = headerH + innerH + 20;
  let d = `M ${R} ${topY}`;
  if (hasPrev) {
    d += ` H ${TAB_X} l 5,-${TAB_H} h ${TAB_W} l 5,${TAB_H}`;
  }
  d += ` H ${w - R} q ${R},0 ${R},${R}`;
  d += ` V ${topY + headerH - R} q 0,${R} -${R},${R}`;
  d += ` H ${ARM_W + R} q -${R},0 -${R},${R}`;
  d += ` V ${topY + headerH + innerH + 10 - R} q 0,${R} ${R},${R}`;
  d += ` H ${TAB_IN_X} l 5,${TAB_H} h ${TAB_W} l 5,-${TAB_H}`;
  d += ` H ${w - R} q ${R},0 ${R},${R}`;
  d += ` V ${topY + totalH - R} q 0,${R} -${R},${R}`;
  if (hasNext) {
    d += ` H ${TAB_X + TAB_W + 10} l -5,${TAB_H} h -${TAB_W} l -5,-${TAB_H}`;
  }
  d += ` H ${R} q -${R},0 -${R},-${R}`;
  d += ` V ${topY + R} q 0,-${R} ${R},-${R} Z`;
  return d;
}

/* ─── Value input pill (horizontal connector) ─── */
function valuePath(w, h) {
  return `M ${R} 0 H ${w - R} q ${R},0 ${R},${R} V ${h - R} q 0,${R} -${R},${R} H ${R} q -${R},0 -${R},-${R} V ${R} q 0,-${R} ${R},-${R} Z`;
}

/* ─── Field (inline value block) ─── */
function Field({ label, value, color, w = 90 }) {
  const h = 24;
  return (
    <svg width={w} height={h} style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 4 }}>
      <path d={valuePath(w, h)} fill={color} />
      <text x={w / 2} y={h / 2 + 1} textAnchor="middle" dominantBaseline="middle"
        fill="#fff" fontSize="11" fontFamily="sans-serif" fontWeight="600">{value}</text>
    </svg>
  );
}

/* ─── Dropdown field ─── */
function DropField({ value, color, w = 130 }) {
  const h = 24;
  return (
    <svg width={w} height={h} style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: 4 }}>
      <path d={valuePath(w, h)} fill={color} />
      <text x={(w - 12) / 2} y={h / 2 + 1} textAnchor="middle" dominantBaseline="middle"
        fill="#fff" fontSize="11" fontFamily="sans-serif" fontWeight="600">{value}</text>
      <text x={w - 12} y={h / 2 + 1} textAnchor="middle" dominantBaseline="middle"
        fill="rgba(255,255,255,0.8)" fontSize="9">▼</text>
    </svg>
  );
}

/* ─── A standalone statement block ─── */
function StmtBlock({ color, darkColor, label, children, w = 320, hasPrev = true, hasNext = true, extraH = 0 }) {
  const HEADER_H = 32;
  const CONTENT_H = children ? (Array.isArray(children) ? children.length * 30 : 30) + extraH : 0;
  const h = HEADER_H + CONTENT_H;
  const topY = hasPrev ? TAB_H : 0;
  return (
    <div style={{ position: 'relative', marginTop: hasPrev ? 0 : 0 }}>
      <svg width={w} height={h + topY + (hasNext ? TAB_H : 0)} style={{ display: 'block', overflow: 'visible' }}>
        <path d={blockPath(w, h, { hasPrev, hasNext })} fill={color} />
        <rect x={0} y={topY} width={w} height={HEADER_H} rx={R} ry={R} fill={darkColor} />
        {/* top round fix */}
        <rect x={0} y={topY + HEADER_H - R} width={w} height={R} fill={darkColor} />
        <text x={10} y={topY + HEADER_H / 2 + 1} dominantBaseline="middle"
          fill="#fff" fontSize="12" fontFamily="sans-serif" fontWeight="700">{label}</text>
      </svg>
      {/* Overlay content rows */}
      {children && (
        <div style={{
          position: 'absolute',
          top: topY + HEADER_H + 2,
          left: 8,
          right: 8,
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Content row inside a block ─── */
function Row({ label, children, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      marginBottom: 4, minHeight: 26,
    }}>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', minWidth: 90, fontFamily: 'sans-serif', fontWeight: 500 }}>{label}</span>
      {children}
    </div>
  );
}

/* ─── Toolbox categories ─── */
const CATEGORIES = [
  { id: 'quick', label: 'Quick Strategy', color: '#4A90D9', icon: '⚡' },
  { id: 'trade', label: 'Trade parameters', color: '#FF6600', icon: '⬡' },
  { id: 'analysis', label: 'Analysis', color: '#00897B', icon: '⬡' },
  { id: 'binary', label: 'Binary Bot blocks', color: '#7B68EE', icon: '⬡' },
  { id: 'indicators', label: 'Indicators', color: '#E74C3C', icon: '⬡' },
  { id: 'candle', label: 'Candle', color: '#27AE60', icon: '⬡' },
  { id: 'tick', label: 'Tick', color: '#2980B9', icon: '⬡' },
  { id: 'math', label: 'Math', color: '#5CA65C', icon: '⬡' },
  { id: 'text', label: 'Text', color: '#5CA5A5', icon: '⬡' },
  { id: 'lists', label: 'Lists', color: '#745BA7', icon: '⬡' },
  { id: 'logic', label: 'Logic', color: '#5BC0DE', icon: '⬡' },
  { id: 'loops', label: 'Loops', color: '#F0A23C', icon: '⬡' },
  { id: 'variables', label: 'Variables', color: '#FF8C00', icon: '⬡' },
  { id: 'functions', label: 'Functions', color: '#DAA520', icon: '⬡' },
];

/* ─── Sub-blocks in toolbox (flyout) ─── */
const CATEGORY_BLOCKS = {
  quick: [
    { label: 'Martingale', desc: 'Double after loss' },
    { label: "D'Alembert", desc: '+1 after loss, -1 after win' },
    { label: 'Fibonacci', desc: 'Fibonacci stake sizing' },
    { label: 'Oscar\'s Grind', desc: 'Conservative progression' },
  ],
  trade: [
    { label: 'Trade parameters', desc: 'Set market, type, amount, duration' },
    { label: 'Purchase', desc: 'Buy a contract' },
    { label: 'Sell at tick', desc: 'Sell the contract' },
    { label: 'After purchase', desc: 'Trade options post-purchase' },
  ],
  analysis: [
    { label: 'Read tick', desc: 'Read current tick price' },
    { label: 'Tick history', desc: 'Historical tick data' },
    { label: 'Current tick', desc: 'Current tick value' },
    { label: 'Previous tick', desc: 'Previous tick value' },
  ],
  binary: [
    { label: 'Run', desc: 'Entry point block' },
    { label: 'Trade again', desc: 'Restart trade loop' },
    { label: 'Tick count', desc: 'Number of ticks' },
    { label: 'Balance', desc: 'Account balance' },
  ],
  indicators: [
    { label: 'Moving Average', desc: 'SMA/EMA indicator' },
    { label: 'RSI', desc: 'Relative strength index' },
    { label: 'Bollinger Bands', desc: 'BB upper/lower/mid' },
    { label: 'MACD', desc: 'MACD line/signal' },
  ],
  math: [
    { label: 'Arithmetic', desc: '+ - × ÷' },
    { label: 'Remainder', desc: 'x mod y' },
    { label: 'Random integer', desc: 'Random number' },
    { label: 'Round', desc: 'Round to nearest' },
  ],
  logic: [
    { label: 'If / else', desc: 'Conditional logic' },
    { label: 'Comparison', desc: '< > = ≠' },
    { label: 'And / Or', desc: 'Boolean operations' },
    { label: 'Not', desc: 'Boolean negation' },
  ],
  loops: [
    { label: 'Repeat', desc: 'Repeat N times' },
    { label: 'While', desc: 'While condition is true' },
    { label: 'For', desc: 'For i from start to end' },
    { label: 'Break', desc: 'Exit the loop' },
  ],
  variables: [
    { label: 'Set variable', desc: 'Assign value to variable' },
    { label: 'Get variable', desc: 'Read variable value' },
    { label: 'Change by', desc: 'Increment variable' },
  ],
  functions: [
    { label: 'Define function', desc: 'Create a function' },
    { label: 'Call function', desc: 'Execute a function' },
    { label: 'Return', desc: 'Return a value' },
  ],
};

/* ─── Main Bot Builder Component ─── */
export default function BotBuilderWorkspace({ user, onLogin, onStartBot, onStopBot, botRunning }) {
  const [activeCategory, setActiveCategory] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [search, setSearch] = useState('');
  const [strategy, setStrategy] = useState('riseFall');
  const [stake, setStake] = useState('1');
  const [duration, setDuration] = useState('1');
  const [direction, setDirection] = useState('Rise');
  const [market, setMarket] = useState('Volatility 100 (1s)');
  const [showQuickStrategy, setShowQuickStrategy] = useState(false);
  const workspaceRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    if (!user) { onLogin(); return; }
    setLoading(true);
    try {
      await onStartBot({
        stake: parseFloat(stake) || 1,
        direction: direction === 'Rise' ? 'up' : 'down',
        duration: parseInt(duration) || 1,
        name: `${strategy} Bot`,
      });
    } catch {}
    setLoading(false);
  };

  const filteredCategories = CATEGORIES.filter(c =>
    !search || c.label.toLowerCase().includes(search.toLowerCase())
  );

  const DARK_C = {
    orange: '#CC4E00',
    purple: '#5A4ABA',
    teal: '#006B5E',
    gray: '#37474F',
    green: '#3D7A3D',
    blue: '#1A5E8A',
    red: '#B71C1C',
    amber: '#B76E00',
  };

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', background: '#fff' }}>

      {/* ─── LEFT TOOLBOX ─── */}
      <div style={{
        width: 192, flexShrink: 0, background: '#fff',
        borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Search */}
        <div style={{ padding: '10px 8px', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search blocks..."
              style={{ width: '100%', padding: '7px 8px 7px 28px', border: '1px solid #ddd', borderRadius: 4, fontSize: 12, outline: 'none', color: '#333' }}
            />
          </div>
        </div>

        {/* Categories */}
        {filteredCategories.map(cat => (
          <div key={cat.id}>
            <div
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 12px', cursor: 'pointer',
                background: activeCategory === cat.id ? `${cat.color}18` : 'transparent',
                borderLeft: activeCategory === cat.id ? `4px solid ${cat.color}` : '4px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (activeCategory !== cat.id) e.currentTarget.style.background = '#f5f5f5'; }}
              onMouseLeave={e => { if (activeCategory !== cat.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ width: 14, height: 14, borderRadius: 3, background: cat.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: activeCategory === cat.id ? cat.color : '#444', fontWeight: activeCategory === cat.id ? 700 : 500, lineHeight: 1.3 }}>
                {cat.label}
              </span>
            </div>

            {/* Expanded flyout */}
            {activeCategory === cat.id && CATEGORY_BLOCKS[cat.id] && (
              <div style={{ background: '#fafafa', borderLeft: `4px solid ${cat.color}`, paddingBottom: 4 }}>
                {CATEGORY_BLOCKS[cat.id].map((b, i) => (
                  <div key={i} style={{ padding: '6px 12px', cursor: 'grab', borderBottom: '1px solid #f0f0f0' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 28, height: 14, background: cat.color, borderRadius: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#333' }}>{b.label}</span>
                    </div>
                    <div style={{ fontSize: 10, color: '#999', marginTop: 2, paddingLeft: 34 }}>{b.desc}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ─── MAIN WORKSPACE ─── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

        {/* Workspace toolbar */}
        <div style={{
          height: 40, background: '#fff', borderBottom: '1px solid #e0e0e0',
          display: 'flex', alignItems: 'center', gap: 4, padding: '0 12px',
          flexShrink: 0,
        }}>
          {[
            { label: '↩', title: 'Undo (Ctrl+Z)' },
            { label: '↪', title: 'Redo (Ctrl+Y)' },
          ].map(b => (
            <button key={b.label} title={b.title} style={{
              width: 28, height: 28, border: '1px solid #e0e0e0', borderRadius: 4,
              background: '#fff', cursor: 'pointer', fontSize: 14, color: '#666',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{b.label}</button>
          ))}
          <div style={{ width: 1, height: 20, background: '#e0e0e0', margin: '0 4px' }} />

          {/* Quick strategy selector */}
          <button onClick={() => setShowQuickStrategy(!showQuickStrategy)} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px',
            border: '1px solid #e0e0e0', borderRadius: 4, background: '#fff',
            cursor: 'pointer', fontSize: 12, color: '#333', fontWeight: 600,
          }}>
            ⚡ Quick Strategy
          </button>

          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: '#999' }}>
            {botRunning ? '● Bot is running' : '○ Bot is not running'}
          </span>
        </div>

        {/* Quick strategy panel */}
        {showQuickStrategy && (
          <div style={{
            position: 'absolute', top: 40, left: 200, zIndex: 20,
            background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8,
            boxShadow: '0 4px 24px rgba(0,0,0,0.12)', width: 380, padding: 20,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#333' }}>⚡ Quick Strategy</span>
              <button onClick={() => setShowQuickStrategy(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#999' }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {['Rise/Fall', 'Even/Odd', 'Over/Under', 'Matches/Differs'].map(s => (
                <button key={s} onClick={() => setStrategy(s)} style={{
                  padding: '8px 12px', border: `1px solid ${strategy === s ? '#ff444f' : '#e0e0e0'}`,
                  borderRadius: 6, background: strategy === s ? '#fff5f5' : '#fff',
                  color: strategy === s ? '#ff444f' : '#333', fontWeight: strategy === s ? 700 : 400,
                  cursor: 'pointer', fontSize: 12,
                }}>{s}</button>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Initial stake ($)</label>
                <input type="number" value={stake} onChange={e => setStake(e.target.value)}
                  style={{ width: '100%', border: '1px solid #ddd', borderRadius: 4, padding: '8px 10px', fontSize: 13, outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Duration (ticks)</label>
                <input type="number" value={duration} onChange={e => setDuration(e.target.value)}
                  style={{ width: '100%', border: '1px solid #ddd', borderRadius: 4, padding: '8px 10px', fontSize: 13, outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Direction</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['Rise', 'Fall'].map(d => (
                    <button key={d} onClick={() => setDirection(d)} style={{
                      flex: 1, padding: '8px', border: `1px solid ${direction === d ? (d === 'Rise' ? '#26a69a' : '#ef5350') : '#ddd'}`,
                      borderRadius: 4, background: direction === d ? (d === 'Rise' ? '#e8f5e9' : '#fce4e4') : '#fff',
                      color: direction === d ? (d === 'Rise' ? '#26a69a' : '#ef5350') : '#666',
                      fontWeight: 700, cursor: 'pointer', fontSize: 12,
                    }}>{d === 'Rise' ? '▲' : '▼'} {d}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 }}>Market</label>
                <select value={market} onChange={e => setMarket(e.target.value)}
                  style={{ width: '100%', border: '1px solid #ddd', borderRadius: 4, padding: '8px 10px', fontSize: 12, outline: 'none', background: '#fff' }}>
                  {['Volatility 100 (1s)', 'Volatility 75 (1s)', 'Volatility 50 (1s)', 'Volatility 25 (1s)', 'Volatility 10 (1s)'].map(m => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setShowQuickStrategy(false); handleRun(); }} style={{
                flex: 1, padding: '10px', background: '#ff444f', color: '#fff',
                border: 'none', borderRadius: 4, fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}>▶ Run Strategy</button>
              <button onClick={() => setShowQuickStrategy(false)} style={{
                flex: 1, padding: '10px', background: '#fff', color: '#333',
                border: '1px solid #ddd', borderRadius: 4, fontWeight: 600, fontSize: 13, cursor: 'pointer',
              }}>Apply to Workspace</button>
            </div>
          </div>
        )}

        {/* The actual workspace canvas */}
        <div
          ref={workspaceRef}
          style={{
            flex: 1, overflow: 'auto', position: 'relative', cursor: 'default',
            backgroundImage: 'radial-gradient(circle, #c8c8c8 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            backgroundColor: '#fff',
          }}
        >
          {/* Block canvas */}
          <div style={{
            transform: `scale(${zoom})`,
            transformOrigin: '0 0',
            padding: '40px 40px',
            minWidth: 900,
            minHeight: 700,
            position: 'relative',
          }}>

            {/* ─── RUN (container block) ─── */}
            <div style={{ position: 'absolute', top: 40, left: 40 }}>
              {/* Run header block */}
              <div style={{ position: 'relative', width: 360 }}>
                <svg width={360} height={52} style={{ display: 'block' }}>
                  <path d={`M ${R} 0 H ${360 - R} q ${R},0 ${R},${R} V ${52 - R} q 0,${R} -${R},${R} H ${R} q -${R},0 -${R},-${R} V ${R} q 0,-${R} ${R},-${R} Z`} fill="#607D8B" />
                  <rect x={0} y={0} width={360} height={28} rx={R} ry={R} fill="#455A64" />
                  <rect x={0} y={20} width={360} height={8} fill="#455A64" />
                  <text x={10} y={14} dominantBaseline="middle" fill="#fff" fontSize="13" fontFamily="sans-serif" fontWeight="700">Run once at start</text>
                  <text x={10} y={38} dominantBaseline="middle" fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="sans-serif">Entry point — blocks run in order</text>
                </svg>
              </div>

              {/* Inner blocks (indented) */}
              <div style={{ marginLeft: 28, marginTop: 0 }}>

                {/* ─── TRADE PARAMETERS BLOCK ─── */}
                <div style={{ position: 'relative', width: 332 }}>
                  <svg width={332} height={190 + TAB_H} style={{ display: 'block' }}>
                    <path d={blockPath(332, 190, { hasPrev: true, hasNext: true })} fill="#FF6600" />
                    <rect x={0} y={TAB_H} width={332} height={28} rx={R} ry={R} fill="#CC4E00" />
                    <rect x={0} y={TAB_H + 20} width={332} height={8} fill="#CC4E00" />
                    <text x={10} y={TAB_H + 14} dominantBaseline="middle" fill="#fff" fontSize="12" fontFamily="sans-serif" fontWeight="700">Trade parameters</text>
                  </svg>
                  {/* Row content */}
                  <div style={{ position: 'absolute', top: TAB_H + 32, left: 8, right: 8 }}>
                    {[
                      { label: 'Market', drop: market, w: 190 },
                      { label: 'Trade type', drop: 'Rise/Fall', w: 120 },
                      { label: 'Currency', drop: 'USD', w: 80 },
                      { label: 'Amount', drop: 'Fixed amount', w: 130, extra: { drop: stake, w: 60 } },
                      { label: 'Duration', drop: duration, w: 60, extra: { drop: 'Ticks', w: 80 } },
                    ].map((row, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, height: 28 }}>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', minWidth: 80, fontFamily: 'sans-serif', fontWeight: 500 }}>{row.label}</span>
                        <DropField value={row.drop} color="#CC4E00" w={row.w} />
                        {row.extra && <DropField value={row.extra.drop} color="#CC4E00" w={row.extra.w} />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ─── PURCHASE BLOCK ─── */}
                <div style={{ position: 'relative', width: 332, marginTop: -TAB_H }}>
                  <svg width={332} height={60 + TAB_H} style={{ display: 'block' }}>
                    <path d={blockPath(332, 60, { hasPrev: true, hasNext: true })} fill="#7B68EE" />
                    <rect x={0} y={TAB_H} width={332} height={28} rx={R} ry={R} fill="#5A4ABA" />
                    <rect x={0} y={TAB_H + 20} width={332} height={8} fill="#5A4ABA" />
                    <text x={10} y={TAB_H + 14} dominantBaseline="middle" fill="#fff" fontSize="12" fontFamily="sans-serif" fontWeight="700">Purchase</text>
                  </svg>
                  <div style={{ position: 'absolute', top: TAB_H + 32, left: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontFamily: 'sans-serif', fontWeight: 500 }}>Buy</span>
                      <DropField value={direction} color="#5A4ABA" w={100} />
                    </div>
                  </div>
                </div>

                {/* ─── AFTER PURCHASE BLOCK ─── */}
                <div style={{ position: 'relative', width: 332, marginTop: -TAB_H }}>
                  <svg width={332} height={62 + TAB_H} style={{ display: 'block' }}>
                    <path d={blockPath(332, 62, { hasPrev: true, hasNext: false })} fill="#00897B" />
                    <rect x={0} y={TAB_H} width={332} height={28} rx={R} ry={R} fill="#006B5E" />
                    <rect x={0} y={TAB_H + 20} width={332} height={8} fill="#006B5E" />
                    <text x={10} y={TAB_H + 14} dominantBaseline="middle" fill="#fff" fontSize="12" fontFamily="sans-serif" fontWeight="700">After purchase trade options</text>
                  </svg>
                  <div style={{ position: 'absolute', top: TAB_H + 32, left: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontFamily: 'sans-serif', fontWeight: 500 }}>Sell at tick</span>
                      <DropField value="Last tick" color="#006B5E" w={100} />
                    </div>
                  </div>
                </div>

              </div>

              {/* Run block bottom */}
              <div style={{ position: 'relative', width: 360 }}>
                <svg width={360} height={20} style={{ display: 'block' }}>
                  <path d={`M ${R} 0 H ${360 - R} q ${R},0 ${R},${R} V ${20 - R} q 0,${R} -${R},${R} H ${R} q -${R},0 -${R},-${R} V ${R} q 0,-${R} ${R},-${R} Z`} fill="#607D8B" />
                </svg>
              </div>
            </div>

            {/* ─── Variables block (separate, to the right) ─── */}
            <div style={{ position: 'absolute', top: 40, left: 440 }}>
              <div style={{ position: 'relative', width: 200 }}>
                <svg width={200} height={100 + TAB_H} style={{ display: 'block' }}>
                  <path d={blockPath(200, 100, { hasPrev: false, hasNext: false })} fill="#FF8C00" />
                  <rect x={0} y={0} width={200} height={28} rx={R} ry={R} fill="#CC6E00" />
                  <rect x={0} y={20} width={200} height={8} fill="#CC6E00" />
                  <text x={10} y={14} dominantBaseline="middle" fill="#fff" fontSize="12" fontFamily="sans-serif" fontWeight="700">Variables</text>
                </svg>
                <div style={{ position: 'absolute', top: 32, left: 8 }}>
                  {[
                    { name: 'tradeCount', val: '0' },
                    { name: 'winCount', val: '0' },
                    { name: 'lossCount', val: '0' },
                  ].map((v, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', fontFamily: 'sans-serif', minWidth: 80 }}>{v.name}</span>
                      <DropField value={v.val} color="#CC6E00" w={40} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ─── ZOOM CONTROLS ─── */}
        <div style={{
          position: 'absolute', bottom: 20, right: 20,
          display: 'flex', flexDirection: 'column', gap: 2,
          background: '#fff', border: '1px solid #e0e0e0', borderRadius: 6,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden',
        }}>
          {[
            { label: '+', action: () => setZoom(z => Math.min(2, z + 0.1)), title: 'Zoom in' },
            { label: '⊙', action: () => setZoom(1), title: 'Reset zoom' },
            { label: '−', action: () => setZoom(z => Math.max(0.4, z - 0.1)), title: 'Zoom out' },
          ].map(b => (
            <button key={b.label} onClick={b.action} title={b.title} style={{
              width: 32, height: 32, border: 'none', background: '#fff', cursor: 'pointer',
              fontSize: b.label === '⊙' ? 16 : 18, color: '#555', fontWeight: 700,
              borderBottom: b.label !== '−' ? '1px solid #f0f0f0' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{b.label}</button>
          ))}
        </div>

        {/* Run button overlay */}
        <div style={{
          position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 10,
        }}>
          <button onClick={handleRun} disabled={botRunning || loading} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 24px', background: botRunning ? '#ccc' : '#ff444f',
            color: '#fff', border: 'none', borderRadius: 4, fontWeight: 700,
            fontSize: 14, cursor: botRunning ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(255,68,79,0.4)',
          }}>
            {loading ? '...' : <><svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><polygon points="5,3 19,12 5,21"/></svg> Run</>}
          </button>
          {botRunning && (
            <button onClick={onStopBot} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 24px', background: '#fff', color: '#ff444f',
              border: '1px solid #ff444f', borderRadius: 4, fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#ff444f"><rect x="6" y="6" width="12" height="12"/></svg>
              Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
