"use client";

import React, { useCallback, useState, useRef, useEffect, useMemo } from "react";
import Avatar from "@/components/ui/Avatar";
import { FiMic, FiCornerUpLeft, FiX, FiChevronLeft, FiSquare, FiTrash2, FiDownload, FiFile } from "react-icons/fi";
import { useMessaging } from "@/hooks/messaging/useMessaging";
import { useVoiceRecorder } from "@/hooks/messaging/useVoiceRecorder";
import messagingService from "@/services/messaging.service";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import type { DirectMessage } from "@/types/api.types";
import type { AttachmentInput } from "@/types/messaging.types";
import { MAX_DM_ATTACHMENT_BYTES, MAX_ATTACHMENTS_PER_MESSAGE } from "@/types/messaging.types";
import type { DirectMessageItem } from "./DirectMessagesList";
import VoiceNotePlayer from "./VoiceNotePlayer";
import MessageReactions from "./MessageReactions";
import { useRealtime, useTypingStatus } from "@/context/RealtimeContext";

const formatDuration = (totalSeconds: number) => {
  const safe = Math.max(0, Math.round(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatDayLabel = (iso: string): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const startOfDay = (date: Date) => {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
  };
  const today = startOfDay(new Date());
  const target = startOfDay(d);
  const diffDays = Math.round((today.getTime() - target.getTime()) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  const sameYear = today.getFullYear() === target.getFullYear();
  return target.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
    weekday: diffDays < 7 ? "long" : undefined,
  });
};

const sameDay = (a?: string, b?: string): boolean => {
  if (!a || !b) return false;
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
};

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
  const [isSendingVoice, setIsSendingVoice] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [attachmentError, setAttachmentError] = useState<string | null>(null);
  const [isUploadingAttachments, setIsUploadingAttachments] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const voiceRecorder = useVoiceRecorder();

  const {
    useChatMessages,
    useInfiniteChatMessages,
    useSendMessage,
    useCreateChat,
    useSendRequest,
    useToggleReaction,
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
  const toggleReactionMutation = useToggleReaction(activeChatId);

  const handleToggleReaction = (messageId: string, emoji: string) => {
    if (!activeChatId || !messageId) return;
    toggleReactionMutation.mutate({ messageId, emoji });
  };

  // --- Typing indicator ---
  const { sendTyping } = useRealtime();
  const otherIsTyping = useTypingStatus(activeChatId);
  const typingStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const localIsTypingRef = useRef<boolean>(false);
  const recipientId = chatInfo?.recipientId;

  const emitTypingStop = useCallback(() => {
    if (!activeChatId || !recipientId || !localIsTypingRef.current) return;
    localIsTypingRef.current = false;
    sendTyping(recipientId, activeChatId, false);
  }, [activeChatId, recipientId, sendTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (!activeChatId || !recipientId) return;

    if (!localIsTypingRef.current && e.target.value.trim().length > 0) {
      localIsTypingRef.current = true;
      sendTyping(recipientId, activeChatId, true);
    }

    if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
    typingStopTimerRef.current = setTimeout(() => {
      emitTypingStop();
    }, 2_500);
  };

  // Reset local typing state when chat switches or on unmount.
  useEffect(() => {
    return () => {
      if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
      emitTypingStop();
    };
  }, [activeChatId, emitTypingStop]);

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
    setVoiceError(null);
    voiceRecorder.reset();
    // We intentionally omit voiceRecorder from deps to avoid resetting on every tick.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      voiceUrl: msg.voiceUrl || null,
      voiceDuration: msg.voiceDuration || null,
      reactions: Array.isArray(msg.reactions) ? msg.reactions : [],
      attachments: Array.isArray(msg.attachments) ? msg.attachments : [],
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
            text: msg.parent.voiceUrl ? "🎤 Voice message" : msg.parent.content,
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

  const canUseVoice =
    !isRequestDraft &&
    !isDraftConnection &&
    !isMockChat &&
    Boolean(activeChatId) &&
    voiceRecorder.isSupported;

  const startRecording = async () => {
    setVoiceError(null);
    if (!canUseVoice) {
      if (!voiceRecorder.isSupported) {
        setVoiceError("Voice recording is not supported in this browser.");
      }
      return;
    }
    await voiceRecorder.start();
    if (voiceRecorder.error) {
      setVoiceError(voiceRecorder.error);
    }
  };

  const cancelRecording = () => {
    voiceRecorder.cancel();
    setVoiceError(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const oversized = files.filter((f) => f.size > MAX_DM_ATTACHMENT_BYTES);
    const valid = files.filter((f) => f.size <= MAX_DM_ATTACHMENT_BYTES);
    if (oversized.length > 0) {
      setAttachmentError(`${oversized.map((f) => f.name).join(", ")} exceed${oversized.length === 1 ? "s" : ""} the 10 MB limit.`);
    } else {
      setAttachmentError(null);
    }
    setAttachmentFiles((prev) =>
      [...prev, ...valid].slice(0, MAX_ATTACHMENTS_PER_MESSAGE)
    );
    e.target.value = "";
  };

  const removeAttachment = (idx: number) => {
    setAttachmentFiles((prev) => prev.filter((_, i) => i !== idx));
    setAttachmentError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const sendRecordedVoice = async () => {
    if (!activeChatId || isSendingVoice) return;

    let recorded = voiceRecorder.recording;
    if (voiceRecorder.state === "recording") {
      recorded = await voiceRecorder.stop();
    }
    if (!recorded) {
      setVoiceError("Recording was empty. Try again.");
      return;
    }

    const currentReplyTo = replyToMessage;
    setReplyToMessage(null);
    setIsSendingVoice(true);
    setVoiceError(null);
    try {
      const extFromMime = recorded.mimeType.includes("ogg")
        ? "ogg"
        : recorded.mimeType.includes("mp4")
          ? "m4a"
          : "webm";
      const filename = `voice-note-${Date.now()}.${extFromMime}`;
      const uploaded = await messagingService.uploadVoiceNote(
        recorded.blob,
        recorded.durationSeconds,
        filename,
      );
      await sendMessageMutation.mutateAsync({
        voiceUrl: uploaded.path,
        voiceDuration: uploaded.durationSeconds,
        parentId: currentReplyTo?.id,
      });
      voiceRecorder.reset();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send voice note.";
      setVoiceError(msg);
    } finally {
      setIsSendingVoice(false);
    }
  };

  // Handle Send Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text && attachmentFiles.length === 0) return;
    if (!chatId) return;

    const currentReplyTo = replyToMessage;
    setInputText("");
    setReplyToMessage(null);
    setAttachmentError(null);
    if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
    emitTypingStop();

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
      let uploadedAttachments: AttachmentInput[] = [];
      const filesToUpload = attachmentFiles;
      if (filesToUpload.length > 0) {
        setAttachmentFiles([]);
        setIsUploadingAttachments(true);
        try {
          uploadedAttachments = await Promise.all(
            filesToUpload.map(async (file) => {
              const res = await messagingService.uploadAttachment(file);
              return { url: res.path, name: res.name, mimeType: res.mimeType, size: res.size };
            })
          );
        } catch (err: any) {
          setAttachmentError(err?.response?.data?.message || err?.message || "Failed to upload attachment(s).");
          setAttachmentFiles(filesToUpload);
          setIsUploadingAttachments(false);
          return;
        }
        setIsUploadingAttachments(false);
      }

      sendMessageMutation.mutate({
        content: text || undefined,
        parentId: currentReplyTo?.id,
        attachments: uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
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
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-raleway font-bold text-xs sm:text-sm text-white truncate">
              {chatInfo?.name || "Conversation"}
            </span>
            {otherIsTyping && (
              <span className="text-[11px] text-primary-green truncate font-medium">
                typing...
              </span>
            )}
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
            const prev = idx > 0 ? messagesList[idx - 1] : null;
            const showDayDivider =
              !!msg.createdAt && !sameDay(prev?.createdAt, msg.createdAt);

            const bubble = (
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

                    {msg.voiceUrl ? (
                      <VoiceNotePlayer
                        src={msg.voiceUrl}
                        durationSeconds={msg.voiceDuration || 0}
                        variant={isMe ? "dark" : "light"}
                      />
                    ) : (
                      msg.content && <span>{msg.content}</span>
                    )}

                    {/* Attachment rendering */}
                    {msg.attachments?.length > 0 && (
                      <div className={`flex flex-col gap-2 ${msg.content ? "mt-2.5" : ""}`}>
                        {msg.attachments.map((att: any, i: number) => {
                          const isImage = att.mimeType?.startsWith("image/");
                          if (isImage) {
                            return (
                              <a key={i} href={att.url} target="_blank" rel="noopener noreferrer" className="block">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={att.url}
                                  alt={att.name || "Image"}
                                  className="rounded-xl max-w-[220px] max-h-52 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                />
                              </a>
                            );
                          }
                          return (
                            <a
                              key={i}
                              href={att.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              download={att.name || true}
                              className={`flex items-center gap-2.5 p-2.5 rounded-xl hover:opacity-80 transition-opacity ${isMe ? "bg-[#153B75]" : "bg-slate-100"}`}
                            >
                              <FileDocIcon className={`shrink-0 ${isMe ? "text-[#93C5FD]" : "text-[#2B4B77]"}`} />
                              <div className="flex flex-col min-w-0 flex-1">
                                <span className={`text-xs font-medium truncate ${isMe ? "text-white" : "text-[#2B4B77]"}`}>
                                  {att.name || "File"}
                                </span>
                                {att.size && (
                                  <span className={`text-[11px] ${isMe ? "text-white/60" : "text-slate-500"}`}>
                                    {formatFileSize(att.size)}
                                  </span>
                                )}
                              </div>
                              <FiDownload size={14} className={`shrink-0 ${isMe ? "text-white/60" : "text-slate-400"}`} />
                            </a>
                          );
                        })}
                      </div>
                    )}

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

                  {/* Emoji reactions row */}
                  {!isRequestDraft && !isDraftConnection && (
                    <MessageReactions
                      reactions={msg.reactions}
                      currentUserId={user?.id}
                      onToggle={(emoji) => handleToggleReaction(msg.id, emoji)}
                      disabled={toggleReactionMutation.isPending || !activeChatId}
                      variant={isMe ? "dark" : "light"}
                      align={isMe ? "right" : "left"}
                    />
                  )}

                  {/* Sender Name & Timestamp under bubble */}
                  <span className="text-[11px] text-white/40 px-1 mt-0.5 font-medium">
                    {msg.senderName} • {msg.time}
                  </span>
                </div>
              </div>
            );

            if (!showDayDivider) return bubble;

            return (
              <React.Fragment key={`group-${msg.id || idx}`}>
                <div className="flex items-center justify-center py-1">
                  <span className="font-raleway text-xs text-white/50 font-medium px-3 py-1 rounded-full bg-white/5 border border-white/10">
                    {formatDayLabel(msg.createdAt)}
                  </span>
                </div>
                {bubble}
              </React.Fragment>
            );
          })
        )}

        {/* Typing indicator bubble — driven by live WS TYPING events. */}
        {otherIsTyping && (
          <div className="flex items-end gap-3 mr-auto max-w-[70%]">
            <div className="w-9 h-9 rounded-full border border-primary-green overflow-hidden shrink-0 mb-1">
              <Avatar
                name={chatInfo?.name || "Collaborator"}
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

      {/* Attachment preview chips */}
      {attachmentFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 shrink-0">
          {attachmentFiles.map((file, idx) => {
            const isImage = file.type.startsWith("image/");
            const previewUrl = isImage ? URL.createObjectURL(file) : null;
            return (
              <div
                key={idx}
                className="flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-full pl-2 pr-1.5 py-1 text-xs text-white/80 max-w-48 group"
              >
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt={file.name} className="w-5 h-5 rounded-full object-cover shrink-0" />
                ) : (
                  <FiFile size={12} className="shrink-0 text-white/50" />
                )}
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(idx)}
                  className="shrink-0 text-white/40 hover:text-white transition-colors"
                >
                  <FiX size={12} />
                </button>
              </div>
            );
          })}
          {isUploadingAttachments && (
            <div className="flex items-center gap-1.5 text-xs text-white/50 px-2">
              <div className="w-3 h-3 border border-white/20 border-t-primary-green rounded-full animate-spin" />
              Uploading…
            </div>
          )}
        </div>
      )}

      {/* Attachment / voice error */}
      {(attachmentError) && (
        <div className="text-[11px] text-rose-300 bg-rose-900/40 border border-rose-500/40 rounded-full px-3 py-1 mb-2 shrink-0 truncate">
          {attachmentError}
        </div>
      )}

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
            {voiceRecorder.state === "idle" && (
              <>
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />

                {/* Attachment Button */}
                <button
                  type="button"
                  disabled={isRequestDraft || isUploadingAttachments}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-11 h-11 rounded-full bg-[#131A1F] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/20 transition-all cursor-pointer shrink-0 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Attach file"
                >
                  <FileDocIcon />
                </button>

                {/* Voice Note Mic Button */}
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={!canUseVoice || isSendingVoice}
                  className="w-11 h-11 rounded-full bg-[#131A1F] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/20 transition-all cursor-pointer shrink-0 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  title={voiceRecorder.isSupported ? "Record voice note" : "Voice recording not supported in this browser"}
                >
                  <FiMic size={18} />
                </button>
              </>
            )}


            {voiceRecorder.state === "recording" ? (
              <div className="flex-1 flex items-center gap-3 bg-[#131A1F] border border-rose-500/40 rounded-full pl-5 pr-1.5 py-1.5 shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                <span className="text-xs font-semibold text-white truncate">
                  Recording {formatDuration(voiceRecorder.elapsedSeconds)}
                </span>
                <div className="flex-1" />
                <button
                  type="button"
                  onClick={cancelRecording}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer shrink-0"
                  title="Discard recording"
                  aria-label="Discard recording"
                >
                  <FiTrash2 size={15} />
                </button>
                <button
                  type="button"
                  onClick={sendRecordedVoice}
                  disabled={isSendingVoice}
                  className="w-9 h-9 rounded-full bg-[#22C55E] hover:bg-[#16A34A] active:scale-95 disabled:opacity-40 flex items-center justify-center text-white transition-all shadow-md shrink-0 cursor-pointer"
                  title="Stop and send"
                  aria-label="Stop and send"
                >
                  <FiSquare size={13} />
                </button>
              </div>
            ) : voiceRecorder.state === "stopped" && voiceRecorder.recording ? (
              <div className="flex-1 flex items-center gap-3 bg-white rounded-full pl-3 pr-1.5 py-1.5 shadow-lg">
                <VoiceNotePlayer
                  src={voiceRecorder.recording.objectUrl}
                  durationSeconds={voiceRecorder.recording.durationSeconds}
                  variant="light"
                  className="flex-1 min-w-0"
                />
                <button
                  type="button"
                  onClick={cancelRecording}
                  disabled={isSendingVoice}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 flex items-center justify-center text-slate-500 transition-all cursor-pointer shrink-0"
                  title="Discard"
                  aria-label="Discard"
                >
                  <FiTrash2 size={15} />
                </button>
                <button
                  type="button"
                  onClick={sendRecordedVoice}
                  disabled={isSendingVoice}
                  className="w-9 h-9 rounded-full bg-[#22C55E] hover:bg-[#16A34A] active:scale-95 disabled:opacity-40 flex items-center justify-center text-white transition-all shadow-md shrink-0 cursor-pointer"
                  title="Send voice note"
                  aria-label="Send voice note"
                >
                  {isSendingVoice ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <SendPlaneIcon className="ml-0.5" />
                  )}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSendMessage}
                className="flex-1 flex items-center bg-white rounded-full pl-5 pr-1.5 py-1.5 shadow-lg relative"
              >
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
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
            )}
            {voiceError && (
              <div className="absolute -top-7 left-16 right-4 text-[11px] text-rose-300 bg-rose-900/40 border border-rose-500/40 rounded-full px-3 py-1 truncate">
                {voiceError}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
