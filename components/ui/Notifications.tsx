"use client";

import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { LuBell } from "react-icons/lu";
import NotificationItem from '@/components/features/dashboard/NotificationsItem';
import OnboardingTooltip from './Tooltip';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import type { Notification } from '@/types/api.types';

interface NotificationBellProps {
  isOpenExternally?: boolean;
  onToggle?: () => void;
  currentStep?: number;
  setStep?: (s: number) => void;
  onSkip?: () => void;
}

export default function NotificationBell({
  isOpenExternally,
  onToggle,
  currentStep,
  setStep,
  onSkip
}: NotificationBellProps) {

  const { useAllNotifications, useMarkOneRead, useMarkAllRead } = useNotifications();
  const { data: notifications = [], isLoading } = useAllNotifications();
  const markOneReadMutation = useMarkOneRead();
  const markAllReadMutation = useMarkAllRead();

  const [internalOpen, setInternalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isOpen = isOpenExternally !== undefined ? isOpenExternally : internalOpen;
  const setIsOpen = onToggle || setInternalOpen;

  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

  const handleMarkRead = async (id: string) => {
    try {
      await markOneReadMutation.mutateAsync(id);
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllReadMutation.mutateAsync();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpenExternally === undefined) setInternalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpenExternally]);

  return (
    <div ref={dropdownRef} className="relative z-60">

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-13 h-13 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-white/10' : 'bg-black/30 hover:bg-white/5'
          }`}
      >
        <LuBell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <div className="absolute top-3.25 right-3.5 w-1.75 h-1.75 bg-accent-red rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="max-lg:fixed max-lg:top-25 max-lg:left-4.5 max-lg:right-4.5 max-lg:w-auto max-lg:max-w-125 max-lg:mx-auto lg:absolute lg:top-[calc(100%+24px)] lg:right-0 lg:w-103.25 bg-black/10 border border-white/10 shadow-[0_25px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md rounded-[30px] p-5 sm:p-7 z-100 flex flex-col gap-8 animate-in fade-in slide-in-from-top-4 duration-200">

          <div className="flex justify-between items-center w-full">
            <h2 className="font-semibold text-[18px] leading-5.25 text-foreground">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <div className="bg-accent-red px-2.5 py-1 rounded-[30px] flex items-center justify-center">
                <span className="font-semibold text-[10px] leading-3 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                  {unreadCount} new
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-5 h-5 border-2 border-foreground/20 border-t-primary-green rounded-full animate-spin" />
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notif) => (
                <NotificationItem
                  key={notif.id}
                  {...notif}
                  onMarkRead={handleMarkRead}
                />
              ))
            ) : (
              <p className="text-foreground/40 text-sm text-center py-4 italic">
                You&apos;re all caught up!
              </p>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="w-full text-center font-semibold text-[16px] leading-4.75 text-primary-green hover:opacity-80 transition-opacity"
            >
              Mark all as read
            </button>
          )}

          {/* Link to the full page */}
                    <div className="pt-2 mt-2 border-t border-white/10 w-full">
                      <Link 
                        href="/notifications" 
                        onClick={() => setIsOpen(false)} // Close the dropdown when they navigate away
                        className="block w-full text-center font-medium text-[14px] leading-4.75 text-text-muted hover:text-white transition-colors"
                      >
                        View all notifications
                      </Link>
                    </div>

          {/* STEP 5 ANCHOR */}
          {currentStep === 5 && (
            <OnboardingTooltip
              step={5}
              title="Stay in the loop"
              description="Get updates on activity, messages, and project changes"
              onNext={() => setStep?.(6)}
              onSkip={() => onSkip?.()}
              direction="left-of"
              arrowOffset="40px"
            />
          )}

        </div>
      )}
    </div>
  );
}