"use client";

import React from 'react';
import { HiX } from 'react-icons/hi';

export function ApplicationModalStep1({ onClose, onNext, projectData, appData, setAppData }) {
  // Safe fallbacks
  const project = projectData || {
    title: 'Neon Soul — R&B Album Production',
    requiredRoles: ['Vocalist', 'Producer', 'Mix Engineer'],
    compensation: '$2,400–$3,800',
    duration: '4 months',
    deadline: 'Aug 30, 2026',
    paymentStatus: 'Escrow Protected'
  };

  const totalSteps = 5;
  const currentStep = 1;
  const canContinue = !!appData.role;
  const rawRoles = project.requiredRoles || project.roles;
   let roles = ['Collaborator'];
  
    if (Array.isArray(rawRoles) && rawRoles.length > 0) {
      roles = rawRoles;
    } else if (typeof rawRoles === 'string') {
      try {
        const parsed = JSON.parse(rawRoles);
        if (Array.isArray(parsed) && parsed.length > 0) roles = parsed;
        else roles = [rawRoles];
      } catch {
        roles = rawRoles.split(',').map((r: string) => r.trim()).filter(Boolean);
      }
    }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg p-4">
      {/* Modal Container */}
      <div className="flex flex-col w-full max-w-160.5 bg-white/20 border-2 border-border-muted rounded-[26.75px] shadow-[0_42.8px_133.7px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Header Section */}
        <div className="flex flex-col items-start p-[32.1px_37.45px_26.75px] border-b-2 border-border-muted/30 w-full">
          
          <div className="flex justify-between items-start w-full mt-1">
            <div className="flex flex-col">
              <span className="text-[14.71px] font-semibold text-text-muted uppercase tracking-[0.74px] leading-5.5">
                Applying to
              </span>
              <h3 className="pt-1.5 text-[20.06px] font-bold text-white leading-7.5">
                {project.title || project.name}
              </h3>
            </div>
            
            <button 
              onClick={onClose}
              className="flex justify-center items-center w-10.75 h-10.75 bg-black/15 border-[2.54px] border-black/5 rounded-full hover:bg-white/15 transition-colors shrink-0 group"
            >
              <HiX size={18} className="text-text-muted group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Progress Bars */}
          <div className="flex items-start pt-5.5 gap-2 w-full">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div 
                key={index}
                className={`flex-1 h-1.25 rounded-[132.42px] ${
                  index < currentStep ? 'bg-accent-blue' : 'bg-card-bg'
                }`}
              />
            ))}
          </div>

          <span className="pt-2 text-[16.05px] font-normal text-white/[0.28] leading-6">
            Step {currentStep} of {totalSteps}
          </span>
        </div>

        {/* Body Section */}
        <div className="flex flex-col items-start p-[32.1px_37.45px] w-full">
          
          <h4 className="text-[20.06px] font-bold text-white/80 leading-7.5 w-full">
            Review Project
          </h4>
          
          <p className="pt-2 text-[17.39px] font-normal text-text-muted leading-6.5 w-full">
            Make sure this is the right fit before applying.
          </p>

          {/* Details Card */}
          <div className="flex flex-col items-start p-[21.4px_24.08px] gap-3.25 mt-5.25 w-full bg-black/15 rounded-2xl">
            
            <div className="flex justify-between items-start w-full">
              {/* Role Selector */}
          <div className="flex flex-col gap-3 w-full border-b border-white/5 pb-4">
            <span className="text-[15px] font-semibold text-white/60 uppercase tracking-wide">Available Roles</span>
            <div className="flex flex-wrap gap-2">
              {roles.map((role: string) => (
              <button
                key={role}
                onClick={() => setAppData({ ...appData, role })}
                className={`px-4 py-2 rounded-full text-[14px] font-semibold transition-all ${
                appData.role === role ? 'bg-primary-green border border-primary-green text-white shadow-[0_0_10px_rgba(115,191,68,0.3)]' : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {role}
              </button>
               ))}
            </div>
          </div>
        </div>

            <div className="flex justify-between items-start w-full">
              <span className="text-[17.39px] font-normal text-text-muted leading-6.5">Compensation</span>
              <span className="text-[17.39px] font-semibold text-white leading-6.5">{project.compensation}</span>
            </div>

            <div className="flex justify-between items-start w-full">
              <span className="text-[17.39px] font-normal text-text-muted leading-6.5">Duration</span>
              <span className="text-[17.39px] font-semibold text-white leading-6.5">{project.duration}</span>
            </div>

            <div className="flex justify-between items-start w-full">
              <span className="text-[17.39px] font-normal text-text-muted leading-6.5">Deadline</span>
              <span className="text-[17.39px] font-semibold text-white leading-6.5">{project.deadline}</span>
            </div>

            <div className="flex justify-between items-start w-full">
              <span className="text-[17.39px] font-normal text-text-muted leading-6.5">Payment</span>
              <span className="text-[17.39px] font-semibold text-primary-green leading-6.5">{project.paymentStatus}</span>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col items-start px-9.5 pb-9.5 w-full">
          <button 
            onClick={onNext}
            disabled={!canContinue}
            className="flex flex-col justify-center items-center py-3.5 w-full bg-primary-green transition-colors rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-[17.39px] font-semibold text-white leading-6.5 text-center">
              {canContinue ? "Continue" : "Select a role to continue"}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}