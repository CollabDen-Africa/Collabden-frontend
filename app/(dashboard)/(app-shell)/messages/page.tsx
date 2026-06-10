"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Avatar from "@/components/ui/Avatar";
import { FiSearch, FiPaperclip, FiMic, FiSend, FiX, FiStar } from "react-icons/fi";
import TypingIndicator, { TypingUser } from "@/components/ui/TypingIndicator";
import { 
  MOCK_DASHBOARD_MESSAGES, 
  MOCK_DASHBOARD_CONVERSATIONS 
} from "@/lib/mockData";

// Custom SVG for the precise pushpin icon
const PinIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.98087 2.97668C7.97409 3.09878 7.93791 3.21744 7.87542 3.32255C7.81646 3.4269 7.73593 3.51749 7.63922 3.58828C7.59708 3.61889 7.54761 3.6378 7.49581 3.64312L6.75345 3.74013C6.67109 3.75416 6.59476 3.79232 6.53412 3.84979C6.31057 4.06491 6.0828 4.27159 5.77067 4.60059L5.41215 4.95489C5.36554 5.00328 5.33213 5.06283 5.31514 5.12783L4.91865 6.7222C4.92034 6.73903 4.92034 6.75599 4.91865 6.77282C4.86372 6.89645 4.77987 7.00505 4.67416 7.08948C4.56845 7.1739 4.44398 7.23165 4.31127 7.25788H4.15942C4.07677 7.2571 3.99456 7.24576 3.91478 7.22414C3.78558 7.18451 3.6682 7.11351 3.57313 7.01746L2.50178 5.95032L0.532004 7.9201C0.472036 7.97597 0.392719 8.0064 0.310764 8.00495C0.228809 8.0035 0.150615 7.9703 0.0926553 7.91234C0.0346955 7.85438 0.00149528 7.77619 4.92852e-05 7.69424C-0.00139671 7.61228 0.0290243 7.53296 0.0849035 7.473L2.05468 5.50322L1.00019 4.44874C0.905904 4.35139 0.836457 4.23275 0.797734 4.10287C0.754896 3.97361 0.747612 3.83521 0.776644 3.70217C0.801421 3.57103 0.857894 3.44795 0.941143 3.34364C1.02546 3.23792 1.13396 3.15402 1.25749 3.099H1.3081L2.88561 2.67721C2.95549 2.65855 3.0194 2.62224 3.0712 2.57176C3.65749 1.9939 3.85995 1.79144 4.18051 1.44557C4.23508 1.3878 4.26916 1.3137 4.27753 1.23468L4.37876 0.488104C4.38333 0.434838 4.40228 0.383814 4.43359 0.340476C4.54149 0.195255 4.69321 0.0885687 4.86638 0.0361644C5.03954 -0.01624 5.22496 -0.0115862 5.39528 0.049439C5.5093 0.0914837 5.6129 0.157669 5.69897 0.243464L7.75732 2.31025C7.84163 2.39582 7.9067 2.49842 7.94816 2.61116C7.98962 2.72391 8.00653 2.84422 7.99774 2.96403L7.98087 2.97668Z" fill="#D7D7D7"/></svg>
);

