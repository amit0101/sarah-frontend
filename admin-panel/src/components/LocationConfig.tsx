/** Tag/pipeline mapping JSON editor for location config. */
import { useCallback, useEffect, useState } from 'react';
import { api, LocSummary } from '../api/client';
import { IconSave } from './Icons';

interface Props {
  orgId: string;
}

export function LocationConfig({ orgId }: Props) {
  const [locations, setLocations] = useState<LocSummary[]>([]);
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null);
  const [json, setJson] = useState('');
  const [msg, setMsg] = useState('');
  const [valid, setValid] = useState(true);

  useEffect(() => {
    api.listLocations(orgId).then((d) => setLocations(d.locations)).catch(() => {});
  }, [orgId]);

  const load = useCallback(() => {
    if (!selectedLoc) return;
    api.getConfig(orgId, selectedLoc)
      .then((d) => {
        setJson(JSON.stringify(d.config || {}, null, 2));
        setValid(true);
      })
      .catch((e) => setMsg(`Error: ${e}`));
  }, [orgId, selectedLoc]);

  useEffect(() => { load(); }, [load]);

  const handleChange = (val: string) => {
    setJson(val);
    try {
      JSON.parse(val);
      setValid(true);
    } catch {
      setValid(false);
    }
  };

  const save = async () => {
    if (!selectedLoc || !valid) return;
    try {
      const config = JSON.parse(json);
      await api.putConfig(orgId, selectedLoc, config);
      setMsg('Config saved successfully.');
    } catch (e) {
      setMsg(`Error: ${e}`);
    }
  };

  return (
    <div>
      <h2 className="sa-heading">Tag / Pipeline Config</h2>
      <p className="sa-muted">
        Edit the JSON config for tag mappings, pipeline IDs, business hours, and other
        location-specific settings stored in <code className="sa-code">sarah.locations.config</code>.
      </p>
      {msg && <div className="sa-toast">{msg}</div>}

      <label className="sa-field">
        <span className="sa-label">Location</span>
        <select className="sa-select" value={selectedLoc ?? ''}
          onChange={(e) => setSelectedLoc(e.target.value || null)}
          style={{ maxWidth: 400 }}>
          <option value="">— Select location —</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>{l.name} ({l.id})</option>
          ))}
        </select>
      </label>

      {selectedLoc && (
        <>
          <label className="sa-field">
            <span className="sa-label">Configuration JSON</span>
            <textarea
              className={`sa-textarea sa-code-editor ${valid ? '' : 'sa-invalid'}`}
              rows={20}
              value={json}
              onChange={(e) => handleChange(e.target.value)}
              spellCheck={false}
            />
          </label>
          {!valid && <p className="sa-error">Invalid JSON — fix syntax before saving</p>}
          <button className="sa-btn sa-btn-primary" onClick={save} disabled={!valid}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <IconSave /> Save Config
          </button>
        </>
      )}
    </div>
  );
}
