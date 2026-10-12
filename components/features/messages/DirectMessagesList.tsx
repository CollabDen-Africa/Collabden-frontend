"use client";

import React from "react";
import Avatar from "@/components/ui/Avatar";
import { FiSearch, FiPlus } from "react-icons/fi";

// Double checkmark SVG for sent messages
export const DoubleCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.5 8.5L5 12L12.5 4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 8.5L9 12L15 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Pushpin icon SVG matching Figma design
export const PinIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="10" height="10" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.98087 2.97668C7.97409 3.09878 7.93791 3.21744 7.87542 3.32255C7.81646 3.4269 7.73593 3.51749 7.63922 3.58828C7.59708 3.61889 7.54761 3.6378 7.49581 3.64312L6.75345 3.74013C6.67109 3.75416 6.59476 3.79232 6.53412 3.84979C6.31057 4.06491 6.0828 4.27159 5.77067 4.60059L5.41215 4.95489C5.36554 5.00328 5.33213 5.06283 5.31514 5.12783L4.91865 6.7222C4.92034 6.73903 4.92034 6.75599 4.91865 6.77282C4.86372 6.89645 4.77987 7.00505 4.67416 7.08948C4.56845 7.1739 4.44398 7.23165 4.31127 7.25788H4.15942C4.07677 7.2571 3.99456 7.24576 3.91478 7.22414C3.78558 7.18451 3.6682 7.11351 3.57313 7.01746L2.50178 5.95032L0.532004 7.9201C0.472036 7.97597 0.392719 8.0064 0.310764 8.00495C0.228809 8.0035 0.150615 7.9703 0.0926553 7.91234C0.0346955 7.85438 0.00149528 7.77619 4.92852e-05 7.69424C-0.00139671 7.61228 0.0290243 7.53296 0.0849035 7.473L2.05468 5.50322L1.00019 4.44874C0.905904 4.35139 0.836457 4.23275 0.797734 4.10287C0.754896 3.97361 0.747612 3.83521 0.776644 3.70217C0.801421 3.57103 0.857894 3.44795 0.941143 3.34364C1.02546 3.23792 1.13396 3.15402 1.25749 3.099H1.3081L2.88561 2.67721C2.95549 2.65855 3.0194 2.62224 3.0712 2.57176C3.65749 1.9939 3.85995 1.79144 4.18051 1.44557C4.23508 1.3878 4.26916 1.3137 4.27753 1.23468L4.37876 0.488104C4.38333 0.434838 4.40228 0.383814 4.43359 0.340476C4.54149 0.195255 4.69321 0.0885687 4.86638 0.0361644C5.03954 -0.01624 5.22496 -0.0115862 5.39528 0.049439C5.5093 0.0914837 5.6129 0.157669 5.69897 0.243464L7.75732 2.31025C7.84163 2.39582 7.9067 2.49842 7.94816 2.61116C7.98962 2.72391 8.00653 2.84422 7.99774 2.96403L7.98087 2.97668Z" fill="currentColor" />
  </svg>
);

export interface DirectMessageItem {
  id: string;
  recipientId?: string;
  name: string;
  avatarUrl?: string | null;
  lastMsg: string;
  isFromMe?: boolean;
  time: string;
  unread: number;
  isArchived: boolean;
  isOnline: boolean;
  isTyping: boolean;
  isPinned?: boolean;
  isRequestDraft?: boolean;
  pendingRequest?: any;
}

