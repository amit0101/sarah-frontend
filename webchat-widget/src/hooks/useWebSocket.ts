/** WebSocket hook with auto-reconnect and connection recovery. */
import { useCallback, useEffect, useRef, useState } from 'react';

export type WsStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

interface WsMessage {
  type?: string;
  role?: string;
  content?: string;
  value?: boolean;
  error?: string;
  conversation_id?: string;
  organization_id?: string;
  organization_slug?: string;
  location_id?: string;
  resumed?: boolean;
  [key: string]: unknown;
}

interface UseWebSocketOptions {
  orgSlug: string;
  locationSlug: string | null;
  apiUrl: string;
  resumeConversationId?: string | null;
  onMessage: (msg: WsMessage) => void;
  onReady: (msg: WsMessage) => void;
  onStatusChange: (status: WsStatus) => void;
}

const MAX_RECONNECT = 5;
const BACKOFF_BASE = 1000;

export function useWebSocket({
  orgSlug,
  locationSlug,
  apiUrl,
  resumeConversationId,
  onMessage,
  onReady,
  onStatusChange,
}: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const attemptsRef = useRef(0);
  const unmountedRef = useRef(false);
  const [status, setStatus] = useState<WsStatus>('disconnected');

  const updateStatus = useCallback(
    (s: WsStatus) => {
      setStatus(s);
      onStatusChange(s);
    },
    [onStatusChange],
  );

  const buildUrl = useCallback((locOverride?: string | null) => {
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = apiUrl ? new URL(apiUrl).host : `${window.location.hostname}:8000`;
    const loc = locOverride ?? locationSlug;
    if (!loc) return `${proto}//${host}/ws/chat/${orgSlug}`;
    return `${proto}//${host}/ws/chat/${orgSlug}/${loc}`;
  }, [orgSlug, locationSlug, apiUrl]);

  const connect = useCallback((locOverride?: string | null) => {
    wsRef.current?.close();
    updateStatus('connecting');
    const ws = new WebSocket(buildUrl(locOverride));
    wsRef.current = ws;

    ws.onopen = () => {
      attemptsRef.current = 0;
      // Send the first frame — resume or empty to create new conv
      if (resumeConversationId) {
        ws.send(JSON.stringify({ resume_conversation_id: resumeConversationId }));
      } else {
        ws.send(JSON.stringify({ text: '' }));
      }
    };

    ws.onmessage = (ev) => {
      const data: WsMessage = JSON.parse(ev.data);
      if (data.type === 'ready') {
        updateStatus('connected');
        onReady(data);
        return;
      }
      if (data.type === 'error' || data.error) {
        onMessage(data);
        return;
      }
      onMessage(data);
    };

    ws.onclose = () => {
      wsRef.current = null;
      if (unmountedRef.current) return;
      if (attemptsRef.current < MAX_RECONNECT) {
        const delay = BACKOFF_BASE * Math.pow(2, attemptsRef.current);
        attemptsRef.current += 1;
        updateStatus('reconnecting');
        setTimeout(() => {
          if (!unmountedRef.current) connect();
        }, delay);
      } else {
        updateStatus('disconnected');
      }
    };

    ws.onerror = () => {
      // onclose will fire after this
    };
  }, [buildUrl, resumeConversationId, onMessage, onReady, updateStatus]);

  const send = useCallback(
    (text: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ message: text }));
      }
    },
    [],
  );

  const disconnect = useCallback(() => {
    attemptsRef.current = MAX_RECONNECT; // prevent auto-reconnect
    wsRef.current?.close();
    wsRef.current = null;
    updateStatus('disconnected');
  }, [updateStatus]);

  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []);

  return { connect, send, disconnect, status };
}
