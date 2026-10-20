"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeSocket, type RealtimeEvent } from "@/hooks/messaging/useRealtimeSocket";
import type { DirectMessage, DirectChat } from "@/types/api.types";

type TypingMap = Record<string, boolean>;

interface TypingPayload {
  chatId?: string;
  userId?: string;
  isTyping?: boolean;
}

interface RealtimeContextValue {
  isConnected: boolean;
  typingByChatId: TypingMap;
  sendTyping: (recipientId: string, chatId: string, isTyping: boolean) => void;
}

const RealtimeContext = createContext<RealtimeContextValue>({
  isConnected: false,
  typingByChatId: {},
  sendTyping: () => {},
});

export const useRealtime = () => useContext(RealtimeContext);

/**
 * Returns whether the OTHER participant in a given chat is currently typing.
 * Local echoes (userId === me) are filtered out by the context.
 */
export const useTypingStatus = (chatId: string | null | undefined): boolean => {
  const { typingByChatId } = useContext(RealtimeContext);
  if (!chatId) return false;
  return Boolean(typingByChatId[chatId]);
};

const TYPING_EXPIRY_MS = 4_000;

export const RealtimeProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [typingByChatId, setTypingByChatId] = useState<TypingMap>({});
  const typingTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const clearTypingTimer = useCallback((chatId: string) => {
    const timer = typingTimersRef.current[chatId];
    if (timer) {
      clearTimeout(timer);
      delete typingTimersRef.current[chatId];
    }
  }, []);

  const setTyping = useCallback(
    (chatId: string, isTyping: boolean) => {
      clearTypingTimer(chatId);
      setTypingByChatId((prev) => {
        if (prev[chatId] === isTyping) return prev;
        return { ...prev, [chatId]: isTyping };
      });
      if (isTyping) {
        // Auto-expire if the other side goes silent (missed "stop" frame, dropped socket, etc.)
        typingTimersRef.current[chatId] = setTimeout(() => {
          setTypingByChatId((prev) => ({ ...prev, [chatId]: false }));
          delete typingTimersRef.current[chatId];
        }, TYPING_EXPIRY_MS);
      }
    },
    [clearTypingTimer]
  );

  const handleTyping = useCallback(
    (payload: TypingPayload) => {
      if (!payload?.chatId || !payload?.userId) return;
      // Ignore any accidental self-echo so you don't see "you're typing" to yourself.
      if (payload.userId === user?.id) return;
      setTyping(payload.chatId, Boolean(payload.isTyping));
    },
    [setTyping, user?.id]
  );

  const handleDirectMessage = useCallback(
    (message: DirectMessage) => {
      if (!message?.chatId) return;
      const chatId = message.chatId;

      // 1. Append to the flat chat-messages cache so an open window sees it immediately.
      queryClient.setQueryData<DirectMessage[] | undefined>(
        ["messaging", "chats", chatId, "messages"],
        (prev) => {
          if (!prev) return prev;
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        }
      );

      // 2. Patch the infinite-query shape (ChatWindow's primary data source).
      queryClient.setQueryData<{ pages: DirectMessage[][]; pageParams: unknown[] } | undefined>(
        ["messaging", "chats", chatId, "messages", "infinite"],
        (prev) => {
          if (!prev || !Array.isArray(prev.pages) || prev.pages.length === 0) return prev;
          // First page returned from the API is the most-recent window; append there.
          const lastPage = prev.pages[prev.pages.length - 1];
          if (lastPage?.some((m) => m.id === message.id)) return prev;
          const nextPages = prev.pages.slice(0, -1).concat([[...(lastPage || []), message]]);
          return { ...prev, pages: nextPages };
        }
      );

      // 3. Patch the chat list for lastMessage preview and unread bump.
      queryClient.setQueryData<DirectChat[] | undefined>(["messaging", "chats"], (prev) => {
        if (!prev) return prev;
        let touched = false;
        const next = prev.map((c) => {
          if (c.id !== chatId) return c;
          touched = true;
          const isFromMe = message.senderId === user?.id;
          return {
            ...c,
            lastMessage: message,
            unreadCount: isFromMe ? c.unreadCount || 0 : (c.unreadCount || 0) + 1,
          };
        });
        return touched ? next : prev;
      });

      // Fallback: if the chat wasn't in the list yet (brand new conversation), refetch.
      queryClient.invalidateQueries({ queryKey: ["messaging", "chats"], refetchType: "none" });
    },
    [queryClient, user?.id]
  );

  const handleMessageRequest = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["messaging", "requests"] });
    queryClient.invalidateQueries({ queryKey: ["messaging", "chats"] });
  }, [queryClient]);

  const handleNotification = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  const handleProjectMessage = useCallback(
    (payload: { projectId?: string } | undefined) => {
      // Project-message read endpoints aren't wired in the frontend yet. Invalidate
      // project lists so unread badges / lastMessage previews refresh when they land.
      if (payload?.projectId) {
        queryClient.invalidateQueries({ queryKey: ["projects", payload.projectId] });
      }
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    [queryClient]
  );

  const handleTaskEvent = useCallback(
    (payload: { projectId?: string; taskId?: string } | undefined) => {
      if (payload?.projectId) {
        queryClient.invalidateQueries({ queryKey: ["projects", payload.projectId, "tasks"] });
      }
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    [queryClient]
  );

  const onEvent = useCallback(
    (event: RealtimeEvent) => {
      switch (event.type) {
        case "DIRECT_MESSAGE":
          handleDirectMessage(event.data as DirectMessage);
          break;
        case "MESSAGE_REQUEST_RECEIVED":
        case "MESSAGE_REQUEST_ACCEPTED":
          handleMessageRequest();
          break;
        case "NOTIFICATION":
          handleNotification();
          break;
        case "PROJECT_MESSAGE":
          handleProjectMessage(event.data as { projectId?: string });
          break;
        case "TASK_ASSIGNED":
        case "TASK_STATUS_CHANGED":
        case "TASK_COMMENT_ADDED":
          handleTaskEvent(event.data as { projectId?: string; taskId?: string });
          break;
        case "TYPING":
          handleTyping(event.data as TypingPayload);
          break;
        default:
          // Unknown events are ignored; backend can add more without breaking the client.
          break;
      }
    },
    [handleDirectMessage, handleMessageRequest, handleNotification, handleProjectMessage, handleTaskEvent, handleTyping]
  );

  const { isConnected, send } = useRealtimeSocket({ userId: user?.id, onEvent });

  const sendTyping = useCallback(
    (recipientId: string, chatId: string, isTyping: boolean) => {
      if (!recipientId || !chatId) return;
      send({ type: "TYPING", recipientId, chatId, isTyping });
    },
    [send]
  );

  const value = useMemo(
    () => ({ isConnected, typingByChatId, sendTyping }),
    [isConnected, typingByChatId, sendTyping]
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
};
