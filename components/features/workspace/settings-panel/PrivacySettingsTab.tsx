"use client";

import React, { useState, useEffect } from "react";
import { 
  FiLock, 
  FiGlobe, 
  FiUserPlus, 
  FiLink, 
  FiEye 
} from "react-icons/fi";
import { Project } from "@/types/api.types";
import { useProjects } from "@/hooks/projects/useProjects";

// --- PRIVACY SETTINGS DATA ---
const PRIVACY_SETTINGS = [
  { 
    id: "project_visibility", 
    title: "Project Visibility", 
    description: "Anyone with the link can join the project (PUBLIC vs PRIVATE)", 
    icon: FiGlobe, 
    defaultState: true 
  },
  { 
    id: "allow_applications", 
    title: "Allow applications to join", 
    description: "Let people request to collaborate", 
    icon: FiUserPlus, 
    defaultState: true 
  },
  { 
    id: "shareable_links", 
    title: "Allow shareable links", 
    description: "Generate links anyone can preview with", 
    icon: FiLink, 
    defaultState: true 
  },
  { 
    id: "guest_viewing", 
    title: "Allow guest viewing", 
    description: "Read-only access without an account", 
    icon: FiEye, 
    defaultState: true 
  },
];

interface PrivacySettingsTabProps {
  project?: Project;
}

export default function PrivacySettingsTab({ project }: PrivacySettingsTabProps) {
  const { useUpdateProject } = useProjects();
  const updateMutation = useUpdateProject(project?.id || "");

  // Initialize state based on project visibility
  const [settings, setSettings] = useState<Record<string, boolean>>({
    project_visibility: project?.visibility === "PUBLIC",
    allow_applications: true,
    shareable_links: true,
    guest_viewing: true,
  });

  // Keep visibility synced when project loads/updates
  useEffect(() => {
    if (project) {
      setSettings((prev) => ({
        ...prev,
        project_visibility: project.visibility === "PUBLIC",
      }));
    }
  }, [project]);

  // Toggle handler
  const toggleSetting = async (id: string) => {
    if (!project?.id) return;
    const nextVal = !settings[id];
    
    // Optimistically update
    setSettings((prev) => ({ ...prev, [id]: nextVal }));

    if (id === "project_visibility") {
      try {
        await updateMutation.mutateAsync({
          visibility: nextVal ? "PUBLIC" : "PRIVATE",
        });
      } catch (err) {
        // Revert on error
        setSettings((prev) => ({ ...prev, [id]: !nextVal }));
        console.error("Failed to update project visibility:", err);
      }
    }
  };

  if (!project) {
    return (
      <div className="w-full max-w-[931px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] lg:rounded-[50px] p-[32px] lg:p-[48px] shadow-2xl flex items-center justify-center">
        <p className="text-white/60">No active project selected.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[931px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] lg:rounded-[50px] p-[32px] lg:p-[48px] shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500">
      
      <div className="flex flex-col gap-[40px] w-full max-w-[860px]">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center p-[20px] lg:p-[24px] gap-[16px] bg-black/10 rounded-[30px] border border-white/5 shadow-inner">
          <div className="w-[54px] h-[54px] bg-white/20 rounded-[15px] flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
            <FiLock className="text-white" size={24} />
          </div>
          <div className="flex flex-col justify-center gap-[4px]">
            <h2 className="font-raleway font-semibold text-[22px] lg:text-[25px] leading-[29px] text-white">
              Privacy & Visibility
            </h2>
            <p className="font-raleway font-medium text-[15px] lg:text-[18px] leading-[21px] text-white/60">
              Control who can find, view and join {project.name}.
            </p>
          </div>
        </div>

        {/* Privacy Settings List */}
        <div className="flex flex-col gap-[24px] lg:gap-[32px] w-full">
          {PRIVACY_SETTINGS.map((item) => {
            const Icon = item.icon;
            const isActive = settings[item.id];
            const isPending = item.id === "project_visibility" && updateMutation.isPending;

            return (
              <div 
                key={item.id} 
                className="flex items-center justify-between w-full group transition-all"
              >
                {/* Left: Icon & Text */}
                <div className="flex items-center gap-[16px]">
                  <div className="w-[44px] h-[44px] bg-white/10 border border-white/10 rounded-[14.6px] flex items-center justify-center shrink-0 shadow-sm">
                    <Icon className="text-white" size={18} />
                  </div>
                  <div className="flex flex-col gap-[2px]">
                    <span className="font-raleway font-bold text-[16px] lg:text-[18px] text-white leading-tight">
                      {item.title}
                    </span>
                    <span className="font-raleway font-normal text-[14px] lg:text-[15px] text-white/60">
                      {item.description}
                    </span>
                  </div>
                </div>

                {/* Right: Custom Toggle Switch */}
                <button
                  type="button"
                  onClick={() => toggleSetting(item.id)}
                  disabled={isPending}
                  className={`relative w-[45px] h-[27px] rounded-full p-[3px] transition-colors duration-300 shrink-0 ${
                    isActive ? "bg-primary-green" : "bg-white/20"
                  } ${isPending ? "opacity-55 cursor-not-allowed" : ""}`}
                  aria-pressed={isActive}
                >
                  <div 
                    className={`w-[21px] h-[21px] bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                      isActive ? "translate-x-[18px]" : "translate-x-0"
                    }`} 
                  />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}