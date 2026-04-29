"use client";

import React from 'react';
import Link from 'next/link';
import ProjectCard, { ProjectCollaborator } from './ProjectCard';
import OnboardingTooltip from '../ui/Tooltip'; 

// Active Project data structure
export interface ActiveProject {
  id: number;
  title: string;
  genre: string;
  tracks: string;
  collaborators: ProjectCollaborator[];
  progress: number;
  updated: string;
  status?: string;
}

export default function ActiveProjectsPanel({ 
  projects = [],
  currentStep, 
  setStep,
  onSkip 
}: { 
  projects: ActiveProject[];
  currentStep?: number;
  setStep?: (s: number) => void;
  onSkip?: () => void;
}) {
  return (
    <section className="flex flex-col gap-[16px] w-full max-w-[684px] md:ml-[53px]">
      
      {/* Header */}
      <div className="relative flex justify-between items-center w-full mb-2">
        <h2 className="font-bold text-[23px] text-foreground leading-none">
          Active Projects
        </h2>
        
        <div className="rounded-[50px] px-[15px] py-[8px] flex items-center justify-center hover:bg-white/5 transition-colors">
          <Link 
            href="/projects" 
            className="font-semibold text-[16px] text-primary-green drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)]"
          >
            View all
          </Link>
        </div>

        {/* STEP 4 TOOLTIP */}
        {currentStep === 4 && (
          <OnboardingTooltip 
            step={4}
            title="Your projects live here"
            description="Track projects, manage tasks, and stay updated on your work"
            onNext={() => setStep?.(5)}
            onSkip={() => onSkip?.()}
            direction="above"
            arrowOffset="85%"
          />
        )}
      </div>
      
      {/* List Wrapper */}
      <div className="flex flex-col gap-[16px] w-full max-w-[670px] bg-black/10 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md rounded-[30px] p-[20px] lg:p-[32px]">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))
        ) : (
          <p className="text-foreground/40 text-center py-4">No active projects yet.</p>
        )}
      </div>
      
    </section>
  );
}