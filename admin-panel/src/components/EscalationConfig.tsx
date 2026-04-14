/** Escalation contacts config per location. */
import { useCallback, useEffect, useState } from 'react';
import { api, EscalationContact, LocSummary } from '../api/client';
import { IconBell, IconPlus, IconTrash, IconSave } from './Icons';

interface Props {
  orgId: string;
}

const EMPTY: EscalationContact = { name: '', role: '', phone: '', email: '' };

export function EscalationConfig({ orgId }: Props) {
  const [locations, setLocations] = useState<LocSummary[]>([]);
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null);
  const [contacts, setContacts] = useState<EscalationContact[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.listLocations(orgId).then((d) => setLocations(d.locations)).catch(() => {});
  }, [orgId]);

  const load = useCallback(() => {
    if (!selectedLoc) return;
    api.getEscalation(orgId, selectedLoc)
      .then((d) => setContacts(d.escalation_contacts || []))
      .catch((e) => setMsg(`Error: ${e}`));
  }, [orgId, selectedLoc]);

  useEffect(() => { load(); }, [load]);

  const update = (idx: number, field: keyof EscalationContact, val: string) => {
    setContacts((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: val } : c));
  };

  const add = () => setContacts((prev) => [...prev, { ...EMPTY }]);

  const remove = (idx: number) => setContacts((prev) => prev.filter((_, i) => i !== idx));

  const save = async () => {
    if (!selectedLoc) return;
    try {
      await api.putEscalation(orgId, selectedLoc, contacts);
      setMsg('Escalation contacts saved.');
    } catch (e) {
      setMsg(`Error: ${e}`);
    }
  };

  return (
    <div>
      <h2 className="sa-heading">Escalation Contacts</h2>
      <p className="sa-muted">
        Configure who gets notified when Sarah escalates a conversation to staff.
        Contacts are per-location and receive notifications via their preferred channel.
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
          {contacts.length === 0 ? (
            <div className="sa-empty-state">
              <div className="sa-empty-state-icon"><IconBell /></div>
              <p className="sa-muted" style={{ marginBottom: 0 }}>
                No escalation contacts configured. Add one to start receiving notifications.
              </p>
            </div>
          ) : (
            contacts.map((c, i) => (
              <div key={i} className="sa-card sa-esc-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 550, color: 'var(--sa-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Contact {i + 1}
                  </span>
                  <button className="sa-btn sa-btn-danger sa-btn-sm" onClick={() => remove(i)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <IconTrash /> Remove
                  </button>
                </div>
                <div className="sa-form-grid sa-form-grid-4">
                  <label className="sa-field">
                    <span className="sa-label">Name</span>
                    <input className="sa-input" value={c.name}
                      onChange={(e) => update(i, 'name', e.target.value)}
                      placeholder="John Smith" />
                  </label>
                  <label className="sa-field">
                    <span className="sa-label">Role</span>
                    <select className="sa-select" value={c.role}
                      onChange={(e) => update(i, 'role', e.target.value)}>
                      <option value="">— Select —</option>
                      <option value="director">Director</option>
                      <option value="manager">Manager</option>
                      <option value="primary">Primary</option>
                      <option value="staff">Staff</option>
                    </select>
                  </label>
                  <label className="sa-field">
                    <span className="sa-label">Phone</span>
                    <input className="sa-input" value={c.phone || ''}
                      onChange={(e) => update(i, 'phone', e.target.value)}
                      placeholder="+1 403 555 0123" />
                  </label>
                  <label className="sa-field">
                    <span className="sa-label">Email</span>
                    <input className="sa-input" value={c.email || ''}
                      onChange={(e) => update(i, 'email', e.target.value)}
                      placeholder="john@mhfh.com" />
                  </label>
                </div>
              </div>
            ))
          )}
          <div className="sa-btn-row">
            <button className="sa-btn sa-btn-outline" onClick={add}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconPlus /> Add Contact
            </button>
            <button className="sa-btn sa-btn-primary" onClick={save}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <IconSave /> Save
            </button>
          </div>
        </>
      )}
    </div>
  );
}
