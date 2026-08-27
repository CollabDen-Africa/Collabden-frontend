"use client";

import React, { useState, useRef, useEffect } from "react";
import { HiOutlinePaperClip, HiOutlineLockClosed } from "react-icons/hi";
import { IoSend } from "react-icons/io5";
import { SupportMessage } from "@/services/admin/support.service";

interface SupportConversationTabProps {
  messages: SupportMessage[];
  isLoading: boolean;
  onSendMessage: (content: string, isInternalNote?: boolean) => Promise<SupportMessage | null>;
}

export const SupportConversationTab: React.FC<SupportConversationTabProps> = ({
  messages,
  isLoading,
  onSendMessage,
}) => {
  const [replyText, setReplyText] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!replyText.trim() || isSending) return;
    setIsSending(true);
    try {
      await onSendMessage(replyText.trim(), isInternalNote);
      setReplyText("");
    } catch (err) {
      console.error("Failed to send message:", err);
    } flex: {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="w-8 h-8 border-2 border-primary-green border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-text-muted mt-3">Loading conversation history...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card-bg-alt/20 rounded-2xl border border-white/5 overflow-hidden">
      {/* Message Thread */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4 max-h-125">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-text-muted">No messages yet. Start the conversation below.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isAdmin = msg.senderRole === "admin";
            const isNote = msg.isInternalNote;

            if (isNote) {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="max-w-[85%] px-4 py-3 rounded-xl bg-accent-yellow/10 border border-accent-yellow/20 shadow-sm">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="text-[10px] font-bold text-accent-yellow uppercase tracking-wider flex items-center gap-1">
                        <HiOutlineLockClosed size={12} /> Internal Note
                      </span>
                      <span className="text-[10px] text-accent-yellow/60">{formatTime(msg.createdAt)}</span>
                    </div>
                    <p className="text-xs text-accent-yellow/90 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] flex flex-col gap-1 ${isAdmin ? "items-end" : "items-start"}`}>
                  {/* Sender Info */}
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary-green/20 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-primary-green">
                        {msg.senderName ? msg.senderName.charAt(0) : "U"}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-white">{msg.senderName || "User"}</span>
                    {isAdmin && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary-green/10 text-primary-green border border-primary-green/20">
                        Support Admin
                      </span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap ${
                      isAdmin
                        ? "bg-primary-green/10 border border-primary-green/20 text-white/90 rounded-2xl rounded-tr-none"
                        : "bg-white/5 border border-white/10 text-white/80 rounded-2xl rounded-tl-none"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Timestamp */}
                  <span className="text-[10px] text-text-muted px-1">{formatTime(msg.createdAt)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reply Options Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/5 bg-white/5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInternalNote(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              !isInternalNote
                ? "bg-primary-green text-text-main"
                : "bg-white/5 text-text-muted hover:text-white"
            }`}
          >
            Public Reply
          </button>
          <button
            onClick={() => setIsInternalNote(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              isInternalNote
                ? "bg-accent-yellow text-text-main"
                : "bg-white/5 text-text-muted hover:text-white"
            }`}
          >
            <HiOutlineLockClosed size={13} /> Internal Note
          </button>
        </div>
      </div>

      {/* Reply Input */}
      <div className="p-4 border-t border-white/5 bg-white/5">
        <div className="flex items-end gap-2">
          <button className="shrink-0 p-2.5 rounded-xl bg-white/5 border border-white/10 text-text-muted/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <HiOutlinePaperClip size={16} />
          </button>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isInternalNote ? "Type an internal admin note..." : "Type a response to user..."}
            rows={2}
            className={`flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-text-muted/40 focus:outline-none transition-colors resize-none ${
              isInternalNote ? "focus:border-accent-yellow" : "focus:border-primary-green"
            }`}
          />
          <button
            onClick={handleSend}
            disabled={!replyText.trim() || isSending}
            className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50 ${
              isInternalNote ? "bg-accent-yellow text-text-main" : "bg-primary-green text-text-main"
            }`}
          >
            {isSending ? "Sending..." : "Send"} <IoSend size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportConversationTab;
