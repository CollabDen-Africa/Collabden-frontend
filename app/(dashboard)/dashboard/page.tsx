import React from 'react';

// Modular Panel Components
import ActiveProjectsPanel from '@/app/components/dashboard/ActiveProjects';
import SuggestedProjectsPanel from '@/app/components/dashboard/SuggestedProjects';
import RecentCollaboratorActivityPanel from '@/app/components/dashboard/RecentCollaboratorActivity';
import SuggestedCollaboratorsPanel from '@/app/components/dashboard/SuggestedCollaborators';

export default function DashboardPage() {
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col xl:flex-row gap-8 pb-10 animate-in fade-in duration-500">
      
      {/* LEFT COLUMN: Core Work & Projects */}
      <div className="flex-1 flex flex-col gap-12 min-w-0">
        <ActiveProjectsPanel />
        <SuggestedProjectsPanel />
      </div>

      {/* RIGHT COLUMN: Community & Activity */}
      <div className="w-full xl:w-[450px] 2xl:w-[500px] flex flex-col gap-8 shrink-0">
        <RecentCollaboratorActivityPanel />
        <SuggestedCollaboratorsPanel />
      </div>
      
    </div>
  );
}