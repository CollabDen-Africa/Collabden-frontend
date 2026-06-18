"use client";

import React from "react";
import { FiCheck, FiX } from "react-icons/fi";
import Button from "@/components/ui/Button";

interface BankVerificationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function BankVerificationOverlay({ 
  isOpen, 
  onClose,
  message = "Your bank account has been successfully linked and verified."
}: BankVerificationOverlayProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-[20px] animate-in fade-in duration-300">
      <div className="fixed inset-0 bg-[#121A1F]/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 w-full max-w-[460px] bg-primary-green/10 border border-primary-green/50 rounded-[40px] p-[40px] md:p-[56px] shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-[24px] right-[24px] w-[32px] h-[32px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center transition-colors group"
        >
          <FiX className="text-white/60 group-hover:text-white transition-colors" size={16} />
        </button>

        <div className="w-[72px] h-[72px] bg-primary-green rounded-full flex items-center justify-center mb-[24px] shadow-[0_4px_20px_rgba(115,191,68,0.4)]">
          <FiCheck className="text-white" size={36} strokeWidth={3} />
        </div>

        <h3 className="font-raleway font-bold text-[24px] text-white leading-[32px] mb-[12px]">
          Account Verified!
        </h3>

        <p className="font-raleway font-normal text-[15px] text-white/70 leading-[22px] mb-[32px]">
          {message}
        </p>

        <Button 
          onClick={onClose}
          className="w-full h-[52px] rounded-full font-raleway font-semibold text-[16px] bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all"
        >
          Done
        </Button>

      </div>
    </div>
  );
}