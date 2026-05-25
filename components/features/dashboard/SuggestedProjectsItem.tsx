import React from 'react';
import { LuHeadphones } from "react-icons/lu";

//Data structure
export interface SuggestedProjectItemProps {
  title: string;
  needs: string;
  members: number;
  tags: string[];
}

export default function SuggestedProjectItem({ title, needs, members, tags }: SuggestedProjectItemProps) {
  return (
    <div className="flex flex-row items-start gap-[16px] w-full p-2 -mx-2 rounded-[16px] hover:bg-white/5 transition-colors cursor-pointer">
      
      {/* Icon Box */}
      <div className="w-[48px] h-[48px] bg-black/50 rounded-[8px] flex items-center justify-center shrink-0 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
         <LuHeadphones className="text-primary-blue w-[24px] h-[24px] drop-shadow-md" />
      </div>

      {/* Content Column */}
      <div className="flex flex-col gap-[12px] min-w-0 py-1">
        
        {/* Title */}
        <h4 className="font-bold text-[16px] leading-[19px] text-foreground truncate">
          {title}
        </h4>
        
        {/* Needs & Members */}
        <div className="flex items-center gap-[10px] text-[14px] leading-[16px] text-foreground/60 font-medium truncate mt-[-4px]">
          <span>{needs}</span>
          <span className="w-[6px] h-[6px] bg-foreground/60 rounded-full shrink-0" />
          <span>{members} members</span>
        </div>

        {/* Tags Row */}
        <div className="flex flex-row items-center gap-[10px] flex-wrap">
          {tags.map((tag: string) => (
            <div 
              key={tag} 
              className="bg-background/80 border border-white/5 rounded-[1000px] px-[12px] py-[4px] flex items-center justify-center shadow-sm"
            >
              <span className="font-medium text-[10px] leading-[12px] text-foreground">
                {tag}
              </span>
            </div>
          ))}
        </div>

      </div>
      
    </div>
  );
}