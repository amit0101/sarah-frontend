import '../styles/widget.css';
import { ChatWidget } from './components/ChatWidget';

const ORG_SLUG = import.meta.env.VITE_ORG_SLUG || 'mhc';
const API_URL = import.meta.env.VITE_SARAH_API_URL || '';
const SINGLE_LOC = import.meta.env.VITE_SINGLE_LOCATION_EMBED === 'true';

export default function App() {
  return (
    <ChatWidget
      orgSlug={ORG_SLUG}
      apiUrl={API_URL}
      singleLocation={SINGLE_LOC}
    />
  );
}

// Re-export for library mode
export { ChatWidget };
