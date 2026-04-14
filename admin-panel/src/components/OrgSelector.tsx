/** Organization selector — top of content area. */
import { useEffect, useState } from 'react';
import { api, OrgSummary } from '../api/client';
import { IconAlertCircle, IconRefresh } from './Icons';

interface Props {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export function OrgSelector({ selectedId, onSelect }: Props) {
  const [orgs, setOrgs] = useState<OrgSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    api.listOrgs()
      .then((d) => setOrgs(d.organizations))
      .catch((e) => setError(`${e}`))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (error) {
    return (
      <div className="sa-org-selector">
        <div className="sa-card sa-card-error" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--sa-danger)', display: 'flex' }}><IconAlertCircle /></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--sa-danger)', marginBottom: 2 }}>
              Failed to load organizations
            </div>
            <div style={{ fontSize: 12, color: 'var(--sa-text-muted)' }}>
              Check that the backend is running and the database is accessible.
            </div>
          </div>
          <button className="sa-btn sa-btn-outline sa-btn-sm" onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconRefresh /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sa-org-selector">
      <label className="sa-field" style={{ marginBottom: 0 }}>
        <span className="sa-label">Organization</span>
        <select
          className="sa-select"
          value={selectedId ?? ''}
          onChange={(e) => onSelect(e.target.value || null)}
          disabled={loading}
          style={{ maxWidth: 400 }}
        >
          <option value="">{loading ? 'Loading…' : '— Select organization —'}</option>
          {orgs.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name} ({o.slug})
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
