"use client";

import React, { useEffect, useState } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";

export default function GlobalLoaderProvider({ children }: { children: React.ReactNode }) {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const auth = useAuth();

  const [showOverlay, setShowOverlay] = useState(false);

  // Trigger loading screen for any active queries, active mutations, or auth sequences
  const isCurrentlyLoading = auth.isLoading || isMutating > 0 || isFetching > 0;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isCurrentlyLoading) {
      // 200ms debounce prevents flashing on ultra-fast cache-hits or instant responses
      timer = setTimeout(() => {
        setShowOverlay(true);
      }, 200);
    } else {
      setShowOverlay(false);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isCurrentlyLoading]);

  return (
    <>
      {children}
      {showOverlay && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0d0f10]/85 backdrop-blur-md transition-all duration-300 animate-in fade-in">
          {/* Ambient background glows */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute w-[500px] h-[500px] left-[-150px] top-[-150px] bg-[#204F99]/20 rounded-full blur-[120px]" />
            <div className="absolute w-[500px] h-[500px] right-[-150px] bottom-[-150px] bg-[#73BF44]/15 rounded-full blur-[120px]" />
          </div>

          {/* Premium Glassmorphic Loader Card */}
          <div className="relative z-10 max-w-sm w-full mx-4 bg-[#141718]/85 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center text-center gap-6">
            {/* Pulsing Logo Container */}
            <div className="relative w-20 h-20 flex items-center justify-center bg-white/5 rounded-2xl border border-white/5 animate-pulse">
              <img 
                src="/Green-logo.png" 
                alt="CollabDen Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>

            {/* Dynamic Status Message */}
            <div className="space-y-1">
              <h3 className="text-white text-lg font-semibold tracking-wide font-sans">
                {auth.isLoading ? "Tuning Profile..." : "Syncing Tracks..."}
              </h3>
              <p className="text-[#AEB2B4] text-xs font-medium font-sans">
                {auth.isLoading ? "Verifying secure workspace details..." : "Updating your collaborative music den..."}
              </p>
            </div>

            {/* Bouncing Audio Equalizer Wave */}
            <div className="flex items-end justify-center gap-[6px] h-10 w-40 mt-2">
              <div className="w-[4px] bg-[#73BF44] rounded-full animate-audio-wave-1" />
              <div className="w-[4px] bg-[#73BF44] rounded-full animate-audio-wave-2" />
              <div className="w-[4px] bg-[#73BF44] rounded-full animate-audio-wave-3" />
              <div className="w-[4px] bg-[#73BF44] rounded-full animate-audio-wave-4" />
              <div className="w-[4px] bg-[#73BF44] rounded-full animate-audio-wave-5" />
              <div className="w-[4px] bg-[#73BF44] rounded-full animate-audio-wave-6" />
              <div className="w-[4px] bg-[#73BF44] rounded-full animate-audio-wave-7" />
            </div>
          </div>

          {/* Scoped CSS Styles for Equalizer Animation */}
          <style>{`
            @keyframes audio-wave-height {
              0%, 100% {
                height: 12px;
              }
              50% {
                height: 38px;
              }
            }
            .animate-audio-wave-1 {
              animation: audio-wave-height 1.2s ease-in-out infinite;
              animation-delay: 0.1s;
            }
            .animate-audio-wave-2 {
              animation: audio-wave-height 1.2s ease-in-out infinite;
              animation-delay: 0.3s;
            }
            .animate-audio-wave-3 {
              animation: audio-wave-height 1.2s ease-in-out infinite;
              animation-delay: 0.6s;
            }
            .animate-audio-wave-4 {
              animation: audio-wave-height 1.2s ease-in-out infinite;
              animation-delay: 0.2s;
            }
            .animate-audio-wave-5 {
              animation: audio-wave-height 1.2s ease-in-out infinite;
              animation-delay: 0.5s;
            }
            .animate-audio-wave-6 {
              animation: audio-wave-height 1.2s ease-in-out infinite;
              animation-delay: 0.4s;
            }
            .animate-audio-wave-7 {
              animation: audio-wave-height 1.2s ease-in-out infinite;
              animation-delay: 0.7s;
            }
          `}</style>
        </div>
      )}
    </>
  );
}
