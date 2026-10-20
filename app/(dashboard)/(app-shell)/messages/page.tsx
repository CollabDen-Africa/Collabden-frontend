"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import DirectMessagesList, {
  type DirectMessageItem,
} from "@/components/features/messages/DirectMessagesList";
import ProjectMessagesList, {
  type ProjectMessageItem,
} from "@/components/features/messages/ProjectMessagesList";
import ChatWindow from "@/components/features/messages/ChatWindow";
import Avatar from "@/components/ui/Avatar";
import { FiX, FiSearch, FiUsers, FiUser, FiChevronLeft } from "react-icons/fi";
import { useMessaging } from "@/hooks/messaging/useMessaging";
import { useProjects } from "@/hooks/projects/useProjects";
import { useConnections } from "@/hooks/connections/useConnections";
import messagingService from "@/services/messaging.service";
import { useAuth } from "@/context/AuthContext";
import type { ConnectedUser } from "@/types/api.types";

function DashboardMessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const queryUserId = searchParams.get("userId") || searchParams.get("id");
  const queryName = searchParams.get("name");
  const queryAvatar = searchParams.get("avatar");

  const [activeTab, setActiveTab] = useState("All");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedChats, setPinnedChats] = useState<string[]>([]);

  // Track read direct messages and project messages
  const [readChatIds, setReadChatIds] = useState<Set<string>>(new Set());
  const [readProjectIds, setReadProjectIds] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(`collabden_read_projects_${user?.id}`);
        return saved ? new Set(JSON.parse(saved)) : new Set();
      } catch {
        return new Set();
      }
    }
    return new Set();
  });

  const markProjectAsRead = (projectId: string) => {
    setReadProjectIds((prev) => {
      const next = new Set(prev);
      next.add(projectId);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            `collabden_read_projects_${user?.id}`,
            JSON.stringify(Array.from(next))
          );
        } catch {}
      }
      return next;
    });
  };

  const handleSelectProject = (projectId: string) => {
    markProjectAsRead(projectId);
    router.push(`/workspace/messages?projectId=${projectId}`);
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setReadChatIds((prev) => {
      const next = new Set(prev);
      next.add(chatId);
      return next;
    });
    if (
      !chatId.startsWith("connected-") &&
      !chatId.startsWith("request-") &&
      !chatId.startsWith("mock-")
    ) {
      messagingService
        .markChatAsRead(chatId)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["messaging", "chats"] });
        })
        .catch(() => {});
    }
  };

  // New Message Modal State
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [connectionSearchQuery, setConnectionSearchQuery] = useState("");
  const [draftChats, setDraftChats] = useState<DirectMessageItem[]>([]);

  // Messaging queries
  const {
    useChats,
    useMessageRequests,
    useRespondRequest,
    useCreateChat,
  } = useMessaging();

  const { data: apiChats = [], isLoading: isLoadingChats } = useChats();
  const { data: receivedRequests = [] } = useMessageRequests("received");
  const { data: sentRequests = [] } = useMessageRequests("sent");
  const respondRequestMutation = useRespondRequest();
  const createChatMutation = useCreateChat();

  // Handle message request from query parameters (User A viewing User B's profile)
  useEffect(() => {
    if (!queryUserId || queryUserId === user?.id) return;

    // 1. Check if direct chat already exists in apiChats
    const existingChat = apiChats.find(
      (c) => c.otherParticipant?.id === queryUserId
    );
    if (existingChat) {
      setSelectedChatId(existingChat.id);
      return;
    }

    // 2. Check if a sent request is already pending to this user
    const pendingSent = sentRequests.find(
      (r) => r.receiverId === queryUserId && r.status === "PENDING"
    );

    const draftId = `request-${queryUserId}`;
    const draftItem: DirectMessageItem = {
      id: draftId,
      recipientId: queryUserId,
      name: queryName ? decodeURIComponent(queryName) : "Collaborator",
      avatarUrl: queryAvatar ? decodeURIComponent(queryAvatar) : null,
      lastMsg: pendingSent?.message || "New message request",
      time: pendingSent ? "Pending" : "Draft",
      unread: 0,
      isArchived: false,
      isRequestDraft: true,
      pendingRequest: pendingSent || null,
    };

    setDraftChats((prev) => {
      const filtered = prev.filter(
        (d) => d.id !== draftId && d.recipientId !== queryUserId
      );
      return [draftItem, ...filtered];
    });

    setSelectedChatId(draftId);
  }, [queryUserId, queryName, queryAvatar, apiChats, sentRequests, user?.id]);

  // Projects query using backend hasMessages filter directly
  const { useProjectsWithMessages } = useProjects();
  const { data: apiProjects = [], isLoading: isLoadingProjects } =
    useProjectsWithMessages();

  // Connections for starting new direct message
  const { useUserConnections } = useConnections();
  const { data: userConnections = [], isLoading: isLoadingConnections } =
    useUserConnections();

  // 1. Process Project Messages: provided directly from backend hasMessages query
  const projectConversations = useMemo<ProjectMessageItem[]>(() => {
    if (!apiProjects || apiProjects.length === 0) {
      return [];
    }

    return apiProjects.map((p: any) => {
      const collabs = p.collaborators || [];
      const isRead = readProjectIds.has(p.id);

      // Count unread: only messages sent by others that haven't been marked read
      const incomingMessages = (p.messages || []).filter(
        (m: any) => m.senderId && m.senderId !== user?.id
      );
      const unread = isRead ? 0 : incomingMessages.length;

      return {
        id: p.id,
        name: p.name || p.title || "Untitled Project",
        genre: p.genre || "General",
        trackCount: p._count?.files ?? (p.files ? p.files.length : 0),
        collaborators: collabs.map((c: any) => ({
          id: c.user?.id || c.userId || c.id,
          displayName:
            c.user?.displayName ||
            (c.user as any)?.legalName ||
            c.user?.email?.split("@")[0] ||
            "Member",
          avatarUrl: c.user?.avatarUrl,
        })),
        unreadCount: unread,
      };
    });
  }, [apiProjects, user?.id, readProjectIds]);

  // Determine whether user has project messages
  const hasProjectMessages = projectConversations.length > 0;

  // 2. Process Direct Messages: ONLY real backend chats and live drafts
  const allChats = useMemo<DirectMessageItem[]>(() => {
    // Filter out draft chats if a real chat with this user now exists in apiChats
    const list: DirectMessageItem[] = draftChats.filter((d) => {
      if (!d.recipientId) return true;
      return !apiChats.some((c) => c.otherParticipant?.id === d.recipientId);
    });

    if (apiChats && apiChats.length > 0) {
      apiChats.forEach((c) => {
        if (!list.some((d) => d.id === c.id)) {
          const isFromMe = c.lastMessage?.senderId === user?.id;
          const isRead = selectedChatId === c.id || readChatIds.has(c.id);
          list.push({
            id: c.id,
            recipientId: c.otherParticipant?.id,
            name:
              c.otherParticipant?.displayName ||
              (c.otherParticipant as any)?.legalName ||
              c.otherParticipant?.email?.split("@")[0] ||
              "Collaborator",
            avatarUrl: c.otherParticipant?.avatarUrl,
            lastMsg:
              c.lastMessage?.content ||
              (c.lastMessage?.voiceUrl
                ? "🎤 Voice message"
                : "No messages yet"),
            isFromMe,
            time: c.lastMessage
              ? new Date(c.lastMessage.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            unread: isRead ? 0 : c.unreadCount || 0,
            isArchived: c.isArchived || false,
          });
        }
      });
    }

    return list;
  }, [apiChats, draftChats, user?.id, selectedChatId, readChatIds]);

  // Tabs definitions: Real counts only
  const tabs = useMemo(() => {
    const unreadCount = allChats.reduce(
      (acc, curr) => acc + (curr.unread || 0),
      0
    );
    const requestCount = receivedRequests.length;

    return [
      { id: "All", label: "All" },
      {
        id: "Unread",
        label: unreadCount > 0 ? `Unread (${unreadCount})` : "Unread",
      },
      { id: "Archived", label: "Archived" },
      {
        id: "Requests",
        label: requestCount > 0 ? `Requests (${requestCount})` : "Requests",
      },
    ];
  }, [allChats, receivedRequests]);

  // Filtered direct conversations by tab & search query
  const filteredConversations = useMemo(() => {
    let list = allChats;

    if (activeTab === "Unread") {
      list = allChats.filter((c) => c.unread > 0);
    } else if (activeTab === "Archived") {
      list = allChats.filter((c) => c.isArchived);
    } else {
      list = allChats.filter((c) => !c.isArchived);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.lastMsg.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allChats, activeTab, searchQuery]);

  // Selected chat details
  const activeChat = useMemo(() => {
    if (!selectedChatId) return null;
    return allChats.find((c) => c.id === selectedChatId) || null;
  }, [allChats, selectedChatId]);

  // Toggle pin on a direct chat
  const togglePinChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setPinnedChats((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId]
    );
  };

  // Connections modal filtering
  const existingChatUserIds = useMemo(() => {
    const ids = new Set<string>();
    apiChats.forEach((c) => {
      if (c.otherParticipant?.id) ids.add(c.otherParticipant.id);
    });
    return ids;
  }, [apiChats]);

  const filteredConnections = useMemo(() => {
    if (!userConnections) return [];
    let list = userConnections.filter(
      (conn) => !existingChatUserIds.has(conn.id)
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
  }, [userConnections, existingChatUserIds, connectionSearchQuery]);

  const handleSelectConnection = (conn: ConnectedUser) => {
    setIsNewMessageModalOpen(false);
    setConnectionSearchQuery("");

    const existing = allChats.find((c) => c.id === conn.id);
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
        const newDraft: DirectMessageItem = {
          id: draftId,
          recipientId: conn.id,
          name: conn.displayName || conn.legalName || conn.email.split("@")[0],
          avatarUrl: conn.avatarUrl,
          lastMsg: "New conversation",
          time: "Now",
          unread: 0,
          isArchived: false,
        };
        setDraftChats((prev) => [
          newDraft,
          ...prev.filter((d) => d.id !== draftId),
        ]);
        setSelectedChatId(draftId);
      },
    });
  };

  const handleRespondRequest = (id: string, status: "ACCEPTED" | "DECLINED") => {
    respondRequestMutation.mutate(
      { id, status },
      {
        onSuccess: (data) => {
          if (status === "ACCEPTED" && data?.chatId) {
            setActiveTab("All");
            setSelectedChatId(data.chatId);
          }
        },
      }
    );
  };

  const isChatOpen = selectedChatId !== null;

  return (
    <div className="w-full flex flex-col items-center lg:-mt-[42px] pb-6 lg:-mb-[100px] font-sans text-white animate-in fade-in duration-300">
      {/* Centered Page Title & Circular Back Button matching design */}
      <div className="w-full max-w-[1240px] relative flex items-center justify-center mb-3 lg:mb-2">
        {isChatOpen && (
          <button
            onClick={() => setSelectedChatId(null)}
            className="absolute left-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-transparent hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all shadow-sm cursor-pointer z-10"
            title="Back to messages"
          >
            <FiChevronLeft size={18} />
          </button>
        )}
        <h1 className="font-raleway text-2xl sm:text-3xl lg:text-[34px] font-semibold tracking-tight text-white text-center pointer-events-none">
          Messages
        </h1>
      </div>

      {/* Main Container Area with strictly synchronized heights */}
      <div className="w-full max-w-[1240px]">
        {/* VIEW 1 & 2: When no chat conversation is open */}
        {!isChatOpen ? (
          hasProjectMessages ? (
            /* User has Direct Messages AND Project Messages (Side-by-Side) */
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-1 gap-6 w-full h-[calc(100vh-92px)] max-h-[780px]">
              {/* Left Column: Direct Messages */}
              <div className="lg:col-span-7 h-full min-h-0">
                <DirectMessagesList
                  isFullWidth={false}
                  selectedChatId={selectedChatId}
                  onSelectChat={handleSelectChat}
                  chats={filteredConversations}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  tabs={tabs}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  pinnedChats={pinnedChats}
                  togglePinChat={togglePinChat}
                  isLoading={isLoadingChats}
                  receivedRequests={receivedRequests}
                  onRespondRequest={handleRespondRequest}
                  isRespondingRequest={respondRequestMutation.isPending}
                  onCreateMessage={() => setIsNewMessageModalOpen(true)}
                  className="h-full"
                />
              </div>

              {/* Right Column: Project Messages */}
              <div className="lg:col-span-5 h-full min-h-0">
                <ProjectMessagesList
                  projects={projectConversations}
                  isLoading={isLoadingProjects}
                  onSelectProject={handleSelectProject}
                  className="h-full"
                />
              </div>
            </div>
          ) : (
            /* User has JUST Direct Messages (Full-Width) */
            <div className="w-full h-[calc(100vh-92px)] max-h-[780px]">
              <DirectMessagesList
                isFullWidth={true}
                selectedChatId={selectedChatId}
                onSelectChat={handleSelectChat}
                chats={filteredConversations}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                pinnedChats={pinnedChats}
                togglePinChat={togglePinChat}
                isLoading={isLoadingChats}
                receivedRequests={receivedRequests}
                onRespondRequest={handleRespondRequest}
                isRespondingRequest={respondRequestMutation.isPending}
                onCreateMessage={() => setIsNewMessageModalOpen(true)}
                className="h-full"
              />
            </div>
          )
        ) : (
          /* VIEW 3: Active Chat Conversation Thread Opened */
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-1 gap-6 w-full h-[calc(100vh-92px)] max-h-[780px]">
            {/* Left Panel: Direct Messages Directory */}
            <div className="hidden lg:flex lg:col-span-4 h-full min-h-0">
              <DirectMessagesList
                isFullWidth={false}
                isChatOpen={true}
                selectedChatId={selectedChatId}
                onSelectChat={handleSelectChat}
                chats={filteredConversations}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                pinnedChats={pinnedChats}
                togglePinChat={togglePinChat}
                isLoading={isLoadingChats}
                receivedRequests={receivedRequests}
                onRespondRequest={handleRespondRequest}
                isRespondingRequest={respondRequestMutation.isPending}
                onCreateMessage={() => setIsNewMessageModalOpen(true)}
                className="h-full"
              />
            </div>

            {/* Right Panel: Active Chat Thread Window */}
            <div className="col-span-1 lg:col-span-8 h-full min-h-0">
              <ChatWindow
                chatId={selectedChatId}
                chatInfo={activeChat}
                onClose={() => setSelectedChatId(null)}
                className="h-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Start New Direct Message Modal */}
      {isNewMessageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#182228] border border-white/10 rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary-green/20 text-primary-green flex items-center justify-center">
                  <FiUsers size={16} />
                </div>
                <h3 className="font-bold text-base text-white">
                  Start New Message
                </h3>
              </div>
              <button
                onClick={() => setIsNewMessageModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>

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

            <div className="flex flex-col max-h-72 overflow-y-auto custom-scrollbar gap-2 pr-1">
              {isLoadingConnections ? (
                <div className="flex justify-center items-center py-8">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-primary-green rounded-full animate-spin" />
                </div>
              ) : filteredConnections.length === 0 ? (
                <div className="text-center py-8 px-4 text-white/50 text-xs flex flex-col items-center gap-2">
                  <FiUser size={24} className="text-white/30" />
                  <p>No new connected users found.</p>
                  <span className="text-[11px] text-white/30">
                    Connect with collaborators on CollabDen to start messaging
                    directly.
                  </span>
                </div>
              ) : (
                filteredConnections.map((conn) => (
                  <button
                    key={conn.id}
                    onClick={() => handleSelectConnection(conn)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        name={conn.displayName || conn.legalName || conn.email}
                        src={conn.avatarUrl}
                        className="w-10 h-10 bg-accent-blue font-bold text-xs shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-xs text-white truncate group-hover:text-primary-green transition-colors">
                          {conn.displayName ||
                            conn.legalName ||
                            conn.email.split("@")[0]}
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

export default function DashboardMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-[calc(100vh-92px)] max-h-[780px] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-primary-green rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardMessagesContent />
    </Suspense>
  );
}
