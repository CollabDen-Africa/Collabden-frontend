"use client";

import React from "react";
import { MOCK_WORKSPACE_ACTIVITIES, ActivitySegmentType } from "@/lib/mockData"; 
import { FiX } from "react-icons/fi"; 

const getSegmentStyle = (type: ActivitySegmentType) => {
  switch (type) {
    case 'name':
    case 'progress':
      return 'font-bold not-italic'; 
    case 'task':
    case 'update':
    case 'comment':
      return 'font-normal italic';   
    case 'regular':
    default:
      return 'font-normal not-italic'; 
  }
};

interface ActivityPanelProps {
  isOpen: boolean;
  onClose: () => void; 
}

export default function ActivityPanel({ isOpen, onClose }: ActivityPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay (Hidden on Desktop) */}
      <div 
        className="fixed inset-0 bg-black/60 z-[90] lg:hidden backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Panel - Drawer on Mobile, Column on Desktop */}
      <aside className="fixed inset-y-0 right-0 z-[100] w-[85vw] sm:w-[322px] bg-[#162026] border-l border-white/10 p-[26px_17px] shadow-2xl animate-in slide-in-from-right-8 duration-300 flex flex-col shrink-0
                        lg:relative lg:inset-auto lg:z-auto lg:w-[322px] lg:h-[879px] lg:bg-white/10 lg:border-none lg:rounded-[30px] lg:shadow-none">
        
        {/* Mobile Header with Close Button (Hidden on Desktop) */}
        <div className="flex lg:hidden justify-between items-center mb-6 px-2 shrink-0">
          <h2 className="font-sans font-medium text-[18px] text-white">Activity</h2>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
            <FiX size={20} className="text-white" />
          </button>
        </div>

        {/* Desktop Header (Hidden on Mobile) */}
        <h2 className="hidden lg:block font-sans font-medium text-[16px] leading-[19px] text-white text-center mt-1 mb-8 shrink-0">
          Activity
        </h2>
        
        {/* Activity List */}
        <div className="flex-1 flex flex-col w-full overflow-y-auto custom-scrollbar pr-1 pb-6 lg:pb-2 justify-end">
          <div className="flex flex-col gap-4 w-full">
            {[...MOCK_WORKSPACE_ACTIVITIES].reverse().map((activity) => (
              <div key={activity.id} className="flex items-start w-full sm:w-[287px]">
                <div className="w-[5px] h-[5px] rounded-full bg-[#D9D9D9]/60 shrink-0 mt-[4px]" />
                
                <p className="flex-1 sm:w-[162px] ml-[15px] font-sans text-[11px] leading-[13px] text-white/60">
                  {activity.segments.map((segment, index) => (
                    <span key={index} className={getSegmentStyle(segment.type)}>
                      {segment.text}
                    </span>
                  ))}
                </p>
                
                <span className="w-[70px] sm:w-[90px] ml-[10px] sm:ml-[15px] font-sans font-medium text-[10px] sm:text-[11px] leading-[13px] text-white/60 text-right sm:text-left shrink-0">
                  {activity.time}
                </span>
              </div>
            ))}

          </div>
        </div>

      </aside>
    </>
  );
}