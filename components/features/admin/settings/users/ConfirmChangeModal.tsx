import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  subtitle?: string;
  impactTitle?: string;
  impactList?: string[];
}

export default function ConfirmChangeModal({ isOpen, onClose, onConfirm, title = "Confirm Account Setting Change",
subtitle = "This change significantly affects all user accounts.", impactTitle = "High Impact Change", impactList = [] }: ConfirmChangeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-sans">
      
      {/* Container */}
      <div 
        className="flex flex-col items-start px-7.5 py-7 w-full max-w-120 bg-[#10141C] border-[0.8px] border-accent-yellow/[0.267] rounded-[22px] shadow-[0px_24px_80px_rgba(0,0,0,0.6)]"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Header Section */}
        <div className="flex flex-row items-center gap-3.5 w-full">
          <div className="flex justify-center items-center w-11 h-11 bg-accent-yellow/10 border-[0.8px] border-accent-yellow/[0.267] rounded-xl shrink-0">
            <AlertTriangle className="w-5 h-5 text-accent-yellow" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-['Raleway'] font-bold text-base leading-normal text-white">
               {title}
            </h2>
            <p className="font-['Inter'] text-xs text-white/45">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Impact Warning Box */}
        <div className="flex flex-col items-start p-4 w-full bg-accent-yellow/4 border-[0.8px] border-accent-yellow/20 rounded-xl mt-4.5">
          
          <div className="flex flex-row items-center gap-2.5 w-full mb-2.5">
            <span className="font-['Raleway'] font-bold text-xs text-accent-yellow">
              {impactTitle}
            </span>
            <div className="flex items-center px-1.75 py-0.5 bg-accent-yellow/10 rounded-md">
              <span className="font-['Inter'] font-bold text-[9px] leading-3.5 text-accent-yellow">
                HIGH IMPACT
              </span>
            </div>
          </div>

          {/* Impact List */}
          <ul className="flex flex-col w-full pl-4 list-disc marker:text-white/30 space-y-0.5">
                      {impactList.map((impact, idx) => (
                        <li key={idx} className="font-['Inter'] text-xs leading-5.5 text-white/75 pl-1">
                          {impact}
                        </li>
                      ))}
                    </ul>
                  </div>

        {/* Reason Input Field */}
        <div className="flex flex-col w-full gap-2 mt-4.5">
          <label className="font-['Inter'] font-semibold text-[11px] text-white/45">
            Reason for Change *
          </label>
          <textarea 
            defaultValue="Platform compliance update — Terms of Service revision."
            className="w-full min-h-12 h-15 px-3.5 py-2.5 bg-white/3 border-[0.8px] border-white/10 rounded-xl font-['Raleway'] text-[13px] text-white resize-none focus:outline-none focus:border-accent-yellow/50 transition-colors"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-2.5 w-full mt-4.5">
          <button 
            onClick={onClose}
            className="flex flex-1 justify-center items-center h-12.5 bg-white/3 border-[0.8px] border-white/10 rounded-xl font-['Raleway'] font-bold text-[13px] text-white/45 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex flex-1 justify-center items-center h-12.5 bg-accent-yellow rounded-xl font-['Raleway'] font-bold text-[13px] text-black hover:bg-accent-yellow transition-colors"
          >
            Confirm & Apply
          </button>
        </div>

      </div>
    </div>
  );
}