"use client";

import React from "react";
import Avatar from "@/app/components/ui/Avatar";

// Mock data
const MOCK_MESSAGES = [
  {
    id: 1,
    sender: "Maya Johnson",
    time: "2:30 PM",
    text: "Just uploaded the new beat, check it out!",
    isMe: false,
    avatar: "/mock-profiles/small.png"
  },
  {
    id: 2,
    sender: "You",
    time: "2:35 PM",
    text: "Fire! I'll lay some vocals over it tonight 🔥",
    isMe: true,
    avatar: "/avatar.svg"
  },
  {
    id: 3,
    sender: "Alex Rivera",
    time: "2:48 PM",
    text: "Love the direction. I can add some bass lines tomorrow.",
    isMe: false,
    avatar: "/mock-profiles/small3.png"
  },
  {
    id: 4,
    sender: "You",
    time: "2:52 PM",
    text: "Perfect, let's aim to have the rough mix by Friday",
    isMe: true,
    avatar: "/avatar.svg"
  }
];

export default function WorkspaceMessagesPage() {
  return (
    <div className="flex flex-col w-full h-full animate-in fade-in duration-300">
      
      {/* Messages Container */}
      <div className="flex flex-col gap-8 w-full max-w-[900px] mx-auto pt-4 pb-20">
        
        {MOCK_MESSAGES.map((msg) => {
          const isMe = msg.isMe;

          return (
            <div 
              key={msg.id} 
              className={`flex items-start gap-4 max-w-[80%] ${
                isMe ? "self-end" : "self-start"
              }`}
            >
              
              {/* Avatar for others (Left side) */}
              {!isMe && (
                <div className="w-[45px] h-[45px] rounded-full border border-primary-green shrink-0 overflow-hidden relative">
                  <Avatar name={msg.sender} src={msg.avatar} className="w-full h-full" />
                </div>
              )}

              {/* Message Bubble & Metadata */}
              <div className={`flex flex-col gap-2 ${isMe ? "items-end" : "items-start"}`}>
                
                {/* Bubble */}
                <div 
                  className={`px-4 py-3 w-fit ${
                    isMe 
                      ? "bg-[#204F99] rounded-[17px] rounded-br-none" // Blue for User
                      : "bg-primary-green rounded-[17px] rounded-bl-none" // Green for others
                  }`}
                >
                  <p className="font-sans font-medium text-[16px] leading-[24px] text-white">
                    {msg.text}
                  </p>
                </div>

                {/* Metadata (Name • Time) */}
                <span className="font-sans font-light text-[13px] leading-[20px] text-white/50">
                  {msg.sender} • {msg.time}
                </span>

              </div>

              {/* Avatar for User (Right side) */}
              {isMe && (
                <div className="w-[45px] h-[45px] rounded-full border border-primary-green shrink-0 overflow-hidden relative">
                  <Avatar name="You" src={msg.avatar} className="w-full h-full" />
                </div>
              )}

            </div>
          );
        })}

        {/* Typing Indicator */}
        <div className="flex items-start gap-4 max-w-[80%] self-start mt-2">
          
          <div className="w-[45px] h-[45px] rounded-full border border-primary-green shrink-0 overflow-hidden relative">
            <Avatar name="Typing" src="/mock-profiles/small3.png" className="w-full h-full" />
          </div>

          <div className="flex flex-col gap-2 items-start">
            <div className="bg-primary-green/80 rounded-[16px] rounded-bl-none h-[45px] px-[16px] flex items-center justify-center gap-1 w-fit">
              {/* Animated dots */}
              <span className="font-sans font-black text-[22px] leading-[33px] text-white/50 animate-[bounce_1s_infinite_0ms]">•</span>
              <span className="font-sans font-black text-[22px] leading-[33px] text-white/50 animate-[bounce_1s_infinite_200ms]">•</span>
              <span className="font-sans font-black text-[22px] leading-[33px] text-white/50 animate-[bounce_1s_infinite_400ms]">•</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}