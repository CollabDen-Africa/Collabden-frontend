"use client";

import React, { useState, useEffect } from "react";
import { 
  FiLock, 
  FiGlobe, 
  FiUserPlus
} from "react-icons/fi";
import { Project } from "@/types/api.types";
import { useProjects } from "@/hooks/projects/useProjects";

interface PrivacySettingsTabProps {
  project?: Project;
  onSuccess?: (message?: string) => void;
}

export default function PrivacySettingsTab({ project, onSuccess }: PrivacySettingsTabProps) {
  const { useUpdateProject } = useProjects();
  const updateMutation = useUpdateProject(project?.id || "");

  // Local state synced with project props
  const [isPublic, setIsPublic] = useState(project?.visibility === "PUBLIC");
  const [isOpenToCollaborators, setIsOpenToCollaborators] = useState(Boolean(project?.openToCollaborators));

  useEffect(() => {
    if (project) {
      setIsPublic(project.visibility === "PUBLIC");
      setIsOpenToCollaborators(Boolean(project.openToCollaborators));
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
    setIsOpenToCollaborators(nextVal);

    try {
      await updateMutation.mutateAsync({
        openToCollaborators: nextVal,
      });
      onSuccess?.(nextVal ? "Project is now open to collaborator applications." : "Project is no longer accepting collaborator applications.");
    } catch (err) {
      setIsOpenToCollaborators(!nextVal);
      console.error("Failed to update collaboration status:", err);
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
    <div className="w-full flex flex-col gap-[28px] lg:gap-[32px]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-[20px] lg:p-[24px] pr-[56px] sm:pr-[64px] gap-[16px] bg-black/20 rounded-[24px] border border-white/5 shadow-inner">
        <div className="w-[54px] h-[54px] bg-white/10 rounded-[15px] flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
          <FiLock className="text-white" size={24} />
        </div>
        <div className="flex flex-col justify-center gap-[4px]">
          <h2 className="font-raleway font-semibold text-[22px] lg:text-[25px] leading-[29px] text-white">
            Privacy & Visibility
          </h2>
          <p className="font-raleway font-medium text-[14px] lg:text-[16px] leading-[21px] text-white/60">
            Control access and marketplace discovery for {project.name}.
          </p>
        </div>
      </div>

      {/* Real Privacy Settings List */}
      <div className="flex flex-col gap-[16px] w-full">
        {/* Project Visibility Toggle */}
        <div className="flex items-center justify-between w-full bg-black/20 border border-white/5 p-4 sm:p-5 rounded-[20px] group transition-all">
          <div className="flex items-center gap-[16px]">
            <div className="w-[44px] h-[44px] bg-white/10 border border-white/10 rounded-[14.6px] flex items-center justify-center shrink-0 shadow-sm">
              <FiGlobe className="text-white" size={18} />
            </div>
            <div className="flex flex-col gap-[2px]">
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
            className={`relative w-[45px] h-[27px] rounded-full p-[3px] transition-colors duration-300 shrink-0 ${
              isPublic ? "bg-primary-green" : "bg-white/20"
            } ${updateMutation.isPending ? "opacity-55 cursor-not-allowed" : ""}`}
            aria-pressed={isPublic}
          >
            <div 
              className={`w-[21px] h-[21px] bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                isPublic ? "translate-x-[18px]" : "translate-x-0"
              }`} 
            />
          </button>
        </div>

        {/* Open to Collaborators Toggle */}
        <div className="flex items-center justify-between w-full bg-black/20 border border-white/5 p-4 sm:p-5 rounded-[20px] group transition-all">
          <div className="flex items-center gap-[16px]">
            <div className="w-[44px] h-[44px] bg-white/10 border border-white/10 rounded-[14.6px] flex items-center justify-center shrink-0 shadow-sm">
              <FiUserPlus className="text-white" size={18} />
            </div>
            <div className="flex flex-col gap-[2px]">
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
            className={`relative w-[45px] h-[27px] rounded-full p-[3px] transition-colors duration-300 shrink-0 ${
              isOpenToCollaborators ? "bg-primary-green" : "bg-white/20"
            } ${updateMutation.isPending ? "opacity-55 cursor-not-allowed" : ""}`}
            aria-pressed={isOpenToCollaborators}
          >
            <div 
              className={`w-[21px] h-[21px] bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                isOpenToCollaborators ? "translate-x-[18px]" : "translate-x-0"
              }`} 
            />
          </button>
        </div>
      </div>
    </div>
  );
}