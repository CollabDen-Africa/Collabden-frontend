"use client";

import React, { useState, useMemo } from "react";
import { FiSearch, FiEdit } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/ui/EmptyState"; 
import { MOCK_DASHBOARD_CONVERSATIONS } from "@/lib/mockData";

// Pin Icon
const PinIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.98087 2.97668C7.97409 3.09878 7.93791 3.21744 7.87542 3.32255C7.81646 3.4269 7.73593 3.51749 7.63922 3.58828C7.59708 3.61889 7.54761 3.6378 7.49581 3.64312L6.75345 3.74013C6.67109 3.75416 6.59476 3.79232 6.53412 3.84979C6.31057 4.06491 6.0828 4.27159 5.77067 4.60059L5.41215 4.95489C5.36554 5.00328 5.33213 5.06283 5.31514 5.12783L4.91865 6.7222C4.92034 6.73903 4.92034 6.75599 4.91865 6.77282C4.86372 6.89645 4.77987 7.00505 4.67416 7.08948C4.56845 7.1739 4.44398 7.23165 4.31127 7.25788H4.15942C4.07677 7.2571 3.99456 7.24576 3.91478 7.22414C3.78558 7.18451 3.6682 7.11351 3.57313 7.01746L2.50178 5.95032L0.532004 7.9201C0.472036 7.97597 0.392719 8.0064 0.310764 8.00495C0.228809 8.0035 0.150615 7.9703 0.0926553 7.91234C0.0346955 7.85438 0.00149528 7.77619 4.92852e-05 7.69424C-0.00139671 7.61228 0.0290243 7.53296 0.0849035 7.473L2.05468 5.50322L1.00019 4.44874C0.905904 4.35139 0.836457 4.23275 0.797734 4.10287C0.754896 3.97361 0.747612 3.83521 0.776644 3.70217C0.801421 3.57103 0.857894 3.44795 0.941143 3.34364C1.02546 3.23792 1.13396 3.15402 1.25749 3.099H1.3081L2.88561 2.67721C2.95549 2.65855 3.0194 2.62224 3.0712 2.57176C3.65749 1.9939 3.85995 1.79144 4.18051 1.44557C4.23508 1.3878 4.26916 1.3137 4.27753 1.23468L4.37876 0.488104C4.38333 0.434838 4.40228 0.383814 4.43359 0.340476C4.54149 0.195255 4.69321 0.0885687 4.86638 0.0361644C5.03954 -0.01624 5.22496 -0.0115862 5.39528 0.049439C5.5093 0.0914837 5.6129 0.157669 5.69897 0.243464L7.75732 2.31025C7.84163 2.39582 7.9067 2.49842 7.94816 2.61116C7.98962 2.72391 8.00653 2.84422 7.99774 2.96403L7.98087 2.97668Z" fill="currentColor"/>
  </svg>
);

interface Props {
  isChatOpen: boolean;
  selectedChatId: string | null;
  onSelectChat: (id: string) => void;
}

