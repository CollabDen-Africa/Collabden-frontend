import React from "react";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0f10]">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] left-[-200px] top-[-200px] bg-[#204F99]/20 rounded-full blur-[150px]" />
        <div className="absolute w-[600px] h-[600px] right-[-200px] bottom-[-200px] bg-[#73BF44]/15 rounded-full blur-[150px]" />
      </div>

      {/* Premium Glassmorphic Loader Card */}
      <div className="relative z-10 max-w-sm w-full mx-4 bg-[#141718]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center text-center gap-6">
        {/* Pulsing Logo Container */}
        <div className="relative w-20 h-20 flex items-center justify-center bg-white/5 rounded-2xl border border-white/5 animate-pulse">
          <img 
            src="/Green-logo.png" 
            alt="CollabDen Logo" 
            className="w-12 h-12 object-contain"
          />
        </div>

        {/* Loading Message */}
        <div className="space-y-1">
          <h3 className="text-white text-lg font-semibold tracking-wide font-sans">Tuning Workspace</h3>
          <p className="text-[#AEB2B4] text-xs font-medium font-sans">Preparing your collaborative workspace...</p>
        </div>

        {/* Bouncing Audio Equalizer Wave */}
        <div className="flex items-end justify-center gap-[6px] h-10 w-40 mt-2">
          <div className="w-[4px] bg-[#73BF44] rounded-full animate-audio-wave-1 animate-[audio-wave-height_1.2s_ease-in-out_infinite]" />
          <div className="w-[4px] bg-[#73BF44] rounded-full animate-audio-wave-2 animate-[audio-wave-height_1.2s_ease-in-out_infinite]" />
          <div className="w-[4px] bg-[#73BF44] rounded-full animate-audio-wave-3 animate-[audio-wave-height_1.2s_ease-in-out_infinite]" />
          <div className="w-[4px] bg-[#73BF44] rounded-full animate-audio-wave-4 animate-[audio-wave-height_1.2s_ease-in-out_infinite]" />
          <div className="w-[4px] bg-[#73BF44] rounded-full animate-audio-wave-5 animate-[audio-wave-height_1.2s_ease-in-out_infinite]" />
          <div className="w-[4px] bg-[#73BF44] rounded-full animate-audio-wave-6 animate-[audio-wave-height_1.2s_ease-in-out_infinite]" />
          <div className="w-[4px] bg-[#73BF44] rounded-full animate-audio-wave-7 animate-[audio-wave-height_1.2s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Scoped CSS Styles for Equalizer Bars */}
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
  );
}
