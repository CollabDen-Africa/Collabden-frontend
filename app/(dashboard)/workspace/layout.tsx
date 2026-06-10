"use client";

import React, { useState, useEffect, useMemo } from "react";
import Avatar from "@/components/ui/Avatar";
import WorkspaceSidebar from "@/components/features/workspace/WorkspaceSidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineChevronDown } from "react-icons/hi";
import { FiBell, FiSettings, FiClock } from "react-icons/fi";
import ActivityPanel from "@/components/features/workspace/ActivityPanel";
import UpdatesPanel from "@/components/features/workspace/UpdatesPanel";
import SettingsPanel from "@/components/features/workspace/settings-panel/SettingsPanel";
import { useProjects } from "@/hooks/projects/useProjects";
import { handleApiError } from "@/lib/error-handler";

import { WorkspaceProvider } from "@/context/WorkspaceContext";

const TABS = [
  { name: "Overview", path: "/workspace" },
  { name: "Files", path: "/workspace/files" },
  { name: "Messages", path: "/workspace/messages" },
  { name: "Tasks", path: "/workspace/tasks" },
  { name: "Agreements", path: "/workspace/agreements" },
  { name: "Payment", path: "/workspace/payment" },
];

// Mock data for avatars
const MOCK_COLLABORATORS = [
  { id: 1, name: "David Chen", image: "/mock-profiles/David.png" },
  { id: 2, name: "Tayo Oni", image: "/mock-profiles/Tayo.png" },
  { id: 3, name: "Michael Awe", image: "/mock-profiles/small2.png" },
  { id: 4, name: "Chika Ike", image: "/mock-profiles/Sam.png" }
];

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeProject, setActiveProject] = useState("Urban Beats Vol.2");
  const projectProgress = 40;
  //Panel States
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [isUpdatesOpen, setIsUpdatesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { useAllProjects, useProjectDetail } = useProjects();
  const { data: apiProjects, error, isLoading } = useAllProjects();

  const sidebarProjects = useMemo(() => {
    if (!apiProjects?.length) return ["Urban Beats Vol.2", "Acoustic Sessions"]; // Fallback
    return apiProjects.map(p => p.name);
  }, [apiProjects]);

  useEffect(() => {
    if (sidebarProjects.length > 0 && !activeProject) {
      setActiveProject(sidebarProjects[0]);
    }
  }, [sidebarProjects, activeProject]);

  const selectedProject = useMemo(() => {
    return apiProjects?.find(p => p.name === activeProject) || apiProjects?.[0] || null;
  }, [apiProjects, activeProject]);

  // Query for the full details (includes collaborators, etc.)
  const { data: projectDetails } = useProjectDetail(selectedProject?.id || "");

  if (error) {
    handleApiError(error);
  }

  return (
    <WorkspaceProvider
      projects={apiProjects || []}
      activeProjectName={activeProject}
      onSelectProject={setActiveProject}
      isLoading={isLoading}
    >
      <div className="relative z-10 w-full max-w-[1512px] mx-auto flex flex-col md:flex-row gap-6 p-4 sm:p-6 lg:p-8 text-white font-sans">
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <WorkspaceSidebar
        projects={sidebarProjects}
        activeProject={activeProject}
        onSelectProject={setActiveProject}
      />

      {/* Workspace Flow */}
      <main className="flex-1 flex flex-col w-full max-w-full min-w-0 md:max-w-[1164px]">

        {/* Mobile Project Selector */}
        <div className="md:hidden flex flex-col gap-2 mb-4 w-full relative z-20">
          <span className="text-white/60 text-[12px] font-medium uppercase tracking-wider">Current Project</span>
          <div className="relative w-full">
            <select
              value={activeProject}
              onChange={(e) => setActiveProject(e.target.value)}
              className="w-full appearance-none bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white font-sans font-semibold text-[16px] outline-none focus:border-primary-green"
            >
              {sidebarProjects.map((project) => (
                <option key={project} value={project} className="bg-[#121A1F] text-white">
                  {project}
                </option>
              ))}
            </select>
            <HiOutlineChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={20} />
          </div>
        </div>

        {/* Persistent Header */}
        <header className="flex flex-col xl:flex-row xl:items-center justify-between w-full mb-8 xl:mb-12 mt-2 md:mt-4 gap-6 relative z-10">
          <h1 className="font-sans font-medium text-[32px] md:text-[48px] leading-tight text-white tracking-wide">
            WORKSPACE
          </h1>

          {/* Right Side Info */}
          <div className="flex flex-row items-center justify-between xl:justify-end w-full xl:w-auto gap-4 sm:gap-6">

            {/* Dynamic Avatars */}
            <div className="flex items-center -space-x-4 sm:-space-x-6">
              {MOCK_COLLABORATORS.map((member) => (
                <div key={member.id} className="relative w-[36px] h-[36px] sm:w-[47px] sm:h-[47px] rounded-full border-2 border-primary-green overflow-hidden">
                  <Avatar name={member.name} src={member.image} className="w-full h-full" />
                </div>
              ))}
            </div>

            {/* Dynamic Progress Bar */}
            <div className="flex flex-col items-end gap-1.5 sm:gap-2">
              <span className="font-sans font-bold text-[12px] sm:text-[14px] text-white/80">
                {projectProgress}% ready
              </span>
              <div className="w-[120px] sm:w-[159px] h-[7px] bg-[#D9D9D9] rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-green rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${projectProgress}%` }}
                />
              </div>
            </div>

          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="w-full overflow-x-auto custom-scrollbar border-b border-white/10 mb-6 sm:mb-8">
          <nav className="flex flex-nowrap items-center gap-6 sm:gap-12 pb-2 w-max px-1">
            {TABS.map((tab) => {
              const isActive = pathname === tab.path;
              return (
                <Link
                  key={tab.name}
                  href={tab.path}
                  className={`font-sans font-medium text-[16px] sm:text-[18px] transition-all whitespace-nowrap border-b-[2.5px] pb-2 -mb-[10.5px] ${isActive
                      ? "text-white border-primary-green"
                      : "text-white/60 hover:text-white border-transparent"
                    }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Page Content */}
        <div className="flex items-start gap-6 w-full h-full pb-10">
          
          <div className="flex-1 min-w-0 w-full h-full">
            {children}
          </div>

          <ActivityPanel 
            isOpen={isActivityOpen} 
            onClose={() => setIsActivityOpen(false)} 
          />
          <UpdatesPanel
            isOpen={isUpdatesOpen}
            onClose={() => setIsUpdatesOpen(false)}
          />
          <SettingsPanel
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            project={projectDetails || selectedProject || undefined}
          />
        </div>
      </main>

      {/* Right Toolbar */}
      <aside className="fixed bottom-0 left-0 w-full h-[80px] bg-[#121A1F]/95 backdrop-blur-md border-t border-white/10 flex flex-row items-center justify-around pb-safe z-[80]
                        xl:relative xl:bottom-auto xl:left-auto xl:w-[60px] xl:h-auto xl:bg-transparent xl:border-none xl:flex-col xl:justify-start xl:gap-8 xl:pt-[220px] xl:shrink-0 xl:z-auto">

        {/* Updates Button */}
        <button 
          onClick={() => {
            setIsUpdatesOpen(!isUpdatesOpen);
            setIsActivityOpen(false);
            setIsSettingsOpen(false);
          }}
          className={`flex flex-col items-center gap-1.5 xl:gap-2 transition-opacity p-2 ${isUpdatesOpen ? "opacity-100" : "opacity-40 hover:opacity-100"}`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${isUpdatesOpen ? "bg-white/20" : ""}`}>
            <FiBell size={20} className="text-white" />
          </div>
          <span className="font-sans font-semibold text-[10px] xl:text-[12px] text-white">Updates</span>
        </button>

        {/* Activity Button */}          
        <button 
          onClick={() => {
            setIsActivityOpen(!isActivityOpen);
            setIsUpdatesOpen(false); 
            setIsSettingsOpen(false);
          }}
          className={`flex flex-col items-center gap-1.5 xl:gap-2 transition-opacity p-2 ${isActivityOpen ? "opacity-100" : "opacity-40 hover:opacity-100"}`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${isActivityOpen ? "bg-white/20" : ""}`}>
            <FiClock size={20} className="text-white" />
          </div>
          <span className="font-sans font-semibold text-[10px] xl:text-[12px] text-white">Activity</span>
        </button>

        {/* Settings Button */}
        <button 
          onClick={() => {
            setIsSettingsOpen(!isSettingsOpen);
            setIsActivityOpen(false);
            setIsUpdatesOpen(false);
          }}
          className={`flex flex-col items-center gap-1.5 xl:gap-2 transition-opacity p-2 ${isSettingsOpen ? "opacity-100" : "opacity-40 hover:opacity-100"}`}
        >
          <div className={`p-1.5 rounded-full transition-colors ${isSettingsOpen ? "bg-white/20" : ""}`}>
            <FiSettings size={20} className="text-white" />
          </div>
          <span className="font-sans font-semibold text-[10px] xl:text-[12px] text-white">Settings</span>
        </button>

      </aside>
    </div>
    </WorkspaceProvider>
  );
}