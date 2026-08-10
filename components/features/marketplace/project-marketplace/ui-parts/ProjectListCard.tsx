import Image from 'next/image';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { HiShare, HiShieldCheck, HiLightningBolt, HiOutlineBookmark } from 'react-icons/hi';

export const ProjectListCard = ({ project, onApply }: { project: any, onApply: () => void }) => {
  return (
    <div className="flex flex-row bg-white/15 border border-border-muted/30 rounded-2xl overflow-hidden w-full transition-colors group h-full max-h-70">
      
      {/* Thumbnail */}
      <div className="relative w-27.5 sm:w-48 md:w-70 shrink-0 bg-black/15">
        {project.image && (
                  <Image 
                    src={project.image} 
                    alt={project.title} 
                    fill 
                    sizes="(max-width: 640px) 110px, (max-width: 768px) 192px, 280px"
                    className="object-cover" 
                  />
                )}
        <div className="absolute inset-0 bg-linear-to-r from-black/50 to-transparent z-10" />
        
        {/* Top Badges - Hidden on tiny mobile screens to avoid visual clutter */}
        <div className="hidden sm:flex absolute top-3 left-3 z-20 flex-wrap gap-1">
          {project.genres?.map((genre: string) => (
            <div key={genre} className="bg-black/50 backdrop-blur-sm text-text-muted text-[10px] px-2 py-0.5 rounded-full">
              {genre}
            </div>
          ))}
        </div>
        
        {project.isUrgent && (
          <div className="absolute top-2 left-2 sm:top-3 sm:right-3 sm:left-auto z-20 bg-[#2A1E08]/80 backdrop-blur-sm text-accent-yellow text-[10px] w-5 h-5 sm:w-auto sm:h-auto sm:px-2 sm:py-0.5 rounded-full flex justify-center sm:gap-1 items-center font-medium">
            <HiLightningBolt className="w-3 h-3" /> <span className="hidden sm:inline">Deadline Soon</span>
          </div>
        )}
        
        {/* Bottom Badge */}
        {project.isEscrowProtected && (
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:right-3 sm:left-auto z-20 bg-primary-green/20 backdrop-blur-sm text-primary-green text-[10px] w-5 h-5 sm:w-auto sm:h-auto sm:px-2 sm:py-0.5 rounded-full flex justify-center sm:gap-1 items-center font-medium">
            <HiShieldCheck className="w-3 h-3" /> <span className="hidden sm:inline">Escrow Protected</span>
          </div>
        )}
      </div>

      {/* Right Content Area */}
      <div className="flex flex-col p-3 sm:p-4 md:p-5 flex-1 min-w-0">
        
        {/* Title & Bookmark */}
        <div className="flex justify-between items-start gap-2 sm:gap-4">
          <h3 className="text-[14px] sm:text-[16px] font-bold text-white line-clamp-1 transition-colors">{project.title}</h3>
          <Button variant="ghost" size="sm" className="p-1 h-auto min-h-0 shrink-0 hover:bg-white/5 -mt-1 -mr-1 sm:m-0">
            <HiOutlineBookmark size={18} className="text-white/50 hover:text-white transition-colors w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </Button>
        </div>

        {/* Author Info */}
        <div className="flex justify-between items-center mt-1 sm:mt-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Avatar
              name={project.authorName}
              className="w-5 h-5 sm:w-6 sm:h-6 bg-accent-blue text-[8px] sm:text-[9px] font-bold" 
            />
            <span className="text-[11px] sm:text-[12px] font-medium text-text-muted truncate max-w-25 sm:max-w-none">{project.authorName}</span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-medium text-white/30 whitespace-nowrap">{project.postedAt}</span>
        </div>

        {/* Description (Hidden on mobile to save space, visible on tablets/desktops) */}
        <p className="hidden sm:block text-[12px] text-text-muted mt-3 line-clamp-2 leading-relaxed md:max-w-3xl">
          {project.description}
        </p>

        {/* Roles Tags */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2 sm:mt-3">
          {project.roles?.map((role: string) => (
             <div key={role} className="bg-primary-blue/20 border border-primary-blue/30 text-accent-soft-blue text-[9px] sm:text-[10px] rounded-md px-1.5 sm:px-2 py-0.5 font-medium whitespace-nowrap">
               {role}
             </div>
          ))}
        </div>

        <div className="mt-auto pt-2 sm:pt-4 md:pt-5">
          {/* Detailed Stats Row */}
          <div className="hidden sm:flex justify-between border-y border-border-muted/20 py-3">
            <div className="flex flex-col">
              <span className="text-[9px] font-semibold text-white/30 uppercase tracking-wider">Duration</span>
              <span className="text-[11px] font-semibold text-text-muted mt-1">{project.duration}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] font-semibold text-white/30 uppercase tracking-wider">Deadline</span>
              <span className="text-[11px] font-semibold text-text-muted mt-1">{project.deadline}</span>
            </div>
            <div className="flex flex-col items-end md:items-start">
              <span className="text-[9px] font-semibold text-white/30 uppercase tracking-wider">Applicants</span>
              <span className="text-[11px] font-semibold text-text-muted mt-1">{project.applicants}</span>
            </div>
            {/* Empty div to balance spacing on wider screens */}
            <div className="hidden md:block flex-col w-25" />
          </div>

          {/* Mobile Footer Actions (Compact layout for small screens) */}
          <div className="flex justify-between items-center sm:mt-4">
            <div className="flex flex-col">
              <span className="hidden sm:block text-[10px] font-medium text-white/30">Compensation</span>
              <span className="text-[12px] sm:text-[14px] font-bold text-white">{project.compensation}</span>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="hidden min-[360px]:block bg-primary-blue/20 text-accent-soft-blue text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-1 rounded-md font-medium">
                {project.openRolesCount} open
              </div>
              <Button
                onClick={onApply}
                size="sm"
                className="bg-primary-green hover:bg-primary-green/90 text-white text-[10px] sm:text-xs font-bold rounded-full px-4 sm:px-6 py-1.5 transition-colors">
                Apply
              </Button>
              <Button variant="ghost" size="sm" className="hidden sm:flex p-1.5 h-auto min-h-0 border border-border-muted/30 rounded-full hover:bg-white/5">
                <HiShare size={14} className="text-text-muted hover:text-white transition-colors" />
              </Button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};