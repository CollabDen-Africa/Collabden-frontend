"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Avatar from '@/components/ui/Avatar';
import { ViewApplicationModal } from '../features/marketplace/project-marketplace/application-modal/ViewApplication'; 
import { ApplicationTracker } from '../features/marketplace/project-marketplace/ui-parts/ApplicationTracker';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useQueryClient } from '@tanstack/react-query';

// Helper to format individual times
const formatTime = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(d);
};

export default function NotificationsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Fetch from the backend hooks
  const { useAllNotifications, useMarkOneRead, useMarkAllRead } = useNotifications();
  const { data: notifications = [], isLoading } = useAllNotifications();
  const markAllReadMutation = useMarkAllRead();
  const markOneReadMutation = useMarkOneRead();

  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showTracker, setShowTracker] = useState(false);

  const totalUnread = notifications.filter((n: any) => !n.isRead).length;

  // Dynamically group notifications by date
  const groupedNotifications = useMemo(() => {
    const groups: Record<string, any[]> = {
      Today: [],
      Yesterday: [],
      "Earlier This Week": [],
      Older: []
    };

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    notifications.forEach((notif: any) => {
      const d = new Date(notif.createdAt);
      if (isNaN(d.getTime())) return;

      const diffTime = Math.abs(now.getTime() - d.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (d.toDateString() === now.toDateString()) {
        groups.Today.push(notif);
      } else if (d.toDateString() === yesterday.toDateString()) {
        groups.Yesterday.push(notif);
      } else if (diffDays <= 7) {
        groups["Earlier This Week"].push(notif);
      } else {
        groups.Older.push(notif);
      }
    });

    return [
      { id: '1', group: 'Today', items: groups.Today },
      { id: '2', group: 'Yesterday', items: groups.Yesterday },
      { id: '3', group: 'Earlier This Week', items: groups["Earlier This Week"] },
      { id: '4', group: 'Older', items: groups.Older },
    ].filter(g => g.items.length > 0);
  }, [notifications]);

  const handleMarkAllRead = async () => {
    try {
      await markAllReadMutation.mutateAsync();
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleActionClick = async (actionText: string, notif: any) => {
    // Mark as read immediately when interacting
    if (!notif.isRead) {
      try {
        await markOneReadMutation.mutateAsync(notif.id);
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      } catch (e) {
        console.error('Failed to mark notification as read:', e);
      }
    }

    // Safely normalize text to prevent case-sensitivity bugs
    const normalizedAction = actionText?.trim().toLowerCase() || "";

    // Route actions
    if (normalizedAction.includes('view application') || normalizedAction.includes('review application')) {
      setSelectedApplication({
        projectTitle: notif.title,
        role: notif.metadata?.role || 'Applicant',
        status: notif.metadata?.status || 'Submitted',
        dateApplied: formatTime(notif.createdAt),
        pitch: notif.message,
      });
    } else if (normalizedAction.includes('track')) {
      setShowTracker(true);
    } else if (notif.actionLink) {
      router.push(notif.actionLink);
    }
  };

  // Tracker Sub-view
  if (showTracker) {
    return (
      <div className="w-full max-w-300 mx-auto p-6 md:p-12.75 animate-in fade-in duration-300">
        <button 
          onClick={() => setShowTracker(false)}
          className="mb-6 text-sm text-text-muted hover:text-white hover:underline transition-colors"
        >
          ← Back to Notifications
        </button>
        <ApplicationTracker />
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-300 mx-auto flex flex-col items-start px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end w-full mb-11 gap-6">
          <div className="flex flex-col">
            <h1 className="text-[41px] font-extrabold text-white tracking-tight">
              Notifications
            </h1>
            <p className="pt-2 text-lg font-bold text-text-muted leading-8.25">
              {isLoading ? "Loading..." : `${totalUnread} unread notifications`}
            </p>
          </div>
          
          {totalUnread > 0 && (
            <button 
              onClick={handleMarkAllRead}
              disabled={markAllReadMutation.isPending}
              className="flex justify-center items-center px-7 py-2 border-[3px] border-border-muted/30 rounded-full hover:bg-white/5 transition-colors disabled:opacity-50"
            >
              <span className="text-[16px] font-semibold text-white/50 text-center leading-7">
                {markAllReadMutation.isPending ? "Marking..." : "Mark all as read"}
              </span>
            </button>
          )}
        </div>

        {/* States */}
        {isLoading ? (
          <div className="w-full py-20 flex justify-center">
            <div className="w-8 h-8 border-2 border-primary-green/30 border-t-primary-green rounded-full animate-spin" />
          </div>
        ) : groupedNotifications.length === 0 ? (
          <div className="w-full py-24 flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-[30px]">
            <h3 className="font-raleway font-bold text-[18px] text-white/50">You&apos;re all caught up!</h3>
            <p className="font-sans text-[14px] text-white/30 text-center mt-2">No new notifications to display.</p>
          </div>
        ) : (
          <div className="flex flex-col w-full gap-11">
            {groupedNotifications.map((group) => (
              <div key={group.id} className="flex flex-col w-full">
                
                <h2 className="font-bold text-white/[0.28] uppercase tracking-[1.2px] mb-4">
                  {group.group}
                </h2>
                
                <div className="flex flex-col gap-3.25 w-full">
                  {group.items.map((notif: any) => (
                    <div 
                      key={notif.id} 
                      className="relative flex flex-col md:flex-row items-start p-5.5 md:px-7 gap-5.5 w-full bg-black/15 border border-border-muted/30 rounded-[22.3px] hover:border-primary-green/50 transition-colors"
                    >
                      
                      {/* Avatar */}
                      <div className="shrink-0">
                        <Avatar 
                          name={notif.metadata?.senderName || 'CollabDen'} 
                          src={notif.metadata?.senderAvatar} 
                          className="w-14 h-14 border border-white/10"
                        />
                      </div>

                      {/* Center Content */}
                      <div className="flex flex-col flex-1 w-full min-w-0">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full mb-1">
                          <h3 className="text-[16.7px] font-bold text-white leading-7.75">
                            {notif.title}
                          </h3>
                          <span className="text-[14.5px] font-normal text-text-muted leading-6.5 md:text-right mt-1 md:mt-0">
                            {formatTime(notif.createdAt)}
                          </span>
                        </div>
                        
                        <p className="text-[14.7px] font-normal text-text-muted/90 leading-8 line-clamp-2 md:line-clamp-1 max-w-212.5 mb-3">
                          {notif.message}
                        </p>

                        {/* Action Button */}
                        {notif.actionText && (
                          <div className="mt-1">
                            <Button
                              onClick={() => handleActionClick(notif.actionText, notif)}
                              disabled={markOneReadMutation.isPending && markOneReadMutation.variables === notif.id}
                              className="font-semibold px-6 py-2 rounded-full h-10.5">
                              {notif.actionText}
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Unread Indicator */}
                      {!notif.isRead && (
                        <div className="absolute right-6 bottom-6 md:bottom-auto md:top-[50%] md:-translate-y-1/2 w-2.75 h-2.75 bg-accent-blue rounded-full shadow-[0_0_8px_rgba(45,125,255,0.6)]" />
                      )}

                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Application Tracker */}
      <ViewApplicationModal 
        isOpen={!!selectedApplication} 
        onClose={() => setSelectedApplication(null)} 
        application={selectedApplication} 
      />
    </>
  );
}