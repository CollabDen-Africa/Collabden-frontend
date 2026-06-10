"use client";

import React, { useState } from "react";
import { FiLock, FiCheck, FiX } from "react-icons/fi";
import Button from "@/components/ui/Button";

interface SignAgreementOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: () => void;
  legalName?: string; 
}

export default function SignAgreementOverlay({
  isOpen,
  onClose,
  onSign,
  legalName = "Legal Name"
}: SignAgreementOverlayProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSign = () => {
    if (!isChecked) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSign();
      setIsSubmitting(false);
      onSign();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[20px] animate-in fade-in duration-300">
      
      {/* Darkened Backdrop */}
      <div 
        className="fixed inset-0 bg-[#121A1F]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main Overlay Card */}
      <div className="relative z-10 w-full max-w-[931px] bg-white/10 border border-white/20 rounded-[50px] p-[40px] md:p-[80px] lg:px-[65px] lg:py-[88px] shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300">
        
        {/* Optional: Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-[32px] right-[40px] w-[40px] h-[40px] bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center transition-colors group"
        >
          <FiX className="text-white/60 group-hover:text-white transition-colors" size={20} />
        </button>

        <div className="flex flex-col w-full max-w-[800px] mx-auto gap-[30px]">
          
          {/* Header */}
          <h2 className="font-raleway font-semibold text-[20px] text-white leading-[30px]">
            Sign Agreement
          </h2>

          <div className="flex flex-col w-full">
            
            {/* Input Group */}
            <div className="flex flex-col w-full">
              <label className="font-raleway font-medium text-[14px] text-white/80 leading-[21px] mb-[8px]">
                Verified Legal Name
              </label>
              
              {/* Locked Input Box */}
              <div className="w-full h-[58px] bg-white/5 border border-white/20 rounded-[30px] px-[24px] flex items-center gap-[12px]">
                <FiLock className="text-white/40" size={20} />
                <span className="font-raleway font-semibold text-[16px] text-white leading-[24px] mt-[1px]">
                  {legalName}
                </span>
              </div>
              
              {/* Helper Text */}
              <span className="font-raleway font-normal text-[12px] text-white/50 leading-[18px] mt-[8px]">
                This name is locked and cannot be edited
              </span>
            </div>

            {/* Checkbox Area */}
            <label className="flex items-center gap-[12px] mt-[24px] cursor-pointer group w-max">
              <div 
                className={`w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors border ${
                  isChecked 
                    ? "bg-primary-green border-primary-green" 
                    : "bg-white/10 border-transparent group-hover:border-white/30"
                }`}
              >
                {isChecked && <FiCheck className="text-white" size={12} strokeWidth={3} />}
              </div>
              <span className="font-raleway font-normal text-[14px] text-white/80 leading-[21px] select-none">
                I confirm that I have reviewed this agreement and agree to its terms.
              </span>
              
              {/* Hidden Checkbox */}
              <input 
                type="checkbox" 
                className="hidden"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
            </label>

            {/* Submit Button */}
            <Button 
              onClick={handleSign}
              disabled={!isChecked || isSubmitting}
              className={`w-full h-[56px] rounded-full mt-[24px] font-raleway font-semibold text-[16px] leading-[24px] text-white transition-all duration-300 ${
                !isChecked
                  ? "bg-primary-green/10 text-white/40 cursor-not-allowed border-none"
                  : "bg-primary-green hover:bg-accent-green-success shadow-[0_4px_20px_rgba(115,191,68,0.4)]"
              }`}
            >
              {isSubmitting ? "Signing..." : "Sign Agreement"}
            </Button>

          </div>

        </div>
      </div>
    </div>
  );
}