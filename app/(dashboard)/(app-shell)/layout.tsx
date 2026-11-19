"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { HiMenu } from "react-icons/hi";
import { useTour } from "@/context/TourContext";
import { useAuth } from "@/context/AuthContext";

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentStep, setStep, onSkip, isTourActive } = useTour();
  const { user } = useAuth();

  // This automatically slides the mobile drawer open/closed based on the tour step
  useEffect(() => {
    if (!isTourActive) return;

    if (currentStep === 2 || currentStep === 3) {
      setIsMobileMenuOpen(true);
    } else if (currentStep === 4) {
      setIsMobileMenuOpen(false);
    }
  }, [currentStep, isTourActive]);

  const handleSkip = () => {
    onSkip();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* GLOBAL ONBOARDING OVERLAY */}
      {isTourActive && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-500 pointer-events-none" />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-56.75 shrink-0">
        <div className={`fixed left-4.5 top-13 h-[calc(100vh-84px)] max-h-197 w-52.25 transition-all ${isTourActive && [2, 3].includes(currentStep) ? "z-50" : "z-10"
          }`}>
          <DashboardSidebar
            currentStep={currentStep}
            setStep={setStep}
            onSkip={handleSkip}
          />
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-60 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div className={`fixed top-0 left-0 h-full w-62.5 z-70 p-4.5 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <DashboardSidebar
          onClose={() => setIsMobileMenuOpen(false)}
          currentStep={currentStep}
          setStep={setStep}
          onSkip={handleSkip}
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative min-h-screen px-4.5 lg:pl-8.5 lg:pr-8.5 xl:pr-15 w-full">

        <div className="lg:hidden flex items-center justify-between pt-5 pb-2.5 w-full max-w-300 mx-auto">
          <div className="flex items-center gap-1.5">
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              <Image 
                src="/Green-logo.png" 
                alt="CollabDen Logo" 
                width={36} 
                height={36} 
                className="object-contain"
              />
            </div>
            <span className="text-white font-bold text-[20px] leading-tight">CollabDen</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 bg-white/10 rounded-lg border border-white/10 relative z-60"
          >
            <HiMenu size={24} className="text-white" />
          </button>
        </div>

        <div className="w-full lg:max-w-230 xl:max-w-300 mx-auto pb-25">

          {/* HEADER WRAPPER */}
          <div className={`w-full transition-all duration-300 ${isTourActive && currentStep === 1 ? 'relative z-50' : ''}`}>
            <DashboardHeader
              user={user ? {
                firstName: user.firstName || "User",
                lastName: user.lastName || "Name",
                role: user.role || "Member",
                avatarUrl: user.avatarUrl,
                email: user.email,
              } : undefined}
              currentStep={currentStep}
              setStep={setStep}
              onSkip={handleSkip}
              isMobileMenuOpen={isMobileMenuOpen}
            />
          </div>

          {/* PAGE CONTENT WRAPPER */}
          <div className="relative transition-all w-full">
            {children}
          </div>

        </div>

      </main>
    </>
  );
}
