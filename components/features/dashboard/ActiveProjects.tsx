"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProjectCard, { ProjectCollaborator } from './ProjectCard';
import OnboardingTooltip from '@/components/ui/Tooltip'; 
import EmptyState from '@/components/ui/EmptyState';

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
  isVerified = false,
  currentStep, 
  setStep,
  onSkip 
}: { 
  projects: ActiveProject[];
  isVerified?: boolean;
  currentStep?: number;
  setStep?: (s: number) => void;
  onSkip?: () => void;
  }) {

  const router = useRouter();
  const hasProjects = projects.length > 0;
  const showViewAll = hasProjects && isVerified;

  // Folder SVG for the empty state
    const FolderIcon = (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      </svg>
    );
  
  return (
    <section className="flex flex-col gap-4 w-full max-w-171 md:ml-13.25">
      
      {/* Header */}
      <div className="relative flex justify-between items-center w-full mb-2">
        <h2 className="font-bold text-[23px] text-foreground leading-none">
          Active Projects
        </h2>
        
        {/* Only show 'View All' if there are projects AND user is verified */}
        {showViewAll && (
            <div className="rounded-[50px] px-3.75 py-2 flex items-center justify-center hover:bg-white/5 transition-colors">
                <Link href="/projects" 
                      className="font-semibold text-[16px] text-primary-green drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)]"
                    >
                      View all
                </Link>
            </div>
         )}

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
      
      {/* List Wrapper or Empty State */}
      {hasProjects ? (
        <div className="flex flex-col gap-4 w-full max-w-167.5 bg-black/10 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md rounded-[30px] p-5 lg:p-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={FolderIcon}
                title="No Active Projects"
                description="You haven't started or joined any projects yet. Create one to begin collaborating."
                actionLabel="Create New Project"
                onAction={() => router.push('/projects/new')}
                disabled={!isVerified} // Dulls out the button if unverified
              />
            )}
      
    </section>
  );
}