"use client";

import React, { useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import Button from "@/components/ui/Button";

interface ConfirmSignatureOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmSignatureOverlay({
  isOpen,
  onClose,
  onConfirm
}: ConfirmSignatureOverlayProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm();
      setIsSubmitting(false);
      onConfirm();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-[20px] animate-in fade-in duration-300">
      
      {/* Darkened Backdrop */}
      <div 
        className="fixed inset-0 bg-[#121A1F]/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Main Overlay Card */}
      <div className="relative z-10 w-full max-w-[931px] lg:h-[501px] bg-white/10 border border-white/20 rounded-[50px] p-[40px] md:p-[80px] shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
        
        <div className="flex flex-col items-center max-w-[802px] w-full text-center">
          
          {/* Warning Icon Container */}
          <div className="w-[64px] h-[64px] bg-accent-yellow/20 rounded-full flex items-center justify-center mb-[16px]">
            <FiAlertCircle className="text-accent-yellow" size={32} strokeWidth={2.5} />
          </div>

          {/* Heading */}
          <h3 className="font-raleway font-semibold text-[20px] text-white leading-[30px] mb-[12px]">
            Confirm Electronic Signature
          </h3>

          {/* Description Texts */}
          <div className="flex flex-col items-center gap-[16px] max-w-[382px]">
            <p className="font-raleway font-normal text-[14px] text-white/70 leading-[21px]">
              You are about to electronically sign this agreement.
            </p>
            <p className="font-raleway font-semibold text-[14px] text-accent-yellow leading-[21px]">
              This action cannot be reversed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-[12px] mt-[32px] w-full">
            <Button 
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-[215px] h-[45px] bg-white/10 hover:bg-white/20 border-transparent rounded-full font-raleway font-semibold text-[14px] text-white transition-colors"
            >
              Cancel
            </Button>
            
            <Button 
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="w-full sm:w-[215px] h-[45px] bg-primary-green hover:bg-accent-green-success border-transparent rounded-full font-raleway font-semibold text-[14px] text-white transition-all shadow-[0_4px_14px_rgba(115,191,68,0.3)]"
            >
              {isSubmitting ? "Signing..." : "Sign Agreement"}
            </Button>
          </div>

        </div>
        
      </div>
    </div>
  );
}