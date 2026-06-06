import React from "react";
import Image from "next/image";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0f10]/80 backdrop-blur-md">
      {/* Centered Pulsing Logo */}
      <div className="relative w-16 h-16 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 shadow-lg animate-pulse">
        <Image 
          src="/Green-logo.png" 
          alt="CollabDen Logo" 
          width={36}
          height={36}
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
