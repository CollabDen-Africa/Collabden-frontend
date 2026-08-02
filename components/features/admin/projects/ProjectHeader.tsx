import React, { useState } from "react";
import { HiOutlineArchive, HiOutlinePlus } from "react-icons/hi";
import { ProjectModerationModal } from "./ProjectModerationModal";

export const ProjectHeader: React.FC<{ project: any; onAddNoteClick?: () => void }> = ({ project, onAddNoteClick }) => {
  const [isModerationModalOpen, setIsModerationModalOpen] = useState(false);

  // Calculate progress
  let progress = 0;
  if (project.status === 'COMPLETED') {
    progress = 100;
  } else if (project.startDate && project.endDate) {
    const start = new Date(project.startDate).getTime();
    const end = new Date(project.endDate).getTime();
    const now = Date.now();
    
    if (now >= end) {
      progress = 100;
    } else if (now > start) {
      progress = Math.round(((now - start) / (end - start)) * 100);
    }
  } else if (project.metadata?.progress) {
    progress = Number(project.metadata.progress);
  }

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6 border-b border-white/5">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="flex gap-5">
          {/* Project Icon */}
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
            <span className="text-2xl text-blue-500 font-bold">🎵</span>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">{project.name}</h2>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${project.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                {project.status}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5 text-white/60">
                {project.visibility}
              </span>
            </div>
            
            <p className="text-white/40 text-xs font-medium mt-1">
              PRJ-{project.id.substring(project.id.length - 4)} · {project.genre} · Created {new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>

            <p className="text-white/80 text-sm mt-4 leading-relaxed max-w-2xl">
              {project.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setIsModerationModalOpen(true)}
            disabled={project.isDeleted}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
              project.isDeleted 
                ? 'border-gray-500/30 text-gray-500 cursor-not-allowed opacity-50'
                : 'border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10'
            }`}
          >
            <HiOutlineArchive size={16} />
            {project.isDeleted ? 'Archived' : 'Archive Project'}
          </button>
          <button 
            onClick={onAddNoteClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-white text-sm font-semibold hover:bg-white/5 transition-colors"
          >
            <HiOutlinePlus size={16} />
            Add Note
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex justify-between items-center text-xs text-white/60">
          <span>Overall Progress</span>
          <span className="text-white font-bold">{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Moderation Modal */}
      <ProjectModerationModal 
        isOpen={isModerationModalOpen} 
        onClose={() => setIsModerationModalOpen(false)} 
        project={project} 
      />
    </div>
  );
};
