import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Mount into #sarah-webchat or #root (dev mode fallback)
const target = document.getElementById('sarah-webchat') || document.getElementById('root');
if (target) {
  createRoot(target).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
