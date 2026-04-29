"use client";

import React from "react";
import Link from "next/link";
import { HiOutlineArrowLeft } from "react-icons/hi";

interface WorkspaceSidebarProps {
  projects: string[];
  activeProject: string;
  onSelectProject: (project: string) => void;
}

export default function WorkspaceSidebar({ projects, activeProject, onSelectProject }: WorkspaceSidebarProps) {
  return (
    <aside className="w-[222px] min-h-[788px] bg-black/20 rounded-[30px] shrink-0 overflow-hidden hidden md:block">
      
      {/* Back to Dashboard Link */}
            <div className="p-4 border-b border-white/5">
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors font-sans font-medium text-[13px] px-2 py-1 rounded-md hover:bg-white/5"
              >
                <HiOutlineArrowLeft size={14} />
                Back to Dashboard
              </Link>
            </div>
      
      {/* Active Project Header Info */}
      <div className="flex flex-col gap-1 p-6 pb-4">
        <h3 className="font-semibold text-[18px] text-white">Urban Beats Vol.2</h3>
        <div className="flex items-center gap-2">
          <span className="font-medium text-[10px] text-white/60">Hip Pop</span>
          <div className="w-1 h-1 bg-white/60 rounded-full" />
          <span className="font-medium text-[10px] text-white/60">Started Mar 1st, 2026</span>
        </div>
      </div>

      {/* Project List */}
      <div className="flex flex-col py-4 gap-2">
        {projects.map((project) => {
          const isActive = activeProject === project;
          return (
            <button
              key={project}
              onClick={() => onSelectProject(project)}
              className={`relative flex items-center w-full px-5 py-4 text-left transition-colors ${
                isActive ? "bg-gradient-to-r from-primary-green/20 to-transparent" : "hover:bg-white/5"
              }`}
            >
              {/* Green Active Indicator Pillar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[6px] h-[40px] bg-primary-green rounded-r-full" />
              )}
              <span className={`font-sans font-semibold text-[18px] ${isActive ? "text-primary-green" : "text-white"}`}>
                {project}
              </span>
            </button>
          );
        })}
      </div>
      
    </aside>
  );
}