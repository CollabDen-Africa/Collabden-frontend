import React from 'react';
import SuggestedProjectItem from './SuggestedProjectsItem';

// Data structure
export interface SuggestedProject {
  id: number;
  title: string;
  needs: string;
  members: number;
  tags: string[];
}


export default function SuggestedProjectsPanel({ projects = [] }: { projects?: SuggestedProject[] }) {
  return (
    <section className="flex flex-col gap-[32px] md:gap-[48px] w-full max-w-[615px] bg-black/10 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md rounded-[30px] p-[28px] xl:p-[32px]">
      <h2 className="font-semibold text-[18px] leading-[21px] text-foreground">
        Suggested Projects
      </h2>
      
      <div className="flex flex-col gap-[32px] md:gap-[48px]">
        {projects.map((project) => (
          <SuggestedProjectItem key={project.id} {...project} />
        ))}
        
        {/* Empty Array */}
        {projects.length === 0 && (
          <p className="text-foreground/40 text-sm italic">
            No suggested projects at this time.
          </p>
        )}
      </div>
      
    </section>
  );
}