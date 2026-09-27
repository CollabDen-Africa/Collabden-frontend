"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Project } from "@/types/api.types";

interface WorkspaceContextType {
  activeProject: Project | null;
  projectDetails: Project | null;
  setActiveProjectByName: (name: string) => void;
  isLoading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({
  children,
  projects,
  projectDetails,
  activeProjectName,
  onSelectProject,
  isLoading,
}: {
  children: ReactNode;
  projects: Project[];
  projectDetails?: Project | null;
  activeProjectName: string;
  onSelectProject: (name: string) => void;
  isLoading: boolean;
}) {
  const activeProject =
    projects.find((p) => p.name === activeProjectName) || projects[0] || null;

  return (
    <WorkspaceContext.Provider
      value={{
        activeProject,
        projectDetails: projectDetails || null,
        setActiveProjectByName: onSelectProject,
        isLoading,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
