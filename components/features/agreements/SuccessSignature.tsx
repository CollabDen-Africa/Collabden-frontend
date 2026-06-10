"use client";

import React from "react";
import { FiCheck, FiX } from "react-icons/fi";

interface SuccessSignatureOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  legalName?: string;
  date?: string;
  time?: string;
  project?: string;
}

export default function SuccessSignatureOverlay({
  isOpen,
  onClose,
  legalName = "Oluwaseun Oyindamola Babalola",
  date = "June 1, 2026",
  time = "2:43 PM",
  project = "Urban Beats Vol. 2"
}: SuccessSignatureOverlayProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-[20px] animate-in fade-in duration-300">
      
      {/* Darkened Backdrop */}
      <div 
        className="fixed inset-0 bg-[#121A1F]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main Overlay Card (931px x 501px) */}
      <div className="relative z-50 w-full max-w-[931px] lg:h-[501px] bg-primary-green/10 border border-primary-green rounded-[50px] p-[40px] md:p-[80px] shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
        
        {/* Optional Close Button (Top Right) */}
        <button 
          onClick={onClose}
          className="absolute top-[32px] right-[40px] w-[40px] h-[40px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center transition-colors group"
        >
          <FiX className="text-white/60 group-hover:text-white transition-colors" size={20} />
        </button>

        <div className="flex flex-col items-center max-w-[653px] w-full text-center">
          
          {/* Success Icon Container */}
          <div className="w-[64px] h-[64px] bg-primary-green rounded-full flex items-center justify-center mb-[24px] shadow-[0_4px_20px_rgba(115,191,68,0.4)]">
            <FiCheck className="text-white" size={32} strokeWidth={3} />
          </div>

          {/* Heading */}
          <h3 className="font-raleway font-semibold text-[24px] text-white leading-[36px] mb-[16px]">
            Agreement Successfully Signed
          </h3>

          {/* Details List */}
          <div className="flex flex-col items-center gap-[8px] w-full mb-[24px]">
            <p className="font-raleway font-normal text-[14px] text-white/60 leading-[21px]">
              Signed by: {legalName}
            </p>
            <p className="font-raleway font-normal text-[14px] text-white/60 leading-[21px]">
              Date: {date}
            </p>
            <p className="font-raleway font-normal text-[14px] text-white/60 leading-[21px]">
              Time: {time}
            </p>
            <p className="font-raleway font-normal text-[14px] text-white/60 leading-[21px]">
              Project: {project}
            </p>
          </div>

          {/* Footer Text */}
          <p className="font-raleway font-normal text-[14px] text-white/70 leading-[21px]">
            A signed copy has been emailed to all project collaborators.
          </p>

        </div>
        
      </div>
    </div>
  );
}