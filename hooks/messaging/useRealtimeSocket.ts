"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "@/constants/api-endpoints";

export type RealtimeEvent = {
  type: string;
  data?: unknown;
};

export type RealtimeEventHandler = (event: RealtimeEvent) => void;

interface UseRealtimeSocketOptions {
  userId: string | null | undefined;
  onEvent: RealtimeEventHandler;
}

const RECONNECT_BASE_MS = 1_000;
const RECONNECT_MAX_MS = 30_000;

const resolveSocketUrl = (): string => {
  // API_BASE_URL is like "https://host" or "http://localhost:5050"
  try {
    const url = new URL(API_BASE_URL);
    const protocol = url.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${url.host}`;
  } catch {
    return API_BASE_URL.replace(/^http/i, "ws");
  }
};

/**
 * Opens a persistent WebSocket to the backend, sends the AUTH frame once connected,
 * forwards every incoming event to onEvent, and reconnects with exponential backoff.
 *
 * The hook does NOT update any query caches itself — that's the caller's job via onEvent.
 */
export const useRealtimeSocket = ({ userId, onEvent }: UseRealtimeSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closedByUsRef = useRef(false);
  const handlerRef = useRef<RealtimeEventHandler>(onEvent);

  const send = useCallback((payload: unknown): boolean => {
    const socket = wsRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return false;
    try {
      socket.send(JSON.stringify(payload));
      return true;
    } catch {
      return false;
    }
  }, []);

  // Always call the freshest handler without resubscribing the socket.
  useEffect(() => {
    handlerRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    if (!userId) return;
    if (typeof window === "undefined" || typeof WebSocket === "undefined") return;

    closedByUsRef.current = false;

    const connect = () => {
      const url = resolveSocketUrl();
      let socket: WebSocket;
      try {
        socket = new WebSocket(url);
      } catch (err) {
        scheduleReconnect();
        return;
      }
      wsRef.current = socket;

      socket.addEventListener("open", () => {
        reconnectAttemptsRef.current = 0;
        try {
          socket.send(JSON.stringify({ type: "AUTH", userId }));
        } catch {
          /* ignore send-before-open */
        }
      });

      socket.addEventListener("message", (ev) => {
        let parsed: RealtimeEvent | null = null;
        try {
          parsed = JSON.parse(typeof ev.data === "string" ? ev.data : "");
        } catch {
          return;
        }
        if (!parsed || typeof parsed !== "object" || typeof parsed.type !== "string") return;
        if (parsed.type === "AUTH_SUCCESS") {
          setIsConnected(true);
          return;
        }
        try {
          handlerRef.current(parsed);
        } catch (err) {
          console.error("[realtime] handler threw", err);
        }
      });

      socket.addEventListener("close", () => {
        setIsConnected(false);
        wsRef.current = null;
        if (!closedByUsRef.current) scheduleReconnect();
      });

      socket.addEventListener("error", () => {
        // Browsers only expose a generic error — close handler handles reconnect.
      });
    };

    const scheduleReconnect = () => {
      if (closedByUsRef.current) return;
      const attempt = reconnectAttemptsRef.current + 1;
      reconnectAttemptsRef.current = attempt;
      const delay = Math.min(RECONNECT_BASE_MS * 2 ** (attempt - 1), RECONNECT_MAX_MS);
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = setTimeout(connect, delay);
    };

    connect();

    return () => {
      closedByUsRef.current = true;
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      if (wsRef.current) {
        try {
          wsRef.current.close(1000, "client disconnect");
        } catch {
          /* ignore */
        }
        wsRef.current = null;
      }
      setIsConnected(false);
    };
  }, [userId]);

  return { isConnected, send };
};
