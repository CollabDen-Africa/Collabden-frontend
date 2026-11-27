import React from 'react';
import Skeleton from '@/components/ui/Skeleton';

// Stat structure
export interface TopStat {
  title: string;
  count: string | number;
  subtitle: string;
  orbClass: string;
}

interface TopStatsPanelProps {
  stats?: TopStat[];
  isLoading?: boolean;
}

export default function TopStatsPanel({ stats = [], isLoading = false }: TopStatsPanelProps) {
  const cardFrame =
    "relative w-full h-[257px] bg-black/20 rounded-[30px] p-[21px] flex flex-col justify-between overflow-hidden border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md";

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px] w-full">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={cardFrame}>
            <div className="z-10 pt-1">
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="flex flex-col pl-[2px] z-10 pb-[2px] gap-3">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px] w-full">
      {stats.map((stat, i) => (
        <div key={i} className={cardFrame}>
          <div
            className={`absolute w-[198px] h-[198px] left-[106px] top-[47px] rounded-full blur-[25.5px] opacity-70 transform -rotate-[69deg] pointer-events-none ${stat.orbClass}`}
          />

          <div className="z-10 pt-1">
            <h3 className="font-semibold text-[20px] text-foreground w-[129px] leading-[1.2]">
              {stat.title}
            </h3>
          </div>

          <div className="flex flex-col pl-[2px] z-10 pb-[2px]">
            <span className="font-bold text-[40px] text-primary-green leading-none">
              {stat.count}
            </span>
            <span className="font-normal text-[12.46px] text-foreground/60 mt-[8px]">
              {stat.subtitle}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
