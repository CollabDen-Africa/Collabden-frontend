"use client";

import React, { useMemo } from "react";
import Avatar from "@/components/ui/Avatar";
import { HiOutlineLockClosed, HiOutlineGlobeAlt } from "react-icons/hi";
import { useWorkspace } from "@/context/WorkspaceContext";

export default function WorkspaceOverviewPage() {
  const { activeProject, projectDetails, isLoading } = useWorkspace();

  const project = projectDetails || activeProject;

  const teamMembers = useMemo(() => {
    if (!project) return [];
    const list: { id: string; name: string; role: string; email: string; avatarUrl?: string }[] = [];

    if (project.owner) {
      const name = project.owner.displayName || project.owner.legalName || project.owner.email?.split("@")[0] || "Owner";
      list.push({
        id: project.owner.id,
        name,
        role: "Project Owner",
        email: project.owner.email,
        avatarUrl: project.owner.avatarUrl || undefined,
      });
    }

    if (project.collaborators) {
      project.collaborators.forEach((c) => {
        if (c.user && c.user.id !== project.owner?.id) {
          const name = c.user.displayName || c.user.legalName || c.user.email?.split("@")[0] || "Collaborator";
          list.push({
            id: c.id,
            name,
            role: c.role || "Collaborator",
            email: c.user.email,
            avatarUrl: c.user.avatarUrl || undefined,
          });
        }
      });
    }

    return list;
  }, [project]);

  if (isLoading && !project) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-white/20 border-t-primary-green rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/60">
        <p className="text-[16px] font-sans font-medium">No project selected.</p>
      </div>
    );
  }

  const isPrivate = (project.visibility || "PRIVATE") === "PRIVATE";
  const formattedDate = project.startDate
    ? new Date(project.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Recently";
  const statusStr = project.status || "ACTIVE";
  const statusFormatted = statusStr.charAt(0) + statusStr.slice(1).toLowerCase();

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Project Summary Card */}
      <section className="w-full bg-black/10 rounded-[30px] p-8 lg:p-[40px_32px] flex flex-col gap-4">
        <h2 className="font-sans font-bold text-[18px] text-white">Project Summary</h2>
        <p className="font-sans font-medium text-[16px] leading-[1.4] text-white/60 max-w-[1100px]">
          {project.description || "No project description provided."}
        </p>
        
        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
            <span className="font-sans font-medium text-[13px] text-white/60">Started {formattedDate}</span>
          </div>
          
          {/* Visibility Pill */}
          <div className="flex items-center gap-1.5 bg-primary-green/10 border border-primary-green rounded-full px-3 py-1.5">
            {isPrivate ? (
              <HiOutlineLockClosed size={12} className="text-white" />
            ) : (
              <HiOutlineGlobeAlt size={12} className="text-white" />
            )}
            <span className="font-sans font-medium text-[10px] text-white">
              {isPrivate ? "Private" : "Public"}
            </span>
          </div>

          {/* Genre */}
          {project.genre && (
            <div className="flex flex-col ml-2 sm:ml-4">
              <span className="font-sans font-semibold text-[16px] text-white">Genre</span>
              <span className="font-sans font-medium text-[16px] text-white/60">{project.genre}</span>
            </div>
          )}

          {/* Status */}
          <div className="flex flex-col ml-2 sm:ml-4">
            <span className="font-sans font-semibold text-[16px] text-white mb-1">Status</span>
            <div className="bg-white/10 rounded-full px-3 py-1 flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#11EA9B]">
                {statusFormatted}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Card */}
      <section className="w-full bg-black/10 rounded-[30px] p-8 lg:p-[40px_32px] flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h2 className="font-sans font-bold text-[18px] text-white">Team Members</h2>
          <span className="font-sans font-medium text-[13px] text-primary-green/60">
            {teamMembers.length} Collaborator{teamMembers.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex flex-col gap-6">
          {teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <div key={member.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
                
                {/* Avatar & Name */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <Avatar name={member.name} src={member.avatarUrl} className="w-[39px] h-[39px]" />
                  <span className="font-sans font-bold text-[16px] text-white">{member.name}</span>
                </div>

                {/* Role */}
                <div className="flex-1 md:ml-12">
                  <span className="font-sans font-medium text-[14px] text-white/60">{member.role}</span>
                </div>

                {/* Email */}
                <div className="flex-1 text-right">
                  <a href={`mailto:${member.email}`} className="font-sans font-medium text-[14px] text-white/60 underline hover:text-white transition-colors">
                    {member.email}
                  </a>
                </div>

              </div>
            ))
          ) : (
            <p className="font-sans font-medium text-[14px] text-white/40">No team members assigned yet.</p>
          )}
        </div>
      </section>

    </div>
  );
}