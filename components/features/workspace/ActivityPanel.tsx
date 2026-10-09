"use client";

import React from "react";
import { FiX } from "react-icons/fi";

interface ActivityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ActivityPanel({ isOpen, onClose }: ActivityPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-[90] lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <aside className="fixed inset-y-0 right-0 z-[100] w-[85vw] sm:w-[322px] bg-[#162026] border-l border-white/10 p-[26px_17px] shadow-2xl animate-in slide-in-from-right-8 duration-300 flex flex-col shrink-0 lg:sticky lg:top-6 lg:inset-auto lg:z-auto lg:w-[322px] lg:h-auto lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto lg:bg-white/10 lg:border-none lg:rounded-[30px] lg:shadow-none custom-scrollbar">
        
        <div className="flex lg:hidden justify-between items-center mb-6 px-2 shrink-0">
          <h2 className="font-sans font-medium text-[18px] text-white">Activity</h2>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
            <FiX size={20} className="text-white" />
          </button>
        </div>

        <h2 className="hidden lg:block font-sans font-medium text-[16px] leading-[19px] text-white text-center mt-1 mb-8 shrink-0">
          Activity
        </h2>
        
        <div className="flex-1 flex flex-col w-full overflow-y-auto custom-scrollbar pr-1 pb-6 lg:pb-2 justify-center items-center text-center">
          <p className="text-white/40 text-xs">No recent activity recorded.</p>
        </div>

      </aside>
    </>
  );
}
