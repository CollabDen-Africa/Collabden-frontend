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
  legalName,
  date,
  time,
  project
}: SuccessSignatureOverlayProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-120 flex items-center justify-center p-5 animate-in fade-in duration-300">
      
      {/* Darkened Backdrop */}
      <div 
        className="fixed inset-0 bg-[#121A1F]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main Overlay Card (931px x 501px) */}
      <div className="relative z-50 w-full max-w-232.75 lg:h-125.25 bg-primary-green/10 border border-primary-green rounded-[50px] p-10 md:p-20 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
        
        {/* Optional Close Button (Top Right) */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-10 w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center transition-colors group"
        >
          <FiX className="text-white/60 group-hover:text-white transition-colors" size={20} />
        </button>

        <div className="flex flex-col items-center max-w-163.25 w-full text-center">
          
          {/* Success Icon Container */}
          <div className="w-16 h-16 bg-primary-green rounded-full flex items-center justify-center mb-6 shadow-[0_4px_20px_rgba(115,191,68,0.4)]">
            <FiCheck className="text-white" size={32} strokeWidth={3} />
          </div>

          {/* Heading */}
          <h3 className="font-raleway font-semibold text-[24px] text-white leading-9 mb-4">
            Agreement Successfully Signed
          </h3>

          {/* Details List */}
          <div className="flex flex-col items-center gap-2 w-full mb-6">
            <p className="font-raleway font-normal text-[14px] text-white/60 leading-5.25">
              Signed by: {legalName}
            </p>
            <p className="font-raleway font-normal text-[14px] text-white/60 leading-5.25">
              Date: {date}
            </p>
            <p className="font-raleway font-normal text-[14px] text-white/60 leading-5.25">
              Time: {time}
            </p>
            <p className="font-raleway font-normal text-[14px] text-white/60 leading-5.25">
              Project: {project}
            </p>
          </div>

          {/* Footer Text */}
          <p className="font-raleway font-normal text-[14px] text-white/70 leading-5.25">
            A signed copy has been emailed to all project collaborators.
          </p>

        </div>
        
      </div>
    </div>
  );
}