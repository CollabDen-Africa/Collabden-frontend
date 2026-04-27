"use client";

import React, { useState, useRef, useEffect } from 'react';
import { LuBell } from "react-icons/lu";
import NotificationItem from '../dashboard/NotificationsItem'; 
import OnboardingTooltip from './Tooltip'; 

export interface NotificationData {
  id: number;
  user?: string;
  action: string;
  target?: string;
  time: string;
  type?: string; 
  icon?: any; 
}

interface NotificationBellProps {
  notifications?: NotificationData[];
  unreadCount?: number;
  isOpenExternally?: boolean;
  onToggle?: () => void;
  currentStep?: number; 
  setStep?: (s: number) => void;
  onSkip?: () => void;
}

export default function NotificationBell({ 
  notifications = [], 
  unreadCount = 5, 
  isOpenExternally,
  onToggle,
  currentStep, 
  setStep,
  onSkip
}: NotificationBellProps) {
  
  const [internalOpen, setInternalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isOpen = isOpenExternally !== undefined ? isOpenExternally : internalOpen;
  const setIsOpen = onToggle || setInternalOpen;

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
    <div ref={dropdownRef} className="relative z-[60]">
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-[52px] h-[52px] rounded-full flex items-center justify-center transition-colors ${
          isOpen ? 'bg-white/10' : 'bg-black/30 hover:bg-white/5'
        }`}
      >
        <LuBell className="w-[20px] h-[20px] text-foreground" />
        {unreadCount > 0 && (
          <div className="absolute top-[13px] right-[14px] w-[7px] h-[7px] bg-accent-red rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="max-lg:fixed max-lg:top-[100px] max-lg:left-[18px] max-lg:right-[18px] max-lg:w-auto max-lg:max-w-[500px] max-lg:mx-auto lg:absolute lg:top-[calc(100%+24px)] lg:right-0 lg:w-[413px] bg-black/10 border border-white/10 shadow-[0_25px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md rounded-[30px] p-[20px] sm:p-[28px] z-[100] flex flex-col gap-[32px] animate-in fade-in slide-in-from-top-4 duration-200">
          
          <div className="flex justify-between items-center w-full">
            <h2 className="font-semibold text-[18px] leading-[21px] text-foreground">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <div className="bg-accent-red px-[10px] py-[4px] rounded-[30px] flex items-center justify-center">
                <span className="font-semibold text-[10px] leading-[12px] text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                  {unreadCount} new
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-[16px]">
            {notifications.map((notif) => (
              <NotificationItem key={notif.id} {...notif} />
            ))}
            {notifications.length === 0 && (
              <p className="text-foreground/40 text-sm text-center py-4 italic">
                You're all caught up!
              </p>
            )}
          </div>
          
          <button className="w-full text-center font-semibold text-[16px] leading-[19px] text-primary-green hover:opacity-80 transition-opacity">
            View All Notifications
          </button>

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