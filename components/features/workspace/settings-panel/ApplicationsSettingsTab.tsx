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
      <div className="w-full p-8 flex items-center justify-center">
        <p className="text-white/50 font-medium">No active project selected.</p>
      </div>
    );
  }

  const pendingApplications = applications.filter(
    (app: any) => app.status === "APPLIED" || app.status === "PENDING"
  );

  return (
    <div className="w-full max-w-232.75 animate-in fade-in slide-in-from-right-8 duration-500">
      
      <div className="flex flex-col gap-6 w-full max-w-215 mx-auto">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-primary-green/10 rounded-full flex items-center justify-center shrink-0 border border-primary-green/20">
            <FiInbox className="text-primary-green" size={22} />
          </div>
          <div>
            <h2 className="font-raleway font-bold text-[24px] text-white">Applications</h2>
            <p className="font-sans text-[14px] text-white/60">Review pitches, explore portfolios, and expand your team.</p>
          </div>
        </div>

        {/* Applications List */}
        <div className="flex flex-col w-full gap-4">
          {isLoading ? (
            <div className="w-full py-12 text-center text-white/50 text-[14px]">Loading applications...</div>
          ) : pendingApplications.length === 0 ? (
            <div className="w-full py-16 text-center flex flex-col items-center gap-3 bg-white/[0.02] border border-white/5 rounded-3xl">
              <FiInbox size={32} className="text-white/20" />
              <p className="text-white/50 font-raleway font-medium text-[15px]">
                No new applications right now.
              </p>
            </div>
          ) : (
            pendingApplications.map((app: any) => {
              const applicant = app.applicant || {};
              const applicantName = applicant.displayName || applicant.firstName || applicant.email?.split('@')[0] || "Unknown User";
              const isExpanded = expandedAppId === app.id;
              
              const skills = Array.isArray(applicant.skills) ? applicant.skills : [];
              const genres = Array.isArray(applicant.genres) ? applicant.genres : [];
              const displayTags = [...skills, ...genres].slice(0, 5);

              return (
                <div 
                  key={app.id} 
                  className={`flex flex-col w-full p-6 lg:p-7 bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-[24px] gap-6 transition-all ${reviewMutation.isPending && reviewMutation.variables?.applicationId === app.id ? "opacity-50 pointer-events-none" : "opacity-100"}`}
                >
                  {/* Top Row: User Info & Actions */}
                  <div className="flex flex-col sm:flex-row items-start justify-between w-full gap-5">
                    
                    <div className="flex items-start gap-4">
                      <Avatar name={applicantName} src={applicant.avatarUrl} className="w-12 h-12 lg:w-14 lg:h-14" />
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-3">
                          <span className="font-raleway font-bold text-[17px] lg:text-[19px] text-white leading-none">
                            {applicantName}
                          </span>
                          <span className="bg-primary-green/10 border border-primary-green/20 text-primary-green text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                            {app.role || applicant.role || "Applicant"}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 font-sans font-medium text-[12px] lg:text-[13px] text-white/50">
                          {applicant.location && (
                            <span className="flex items-center gap-1 capitalize">
                              <FiMapPin size={12} /> {applicant.location}
                            </span>
                          )}
                          {applicant.yearsOfExperience !== undefined && (
                            <span className="flex items-center gap-1">
                              <FiBriefcase size={12} /> {applicant.yearsOfExperience} yrs
                            </span>
                          )}
                          <span>{formatDate(app.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Accept / Decline Buttons - Moved to Top Right */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
                      <button 
                        onClick={() => handleDecline(app.id)}
                        disabled={reviewMutation.isPending}
                        title="Decline Application"
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-accent-red/20 text-white/50 hover:text-accent-red transition-colors disabled:opacity-50"
                      >
                        <FiX size={18} />
                      </button>
                      <button 
                        onClick={() => handleAccept(app.id)}
                        disabled={reviewMutation.isPending}
                        className="flex items-center gap-2 px-5 h-10 rounded-full bg-primary-green hover:bg-accent-green-success text-white font-sans font-bold text-[13px] transition-colors shadow-[0_4px_12px_rgba(115,191,68,0.25)] disabled:opacity-50"
                      >
                        <FiCheck size={16} />
                        Accept
                      </button>
                    </div>
                  </div>

                  {/* Main Pitch Styled as a Blockquote */}
                  <div className="w-full border-l-2 border-primary-green/50 pl-4 py-1">
                    <p className="font-raleway font-medium text-[14px] lg:text-[15px] leading-relaxed text-white/80 italic whitespace-pre-wrap">
                      &quot;{app.message || app.pitch || "I'd love to join this project."}&quot;
                    </p>
                  </div>

                  {/* Tags & Links Row */}
                  <div className="flex flex-col gap-4">
                    {displayTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {displayTags.map((tag, idx) => (
                          <span key={idx} className="bg-white/5 border border-white/10 text-white/60 px-3 py-1 rounded-full text-[11px] font-sans font-medium">
                            {tag}
                          </span>
                        ))}
                        {(skills.length + genres.length) > 5 && (
                          <span className="text-white/40 px-1 py-1 text-[11px] font-sans font-medium">
                            +{(skills.length + genres.length) - 5} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10">
                      {app.portfolioLink ? (
                        <div className="flex items-center gap-2">
                          <FiPaperclip className="text-white/40" size={14} />
                          <a 
                            href={app.portfolioLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-raleway font-semibold text-[13px] text-primary-green hover:text-white transition-colors underline underline-offset-2 break-all"
                          >
                            {app.portfolioLink}
                          </a>
                        </div>
                      ) : (
                        <div />
                      )}
                      
                      {applicant.bio && (
                        <button 
                          onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                          className="text-left font-sans font-semibold text-[12px] text-white/40 hover:text-white transition-colors"
                        >
                          {isExpanded ? "Hide Profile Bio" : "View Profile Bio"}
                        </button>
                      )}
                    </div>
                    
                    {/* Expandable Bio Section */}
                    {isExpanded && applicant.bio && (
                      <div className="mt-2 font-raleway font-medium text-[13.5px] leading-relaxed text-white/60 bg-white/5 p-4 rounded-xl border border-white/5 animate-in slide-in-from-top-2 duration-200">
                        {applicant.bio}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}