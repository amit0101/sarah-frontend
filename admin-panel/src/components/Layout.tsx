/** Sidebar nav + content layout. */
import { ReactNode } from 'react';
import {
  IconMapPin, IconBook, IconMessageSquare, IconBell,
  IconSettings, IconBuilding, IconActivity,
} from './Icons';

export type NavItem =
  | 'locations'
  | 'knowledge_base'
  | 'prompts'
  | 'escalation'
  | 'config'
  | 'settings'
  | 'health';

const NAV: { key: NavItem; label: string; icon: ReactNode }[] = [
  { key: 'locations', label: 'Locations', icon: <IconMapPin /> },
  { key: 'knowledge_base', label: 'Knowledge Base', icon: <IconBook /> },
  { key: 'prompts', label: 'Prompts', icon: <IconMessageSquare /> },
  { key: 'escalation', label: 'Escalation', icon: <IconBell /> },
  { key: 'config', label: 'Tag / Pipeline', icon: <IconSettings /> },
  { key: 'settings', label: 'Organization', icon: <IconBuilding /> },
  { key: 'health', label: 'System Health', icon: <IconActivity /> },
];

interface Props {
  active: NavItem;
  onNav: (item: NavItem) => void;
  orgName?: string;
  children: ReactNode;
}

export function Layout({ active, onNav, orgName, children }: Props) {
  return (
    <div className="sa-layout">
      <aside className="sa-sidebar">
        <div className="sa-sidebar-brand">
          <div className="sa-sidebar-logo">S</div>
          <div>
            <div className="sa-sidebar-title">Sarah Admin</div>
            {orgName && <div className="sa-sidebar-org">{orgName}</div>}
          </div>
        </div>
        <nav className="sa-nav">
          {NAV.map((n) => (
            <button
              key={n.key}
              className={`sa-nav-item ${active === n.key ? 'active' : ''}`}
              onClick={() => onNav(n.key)}
            >
              <span className="sa-nav-icon">{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="sa-main">{children}</main>
    </div>
  );
}
