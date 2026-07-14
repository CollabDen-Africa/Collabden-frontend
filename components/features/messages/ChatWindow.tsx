"use client";

import React, { useState, useEffect, useRef } from "react";
import Avatar from "@/components/ui/Avatar";
import { FiPaperclip, FiMic, FiSend, FiX, FiStar, FiCornerUpLeft } from "react-icons/fi";
import TypingIndicator, { TypingUser } from "@/components/ui/TypingIndicator";
import { MOCK_DASHBOARD_MESSAGES, MOCK_DASHBOARD_CONVERSATIONS } from "@/lib/mockData";

// Pin Icon (remember to make this a component or something)
const PinIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.98087 2.97668C7.97409 3.09878 7.93791 3.21744 7.87542 3.32255C7.81646 3.4269 7.73593 3.51749 7.63922 3.58828C7.59708 3.61889 7.54761 3.6378 7.49581 3.64312L6.75345 3.74013C6.67109 3.75416 6.59476 3.79232 6.53412 3.84979C6.31057 4.06491 6.0828 4.27159 5.77067 4.60059L5.41215 4.95489C5.36554 5.00328 5.33213 5.06283 5.31514 5.12783L4.91865 6.7222C4.92034 6.73903 4.92034 6.75599 4.91865 6.77282C4.86372 6.89645 4.77987 7.00505 4.67416 7.08948C4.56845 7.1739 4.44398 7.23165 4.31127 7.25788H4.15942C4.07677 7.2571 3.99456 7.24576 3.91478 7.22414C3.78558 7.18451 3.6682 7.11351 3.57313 7.01746L2.50178 5.95032L0.532004 7.9201C0.472036 7.97597 0.392719 8.0064 0.310764 8.00495C0.228809 8.0035 0.150615 7.9703 0.0926553 7.91234C0.0346955 7.85438 0.00149528 7.77619 4.92852e-05 7.69424C-0.00139671 7.61228 0.0290243 7.53296 0.0849035 7.473L2.05468 5.50322L1.00019 4.44874C0.905904 4.35139 0.836457 4.23275 0.797734 4.10287C0.754896 3.97361 0.747612 3.83521 0.776644 3.70217C0.801421 3.57103 0.857894 3.44795 0.941143 3.34364C1.02546 3.23792 1.13396 3.15402 1.25749 3.099H1.3081L2.88561 2.67721C2.95549 2.65855 3.0194 2.62224 3.0712 2.57176C3.65749 1.9939 3.85995 1.79144 4.18051 1.44557C4.23508 1.3878 4.26916 1.3137 4.27753 1.23468L4.37876 0.488104C4.38333 0.434838 4.40228 0.383814 4.43359 0.340476C4.54149 0.195255 4.69321 0.0885687 4.86638 0.0361644C5.03954 -0.01624 5.22496 -0.0115862 5.39528 0.049439C5.5093 0.0914837 5.6129 0.157669 5.69897 0.243464L7.75732 2.31025C7.84163 2.39582 7.9067 2.49842 7.94816 2.61116C7.98962 2.72391 8.00653 2.84422 7.99774 2.96403L7.98087 2.97668Z" fill="currentColor"/>
  </svg>
);

interface Props {
  chatId: string;
  onClose: () => void;
}

