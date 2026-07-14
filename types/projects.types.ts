export type ProjectVisibility = "PUBLIC" | "PRIVATE";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  genre: string;
  startDate: string;
  visibility: ProjectVisibility;
  status: string;
  ownerId: string;
  owner?: { id: string; email: string };
  createdAt: string;
  updatedAt: string;
  collaborators?: ProjectCollaborator[];
}

export interface ProjectCollaborator {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: { id: string; email: string };
}

export interface ProjectListResponse {
  projects: Project[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  genre: string;
  startDate: string;
  visibility?: ProjectVisibility;
}

export interface InviteCollaboratorPayload {
  collaboratorId: string;
}

export interface ProjectMetadata {
  projectId: string;
  name: string;
  ownerId: string;
  status: string;
  visibility: string;
  createdAt: string;
  updatedAt: string;
  creationMetadata: {
    creatorId: string;
    initialCollaboratorCount: number;
    creationPlatform: string;
  } | null;
  currentStats: {
    tasks: number;
    files: number;
    messages: number;
    agreements: number;
    collaborators: number;
  };
}
