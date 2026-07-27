"use client";
import React, { useEffect, useRef } from "react";
import { FiCheck, FiArrowLeft } from "react-icons/fi";
import Button from "@/components/ui/Button";

interface PaymentFlowLayoutProps {
  children: React.ReactNode;
  currentStep: string;
  onBack?: () => void;
}

const ESCROW_STEPS = [
  { id: "escrow_terms", label: "Escrow Setup" },
  { id: "escrow_milestones", label: "Milestones" },
  { id: "escrow_allocations", label: "Allocations" },
  { id: "escrow_review", label: "Review" },
  { id: "escrow_approvals", label: "Approvals" },
  { id: "escrow_funding", label: "Funding" },
];

export default function PaymentFlowLayout({ 
  children, 
  currentStep,
  onBack 
}: PaymentFlowLayoutProps) {
  
  // Only show stepper if the current state is one of the escrow configurations
  const isEscrowFlow = ESCROW_STEPS.some(s => s.id === currentStep);
  const activeIndex = ESCROW_STEPS.findIndex(s => s.id === currentStep);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef<HTMLDivElement>(null);

  // Automatically snap to the active step on mobile
  useEffect(() => {
    if (isEscrowFlow && activeStepRef.current && scrollContainerRef.current) {
      activeStepRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
  }, [activeIndex, isEscrowFlow]);

  return (
    <div className="w-full min-h-screen relative p-5 flex flex-col pb-25">

      <div className="relative z-10 w-full max-w-287.5 mx-auto flex flex-col h-full">
        
        {/* Flow Header */}
        {!isEscrowFlow && (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 md:mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="font-raleway font-black text-[20px] md:text-[24px] text-white tracking-[-0.6px]">
              Project Payments
            </h1>
            <p className="font-raleway font-normal text-[13px] md:text-[14px] text-text-muted">
              Set up secure payment terms and escrow for your collaborators
            </p>
          </div>
          {onBack && (
            <Button 
              variant="ghost" 
              onClick={onBack} 
              className="opacity-50 hover:opacity-100 hover:bg-white/10 shrink-0" 
              icon={FiArrowLeft} 
              iconPosition="left"
            >
              Back
            </Button>
          )}
        </div>
        )}

        {/* Conditionally Render Stepper for Escrow Flow Only */}
        {isEscrowFlow && (
          <div 
            ref={scrollContainerRef}
            className="flex items-center w-full mb-8 md:mb-10 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 custom-scrollbar snap-x snap-mandatory"
          >
            {ESCROW_STEPS.map((step, index) => {
              const isCompleted = index < activeIndex;
              const isActive = index === activeIndex;
              const isLast = index === ESCROW_STEPS.length - 1;

              return (
                <div 
                  key={step.id} 
                  ref={isActive ? activeStepRef : null}
                  className="flex items-center shrink-0 lg:shrink lg:w-full max-w-35 lg:max-w-53.5 snap-center"
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border-[1.1px] transition-colors
                      ${isCompleted || isActive 
                        ? 'bg-primary-green border-primary-green shadow-[0_0_0_4px_rgba(115,191,68,0.2)]'
                        : 'bg-white/5 border-white/10 text-white/30'}`}
                    >
                      {isCompleted ? (
                        <FiCheck size={14} className="text-white" />
                      ) : (
                        <span className={`font-raleway font-bold text-[10px] md:text-[12px] ${isActive ? 'text-white' : 'text-white/30'}`}>
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <span className={`font-raleway font-semibold text-[9px] md:text-[10px] tracking-[0.25px] whitespace-nowrap
                      ${isActive || isCompleted ? 'text-white' : 'text-white/30'}`}>
                      {step.label}
                    </span>
                  </div>
                  
                  {/* Connector Line */}
                  {!isLast && (
                    <div className={`flex-1 h-[0.7px] mx-2 md:mx-4 mb-5 transition-colors ${isCompleted ? 'bg-primary-green' : 'bg-white/30'}`} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Injected Component Content */}
        <div className="flex-1 flex flex-col animate-fade-in w-full h-full">
          {children}
        </div>
        
      </div>
    </div>
  );
}