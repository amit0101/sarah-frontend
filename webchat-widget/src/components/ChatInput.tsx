/** Text input + send button. */
import { useRef, useState } from 'react';
import { WsStatus } from '../hooks/useWebSocket';

interface Props {
  onSend: (text: string) => void;
  status: WsStatus;
}

export function ChatInput({ onSend, status }: Props) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const disabled = status !== 'connected';

  const handleSend = () => {
    const t = text.trim();
    if (!t || disabled) return;
    onSend(t);
    setText('');
    inputRef.current?.focus();
  };

  return (
    <div className="sarah-composer">
      <input
        ref={inputRef}
        className="sarah-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder={disabled ? 'Connecting…' : 'Type a message…'}
        disabled={disabled}
      />
      <button
        className="sarah-btn-send"
        onClick={handleSend}
        disabled={disabled || !text.trim()}
      >
        Send
      </button>
    </div>
  );
}