interface DirectMessagesListProps {
  isFullWidth?: boolean;
  isChatOpen?: boolean;
  selectedChatId: string | null;
  onSelectChat: (id: string) => void;
  chats: DirectMessageItem[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: { id: string; label: string }[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  pinnedChats: string[];
  togglePinChat: (e: React.MouseEvent, chatId: string) => void;
  isLoading?: boolean;
  receivedRequests?: any[];
  onRespondRequest?: (id: string, status: "ACCEPTED" | "DECLINED") => void;
  isRespondingRequest?: boolean;
  onCreateMessage?: () => void;
  className?: string;
}

export default function DirectMessagesList({
  selectedChatId,
  onSelectChat,
  chats,
  activeTab,
  setActiveTab,
  tabs,
  searchQuery,
  setSearchQuery,
  pinnedChats,
  togglePinChat,
  isLoading = false,
  receivedRequests = [],
  onRespondRequest,
  isRespondingRequest = false,
  onCreateMessage,
  className = "",
}: DirectMessagesListProps) {
  return (
    <div
      className={`flex flex-col bg-[#1A2328]/90 border border-white/10 rounded-[32px] p-5 sm:p-6 shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300 w-full ${className}`}
    >
   
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 gap-4 shrink-0">
        <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto custom-scrollbar flex-1 pr-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-1 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap relative cursor-pointer ${
                  isActive ? "text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-[-13px] left-0 right-0 h-[2.5px] bg-primary-green rounded-full shadow-sm" />
                )}
              </button>
            );
          })}
        </div>

      
        {onCreateMessage && (
          <button
            onClick={onCreateMessage}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-green/20 hover:bg-primary-green text-primary-green hover:text-white text-xs font-bold rounded-full transition-all shrink-0 active:scale-95 cursor-pointer"
            title="Start new conversation"
          >
            <FiPlus size={14} />
            <span className="hidden sm:inline">New</span>
          </button>
        )}
      </div>

 
      {activeTab !== "Requests" && (
        <div className="w-full bg-[#131A1F]/70 border border-white/10 rounded-full flex items-center px-4 py-2.5 mb-4 focus-within:border-primary-green/80 transition-colors shadow-inner shrink-0">
          <FiSearch className="text-white/40 shrink-0" size={15} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages..."
            className="flex-1 ml-2.5 bg-transparent border-none outline-none text-xs sm:text-sm font-medium text-white placeholder:text-white/40 min-w-0"
          />
        </div>
      )}

      
      <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar gap-2.5 pr-1 pb-2 min-h-0">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-6 h-6 border-2 border-white/20 border-t-primary-green rounded-full animate-spin" />
            <span className="text-xs text-white/40">Loading messages...</span>
          </div>
        ) : activeTab === "Requests" ? (
          receivedRequests.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16 text-xs text-white/40">
              No pending message requests
            </div>
          ) : (
            receivedRequests.map((req: any) => (
              <div
                key={req.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 text-white shrink-0"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    name={
                      req.sender?.displayName ||
                      [req.sender?.firstName, req.sender?.lastName]
                        .filter(Boolean)
                        .join(" ") ||
                      req.sender?.email ||
                      "Collaborator"
                    }
                    src={req.sender?.avatarUrl}
                    className="w-9 h-9 bg-accent-blue text-xs font-bold"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs truncate text-white">
                      {req.sender?.displayName ||
                        [req.sender?.firstName, req.sender?.lastName]
                          .filter(Boolean)
                          .join(" ") ||
                        req.sender?.email?.split("@")[0] ||
                        "Collaborator"}
                    </span>
                    <span className="text-[11px] text-white/40 truncate">
                      {req.sender?.email}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-white/80 italic bg-black/25 p-3 rounded-xl border border-white/5">
                  &quot;{req.message}&quot;
                </p>
                <div className="flex gap-2 w-full mt-1">
                  <button
                    onClick={() =>
                      onRespondRequest && onRespondRequest(req.id, "ACCEPTED")
                    }
                    disabled={isRespondingRequest}
                    className="flex-1 py-1.5 bg-primary-green hover:bg-[#16A34A] text-white font-semibold rounded-full text-xs transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() =>
                      onRespondRequest && onRespondRequest(req.id, "DECLINED")
                    }
                    disabled={isRespondingRequest}
                    className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full text-xs transition-all disabled:opacity-50 cursor-pointer border border-white/5"
                  >
                    Ignore
                  </button>
                </div>
              </div>
            ))
          )
        ) : chats.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4">
            <p className="text-sm font-semibold text-white/80">
              {searchQuery ? "No conversations matching your search" : "No messages yet"}
            </p>
            <p className="text-xs text-white/40 mt-1 max-w-xs">
              {searchQuery ? "Try searching for another user or message" : "Connect with collaborators on CollabDen to start chatting."}
            </p>
          </div>
        ) : (
          chats.map((chat) => {
            const isSelected = selectedChatId === chat.id;
            const isPinned = pinnedChats.includes(chat.id) || !!chat.isPinned;

            return (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`group flex items-center justify-between p-3 sm:p-3.5 rounded-[20px] transition-all border text-left cursor-pointer w-full shrink-0 ${
                  isSelected
                    ? "bg-[#283238] border-white/15 shadow-md"
                    : "bg-[#20272B] hover:bg-[#252E34] border-transparent hover:border-white/10"
                }`}
              >
            
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
               
                  <div className="relative shrink-0">
                    <Avatar
                      name={chat.name}
                      src={chat.avatarUrl}
                      className={`w-10 h-10 rounded-full object-cover text-xs font-bold ${
                        isSelected || chat.isTyping
                          ? "border-2 border-primary-green"
                          : "border border-white/10"
                      }`}
                    />
                  </div>

               
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-raleway font-bold text-xs sm:text-sm text-white truncate">
                      {chat.name}
                    </span>

                    {chat.isTyping ? (
                      <span className="text-[11px] sm:text-xs text-primary-green font-medium mt-0.5 truncate animate-pulse">
                        ••• typing
                      </span>
                    ) : chat.isFromMe ? (
                      <div className="flex items-center gap-1.5 mt-0.5 min-w-0 text-[11px] sm:text-xs text-white/60">
                        <DoubleCheckIcon className="text-primary-green shrink-0" />
                        <span className="truncate">You: {chat.lastMsg}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] sm:text-xs text-white/60 mt-0.5 truncate">
                        {chat.lastMsg}
                      </span>
                    )}
                  </div>
                </div>

          
                <div className="flex flex-col items-end justify-between ml-3 shrink-0 self-stretch py-0.5">
             
                  <div className="flex items-center gap-1.5 h-3">
                    {(chat.unread > 0 || chat.isOnline) && (
                      <span className="w-2 h-2 rounded-full bg-primary-green shadow-sm" />
                    )}
                  </div>

             
                  <div className="flex items-center gap-1.5 mt-auto">
                    {isPinned ? (
                      <div
                        onClick={(e) => togglePinChat(e, chat.id)}
                        className="p-0.5 text-white/50 hover:text-white transition-colors cursor-pointer"
                        title="Unpin conversation"
                      >
                        <PinIcon className="w-2.5 h-2.5 text-white/50" />
                      </div>
                    ) : chat.time ? (
                      <span className="text-[10px] sm:text-[11px] text-white/40 font-medium">
                        {chat.time}
                      </span>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
