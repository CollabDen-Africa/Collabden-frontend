import React from 'react';
import { FileCheck, ArrowRight } from 'lucide-react';

export interface PendingChange {
  label: string;
  oldValue: string;
  newValue: string;
}

interface ConfirmPaymentChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  changes?: PendingChange[];
}

export default function ConfirmPaymentChangeModal({ isOpen, onClose, onConfirm, changes = [] }: ConfirmPaymentChangeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-sans">
      
      {/* Container */}
      <div 
        className="flex flex-col items-start px-7.5 py-7 w-full max-w-125 bg-[#10141C] border-[0.8px] border-[#11EA9B]/[0.267] rounded-[22px] shadow-[0px_24px_80px_rgba(0,0,0,0.6)]"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Header Section */}
        <div className="flex flex-row items-center gap-3.5 w-full">
          <div className="flex justify-center items-center w-11 h-11 bg-[#11EA9B]/10 border-[0.8px] border-[#11EA9B]/[0.267] rounded-xl shrink-0">
            <FileCheck className="w-5 h-5 text-[#11EA9B]" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-['Raleway'] font-bold text-base leading-normal text-white">
              Confirm Payment Configuration Changes
            </h2>
            <p className="font-['Inter'] text-xs text-white/45 mt-0.5">
              Review all pending changes before applying
            </p>
          </div>
        </div>

        {/* Pending Changes Box */}
        {changes.length > 0 && (
         <div className="flex flex-col items-start w-full bg-white/3 border-[0.8px] border-white/10 rounded-xl mt-4.5 overflow-hidden">
          
          {/* Box Header */}
          <div className="flex flex-row items-center px-3.5 py-2.5 w-full bg-white/5 border-b-[0.8px] border-white/10">
            <span className="font-['Raleway'] font-bold text-xs text-white">
              Pending Changes
            </span>
          </div>

          {/* Change Row */}
          {changes.map((change, idx) => (
                        <div key={idx} className={`flex flex-row items-center px-3.5 py-2.5 gap-3 w-full ${idx !== changes.length - 1 ? 'border-b-[0.8px] border-white/10' : ''}`}>
                          <span className="font-['Inter'] text-xs text-white/45 flex-1 min-w-35">
                            {change.label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="flex flex-col items-center justify-center px-2.25 py-0.75 bg-accent-red/10 rounded-md font-['Inter'] font-bold text-[11px] leading-4 text-accent-red">
                              {change.oldValue}
                            </span>
                            <ArrowRight className="w-3 h-3 text-white/45" />
                            <span className="flex flex-col items-center justify-center px-2.25 py-0.75 bg-primary-green/10 rounded-md font-['Inter'] font-bold text-[11px] leading-4 text-primary-green">
                              {change.newValue}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

        {/* Reason Input Field */}
        <div className="flex flex-col w-full gap-2 mt-4.5">
          <label className="font-['Inter'] font-semibold text-[11px] text-white/45">
            Reason for Change *
          </label>
          <input 
            type="text"
            placeholder="Q3 2025 fee review — aligned with updated payment gateway costs."
            className="w-full h-12 px-3.5 bg-white/3 border-[0.8px] border-white/10 rounded-xl font-['Raleway'] text-[13px] text-white focus:outline-none focus:border-[#11EA9B]/50 transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-2.5 w-full mt-4.5">
          <button 
            onClick={onClose}
            className="flex flex-1 justify-center items-center h-12.5 bg-white/3 border-[0.8px] border-white/10 rounded-xl font-['Raleway'] font-bold text-[13px] text-white/45 hover:bg-white/10 transition-colors"
          >
            Go Back
          </button>
          <button 
            onClick={onConfirm}
            className="flex flex-1 justify-center items-center h-12.5 bg-[#11EA9B] rounded-xl font-['Raleway'] font-bold text-[13px] text-black hover:bg-[#0fd68e] transition-colors"
          >
            Confirm & Apply
          </button>
        </div>

      </div>
    </div>
  );
}