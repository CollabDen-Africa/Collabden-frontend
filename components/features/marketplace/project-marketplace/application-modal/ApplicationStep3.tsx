"use client";

import React, { useRef } from 'react';
import { HiX, HiPlus, HiLink } from 'react-icons/hi';

export function ApplicationModalStep3({ onClose, onNext, onBack, projectData, appData, setAppData }: any) {
  // Safe fallbacks
  const project = projectData || {
    title: 'Neon Soul — R&B Album Production',
  };

  const totalSteps = 5;
  const currentStep = 3;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAppData({ ...appData, portfolio: file.name, portfolioFile: file });
      }
    };


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
            Attach Portfolio
          </h4>
          
          <p className="pt-2 text-[17.39px] font-normal text-text-muted leading-6.5 w-full">
            Share relevant work samples or links.
          </p>

          {/* Drag & Drop Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full mt-5.25 mb-9.25 p-[47.8px_31.86px] border-2 border-dashed border-border-muted hover:border-primary-green bg-black/15 hover:bg-black/30 rounded-2xl cursor-pointer transition-all group">

            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            
            <div className={`flex justify-center items-center w-13.5 h-13.5 bg-white/30 group-hover:bg-primary-green transition-colors rounded-full ${appData.portfolioFile ? 'bg-primary-green' : 'bg-white/30 group-hover:bg-primary-green'}`}>
              <HiPlus size={24} className={`${appData.portfolioFile ? 'text-white' : 'text-text-muted group-hover:text-white'}`} />
            </div>

            <span className={`pt-[15.93px] text-[17.26px] font-semibold transition-colors leading-6.5 ${appData.portfolioFile ? 'text-primary-green' : 'text-text-muted group-hover:text-white'}`}>
              {appData.portfolioFile ? appData.portfolioFile.name : "Upload files or add links"}
            </span>

            <span className="pt-1.25 text-[15.93px] font-normal text-white/[0.28] group-hover:text-text-muted transition-colors leading-6 text-center max-w-89.75">
              MP3, WAV, PDF, links to SoundCloud, Spotify, etc.
            </span>
            
          </div>

          {/* Fallback URL Input */}
                    <div className="w-full mt-4 mb-9.25 relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary-green transition-colors">
                        <HiLink size={20} />
                      </div>
                      <input 
                        type="url"
                        value={appData.portfolioFile ? '' : appData.portfolio}
                        onChange={(e) => {
                          setAppData({ ...appData, portfolio: e.target.value, portfolioFile: null });
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        placeholder="Or paste a link to SoundCloud, Spotify, etc..."
                        className="w-full bg-black/15 border-2 border-black/5 hover:border-white/10 focus:border-primary-green rounded-2xl p-[14px_20px_14px_48px] text-[15px] text-white placeholder:text-white/30 focus:outline-none transition-all"
                      />
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
              Continue
            </span>
          </button>

        </div>

      </div>
    </div>
  );
}