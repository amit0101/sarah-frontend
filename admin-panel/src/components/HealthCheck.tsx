/** System health check + status display. */
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { IconRefresh, IconAlertCircle } from './Icons';

export function HealthCheck() {
  const [health, setHealth] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const check = () => {
    setLoading(true);
    setError('');
    api.health()
      .then((d) => setHealth(d))
      .catch((e) => setError(`${e}`))
      .finally(() => setLoading(false));
  };

  useEffect(() => { check(); }, []);

  const isOk = health?.status === 'ok';
  const statusColor = isOk ? 'var(--sa-success)' : 'var(--sa-warning)';

  return (
    <div>
      <h2 className="sa-heading">System Health</h2>

      {loading ? (
        <div className="sa-card" style={{ padding: '24px 20px' }}>
          <div className="sa-loading" style={{ width: '40%', marginBottom: 12 }} />
          <div className="sa-loading" style={{ width: '60%', height: 14 }} />
        </div>
      ) : error ? (
        <div className="sa-card sa-card-error" style={{ padding: '24px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ color: 'var(--sa-danger)', display: 'flex' }}><IconAlertCircle /></span>
            <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--sa-danger)' }}>Connection Failed</span>
          </div>
          <p className="sa-muted" style={{ marginBottom: 4 }}>{error}</p>
          <p className="sa-muted" style={{ marginBottom: 0 }}>
            Check that the backend is running and <code className="sa-code">VITE_SARAH_API_URL</code> is correct.
          </p>
        </div>
      ) : health ? (
        <div className="sa-card" style={{ padding: '24px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span className="sa-status-dot" style={{ background: statusColor }} />
            <span style={{ fontWeight: 600, fontSize: 16, color: statusColor }}>
              {isOk ? 'All Systems Operational' : 'Degraded'}
            </span>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
          }}>
            <div style={{
              padding: '14px 18px', background: 'var(--sa-bg)', borderRadius: 'var(--sa-radius-sm)',
              border: '1px solid var(--sa-border-subtle)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 550, color: 'var(--sa-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>API Status</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: isOk ? 'var(--sa-success)' : 'var(--sa-warning)' }}>
                {String(health.status).toUpperCase()}
              </div>
            </div>
            <div style={{
              padding: '14px 18px', background: 'var(--sa-bg)', borderRadius: 'var(--sa-radius-sm)',
              border: '1px solid var(--sa-border-subtle)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 550, color: 'var(--sa-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>Database</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: health.database === 'connected' ? 'var(--sa-success)' : 'var(--sa-warning)' }}>
                {String(health.database).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <button className="sa-btn sa-btn-outline" onClick={check} style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 7 }}>
        <IconRefresh /> Refresh
      </button>
    </div>
  );
}
