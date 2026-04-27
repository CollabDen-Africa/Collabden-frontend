"use client";

import React, { useContext } from 'react';
import TopStatsPanel from '../../components/dashboard/TopStats';
import ActiveProjectsPanel from '../../components/dashboard/ActiveProjects';
import SuggestedProjectsPanel from '../../components/dashboard/SuggestedProjects';
import RecentCollaboratorActivityPanel from '../../components/dashboard/RecentCollaboratorActivity';
import SuggestedCollaboratorsPanel from '../../components/dashboard/SuggestedCollaborators';
import OnboardingTooltip from '../../components/ui/Tooltip'; 
import { TourContext } from '@/context/TourContext';

// MOCK DATA
import { 
  MOCK_TOP_STATS, 
  MOCK_ACTIVE_PROJECTS, 
  MOCK_RECENT_ACTIVITY, 
  MOCK_SUGGESTED_PROJECTS, 
  MOCK_SUGGESTED_COLLABORATORS 
} from '../../../lib/mockData';

export default function DashboardPage() {
  // Tour state context
  const { currentStep, setStep, onSkip } = useContext(TourContext);

  return (
    <div className="w-full flex flex-col gap-[60px] animate-in fade-in duration-500 pt-2">
      
      {/* --- TOP ROW --- */}
      <div className="w-full flex flex-col xl:flex-row gap-[40px] 2xl:gap-[70px]">
        {/* Left Column */}
        <div className="flex-1 w-full flex flex-col gap-[50px] xl:max-w-[711px]">
          <TopStatsPanel stats={MOCK_TOP_STATS} /> 

          {/* STEP 6 TOOLTIP: Final */}
          {currentStep === 6 && (
            <div className="w-full flex justify-center py-2 relative z-[50]">
              <OnboardingTooltip 
                step={6}
                title="You’re all set!"
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
          <div className={`transition-all duration-300 ${currentStep === 4 ? "relative z-[50]" : "relative z-10"}`}>
            <ActiveProjectsPanel 
              projects={MOCK_ACTIVE_PROJECTS} 
              currentStep={currentStep}
              setStep={setStep}
              onSkip={onSkip}
            />
          </div>
        </div>
        
        {/* Right Column */}
        <div className="w-full xl:w-[413px] flex flex-col shrink-0">
          <RecentCollaboratorActivityPanel activities={MOCK_RECENT_ACTIVITY} />
        </div>
      </div>

      {/* --- BOTTOM ROW --- */}
      <div className="w-full flex flex-col xl:flex-row gap-[10px] 2xl:gap-[10px] items-stretch">
        <div className="flex-1 w-full flex flex-col xl:max-w-[700px]">
          <h3 className="text-foreground text-[23px] font-bold font-sans transform rotate-1 mb-[16px] origin-left">
            Suggested For You
          </h3>
          <SuggestedProjectsPanel projects={MOCK_SUGGESTED_PROJECTS} />
        </div>
        
        <div className="w-full xl:w-[500px] flex flex-col shrink-0">
          <SuggestedCollaboratorsPanel collaborators={MOCK_SUGGESTED_COLLABORATORS} />
        </div>
      </div>
      
    </div>
  );
}