import React from 'react';

export interface OnboardingTooltipProps {
  step: number;
  totalSteps?: number;
  title: string;
  description: string;
  onSkip: () => void;
  onNext: () => void;
  nextLabel?: string;
  direction?: 'right-of' | 'above' | 'left-of' | 'none'; 
  mobileDirection?: 'bottom' | 'top'; 
  arrowOffset?: string;
  showArrow?: boolean;
  isLastStep?: boolean;
}

export default function OnboardingTooltip({
  step,
  totalSteps = 6,
  title,
  description,
  onSkip,
  onNext,
  nextLabel = "Next",
  direction = 'right-of',
  mobileDirection = 'bottom', 
  arrowOffset,
  showArrow = true,
  isLastStep = false
}: OnboardingTooltipProps) {
  
  const isAbove = direction === 'above';
  const isLeft = direction === 'left-of';
  const isRight = direction === 'right-of';
  
  return (
    // 220px on mobile to fit inside the Sidebar drawer
    <div className={`z-[100] w-[220px] sm:w-[320px] xl:w-[374px] animate-in fade-in zoom-in-95 duration-500
      ${direction === 'none' ? 'relative mx-auto' : 'absolute'}
      
      ${/* ABOVE: Stays above on both mobile & desktop */ ''}
      ${isAbove ? 'bottom-[calc(100%+15px)] right-0' : ''}
      
      ${/* RIGHT-OF: Desktop sits right and vertically centers itself */ ''}
      ${isRight ? 'lg:left-[calc(100%+20px)] lg:top-18 lg:-translate-y-1/2' : ''}
      ${/* RIGHT-OF: Mobile Logic */ ''}
      ${isRight && mobileDirection === 'bottom' ? 'max-lg:top-[calc(100%+15px)] max-lg:left-0' : ''}
      ${isRight && mobileDirection === 'top' ? 'max-lg:bottom-[calc(100%+15px)] max-lg:left-0' : ''}
      
      ${/* LEFT-OF: Desktop sits left and vertically centers itself */ ''}
      ${isLeft ? 'lg:right-[calc(100%+20px)] lg:top-1/2 lg:-translate-y-1/2' : ''}
      ${/* LEFT-OF: Mobile Logic */ ''}
      ${isLeft && mobileDirection === 'bottom' ? 'max-lg:top-[calc(100%+15px)] max-lg:right-0' : ''}
      ${isLeft && mobileDirection === 'top' ? 'max-lg:bottom-[calc(100%+15px)] max-lg:right-0' : ''}
    `}>
      <div className="relative bg-black/90 backdrop-blur-xl border-[0.5px] border-primary-green rounded-[30px] p-[16px] sm:p-[26px] flex flex-col items-center gap-[16px] sm:gap-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        
        {/* MOBILE ARROWS */}
        {showArrow && direction !== 'none' && (
          <div 
            className={`lg:hidden absolute w-[16px] h-[16px] bg-[#1a1a1a] border-primary-green transform rotate-45
              ${(isAbove || mobileDirection === 'top') ? 'border-r-[0.5px] border-b-[0.5px] -bottom-[8px]' : 'border-l-[0.5px] border-t-[0.5px] -top-[8px]'}
              ${(isRight || isAbove) ? 'left-[30px]' : ''}
              ${isLeft ? 'right-[30px]' : ''}
            `} 
          />
        )}

        {/* DESKTOP ARROWS */}
        {showArrow && direction !== 'none' && (
          <div 
            className={`hidden lg:block absolute w-[16px] h-[16px] bg-[#1a1a1a] border-primary-green transform
              ${isAbove ? 'border-r-[0.5px] border-b-[0.5px] rotate-45 -bottom-[8px]' : ''}
              ${isLeft ? 'border-r-[0.5px] border-t-[0.5px] rotate-45 -right-[8px]' : ''}
              ${isRight ? 'border-l-[0.5px] border-t-[0.5px] -rotate-45 -left-[8px]' : ''}
            `} 
            style={{ 
              [isAbove ? 'right' : 'top']: arrowOffset || '50%',
              ...(isRight || isLeft ? { marginTop: '-8px' } : {}) 
            }}
          />
        )}

        <div className="flex flex-col items-center gap-[6px] w-full text-center">
          <h3 className="font-sans font-semibold text-[16px] sm:text-[20px] text-foreground leading-tight">{title}</h3>
          <p className="font-sans font-medium text-[13px] sm:text-[15px] text-foreground/60 max-w-[280px]">
            {description}
          </p>
        </div>

        <div className={`flex items-center w-full mt-[4px] ${isLastStep ? 'justify-center' : 'justify-between'}`}>
          {!isLastStep && (
            <span className="font-sans font-normal text-[12px] sm:text-[14px] text-foreground">{step}/{totalSteps}</span>
          )}

          <div className={`flex items-center ${isLastStep ? 'w-full flex justify-center' : 'gap-[12px] sm:gap-[24px]'}`}>
            {!isLastStep && (
              <button onClick={onSkip} className="text-primary-green font-semibold text-[12px] sm:text-[14px] hover:opacity-80 transition-opacity">
                Skip
              </button>
            )}
            <button 
              onClick={onNext} 
              className={`bg-primary-green text-white rounded-[20px] font-semibold text-[12px] sm:text-[14px] shadow-btn-primary hover:scale-105 transition-transform
                ${isLastStep ? 'w-[131px] h-[32px]' : 'px-[16px] py-[8px]'}
              `}
            >
              {nextLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}