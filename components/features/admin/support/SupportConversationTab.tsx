"use client";

import React, { useState, useRef, useEffect } from "react";
import { HiOutlinePaperClip } from "react-icons/hi";
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
    await onSendMessage(replyText.trim(), false);
    setReplyText("");
    setIsSending(false);
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
        <p className="text-xs text-text-muted mt-3">Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Message Thread */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 space-y-4 max-h-125">
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
                  <div className="max-w-[80%] px-4 py-3 rounded-xl bg-accent-yellow/10 border border-accent-yellow/20">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-accent-yellow uppercase tracking-wider">
                        Internal Note
                      </span>
                      <span className="text-[10px] text-accent-yellow/60">{formatTime(msg.createdAt)}</span>
                    </div>
                    <p className="text-xs text-accent-yellow/90 leading-relaxed">{msg.content}</p>
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
                        {msg.senderName.charAt(0)}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-white">{msg.senderName}</span>
                    {isAdmin && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary-green/10 text-primary-green border border-primary-green/20">
                        Support Admin
                      </span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-3 text-xs leading-relaxed ${
                      isAdmin
                        ? "bg-primary-green/10 border border-primary-green/20 text-white/90 rounded-msg-me"
                        : "bg-white/5 border border-white/10 text-white/80 rounded-msg-them"
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

      {/* Reply Actions */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-white/5">
        <button className="px-3 py-1.5 rounded-xl bg-accent-red/10 border border-accent-red/20 text-xs font-semibold text-accent-red hover:bg-accent-red/20 transition-colors cursor-pointer">
          Reject Ticket
        </button>
        <button className="px-3 py-1.5 rounded-xl bg-primary-green/10 border border-primary-green/20 text-xs font-semibold text-primary-green hover:bg-primary-green/20 transition-colors cursor-pointer">
          Escalate
        </button>
      </div>

      {/* Reply Input */}
      <div className="px-4 py-3 border-t border-white/5 bg-white/2">
        <div className="flex items-end gap-2">
          <button className="shrink-0 p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
            <HiOutlinePaperClip size={16} />
          </button>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a reply..."
            rows={1}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-primary-green/40 resize-none transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!replyText.trim() || isSending}
            className="shrink-0 p-2.5 rounded-xl bg-primary-green text-text-main hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoSend size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportConversationTab;
