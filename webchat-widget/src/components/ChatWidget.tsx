/** Main chat widget — floating button + expandable panel. */
import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { WidgetHeader } from './WidgetHeader';
import { LocationSelector } from './LocationSelector';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

/** M&H locations — hardcoded for embed, could be loaded from API. */
const LOCATIONS = [
  { id: 'main_office', name: 'Main Office' },
  { id: 'bowness', name: 'Bowness' },
  { id: 'crowfoot', name: 'Crowfoot' },
  { id: 'fish_creek', name: 'Fish Creek' },
  { id: 'parkland', name: 'Parkland' },
  { id: 'queens_park', name: "Queen's Park" },
  { id: 'riverview', name: 'Riverview' },
  { id: 'south_calgary', name: 'South Calgary' },
  { id: 'thornhill', name: 'Thornhill' },
  { id: 'acadia', name: 'Acadia' },
  { id: 'cedar', name: 'Cedar' },
];

interface ChatWidgetProps {
  orgSlug?: string;
  apiUrl?: string;
  singleLocation?: boolean;
}

export function ChatWidget({
  orgSlug = 'mhc',
  apiUrl = '',
  singleLocation = false,
}: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'pick' | 'chat'>(singleLocation ? 'chat' : 'pick');
  const [selectedLoc, setSelectedLoc] = useState<string | null>(null);

  const chat = useChat({ orgSlug, apiUrl });

  const handleStart = () => {
    setStep('chat');
    chat.startChat(selectedLoc);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
    // If single location, auto-connect on first open
    if (singleLocation && chat.wsStatus === 'disconnected') {
      chat.startChat(null);
    }
  };

  const locName = LOCATIONS.find((l) => l.id === selectedLoc)?.name;

  return (
    <div className="sarah-widget">
      {/* Floating launcher button */}
      {!open && (
        <button className="sarah-launcher" onClick={handleOpen} aria-label="Open chat with Sarah">
          💬
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="sarah-panel">
          <WidgetHeader
            status={chat.wsStatus}
            locationName={locName}
            onClose={handleClose}
          />

          {chat.wsStatus === 'reconnecting' && (
            <div className="sarah-reconnecting">
              Reconnecting…
            </div>
          )}

          {step === 'pick' && !singleLocation ? (
            <LocationSelector
              locations={LOCATIONS}
              selected={selectedLoc}
              onSelect={setSelectedLoc}
              onStart={handleStart}
            />
          ) : (
            <>
              <MessageList messages={chat.messages} typing={chat.typing} />
              <ChatInput onSend={chat.sendMessage} status={chat.wsStatus} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
