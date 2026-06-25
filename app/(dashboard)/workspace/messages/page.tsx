"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiFolder, FiMic, FiSend, FiCornerUpLeft, FiX } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import TypingIndicator, { TypingUser } from "@/components/ui/TypingIndicator"; 
import { MOCK_MESSAGES } from "@/lib/mockData";

export default function MessagesPage() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<any[]>(MOCK_MESSAGES);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  
  // NEW: State to track active replies
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom (now also triggers when the reply banner opens/closes)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingUsers, replyingTo]);

  // Typing Indicator Logic
  useEffect(() => {
    const myId = "u-me";
    if (inputText.length > 0) {
      setTypingUsers((prev) => 
        prev.some(u => u.id === myId) ? prev : [...prev, { id: myId, name: "You", avatar: "/mock-profiles/small2.png", isMe: true }]
      );
    } else {
      setTypingUsers((prev) => prev.filter(u => u.id !== myId));
    }
  }, [inputText]);
  
  // Mock simulation logic
  const simulateRecipientResponse = () => {
    const alex: TypingUser = { id: "u2", name: "Alex Rivera", avatar: "/mock-profiles/small3.png", isMe: false };
    const maya: TypingUser = { id: "u3", name: "Maya Johnson", avatar: "/mock-profiles/small.png", isMe: false };

    setTimeout(() => {
      setTypingUsers(prev => [...prev, alex]);
      setTimeout(() => {
        setTypingUsers(prev => [...prev, maya]);
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(u => u.id !== "u2"));
          setMessages(prev => [...prev, {
            id: Date.now(),
            sender: "Alex Rivera",
            time: "3:05 PM",
            text: "I'm checking the stems now!",
            isMe: false,
            avatar: "/mock-profiles/small3.png"
          }]);
          setTimeout(() => {
            setTypingUsers(prev => prev.filter(u => u.id !== "u3"));
          }, 1500);
        }, 2000);
      }, 1000);
    }, 1000);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: "You",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText,
      isMe: true,
      avatar: "/mock-profiles/small2.png",
      // INJECT REPLY DATA
      replyTo: replyingTo ? { sender: replyingTo.sender, text: replyingTo.text } : undefined
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    setReplyingTo(null); // Clear reply state
    simulateRecipientResponse();
  };

  return (
    <div className="w-full h-full flex justify-center">
      {/* Container */}
      <div className="w-full max-w-[1224px] h-[638px] bg-white/5 border border-white/10 rounded-[30px] flex flex-col relative overflow-hidden backdrop-blur-md shadow-2xl">
        
        {/* Message List Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-8 pb-[140px]"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex items-end gap-3 w-full ${msg.isMe ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar with Green Border */}
              <div className="w-[45px] h-[45px] rounded-full border border-primary-green overflow-hidden shrink-0">
                <Avatar name={msg.sender} src={msg.avatar} className="w-full h-full" />
              </div>

              <div className={`flex flex-col gap-2 max-w-[70%] ${msg.isMe ? "items-end" : "items-start"}`}>
                
                {/* Bubble & Hover Actions Wrapper */}
                <div className={`flex items-center gap-2 group ${msg.isMe ? "flex-row-reverse" : "flex-row"}`}>
                  
                  {/* Chat Bubble */}
                  <div 
                    className={`px-5 py-4 shadow-sm font-poppins relative ${
                      msg.isMe 
                        ? "bg-primary-blue text-white rounded-msg-me" 
                        : "bg-white text-primary-blue/50 rounded-msg-them" 
                    }`}
                  >
                    {/* INLINE REPLY RENDERER (Conditionally styled for contrast) */}
                    {msg.replyTo && (
                      <div className={`border-l-[4px] border-primary-green rounded-[9.77px] p-[8px_12px] mb-[8px] flex flex-col w-full text-left overflow-hidden ${
                        msg.isMe ? 'bg-black/20' : 'bg-black/5'
                      }`}>
                        <span className={`font-poppins font-medium text-[11px] truncate ${
                          msg.isMe ? 'text-white/50' : 'text-primary-blue/50'
                        }`}>
                          {msg.replyTo.sender}
                        </span>
                        <span className={`font-poppins font-light text-[13px] line-clamp-2 mt-[2px] ${
                          msg.isMe ? 'text-white/80' : 'text-primary-blue/80'
                        }`}>
                          {msg.replyTo.text}
                        </span>
                      </div>
                    )}

                    <p className={`font-medium text-[16px] leading-[24px] ${msg.isMe ? "text-white" : "text-primary-blue/80"}`}>
                      {msg.text}
                    </p>
                  </div>

                  {/* Reply Button (Visible on Hover) */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button 
                      onClick={() => setReplyingTo(msg)} 
                      className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors" 
                      title="Reply"
                    >
                      <FiCornerUpLeft size={16} />
                    </button>
                  </div>

                </div>

                <span className="font-poppins font-light text-[13px] text-white/40 px-1">
                  {msg.sender} • {msg.time}
                </span>
              </div>
            </div>
          ))}

          {/* DYNAMIC TYPING INDICATORS COMPONENT */}
          <TypingIndicator typingUsers={typingUsers} />

        </div>
        
        {/* Input Bar Area (Updated with Reply Banner) */}
        <div className="absolute bottom-6 left-0 w-full px-6 flex items-end gap-3 z-20">
          
          {/* Action Buttons */}
          <div className="flex gap-2 shrink-0">
            <button className="w-[54px] h-[54px] rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <FiFolder size={22} />
            </button>
            <button className="w-[54px] h-[54px] rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <FiMic size={20} />
            </button>
          </div>

          <div className="flex flex-col flex-1 gap-2">
            
            {/* REPLY PREVIEW BANNER */}
            {replyingTo && (
              <div className="flex items-start justify-between bg-black/40 backdrop-blur-md rounded-[16px] p-[10px_16px] border-l-[4px] border-primary-green shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex flex-col overflow-hidden max-w-[85%]">
                  <span className="font-poppins font-semibold text-[11px] text-primary-green mb-0.5">
                    Replying to {replyingTo.sender}
                  </span>
                  <span className="font-poppins font-light text-[13px] text-white/70 truncate">
                    {replyingTo.text}
                  </span>
                </div>
                <button 
                  onClick={() => setReplyingTo(null)} 
                  className="text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors shrink-0"
                >
                  <FiX size={16} />
                </button>
              </div>
            )}

            {/* Input Form */}
            <form 
              onSubmit={handleSendMessage}
              className="w-full h-[56px] bg-white rounded-full flex items-center px-6 relative group shadow-xl focus-within:outline-2 focus-within:outline-primary-green"
            >
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 h-full bg-transparent border-none outline-none font-sans font-medium text-[16px] text-black/80"
                placeholder="Message..."
              />

              {/* Send Button */}
              <button 
                type="submit"
                className="absolute right-0 w-[54px] h-[54px] bg-primary-green rounded-full flex items-center justify-center hover:brightness-110 transition-all shadow-lg active:scale-95"
              >
                <FiSend size={20} className="text-white relative right-[1px] top-[1px]" />
              </button>
            </form>

          </div>
        </div>

        {/* Bottom Fade Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-[120px] bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}