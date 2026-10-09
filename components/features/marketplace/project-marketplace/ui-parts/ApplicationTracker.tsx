"use client";

import React, { useState } from 'react';
import { ViewApplicationModal } from '../application-modal/ViewApplication'; 
import { HiOutlineChevronRight } from 'react-icons/hi';
import Button from '@/components/ui/Button';
import { useProjects } from '@/hooks/projects/useProjects';

export function ApplicationTracker() {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const { useMyApplications } = useProjects();
  const { data: myApps = [], isLoading, refetch } = useMyApplications();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Accepted':
      case 'ACCEPTED':
        return 'text-primary-green bg-primary-green/10 border-primary-green/20';
      case 'Declined':
      case 'DECLINED':
      case 'REJECTED':
        return 'text-accent-red bg-accent-red/10 border-accent-red/20';
      case 'Cancelled':
      case 'CANCELLED':
        return 'text-text-muted bg-white/10 border-white/20';
      case 'Under Review':
      case 'APPLIED':
        return 'text-accent-yellow bg-[#2A1E08] border-accent-yellow/20';
      default:
        return 'text-accent-blue bg-accent-blue/10 border-accent-blue/20';
    }
  };

  const applicationsList = Array.isArray(myApps)
    ? myApps.map((app: any) => ({
        id: app.id,
        rawId: app.id,
        rawStatus: app.status,
        projectTitle: app.project?.name || 'Project Application',
        role: app.project?.genre || 'Collaborator',
        dateApplied: app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recently',
        status: app.status === 'APPLIED' ? 'Under Review' : app.status === 'ACCEPTED' ? 'Accepted' : app.status === 'REJECTED' ? 'Declined' : app.status === 'CANCELLED' ? 'Cancelled' : app.status,
        pitch: app.pitch || app.message || '',
        portfolio: app.portfolioLink || (app.applicant?.portfolioLinks?.[0] || ''),
      }))
    : [];

  return (
    <div className="flex flex-col w-full">
      
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">My Applications</h2>
          <p className="text-sm text-text-muted mt-1">Track your pitches and project status.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-6 h-6 border-2 border-white/20 border-t-primary-green rounded-full animate-spin" />
          </div>
        ) : applicationsList.map((app: any) => (
          <div 
            key={app.id} 
            className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white/10 border border-border-muted/30 rounded-2xl hover:border-accent-blue/50 transition-colors group cursor-pointer"
            onClick={() => setSelectedApp(app)}
          >
            
            {/* Left Info */}
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-[16px] font-bold text-white truncate group-hover:text-accent-blue transition-colors">
                  {app.projectTitle}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-text-muted">
                <span className="font-medium text-white/70">{app.role}</span>
                <span className="w-1 h-1 bg-border-muted rounded-full" />
                <span>Applied {app.dateApplied}</span>
              </div>
            </div>

            {/* Right Action */}
            <div className="hidden md:flex items-center ml-6 shrink-0">
               <Button variant="ghost" size="sm" className="text-text-muted hover:text-white border border-border-muted/30 rounded-full px-4">
                 View Details
               </Button>
            </div>

            {/* Mobile Action Arrow */}
            <div className="md:hidden flex justify-end mt-4 pt-4 border-t border-border-muted/20">
              <span className="flex items-center gap-1 text-[12px] font-semibold text-accent-blue">
                View Details <HiOutlineChevronRight />
              </span>
            </div>

          </div>
        ))}

        {!isLoading && applicationsList.length === 0 && (
          <div className="text-center p-12 bg-white/5 border border-border-muted/30 rounded-2xl">
            <p className="text-text-muted text-[14px]">You haven&apos;t submitted any applications yet.</p>
          </div>
        )}
      </div>

      {/* Renders the modal on top when an application is clicked */}
      <ViewApplicationModal 
        isOpen={!!selectedApp} 
        onClose={() => setSelectedApp(null)} 
        application={selectedApp}
        onCancelled={() => refetch()}
      />

    </div>
  );
}
