"use client";

import React, { useState, useMemo } from "react";
import { FiX, FiClock, FiAlertCircle } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import { useNotifications } from "@/hooks/notifications/useNotifications";
import { useConnections } from "@/hooks/connections/useConnections";

interface UpdatesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatRelativeTime(dateString?: string | Date) {
  if (!dateString) return "Recently";
  try {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return diffMins + " mins ago";
    if (diffHours < 24) return diffHours + " hours ago";
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return "Recently";
  }
}

export default function UpdatesPanel({ isOpen, onClose }: UpdatesPanelProps) {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState<"ACCEPT" | "REJECT" | null>(null);

  const { useAllNotifications } = useNotifications();
  const { usePendingRequests, useRespondToConnectionRequest } = useConnections();

  const { data: dbNotifications = [] } = useAllNotifications();
  const { data: pendingRequests = [] } = usePendingRequests();
  const respondMutation = useRespondToConnectionRequest();

  const mergedUpdates = useMemo(() => {
    const liveItems: any[] = [];

    pendingRequests.forEach((req: any) => {
      liveItems.push({
        id: "pending-" + req.id,
        connectionId: req.id,
        text: (req.sender?.displayName || req.sender?.email?.split("@")[0] || "Someone") + " sent you a connection request",
        time: formatRelativeTime(req.createdAt),
        type: "request",
        isUnread: true,
        user: req.sender?.displayName || req.sender?.email?.split("@")[0] || "Someone",
        avatarUrl: req.sender?.avatarUrl,
        createdAt: new Date(req.createdAt).getTime(),
      });
    });

    dbNotifications.forEach((n: any) => {
      liveItems.push({
        id: n.id,
        text: n.title ? (n.title + ": " + n.message) : n.message,
        time: formatRelativeTime(n.createdAt),
        type: n.type?.toLowerCase().includes("warn") ? "system-warning" : "view",
        isUnread: !n.isRead,
        systemColor: n.type?.toLowerCase().includes("warn") ? "text-[#F9A620]" : "text-[#73BF44]",
        systemBg: n.type?.toLowerCase().includes("warn") ? "bg-accent-yellow/20" : "bg-primary-green/20",
        createdAt: new Date(n.createdAt).getTime(),
      });
    });

    return liveItems.sort((a, b) => b.createdAt - a.createdAt);
  }, [pendingRequests, dbNotifications]);

  const filteredUpdates = useMemo(() => {
    if (activeTab === "unread") {
      return mergedUpdates.filter((u) => u.isUnread);
    }
    return mergedUpdates;
  }, [mergedUpdates, activeTab]);

  const unreadCount = useMemo(() => {
    return mergedUpdates.filter((u) => u.isUnread).length;
  }, [mergedUpdates]);

  const handleRespond = async (connectionId: string, itemId: string, action: "ACCEPTED" | "REJECTED") => {
    if (!connectionId) return;
    setProcessingId(connectionId);
    setProcessingAction(action === "ACCEPTED" ? "ACCEPT" : "REJECT");
    try {
      await respondMutation.mutateAsync({ id: connectionId, data: { status: action } });
    } catch (error) {
      console.error("Failed to respond to connection request", error);
    } finally {
      setProcessingId(null);
      setProcessingAction(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-[90] lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <aside className="fixed inset-y-0 right-0 z-[100] w-[85vw] sm:w-[322px] bg-[#162026] border-l border-white/10 p-[26px_17px] shadow-2xl animate-in slide-in-from-right-8 duration-300 flex flex-col shrink-0 lg:sticky lg:top-6 lg:inset-auto lg:z-auto lg:w-[322px] lg:h-auto lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto lg:bg-white/10 lg:border-none lg:rounded-[30px] lg:shadow-none custom-scrollbar">
        
        <div className="flex lg:hidden justify-between items-center mb-4 px-2 shrink-0">
          <h2 className="font-sans font-semibold text-[18px] text-white">Updates</h2>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
            <FiX size={20} className="text-white" />
          </button>
        </div>

        <h2 className="hidden lg:block font-sans font-semibold text-[18px] leading-[21px] text-white mb-6 shrink-0 ml-1">
          Updates
        </h2>

        <div className="flex items-center mb-6 border-b border-white/10">
          <button 
            onClick={() => setActiveTab("all")}
            className={"flex-1 pb-2 text-[13px] font-medium transition-all " + (activeTab === "all" ? "text-white border-b-2 border-primary-green" : "text-white/50 border-b-2 border-transparent")}
          >
            All Updates
          </button>
          <button 
            onClick={() => setActiveTab("unread")}
            className={"flex-1 pb-2 text-[13px] font-medium transition-all " + (activeTab === "unread" ? "text-white border-b-2 border-primary-green" : "text-white/50 border-b-2 border-transparent")}
          >
            Unread ({unreadCount})
          </button>
        </div>
        
        <div className="flex flex-col w-full overflow-y-auto custom-scrollbar pr-1 pb-6 lg:pb-2">
          <div className="flex flex-col gap-3 w-full">
            {filteredUpdates.map((update) => {
              const isAccepting = processingId === update.connectionId && processingAction === "ACCEPT";
              const isDeclining = processingId === update.connectionId && processingAction === "REJECT";
              const isAnyProcessing = isAccepting || isDeclining;

              return (
                <div key={update.id} className="w-full bg-[#D7D7D7]/10 rounded-[20px] p-3 sm:p-4 flex flex-col gap-3 relative animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {update.isUnread && (
                    <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-primary-green" />
                  )}

                  <div className="flex items-start gap-3 w-full pr-4">
                    <div className="shrink-0 relative">
                      {update.avatarUrl || update.user ? (
                        <div className="w-[30px] h-[30px] rounded-full border border-primary-green overflow-hidden relative">
                          <Avatar name={update.user || "User"} src={update.avatarUrl} className="w-full h-full text-[10px]" />
                        </div>
                      ) : (
                        <div className={"w-[30px] h-[30px] rounded-full border border-current flex items-center justify-center " + (update.systemColor || "text-[#F9A620]") + " " + (update.systemBg || "bg-accent-yellow/20")}>
                           {update.type === 'system-warning' ? <FiClock size={14} /> : <FiAlertCircle size={14} />}
                        </div>
                      )}
                    </div>

                    <p className="font-sans font-bold text-[12px] leading-[14px] text-white">
                      {update.text}
                    </p>
                  </div>

                  <div className="flex items-center justify-between w-full mt-1">
                    <div className="flex items-center gap-2">
                      {update.type === "request" && (
                        <>
                          <button 
                            disabled={isAnyProcessing}
                            onClick={() => handleRespond(update.connectionId, update.id, "ACCEPTED")}
                            className="bg-primary-green border border-white/10 rounded-full px-3 py-1 font-medium text-[10px] text-white hover:bg-primary-green/80 transition-colors disabled:opacity-50 flex items-center gap-1 shrink-0"
                          >
                            {isAccepting ? "Accepting..." : "Accept"}
                          </button>
                          <button 
                            disabled={isAnyProcessing}
                            onClick={() => handleRespond(update.connectionId, update.id, "REJECTED")}
                            className="bg-white/10 rounded-full px-3 py-1 font-medium text-[10px] text-white hover:bg-white/20 transition-colors disabled:opacity-50 flex items-center gap-1 shrink-0"
                          >
                            {isDeclining ? "Declining..." : "Decline"}
                          </button>
                        </>
                      )}
                    </div>

                    <span className="font-sans font-medium text-[10px] text-white/50 shrink-0 ml-2">
                      {update.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredUpdates.length === 0 && (
              <p className="text-center text-white/50 text-[12px] mt-10">No updates found.</p>
            )}
          </div>
        </div>

      </aside>
    </>
  );
}
