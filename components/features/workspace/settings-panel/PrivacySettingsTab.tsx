"use client";

import React, { useState, useEffect } from "react";
import { 
  FiLock, 
  FiGlobe, 
  FiUserPlus,
  FiCalendar
} from "react-icons/fi";
import { Project } from "@/types/api.types";
import { useProjects } from "@/hooks/projects/useProjects";
import DatePicker from "@/components/ui/DatePicker";

interface PrivacySettingsTabProps {
  project?: Project;
  onSuccess?: (message?: string) => void;
  onError?: (message: string) => void;
}

export default function PrivacySettingsTab({ project, onSuccess, onError }: PrivacySettingsTabProps) {
  const { useUpdateProject } = useProjects();
  const updateMutation = useUpdateProject(project?.id || "");

  // Local state synced with project props
  const [isPublic, setIsPublic] = useState(project?.visibility === "PUBLIC");
  const [isOpenToCollaborators, setIsOpenToCollaborators] = useState(Boolean(project?.openToCollaborators));
  const [endDate, setEndDate] = useState<Date | null>(
  project?.endDate ? new Date(project.endDate) : null
    );

  useEffect(() => {
    if (project) {
      setIsPublic(project.visibility === "PUBLIC");
      setIsOpenToCollaborators(Boolean(project.openToCollaborators));
      setEndDate(project.endDate ? new Date(project.endDate) : null);
    }
  }, [project]);

  const handleToggleVisibility = async () => {
    if (!project?.id) return;
    const nextVisibility = !isPublic;
    setIsPublic(nextVisibility);

    try {
      await updateMutation.mutateAsync({
        visibility: nextVisibility ? "PUBLIC" : "PRIVATE",
      });
      onSuccess?.(`Project visibility set to ${nextVisibility ? "Public" : "Private"}.`);
    } catch (err) {
      setIsPublic(!nextVisibility);
      console.error("Failed to update project visibility:", err);
    }
  };

  const handleToggleCollaborators = async () => {
    if (!project?.id) return;
    const nextVal = !isOpenToCollaborators;
    // If turning ON marketplace visibility, require a deadline
      if (nextVal === true && !endDate) {
        onError?.("A project deadline is required to list on the marketplace.");
          return; // Stop the toggle
        }
    setIsOpenToCollaborators(nextVal);

    try {
      await updateMutation.mutateAsync({
        openToCollaborators: nextVal,
        endDate: nextVal ? endDate?.toISOString() : undefined,
      });
      onSuccess?.(nextVal ? "Project is now open to collaborator applications." : "Project is no longer accepting collaborator applications.");
    } catch (err) {
      setIsOpenToCollaborators(!nextVal);
      console.error("Failed to update collaboration status:", err);
      onError?.("Failed to update marketplace visibility.");
    }
  };

  // Automatically update the backend when the date changes if already public
  const handleDateChange = async (date: Date | null) => {
    setEndDate(date);
      if (isOpenToCollaborators && date && project?.id) {
         try {
           await updateMutation.mutateAsync({ endDate: date.toISOString() });
           onSuccess?.("Deadline updated successfully.");
         } catch (err) {
           console.error("Failed to save deadline", err);
         }
      }
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-white/60">No active project selected.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-7 lg:gap-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-5 lg:p-6 pr-14 sm:pr-16 gap-4 bg-black/20 rounded-3xl border border-white/5 shadow-inner">
        <div className="w-13.5 h-13.5 bg-white/10 rounded-[15px] flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
          <FiLock className="text-white" size={24} />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <h2 className="font-raleway font-semibold text-[22px] lg:text-[25px] leading-7.25 text-white">
            Privacy & Visibility
          </h2>
          <p className="font-raleway font-medium text-[14px] lg:text-[16px] leading-5.25 text-white/60">
            Control access and marketplace discovery for {project.name}.
          </p>
        </div>
      </div>

      {/* Real Privacy Settings List */}
      <div className="flex flex-col gap-4 w-full">
        {/* Project Visibility Toggle */}
        <div className="flex items-center justify-between w-full bg-black/20 border border-white/5 p-4 sm:p-5 rounded-[20px] group transition-all">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-white/10 border border-white/10 rounded-[14.6px] flex items-center justify-center shrink-0 shadow-sm">
              <FiGlobe className="text-white" size={18} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-raleway font-bold text-[16px] lg:text-[18px] text-white leading-tight">
                Public Project Visibility
              </span>
              <span className="font-raleway font-normal text-[14px] lg:text-[15px] text-white/60">
                {isPublic
                  ? "Project is visible to all users on the platform."
                  : "Project is private and only accessible by invited members."}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleVisibility}
            disabled={updateMutation.isPending}
            className={`relative w-11.25 h-6.75 rounded-full p-[3px] transition-colors duration-300 shrink-0 ${
              isPublic ? "bg-primary-green" : "bg-white/20"
            } ${updateMutation.isPending ? "opacity-55 cursor-not-allowed" : ""}`}
            aria-pressed={isPublic}
          >
            <div 
              className={`w-5.25 h-5.25 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                isPublic ? "translate-x-4.5" : "translate-x-0"
              }`} 
            />
          </button>
        </div>

        {/* Deadline Date Picker - if due date is missing */}
        {!project?.endDate && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full bg-black/20 border border-white/5 p-4 sm:p-5 rounded-[20px] group transition-all">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="w-11 h-11 bg-white/10 border border-white/10 rounded-[14.6px] flex items-center justify-center shrink-0 shadow-sm">
                <FiCalendar className="text-white" size={18} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-raleway font-bold text-[16px] lg:text-[18px] text-white leading-tight">
                  Project Deadline
                </span>
                <span className="font-raleway font-normal text-[14px] lg:text-[15px] text-white/60">
                  Required before accepting applications.
                </span>
              </div>
            </div>
                  
            <div className="w-full sm:w-auto relative z-40">
              <DatePicker
                selectedDate={endDate}
                onSelect={handleDateChange}
                minDate={new Date()}
                dropdownMode="inline"
              />
            </div>
          </div>
        )}

        {/* Open to Collaborators Toggle */}
        <div className="flex items-center justify-between w-full bg-black/20 border border-white/5 p-4 sm:p-5 rounded-[20px] group transition-all">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-white/10 border border-white/10 rounded-[14.6px] flex items-center justify-center shrink-0 shadow-sm">
              <FiUserPlus className="text-white" size={18} />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-raleway font-bold text-[16px] lg:text-[18px] text-white leading-tight">
                Accept Collaborator Applications
              </span>
              <span className="font-raleway font-normal text-[14px] lg:text-[15px] text-white/60">
                Allow connected colleagues and marketplace users to discover and apply to this project.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleCollaborators}
            disabled={updateMutation.isPending}
            className={`relative w-11.25 h-6.75 rounded-full p-0.75 transition-colors duration-300 shrink-0 ${
              isOpenToCollaborators ? "bg-primary-green" : "bg-white/20"
            } ${updateMutation.isPending ? "opacity-55 cursor-not-allowed" : ""}`}
            aria-pressed={isOpenToCollaborators}
          >
            <div 
              className={`w-5.25 h-5.25 bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                isOpenToCollaborators ? "translate-x-4.5" : "translate-x-0"
              }`} 
            />
          </button>
        </div>
      </div>
    </div>
  );
}