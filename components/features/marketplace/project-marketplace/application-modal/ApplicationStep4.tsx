"use client";

import React from 'react';
import { HiX } from 'react-icons/hi';

export function ApplicationModalStep4({ onClose, onNext, onBack, projectData, applicationData }) {
  // Safe fallbacks
  const project = projectData || {
    title: 'Neon Soul — R&B Album Production',
  };

  const appData = applicationData || {
    introduction: 'Not written',
    portfolio: 'Skipped'
  };

  const totalSteps = 5;
  const currentStep = 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg p-4">
      {/* Modal Container */}
      <div className="flex flex-col w-full max-w-160.5 bg-white/20 border-2 border-border-muted rounded-[26.75px] shadow-[0_42.8px_133.7px_rgba(0,0,0,0.5)] overflow-hidden">
        
        {/* Header Section */}
         <div className="flex flex-col items-start p-[32.1px_37.45px_26.75px] border-b-2 border-border-muted/30 w-full">
          
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col">
              <span className="text-3.5 font-semibold text-text-muted uppercase tracking-[0.74px] leading-5.5">
                Applying to
              </span>
              <h3 className="pt-1.5 text-[20.06px] font-bold text-white leading-7.5">
                {project.title}
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
        <div className="flex flex-col items-start p-[32.1px_37.45px_0px_37.45px] w-full">
          
          <h4 className="text-[20.06px] font-bold text-white leading-7.5 w-full">
            Review & Submit
          </h4>
          
          <p className="pt-2 text-[17.39px] font-normal text-text-muted leading-6.5 w-full">
            Your application looks great. Ready to send?
          </p>

          {/* Review Card */}
          <div className="flex flex-col items-start p-[21.4px_24.08px] gap-3.25 mt-5.25 mb-9.25 w-full bg-black/15 rounded-2xl">
            
            {/* Project Row */}
            <div className="flex justify-between items-start w-full gap-4">
              <span className="text-[17.39px] font-normal text-text-muted leading-6.5 shrink-0">
                Project
              </span>
              <span className="text-[17.39px] font-semibold text-white leading-6.5 text-right">
                {project.title}
              </span>
            </div>

            {/* Introduction Row */}
            <div className="flex justify-between items-start w-full gap-4">
              <span className="text-[17.39px] font-normal text-text-muted leading-6.5 shrink-0">
                Introduction
              </span>
              <span className={`text-[17.39px] font-semibold leading-6.5 text-right ${appData.introduction === 'Not written' ? 'text-white/[0.28]' : 'text-white'}`}>
                {appData.introduction}
              </span>
            </div>

            {/* Portfolio Row */}
            <div className="flex justify-between items-start w-full gap-4">
              <span className="text-[17.39px] font-normal text-text-muted leading-6.5 shrink-0">
                Portfolio
              </span>
              <span className={`text-[17.39px] font-semibold leading-6.5 text-right ${appData.portfolio === 'Skipped' ? 'text-white/[0.28]' : 'text-white'}`}>
                {appData.portfolio}
              </span>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
         <div className="flex justify-between items-start px-9.5 pb-9.5 gap-3.25 w-full">
          
          <button 
            onClick={onBack}
            className="flex flex-col justify-center items-center py-3.5 flex-1 border-2 border-border-muted/30 hover:bg-white/30 transition-colors rounded-full"
          >
            <span className="text-[17.39px] font-semibold text-text-muted leading-6.5 text-center hover:text-white">
              Back
            </span>
          </button>

          <button 
            onClick={onNext}
            className="flex flex-col justify-center items-center py-3.5 flex-1 bg-primary-green transition-colors rounded-full"
          >
            <span className="text-[17.39px] font-semibold text-white leading-6.5">
              Submit Application
            </span>
          </button>

        </div>

      </div>
    </div>
  );
}