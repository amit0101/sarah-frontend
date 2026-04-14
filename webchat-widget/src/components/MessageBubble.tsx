/** Individual message bubble with timestamp. */
import { ChatMessage } from '../hooks/useChat';

interface Props {
  message: ChatMessage;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function MessageBubble({ message }: Props) {
  return (
    <div className={`sarah-bubble ${message.role}`}>
      <div>{message.content}</div>
      <div className="sarah-bubble-time">{formatTime(message.timestamp)}</div>
    </div>
  );
}
