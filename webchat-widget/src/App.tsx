import './styles/widget.css';
import { ChatWidget } from './components/ChatWidget';

const ORG_SLUG = import.meta.env.VITE_ORG_SLUG || 'mhc';
const API_URL = import.meta.env.VITE_SARAH_API_URL || '';

export default function App() {
  return (
    <ChatWidget
      orgSlug={ORG_SLUG}
      apiUrl={API_URL}
    />
  );
}

// Re-export for library mode
export { ChatWidget };
