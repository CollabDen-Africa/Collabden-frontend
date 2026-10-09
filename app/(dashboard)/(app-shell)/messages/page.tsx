"use client";

import type { DirectMessage } from "@/types/api.types";
import React, { useState, useMemo, useRef, useEffect } from "react";
import Avatar from "@/components/ui/Avatar";
import { 
  FiSearch, 
  FiPaperclip, 
  FiMic, 
  FiSend, 
  FiX, 
  FiChevronLeft, 
  FiCornerUpLeft,
  FiPlus,
  FiUsers,
  FiUser,
  FiBell
} from "react-icons/fi";
import { useMessaging } from "@/hooks/messaging/useMessaging";
import messagingService from "@/services/messaging.service";
import { useQueryClient } from "@tanstack/react-query";
import { useConnections } from "@/hooks/connections/useConnections";
import { useAuth } from "@/context/AuthContext";
import type { ConnectedUser } from "@/types/api.types";

// Pin Icon
const PinIcon = ({ className }: { className?: string }) => (
  <svg className={className} width="10" height="10" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.98087 2.97668C7.97409 3.09878 7.93791 3.21744 7.87542 3.32255C7.81646 3.4269 7.73593 3.51749 7.63922 3.58828C7.59708 3.61889 7.54761 3.6378 7.49581 3.64312L6.75345 3.74013C6.67109 3.75416 6.59476 3.79232 6.53412 3.84979C6.31057 4.06491 6.0828 4.27159 5.77067 4.60059L5.41215 4.95489C5.36554 5.00328 5.33213 5.06283 5.31514 5.12783L4.91865 6.7222C4.92034 6.73903 4.92034 6.75599 4.91865 6.77282C4.86372 6.89645 4.77987 7.00505 4.67416 7.08948C4.56845 7.1739 4.44398 7.23165 4.31127 7.25788H4.15942C4.07677 7.2571 3.99456 7.24576 3.91478 7.22414C3.78558 7.18451 3.6682 7.11351 3.57313 7.01746L2.50178 5.95032L0.532004 7.9201C0.472036 7.97597 0.392719 8.0064 0.310764 8.00495C0.228809 8.0035 0.150615 7.9703 0.0926553 7.91234C0.0346955 7.85438 0.00149528 7.77619 4.92852e-05 7.69424C-0.00139671 7.61228 0.0290243 7.53296 0.0849035 7.473L2.05468 5.50322L1.00019 4.44874C0.905904 4.35139 0.836457 4.23275 0.797734 4.10287C0.754896 3.97361 0.747612 3.83521 0.776644 3.70217C0.801421 3.57103 0.857894 3.44795 0.941143 3.34364C1.02546 3.23792 1.13396 3.15402 1.25749 3.099H1.3081L2.88561 2.67721C2.95549 2.65855 3.0194 2.62224 3.0712 2.57176C3.65749 1.9939 3.85995 1.79144 4.18051 1.44557C4.23508 1.3878 4.26916 1.3137 4.27753 1.23468L4.37876 0.488104C4.38333 0.434838 4.40228 0.383814 4.43359 0.340476C4.54149 0.195255 4.69321 0.0885687 4.86638 0.0361644C5.03954 -0.01624 5.22496 -0.0115862 5.39528 0.049439C5.5093 0.0914837 5.6129 0.157669 5.69897 0.243464L7.75732 2.31025C7.84163 2.39582 7.9067 2.49842 7.94816 2.61116C7.98962 2.72391 8.00653 2.84422 7.99774 2.96403L7.98087 2.97668Z" fill="currentColor" />
  </svg>
);

interface ChatUIItem {
  id: string;
  name: string;
  avatarUrl?: string | null;
  lastMsg: string;
  time: string;
  unread: number;
  isArchived: boolean;
  isOnline: boolean;
  isTyping: boolean;
  rawChat: any;
}

