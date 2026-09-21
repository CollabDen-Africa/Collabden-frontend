"use client";

import React, { useMemo } from 'react';
import TopStatsPanel from '@/components/features/dashboard/TopStats';
import ActiveProjectsPanel from '@/components/features/dashboard/ActiveProjects';
import SuggestedProjectsPanel from '@/components/features/dashboard/SuggestedProjects';
import RecentCollaboratorActivityPanel from '@/components/features/dashboard/RecentCollaboratorActivity';
import SuggestedCollaboratorsPanel from '@/components/features/dashboard/SuggestedCollaborators';
import OnboardingTooltip from '@/components/ui/Tooltip';
import { useTour } from '@/context/TourContext';
import { useDashboard } from '@/hooks/dashboard/useDashboard';
import { handleApiError } from '@/lib/error-handler';

const formatRelativeTime = (value: string) => {
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return 'Recently';

  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));
  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
};

export default function DashboardPage() {
  // Tour state context
  const { currentStep, setStep, onSkip } = useTour();

  const { useDashboardData } = useDashboard();
  const { data: apiData, isLoading, error } = useDashboardData();

  if (error) {
    handleApiError(error);
  }

  // The dashboard endpoint returns active projects and notifications. All summary
  // values below are derived from that response so the page never falls back to
  // sample content when an account has no data.
  const topStats = useMemo(() => {
    const projects = apiData?.activeProjects ?? [];
    const collaboratorIds = new Set(
      projects.flatMap((project) =>
        (project.collaborators ?? []).map((collaborator) => collaborator.userId)
      )
    );
    const taskNotifications = (apiData?.notifications ?? []).filter(
      (notification) => notification.type === 'TASK_ASSIGNED'
    ).length;

    return [
      {
        title: 'Active Projects',
        count: projects.length,
        subtitle: projects.length === 1 ? 'project in progress' : 'projects in progress',
        orbClass: '',
      },
      {
        title: 'Task Assignments',
        count: taskNotifications,
        subtitle: taskNotifications === 1 ? 'task notification' : 'task notifications',
        orbClass: '',
      },
      {
        title: 'Collaborators',
        count: collaboratorIds.size,
        subtitle: collaboratorIds.size === 1 ? 'active collaborator' : 'active collaborators',
        orbClass: '',
      },
    ];
  }, [apiData?.activeProjects, apiData?.notifications]);

  const activeProjects = useMemo(() => {
    // Sort by updatedAt descending and take top 3
    return [...(apiData?.activeProjects ?? [])]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        title: p.name,
        genre: p.genre || "Unknown",
        tracks: p.description || "No description",
        collaborators: (p.collaborators || []).map(c => ({
          name: c.user?.email?.split("@")[0] || "User",
        })),
        progress: undefined,
        updated: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "Recently",
        status: (p.status || "ACTIVE").charAt(0) + (p.status || "ACTIVE").slice(1).toLowerCase(),
      }));
  }, [apiData?.activeProjects]);

  const recentActivity = useMemo(() => {
    return (apiData?.notifications ?? [])
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4)
      .map((notification) => ({
      id: notification.id,
      user: notification.title || 'Project update',
      action: notification.message,
      time: formatRelativeTime(notification.createdAt),
    }));
  }, [apiData?.notifications]);

  const suggestedProjects = useMemo(() => {
    return (apiData?.suggestedProjects ?? []).map((p) => ({
      id: p.id,
      title: p.name,
      needs: p.description || "",
      members: (p.collaborators || []).length,
      tags: [p.genre],
    }));
  }, [apiData?.suggestedProjects]);

  const suggestedCollaborators = useMemo(() => {
    return (apiData?.suggestedCollaborators ?? []).map((c) => ({
      id: c.id || c.userId || c.user?.id,
      userId: c.userId || c.user?.id,
      name: c.user?.email?.split("@")[0] || "User",
      role: c.role || "Collaborator",
      members: 0,
      rating: "5.0",
    }));
  }, [apiData?.suggestedCollaborators]);

  return (
    <div className="w-full flex flex-col gap-[60px] animate-in fade-in duration-500 pt-2">
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-[3px] z-100">
          <div className="h-full bg-primary-green animate-pulse rounded-full" style={{ width: '60%' }} />
        </div>
      )}

      {/* --- TOP ROW --- */}
      <div className="w-full flex flex-col xl:flex-row gap-[40px] 2xl:gap-[70px]">
        {/* Left Column */}
        <div className="flex-1 w-full flex flex-col gap-[50px] xl:max-w-[711px]">
          <TopStatsPanel stats={topStats} /> 

          {/* STEP 6 TOOLTIP: Final */}
          {currentStep === 6 && (
            <div className="w-full flex justify-center py-2 relative z-50">
              <OnboardingTooltip 
                step={6}
                title="You're all set!"
                description="Start exploring and creating on CollabDen"
                nextLabel="Start Exploring"
                direction="none"
                showArrow={false}
                isLastStep={true}
                onNext={() => onSkip?.()}
                onSkip={() => onSkip?.()}
              />
            </div>
          )}
          
          {/* Active Projects */}
          <div className={`transition-all duration-300 ${currentStep === 4 ? "relative z-50" : "relative z-10"}`}>
            <ActiveProjectsPanel 
              projects={activeProjects} 
              currentStep={currentStep}
              setStep={setStep}
              onSkip={onSkip}
            />
          </div>
        </div>
        
        {/* Right Column */}
        <div className="w-full xl:w-[413px] flex flex-col shrink-0">
          <RecentCollaboratorActivityPanel activities={recentActivity} />
        </div>
      </div>

      {/* --- BOTTOM ROW --- */}
      <div className="w-full flex flex-col xl:flex-row gap-[10px] 2xl:gap-[10px] items-stretch">
        <div className="flex-1 w-full flex flex-col xl:max-w-[700px]">
          <h3 className="text-foreground text-[23px] font-bold font-sans transform rotate-1 mb-[16px] origin-left">
            Suggested For You
          </h3>
          <SuggestedProjectsPanel projects={suggestedProjects} />
        </div>
        
        <div className="w-full xl:w-[500px] flex flex-col shrink-0">
          <SuggestedCollaboratorsPanel collaborators={suggestedCollaborators} />
        </div>
      </div>
      
    </div>
  );
}
