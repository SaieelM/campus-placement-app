import React from 'react';
import { Database, AlertTriangle, Terminal, CheckCircle2 } from 'lucide-react';

export default function DbNotice({ dbStatus, onRetry }) {
  if (dbStatus && dbStatus.connected) return null;

  return (
    <div className="notice-box" style={{ background: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.3)', color: '#fef3c7' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <AlertTriangle size={20} style={{ color: '#f59e0b', flexShrink: 0 }} />
          <strong>MySQL Connection Notice</strong>
        </div>
        <button
          onClick={onRetry}
          className="pill-btn"
          style={{ background: '#f59e0b', color: '#000', fontWeight: 'bold', border: 'none' }}
        >
          Retry Connection
        </button>
      </div>

      <p style={{ margin: '8px 0 4px 0', fontSize: '0.86rem' }}>
        {dbStatus?.error
          ? `Connection Error: ${dbStatus.error}`
          : 'Could not connect to MySQL server on localhost:3306.'}
      </p>

      <div style={{ fontSize: '0.82rem', color: '#fde68a', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
        <div>1. Ensure your local MySQL Server service is running on <code>localhost:3306</code></div>
        <div>2. Check your credentials in <code>.env</code> (DB_USER, DB_PASSWORD, DB_PORT)</div>
        <div>3. The backend will automatically create <code>campus_db</code> and the <code>listings</code> table when connected.</div>
      </div>
    </div>
  );
}
