"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiFolder, FiMic, FiSend } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import TypingIndicator, { TypingUser } from "@/components/ui/TypingIndicator"; 
import { MOCK_MESSAGES } from "@/lib/mockData";

export default function MessagesPage() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  // Typing Indicator Logic: Shows when user types to simulate interaction
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
  
  // Mock simulation logic for others typing
  const simulateRecipientResponse = () => {
    const alex: TypingUser = { id: "u2", name: "Alex Rivera", avatar: "/mock-profiles/small3.png", isMe: false };
    const maya: TypingUser = { id: "u3", name: "Maya Johnson", avatar: "/mock-profiles/small.png", isMe: false };

    // Alex starts typing after 1 second
    setTimeout(() => {
      setTypingUsers(prev => [...prev, alex]);
      
      // Maya joins in typing 1 second later
      setTimeout(() => {
        setTypingUsers(prev => [...prev, maya]);
        
        // Alex finishes and sends message
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

          // Maya finishes typing shortly after
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
      avatar: "/mock-profiles/small2.png" 
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    simulateRecipientResponse();
  };

  return (
    <div className="w-full h-full flex justify-center">
      {/* Container */}
      <div className="w-full max-w-[1224px] h-[638px] bg-white/5 border border-white/10 rounded-[30px] flex flex-col relative overflow-hidden backdrop-blur-md shadow-2xl">
        
        {/* Message List Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-8 pb-[120px]"
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
                {/* Chat Bubble */}
                <div 
                  className={`px-5 py-4 shadow-sm font-poppins ${
                    msg.isMe 
                      ? "bg-primary-blue text-white rounded-msg-me" 
                      : "bg-white text-primary-blue/50 rounded-msg-them" 
                  }`}
                >
                  <p className="font-medium text-[16px] leading-[24px]">
                    {msg.text}
                  </p>
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
        
        {/* Input Bar Area */}
        <div className="absolute bottom-6 left-0 w-full px-6 flex items-center gap-3 z-20">
          <div className="flex gap-2">
            <button className="w-[54px] h-[54px] rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <FiFolder size={22} />
            </button>
            <button className="w-[54px] h-[54px] rounded-full bg-black/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <FiMic size={20} />
            </button>
          </div>

          <form 
            onSubmit={handleSendMessage}
            className="flex-1 h-[56px] bg-white rounded-full flex items-center px-6 relative group shadow-xl  focus-within:outline-2 focus-within:outline-primary-green"
          >
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 h-full bg-transparent border-none outline-none font-sans font-medium text-[16px] text-black/80"
            />

            {/* Send Button */}
            <button 
              type="submit"
              className="absolute -right-0 w-[54px] h-[54px] bg-primary-green rounded-full flex items-center justify-center hover:brightness-110 transition-all shadow-lg active:scale-95"
            >
              <FiSend size={20} className="text-white relative right-[1px] top-[1px]" />
            </button>
          </form>
        </div>

        {/* Bottom Fade Gradient */}
        <div className="absolute bottom-0 left-0 w-full h-[120px] bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}