export default function DirectMessagesList({ isChatOpen, selectedChatId, onSelectChat }: Props) {
  const [activeTab, setActiveTab] = useState("All");
  const [pinnedChats, setPinnedChats] = useState<string[]>(["c1", "c2"]);

  const tabs = useMemo(() => {
    const unreadCount = MOCK_DASHBOARD_CONVERSATIONS.reduce((acc, curr) => acc + (curr.unread || 0), 0);
    const requestCount = MOCK_DASHBOARD_CONVERSATIONS.filter((c: any) => c.category === "request").length;
    
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
      case "Archived": return MOCK_DASHBOARD_CONVERSATIONS.filter((c: any) => c.category === "archived");
      case "Requests": return MOCK_DASHBOARD_CONVERSATIONS.filter((c: any) => c.category === "request");
      default: return MOCK_DASHBOARD_CONVERSATIONS;
    }
  }, [activeTab]);

  const togglePinChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setPinnedChats(prev => prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]);
  };

  return (
    <div className={`flex flex-col bg-white/10 rounded-[30px] transition-all duration-500 ease-in-out shrink-0 overflow-hidden relative shadow-2xl backdrop-blur-md h-full ${
      isChatOpen ? 'hidden lg:flex lg:w-80.5' : 'flex w-full lg:flex-1 lg:max-w-152.75'
    }`}>
      
      {/* Tabs */}
      <div className="flex items-center gap-5 absolute top-8.75 left-3 overflow-x-auto custom-scrollbar pr-4 max-w-full z-10">
        {tabs.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            className={`pb-1 font-medium text-[13px] leading-3.75 transition-colors whitespace-nowrap ${
              activeTab === tab.id ? "text-white border-b-2 border-primary-green" : "text-white/50 border-transparent hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col flex-1 w-full mt-22.5 px-3">
        
        {/* Search & New Message Button */}
        <div className="flex items-center gap-[8px] mb-[12px] shrink-0">
          <div className="flex-1 h-10 bg-black/10 rounded-[50px] flex items-center px-5 border border-transparent focus-within:border-primary-green transition-colors">
            <FiSearch className="text-white/30 shrink-0" size={14} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="flex-1 ml-2.5 bg-transparent border-none outline-none text-[13px] font-medium text-white placeholder:text-white/30 min-w-0"
            />
          </div>
          
          <button 
            className="w-10 h-10 shrink-0 bg-primary-green hover:brightness-110 rounded-full flex items-center justify-center text-white transition-all shadow-[0_4px_15px_rgba(115,191,68,0.25)] group"
            title="New Message"
          >
            <FiEdit size={15} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* List & Empty State */}
        <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar gap-3 pb-5">
          {filteredConversations.length === 0 ? (
            
            <div className="flex-1 flex items-center justify-center px-2">
              <EmptyState 
                icon={<FiSearch size={32} />}
                title="No messages found"
                description={
                  activeTab === "All" 
                    ? "You don't have any messages yet. Start a new conversation to collaborate." 
                    : `You don't have any ${activeTab.toLowerCase()} messages right now.`
                }
                actionLabel={activeTab === "All" ? "Start Conversation" : undefined}
                onAction={activeTab === "All" ? () => console.log("Start new conversation") : undefined}
              />
            </div>

          ) : (
            filteredConversations.map(chat => {
              const isChatPinned = pinnedChats.includes(chat.id);
              return (
                <button 
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={`group flex items-center justify-between w-full shrink-0 ${
                    isChatOpen ? 'h-16.5' : 'h-14.5'
                  } bg-gray-400/20 rounded-[20px] px-4 transition-all border border-transparent hover:border-white/10 ${
                    selectedChatId === chat.id ? "bg-black/20 border-white/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-7.5 h-7.5 rounded-full border border-primary-green overflow-hidden">
                        <Avatar name={chat.name} src={chat.avatar} className="w-full h-full object-cover" />
                      </div>
                      {chat.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.75 h-2.75 bg-primary-green rounded-full border-[1.5px] border-black/50 shadow-sm z-10" />
                      )}
                    </div>
                    
                    {/* Text */}
                    <div className="flex flex-col items-start justify-center overflow-hidden flex-1">
                      <span className="font-bold text-[12px] leading-3.5 text-white truncate w-full text-left">
                        {chat.name}
                      </span>
                      {chat.isTyping ? (
                        <span className="font-medium text-[10px] text-primary-green mt-1 truncate w-full text-left">
                          •••typing
                        </span>
                      ) : (
                        <span className="font-medium text-[10px] leading-3 text-white/70 mt-1 truncate w-full text-left">
                          {chat.lastMessage}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Items */}
                  <div className="flex flex-col items-end justify-center gap-1 w-11.75 shrink-0 h-full py-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${chat.unread > 0 ? 'bg-primary-green' : 'bg-transparent'}`} />
                    <span className="font-medium text-[10px] leading-3 text-white/50">
                      {chat.time}
                    </span>
                    <div 
                      onClick={(e) => togglePinChat(e, chat.id)}
                      className={`transition-opacity duration-200 mt-1 cursor-pointer p-1 -mr-1 rounded-full hover:bg-white/10 flex items-center justify-center
                        ${isChatPinned ? 'opacity-100 text-primary-green' : 'opacity-0 group-hover:opacity-100 text-white/50 hover:text-white'}
                      `}
                    >
                      <PinIcon className="w-3 h-3" />
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  );
}