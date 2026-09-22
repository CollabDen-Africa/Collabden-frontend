import React from 'react';
import Avatar from '@/components/ui/Avatar';
import Link from 'next/link';

export interface ProjectCollaborator {
  name: string;
  avatarUrl?: string;
}

export interface ProjectCardProps {
  id: number;
  title: string;
  genre: string;
  tracks: string;
  collaborators: ProjectCollaborator[];
  progress: number;
  updated: string;
  status?: string; 
}


const AudioLinesIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-primary-blue drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
    <path d="M2 10v3" />
    <path d="M6 6v11" />
    <path d="M10 3v18" />
    <path d="M14 8v7" />
    <path d="M18 5v13" />
    <path d="M22 10v3" />
  </svg>
);

export default function ProjectCard({ 
  id,
  title, 
  genre, 
  tracks, 
  collaborators, 
  progress, 
  updated,
  status = 'Active' 
}: ProjectCardProps) {

  
  const isReview = status.toLowerCase() === 'review' || status.toLowerCase() === 'in review';
  const badgeBg = isReview ? 'bg-accent-yellow/20' : 'bg-accent-green-success/50';
  const badgeText = isReview ? 'text-accent-yellow' : 'text-accent-green-bright/70';

  return (
    <div className="w-full bg-white/5 hover:bg-white/10 transition-colors rounded-[20px] px-5 md:px-8 py-6 md:py-8 flex flex-col gap-4.75">
          
      {/* TOP SECTION */}
      <div className="flex justify-between items-start w-full">
        
        <div className="flex gap-5 md:gap-6 items-start">
          <div className="w-13.5 h-13.5 bg-black/50 rounded-[9px] flex items-center justify-center shrink-0">
            <AudioLinesIcon />
          </div>
          
          <div className="flex flex-col gap-3 md:gap-4">
            <h3 className="font-semibold text-[18px] md:text-[20px] text-foreground leading-none">
              {title}
            </h3>
            
            <div className="flex items-center gap-2.5 text-foreground/60 font-medium text-[14px] md:text-[16px] leading-none">
              {genre} 
              <div className="w-2 h-2 flex items-center justify-center">
                <span className="w-[6.4px] h-[6.4px] bg-foreground/60 rounded-full" /> 
              </div>
              {tracks}
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                {collaborators.map((user, index) => (
                  <div 
                    key={index} 
                    className={`relative ${index > 0 ? '-ml-2' : ''}`}
                    style={{ zIndex: 10 - index }} 
                  >
                    <Avatar 
                      name={user.name} 
                      src={user.avatarUrl} 
                      className="w-5.75 h-5.75 text-[9px] border-[1.15px] border-primary-green" 
                    />
                  </div>
                ))}
              </div>
              <span className="text-foreground/60 font-medium text-[14px] md:text-[16px]">
                {collaborators.length} collaborators
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`flex justify-center items-center px-2.5 py-1 rounded-[30px] ${badgeBg}`}>
          <span className={`font-medium text-[10px] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] ${badgeText}`}>
            {status}
          </span>
        </div>
        
      </div>

      {/* Progress Bar + Timestamp + Project Dropdown */}
      <div className="flex flex-col gap-2 w-full mt-2.5">
        
        <div className="flex justify-between items-center w-full">
          <span className="text-foreground/60 font-medium text-[14px]">Progress</span>
          <span className="text-foreground font-bold text-[14px]">{progress}%</span>
        </div>
        
        <div className="w-full h-1.75 bg-white/20 rounded-[40px] overflow-hidden flex">
          <div 
            className="h-full bg-primary-blue rounded-[40px] transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        <div className="flex justify-between items-end w-full mt-1">
          <div className="flex items-center gap-1.25 text-foreground/60">
            <div className="w-4 h-4 flex items-center justify-center">
              <span className="w-[12.6px] h-[11.8px] bg-foreground/60 opacity-50" style={{ clipPath: 'circle(50%)' }} />
            </div>
            <span className="text-[12px] font-medium">Updated {updated}</span>
          </div>
          
          {/* Open Project Dropdown */}
          <Link href={`/projects/${id}`} className="flex items-center gap-1 hover:opacity-80 transition-opacity group">
            <span className="text-primary-green font-medium text-[12px] group-hover:underline">Open Project</span>
            <span className="w-3.75 h-1.75 bg-primary-green" style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0, 80% 0, 50% 60%, 20% 0)' }} />
          </Link>
        </div>

      </div>
    </div>
  );
}