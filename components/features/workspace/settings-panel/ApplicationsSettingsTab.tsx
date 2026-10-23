"use client";

import React, { useState } from "react";
import { FiInbox, FiCheck, FiX, FiPaperclip, FiMapPin, FiBriefcase } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import { Project } from "@/types/api.types";
import { useProjects } from "@/hooks/projects/useProjects";

interface ApplicationsSettingsTabProps {
  project?: Project;
  onSuccess?: (msg: string) => void;
  onError?: (errMsg: string) => void
}

const formatDate = (value?: string) => {
  if (!value) return "Recently";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Recently"
    : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
};

export default function ApplicationsSettingsTab({
  project,
  onSuccess,
  onError
}: ApplicationsSettingsTabProps) {
  const { useProjectApplications, useReviewApplication } = useProjects();
  
  const projectId = project?.id || "";
  const { data: applications = [], isLoading } = useProjectApplications(projectId);
  const reviewMutation = useReviewApplication(projectId);

  // Track expanded state for long bios/pitches
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  const handleAccept = async (applicationId: string) => {
    if (confirm("Accept this application? They will be added to the project as a collaborator.")) {
      try {
        await reviewMutation.mutateAsync({ applicationId, status: "ACCEPTED" });
        onSuccess?.("Application accepted successfully.");
      } catch (error: any) {
          onError?.(error.message || "Failed to accept application.");
        }
    }
  };

  const handleDecline = async (applicationId: string) => {
    if (confirm("Are you sure you want to decline this application?")) {
      try {
      await reviewMutation.mutateAsync({ applicationId, status: "DECLINED" });
      onSuccess?.("Application declined.");
      } catch (error: any) {
          onError?.(error.message || "Failed to decline application.");
        }
    }
  };

  if (!project) {
    return (
      <div className="w-full max-w-232.75 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] lg:rounded-[50px] p-8 lg:p-12 shadow-2xl flex items-center justify-center">
        <p className="text-white/60">No active project selected.</p>
      </div>
    );
  }

  const pendingApplications = applications.filter(
    (app: any) => app.status === "APPLIED" || app.status === "PENDING"
  );

  return (
    <div className="w-full max-w-232.75 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] lg:rounded-[50px] p-8 lg:p-12 shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500">
      
      <div className="flex flex-col gap-8 w-full max-w-215">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center p-5 lg:p-6 gap-4 bg-black/10 rounded-[30px] border border-white/5 shadow-inner">
          <div className="w-13.5 h-13.5 bg-white/20 rounded-[15px] flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
            <FiInbox className="text-white" size={24} />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <h2 className="font-raleway font-semibold text-[22px] lg:text-[25px] leading-7.25 text-white">
              Applications
            </h2>
            <p className="font-raleway font-medium text-[15px] lg:text-[18px] leading-5.25 text-white/60">
              Review pitches, explore portfolios, and expand your team.
            </p>
          </div>
        </div>

        {/* Applications List */}
        <div className="flex flex-col w-full gap-6 mt-2">
          
          {isLoading ? (
            <div className="w-full py-12 text-center text-white/60">Loading applications...</div>
          ) : pendingApplications.length === 0 ? (
            <div className="w-full py-12 text-center flex flex-col items-center gap-3">
              <FiInbox size={32} className="text-white/20" />
              <p className="text-white/50 font-raleway font-medium">
                No new applications right now.
              </p>
            </div>
          ) : (
            pendingApplications.map((app: any) => {
              const applicant = app.applicant || {};
              const applicantName = applicant.displayName || applicant.firstName || applicant.email?.split('@')[0] || "Unknown User";
              const isExpanded = expandedAppId === app.id;
              
              // Safe fallbacks for tags
              const skills = Array.isArray(applicant.skills) ? applicant.skills : [];
              const genres = Array.isArray(applicant.genres) ? applicant.genres : [];
              const displayTags = [...skills, ...genres].slice(0, 5); // Show up to 5 combined tags

              return (
                <div 
                  key={app.id} 
                  className={`flex flex-col w-full p-5 lg:p-7 bg-black/15 border border-white/5 rounded-3xl gap-5 transition-opacity ${reviewMutation.isPending && reviewMutation.variables?.applicationId === app.id ? "opacity-50 pointer-events-none" : "opacity-100"}`}
                >
                  {/* Top Row: User Info & Actions */}
                  <div className="flex flex-col sm:flex-row items-start justify-between w-full gap-4 sm:gap-0">
                    
                    <div className="flex items-start gap-4">
                      <Avatar name={applicantName} src={applicant.avatarUrl} className="w-14 h-14" />
                      <div className="flex flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-raleway font-bold text-[18px] text-white">
                            {applicantName}
                          </span>
                          <span className="bg-primary-green/20 border border-primary-green/30 text-primary-green text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            {app.role || applicant.role || "Applicant"}
                          </span>
                        </div>
                        
                        {/* Meta Data Row */}
                        <div className="flex flex-wrap items-center gap-4 font-sans font-medium text-[13px] text-white/50">
                          {applicant.location && (
                            <span className="flex items-center gap-1 capitalize">
                              <FiMapPin size={12} /> {applicant.location}
                            </span>
                          )}
                          {applicant.yearsOfExperience !== undefined && (
                            <span className="flex items-center gap-1">
                              <FiBriefcase size={12} /> {applicant.yearsOfExperience} yrs exp
                            </span>
                          )}
                          <span>Applied {formatDate(app.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Accept / Decline Buttons */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t border-white/5 sm:border-none mt-2 sm:mt-0">
                      <button 
                        onClick={() => handleDecline(app.id)}
                        disabled={reviewMutation.isPending}
                        className="w-10.5 h-10.5 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors border border-transparent hover:border-red-500/30 disabled:opacity-50"
                      >
                        <FiX size={20} />
                        Decline
                      </button>
                      <button 
                        onClick={() => handleAccept(app.id)}
                        disabled={reviewMutation.isPending}
                        className="flex items-center gap-2 px-5 h-10.5 rounded-full bg-primary-green hover:bg-accent-green-success text-white font-sans font-bold text-[14px] transition-colors shadow-[0_4px_14px_rgba(115,191,68,0.3)] disabled:opacity-50"
                      >
                        <FiCheck size={18} />
                        Accept
                      </button>
                    </div>
                  </div>

                  {/* Skills/Genres Tags */}
                  {displayTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {displayTags.map((tag, idx) => (
                        <span key={idx} className="bg-white/5 border border-white/10 text-white/70 px-3 py-1 rounded-full text-[12px] font-sans font-medium">
                          {tag}
                        </span>
                      ))}
                      {(skills.length + genres.length) > 5 && (
                        <span className="bg-transparent border border-white/10 text-white/40 px-3 py-1 rounded-full text-[12px] font-sans font-medium">
                          +{(skills.length + genres.length) - 5} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Main Pitch / Message */}
                  <div className="w-full bg-black/20 rounded-2xl p-5 border border-white/5">
                    <span className="block font-sans font-semibold text-[13px] text-primary-green/80 mb-2 uppercase tracking-wider">
                      Applicant&apos;s Message
                    </span>
                    <p className="font-raleway font-medium text-[15px] leading-relaxed text-white/80 whitespace-pre-wrap">
                      {app.message || app.pitch || "No specific message provided."}
                    </p>
                  </div>

                  {/* Expandable Bio Section */}
                  {applicant.bio && (
                    <div className="w-full flex flex-col">
                      <button 
                        onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                        className="text-left font-sans font-semibold text-[13px] text-white/40 hover:text-white transition-colors"
                      >
                        {isExpanded ? "- Hide Full Profile Bio" : "+ View Full Profile Bio"}
                      </button>
                      
                      {isExpanded && (
                        <div className="mt-3 font-raleway font-medium text-[14px] leading-relaxed text-white/60 bg-white/5 p-4 rounded-xl border border-white/5 animate-in slide-in-from-top-2 duration-200">
                          {applicant.bio}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Portfolio Links (if any) */}
                  {app.portfolioLink && (
                    <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                      <span className="font-sans font-semibold text-[13px] text-white/40 uppercase tracking-wide">
                        Attached Links
                      </span>
                      <div className="flex items-center gap-2">
                        <FiPaperclip className="text-white/40" size={14} />
                        <a 
                          href={app.portfolioLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-raleway font-semibold text-[14px] text-primary-green hover:text-white transition-colors underline underline-offset-2 break-all"
                        >
                          {app.portfolioLink}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
          
        </div>

      </div>
    </div>
  );
}