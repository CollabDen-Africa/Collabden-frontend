"use client";

import React, { useState, useMemo } from "react";
import { FiX, FiClock, FiAlertCircle } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import { MOCK_UPDATES } from "@/lib/mockData";
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
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
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

  // Merge live database items and format them
  const mergedUpdates = useMemo(() => {
    const liveItems: any[] = [];

    // 1. Map live pending connection requests
    pendingRequests.forEach((req) => {
      liveItems.push({
        id: `pending-${req.id}`,
        connectionId: req.id,
        text: `${req.sender?.email?.split("@")[0] || "Someone"} sent you a connection request`,
        time: formatRelativeTime(req.createdAt),
        type: "request",
        isUnread: true,
        user: req.sender?.email?.split("@")[0] || "Someone",
        avatarUrl: "",
        date: new Date(req.createdAt),
      });
    });

    // 2. Map live notifications
    dbNotifications.forEach((notif) => {
      liveItems.push({
        id: `notification-${notif.id}`,
        notificationId: notif.id,
        text: notif.message || notif.title,
        time: formatRelativeTime(notif.createdAt),
        type: notif.type === "MESSAGE" ? "message" : notif.type === "INVITE" ? "view" : "system-alert",
        isUnread: !notif.isRead,
        user: notif.title.includes("added") || notif.title.includes("assigned") ? notif.title.split(" ")[0] : undefined,
        avatarUrl: "",
        systemColor: notif.type === "SYSTEM" ? "text-[#F9A620]" : "text-primary-green",
        systemBg: notif.type === "SYSTEM" ? "bg-accent-yellow/20" : "bg-primary-green/20",
        date: new Date(notif.createdAt),
      });
    });

    if (liveItems.length > 0) {
      liveItems.sort((a, b) => b.date.getTime() - a.date.getTime());
      return liveItems;
    }

    // Fallback to MOCK_UPDATES to ensure the app maintains its premium UI state
    return MOCK_UPDATES;
  }, [dbNotifications, pendingRequests]);

  const unreadCount = useMemo(() => {
    return mergedUpdates.filter((u) => u.isUnread).length;
  }, [mergedUpdates]);

  const filteredUpdates = useMemo(() => {
    return activeTab === "unread" ? mergedUpdates.filter((u) => u.isUnread) : mergedUpdates;
  }, [activeTab, mergedUpdates]);

  const handleRespond = (
    connectionId: string | undefined,
    updateId: string | number,
    action: "ACCEPTED" | "REJECTED"
  ) => {
    if (!connectionId) {
      // Simulate premium mock response for static mock updates
      const fakeActionId = (action === "ACCEPTED" ? "mock-accept-" : "mock-decline-") + updateId;
      setProcessingId(fakeActionId);
      setTimeout(() => {
        setProcessingId(null);
      }, 800);
      return;
    }

    const actionType = action === "ACCEPTED" ? "ACCEPT" : "REJECT";
    setProcessingId(connectionId);
    setProcessingAction(actionType);

    respondMutation.mutate(
      { id: connectionId, data: { status: action } },
      {
        onSettled: () => {
          setProcessingId(null);
          setProcessingAction(null);
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 z-[90] lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="fixed inset-y-0 right-0 z-[100] w-[85vw] sm:w-[322px] bg-[#162026] border-l border-white/10 p-[26px_17px] shadow-2xl animate-in slide-in-from-right-8 duration-300 flex flex-col shrink-0
                        lg:relative lg:inset-auto lg:z-auto lg:w-[322px] lg:h-[879px] lg:bg-white/10 lg:border-none lg:rounded-[30px] lg:shadow-none">
        
        {/* Mobile Header with Close Button */}
        <div className="flex lg:hidden justify-between items-center mb-4 px-2 shrink-0">
          <h2 className="font-sans font-semibold text-[18px] text-white">Updates</h2>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
            <FiX size={20} className="text-white" />
          </button>
        </div>

        {/* Desktop Header */}
        <h2 className="hidden lg:block font-sans font-semibold text-[18px] leading-[21px] text-white mb-6 shrink-0 ml-1">
          Updates
        </h2>

        {/* Tabs */}
        <div className="flex items-center mb-6 border-b border-white/10">
          <button 
            onClick={() => setActiveTab("all")}
            className={`flex-1 pb-2 text-[13px] font-medium transition-all ${activeTab === "all" ? "text-white border-b-2 border-primary-green" : "text-white/50 border-b-2 border-transparent"}`}
          >
            All Updates
          </button>
          <button 
            onClick={() => setActiveTab("unread")}
            className={`flex-1 pb-2 text-[13px] font-medium transition-all ${activeTab === "unread" ? "text-white border-b-2 border-primary-green" : "text-white/50 border-b-2 border-transparent"}`}
          >
            Unread ({unreadCount})
          </button>
        </div>
        
        {/* Updates List */}
        <div className="flex flex-col w-full overflow-y-auto custom-scrollbar pr-1 pb-6 lg:pb-2">
          <div className="flex flex-col gap-3 w-full">
            
            {filteredUpdates.map((update) => {
              const isAccepting =
                (update.connectionId &&
                  processingId === update.connectionId &&
                  processingAction === "ACCEPT") ||
                (!update.connectionId && processingId === `mock-accept-${update.id}`);
              const isDeclining =
                (update.connectionId &&
                  processingId === update.connectionId &&
                  processingAction === "REJECT") ||
                (!update.connectionId && processingId === `mock-decline-${update.id}`);
              const isAnyProcessing = isAccepting || isDeclining;

              return (
                <div key={update.id} className="w-full bg-[#D7D7D7]/10 rounded-[20px] p-3 sm:p-4 flex flex-col gap-3 relative animate-in fade-in slide-in-from-bottom-2 duration-300">
                  
                  {/* Unread Dot Indicator */}
                  {update.isUnread && (
                    <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-primary-green" />
                  )}

                  <div className="flex items-start gap-3 w-full pr-4">
                    {/* Avatar / Icon */}
                    <div className="shrink-0 relative">
                      {update.avatarUrl || update.user ? (
                        <div className="w-[30px] h-[30px] rounded-full border border-primary-green overflow-hidden relative">
                          <Avatar name={update.user || "User"} src={update.avatarUrl} className="w-full h-full text-[10px]" />
                        </div>
                      ) : (
                        <div className={`w-[30px] h-[30px] rounded-full border border-current flex items-center justify-center ${update.systemColor || "text-[#F9A620]"} ${update.systemBg || "bg-accent-yellow/20"}`}>
                           {update.type === 'system-warning' ? <FiClock size={14} /> : <FiAlertCircle size={14} />}
                        </div>
                      )}
                    </div>

                    {/* Text */}
                    <p className="font-sans font-bold text-[12px] leading-[14px] text-white">
                      {update.text}
                    </p>
                  </div>

                  {/* Actions & Timestamp Row */}
                  <div className="flex items-center justify-between w-full mt-1">
                    
                    {/* Action Buttons based on Type */}
                    <div className="flex items-center gap-2">
                      {(update.type === "view" || update.type === "system-warning" || update.type === "system-alert") && (
                        <button className="bg-white/20 border border-white/10 rounded-full px-3 py-1 font-medium text-[10px] text-white hover:bg-white/30 transition-colors">
                          {update.type.includes('system') ? 'View Task' : 'View'}
                        </button>
                      )}

                      {update.type === "request" && (
                        <>
                          <button 
                            disabled={isAnyProcessing}
                            onClick={() => handleRespond(update.connectionId, update.id, "ACCEPTED")}
                            className="bg-primary-green border border-white/10 rounded-full px-3 py-1 font-medium text-[10px] text-white hover:bg-primary-green/80 transition-colors disabled:opacity-50 flex items-center gap-1 shrink-0"
                          >
                            {isAccepting ? (
                              <>
                                <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                                Accepting...
                              </>
                            ) : "Accept"}
                          </button>
                          <button 
                            disabled={isAnyProcessing}
                            onClick={() => handleRespond(update.connectionId, update.id, "REJECTED")}
                            className="bg-white/10 rounded-full px-3 py-1 font-medium text-[10px] text-white hover:bg-white/20 transition-colors disabled:opacity-50 flex items-center gap-1 shrink-0"
                          >
                            {isDeclining ? (
                              <>
                                <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                                Declining...
                              </>
                            ) : "Decline"}
                          </button>
                        </>
                      )}

                      {update.type === "message" && (
                        <>
                          <button className="bg-primary-green border border-white/10 rounded-full px-3 py-1 font-medium text-[10px] text-white hover:bg-primary-green/80 transition-colors">Reply</button>
                          <button className="bg-white/10 rounded-full px-3 py-1 font-medium text-[10px] text-white hover:bg-white/20 transition-colors">Dismiss</button>
                        </>
                      )}
                    </div>

                    {/* Timestamp */}
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