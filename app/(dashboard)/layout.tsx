"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { TourContext } from "@/context/TourContext";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes";

export default function BaseDashboardLayout({ children }: { children: React.ReactNode }) {
  const [tourStep, setTourStep] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);
  
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading || !user) return;

    const isOnboarded = user.hasCompletedOnboarding === true || user.onboardingCompleted === true;
    const tourCompleted = localStorage.getItem('collabden_tour_complete') === 'true';

    if (!isOnboarded) {
      // FORCE ONBOARDING ROUTE GUARD: Lock unonboarded user in /intro
      setIsTourActive(false);
      setTourStep(0);
      
      if (pathname !== ROUTES.DASHBOARD.SETUP) {
        router.push(ROUTES.DASHBOARD.SETUP);
      }
    } else {
      // PREVENT REVISITING ONBOARDING: Redirect onboarded user away from /intro to dashboard
      if (pathname === ROUTES.DASHBOARD.SETUP) {
        router.push(ROUTES.DASHBOARD.ROOT);
      } else {
        // ENFORCE SEQUENCE: Show tour guide on dashboard only AFTER onboarding is complete
        if (tourCompleted) {
          setIsTourActive(false);
          setTourStep(0);
        } else {
          setIsTourActive(true);
          setTourStep(1);
        }
      }
    }
  }, [user, isLoading, pathname, router]);

  const handleSkip = () => {
    setIsTourActive(false);
    setTourStep(0);
    localStorage.setItem('collabden_tour_complete', 'true');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0d0f10]">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes bounceEqualizer {
            0%, 100% { transform: scaleY(0.3); }
            50% { transform: scaleY(1); }
          }
          .eq-bar {
            transform-origin: bottom;
            animation: bounceEqualizer 1.2s ease-in-out infinite;
          }
          .eq-bar-1 { animation-delay: 0.1s; }
          .eq-bar-2 { animation-delay: 0.3s; }
          .eq-bar-3 { animation-delay: 0.5s; }
          .eq-bar-4 { animation-delay: 0.2s; }
          .eq-bar-5 { animation-delay: 0.4s; }
        `}} />
        <div className="flex flex-col items-center gap-5">
          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
            <div className="flex items-end gap-1.5 h-10 w-20 justify-center mb-4">
              <span className="w-1.5 h-8 bg-[#73BF44] rounded-full eq-bar eq-bar-1" />
              <span className="w-1.5 h-5 bg-[#73BF44]/80 rounded-full eq-bar eq-bar-2" />
              <span className="w-1.5 h-10 bg-[#73BF44] rounded-full eq-bar eq-bar-3" />
              <span className="w-1.5 h-6 bg-[#73BF44]/80 rounded-full eq-bar eq-bar-4" />
              <span className="w-1.5 h-8 bg-[#73BF44] rounded-full eq-bar eq-bar-5" />
            </div>
            <p className="text-white/70 text-[15px] font-raleway tracking-widest font-medium animate-pulse">
              SYNCING PROFILE...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full relative font-sans bg-background text-foreground overflow-x-hidden">
      {/* BACKGROUND GLOW */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[868px] h-[868px] left-[278px] top-[-156px] bg-primary-blue/70 rounded-full blur-[242.3px] opacity-90" />
        <div className="absolute w-[868px] h-[868px] left-[652px] top-[896px] bg-primary-blue rounded-full blur-[242.3px] opacity-90" />
        <div className="absolute w-[668px] h-[68px] left-[-434px] top-[609px] bg-primary-blue rounded-full blur-[242.3px] opacity-80" />
        <div className="absolute w-[1968px] h-[1868px] left-[756px] top-[843px] bg-primary-blue/70 rounded-full blur-[242.3px] opacity-80" />
        <div className="absolute inset-0 bg-accent-soft-blue/20" />
      </div>
      
      <TourContext.Provider value={{ currentStep: tourStep, setStep: setTourStep, onSkip: handleSkip, isTourActive }}>
        {children}
      </TourContext.Provider>
    </div>
  );
}