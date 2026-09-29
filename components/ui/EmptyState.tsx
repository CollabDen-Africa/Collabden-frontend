import React from "react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  disabled?: boolean;
}

export default function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
 disabled = false 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-100 bg-white/10 backdrop-blur-xl border border-text-muted rounded-[30px] lg:rounded-[50px] p-10 shadow-xl shadow-primary-blue/5 text-center transition-transform hover:-translate-y-1 duration-300">
      
      {/* Icon Wrapper */}
      <div className="w-20 h-20 bg-primary-green/10 border border-primary-green/20 rounded-full flex items-center justify-center mb-6 shadow-sm text-primary-green">
        {icon}
      </div>

      {/* Text Content */}
      <h3 className="font-raleway font-semibold text-[20px] lg:text-[24px] leading-8.25 text-main mb-3">
        {title}
      </h3>
      <p className="font-raleway font-normal text-[15px] lg:text-[16px] leading-6 text-white/70 max-w-100 mb-8">
        {description}
      </p>

      {/* Optional Call to Action */}
      {actionLabel && onAction && (
        <button 
          onClick={disabled ? undefined : onAction}
          disabled={disabled}
          className={`h-12 px-8 rounded-full flex items-center justify-center transition-colors ${
              disabled ? 'bg-white/10 border border-white/20 text-white/40 cursor-not-allowed shadow-none' 
               : 'bg-primary-green hover:bg-accent-green-bright/ shadow-[0_4px_14px_rgba(115,191,68,0.3)]'
               }`}
                  >
                  <span className={`font-raleway font-semibold text-[16px] leading-6 ${disabled ? 'text-white/40' : 'text-white'}`}>
                      {actionLabel}
                  </span>
        </button>
      )}

    </div>
  );
}