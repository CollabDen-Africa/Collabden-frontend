import React from "react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] bg-white/10 backdrop-blur-xl border border-text-muted rounded-[30px] lg:rounded-[50px] p-[40px] shadow-xl shadow-primary-blue/5 text-center transition-transform hover:-translate-y-1 duration-300">
      
      {/* Icon Wrapper */}
      <div className="w-[80px] h-[80px] bg-primary-green/10 border border-primary-green/20 rounded-full flex items-center justify-center mb-[24px] shadow-sm text-primary-green">
        {icon}
      </div>

      {/* Text Content */}
      <h3 className="font-raleway font-semibold text-[20px] lg:text-[24px] leading-[33px] text-main mb-[12px]">
        {title}
      </h3>
      <p className="font-raleway font-normal text-[15px] lg:text-[16px] leading-[24px] text-white/70 max-w-[400px] mb-[32px]">
        {description}
      </p>

      {/* Optional Call to Action */}
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="h-[48px] px-[32px] bg-primary-green hover:bg-accent-green-bright/ transition-colors rounded-full flex items-center justify-center shadow-[0_4px_14px_rgba(115,191,68,0.3)]"
        >
          <span className="font-raleway font-semibold text-[16px] leading-[24px] text-white">
            {actionLabel}
          </span>
        </button>
      )}

    </div>
  );
}