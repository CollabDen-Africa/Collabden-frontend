"use client";

import React from 'react';
import { HiX, HiOutlinePaperClip, HiCheckCircle, HiClock, HiXCircle } from 'react-icons/hi';

export function ViewApplicationModal({ isOpen, onClose, application }) {
  if (!isOpen || !application) return null;

  // Dynamic status styling
  const statusConfig = {
    'Under Review': { color: 'text-accent-yellow', bg: 'bg-[#2A1E08]', icon: HiClock },
    'Accepted': { color: 'text-primary-green', bg: 'bg-primary-green/20', icon: HiCheckCircle },
    'Declined': { color: 'text-accent-red', bg: 'bg-accent-red/20', icon: HiXCircle },
    'Submitted': { color: 'text-accent-blue', bg: 'bg-accent-blue/20', icon: HiCheckCircle },
  };

  const StatusIcon = statusConfig[application.status]?.icon || HiClock;
  const statusColor = statusConfig[application.status]?.color || 'text-text-muted';
  const statusBg = statusConfig[application.status]?.bg || 'bg-white/10';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg p-4">
      <div className="flex flex-col w-full max-w-160.5 bg-white/20 border-2 border-border-muted rounded-[26.75px] shadow-[0_42.8px_133.7px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Header Section */}
        <div className="flex flex-col items-start p-[32.1px_37.45px_26.75px] border-b-2 border-border-muted/30 w-full">
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-3.5 font-semibold text-text-muted uppercase tracking-[0.74px] leading-5.5">
                  Application Receipt
                </span>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusBg}`}>
                  <StatusIcon className={`w-3.5 h-3.5 ${statusColor}`} />
                  <span className={`text-[11px] font-bold ${statusColor}`}>
                    {application.status}
                  </span>
                </div>
              </div>
              <h3 className="text-[20.06px] font-bold text-white leading-7.5">
                {application.projectTitle}
              </h3>
            </div>
            
            <button 
              onClick={onClose}
              className="flex justify-center items-center w-10.75 h-10.75 bg-black/15 border-[2.54px] border-black/5 rounded-full hover:bg-white/15 transition-colors shrink-0 group"
            >
              <HiX size={18} className="text-text-muted group-hover:text-white transition-colors" />
            </button>
          </div>
          
          <span className="pt-3 text-[14px] font-normal text-white/[0.28]">
            Applied for <strong className="text-white/70 font-semibold">{application.role}</strong> on {application.dateApplied}
          </span>
        </div>

        {/* Body Section */}
        <div className="flex flex-col items-start p-[32.1px_37.45px] w-full max-h-[60vh] overflow-y-auto custom-scrollbar">
          
          {/* Pitch/Introduction */}
          <h4 className="text-[16px] font-bold text-white leading-7.5 w-full mb-3">
            Your Introduction
          </h4>
          <div className="w-full bg-black/15 border border-border-muted/20 rounded-2xl p-5 mb-6">
            <p className="text-[14px] text-text-muted leading-relaxed whitespace-pre-wrap">
              {application.pitch || "No introduction provided."}
            </p>
          </div>

          {/* Portfolio/Attachments */}
          <h4 className="text-[16px] font-bold text-white leading-7.5 w-full mb-3">
            Attached Portfolio
          </h4>
          <div className="w-full bg-black/15 border border-border-muted/20 rounded-2xl p-5">
            {application.portfolio ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex justify-center items-center shrink-0">
                  <HiOutlinePaperClip className="text-text-muted w-5 h-5" />
                </div>
                <span className="text-[14px] text-white/80 font-medium break-all">
                  {application.portfolio}
                </span>
              </div>
            ) : (
              <span className="text-[14px] text-text-muted">No files or links attached.</span>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex justify-end items-start px-9.5 pb-9.5 pt-4 w-full border-t-2 border-border-muted/30">
          <button 
            onClick={onClose}
            className="flex flex-col justify-center items-center py-3 px-8 border-2 border-border-muted/30 hover:bg-white/30 transition-colors rounded-full"
          >
            <span className="text-[15px] font-semibold text-text-muted text-center hover:text-white">
              Close
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}