export default function DashboardMessagesPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  
  // State for messages & typing functionality
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<any[]>(MOCK_DASHBOARD_MESSAGES);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // State for pinned conversations (outer list)
  const [pinnedChats, setPinnedChats] = useState<string[]>(["c1", "c2"]);
  
  const isChatOpen = selectedChatId !== null;
  
  // Dynamically derive the active chat data
  const activeChat = useMemo(() => {
    return MOCK_DASHBOARD_CONVERSATIONS.find(c => c.id === selectedChatId) || null;
  }, [selectedChatId]);

  // Dynamically calculate tabs based on conversation data
  const tabs = useMemo(() => {
    const unreadCount = MOCK_DASHBOARD_CONVERSATIONS.reduce((acc, curr) => acc + (curr.unread || 0), 0);
    const requestCount = MOCK_DASHBOARD_CONVERSATIONS.filter(c => c.category === "request").length;
    
    return [
      { id: "All", label: "All" },
      { id: "Unread", label: unreadCount > 0 ? `Unread (${unreadCount})` : "Unread" },
      { id: "Archived", label: "Archived" },
      { id: "Requests", label: requestCount > 0 ? `Requests (${requestCount})` : "Requests" }
    ];
  }, []);

  const filteredConversations = useMemo(() => {
    switch (activeTab) {
      case "Unread": return MOCK_DASHBOARD_CONVERSATIONS.filter(c => c.unread > 0);
      case "Archived": return MOCK_DASHBOARD_CONVERSATIONS.filter(c => c.category === "archived");
      case "Requests": return MOCK_DASHBOARD_CONVERSATIONS.filter(c => c.category === "request");
      default: return MOCK_DASHBOARD_CONVERSATIONS;
    }
  }, [activeTab]);

  // Handle Auto-Scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  // Typing Indicator Logic (You)
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

  // Inject active chat's mocked typing status into the shared component array
  useEffect(() => {
    if (activeChat?.isTyping) {
      setTypingUsers(prev => {
        if (prev.some(u => u.name === activeChat.name)) return prev;
        return [...prev, { id: "mock-typist", name: activeChat.name, avatar: activeChat.avatar, isMe: false }];
      });
    } else {
      setTypingUsers(prev => prev.filter(u => u.id !== "mock-typist"));
    }
  }, [activeChat]);

  // Handle Send Message
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
      isPinned: false
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    
    // Simulate a response from the currently selected chat
    if (activeChat) {
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
    }
  };

  const togglePinMessage = (msgId: number) => {
    setMessages(prev => prev.map(msg => 
      msg.id === msgId ? { ...msg, isPinned: !msg.isPinned } : msg
    ));
  };

  const togglePinChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setPinnedChats(prev => 
      prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]
    );
  };

  const pinnedMessages = messages.filter(m => m.isPinned);

  return (
    <div className="w-full h-full flex flex-col items-center pt-[7px] mt-[10px] lg:mt-[-95px] font-sans pb-[4px] relative flex-1">
      
      {/* Title */}
      <h1 className="font-medium text-[36px] lg:text-[48px] leading-[40px] lg:leading-[56px] text-white mb-[15px] z-10 text-center lg:text-left w-full max-w-[1223px]">
        Messages
      </h1>

      {/* Main Container - Fully Responsive heights and widths */}
      <div className="flex gap-4 lg:gap-[28px] w-full max-w-[1223px] z-10 flex-1 h-[75vh] min-h-[600px]">
        
        {/* ========================================== */}
        {/* LEFT PANEL: Conversation List              */}
        {/* ========================================== */}
        <div 
           className={`flex flex-col bg-white/10 rounded-[30px] transition-all duration-500 ease-in-out shrink-0 overflow-hidden relative border border-white/5 shadow-2xl backdrop-blur-md h-full 
             ${isChatOpen ? 'hidden lg:flex lg:w-[322px]' : 'flex w-full'}`}
        >
           {/* Tabs */}
           <div className="flex items-center gap-[20px] absolute top-[35px] left-[12px] overflow-x-auto custom-scrollbar pr-4 max-w-full">
              {tabs.map((tab) => (
                 <button 
                   key={tab.id} 
                   onClick={() => setActiveTab(tab.id)}
                   className={`pb-1 font-medium text-[13px] leading-[15px] transition-colors whitespace-nowrap ${
                     activeTab === tab.id 
                       ? "text-white border-b-[2px] border-primary-green" 
                       : "text-white/50 border-transparent hover:text-white"
                   }`}
                 >
                    {tab.label}
                 </button>
              ))}
           </div>

           {/* Search & List Wrapper */}
           <div className="flex flex-col flex-1 w-full mt-[90px] px-[12px]">
              
              <div className="w-full h-[40px] bg-black/10 rounded-[50px] flex items-center px-[25px] mb-[12px] border border-white/5 focus-within:border-primary-green transition-colors shrink-0">
                 <FiSearch className="text-white/30 shrink-0" size={13} />
                 <input 
                   type="text" 
                   placeholder="Search messages..." 
                   className="flex-1 ml-[12px] bg-transparent border-none outline-none text-[14px] font-medium text-white placeholder:text-white/30 min-w-0"
                 />
              </div>

              {/* Messages List */}
              <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar gap-[12px] pb-[20px]">
                 {filteredConversations.map(chat => {
                    const isChatPinned = pinnedChats.includes(chat.id);

                    return (
                       <button 
                          key={chat.id}
                          onClick={() => setSelectedChatId(chat.id)}
                          className={`group flex items-center justify-between w-full shrink-0 ${
                             isChatOpen ? 'h-[66px]' : 'h-[60px] lg:h-[58px]'
                          } bg-[#D7D7D7]/10 rounded-[20px] px-[16px] transition-all border border-transparent hover:border-white/10 ${
                             selectedChatId === chat.id ? "bg-black/20 border-white/5" : ""
                          }`}
                       >
                          {/* Left Side: Avatar with Online Status + Name & Preview */}
                          <div className="flex items-center gap-[12px] flex-1 min-w-0">
                             {/* Avatar Container */}
                             <div className="relative shrink-0">
                                <div className="w-[30px] h-[30px] rounded-full border border-primary-green overflow-hidden">
                                   <Avatar name={chat.name} src={chat.avatar} className="w-full h-full object-cover" />
                                </div>
                                {chat.isOnline && (
                                   <div className="absolute -bottom-[2px] -right-[2px] w-[11px] h-[11px] bg-primary-green rounded-full border-[1.5px] border-[#121A1F] shadow-sm z-10" />
                                )}
                             </div>
                             
                             {/* Text Block: Name top, Message bottom */}
                             <div className="flex flex-col items-start justify-center overflow-hidden flex-1">
                                <span className="font-bold text-[12px] leading-[14px] text-white truncate w-full text-left">
                                   {chat.name}
                                </span>
                                {chat.isTyping ? (
                                   <span className="font-medium text-[10px] text-primary-green mt-[4px] truncate w-full text-left">
                                      •••typing
                                   </span>
                                ) : (
                                   <span className="font-medium text-[10px] leading-[12px] text-white/70 mt-[4px] truncate w-full text-left">
                                      {chat.lastMessage}
                                   </span>
                                )}
                             </div>
                          </div>

                          {/* Right Side: Unread Dot + Time + General Pin */}
                          <div className="flex flex-col items-end justify-center gap-[4px] w-[47px] shrink-0 h-full py-2">
                             <div className={`w-[6px] h-[6px] rounded-full ${chat.unread > 0 ? 'bg-primary-green' : 'bg-transparent'}`} />
                             <span className="font-medium text-[10px] leading-[12px] text-white/50">
                                {chat.time}
                             </span>
                             
                             <div 
                                onClick={(e) => togglePinChat(e, chat.id)}
                                className={`transition-opacity duration-200 mt-1 cursor-pointer p-1 -mr-1 rounded-full hover:bg-white/10 flex items-center justify-center
                                   ${isChatPinned ? 'opacity-100 text-primary-green' : 'opacity-0 group-hover:opacity-100 text-white/50 hover:text-white'}
                                `}
                                title={isChatPinned ? "Unpin chat" : "Pin chat"}
                             >
                                <PinIcon className="w-3 h-3" />
                             </div>
                          </div>
                       </button>
                    )
                 })}
              </div>
           </div>
        </div>

        {/* ========================================== */}
        {/* RIGHT PANEL: Chat Window                   */}
        {/* ========================================== */}
        {isChatOpen && (
           <div className="w-full lg:flex-1 h-full bg-black/10 rounded-[29.56px] relative flex flex-col shrink-0 animate-in fade-in slide-in-from-right-8 lg:slide-in-from-right-0 duration-500 overflow-hidden border border-white/5 backdrop-blur-md">
              
              {/* Dynamic Header Action Bar */}
              <div className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-5 bg-black/20 border-b border-white/5 z-20 backdrop-blur-md">
                 <div className="flex items-center gap-3">
                    <span className="text-white font-medium text-[15px]">{activeChat?.name}</span>
                    
                    {activeChat?.isOnline && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-green/10 rounded-full">
                         <div className="w-2 h-2 rounded-full bg-primary-green animate-pulse" />
                         <span className="text-primary-green text-[11px] font-medium">Online</span>
                      </div>
                    )}
                 </div>

                 <button 
                    onClick={() => setSelectedChatId(null)}
                    className="text-white/50 hover:text-white transition-colors"
                 >
                    <FiX size={24} />
                 </button>
              </div>

              {/* Pinned Messages Banner */}
              {pinnedMessages.length > 0 && (
                 <div className="absolute top-[72px] left-0 w-full bg-primary-blue/20 border-b border-primary-blue/30 px-6 py-2.5 flex items-center gap-3 z-10 backdrop-blur-sm">
                    <FiStar className="text-primary-green shrink-0" size={14} />
                    <div className="flex flex-col min-w-0">
                       <span className="text-[11px] font-semibold text-primary-green uppercase tracking-wider">Pinned Message</span>
                       <span className="text-[13px] text-white/80 truncate">{pinnedMessages[pinnedMessages.length - 1].text}</span>
                    </div>
                 </div>
              )}

              {/* Messages Flow */}
              <div ref={scrollRef} className={`flex flex-col w-full h-full pb-[100px] px-[20px] lg:px-[31.5px] overflow-y-auto custom-scrollbar gap-[20px] ${pinnedMessages.length > 0 ? 'pt-[140px]' : 'pt-[100px]'}`}>
                 
                 <div className="w-full flex justify-center mb-4">
                    <span className="text-white/50 font-poppins font-light text-[13px] bg-black/20 px-4 py-1.5 rounded-full">
                       Today
                    </span>
                 </div>

                 {messages.map((msg, index) => (
                    <div key={msg.id || index} className={`flex items-end w-full gap-[11.8px] group ${msg.isMe ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
                       
                       <div className="w-[36px] h-[36px] lg:w-[44.34px] lg:h-[44.34px] rounded-full border-[0.98px] border-primary-green shrink-0 overflow-hidden">
                          <Avatar name={msg.sender} src={msg.avatar} className="w-full h-full object-cover" />
                       </div>
                       
                       <div className={`flex flex-col gap-[7.8px] max-w-[85%] lg:max-w-[70%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                          
                          <div className="flex items-center gap-2">
                             {/* Pin Button (Visible on Hover) */}
                             {msg.isMe && (
                                <button 
                                   onClick={() => togglePinMessage(msg.id)}
                                   className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-white/10 ${msg.isPinned ? 'text-primary-green opacity-100' : 'text-white/50'}`}
                                   title={msg.isPinned ? "Unpin message" : "Pin message"}
                                >
                                   <PinIcon className={`w-3.5 h-3.5 ${msg.isPinned ? "text-primary-green" : ""}`} />
                                </button>
                             )}

                             <div className={`px-[16px] py-[14px] shadow-sm relative group-hover:shadow-md transition-shadow ${
                                msg.isMe 
                                  ? 'bg-primary-blue rounded-[16.57px_16.57px_0_16.57px]' 
                                  : 'bg-white rounded-[16.57px_16.57px_16.57px_0] ml-[2px]'
                             }`}>
                                {msg.replyTo && (
                                   <div className="bg-black/20 border-l-[4px] border-primary-green rounded-[9.77px] p-[10px] mb-[12px] flex flex-col w-full text-left">
                                      <span className="font-poppins font-semibold text-[11px] text-white/70">
                                         {msg.replyTo.sender}
                                      </span>
                                      <span className="font-poppins font-light text-[13px] text-white/90 line-clamp-2 mt-[2px]">
                                         {msg.replyTo.text}
                                      </span>
                                   </div>
                                )}
                                <span className={`font-poppins font-medium text-[14px] lg:text-[15.76px] leading-[22px] lg:leading-[24px] ${msg.isMe ? 'text-white' : 'text-primary-blue/80'}`}>
                                   {msg.text}
                                </span>
                             </div>

                             {/* Pin Button for Left Aligned Messages */}
                             {!msg.isMe && (
                                <button 
                                   onClick={() => togglePinMessage(msg.id)}
                                   className={`opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-white/10 ${msg.isPinned ? 'text-primary-green opacity-100' : 'text-white/50'}`}
                                   title={msg.isPinned ? "Unpin message" : "Pin message"}
                                >
                                   <PinIcon className={`w-3.5 h-3.5 ${msg.isPinned ? "text-primary-green" : ""}`} />
                                </button>
                             )}
                          </div>

                          <div className="flex items-center gap-2">
                             {msg.isPinned && <PinIcon className="w-[10px] h-[10px] text-primary-green" />}
                             <span className="font-poppins font-light text-[11px] lg:text-[12.8px] leading-[19px] text-white/50">
                                {msg.isMe ? "You" : msg.sender} • {msg.time}
                             </span>
                          </div>
                       </div>
                    </div>
                 ))}
                 
                 {/* Reusable Typing Indicator Component */}
                 <TypingIndicator typingUsers={typingUsers} />

              </div>

              {/* Exact Layout Input Area -> Converted to Form */}
              <div className="absolute bottom-4 lg:bottom-[35px] left-0 w-full px-[15px] lg:px-[31.5px] flex items-center bg-transparent z-20">
                 <div className="flex items-center gap-[10px] lg:gap-[15px] shrink-0">
                    <button className="w-[45px] h-[45px] lg:w-[53.21px] lg:h-[53.21px] bg-black/30 rounded-full flex items-center justify-center hover:bg-black/50 backdrop-blur-md transition-all shrink-0 border border-white/5">
                       <FiPaperclip className="text-white" size={18} />
                    </button>
                    <button className="w-[45px] h-[45px] lg:w-[53.21px] lg:h-[53.21px] bg-black/30 rounded-full flex items-center justify-center hover:bg-black/50 backdrop-blur-md transition-all shrink-0 border border-white/5">
                       <FiMic className="text-white" size={18} />
                    </button>
                 </div>
                 
                 <form 
                    onSubmit={handleSendMessage}
                    className="flex-1 h-[45px] lg:h-[55px] bg-white rounded-[49.27px] ml-[10px] lg:ml-[15px] flex items-center pl-[20px] lg:pl-[25px] pr-[1px] shadow-lg focus-within:ring-2 ring-primary-green transition-all relative"
                 >
                    <input 
                       value={inputText}
                       onChange={(e) => setInputText(e.target.value)}
                       className="flex-1 w-full bg-transparent outline-none text-black/80 font-raleway font-medium text-[14px] lg:text-[15.7px]"
                       placeholder="Message..."
                    />
                    <button 
                       type="submit"
                       className="w-[43px] h-[43px] lg:w-[53.21px] lg:h-[53.21px] rounded-full bg-primary-green flex items-center justify-center hover:brightness-110 shrink-0 border-[1.5px] border-white shadow-md transition-all"
                    >
                       <FiSend className="text-white ml-[-2px] mt-[2px]" size={18} />
                    </button>
                 </form>
              </div>

           </div>
        )}
      </div>
    </div>
  );
}