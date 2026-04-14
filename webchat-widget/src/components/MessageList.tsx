/** Scrollable message list with auto-scroll to bottom. */
import { useEffect, useRef } from 'react';
import { ChatMessage } from '../hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface Props {
  messages: ChatMessage[];
  typing: boolean;
}

export function MessageList({ messages, typing }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  return (
    <div className="sarah-messages">
      {messages.map((m, i) => (
        <MessageBubble key={i} message={m} />
      ))}
      {typing && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
