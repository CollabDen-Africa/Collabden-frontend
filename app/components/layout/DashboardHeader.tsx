"use client";

import React, { useState, useEffect, useRef } from "react";
import NotificationBell from "../ui/Notifications";
import Avatar from "../ui/Avatar";
import OnboardingTooltip from "../ui/Tooltip"; 
import { FiSearch } from "react-icons/fi";
import { HiChevronDown } from "react-icons/hi";
import { MOCK_NOTIFICATIONS } from "../../../lib/mockData"; 

// User data structure
export interface UserProfile {
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string | null;
}

export default function DashboardHeader({ 
  user = {
    firstName: "Emmanuel",
    lastName: "O.",
    role: "Producer",
    avatarUrl: '/mock-profiles/small.png', 
  },
  currentStep,
  setStep,
  onSkip,
  isMobileMenuOpen = false
}: { 
  user?: UserProfile;
  currentStep?: number;
  setStep?: (s: number) => void;
    onSkip?: () => void;
  isMobileMenuOpen?: boolean;
}) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const displayName = `${user.firstName} ${user.lastName}`;

  // Auto-open notification dropdown for Step 5
  useEffect(() => {
    if (currentStep === 5) {
      setIsNotifOpen(true);
    } else {
      setIsNotifOpen(false);
    }
  }, [currentStep]);
  
  // To close the notification dropdown
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
          if (currentStep !== 5) {
            setIsNotifOpen(false);
          }
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [currentStep]);

  return (
    <header className="w-full pt-[20px] lg:pt-[58px] pb-[20px] lg:pb-[40px] shrink-0">
      
      <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-[24px] lg:gap-[34px]">
        
        {/* Top Row: Welcome & Profile */}
        <div className="w-full flex flex-col-reverse lg:flex-row justify-between items-start gap-[24px] lg:gap-[40px] 2xl:gap-[70px]">
          
          {/* Greeting Area - Anchor for Step 1 */}
          <div className="relative flex-1 flex flex-col gap-[6px] w-full xl:max-w-max">
            <h1 className="text-foreground text-[26px] lg:text-[32px] font-semibold font-sans leading-tight break-words">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-foreground/60 text-[14px] lg:text-[16px] font-medium font-sans break-words">
              Here’s what’s happening with your projects today
            </p>

            {/* STEP 1 TOOLTIP */}
            {currentStep === 1 && (
              <OnboardingTooltip 
                step={1}
                title="Welcome to CollabDen"
                description="Let’s take a quick look at how you can manage your projects and collaborate with ease"
                onNext={() => setStep?.(2)}
                onSkip={() => onSkip?.()}
                nextLabel="Start tour"
                direction="right-of"
                arrowOffset="30px"
              />
            )}
          </div>

          <div className="w-full xl:w-[413px] flex shrink-0 justify-end">
            <div className="relative flex items-center gap-[20px] md:gap-[40px] lg:gap-[75px] mt-1">
              
              {/* Notification Bell Area - Anchor for Step 5 */}
              <div
                ref={notifRef}
                 className={`transition-all duration-300 ${currentStep === 5 ? "relative z-[90]" : ""} ${isMobileMenuOpen && currentStep !== 5 ? "opacity-50 pointer-events-none" : ""}`}
              >
                <NotificationBell 
                  notifications={MOCK_NOTIFICATIONS} 
                  unreadCount={MOCK_NOTIFICATIONS.length}
                  isOpenExternally={isNotifOpen} 
                  onToggle={() => setIsNotifOpen(!isNotifOpen)}
                  currentStep={currentStep} 
                                  setStep={setStep}
                                  onSkip={onSkip}
                />
                
              </div>

              <div className="flex items-center gap-[12px] lg:gap-[16px] cursor-pointer hover:opacity-80 transition-opacity">
                <Avatar 
                  name={displayName} 
                  src={user.avatarUrl}
                  className="w-[45px] h-[45px] lg:w-[52px] lg:h-[52px] border-[2px] border-primary-green shadow-[0_4px_10px_rgba(115,191,68,0.2)] text-[18px]" 
                />

                <div className="flex items-center gap-[8px] lg:gap-[16px]">
                  <div className="flex flex-col items-end gap-[4px] lg:gap-[8px]">
                    <span className="text-foreground font-bold text-[14px] lg:text-[16px] leading-none whitespace-nowrap">
                      {displayName}
                    </span>
                    <span className="text-foreground/60 font-medium text-[12px] lg:text-[14px] leading-none whitespace-nowrap capitalize">
                      {user.role}
                    </span>
                  </div>
                  <HiChevronDown className="text-foreground shrink-0" size={20} />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full flex">
          <div className="w-full xl:max-w-[711px]">
            <div className="flex items-center gap-[10px] bg-black/20 w-full h-[52px] pl-[20px] lg:pl-[25px] pr-[20px] lg:pr-[30px] rounded-[50px] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md">
              <FiSearch className="text-foreground/30 shrink-0" size={18} strokeWidth={2.5} />
              <input 
                type="text" 
                placeholder="Search projects, collaborators..." 
                className="bg-transparent border-none outline-none text-foreground text-[14px] placeholder:text-foreground/30 w-full font-medium font-sans min-w-0"
              />
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}