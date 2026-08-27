import React from 'react';

export interface StatItem {
  label: string;
  value: string | number;
  barColor: string;
}

interface DashboardStatCardsProps {
  stats: StatItem[];
}

export default function DashboardStatCards({ stats }: DashboardStatCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 w-full max-w-400 mt-5">
      {stats.map((stat, i) => (
        <div key={i} className="flex flex-col p-3 bg-white/5 border border-white/10 rounded-2xl h-24.25">
          <div className="font-raleway font-bold text-[18px] text-white">{stat.value}</div>
          <div className="font-inter text-[10px] text-white/45 mt-0.5">{stat.label}</div>
          <div className={`w-5.5 h-0.75 rounded-full mt-2 ${stat.barColor}`} />
        </div>
      ))}
    </div>
  );
}