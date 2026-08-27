import Image from 'next/image';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import { HiShare, HiShieldCheck, HiLightningBolt, HiOutlineBookmark } from 'react-icons/hi';

export const ProjectGridCard = ({ project, onApply }: { project: any, onApply  : () => void }) => {
  return (
    <div className="flex flex-col bg-white/15 border border-border-muted/30 rounded-2xl overflow-hidden w-full">
      {/* Card Header Image */}
      <div className="relative h-40 w-full bg-black/15 shrink-0">
              {project.image && (
                <Image 
                  src={project.image} 
                  alt={project.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover" 
                />
              )}
        <div className="absolute inset-0 bg-linear-to-t from-black/55 to-transparent z-10" />
        <div className="absolute top-3 left-2 z-20 flex gap-1">
          {project.genres.map(genre => (
            <div key={genre} className="bg-black/50 text-text-muted text-[10px] px-2 py-0.5 rounded-full">
              {project.genres}
            </div>
          ))}
        </div>
        {project.isUrgent && (
          <div className="absolute top-3 right-3 z-20 bg-[#2A1E08]/50 text-accent-yellow text-[10px] px-2 py-0.5 rounded-full flex gap-1 items-center">
            <HiLightningBolt className="w-2 h-2" /> Deadline Soon
          </div>
        )}
        <div className="absolute bottom-3 right-3 z-20 bg-primary-green/10 text-primary-green text-[10px] px-2 py-0.5 rounded-full flex gap-1 items-center">
          <HiShieldCheck className="w-2 h-2" /> Escrow Protected
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col p-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-[14px] font-bold text-white truncate">{project.title}</h3>
          <Button variant="ghost"
            size="sm"
            className="rounded-md shrink-0">
            <HiOutlineBookmark size={16} className="text-white" />
          </Button>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1.5">
            <Avatar
              name={project.authorName}
              className="w-7 h-7 bg-accent-blue text-[10px]" />
            <span className="text-[12px] font-medium text-text-muted">{project.authorName}</span>
          </div>
          <span className="text-[10px] text-white/30">{project.postedAt}</span>
        </div>

        <p className="text-xs text-text-muted mt-3 line-clamp-2 h10">{project.description}</p>

        {/* Roles */}
        <div className="flex flex-wrap gap-1 mt-3">
          {project.roles.map(role => (
             <div key={role} className="bg-primary-blue text-accent-soft-blue text-[10px] rounded-md px-2 py-1">
               {role}
             </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="flex justify-between border-y border-border-muted/30 py-3 mt-4 px-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-semibold text-white/30 uppercase">Duration</span>
            <span className="text-[11px] font-semibold text-text-muted mt-1">{project.duration}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-semibold text-white/30 uppercase">Deadline</span>
            <span className="text-[11px] font-semibold text-text-muted mt-1">{project.deadline}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-semibold text-white/30 uppercase">Applicants</span>
            <span className="text-[11px] font-semibold text-text-muted mt-1">{project.applicants}</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-white/30">Compensation</span>
            <span className="text-[13px] font-bold text-white">{project.compensation}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="bg-primary-blue text-accent-soft-blue text-[10px] px-2 py-1 rounded-md">
              {project.openRolesCount} open
            </div>
            <Button
              onClick={onApply}
              size="sm"
              className="text-white text-xs font-semibold rounded-full px-8 py-2">
              Apply
            </Button>
            <Button variant="ghost" size="sm" className="border border-[#262626] rounded-full">
              <HiShare className="text-white/30" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}