export default function ChatWindow({ chatId, onClose }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<any[]>(MOCK_DASHBOARD_MESSAGES);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  
  const activeChat = MOCK_DASHBOARD_CONVERSATIONS.find(c => c.id === chatId) || {
    id: chatId, name: "Project Chat", isOnline: true, avatar: ""
  };

  const pinnedMessages = messages.filter(m => m.isPinned);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typingUsers, replyingTo]);

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
      isPinned: false,
      replyTo: replyingTo ? { sender: replyingTo.sender, text: replyingTo.text } : undefined
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    setReplyingTo(null);
    
    const responderId = `u-${activeChat.id}`;
    setTimeout(() => {
      setTypingUsers(prev => [...prev, { id: responderId, name: activeChat.name, avatar: activeChat.avatar, isMe: false }]);
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u.id !== responderId));
        setMessages(prev => [...prev, {
          id: Date.now(),
          sender: activeChat.name,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: "Got it! Let me check on that and get back to you.",
          isMe: false,
          avatar: activeChat.avatar,
          isPinned: false
        }]);
      }, 2000);
    }, 1000);
  };

  const togglePinMessage = (msgId: number) => {
    setMessages(prev => prev.map(msg => msg.id === msgId ? { ...msg, isPinned: !msg.isPinned } : msg));
  };

  return (
    <div className="w-full lg:flex-1 h-full bg-black/10 rounded-[29.56px] relative flex flex-col shrink-0 animate-in fade-in slide-in-from-right-8 lg:slide-in-from-right-0 duration-500 overflow-hidden border border-white/5 backdrop-blur-md">
      
      <div className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-5 bg-black/20 border-b border-white/5 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-white font-medium text-[15px]">{activeChat.name}</span>
          {activeChat.isOnline && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-green/10 rounded-full">
              <div className="w-2 h-2 rounded-full bg-primary-green animate-pulse" />
              <span className="text-primary-green text-[11px] font-medium">Online</span>
            </div>
          )}
        </div>
        <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
          <FiX size={24} />
        </button>
      </div>

      {pinnedMessages.length > 0 && (
        <div className="absolute top-18 left-0 w-full bg-primary-blue/20 border-b border-primary-blue/30 px-6 py-2.5 flex items-center gap-3 z-10 backdrop-blur-sm">
          <FiStar className="text-primary-green shrink-0" size={14} />
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] font-semibold text-primary-green uppercase tracking-wider">Pinned Message</span>
            <span className="text-[13px] text-white/80 truncate">{pinnedMessages[pinnedMessages.length - 1].text}</span>
          </div>
        </div>
      )}

      <div ref={scrollRef} className={`flex flex-col w-full h-full pb-32.5 px-5 lg:px-[31.5px] overflow-y-auto custom-scrollbar gap-5 ${pinnedMessages.length > 0 ? 'pt-35' : 'pt-25'}`}>
        
        <div className="w-full flex justify-center mb-4">
          <span className="text-white/50 font-poppins font-light text-[13px] bg-black/20 px-4 py-1.5 rounded-full">Today</span>
        </div>

        {messages.map((msg, index) => (
          <div key={msg.id || index} className={`flex w-full ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
            
            <div className={`flex items-end gap-[11.8px] max-w-[85%] lg:max-w-[70%] group ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              
              <div className="w-9 h-9 lg:w-[44.34px] lg:h-[44.34px] rounded-full border-[0.98px] border-primary-green shrink-0 overflow-hidden">
                <Avatar name={msg.sender} src={msg.avatar} className="w-full h-full object-cover" />
              </div>
              
              <div className={`flex flex-col gap-[7.8px] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-center gap-2 group ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {msg.isMe && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setReplyingTo(msg)} className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white" title="Reply"><FiCornerUpLeft size={14} /></button>
                      <button onClick={() => togglePinMessage(msg.id)} className={`p-1.5 rounded-full hover:bg-white/10 ${msg.isPinned ? 'text-primary-green opacity-100' : 'text-white/50'}`} title={msg.isPinned ? "Unpin message" : "Pin message"}>
                        <PinIcon className={`w-3.5 h-3.5 ${msg.isPinned ? "text-primary-green" : ""}`} />
                      </button>
                    </div>
                  )}

                  <div className={`px-4 py-3.5 shadow-sm relative group-hover:shadow-md transition-shadow ${msg.isMe ? 'bg-primary-blue rounded-[16.57px_16.57px_0_16.57px]' : 'bg-white rounded-[16.57px_16.57px_16.57px_0] ml-0.5'}`}>
                    
                    {msg.replyTo && (
                      <div className="bg-black/20 border-l-4 border-primary-green rounded-[9.77px] p-[8px_12px] mb-2 flex flex-col w-full text-left overflow-hidden">
                        <span className="font-poppins font-medium text-[11px] text-white/50 truncate">{msg.replyTo.sender}</span>
                        <span className="font-poppins font-light text-[13px] text-white/80 line-clamp-2 mt-0.5">{msg.replyTo.text}</span>
                      </div>
                    )}

                    <span className={`font-poppins font-medium text-[14px] lg:text-[15.76px] leading-5.5 lg:leading-6 ${msg.isMe ? 'text-white' : 'text-primary-blue/80'}`}>
                      {msg.text}
                    </span>
                  </div>

                  {!msg.isMe && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setReplyingTo(msg)} className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white" title="Reply"><FiCornerUpLeft size={14} /></button>
                      <button onClick={() => togglePinMessage(msg.id)} className={`p-1.5 rounded-full hover:bg-white/10 ${msg.isPinned ? 'text-primary-green opacity-100' : 'text-white/50'}`} title={msg.isPinned ? "Unpin message" : "Pin message"}>
                        <PinIcon className={`w-3.5 h-3.5 ${msg.isPinned ? "text-primary-green" : ""}`} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {msg.isPinned && <PinIcon className="w-2.5 h-2.5 text-primary-green" />}
                  <span className="font-poppins font-light text-[11px] lg:text-[12.8px] leading-4.75 text-white/50">{msg.isMe ? "You" : msg.sender} • {msg.time}</span>
                </div>
              </div>
            </div>

          </div>
        ))}
        <TypingIndicator typingUsers={typingUsers} />
      </div>

      <div className="absolute bottom-4 lg:bottom-8.75 left-0 w-full px-3.75 lg:px-[31.5px] flex flex-col gap-2 z-20">
        
        {replyingTo && (
          <div className="flex items-start justify-between bg-black/40 backdrop-blur-md rounded-xl p-[10px_14px] border-l-4 border-primary-green ml-15 lg:ml-18 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex flex-col overflow-hidden max-w-[85%]">
              <span className="font-poppins font-semibold text-[11px] text-primary-green mb-0.5">Replying to {replyingTo.sender}</span>
              <span className="font-poppins font-light text-[13px] text-white/70 truncate">{replyingTo.text}</span>
            </div>
            <button onClick={() => setReplyingTo(null)} className="text-white/50 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors shrink-0"><FiX size={16} /></button>
          </div>
        )}

        <div className="flex items-center bg-transparent w-full">
          <div className="flex items-center gap-2.5 lg:gap-3.75 shrink-0">
            <button className="w-11.25 h-11.25 lg:w-[53.21px] lg:h-[53.21px] bg-black/30 rounded-full flex items-center justify-center hover:bg-black/50 backdrop-blur-md transition-all border border-white/5"><FiPaperclip className="text-white" size={18} /></button>
            <button className="w-11.25 h-11.25 lg:w-[53.21px] lg:h-[53.21px] bg-black/30 rounded-full flex items-center justify-center hover:bg-black/50 backdrop-blur-md transition-all border border-white/5"><FiMic className="text-white" size={18} /></button>
          </div>
          <form onSubmit={handleSendMessage} className="flex-1 h-11.25 lg:h-13.75 bg-white rounded-[49.27px] ml-2.5 lg:ml-3.75 flex items-center pl-5 lg:pl-6.25 pr-px shadow-lg focus-within:ring-2 ring-primary-green transition-all relative">
            <input value={inputText} onChange={(e) => setInputText(e.target.value)} className="flex-1 w-full bg-transparent outline-none text-black/80 font-raleway font-medium text-[14px] lg:text-[15.7px]" placeholder="Message..." />
            <button type="submit" className="w-10.75 h-10.75 lg:w-[53.21px] lg:h-[53.21px] rounded-full bg-primary-green flex items-center justify-center hover:brightness-110 shrink-0 border-[1.5px] border-white shadow-md transition-all"><FiSend className="text-white -ml-0.5 mt-0.5" size={18} /></button>
          </form>
        </div>

      </div>
    </div>
  );
}