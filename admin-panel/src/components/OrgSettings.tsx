/** Org settings — edit org details, GHL credentials, test connection. */
import { useEffect, useState } from 'react';
import { api, OrgDetail } from '../api/client';
import { IconSave } from './Icons';

interface Props {
  orgId: string;
}

export function OrgSettings({ orgId }: Props) {
  const [detail, setDetail] = useState<OrgDetail | null>(null);
  const [form, setForm] = useState({
    name: '', ghl_api_key: '', ghl_location_id: '', twilio_phone_number: '',
  });
  const [ghlResult, setGhlResult] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.getOrg(orgId)
      .then((d) => {
        setDetail(d);
        setForm({
          name: d.name || '',
          ghl_api_key: '',
          ghl_location_id: d.ghl_location_id || '',
          twilio_phone_number: d.twilio_phone_number || '',
        });
      })
      .catch((e) => setMsg(`Error: ${e}`));
  }, [orgId]);

  const save = async () => {
    try {
      const body: Record<string, unknown> = { name: form.name };
      if (form.ghl_api_key) body.ghl_api_key = form.ghl_api_key;
      if (form.ghl_location_id) body.ghl_location_id = form.ghl_location_id;
      body.twilio_phone_number = form.twilio_phone_number || null;
      await api.updateOrg(orgId, body);
      setMsg('Organization updated successfully.');
    } catch (e) {
      setMsg(`Error: ${e}`);
    }
  };

  const testGhl = async () => {
    setGhlResult('Testing…');
    try {
      const r = await api.testGhl(orgId);
      setGhlResult(JSON.stringify(r, null, 2));
    } catch (e) {
      setGhlResult(`Error: ${e}`);
    }
  };

  if (!detail) {
    return (
      <div>
        <h2 className="sa-heading">Organization Settings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="sa-loading" style={{ height: 20, width: '30%' }} />
          <div className="sa-loading" style={{ height: 40 }} />
          <div className="sa-loading" style={{ height: 40 }} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="sa-heading">Organization Settings</h2>
      {msg && <div className="sa-toast">{msg}</div>}

      <div className="sa-info-row">
        <span className="sa-label" style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 11 }}>Slug</span>
        <code className="sa-code">{detail.slug}</code>
        <span style={{ width: 1, height: 16, background: 'var(--sa-border)', margin: '0 8px' }} />
        <span className="sa-label" style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 11 }}>ID</span>
        <code className="sa-code" style={{ fontSize: 11 }}>{detail.id}</code>
      </div>

      <div className="sa-form-grid">
        <label className="sa-field">
          <span className="sa-label">Organization Name</span>
          <input className="sa-input" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className="sa-field">
          <span className="sa-label">
            GHL API Key
            <span style={{
              marginLeft: 8, fontSize: 11, fontWeight: 400,
              color: detail.has_ghl_api_key ? 'var(--sa-success)' : 'var(--sa-text-muted)',
            }}>
              {detail.has_ghl_api_key ? '● Configured' : '○ Not set'}
            </span>
          </span>
          <input className="sa-input" type="password" autoComplete="off"
            value={form.ghl_api_key}
            onChange={(e) => setForm({ ...form, ghl_api_key: e.target.value })}
            placeholder="Leave blank to keep current key" />
        </label>
        <label className="sa-field">
          <span className="sa-label">GHL Location ID (sub-account)</span>
          <input className="sa-input" value={form.ghl_location_id}
            onChange={(e) => setForm({ ...form, ghl_location_id: e.target.value })}
            placeholder="Sub-account UUID" />
        </label>
        <label className="sa-field">
          <span className="sa-label">Twilio Phone Number</span>
          <input className="sa-input" value={form.twilio_phone_number}
            onChange={(e) => setForm({ ...form, twilio_phone_number: e.target.value })}
            placeholder="+1 403 555 0123" />
        </label>
      </div>

      <div className="sa-btn-row">
        <button className="sa-btn sa-btn-primary" onClick={save}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <IconSave /> Save Settings
        </button>
        <button className="sa-btn sa-btn-outline" onClick={testGhl}>Test GHL Connection</button>
      </div>

      {ghlResult && <pre className="sa-pre">{ghlResult}</pre>}
    </div>
  );
}
