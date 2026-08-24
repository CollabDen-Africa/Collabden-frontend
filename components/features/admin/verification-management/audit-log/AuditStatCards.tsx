import React from 'react';

export interface StatItem {
  label: string;
  value: string | number;
  barColor: string;
}

interface AuditStatCardsProps {
  stats: StatItem[];
}

export default function AuditStatCards({ stats }: AuditStatCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-300 mt-5">
      {stats.map((stat, i) => (
        <div key={i} className="flex flex-col items-start md:items-center p-[13px_16px] w-full bg-white/5 border border-white/9 rounded-[14px]">
          <span className="font-raleway font-bold text-[20px] leading-7.5 text-white">
            {stat.value}
          </span>
          <span className="font-inter text-[11px] leading-4 text-white/45 mt-0.5 whitespace-nowrap">
            {stat.label}
          </span>
          <div className={`w-5.5 h-0.75 rounded-xs mt-2 ${stat.barColor}`} />
        </div>
      ))}
    </div>
  );
}