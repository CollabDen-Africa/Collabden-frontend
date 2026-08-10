"use client";

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { ViewApplicationModal } from '../features/marketplace/project-marketplace/application-modal/ViewApplication'; 
import { ApplicationTracker } from '../features/marketplace/project-marketplace/ui-parts/ApplicationTracker';

// Mock data
const PAGE_NOTIFICATIONS = [
  {
    id: '1',
    group: 'Today',
    items: [
      {
        id: '1-1',
        title: 'Application Accepted!',
        message: "Congratulations! You've been accepted into Parallax - Electronic Concept EP.",
        time: '2h ago',
        icon: 'ZO',
        iconBg: 'bg-[#1A2E14]',
        actionText: 'Open Workspace',
        isUnread: false,
      },
      {
        id: '1-2',
        title: 'Application Viewed',
        message: 'Marcus Webb viewed your application for Neon Soul - R&B Album Production.',
        time: '4h ago',
        icon: 'MW',
        iconBg: 'bg-[#1A2A4A]',
        actionText: 'View Application',
        isUnread: true,
      },
      {
        id: '1-3',
        title: 'Deadline Reminder',
        message: 'Applications for Folklore Roots close in 12 hours. Don&apos;t miss out.',
        time: '6h ago',
        icon: '',
        iconBg: 'bg-[#2A1E08]',
        actionText: 'View Project',
        isUnread: true,
      }
    ]
  },
  {
    id: '2',
    group: 'Yesterday',
    items: [
      {
        id: '2-1',
        title: 'New Application Received',
        message: 'Aisha Bello applied for the Beatmaker role on CityPulse.',
        time: 'Yesterday, 11:05 AM',
        icon: 'DC',
        iconBg: 'bg-[#1E1E1E]',
        actionText: 'View Application',
        isUnread: true,
      },
      {
        id: '2-2',
        title: 'Application Update',
        message: 'Priya Nair is currently reviewing your application for Folklore Roots.',
        time: 'Yesterday, 3:22 PM',
        icon: 'PN',
        iconBg: 'bg-[#2A1E08]',
        actionText: 'Track Status',
        isUnread: false, // Assume read 
      }
    ]
  },
  {
    id: '3',
    group: 'Earlier This Week',
    items: [
      {
        id: '3-1',
        title: 'Application Withdrawn',
        message: 'Jordan Davis withdrew their application from Aurora - Ambient Meditation Series.',
        time: 'Mon, 9:14 AM',
        icon: 'LH',
        iconBg: 'bg-[#1E1E1E]',
        isUnread: false,
      },
      {
        id: '3-2',
        title: 'Application Submitted',
        message: 'Your application for Aurora — Ambient Meditation Series has been submitted successfully.',
        time: 'Mon, 8:50 AM',
        icon: '',
        iconBg: 'bg-[#1A2A4A]',
        actionText: 'Track Application',
        isUnread: true,
      },
      {
        id: '3-3',
        title: 'Application Update',
        message: 'Your application for CityPulse — Hip-Hop Collaborative Album was not selected this time.',
        time: 'Sun, 2:30 PM',
        icon: 'DC',
        iconBg: 'bg-[#1E1E1E]',
        actionText: 'Browse Similar',
        isUnread: true,
      }
    ]
  }
];

export default function NotificationsPage() {
  // State to control the visibility of the components
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showTracker, setShowTracker] = useState(false);
  
    const totalUnread = PAGE_NOTIFICATIONS.flatMap(g => g.items).filter(n => n.isUnread).length;
  
    // Helper function to handle the button clicks based on the action text
    const handleActionClick = (actionText, notif) => {
      if (actionText === 'View Application') {
        // Mocking the application data payload expected by the modal
        setSelectedApplication({
          projectTitle: notif.title,
          role: 'Applicant',
          status: 'Submitted',
          dateApplied: notif.time,
          pitch: notif.message,
        });
      } else if (actionText === 'Track Status' || actionText === 'Track Application') {
        setShowTracker(true);
      }
    };
  
    // If "Track Application" is clicked, render the tracker dashboard
    if (showTracker) {
      return (
        <div className="w-full max-w-300 mx-auto p-6 md:p-12.75">
          <button 
            onClick={() => setShowTracker(false)}
            className="mb-6 text-sm text-text-muted hover:text-white hover:underline"
          >
            ← Back to Notifications
          </button>
          <ApplicationTracker />
        </div>
      );
    }

  return (
    <div className="w-full max-w-300 mx-auto flex flex-col items-start px-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end w-full mb-11 gap-6">
        <div className="flex flex-col">
          <h1 className="text-[41px] font-extrabold text-white tracking-tight">
            Notifications
          </h1>
          <p className="pt-2 text-lg font-bold text-text-muted leading-8.25">
            {totalUnread} unread notifications
          </p>
        </div>
        
        <button className="flex justify-center items-center px-7 py-2 border-[3px] border-border-muted/30 rounded-full hover:bg-white/5 transition-colors">
          <span className="text-[16px] font-semibold text-white/50 text-center leading-7">
            Mark all as read
          </span>
        </button>
      </div>

      {/* Grouped Notifications */}
      <div className="flex flex-col w-full gap-11">
        {PAGE_NOTIFICATIONS.map((group) => (
          <div key={group.id} className="flex flex-col w-full">
            
            {/* Group Title (e.g., TODAY) */}
            <h2 className="font-bold text-white/[0.28] uppercase tracking-[1.2px] mb-4">
              {group.group}
            </h2>
            
            {/* Cards List */}
            <div className="flex flex-col gap-3.25 w-full">
              {group.items.map((notif) => (
                <div 
                  key={notif.id} 
                  className="relative flex flex-col md:flex-row items-start p-5.5 md:px-7 gap-5.5 w-full bg-black/15 border border-border-muted/30 rounded-[22.3px] hover:border-primary-green/50 transition-colors"
                >
                  
                  {/* Left Icon/Avatar */}
                  <div className={`flex justify-center items-center w-14 h-14 rounded-full shrink-0 ${notif.iconBg}`}>
                    <span className="text-[14px] md:text-[15.5px] font-bold text-white leading-none">
                      {notif.icon}
                    </span>
                  </div>

                  {/* Center Content */}
                  <div className="flex flex-col flex-1 w-full min-w-0">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full mb-1">
                      <h3 className="text-[16.7px] font-bold text-white leading-7.75">
                        {notif.title}
                      </h3>
                      <span className="text-[14.5px] font-normal text-text-muted leading-6.5 md:text-right mt-1 md:mt-0">
                        {notif.time}
                      </span>
                    </div>
                    
                    <p className="text-[14.7px] font-normal text-text-muted/90 leading-8 line-clamp-2 md:line-clamp-1 max-w-212.5 mb-3">
                      {notif.message}
                    </p>

                    {/* Action Button */}
                    {notif.actionText && (
                      <div className="mt-1">
                        <Button
                          onClick={() => handleActionClick(notif.actionText, notif)}
                          className="font-semibold px-6 py-2 rounded-full h-10.5">
                          {notif.actionText}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Unread Indicator */}
                  {notif.isUnread && (
                    <div className="absolute right-6 bottom-6 md:bottom-auto md:top-[50%] md:-translate-y-1/2 w-2.75 h-2.75 bg-accent-blue rounded-full" />
                  )}

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <ViewApplicationModal 
              isOpen={!!selectedApplication} 
              onClose={() => setSelectedApplication(null)} 
              application={selectedApplication} 
            />
      
    </div>
  );
}