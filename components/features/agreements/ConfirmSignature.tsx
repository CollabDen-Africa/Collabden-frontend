"use client";

import React from "react";
import { FiAlertCircle } from "react-icons/fi";
import Button from "@/components/ui/Button";

interface ConfirmSignatureOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export default function ConfirmSignatureOverlay({
  isOpen,
  onClose,
  onConfirm,
  isPending = false
}: ConfirmSignatureOverlayProps) {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-5 animate-in fade-in duration-300">
      
      {/* Darkened Backdrop */}
      <div 
        className="fixed inset-0 bg-[#121A1F]/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Main Overlay Card */}
      <div className="relative z-10 w-full max-w-232.75 lg:h-125.25 bg-white/10 border border-white/20 rounded-[50px] p-10 md:p-20 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
        
        <div className="flex flex-col items-center max-w-200.5 w-full text-center">
          
          {/* Warning Icon Container */}
          <div className="w-16 h-16 bg-accent-yellow/20 rounded-full flex items-center justify-center mb-4">
            <FiAlertCircle className="text-accent-yellow" size={32} strokeWidth={2.5} />
          </div>

          {/* Heading */}
          <h3 className="font-raleway font-semibold text-[20px] text-white leading-3 mb-3">
            Confirm Electronic Signature
          </h3>

          {/* Description Texts */}
          <div className="flex flex-col items-center gap-4 max-w-95.5">
            <p className="font-raleway font-normal text-[14px] text-white/70 leading-5.25">
              You are about to electronically sign this agreement.
            </p>
            <p className="font-raleway font-semibold text-[14px] text-accent-yellow leading-5.25">
              This action cannot be reversed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 w-full">
            <Button 
              onClick={onClose}
              disabled={isPending}
              className="w-full sm:w-53.75 h-11.25 bg-white/10 hover:bg-white/20 border-transparent rounded-full font-raleway font-semibold text-[14px] text-white transition-colors"
            >
              Cancel
            </Button>
            
            <Button 
              onClick={onConfirm}
              disabled={isPending}
              className="w-full sm:w-53.75 h-11.25 bg-primary-green hover:bg-accent-green-success border-transparent rounded-full font-raleway font-semibold text-[14px] text-white transition-all shadow-[0_4px_14px_rgba(115,191,68,0.3)]"
            >
              {isPending ? "Signing..." : "Sign Agreement"}
            </Button>
          </div>

        </div>
        
      </div>
    </div>
  );
}