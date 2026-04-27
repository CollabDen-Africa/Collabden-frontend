"use client";

import React, { useState, useEffect } from "react";
import DashboardSidebar from ".././components/layout/DashboardSidebar";
import DashboardHeader from ".././components/layout/DashboardHeader";
import { HiMenu } from "react-icons/hi";
import { TourContext } from "@/context/TourContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // --- ONBOARDING STATE ---
  const [tourStep, setTourStep] = useState(1);
  const [isTourActive, setIsTourActive] = useState(true);

  useEffect(() => {
    const completed = localStorage.getItem('collabden_onboarding_complete');
    if (completed) {
      setIsTourActive(false);
      setTourStep(0);
    }
  }, []);

  const handleSkip = () => {
    setIsTourActive(false);
    setTourStep(0);
    setIsMobileMenuOpen(false); // The mobile drawer closes if they hit skip
    localStorage.setItem('collabden_onboarding_complete', 'true');
  };

  
  // This automatically slides the mobile drawer open/closed based on the tour step
  useEffect(() => {
    if (!isTourActive) return;

    if (tourStep === 2 || tourStep === 3) {
      setIsMobileMenuOpen(true); 
    } else if (tourStep === 4) {
      setIsMobileMenuOpen(false); 
    }
  }, [tourStep, isTourActive]);

  return (
    <div className="flex min-h-screen w-full relative font-sans bg-background text-foreground overflow-x-hidden">
      
      {/* 1. GLOBAL ONBOARDING OVERLAY */}
      {isTourActive && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-500 pointer-events-none" />
      )}

      {/* 2. BACKGROUND GLOW */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[868px] h-[868px] left-[278px] top-[-156px] bg-primary-blue rounded-full blur-[242.3px] opacity-80" />
        <div className="absolute w-[868px] h-[868px] left-[652px] top-[896px] bg-primary-blue rounded-full blur-[242.3px] opacity-80" />
        <div className="absolute w-[868px] h-[868px] left-[-434px] top-[1409px] bg-primary-blue rounded-full blur-[242.3px] opacity-80" />
        <div className="absolute w-[868px] h-[868px] left-[756px] top-[1843px] bg-primary-blue rounded-full blur-[242.3px] opacity-80" />
        <div className="absolute inset-0 bg-white/20" />
      </div>

      {/* 3. Desktop Sidebar */}
      <div className={`hidden lg:block relative shrink-0 pl-[18px] pt-[52px] pb-8 transition-all ${
        isTourActive && [2, 3].includes(tourStep) ? "z-50" : "z-10"
      }`}>
        <div className="sticky top-[52px] h-[788px] w-[209px]">
           <DashboardSidebar 
              currentStep={tourStep} 
              setStep={setTourStep} 
              onSkip={handleSkip} 
           />
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div className={`fixed top-0 left-0 h-full w-[250px] z-[70] p-[18px] transform transition-transform duration-300 ease-in-out lg:hidden ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <DashboardSidebar 
          onClose={() => setIsMobileMenuOpen(false)} 
          currentStep={tourStep} 
          setStep={setTourStep} 
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
            className="p-2 bg-white/10 rounded-lg border border-white/10 relative z-[60]"
          >
            <HiMenu size={24} className="text-white" />
          </button>
        </div>

        <div className="w-full max-w-[1200px] mx-auto pb-[100px]">
          
          {/* HEADER WRAPPER */}
          <div className={`w-full transition-all duration-300 ${isTourActive && tourStep === 1 ? 'relative z-50' : ''}`}>
            <DashboardHeader 
              currentStep={tourStep} 
              setStep={setTourStep} 
              onSkip={handleSkip} 
            />
          </div>
          
          {/* PAGE CONTENT WRAPPER */}
          <div className="relative transition-all w-full">
            <TourContext.Provider value={{ currentStep: tourStep, setStep: setTourStep, onSkip: handleSkip, isTourActive }}>
              {children}
            </TourContext.Provider>
          </div>

        </div>

      </main>
    </div>
  );
}