import { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '../utils/api';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

export default function ChartPanel({ botRunning }) {
  const [prices, setPrices] = useState([]);
  const intervalRef = useRef(null);

  const loadHistory = async () => {
    try {
      const res = await api.get('/price-history');
      setPrices(res.data);
    } catch {
      const mock = Array.from({ length: 60 }, (_, i) => 1000 + Math.sin(i * 0.3) * 50 + Math.random() * 20);
      setPrices(mock);
    }
  };

  const addTick = () => {
    setPrices((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      const change = (Math.random() - 0.5) * 2 * 0.5 * last * 0.01;
      const next = Math.max(0.01, last + change);
      return [...prev.slice(-79), next];
    });
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (botRunning) {
      intervalRef.current = setInterval(addTick, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [botRunning]);

  const labels = prices.map((_, i) => '');
  const last = prices[prices.length - 1] || 0;
  const first = prices[0] || 0;
  const isUp = last >= first;

  const data = {
    labels,
    datasets: [{
      data: prices,
      borderColor: isUp ? '#22c55e' : '#ef4444',
      backgroundColor: isUp ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4,
      fill: true,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    scales: {
      x: { display: false },
      y: {
        grid: { color: '#1e2d45' },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111827',
        borderColor: '#1e2d45',
        borderWidth: 1,
        titleColor: '#64748b',
        bodyColor: '#22d3ee',
        callbacks: {
          label: (ctx) => ` $${ctx.parsed.y.toFixed(4)}`,
        },
      },
    },
  };

  return (
    <div className="card" style={{ height: '280px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Simulated Price</div>
          <div style={{ fontWeight: 700, fontSize: '1.4rem', color: isUp ? '#4ade80' : '#f87171' }}>
            ${last.toFixed(4)}
            <span style={{ fontSize: '0.8rem', marginLeft: 8, color: '#64748b' }}>
              {isUp ? '▲' : '▼'} {Math.abs(((last - first) / first) * 100).toFixed(2)}%
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['1m', '5m', '15m', '1h'].map((t) => (
            <button key={t} style={{
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid #1e2d45',
              background: t === '1m' ? '#1a2235' : 'transparent',
              color: t === '1m' ? '#22d3ee' : '#64748b',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1 }}>
        {prices.length > 0 ? <Line data={data} options={options} /> : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
            Loading chart...
          </div>
        )}
      </div>
    </div>
  );
}
