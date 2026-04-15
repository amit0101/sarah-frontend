/** Individual message bubble with timestamp and lightweight markdown. */
import { ChatMessage } from '../hooks/useChat';

interface Props {
  message: ChatMessage;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function renderMarkdown(text: string): string {
  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const lines = text.split('\n');
  const out: string[] = [];
  let inList = false;

  for (const raw of lines) {
    let line = escape(raw);

    // headings
    const hMatch = line.match(/^(#{1,4})\s+(.*)/);
    if (hMatch) {
      if (inList) { out.push('</ul>'); inList = false; }
      const level = Math.min(hMatch[1].length, 4);
      out.push(`<h${level + 2}>${inline(hMatch[2])}</h${level + 2}>`);
      continue;
    }

    // list items (- or *)
    const liMatch = line.match(/^\s*[-*]\s+(.*)/);
    if (liMatch) {
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push(`<li>${inline(liMatch[1])}</li>`);
      continue;
    }

    if (inList) { out.push('</ul>'); inList = false; }

    // blank line
    if (!line.trim()) { out.push('<br/>'); continue; }

    out.push(`<p>${inline(line)}</p>`);
  }

  if (inList) out.push('</ul>');
  return out.join('');
}

function inline(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

export function MessageBubble({ message }: Props) {
  const isAssistant = message.role === 'assistant';
  return (
    <div className={`sarah-bubble ${message.role}`}>
      {isAssistant ? (
        <div
          className="sarah-md"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
        />
      ) : (
        <div>{message.content}</div>
      )}
      <div className="sarah-bubble-time">{formatTime(message.timestamp)}</div>
    </div>
  );
}
