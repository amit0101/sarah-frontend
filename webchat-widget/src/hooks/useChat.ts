/** Chat state management hook — messages, typing, session persistence. */
import { useCallback, useRef, useState } from 'react';
import { useWebSocket, WsStatus } from './useWebSocket';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const SESSION_KEY = 'sarah_conv_id';

function loadSession(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function saveSession(id: string) {
  try {
    sessionStorage.setItem(SESSION_KEY, id);
  } catch { /* noop */ }
}

interface UseChatOptions {
  orgSlug: string;
  apiUrl: string;
}

export function useChat({ orgSlug, apiUrl }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [wsStatus, setWsStatus] = useState<WsStatus>('disconnected');
  const [conversationId, setConversationId] = useState<string | null>(loadSession());
  const [locationSlug, setLocationSlug] = useState<string | null>(null);

  const onMessage = useCallback((data: Record<string, unknown>) => {
    if (data.type === 'typing') {
      setTyping(Boolean(data.value));
      return;
    }
    if (data.type === 'message' && data.role === 'assistant') {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.content as string, timestamp: Date.now() },
      ]);
      return;
    }
    if (data.error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `⚠️ ${data.error}`, timestamp: Date.now() },
      ]);
    }
  }, []);

  const onReady = useCallback((data: Record<string, unknown>) => {
    const cid = data.conversation_id as string;
    setConversationId(cid);
    saveSession(cid);
    if (!data.resumed) {
      // New conversation — show welcome
      setMessages([{
        role: 'assistant',
        content: 'Hello, I\'m Sarah from McInnis & Holloway. How may I help you today?',
        timestamp: Date.now(),
      }]);
    }
  }, []);

  const onStatusChange = useCallback((s: WsStatus) => {
    setWsStatus(s);
  }, []);

  const ws = useWebSocket({
    orgSlug,
    locationSlug,
    apiUrl,
    resumeConversationId: conversationId,
    onMessage,
    onReady,
    onStatusChange,
  });

  const startChat = useCallback(
    (loc: string | null) => {
      setLocationSlug(loc);
      setMessages([]);
      setTyping(false);
      try { sessionStorage.removeItem(SESSION_KEY); } catch { /* noop */ }
      setConversationId(null);
      setTimeout(() => ws.connect(loc, null), 0);
    },
    [ws],
  );

  const resumeChat = useCallback(
    (loc: string | null) => {
      setLocationSlug(loc);
      const cid = loadSession();
      ws.connect(loc, cid);
    },
    [ws],
  );

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const t = text.trim();
      setMessages((prev) => [...prev, { role: 'user', content: t, timestamp: Date.now() }]);
      ws.send(t);
    },
    [ws],
  );

  return {
    messages,
    typing,
    wsStatus,
    conversationId,
    startChat,
    resumeChat,
    sendMessage,
    disconnect: ws.disconnect,
  };
}
