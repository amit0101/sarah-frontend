/** Sarah Admin Panel — main app entry. */
import { useState } from 'react';
import './styles/admin.css';
import { setApiKey } from './api/client';
import { Layout, NavItem } from './components/Layout';
import { OrgSelector } from './components/OrgSelector';
import { LocationList } from './components/LocationList';
import { KnowledgeBase } from './components/KnowledgeBase';
import { PromptEditor } from './components/PromptEditor';
import { EscalationConfig } from './components/EscalationConfig';
import { LocationConfig } from './components/LocationConfig';
import { OrgSettings } from './components/OrgSettings';
import { HealthCheck } from './components/HealthCheck';
import { IconShield } from './components/Icons';

function AuthGate({ onAuth }: { onAuth: (key: string) => void }) {
  const [key, setKey] = useState('');
  return (
    <div className="sa-auth-gate">
      <div className="sa-auth-card">
        <div style={{ marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
            fontSize: 24, fontWeight: 700, color: '#fff',
          }}>S</div>
          <h2>Sarah Admin</h2>
          <p>Enter your API key to access the admin panel</p>
        </div>
        <div className="sa-field">
          <input
            className="sa-input"
            type="password"
            autoComplete="off"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && key && onAuth(key)}
            placeholder="Admin API key"
          />
        </div>
        <button
          className="sa-btn sa-btn-primary"
          style={{ width: '100%', marginTop: 8 }}
          disabled={!key}
          onClick={() => onAuth(key)}
        >
          <IconShield /> Sign In
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(() => {
    try { return !!localStorage.getItem('sarah_admin_key'); } catch { return false; }
  });
  const [nav, setNav] = useState<NavItem>('locations');
  const [orgId, setOrgId] = useState<string | null>(null);

  const handleAuth = (key: string) => {
    setApiKey(key);
    setAuthed(true);
  };

  if (!authed) return <AuthGate onAuth={handleAuth} />;

  const renderContent = () => {
    if (nav === 'health') return <HealthCheck />;
    if (!orgId) {
      return (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16, margin: '0 auto 20px',
            background: 'var(--sa-primary-light)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: 'var(--sa-primary)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
              <path d="M9 22v-4h6v4" />
              <path d="M8 6h.01" /><path d="M16 6h.01" />
              <path d="M12 6h.01" /><path d="M12 10h.01" />
              <path d="M12 14h.01" /><path d="M16 10h.01" />
              <path d="M16 14h.01" /><path d="M8 10h.01" />
              <path d="M8 14h.01" />
            </svg>
          </div>
          <h2 className="sa-heading" style={{ marginBottom: 8 }}>Welcome to Sarah Admin</h2>
          <p className="sa-muted" style={{ fontSize: 14, maxWidth: 400, margin: '0 auto' }}>
            Select an organization from the dropdown above to manage locations, prompts, knowledge base, and more.
          </p>
        </div>
      );
    }
    switch (nav) {
      case 'locations':
        return <LocationList orgId={orgId} />;
      case 'knowledge_base':
        return <KnowledgeBase orgId={orgId} />;
      case 'prompts':
        return <PromptEditor orgId={orgId} />;
      case 'escalation':
        return <EscalationConfig orgId={orgId} />;
      case 'config':
        return <LocationConfig orgId={orgId} />;
      case 'settings':
        return <OrgSettings orgId={orgId} />;
      default:
        return null;
    }
  };

  return (
    <Layout active={nav} onNav={setNav} orgName={orgId ? undefined : undefined}>
      <OrgSelector selectedId={orgId} onSelect={setOrgId} />
      {renderContent()}
    </Layout>
  );
}
