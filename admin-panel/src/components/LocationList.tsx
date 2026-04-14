/** Location list + create/edit form. */
import { useCallback, useEffect, useState } from 'react';
import { api, LocSummary } from '../api/client';
import { IconMapPin, IconPlus, IconTrash } from './Icons';

interface Props {
  orgId: string;
}

export function LocationList({ orgId }: Props) {
  const [locations, setLocations] = useState<LocSummary[]>([]);
  const [form, setForm] = useState({
    id: '', name: '', ghl_location_id: '', vector_store_id: '', calendar_id: '',
  });
  const [msg, setMsg] = useState('');

  const load = useCallback(() => {
    api.listLocations(orgId).then((d) => setLocations(d.locations)).catch(() => {});
  }, [orgId]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!form.id.trim() || !form.name.trim()) {
      setMsg('ID and Name are required.');
      return;
    }
    try {
      await api.createLocation(orgId, {
        id: form.id, name: form.name,
        ghl_location_id: form.ghl_location_id || null,
        vector_store_id: form.vector_store_id || null,
        calendar_id: form.calendar_id || null,
        config: {},
      });
      setMsg('Location created successfully.');
      setForm({ id: '', name: '', ghl_location_id: '', vector_store_id: '', calendar_id: '' });
      load();
    } catch (e) {
      setMsg(`Error: ${e}`);
    }
  };

  const remove = async (slug: string) => {
    if (!confirm(`Delete location "${slug}"?`)) return;
    try {
      await api.deleteLocation(orgId, slug);
      load();
    } catch (e) {
      setMsg(`Error: ${e}`);
    }
  };

  return (
    <div>
      <h2 className="sa-heading">Locations</h2>
      {msg && <div className="sa-toast">{msg}</div>}

      {locations.length === 0 ? (
        <div className="sa-empty-state">
          <div className="sa-empty-state-icon"><IconMapPin /></div>
          <p className="sa-muted">No locations configured yet. Add one below.</p>
        </div>
      ) : (
        <div className="sa-card-list">
          {locations.map((l) => (
            <div key={l.id} className="sa-card sa-card-row">
              <div>
                <div className="sa-card-title">{l.name}</div>
                <div className="sa-card-sub">
                  Slug: <code className="sa-code">{l.id}</code>
                  {l.vector_store_id && (
                    <> · Vector Store: <code className="sa-code">{l.vector_store_id.slice(0, 16)}…</code></>
                  )}
                </div>
              </div>
              <button className="sa-btn sa-btn-danger sa-btn-sm" onClick={() => remove(l.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <IconTrash /> Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <h3 className="sa-sub-heading">Add Location</h3>
      <div className="sa-form-grid">
        <label className="sa-field">
          <span className="sa-label">ID (slug)</span>
          <input className="sa-input" value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            placeholder="main_office" />
        </label>
        <label className="sa-field">
          <span className="sa-label">Display Name</span>
          <input className="sa-input" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="McInnis & Holloway — Main Office" />
        </label>
        <label className="sa-field">
          <span className="sa-label">GHL Location ID</span>
          <input className="sa-input" value={form.ghl_location_id}
            onChange={(e) => setForm({ ...form, ghl_location_id: e.target.value })}
            placeholder="Optional" />
        </label>
        <label className="sa-field">
          <span className="sa-label">Vector Store ID</span>
          <input className="sa-input" value={form.vector_store_id}
            onChange={(e) => setForm({ ...form, vector_store_id: e.target.value })}
            placeholder="Optional" />
        </label>
        <label className="sa-field">
          <span className="sa-label">Google Calendar ID</span>
          <input className="sa-input" value={form.calendar_id}
            onChange={(e) => setForm({ ...form, calendar_id: e.target.value })}
            placeholder="Optional" />
        </label>
      </div>
      <button className="sa-btn sa-btn-primary" onClick={save}
        disabled={!form.id.trim() || !form.name.trim()}
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <IconPlus /> Create Location
      </button>
    </div>
  );
}
