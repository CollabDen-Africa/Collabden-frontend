
// --- Notification Types ---

export type NotificationType =
  | "INVITE"
  | "SYSTEM"
  | "PROJECT_CREATED"
  | "TASK_ASSIGNED"
  | "MESSAGE";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link: string | null;
  createdAt: string;
  updatedAt: string;
}

// --- Project Types ---

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

// --- Dashboard Types ---

export interface DashboardData {
  activeProjects: Project[];
  notifications: Notification[];
  stats?: DashboardStat[];
  recentActivity?: DashboardActivity[];
  suggestedProjects?: Project[];
  suggestedCollaborators?: ProjectCollaborator[];
}

export interface DashboardStat {
  title: string;
  count: string | number;
  subtitle: string;
}

export interface DashboardActivity {
  id: string;
  user: string;
  action: string;
  time: string;
  avatarUrl?: string;
}

// --- Generic API Response ---

export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// --- Legal Agreement Types ---

export type AgreementStatus = "DRAFT" | "PENDING_SIGNATURE" | "SIGNED";

export interface LegalAgreement {
  id: string;
  projectId: string;
  title: string | null;
  content: string | null;
  fileUrl: string | null;
  filePath: string | null;
  status: AgreementStatus;
  auditMetadata?: any;
  createdAt: string;
  updatedAt: string;
  signatures?: AgreementSignature[];
}

export interface AgreementSignature {
  id: string;
  agreementId: string;
  userId: string;
  legalName: string;
  signedAt: string;
  user?: { id: string; email: string };
}

// --- Connection Types ---

export type ConnectionStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface UserConnection {
  id: string;
  senderId: string;
  receiverId: string;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
  sender?: { id: string; email: string };
  receiver?: { id: string; email: string };
}

export interface ConnectionRequestPayload {
  receiverId: string;
}

export interface RespondConnectionPayload {
  status: "ACCEPTED" | "REJECTED";
}

// --- Project Metadata Types ---

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


