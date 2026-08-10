"use client";

import React, { useState } from 'react';
import { ViewApplicationModal } from '../application-modal/ViewApplication'; 
import { HiOutlineChevronRight } from 'react-icons/hi';
import Button from '@/components/ui/Button';

// Mock Data
const MY_APPLICATIONS = [
  {
    id: 'app-1',
    projectTitle: 'Neon Soul — R&B Album Production',
    role: 'Vocalist',
    dateApplied: 'Aug 8, 2026',
    status: 'Under Review',
    pitch: "I've been a session vocalist for 5 years specializing in neo-soul and R&B. I have my own home studio setup (Shure SM7B, Apollo Twin) and can deliver clean stems within 48 hours. I love the references you posted and think my tone would be a perfect fit.",
    portfolio: 'vocal_reel_2026.wav'
  },
  {
    id: 'app-2',
    projectTitle: 'Sci-Fi Short Film Scoring',
    role: 'Sound Designer',
    dateApplied: 'Aug 5, 2026',
    status: 'Submitted',
    pitch: "Huge fan of Blade Runner and Dune. I specialize in analog synthesis and creating vast, oppressive sci-fi atmospheres using a mix of Prophet-5 and granular synthesis techniques.",
    portfolio: 'https://soundcloud.com/user/scifi-textures'
  },
  {
    id: 'app-3',
    projectTitle: 'Lo-Fi Chillhop Compilation',
    role: 'Beatmaker',
    dateApplied: 'Jul 28, 2026',
    status: 'Accepted',
    pitch: "I have a catalog of unreleased lo-fi beats matching the seasonal vibe you're looking for. SP-404 heavy workflow.",
    portfolio: 'Attached: 3 Beats (MP3)'
  }
];

export function ApplicationTracker() {
  const [selectedApp, setSelectedApp] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'text-primary-green bg-primary-green/10 border-primary-green/20';
      case 'Declined': return 'text-accent-red bg-accent-red/10 border-accent-red/20';
      case 'Under Review': return 'text-accent-yellow bg-[#2A1E08] border-accent-yellow/20';
      default: return 'text-accent-blue bg-accent-blue/10 border-accent-blue/20'; // Submitted
    }
  };

  return (
    <div className="flex flex-col w-full">
      
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">My Applications</h2>
          <p className="text-sm text-text-muted mt-1">Track your pitches and project status.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {MY_APPLICATIONS.map((app) => (
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
                 View Receipt
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

        {MY_APPLICATIONS.length === 0 && (
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
      />

    </div>
  );
}