import React from "react";
import Avatar from "@/components/ui/Avatar";

export interface TypingUser {
  id: string;
  name: string;
  avatar: string;
  isMe: boolean;
}

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

export default function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (!typingUsers || typingUsers.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 mt-2">
      {typingUsers.map((user) => (
        <div 
          key={user.id} 
          className={`flex items-end gap-3 w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${user.isMe ? "flex-row-reverse" : "flex-row"}`}
        >
          <div className="w-[45px] h-[45px] rounded-full border border-primary-green overflow-hidden shrink-0 opacity-80">
            <Avatar name={user.name} src={user.avatar} className="w-full h-full" />
          </div>
          <div className={`flex flex-col gap-2 ${user.isMe ? "items-end" : "items-start"}`}>
            <div className={`px-5 py-4 flex items-center justify-center gap-[6px] h-[50px] min-w-[80px] ${user.isMe ? "bg-primary-blue rounded-msg-me" : "bg-white rounded-msg-them"}`}>
              <div className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s] ${user.isMe ? "bg-white/60" : "bg-primary-blue/40"}`} />
              <div className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s] ${user.isMe ? "bg-white/60" : "bg-primary-blue/40"}`} />
              <div className={`w-2 h-2 rounded-full animate-bounce ${user.isMe ? "bg-white/60" : "bg-primary-blue/40"}`} />
            </div>
            <span className="font-poppins font-light text-[11px] text-white/30 px-1 italic">
              {user.isMe ? "You are typing..." : `${user.name} is typing...`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}