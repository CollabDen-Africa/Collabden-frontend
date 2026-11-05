"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { Project } from "@/types/api.types";
import { useAuth } from "@/context/AuthContext";
import {
  useProjectFundingStatus,
  type ProjectFundingStatus,
} from "@/hooks/projects/useProjectFundingStatus";

interface WorkspaceContextType {
  activeProject: Project | null;
  projectDetails: Project | null;
  setActiveProjectByName: (name: string) => void;
  isLoading: boolean;
  isOwner: boolean;
  fundingStatus: ProjectFundingStatus;
  escrowLocked: boolean;
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
  const { user } = useAuth();
  const activeProject =
    projects.find((p) => p.name === activeProjectName) || projects[0] || null;

  const project = projectDetails || activeProject;
  const { status: fundingStatus, escrowLocked } = useProjectFundingStatus(project);

  const ownerId = project?.owner?.id || project?.ownerId;
  const isOwner = Boolean(user?.id && ownerId && ownerId === user.id);

  return (
    <WorkspaceContext.Provider
      value={{
        activeProject,
        projectDetails: projectDetails || null,
        setActiveProjectByName: onSelectProject,
        isLoading,
        isOwner,
        fundingStatus,
        escrowLocked,
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
