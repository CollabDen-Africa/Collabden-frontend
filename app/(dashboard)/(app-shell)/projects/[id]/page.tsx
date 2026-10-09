"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { HiArrowLeft, HiOutlineClock, HiOutlineUserGroup, HiOutlineCurrencyDollar } from "react-icons/hi";
import { useProjects } from "@/hooks/projects/useProjects";
import { useAuth } from "@/context/AuthContext";
import { handleApiError } from "@/lib/error-handler";
import { ApplicationModalManager } from "@/components/features/marketplace/project-marketplace/application-modal/ApplicationModalManager";

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [applyingProject, setApplyingProject] = useState<any>(null);

  const { useProjectDetail } = useProjects();
  const { data: project, isLoading, error } = useProjectDetail(id);

  const isOwnerOrMember = React.useMemo(() => {
    if (!project || !user?.id) return false;
    if (project.ownerId === user.id || project.owner?.id === user.id) return true;
    return (project.collaborators || []).some((c: any) => c.userId === user.id || c.user?.id === user.id);
  }, [project, user]);

  React.useEffect(() => {
    if (project && isOwnerOrMember) {
      router.replace(`/workspace?projectId=${id}`);
    }
  }, [project, isOwnerOrMember, id, router]);

  if (error) {
    handleApiError(error);
  }

  if (isLoading || !project) {
    return (
      <div className="w-full max-w-5xl mx-auto flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-white/20 border-t-primary-green rounded-full animate-spin" />
      </div>
    );
  }

  const p = project as any;

  const mappedProjectForModal = {
    id: project.id,
    title: project.name,
    description: project.description || 'No description provided.',
    genres: project.genre ? [project.genre] : [],
    roles: p.requiredRoles || [],
    compensation: p.budget !== null && p.budget !== undefined ? `${p.pricingType === 'hourly' ? '' : 'Budget '}₦${Number(p.budget).toLocaleString()}` : 'Not specified',
    duration: project.startDate && p.endDate ? `${new Date(project.startDate).toLocaleDateString()} – ${new Date(p.endDate).toLocaleDateString()}` : 'Not specified',
    deadline: p.endDate ? new Date(p.endDate).toLocaleDateString() : 'Not specified',
    applicants: p._count?.applications || 0,
    authorName: project.owner?.displayName || project.owner?.legalName || project.owner?.email?.split('@')[0] || 'Project owner',
    authorInitials: (project.owner?.displayName || project.owner?.legalName || project.owner?.email || 'PO').slice(0, 2).toUpperCase(),
    postedAt: project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Recently',
    openRolesCount: p.requiredRoles?.length || 0,
    badge: project.genre || 'Project',
    openRoles: `${p.requiredRoles?.length || 0} position(s)`,
    image: '',
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 py-8 px-4 animate-in fade-in duration-300">
      
      <ApplicationModalManager 
        isOpen={!!applyingProject} 
        onClose={() => setApplyingProject(null)} 
        project={applyingProject} 
      />

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="self-start flex items-center gap-2 text-white/60 hover:text-white transition-colors"
      >
        <HiArrowLeft size={18} />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* Main Project Overview Card */}
      <div className="flex flex-col bg-[#141414] border border-border-muted/40 rounded-3xl overflow-hidden p-6 sm:p-10 gap-8">
        
        {/* Header Title & Badges */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-primary-green uppercase tracking-wider bg-primary-green/10 border border-primary-green/30 px-3 py-1 rounded-full">
              Public Marketplace Project
            </span>
            {project.genre && (
              <span className="text-xs font-medium text-text-muted bg-white/10 px-3 py-1 rounded-full">
                {project.genre}
              </span>
            )}
            {project.openToCollaborators && (
              <span className="text-xs font-medium text-white/80 bg-white/10 px-3 py-1 rounded-full">
                Accepting Pitches
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">{project.name}</h1>

          <div className="flex items-center gap-3 mt-1">
            <Avatar name={mappedProjectForModal.authorName} className="w-8 h-8 bg-accent-blue text-xs font-bold" />
            <span className="text-sm font-medium text-text-muted">{mappedProjectForModal.authorName}</span>
            <span className="text-xs text-white/30">• Created {mappedProjectForModal.postedAt}</span>
          </div>
        </div>

        {/* Overview Box */}
        <div className="flex flex-col gap-3 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-white/50">Project Overview</h2>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed whitespace-pre-line">
            {project.description || "No description provided."}
          </p>
        </div>

        {/* Roles Needed */}
        {p.requiredRoles && p.requiredRoles.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/50">Roles Needed</h2>
            <div className="flex flex-wrap gap-2">
              {p.requiredRoles.map((role: string) => (
                <div key={role} className="bg-primary-blue/20 border border-primary-blue/40 text-accent-soft-blue text-xs font-semibold px-3.5 py-1.5 rounded-lg">
                  {role}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Key Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col bg-white/5 border border-white/10 p-4 rounded-xl">
            <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1">
              <HiOutlineCurrencyDollar size={14} /> Compensation
            </span>
            <span className="text-sm font-bold text-white mt-1.5">{mappedProjectForModal.compensation}</span>
          </div>

          <div className="flex flex-col bg-white/5 border border-white/10 p-4 rounded-xl">
            <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1">
              <HiOutlineClock size={14} /> Duration
            </span>
            <span className="text-sm font-bold text-white mt-1.5">{mappedProjectForModal.duration}</span>
          </div>

          <div className="flex flex-col bg-white/5 border border-white/10 p-4 rounded-xl">
            <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1">
              <HiOutlineClock size={14} /> Deadline
            </span>
            <span className="text-sm font-bold text-white mt-1.5">{mappedProjectForModal.deadline}</span>
          </div>

          <div className="flex flex-col bg-white/5 border border-white/10 p-4 rounded-xl">
            <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1">
              <HiOutlineUserGroup size={14} /> Applicants
            </span>
            <span className="text-sm font-bold text-white mt-1.5">{mappedProjectForModal.applicants} pitched</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-2">
          <Button
            variant="ghost"
            onClick={() => router.push("/marketplace")}
            className="text-white/70 hover:text-white border border-white/10 rounded-full px-6 py-2.5 text-sm"
          >
            Explore Marketplace
          </Button>

          <Button
            onClick={() => setApplyingProject(mappedProjectForModal)}
            className="bg-primary-green hover:bg-primary-green/90 text-white font-bold rounded-full px-8 py-2.5 text-sm transition-all shadow-lg"
          >
            Apply to Collaborate
          </Button>
        </div>

      </div>

    </div>
  );
}