export default function DashboardMessagesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("All");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedChats, setPinnedChats] = useState<string[]>([]);
  const [replyToMessage, setReplyToMessage] = useState<any | null>(null);

  // New Message Modal State
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [connectionSearchQuery, setConnectionSearchQuery] = useState("");
  const [draftChats, setDraftChats] = useState<ChatUIItem[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    useChats,
    useChatMessages,
    useInfiniteChatMessages,
    useSendMessage,
    useMessageRequests,
    useRespondRequest,
    useSendRequest,
    useCreateChat,
  } = useMessaging();
  const queryClient = useQueryClient();
  const createChatMutation = useCreateChat();

  const { useUserConnections } = useConnections();
  const { data: userConnections = [], isLoading: isLoadingConnections } = useUserConnections();

  // Queries & Mutations
  const { data: apiChats = [], isLoading: isLoadingChats } = useChats();
  const activeChatId = selectedChatId && !selectedChatId.startsWith("connected-") ? selectedChatId : "";

  // 1. Primary Query: Instant cached messages for 0ms chat switching delay
  const { data: apiMessages = [] } = useChatMessages(activeChatId);

  // 2. Infinite Query: Pagination for older messages on scroll up
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteChatMessages(activeChatId);

  const sendMessageMutation = useSendMessage(activeChatId);
  const respondRequestMutation = useRespondRequest();
  const sendRequestMutation = useSendRequest();
  const { data: receivedRequests = [] } = useMessageRequests("received");
  const { data: sentRequests = [] } = useMessageRequests("sent");

  // Combine real backend chats with draft chats
  const chats = useMemo<ChatUIItem[]>(() => {
    const list: ChatUIItem[] = [...draftChats];

    if (apiChats && apiChats.length > 0) {
      apiChats.forEach((c) => {
        if (!list.some((d) => d.id === c.id)) {
          list.push({
            id: c.id,
            name: c.otherParticipant?.displayName || c.otherParticipant?.email?.split('@')[0] || "Collaborator",
            avatarUrl: c.otherParticipant?.avatarUrl,
            lastMsg: c.lastMessage?.content || (c.lastMessage?.voiceUrl ? "🎤 Voice message" : "No messages yet"),
            time: c.lastMessage ? new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
            unread: c.unreadCount || 0,
            isArchived: c.isArchived || false,
            isOnline: true,
            isTyping: false,
            rawChat: c,
          });
        }
      });
    }

    return list;
  }, [apiChats, draftChats]);

  // User IDs with existing chats
  const existingChatUserIds = useMemo(() => {
    const ids = new Set<string>();
    chats.forEach((c) => {
      if (c.rawChat?.otherParticipant?.id) {
        ids.add(c.rawChat.otherParticipant.id);
      }
    });
    return ids;
  }, [chats]);

  // User IDs with pending message requests
  const existingRequestUserIds = useMemo(() => {
    const ids = new Set<string>();
    receivedRequests.forEach((req: any) => {
      if (req.senderId) ids.add(req.senderId);
      if (req.receiverId) ids.add(req.receiverId);
    });
    sentRequests.forEach((req: any) => {
      if (req.senderId) ids.add(req.senderId);
      if (req.receiverId) ids.add(req.receiverId);
    });
    return ids;
  }, [receivedRequests, sentRequests]);

  // Filter connected users for new message modal
  const filteredConnections = useMemo(() => {
    if (!userConnections) return [];

    // Remove users with whom we already have a chat session or pending message request
    let list = userConnections.filter(
      (conn) => !existingChatUserIds.has(conn.id) && !existingRequestUserIds.has(conn.id)
    );

    if (connectionSearchQuery.trim()) {
      const q = connectionSearchQuery.toLowerCase();
      list = list.filter(
        (conn) =>
          (conn.displayName || conn.legalName || "").toLowerCase().includes(q) ||
          conn.email.toLowerCase().includes(q)
      );
    }

    return list;
  }, [userConnections, existingChatUserIds, existingRequestUserIds, connectionSearchQuery]);

  // Select a connection from modal to message
    const handleSelectConnection = (conn: ConnectedUser) => {
    setIsNewMessageModalOpen(false);
    setConnectionSearchQuery("");

    const existing = chats.find(
      (c) => c.rawChat?.otherParticipant?.id === conn.id || c.id === conn.id
    );

    if (existing && !existing.id.startsWith("connected-")) {
      setSelectedChatId(existing.id);
      return;
    }

    createChatMutation.mutate(conn.id, {
      onSuccess: (realChat) => {
        setDraftChats((prev) => prev.filter((d) => !d.id.includes(conn.id)));
        setSelectedChatId(realChat.id);
      },
      onError: () => {
        const draftId = `connected-${conn.id}`;
        const newDraft: ChatUIItem = {
          id: draftId,
          name: conn.displayName || conn.legalName || conn.email.split('@')[0],
          avatarUrl: conn.avatarUrl,
          lastMsg: "New conversation",
          time: "Now",
          unread: 0,
          isArchived: false,
          isOnline: true,
          isTyping: false,
          rawChat: {
            id: draftId,
            otherParticipant: {
              id: conn.id,
              email: conn.email,
              displayName: conn.displayName || conn.legalName,
              avatarUrl: conn.avatarUrl,
            },
          },
        };
        setDraftChats((prev) => [newDraft, ...prev.filter((d) => d.id !== draftId)]);
        setSelectedChatId(draftId);
      },
    });
  };

  // Selected chat resolution
  const activeChat = useMemo(() => {
    if (!selectedChatId) return null;
    return chats.find((c) => c.id === selectedChatId) || null;
  }, [chats, selectedChatId]);

  // Resolve message history combining cached queries, infinite pages, and fallback placeholder previews
  const messagesList = useMemo(() => {
    if (!selectedChatId) return [];
    if (selectedChatId.startsWith("connected-")) return [];

    let rawMsgs: any[] = [];
    if (infiniteData?.pages && infiniteData.pages.length > 0) {
      const allMsgs = infiniteData.pages.flat();
      const map = new Map<string, any>();
      allMsgs.forEach((m) => map.set(m.id, m));
      rawMsgs = Array.from(map.values()).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (apiMessages && apiMessages.length > 0) {
      rawMsgs = apiMessages;
    }

    if (rawMsgs.length === 0 && activeChat?.rawChat?.lastMessage) {
      rawMsgs = [activeChat.rawChat.lastMessage];
    }

    return rawMsgs.map((msg) => ({
      id: msg.id,
      senderId: msg.senderId === user?.id ? "me" : "them",
      senderName: msg.senderId === user?.id ? "You" : activeChat?.name || "Collaborator",
      content: msg.content || "",
      time: new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: msg.createdAt,
      quoted: null,
    }));
  }, [selectedChatId, infiniteData, apiMessages, user?.id, activeChat]);

  // Scroll Listener for Infinite Pagination (Scroll Up to Load Older Messages)
  const handleScroll = () => {
    if (!scrollRef.current) return;
    if (scrollRef.current.scrollTop < 40 && hasNextPage && !isFetchingNextPage) {
      const prevScrollHeight = scrollRef.current.scrollHeight;
      fetchNextPage().then(() => {
        if (scrollRef.current) {
          const newScrollHeight = scrollRef.current.scrollHeight;
          scrollRef.current.scrollTop = newScrollHeight - prevScrollHeight;
        }
      });
    }
  };

  // Tab definitions with count badges
  const tabs = useMemo(() => {
    const unreadCount = chats.reduce((acc, curr) => acc + (curr.unread || 0), 0);
    const requestCount = receivedRequests.length;

    return [
      { id: "All", label: "All" },
      { id: "Unread", label: unreadCount > 0 ? `Unread (${unreadCount})` : "Unread" },
      { id: "Archived", label: "Archived" },
      { id: "Requests", label: requestCount > 0 ? `Requests (${requestCount})` : "Requests" },
    ];
  }, [chats, receivedRequests]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    let list = chats;
    if (activeTab === "Unread") {
      list = chats.filter((c) => c.unread > 0);
    } else if (activeTab === "Archived") {
      list = chats.filter((c) => c.isArchived);
    } else {
      list = chats.filter((c) => !c.isArchived);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.lastMsg.toLowerCase().includes(q));
    }

    return list;
  }, [chats, activeTab, searchQuery]);

  // Auto-scroll messages to bottom on initial load or new message
  useEffect(() => {
    if (scrollRef.current && !isFetchingNextPage) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messagesList.length]);

    // Handle Send Message with Instant 0ms Input Response
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || !selectedChatId) return;

    const currentReplyTo = replyToMessage;

    // Instant UI Input Reset (0ms latency)
    setInputText("");
    setReplyToMessage(null);

    if (selectedChatId.startsWith("connected-")) {
      const recipientId = activeChat?.rawChat?.otherParticipant?.id || selectedChatId.replace("connected-", "");
      if (recipientId) {
        try {
          const realChat = await createChatMutation.mutateAsync(recipientId);
          setDraftChats((prev) => prev.filter((d) => d.id !== selectedChatId));
          setSelectedChatId(realChat.id);

          const optimisticMsg: DirectMessage = {
            id: `temp-${Date.now()}`,
            chatId: realChat.id,
            senderId: user?.id || "me",
            content: text,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          queryClient.setQueryData<DirectMessage[]>(
            ["messaging", "chats", realChat.id, "messages"],
            [optimisticMsg]
          );

          await messagingService.sendDirectMessage(realChat.id, {
            content: text,
            parentId: currentReplyTo?.id,
          });

          queryClient.invalidateQueries({ queryKey: ["messaging", "chats", realChat.id, "messages"] });
          queryClient.invalidateQueries({ queryKey: ["messaging", "chats"] });
        } catch (err) {
          console.error("Failed to create chat or send message", err);
        }
      }
      return;
    }

    sendMessageMutation.mutate({
      content: text,
      parentId: currentReplyTo?.id,
    });
  };

  const togglePinChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setPinnedChats((prev) =>
      prev.includes(chatId) ? prev.filter((id) => id !== chatId) : [...prev, chatId]
    );
  };

  const handleRespondToRequest = (requestId: string, status: "ACCEPTED" | "DECLINED") => {
    respondRequestMutation.mutate({ id: requestId, status });
  };

  const isChatOpen = selectedChatId !== null;

  const userName = ((user as any)?.displayName || (user as any)?.firstName ? `${(user as any).firstName} ${(user as any).lastName || ''}`.trim() : user?.email?.split('@')[0]) || "User";
  const userRole = (user as any)?.role || "Creator";

  return (
    <div className="w-full flex flex-col items-center pt-0 pb-6 px-0 font-sans text-white animate-in fade-in duration-300">
      
      {/* Outer Shell Card Container */}
      <div className="w-full max-w-6xl bg-[#121A1F] border border-white/10 rounded-[32px] sm:rounded-[45px] p-4 sm:p-6 shadow-2xl backdrop-blur-2xl flex flex-col gap-5">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between w-full pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* Back button */}
            <button
              onClick={() => setSelectedChatId(null)}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <FiChevronLeft size={18} />
            </button>

            {/* Page Title */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Messages
            </h1>
          </div>

          {/* Right Action: Create Message Button */}
          <button
            onClick={() => setIsNewMessageModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-green hover:bg-primary-green/90 text-white text-xs font-bold rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <FiPlus size={16} />
            <span>Create Message</span>
          </button>
        </div>

        {/* Main Work Area: Split View for Left List & Right Active Thread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full h-[680px] min-h-[550px]">
          
          {/* LEFT PANEL: Conversation Directory & Requests */}
          <div className={`lg:col-span-4 flex flex-col bg-[#1A242B]/80 border border-white/10 rounded-[28px] overflow-hidden p-4 sm:p-5 shadow-inner backdrop-blur-md h-full ${isChatOpen ? 'hidden lg:flex' : 'flex'}`}>
            
            {/* Tabs Filter Row */}
            <div className="flex items-center gap-4 border-b border-white/10 pb-3 mb-4 overflow-x-auto custom-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedChatId(null);
                  }}
                  className={`pb-1 text-xs font-semibold transition-all whitespace-nowrap relative ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-green rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Search Input Bar */}
            {activeTab !== "Requests" && (
              <div className="w-full bg-black/20 border border-white/10 rounded-full flex items-center px-4 py-2.5 mb-4 focus-within:border-primary-green transition-colors">
                <FiSearch className="text-white/40 shrink-0" size={14} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search messages..."
                  className="flex-1 ml-2.5 bg-transparent border-none outline-none text-xs font-medium text-white placeholder:text-white/40 min-w-0"
                />
              </div>
            )}

            {/* Conversations List */}
            <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar gap-2 pr-1">
              {isLoadingChats ? (
                <div className="flex justify-center items-center py-12">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-primary-green rounded-full animate-spin" />
                </div>
              ) : activeTab === "Requests" ? (
                receivedRequests.length === 0 ? (
                  <div className="text-white/40 text-center py-12 text-xs">No pending message requests</div>
                ) : (
                  receivedRequests.map((req: any) => (
                    <div
                      key={req.id}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 text-white"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={req.sender?.displayName || req.sender?.email} className="w-8 h-8 bg-accent-blue text-xs font-bold" />
                        <span className="font-bold text-xs truncate">
                          {req.sender?.displayName || req.sender?.email}
                        </span>
                      </div>
                      <p className="text-xs text-white/70 italic bg-black/20 p-2.5 rounded-xl border border-white/5">
                        &quot;{req.message}&quot;
                      </p>
                      <div className="flex gap-2 w-full mt-1">
                        <button
                          onClick={() => handleRespondToRequest(req.id, "ACCEPTED")}
                          disabled={respondRequestMutation.isPending}
                          className="flex-1 py-1.5 bg-primary-green text-white font-semibold rounded-full text-xs hover:brightness-110 transition-all disabled:opacity-50"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRespondToRequest(req.id, "DECLINED")}
                          disabled={respondRequestMutation.isPending}
                          className="flex-1 py-1.5 bg-white/10 text-white font-semibold rounded-full text-xs hover:bg-white/20 transition-all disabled:opacity-50"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))
                )
              ) : filteredConversations.length === 0 ? (
                <div className="text-white/40 text-center py-12 text-xs">No conversations found</div>
              ) : (
                filteredConversations.map((chat) => {
                  const isPinned = pinnedChats.includes(chat.id);
                  const isSelected = selectedChatId === chat.id;

                  return (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChatId(chat.id)}
                      className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
                        isSelected 
                          ? "bg-white/15 border-white/20 shadow-md" 
                          : "bg-white/5 hover:bg-white/10 border-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {/* Avatar with Status Dot */}
                        <div className="relative shrink-0">
                          <Avatar name={chat.name} src={chat.avatarUrl} className="w-9 h-9 bg-accent-blue text-xs font-bold" />
                          {chat.isOnline && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary-green border-2 border-[#1A242B] rounded-full" />
                          )}
                        </div>

                        {/* Name & Snippet */}
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-xs font-bold text-white truncate">{chat.name}</span>
                          <span className={`text-[11px] truncate mt-0.5 ${chat.isTyping ? 'text-primary-green font-semibold animate-pulse' : 'text-white/60'}`}>
                            {chat.lastMsg}
                          </span>
                        </div>
                      </div>

                      {/* Right Meta Info */}
                      <div className="flex flex-col items-end gap-1.5 ml-2 shrink-0">
                        <span className="text-[10px] text-white/40">{chat.time}</span>
                        <div className="flex items-center gap-1.5">
                          {chat.unread > 0 && (
                            <span className="w-2 h-2 rounded-full bg-primary-green" />
                          )}
                          <button
                            onClick={(e) => togglePinChat(e, chat.id)}
                            className={`p-1 rounded-full transition-opacity ${
                              isPinned ? "opacity-100 text-primary-green" : "opacity-0 group-hover:opacity-100 text-white/40 hover:text-white"
                            }`}
                          >
                            <PinIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* RIGHT PANEL: Chat History & Input Bar */}
          <div className={`lg:col-span-8 flex flex-col bg-[#162026] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl relative h-full ${!isChatOpen ? 'hidden lg:flex items-center justify-center' : 'flex'}`}>
            
            {!selectedChatId ? (
              /* Placeholder screen when no chat is selected on desktop */
              <div className="flex flex-col items-center justify-center gap-3 text-center p-8">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                  <FiMic size={28} />
                </div>
                <h3 className="text-lg font-bold text-white">Select a message</h3>
                <p className="text-xs text-white/50 max-w-xs leading-relaxed">
                  Choose a conversation from the left to start collaborating and sharing tracks.
                </p>
              </div>
            ) : (
              <>
                {/* Active Chat Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-black/20 border-b border-white/10 backdrop-blur-md z-10">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedChatId(null)}
                      className="lg:hidden text-white/60 hover:text-white mr-1"
                    >
                      <FiChevronLeft size={20} />
                    </button>
                    <Avatar name={activeChat?.name || "Collaborator"} src={activeChat?.avatarUrl} className="w-9 h-9 bg-accent-blue text-xs font-bold" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">{activeChat?.name}</span>
                      <span className="text-[10px] text-primary-green flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-green inline-block" /> Active now
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                      <FiBell size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedChatId(null)}
                      className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                </div>

                {/* Message Flow Thread */}
                <div
                  ref={scrollRef}
                  onScroll={handleScroll}
                  className="flex-1 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6"
                >
                  {/* Top Spinner for Older Messages Pagination */}
                  {isFetchingNextPage && (
                    <div className="flex items-center justify-center py-2 text-xs text-white/50 gap-2 animate-in fade-in">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-primary-green rounded-full animate-spin" />
                      <span>Loading older messages...</span>
                    </div>
                  )}

                  {/* Date Divider */}
                  <div className="flex items-center justify-center my-2">
                    <span className="bg-white/5 border border-white/10 text-[11px] font-medium text-white/50 px-3 py-1 rounded-full">
                      Conversation History
                    </span>
                  </div>

                  {messagesList.length === 0 ? (
                    <div className="text-center py-12 text-xs text-white/40">
                      No messages in this chat yet. Send a message to start the conversation!
                    </div>
                  ) : (
                    messagesList.map((msg: any, idx: number) => {
                      const isMe = msg.senderId === "me";

                      return (
                        <div
                          key={msg.id || idx}
                          className={`flex items-end gap-3 max-w-[85%] sm:max-w-[75%] group ${
                            isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                          }`}
                        >
                          {/* Avatar */}
                          <Avatar
                            name={msg.senderName}
                            src={isMe ? undefined : activeChat?.avatarUrl}
                            className="w-8 h-8 bg-accent-blue text-[10px] font-bold shrink-0 mb-1"
                          />

                          <div className={`flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
                            
                            {/* Message Bubble Container */}
                            <div
                              className={`p-4 rounded-2xl shadow-md relative text-sm leading-relaxed transition-all ${
                                isMe
                                  ? "bg-[#204F99] text-white rounded-br-none"
                                  : "bg-white text-slate-900 rounded-bl-none font-medium"
                              }`}
                            >
                              {/* Quoted Reply Box inside bubble if replying */}
                              {msg.quoted && (
                                <div className={`mb-2.5 p-2.5 rounded-xl border text-xs ${
                                  isMe ? "bg-black/25 border-white/20 text-white/90" : "bg-slate-100 border-slate-300 text-slate-700"
                                }`}>
                                  <span className="font-bold block text-[11px]">{msg.quoted.sender}</span>
                                  <span className="line-clamp-1 italic text-[11px]">{msg.quoted.text}</span>
                                </div>
                              )}

                              <span>{msg.content}</span>

                              {/* Reply Action Button on hover */}
                              <button
                                onClick={() => setReplyToMessage(msg)}
                                className={`absolute top-2 opacity-0 group-hover:opacity-100 p-1 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all ${
                                  isMe ? "-left-8" : "-right-8"
                                }`}
                                title="Reply"
                              >
                                <FiCornerUpLeft size={12} />
                              </button>
                            </div>

                            {/* Sender & Timestamp */}
                            <span className="text-[10px] text-white/40 px-1 mt-0.5">
                              {msg.senderName} • {msg.time}
                            </span>

                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Typing Indicator if active */}
                  {activeChat?.isTyping && (
                    <div className="flex items-end gap-3 mr-auto max-w-[75%] animate-pulse">
                      <Avatar name={activeChat.name} src={activeChat.avatarUrl} className="w-8 h-8 bg-accent-blue text-[10px] font-bold shrink-0 mb-1" />
                      <div className="bg-white text-slate-800 px-4 py-2.5 rounded-2xl rounded-bl-none flex items-center gap-1.5 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Reply Preview Bar */}
                {replyToMessage && (
                  <div className="flex items-center justify-between bg-black/40 border-t border-white/10 px-6 py-2 text-xs text-white/70">
                    <div className="flex items-center gap-2 truncate">
                      <FiCornerUpLeft className="text-primary-green shrink-0" size={14} />
                      <span className="truncate">Replying to <strong className="text-white">{replyToMessage.senderName}</strong>: &quot;{replyToMessage.content}&quot;</span>
                    </div>
                    <button onClick={() => setReplyToMessage(null)} className="text-white/50 hover:text-white p-1">
                      <FiX size={14} />
                    </button>
                  </div>
                )}

                {/* Bottom Input Action Control Bar */}
                <div className="p-4 sm:p-5 bg-black/30 border-t border-white/10 flex items-center gap-3 z-10 backdrop-blur-md">
                  
                  {/* Media / Mic Attachment Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      type="button"
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all"
                      title="Attach file"
                    >
                      <FiPaperclip size={18} />
                    </button>

                    <button 
                      type="button"
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all"
                      title="Voice Note"
                    >
                      <FiMic size={18} />
                    </button>
                  </div>

                  {/* Text Input & Send Pill */}
                  <form onSubmit={handleSendMessage} className="flex-1 flex items-center relative">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full bg-white text-slate-900 placeholder:text-slate-400 font-medium text-sm rounded-full pl-5 pr-14 py-3 border-none outline-none shadow-lg focus:ring-2 ring-primary-green"
                    />

                    <button
                      type="submit"
                      disabled={!inputText.trim() || sendMessageMutation.isPending}
                      className="absolute right-1 w-10 h-10 rounded-full bg-primary-green hover:bg-primary-green/90 disabled:opacity-40 flex items-center justify-center text-white transition-all shadow-md shrink-0"
                    >
                      <FiSend size={16} className="ml-0.5" />
                    </button>
                  </form>

                </div>
              </>
            )}

          </div>

        </div>

      </div>

      {/* Create Message Modal */}
      {isNewMessageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#182228] border border-white/10 rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl flex flex-col gap-4 text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary-green/20 text-primary-green flex items-center justify-center">
                  <FiUsers size={16} />
                </div>
                <h3 className="font-bold text-base text-white">Start New Message</h3>
              </div>
              <button
                onClick={() => setIsNewMessageModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Search Input */}
            <div className="w-full bg-black/30 border border-white/10 rounded-full flex items-center px-4 py-2.5 focus-within:border-primary-green transition-colors">
              <FiSearch className="text-white/40 shrink-0" size={14} />
              <input
                type="text"
                value={connectionSearchQuery}
                onChange={(e) => setConnectionSearchQuery(e.target.value)}
                placeholder="Search connected collaborators..."
                className="flex-1 ml-2 bg-transparent border-none outline-none text-xs font-medium text-white placeholder:text-white/40"
              />
            </div>

            {/* Connections List */}
            <div className="flex flex-col max-h-72 overflow-y-auto custom-scrollbar gap-2 pr-1">
              {isLoadingConnections ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-primary-green rounded-full animate-spin" />
                </div>
              ) : filteredConnections.length === 0 ? (
                <div className="text-center py-8 px-4 text-white/50 text-xs flex flex-col items-center gap-2">
                  <FiUser size={24} className="text-white/30" />
                  <p>No connected users found.</p>
                  <span className="text-[11px] text-white/30">
                    Connect with collaborators on CollabDen to start messaging directly.
                  </span>
                </div>
              ) : (
                filteredConnections.map((conn) => (
                  <button
                    key={conn.id}
                    onClick={() => handleSelectConnection(conn)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        name={conn.displayName || conn.legalName || conn.email}
                        src={conn.avatarUrl}
                        className="w-10 h-10 bg-accent-blue font-bold text-xs shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-xs text-white truncate group-hover:text-primary-green transition-colors">
                          {conn.displayName || conn.legalName || conn.email.split("@")[0]}
                        </span>
                        <span className="text-[11px] text-white/40 truncate">
                          {conn.email}
                        </span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-primary-green/20 text-primary-green group-hover:bg-primary-green group-hover:text-white text-[11px] font-semibold rounded-full transition-all shrink-0">
                      Message
                    </span>
                  </button>
                ))
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
