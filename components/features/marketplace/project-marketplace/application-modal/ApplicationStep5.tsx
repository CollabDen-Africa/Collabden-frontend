"use client";

import React from 'react';
import { HiCheck } from 'react-icons/hi';

export function ApplicationModalStep5({ onClose, onViewApplications, projectData }) {
  // Safe fallback
  const project = projectData || {
    authorName: 'Marcus Webb',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg p-4">
      {/* Modal Container */}
      <div className="flex flex-col w-full max-w-160.5 bg-white/20 border-2 border-border-muted rounded-[26.75px] shadow-[0_42.8px_133.7px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Content Section */}
        <div className="flex flex-col items-center justify-center p-[64px_53.5px] w-full text-center">
          
          {/* Success Icon */}
          <div className="flex justify-center items-center w-21.5 h-21.5 bg-primary-green/30 rounded-full shrink-0">
            <HiCheck size={40} className="text-primary-green" strokeWidth={1} />
          </div>

          {/* Heading */}
          <h3 className="pt-6.5 text-[26.75px] font-bold text-white leading-10 w-full">
            Application Submitted!
          </h3>

          {/* Message */}
          <p className="pt-3.25 text-[17.39px] font-normal text-text-muted leading-7.5 max-w-132.5">
            Your application has been sent to {project.authorName}. You will be notified when they review your pitch.
          </p>

          {/* Footer Actions */}
          <div className="flex justify-between items-center pt-10.75 gap-4 w-full">
            
            <button 
              onClick={onClose}
              className="flex flex-col justify-center items-center py-3.5 flex-1 border-2 border-border-muted/30 hover:bg-white/30 transition-colors rounded-full"
            >
              <span className="text-[17.39px] font-semibold text-text-muted leading-6.5 text-center hover:text-white">
                Browse More
              </span>
            </button>

            <button 
              onClick={onViewApplications}
              className="flex flex-col justify-center items-center py-3.5 flex-1 bg-primary-green transition-colors rounded-full"
            >
              <span className="text-[17.39px] font-semibold text-white leading-6.5">
                View Applications
              </span>
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}