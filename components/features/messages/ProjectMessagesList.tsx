"use client";

import React from "react";
import Avatar from "@/components/ui/Avatar";
import { FiHeadphones } from "react-icons/fi";
import { useRouter } from "next/navigation";

export interface ProjectMessageItem {
  id: string;
  name: string;
  genre: string;
  trackCount: number;
  collaborators: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
  }[];
  unreadCount: number;
}

interface ProjectMessagesListProps {
  projects: ProjectMessageItem[];
  isLoading?: boolean;
  onSelectProject?: (projectId: string) => void;
  className?: string;
}

export default function ProjectMessagesList({
  projects,
  isLoading = false,
  onSelectProject,
  className = "",
}: ProjectMessagesListProps) {
  const router = useRouter();

  const handleProjectClick = (projectId: string) => {
    if (onSelectProject) {
      onSelectProject(projectId);
    } else {
      router.push(`/workspace/messages?projectId=${projectId}`);
    }
  };

  return (
    <div
      className={`flex flex-col bg-[#1A2328]/90 border border-white/10 rounded-[32px] p-5 sm:p-6 shadow-2xl backdrop-blur-md overflow-hidden ${className}`}
    >
      {/* Title Header */}
      <div className="flex items-center justify-between pb-4 mb-2 shrink-0">
        <h2 className="font-raleway font-semibold text-lg sm:text-xl text-white/90 tracking-tight">
          Project Messages
        </h2>
        {projects.length > 0 && (
          <span className="text-xs text-white/40 font-medium">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </span>
        )}
      </div>

      {/* Projects List */}
      <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar gap-3.5 pr-1 pb-2 min-h-0">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-6 h-6 border-2 border-white/20 border-t-primary-green rounded-full animate-spin" />
            <span className="text-xs text-white/40">
              Loading project messages...
            </span>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mb-3">
              <FiHeadphones size={24} />
            </div>
            <p className="text-sm font-semibold text-white/80">
              No active project conversations
            </p>
            <p className="text-xs text-white/40 mt-1 max-w-xs">
              Projects with messages will appear here.
            </p>
          </div>
        ) : (
          projects.map((project) => (
            <button
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 rounded-[24px] p-4 sm:p-4.5 flex flex-col gap-3 transition-all duration-200 text-left relative cursor-pointer shadow-md hover:shadow-xl active:scale-[0.99] w-full shrink-0"
            >
              <div className="flex items-start justify-between gap-3 w-full">
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-primary-green rounded-[12px] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                    <FiHeadphones className="text-white" size={20} />
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-raleway font-bold text-sm sm:text-base text-white truncate group-hover:text-primary-green transition-colors">
                      {project.name}
                    </span>
                    <span className="font-raleway text-xs text-white/60 mt-0.5 truncate">
                      {project.genre} • {project.trackCount}{" "}
                      {project.trackCount === 1 ? "track" : "tracks"} in
                      progress
                    </span>
                  </div>
                </div>

                {project.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary-green text-black font-bold text-[11px] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    {project.unreadCount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 pl-[52px] sm:pl-[58px]">
                <div className="flex items-center">
                  {project.collaborators.length > 0 ? (
                    project.collaborators.slice(0, 4).map((c, i) => (
                      <div
                        key={c.id || i}
                        className="w-5.5 h-5.5 rounded-full border-[1.5px] border-[#1A2328] overflow-hidden relative -ml-2 first:ml-0 shadow-sm"
                        style={{ zIndex: 10 - i }}
                      >
                        <Avatar
                          name={c.displayName}
                          src={c.avatarUrl}
                          className="w-full h-full object-cover text-[9px] font-bold"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="w-5.5 h-5.5 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-[10px] text-white/50">
                      —
                    </div>
                  )}
                </div>
                <span className="font-raleway font-medium text-xs text-white/60 ml-1">
                  {project.collaborators.length}{" "}
                  {project.collaborators.length === 1
                    ? "collaborator"
                    : "collaborators"}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
