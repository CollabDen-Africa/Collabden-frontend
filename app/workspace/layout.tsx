"use client";

import React, { useState } from "react";
import Avatar from "@/app/components/ui/Avatar";
import WorkspaceSidebar from "@/app/components/workspace/WorkspaceSidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineChevronDown } from "react-icons/hi";

const SIDEBAR_PROJECTS = [
  "Urban Beats Vol.2",
  "Acoustic Sessions",
  "Acoustic Sessions 2",
  "Acoustic Sessions 3",
  "Acoustic Sessions 4",
  "Acoustic Sessions 6"
];

const TABS = [
  { name: "Overview", path: "/workspace" },
  { name: "Files", path: "/workspace/files" },
  { name: "Messages", path: "/workspace/messages" },
  { name: "Tasks", path: "/workspace/tasks" },
  { name: "Agreements", path: "/workspace/agreements" },
  { name: "Activity", path: "/workspace/activity" },
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
  // Dynamic Progress State
    const [projectProgress, setProjectProgress] = useState(40);

  return (
    <div className="flex min-h-screen w-full relative font-sans text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[#444444]">
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="relative z-10 w-full max-w-[1512px] mx-auto flex flex-col md:flex-row gap-6 p-4 sm:p-6 lg:p-8">
        
        {/* Desktop Sidebar (Hidden on Mobile) */}
        <WorkspaceSidebar 
          projects={SIDEBAR_PROJECTS} 
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
                {SIDEBAR_PROJECTS.map((project) => (
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
                                <div key={member.id} className="relative w-[36px] h-[36px] sm:w-[47px] sm:h-[47px] rounded-full border-[2px] border-primary-green overflow-hidden">
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
                    className={`font-sans font-medium text-[16px] sm:text-[18px] transition-all whitespace-nowrap border-b-[2.5px] pb-2 -mb-[10.5px] ${
                      isActive 
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
          <div className="w-full">
            {children}
          </div>

        </main>
      </div>
    </div>
  );
}