"use client";

import React, { useState, useEffect, useRef } from "react";
import NotificationBell from "../ui/Notifications";
import OnboardingTooltip from "../ui/Tooltip";
import { usePathname } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import ProfileMenu from "../ui/ProfileMenu";



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
  const pathname = usePathname();
  const isMainDashboard = pathname === "/dashboard";

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
    <header className="w-full pt-5 lg:pt-14.5 pb-5 lg:pb-10 shrink-0">

      <div className="w-full max-w-300 mx-auto flex flex-col gap-6 lg:gap-8.5">

        {/* Top Row: Welcome & Profile */}
        <div className="w-full flex flex-col-reverse lg:flex-row justify-between items-start gap-6 lg:gap-10 2xl:gap-17.5">

          {/* Greeting Area - Anchor for Step 1 + Conditionally Rendered */}
          {isMainDashboard ? (
          <div className="relative flex-1 flex flex-col gap-1.5 w-full xl:max-w-max">
            <h1 className="text-foreground text-[26px] lg:text-[32px] font-semibold font-sans leading-tight wrap-break-word">
              Welcome back, {user.firstName}!
            </h1>
            <p className="text-foreground/60 text-[14px] lg:text-[16px] font-medium font-sans wrap-break-word">
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
          ) : (
                      // Empty placeholder
                      <div className="flex-1 hidden lg:block" />
                    )}

          <div className="w-full xl:w-[413px] flex shrink-0 justify-end">
            <div className="relative flex items-center gap-[20px] md:gap-[40px] lg:gap-[75px] mt-1">

              {/* Notification Bell Area - Anchor for Step 5 */}
              <div
                ref={notifRef}
                className={`transition-all duration-300 ${currentStep === 5 ? "relative z-90" : ""} ${isMobileMenuOpen && currentStep !== 5 ? "opacity-50 pointer-events-none" : ""}`}
              >
                <NotificationBell
                  isOpenExternally={isNotifOpen}
                  onToggle={() => setIsNotifOpen(!isNotifOpen)}
                  currentStep={currentStep}
                  setStep={setStep}
                  onSkip={onSkip}
                />

              </div>

              <div className="flex items-center gap-3 lg:gap-4 cursor-pointer">

                <ProfileMenu user={user} />
                
              </div>

            </div>
          </div>
        </div>

        {/* Search Bar - Conditionally Rendered */}
        {isMainDashboard && (
          <div className="w-full flex">
            <div className="w-full xl:max-w-177.75">
              <div className="flex items-center gap-2.5 bg-black/20 w-full h-13 pl-5 lg:pl-6.25 pr-5 lg:pr-7.5 rounded-[50px] border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] focus-within:border-primary-green backdrop-blur-md">
                <FiSearch className="text-foreground/30 shrink-0" size={18} strokeWidth={2.5} />
                <input
                  type="text"
                  placeholder="Search projects, collaborators..."
                  className="bg-transparent border-none outline-none text-foreground text-[14px] placeholder:text-foreground/30 w-full font-medium font-sans min-w-0"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}