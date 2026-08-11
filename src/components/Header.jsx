import React from 'react';
import { Database, Server, RefreshCw, Sparkles, Users } from 'lucide-react';

export default function Header({ dbStatus, totalCount, onRefresh, isLoading }) {
  const getStatusText = () => {
    if (!dbStatus) return 'Connecting to DB...';
    if (dbStatus.connected) return `MySQL Online (${dbStatus.database})`;
    return 'MySQL Disconnected';
  };

  const getStatusClass = () => {
    if (!dbStatus) return 'connecting';
    return dbStatus.connected ? 'connected' : 'disconnected';
  };

  return (
    <header className="navbar">
      <div className="brand-section">
        <div className="brand-icon">
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className="brand-title">Campus Directory</h1>
          <p className="brand-subtitle">Vite + React + Express + MySQL Database</p>
        </div>
      </div>

      <div className="header-status">
        <div className="status-badge" title={dbStatus?.error || 'Database is operational'}>
          <span className={`status-dot ${getStatusClass()}`} />
          <span>{getStatusText()}</span>
        </div>

        <div className="status-badge">
          <Users size={14} style={{ color: 'var(--accent-primary)' }} />
          <span>{totalCount} {totalCount === 1 ? 'Entry' : 'Entries'}</span>
        </div>

        <button 
          onClick={onRefresh} 
          disabled={isLoading}
          className="pill-btn"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          title="Refresh Data from MySQL"
        >
          <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
          <span>Sync</span>
        </button>
      </div>
    </header>
  );
}
