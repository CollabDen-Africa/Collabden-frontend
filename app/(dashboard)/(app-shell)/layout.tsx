"use client";

import React, { useState, useEffect } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import { HiMenu } from "react-icons/hi";
import { useTour } from "@/context/TourContext";

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentStep, setStep, onSkip, isTourActive } = useTour();

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
      <div className={`hidden lg:block relative shrink-0 pl-[18px] pt-[52px] pb-8 transition-all ${
        isTourActive && [2, 3].includes(currentStep) ? "z-50" : "z-10"
      }`}>
        <div className="sticky top-[52px] h-[788px] w-[209px]">
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
      <div className={`fixed top-0 left-0 h-full w-[250px] z-70 p-[18px] transform transition-transform duration-300 ease-in-out lg:hidden ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <DashboardSidebar
          onClose={() => setIsMobileMenuOpen(false)}
          currentStep={currentStep}
          setStep={setStep}
          onSkip={handleSkip}
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative min-h-screen px-[18px] lg:px-0 lg:pl-[34px] lg:pr-[34px] xl:pr-[60px] w-full">

        <div className="lg:hidden flex items-center justify-between pt-[20px] pb-[10px] w-full max-w-[1200px] mx-auto">
          <div className="flex items-center gap-[6px]">
            <div className="w-[36px] h-[36px] bg-primary-green rounded-[9.47px] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xl leading-none">C</span>
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

        <div className="w-full max-w-[1200px] mx-auto pb-[100px]">

          {/* HEADER WRAPPER */}
          <div className={`w-full transition-all duration-300 ${isTourActive && currentStep === 1 ? 'relative z-50' : ''}`}>
            <DashboardHeader
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
