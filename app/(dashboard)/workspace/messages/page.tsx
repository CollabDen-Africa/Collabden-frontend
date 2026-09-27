"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/hooks/projects/useProjects";
import { getErrorMessage } from "@/lib/error-handler";

const formatTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(date);
};

export default function MessagesPage() {
  const { projectDetails, activeProject, isLoading } = useWorkspace();
  const { user } = useAuth();
  const projectId = projectDetails?.id || activeProject?.id || "";
  const messages = useMemo(
    () => [...(projectDetails?.messages || activeProject?.messages || [])]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [projectDetails?.messages, activeProject?.messages],
  );
  const [inputText, setInputText] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { useSendProjectMessage } = useProjects();
  const sendMessage = useSendProjectMessage(projectId);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const content = inputText.trim();
    if (!content || !projectId || sendMessage.isPending) return;

    setSendError(null);
    try {
      await sendMessage.mutateAsync(content);
      setInputText("");
    } catch (error) {
      setSendError(getErrorMessage(error));
    }
  };

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-full max-w-[1224px] h-[638px] bg-white/5 border border-white/10 rounded-[30px] flex flex-col relative overflow-hidden backdrop-blur-md shadow-2xl">
        <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-8 pb-[104px]">
          {isLoading && <p className="text-center text-sm text-white/60 py-8">Loading messages…</p>}
          {!isLoading && messages.length === 0 && <p className="text-center text-sm text-white/60 py-8">No messages in this project yet.</p>}
          {!isLoading && messages.map((message) => {
            const isMe = message.senderId === user?.id;
            const senderName = message.sender?.displayName || message.sender?.legalName || message.sender?.email?.split("@")[0] || "Project member";
            return (
              <div key={message.id} className={`flex items-end gap-3 w-full ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                <div className="w-[45px] h-[45px] rounded-full border border-primary-green overflow-hidden shrink-0">
                  <Avatar name={senderName} src={message.sender?.avatarUrl || undefined} className="w-full h-full" />
                </div>
                <div className={`flex flex-col gap-2 max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                  <div className={`px-5 py-4 shadow-sm font-poppins ${isMe ? "bg-primary-blue text-white rounded-msg-me" : "bg-white text-primary-blue/50 rounded-msg-them"}`}>
                    <p className={`font-medium text-[16px] leading-[24px] whitespace-pre-wrap ${isMe ? "text-white" : "text-primary-blue/80"}`}>{message.content}</p>
                  </div>
                  <span className="font-poppins font-light text-[13px] text-white/40 px-1">{senderName} • {formatTime(message.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-6 left-0 w-full px-6 z-20">
          <form onSubmit={handleSendMessage} className="w-full h-[56px] bg-white rounded-full flex items-center px-6 relative shadow-xl focus-within:outline-2 focus-within:outline-primary-green">
            <input type="text" value={inputText} onChange={(event) => setInputText(event.target.value)} disabled={!projectId || sendMessage.isPending} className="flex-1 h-full bg-transparent border-none outline-none font-sans font-medium text-[16px] text-black/80 disabled:cursor-not-allowed" placeholder={projectId ? "Message..." : "Select a project to message"} />
            <button type="submit" disabled={!inputText.trim() || !projectId || sendMessage.isPending} className="absolute right-0 w-[54px] h-[54px] bg-primary-green rounded-full flex items-center justify-center hover:brightness-110 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Send message">
              <FiSend size={20} className="text-white relative right-[1px] top-[1px]" />
            </button>
          </form>
          {sendError && <p className="mt-2 text-sm text-red-300">{sendError}</p>}
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[120px] bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
