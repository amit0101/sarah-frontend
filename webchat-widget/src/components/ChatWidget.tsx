/** Main chat widget — floating button + expandable panel.
 *  Location is resolved in-conversation via postal code (no dropdown). */
import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { WidgetHeader } from './WidgetHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

interface ChatWidgetProps {
  orgSlug?: string;
  apiUrl?: string;
}

const TEASER_DISMISSED_KEY = 'sarah_teaser_dismissed';

export function ChatWidget({
  orgSlug = 'mhc',
  apiUrl = '',
}: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [teaserDismissed, setTeaserDismissed] = useState<boolean>(() => {
    try { return sessionStorage.getItem(TEASER_DISMISSED_KEY) === '1'; } catch { return false; }
  });

  const chat = useChat({ orgSlug, apiUrl });

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    setTeaserDismissed(true);
    try { sessionStorage.setItem(TEASER_DISMISSED_KEY, '1'); } catch { /* noop */ }
    if (chat.wsStatus === 'disconnected') {
      chat.startChat(null);
    }
  };

  const handleDismissTeaser = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTeaserDismissed(true);
    try { sessionStorage.setItem(TEASER_DISMISSED_KEY, '1'); } catch { /* noop */ }
  };

  return (
    <div className="sarah-widget">
      {!open && !teaserDismissed && (
        <button
          className="sarah-teaser"
          onClick={handleOpen}
          aria-label="Open chat with Sarah"
          type="button"
        >
          <img
            className="sarah-teaser-avatar"
            src="/sarah-icon.jpg"
            alt="Sarah"
            draggable={false}
          />
          <span className="sarah-teaser-text">
            Hi there, have a question? Text us here.
          </span>
          <span
            className="sarah-teaser-close"
            onClick={handleDismissTeaser}
            aria-label="Dismiss"
            role="button"
          >
            ×
          </span>
        </button>
      )}

      {!open && (
        <button className="sarah-launcher" onClick={handleOpen} aria-label="Open chat with Sarah">
          <svg className="sarah-launcher-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.36A.6.6 0 0 1 4.8 19V16H6.5A2.5 2.5 0 0 1 4 13.5v-8Z"
              fill="currentColor"
            />
          </svg>
          <span className="sarah-launcher-label">Text us</span>
        </button>
      )}

      {open && (
        <div className="sarah-panel">
          <WidgetHeader
            status={chat.wsStatus}
            onClose={handleClose}
          />

          {chat.wsStatus === 'reconnecting' && (
            <div className="sarah-reconnecting">
              Reconnecting…
            </div>
          )}

          <MessageList messages={chat.messages} typing={chat.typing} />
          <ChatInput onSend={chat.sendMessage} status={chat.wsStatus} />
        </div>
      )}
    </div>
  );
}
