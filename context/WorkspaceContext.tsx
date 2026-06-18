"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Project } from "@/types/api.types";

interface WorkspaceContextType {
  activeProject: Project | null;
  setActiveProjectByName: (name: string) => void;
  isLoading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({
  children,
  projects,
  activeProjectName,
  onSelectProject,
  isLoading,
}: {
  children: ReactNode;
  projects: Project[];
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
