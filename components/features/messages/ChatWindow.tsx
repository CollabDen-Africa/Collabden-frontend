"use client";

import React, { useState, useRef, useEffect } from "react";
import EmptyState from "@/components/ui/EmptyState";
import { FiSend, FiX, FiMessageSquare } from "react-icons/fi";
import { useMessaging } from "@/hooks/messaging/useMessaging";

interface Props {
  chatId: string | null;
  onClose: () => void;
}

export default function ChatWindow({ chatId, onClose }: Props) {
  const [inputText, setInputText] = useState("");
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { useChatMessages, useSendMessage } = useMessaging();
  const { data: apiMessages = [], isLoading } = useChatMessages(chatId || "");
  const sendMessageMutation = useSendMessage(chatId || "");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [apiMessages]);

  if (!chatId) {
    return (
      <div className="hidden lg:flex flex-1 items-center justify-center bg-white/10 rounded-[30px] border border-white/5 shadow-2xl h-full p-8 text-center">
        <EmptyState 
          icon={<FiMessageSquare size={48} className="text-white/30" />}
          title="Select a message"
          description="Choose a conversation from the left to start collaborating and sharing tracks."
        />
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !chatId) return;

    sendMessageMutation.mutate({
      content: inputText,
      parentId: replyingTo?.id,
    });

    setInputText("");
    setReplyingTo(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-white/10 rounded-[30px] transition-all duration-500 relative shadow-2xl backdrop-blur-md h-full w-full overflow-hidden border border-white/5">
      
      <div className="h-16 border-b border-white/10 px-6 flex items-center justify-between shrink-0 bg-black/20">
        <div className="flex items-center gap-3">
          <span className="text-white font-medium text-[15px]">Active Conversation</span>
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
          <FiX size={24} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-4 pb-32">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-5 h-5 border-2 border-white/20 border-t-primary-green rounded-full animate-spin" />
          </div>
        ) : apiMessages.length === 0 ? (
          <div className="text-center py-12 text-xs text-white/40">
            No messages in this chat yet. Send a message to start the conversation!
          </div>
        ) : (
          apiMessages.map((msg: any) => (
            <div key={msg.id} className="flex flex-col gap-1">
              <div className="bg-white/10 border border-white/10 p-3.5 rounded-2xl max-w-[80%] text-white text-sm">
                <span className="text-[11px] font-bold text-primary-green block mb-1">
                  {msg.sender?.displayName || msg.sender?.email || "User"}
                </span>
                <span>{msg.content}</span>
              </div>
              <span className="text-[10px] text-white/40 px-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="absolute bottom-4 left-0 w-full px-6 z-20">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-white rounded-full p-1.5 shadow-xl">
          <input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-transparent px-4 text-black text-sm outline-none placeholder:text-black/50 font-medium"
            placeholder="Type a message..."
          />
          <button 
            type="submit" 
            disabled={!inputText.trim() || sendMessageMutation.isPending}
            className="w-10 h-10 rounded-full bg-primary-green flex items-center justify-center text-white disabled:opacity-50 hover:brightness-110 transition-all shrink-0"
          >
            <FiSend size={16} />
          </button>
        </form>
      </div>

    </div>
  );
}
