"use client";

import React, { useState } from "react";
import { FiLock, FiCheck, FiX } from "react-icons/fi";
import Button from "@/components/ui/Button";

interface SignAgreementOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: () => void;
  legalName?: string; 
  isPending?: boolean;
}

export default function SignAgreementOverlay({
  isOpen,
  onClose,
  onSign,
  legalName,
  isPending = false
}: SignAgreementOverlayProps) {
  const [isChecked, setIsChecked] = useState(false);
  
  if (!isOpen) return null;

  const handleSign = () => {
    if (!isChecked) return;
      onSign();
  };

  return (
      <div className="fixed inset-0 z-100 flex items-center justify-center p-5 animate-in fade-in duration-300">
        <div className="fixed inset-0 bg-[#121A1F]/60 backdrop-blur-sm" onClick={onClose} />
  
        <div className="relative z-10 w-full max-w-232.75 bg-white/10 border border-white/20 rounded-[50px] p-10 md:p-20 lg:px-16.25 lg:py-22 shadow-2xl backdrop-blur-xl animate-in zoom-in-95 duration-300">
          <button onClick={onClose} className="absolute top-8 right-10 w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center transition-colors group">
            <FiX className="text-white/60 group-hover:text-white transition-colors" size={20} />
          </button>
  
          <div className="flex flex-col w-full max-w-200 mx-auto gap-7.5">
            <h2 className="font-raleway font-semibold text-[20px] text-white leading-7.5">Sign Agreement</h2>
  
            <div className="flex flex-col w-full">
              <div className="flex flex-col w-full">
                <label className="font-raleway font-medium text-[14px] text-white/80 leading-5.25 mb-2">Verified Legal Name</label>
                <div className="w-full h-14.5 bg-white/5 border border-white/20 rounded-[30px] px-6 flex items-center gap-3">
                  <FiLock className="text-white/40" size={20} />
                  <span className="font-raleway font-semibold text-[16px] text-white leading-6 mt-px">
                    {legalName || "Awaiting Verification..."}
                  </span>
                </div>
                <span className="font-raleway font-normal text-[12px] text-white/50 leading-4.5 mt-2">This name is locked and cannot be edited</span>
              </div>
  
              <label className="flex items-center gap-3 mt-6 cursor-pointer group w-max">
                <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center transition-colors border ${isChecked ? "bg-primary-green border-primary-green" : "bg-white/10 border-transparent group-hover:border-white/30"}`}>
                  {isChecked && <FiCheck className="text-white" size={12} strokeWidth={3} />}
                </div>
                <span className="font-raleway font-normal text-[14px] text-white/80 leading-5.25 select-none">I confirm that I have reviewed this agreement and agree to its terms.</span>
                <input type="checkbox" className="hidden" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
              </label>
  
              <Button 
                onClick={handleSign}
                disabled={!isChecked || isPending}
                className={`w-full h-14 rounded-full mt-6 font-raleway font-semibold text-[16px] leading-6 text-white transition-all duration-300 ${!isChecked ? "bg-primary-green/10 text-white/40 cursor-not-allowed border-none" : "bg-primary-green hover:bg-accent-green-success shadow-[0_4px_20px_rgba(115,191,68,0.4)]"}`}
              >
                {isPending ? "Signing..." : "Sign Agreement"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }