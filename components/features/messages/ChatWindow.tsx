"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Avatar from "@/components/ui/Avatar";
import { FiMic, FiCornerUpLeft, FiX, FiChevronLeft } from "react-icons/fi";
import { useMessaging } from "@/hooks/messaging/useMessaging";
import messagingService from "@/services/messaging.service";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import type { DirectMessage } from "@/types/api.types";
import type { DirectMessageItem } from "./DirectMessagesList";

const SendPlaneIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22 2L11 13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 2L15 22L11 13L2 9L22 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FileDocIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 2V8H20"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface ChatWindowProps {
  chatId: string;
  chatInfo?: DirectMessageItem | null;
  onClose: () => void;
  className?: string;
}

export default function ChatWindow({
  chatId,
  chatInfo,
  onClose,
  className = "",
}: ChatWindowProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [inputText, setInputText] = useState("");
  const [replyToMessage, setReplyToMessage] = useState<any | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    useChatMessages,
    useInfiniteChatMessages,
    useSendMessage,
    useCreateChat,
    useSendRequest,
  } = useMessaging();

  const isDraftConnection = chatId.startsWith("connected-");
  const isRequestDraft =
    chatId.startsWith("request-") || !!chatInfo?.isRequestDraft;
  const isMockChat = chatId.startsWith("mock-");
  const activeChatId =
    isDraftConnection || isRequestDraft || isMockChat ? "" : chatId;
  const { data: apiMessages = [], isLoading } = useChatMessages(activeChatId);

  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteChatMessages(activeChatId);

  const sendMessageMutation = useSendMessage(activeChatId);
  const createChatMutation = useCreateChat();
  const sendRequestMutation = useSendRequest();

  // Local state for sent request in current session or from pendingRequest prop
  const [sentRequestText, setSentRequestText] = useState<string | null>(
    chatInfo?.pendingRequest?.message || null
  );
  const [isPendingRequestSent, setIsPendingRequestSent] = useState<boolean>(
    Boolean(chatInfo?.pendingRequest)
  );

  useEffect(() => {
    setSentRequestText(chatInfo?.pendingRequest?.message || null);
    setIsPendingRequestSent(Boolean(chatInfo?.pendingRequest));
    setInputText("");
    setReplyToMessage(null);
  }, [chatId, chatInfo?.pendingRequest]);

  const messagesList = useMemo(() => {
    if (isDraftConnection) return [];

    // If it's a message request draft, display the sent request message if available
    if (isRequestDraft) {
      const msg = sentRequestText || chatInfo?.pendingRequest?.message;
      if (msg) {
        return [
          {
            id: "sent-request-msg",
            senderId: "me",
            senderName: "You",
            content: msg,
            time: "Request Sent",
            createdAt: new Date().toISOString(),
            quoted: null,
          },
        ];
      }
      return [];
    }

    let rawMsgs: any[] = [];
    if (infiniteData?.pages && infiniteData.pages.length > 0) {
      const allMsgs = infiniteData.pages.flat();
      const map = new Map<string, any>();
      allMsgs.forEach((m) => map.set(m.id, m));
      rawMsgs = Array.from(map.values()).sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (apiMessages && apiMessages.length > 0) {
      rawMsgs = apiMessages;
    }

    if (rawMsgs.length === 0) {
      return [];
    }

    return rawMsgs.map((msg) => ({
      id: msg.id,
      senderId: msg.senderId === user?.id ? "me" : "them",
      senderName:
        msg.senderId === user?.id ? "You" : chatInfo?.name || "Collaborator",
      content: msg.content || "",
      time: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: msg.createdAt,
      quoted: msg.parent
        ? {
            sender:
              msg.parent.senderId === user?.id
                ? "You"
                : chatInfo?.name || "Collaborator",
            text: msg.parent.content,
          }
        : null,
    }));
  }, [
    isDraftConnection,
    isRequestDraft,
    sentRequestText,
    chatInfo?.pendingRequest,
    infiniteData,
    apiMessages,
    user?.id,
    chatInfo?.name,
  ]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    if (
      scrollRef.current.scrollTop < 40 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      const prevScrollHeight = scrollRef.current.scrollHeight;
      fetchNextPage().then(() => {
        if (scrollRef.current) {
          const newScrollHeight = scrollRef.current.scrollHeight;
          scrollRef.current.scrollTop = newScrollHeight - prevScrollHeight;
        }
      });
    }
  };

  // Auto-scroll messages to bottom
  useEffect(() => {
    if (scrollRef.current && !isFetchingNextPage) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messagesList.length, isFetchingNextPage]);

  // Handle Send Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || !chatId) return;

    const currentReplyTo = replyToMessage;
    setInputText("");
    setReplyToMessage(null);

    if (isRequestDraft) {
      const recipientId =
        chatInfo?.recipientId || chatId.replace("request-", "");
      if (recipientId) {
        try {
          await sendRequestMutation.mutateAsync({
            receiverId: recipientId,
            message: text,
          });
          setSentRequestText(text);
          setIsPendingRequestSent(true);
          queryClient.invalidateQueries({
            queryKey: ["messaging", "requests"],
          });
        } catch (err: any) {
          const errMsg =
            err?.response?.data?.error ||
            err?.response?.data?.message ||
            err?.message ||
            "";
          if (errMsg.toLowerCase().includes("already connected")) {
            try {
              const realChat = await createChatMutation.mutateAsync(recipientId);
              await messagingService.sendDirectMessage(realChat.id, {
                content: text,
              });
              queryClient.invalidateQueries({
                queryKey: ["messaging", "chats"],
              });
              queryClient.invalidateQueries({
                queryKey: ["messaging", "chats", realChat.id, "messages"],
              });
            } catch (createErr) {
              console.error("Failed to start direct chat", createErr);
            }
          } else if (errMsg.toLowerCase().includes("already pending")) {
            setSentRequestText(text);
            setIsPendingRequestSent(true);
          }
        }
      }
      return;
    }

    if (isDraftConnection) {
      const recipientId = chatId.replace("connected-", "");
      if (recipientId) {
        try {
          const realChat = await createChatMutation.mutateAsync(recipientId);
          const optimisticMsg: DirectMessage = {
            id: `temp-${Date.now()}`,
            chatId: realChat.id,
            senderId: user?.id || "me",
            content: text,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          queryClient.setQueryData<DirectMessage[]>(
            ["messaging", "chats", realChat.id, "messages"],
            [optimisticMsg]
          );

          await messagingService.sendDirectMessage(realChat.id, {
            content: text,
            parentId: currentReplyTo?.id,
          });

          queryClient.invalidateQueries({
            queryKey: ["messaging", "chats", realChat.id, "messages"],
          });
          queryClient.invalidateQueries({ queryKey: ["messaging", "chats"] });
        } catch (err) {
          console.error("Failed to create chat or send message", err);
        }
      }
      return;
    }

    if (!isMockChat && activeChatId) {
      sendMessageMutation.mutate({
        content: text,
        parentId: currentReplyTo?.id,
      });
    }
  };

  return (
    <div
      className={`flex flex-col bg-[#1A2328]/90 border border-white/10 rounded-[32px] p-5 sm:p-6 shadow-2xl backdrop-blur-md overflow-hidden relative ${className}`}
    >
      {/* Top Header / Recipient Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-2 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 -ml-1 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Back to conversations"
              aria-label="Back to conversations"
            >
              <FiChevronLeft size={20} />
            </button>
          )}
          <div className="relative shrink-0">
            <Avatar
              name={chatInfo?.name || "Chat"}
              src={chatInfo?.avatarUrl}
              className="w-8 h-8 rounded-full object-cover text-xs font-bold border border-white/10"
            />
            {chatInfo?.isOnline && (
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-primary-green rounded-full border-2 border-[#1A2328]" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-raleway font-bold text-xs sm:text-sm text-white truncate">
              {chatInfo?.name || "Conversation"}
            </span>
            <span className="text-[11px] text-white/50 truncate">
              {chatInfo?.isTyping
                ? "typing..."
                : chatInfo?.isOnline
                ? "Online"
                : "Active"}
            </span>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Close chat"
            aria-label="Close chat"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {/* Date Header: "Today" */}
      <div className="flex items-center justify-center pt-1 pb-3 shrink-0">
        <span className="font-raleway text-xs text-white/50 font-medium">
          Today
        </span>
      </div>

      {/* Message Flow Thread */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-5 px-1 sm:px-2 pb-3 min-h-0"
      >
        {isFetchingNextPage && (
          <div className="flex items-center justify-center py-2 text-xs text-white/50 gap-2">
            <div className="w-4 h-4 border-2 border-white/20 border-t-primary-green rounded-full animate-spin" />
            <span>Loading older messages...</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex-1 flex flex-col justify-center items-center py-20 gap-3">
            <div className="w-7 h-7 border-2 border-white/20 border-t-primary-green rounded-full animate-spin" />
            <span className="text-xs text-white/40 font-medium">
              Loading messages...
            </span>
          </div>
        ) : messagesList.length === 0 ? (
          isRequestDraft ? (
            <div className="flex-1 flex flex-col justify-center items-center py-16 text-center px-4 max-w-sm mx-auto animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-full bg-primary-green/20 border border-primary-green/40 flex items-center justify-center text-primary-green mb-3">
                <SendPlaneIcon className="w-5 h-5 ml-0.5" />
              </div>
              <h4 className="font-bold text-sm text-white">
                Message Request to {chatInfo?.name || "Collaborator"}
              </h4>
              <p className="text-xs text-white/50 mt-1.5 leading-relaxed">
                Send an initial message to start a conversation. Once{" "}
                {chatInfo?.name || "they"} accept
                {chatInfo?.name ? "s" : ""} your request, you can chat freely.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center py-20 text-center px-4">
              <p className="text-sm font-semibold text-white/80">
                No messages yet
              </p>
              <p className="text-xs text-white/40 mt-1 max-w-xs">
                Say hello to start the conversation!
              </p>
            </div>
          )
        ) : (
          messagesList.map((msg: any, idx: number) => {
            const isMe = msg.senderId === "me";

            return (
              <div
                key={msg.id || idx}
                className={`flex items-end gap-3 max-w-[85%] sm:max-w-[70%] group ${
                  isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* User Avatar with Green Border */}
                <div className="w-9 h-9 rounded-full border border-primary-green overflow-hidden shrink-0 mb-1 shadow-sm">
                  <Avatar
                    name={
                      isMe
                        ? (user as any)?.displayName ||
                          (user as any)?.legalName ||
                          user?.email ||
                          "You"
                        : msg.senderName
                    }
                    src={
                      isMe ? user?.avatarUrl || undefined : chatInfo?.avatarUrl
                    }
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Message Bubble + Timestamp */}
                <div
                  className={`flex flex-col gap-1 min-w-0 ${isMe ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`p-3.5 sm:p-4 rounded-[20px] shadow-sm relative text-sm leading-relaxed transition-all ${
                      isMe
                        ? "bg-[#204F99] text-white rounded-br-[4px]"
                        : "bg-white text-[#2B4B77] rounded-bl-[4px] font-medium"
                    }`}
                  >
                    {/* Quoted Reply Preview inside bubble */}
                    {msg.quoted && (
                      <div
                        className={`mb-2.5 p-2.5 rounded-xl text-xs ${
                          isMe
                            ? "bg-[#153B75] border-l-2 border-primary-green text-white/90"
                            : "bg-slate-100 border-l-2 border-primary-green text-slate-700"
                        }`}
                      >
                        <span
                          className={`font-semibold block text-[11px] mb-0.5 ${isMe ? "text-[#93C5FD]" : "text-[#2B4B77]"}`}
                        >
                          {msg.quoted.sender}
                        </span>
                        <span
                          className={`line-clamp-2 text-[11px] ${isMe ? "text-white/80" : "text-slate-600"}`}
                        >
                          {msg.quoted.text}
                        </span>
                      </div>
                    )}

                    <span>{msg.content}</span>

                    {/* Reply Action button on hover */}
                    <button
                      onClick={() => setReplyToMessage(msg)}
                      className={`absolute top-2 opacity-0 group-hover:opacity-100 p-1 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all cursor-pointer ${
                        isMe ? "-left-8" : "-right-8"
                      }`}
                      title="Reply to message"
                    >
                      <FiCornerUpLeft size={12} />
                    </button>
                  </div>

                  {/* Sender Name & Timestamp under bubble */}
                  <span className="text-[11px] text-white/40 px-1 mt-0.5 font-medium">
                    {msg.senderName} • {msg.time}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator bubble (only if user is actively typing) */}
        {Boolean(chatInfo?.isTyping) && (
          <div className="flex items-end gap-3 mr-auto max-w-[70%]">
            <div className="w-9 h-9 rounded-full border border-primary-green overflow-hidden shrink-0 mb-1">
              <Avatar
                name={chatInfo?.name || "Maya Johnson"}
                src={chatInfo?.avatarUrl}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-white px-4 py-3 rounded-[20px] rounded-bl-[4px] flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#2B4B77] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#2B4B77] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#2B4B77] animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {replyToMessage && (
        <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-2xl px-4 py-2 text-xs text-white/70 mb-3 shrink-0">
          <div className="flex items-center gap-2 truncate">
            <FiCornerUpLeft className="text-primary-green shrink-0" size={14} />
            <span className="truncate">
              Replying to{" "}
              <strong className="text-white">
                {replyToMessage.senderName}
              </strong>
              : &quot;{replyToMessage.content}&quot;
            </span>
          </div>
          <button
            onClick={() => setReplyToMessage(null)}
            className="text-white/50 hover:text-white p-1 cursor-pointer"
          >
            <FiX size={14} />
          </button>
        </div>
      )}

      {/* Bottom Control Bar matching design: File Icon + Mic Icon + White Pill with Send Plane */}
      <div className="pt-2 flex items-center gap-2.5 z-10 shrink-0">
        {isRequestDraft &&
        (isPendingRequestSent ||
          Boolean(sentRequestText) ||
          Boolean(chatInfo?.pendingRequest)) ? (
          <div className="w-full flex items-center justify-between bg-black/40 border border-white/10 rounded-full px-5 py-3 text-xs text-white/70 shadow-inner">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span className="truncate">
                Message request pending. Waiting for{" "}
                <strong className="text-white font-semibold">
                  {chatInfo?.name || "recipient"}
                </strong>{" "}
                to accept or ignore.
              </span>
            </div>
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-full text-[11px] font-semibold shrink-0 ml-2">
              Pending
            </span>
          </div>
        ) : (
          <>
            {/* Attachment Button */}
            <button
              type="button"
              disabled={isRequestDraft}
              className="w-11 h-11 rounded-full bg-[#131A1F] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/20 transition-all cursor-pointer shrink-0 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              title="Attach file"
            >
              <FileDocIcon />
            </button>

            {/* Voice Note Mic Button */}
            <button
              type="button"
              disabled={isRequestDraft}
              className="w-11 h-11 rounded-full bg-[#131A1F] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/20 transition-all cursor-pointer shrink-0 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              title="Voice note"
            >
              <FiMic size={18} />
            </button>

            {/* Text Input & Green Plane Send Button */}
            <form
              onSubmit={handleSendMessage}
              className="flex-1 flex items-center bg-white rounded-full pl-5 pr-1.5 py-1.5 shadow-lg relative"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  isRequestDraft
                    ? `Send a message request to ${chatInfo?.name || "collaborator"}...`
                    : "You are welcome!"
                }
                disabled={
                  sendMessageMutation.isPending || sendRequestMutation.isPending
                }
                className="flex-1 bg-transparent border-none outline-none text-slate-800 font-medium text-xs sm:text-sm placeholder:text-slate-400 py-1.5 min-w-0 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={
                  !inputText.trim() ||
                  sendMessageMutation.isPending ||
                  sendRequestMutation.isPending
                }
                className="w-9.5 h-9.5 rounded-full bg-[#22C55E] hover:bg-[#16A34A] active:scale-95 disabled:opacity-40 flex items-center justify-center text-white transition-all shadow-md shrink-0 cursor-pointer ml-2"
                title="Send message"
              >
                {sendRequestMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <SendPlaneIcon className="ml-0.5" />
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
