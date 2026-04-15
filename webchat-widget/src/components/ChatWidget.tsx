/** Main chat widget — floating button + expandable panel. */
import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { WidgetHeader } from './WidgetHeader';
import { LocationSelector } from './LocationSelector';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';

/** M&H chapel locations — must match sarah.locations table slugs. */
const LOCATIONS = [
  { id: 'park_memorial', name: 'Park Memorial Chapel' },
  { id: 'eastside', name: 'Eastside Memorial Chapel' },
  { id: 'fish_creek', name: 'Fish Creek Chapel' },
  { id: 'deerfoot_south', name: 'Deerfoot South' },
  { id: 'chapel_of_the_bells', name: 'Chapel Of The Bells' },
  { id: 'calgary_crematorium', name: 'Calgary Crematorium' },
  { id: 'heritage', name: 'Heritage Funeral Services' },
  { id: 'crowfoot', name: 'Crowfoot Chapel' },
  { id: 'airdrie', name: 'Airdrie Funeral Home' },
  { id: 'cochrane', name: 'Cochrane Funeral Home' },
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
