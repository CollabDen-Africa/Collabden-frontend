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

// MOCK DATA (fallback)
import { 
  MOCK_TOP_STATS, 
  MOCK_ACTIVE_PROJECTS, 
  MOCK_RECENT_ACTIVITY, 
  MOCK_SUGGESTED_PROJECTS, 
  MOCK_SUGGESTED_COLLABORATORS 
} from '@/lib/mockData';

export default function DashboardPage() {
  // Tour state context
  const { currentStep, setStep, onSkip } = useTour();

  const { useDashboardData } = useDashboard();
  const { data: apiData, isLoading, error } = useDashboardData();

  if (error) {
    handleApiError(error);
  }

  // Memoize transformation logic for performance and stable references
  const topStats = useMemo(() => {
    if (!apiData?.stats?.length) return MOCK_TOP_STATS;
    return apiData.stats.map(s => ({
      title: s.title,
      count: String(s.count),
      subtitle: s.subtitle,
      orbClass: "",
    }));
  }, [apiData?.stats]);

  const activeProjects = useMemo(() => {
    if (!apiData?.activeProjects?.length) return MOCK_ACTIVE_PROJECTS.slice(0, 3);
    
    // Sort by updatedAt descending and take top 3
    return [...apiData.activeProjects]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3)
      .map((p, i) => ({
        id: i + 1,
        title: p.name,
        genre: p.genre || "Unknown",
        tracks: p.description || "No description",
        collaborators: (p.collaborators || []).map(c => ({
          name: c.user?.email?.split("@")[0] || "User",
          avatarUrl: "/mock-profiles/small.png",
        })),
        progress: 0,
        updated: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "Recently",
        status: (p.status || "ACTIVE").charAt(0) + (p.status || "ACTIVE").slice(1).toLowerCase(),
      }));
  }, [apiData?.activeProjects]);

  const recentActivity = useMemo(() => {
    if (!apiData?.recentActivity?.length) return MOCK_RECENT_ACTIVITY;
    return apiData.recentActivity.map((a, i) => ({
      id: Number(a.id) || i + 1,
      user: a.user,
      action: a.action,
      time: a.time,
      avatarUrl: a.avatarUrl || "/avatar.svg",
    }));
  }, [apiData?.recentActivity]);

  const suggestedProjects = useMemo(() => {
    if (!apiData?.suggestedProjects?.length) return MOCK_SUGGESTED_PROJECTS;
    return apiData.suggestedProjects.map((p, i) => ({
      id: i + 1,
      title: p.name,
      needs: p.description || "",
      members: (p.collaborators || []).length,
      tags: [p.genre],
    }));
  }, [apiData?.suggestedProjects]);

  const suggestedCollaborators = useMemo(() => {
    if (!apiData?.suggestedCollaborators?.length) return MOCK_SUGGESTED_COLLABORATORS;
    return apiData.suggestedCollaborators.map((c, i) => ({
      id: i + 1,
      userId: c.userId || c.user?.id,
      name: c.user?.email?.split("@")[0] || "User",
      role: c.role || "Collaborator",
      members: 0,
      rating: "5.0",
      avatarUrl: "/mock-profiles/small.png",
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