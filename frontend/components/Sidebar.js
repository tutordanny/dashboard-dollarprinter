import { useState } from 'react';

export default function Sidebar({ activePage, onNavigate }) {
  const links = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'bots', label: 'Bots', icon: '🤖' },
    { id: 'history', label: 'History', icon: '📋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside style={{
      width: '220px',
      minHeight: '100vh',
      background: '#111827',
      borderRight: '1px solid #1e2d45',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      flexShrink: 0,
    }}>
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #1e2d45' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.5rem' }}>💵</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#22d3ee' }}>Dollar Printer</div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Bot Platform</div>
          </div>
        </div>
      </div>

      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {links.map((link) => (
          <div
            key={link.id}
            className={`sidebar-link ${activePage === link.id ? 'active' : ''}`}
            onClick={() => onNavigate(link.id)}
          >
            <span style={{ fontSize: '1.1rem' }}>{link.icon}</span>
            <span style={{ fontSize: '0.9rem' }}>{link.label}</span>
          </div>
        ))}
      </nav>

      <div style={{ padding: '16px 12px', borderTop: '1px solid #1e2d45' }}>
        <div
          className="sidebar-link"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.reload();
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>🚪</span>
          <span style={{ fontSize: '0.9rem' }}>Logout</span>
        </div>
      </div>
    </aside>
  );
}
