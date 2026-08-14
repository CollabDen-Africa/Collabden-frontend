import React from "react";

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
  children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  icon,
  title,
  subtitle,
  className = "",
  children,
}) => {
  return (
    <div
      className={`bg-[#121415] border border-white/5 rounded-2xl flex flex-col ${className}`}
    >
      {/* Header */}
      <div className={`flex items-center gap-4 ${subtitle ? 'border-b border-white/5 p-6 md:p-8' : 'p-6 pb-0'}`}>
        {icon}
        <div className="flex flex-col">
          <h3 className={`font-bold text-white ${subtitle ? 'text-lg' : 'text-base'}`}>{title}</h3>
          {subtitle && <p className="text-sm text-white/40 mt-1">{subtitle}</p>}
        </div>
      </div>

      {/* Body */}
      <div className={`flex flex-col gap-5 ${subtitle ? 'p-6 md:p-8' : 'p-6'}`}>
        {children}
      </div>
    </div>
  );
};
