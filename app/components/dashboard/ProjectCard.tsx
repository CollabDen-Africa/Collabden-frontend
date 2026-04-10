import React from 'react';
import { LuHeadphones } from "react-icons/lu";
import { HiArrowRight, HiOutlineClock } from "react-icons/hi2";
import Avatar from '@/app/components/ui/Avatar';

export interface ProjectCollaborator {
  name: string;
  avatarUrl?: string;
}

export interface ProjectCardProps {
  title: string;
  genre: string;
  tracks: string;
  collaborators: ProjectCollaborator[];
  progress: number;
  updated: string;
  status?: string; 
}

export default function ProjectCard({ 
  title, 
  genre, 
  tracks, 
  collaborators, 
  progress, 
  updated,
  status = 'Active' 
}: ProjectCardProps) {

  // Dynamic styling for the status badge
  const isReview = status.toLowerCase() === 'in review';
  const badgeBg = isReview ? 'bg-accent-yellow/30' : 'bg-accent-green-success/30';
  const badgeText = isReview ? 'text-accent-yellow' : 'text-accent-green-success';

  return (
    <div className="w-full border border-gray-300 rounded-[30px] px-8 py-10 flex flex-col bg-white hover:shadow-md transition-shadow">
      
      <div className="flex flex-col gap-[19px] w-full">
        
        {/* TOP ROW: Icon + Info Column (Left) | Badge (Right) */}
        <div className="flex justify-between items-start w-full">
          
          <div className="flex gap-[24px] items-start">
            {/* Project Icon */}
            <div className="w-[54px] h-[54px] bg-primary-blue rounded-[9px] flex items-center justify-center shrink-0 mt-1">
              <LuHeadphones className="text-white w-6 h-6" />
            </div>
            
            {/* Project Info */}
            <div className="flex flex-col gap-[16px]">
              
              <h3 className="font-semibold text-[20px] leading-[23px] text-black">{title}</h3>
              
              <div className="flex items-center gap-2 text-black/60 font-medium text-[16px] leading-[19px]">
                {genre} <span className="w-[8px] h-[8px] bg-black/60 rounded-full" /> {tracks}
              </div>

              {/* Collaborators */}
              <div className="flex items-center gap-[6px]">
                <div className="flex items-center pr-2">
                  {collaborators.map((user, index) => (
                    <div 
                      key={index} 
                      className={`relative ${index > 0 ? '-ml-[11.5px]' : ''}`}
                      style={{ zIndex: 10 - index }} 
                    >
                      <Avatar 
                        name={user.name} 
                        src={user.avatarUrl} 
                        className="w-[23px] h-[23px] text-[9px] border-[1.15px] border-primary-green bg-white shadow-sm" 
                      />
                    </div>
                  ))}
                </div>
                <span className="text-black/60 font-medium text-[16px] leading-[19px]">
                  {collaborators.length} collaborators
                </span>
              </div>

            </div>
          </div>

          {/* Status badge */}
          <span className={`${badgeBg} ${badgeText} px-[10px] py-[4px] rounded-[30px] text-[10px] leading-[12px] font-medium tracking-wide`}>
            {status}
          </span>
          
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-[8px] w-full mt-2">
          <div className="flex justify-between items-center w-full">
            <span className="text-black/60 font-medium text-[14px] leading-[16px]">Progress</span>
            <span className="text-black font-bold text-[14px] leading-[16px]">{progress}%</span>
          </div>
          <div className="w-full h-[7px] bg-gray-200 rounded-[40px] overflow-hidden pr-[190px]">
            <div 
              className="h-full bg-primary-blue rounded-[40px] transition-all duration-1000" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        {/* Updated Time & Action Button */}
        <div className="flex justify-between items-end w-full mt-1">
          <div className="flex items-center gap-1.5 text-black/60">
            <HiOutlineClock className="w-4 h-4" />
            <span className="text-[12px] leading-[14px] font-medium">Updated {updated}</span>
          </div>
          
          <button className="text-primary-green font-medium text-[12px] leading-[14px] flex items-center gap-1 hover:underline">
            Open Project <HiArrowRight className="w-3.5 h-3.5 stroke-2" />
          </button>
        </div>

      </div>
    </div>
  );
}