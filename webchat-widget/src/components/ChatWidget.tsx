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

export function ChatWidget({
  orgSlug = 'mhc',
  apiUrl = '',
}: ChatWidgetProps) {
  const [open, setOpen] = useState(false);

  const chat = useChat({ orgSlug, apiUrl });

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    if (chat.wsStatus === 'disconnected') {
      chat.startChat(null);
    }
  };

  return (
    <div className="sarah-widget">
      {!open && (
        <button className="sarah-launcher" onClick={handleOpen} aria-label="Open chat with Sarah">
          💬
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
