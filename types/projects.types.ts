export type ProjectVisibility = "PUBLIC" | "PRIVATE";

export interface ProjectOwner {
  id: string;
  email: string;
  displayName?: string | null;
  legalName?: string | null;
  avatarUrl?: string | null;
}

export interface ProjectCollaboratorUser {
  id: string;
  email: string;
  displayName?: string | null;
  legalName?: string | null;
  avatarUrl?: string | null;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  url: string;
  size?: number | null;
  type?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMessageSender {
  id: string;
  email: string;
  displayName?: string | null;
  legalName?: string | null;
  avatarUrl?: string | null;
}

export interface ProjectMessage {
  id: string;
  projectId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender?: ProjectMessageSender | null;
}

export type ProjectTaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: ProjectTaskStatus;
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  genre: string;
  startDate: string;
  endDate: string;
  visibility: ProjectVisibility;
  status: string;
  budget?: number | null;
  activeAgreementId?: string | null;
  ownerId: string;
  coverImageUrl?: string | null;
  owner?: ProjectOwner;
  openToCollaborators?: boolean;
  createdAt: string;
  updatedAt: string;
  collaborators?: ProjectCollaborator[];
  tasks?: ProjectTask[];
  files?: ProjectFile[];
  messages?: ProjectMessage[];
  agreements?: any[];
  activities?: any[];
  requiredRoles?: string[];
  pricingType?: string;
}

export interface ProjectCollaborator {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  isActive: boolean;
  inviteStatus?: "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  user?: ProjectCollaboratorUser;
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
  endDate?: string;
  visibility?: ProjectVisibility;
  openToCollaborators?: boolean;
  collaboratorIds?: string[];
  requiredRoles?: string[];
  budget?: number | null;
  pricingType?: string;
}

export interface InviteCollaboratorPayload {
  collaboratorId: string;
  role: string;
}

export interface CreateProjectTaskPayload {
  title: string;
  description?: string;
  dueDate?: string;
  status?: ProjectTaskStatus;
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

export interface ProjectInvite {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  isActive: boolean;
  inviteStatus: "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  project: {
    id: string;
    name: string;
    description: string | null;
    genre: string;
    owner: ProjectOwner;
  };
}

export interface MarketplaceProject {
  id: string;
  ownerId?: string;
  name: string;
  description: string | null;
  genre: string;
  requiredRoles: string[];
  requiredSkills: string[];
  startDate: string;
  endDate?: string | null;
  status: string;
  budget?: number | null;
  pricingType?: string | null;
  createdAt: string;
  owner?: ProjectOwner;
  _count?: { collaborators: number; applications: number };
}

export interface MarketplaceProjectsResponse {
  projects: MarketplaceProject[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ProjectApplication {
  id: string;
  projectId: string;
  applicantId: string;
  role: string;
  pitch: string;
  portfolioLink?: string | null;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt: string;
  applicant?: ProjectCollaboratorUser;
}