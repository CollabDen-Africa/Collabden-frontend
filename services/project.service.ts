import { proxyAxios } from "@/lib/axios";
import { PROXY_ENDPOINTS } from "@/constants/api-endpoints";
import type {
  Project,
  CreateProjectPayload,
  InviteCollaboratorPayload,
  ProjectMetadata,
  ProjectInvite,
  ProjectMessage,
  ProjectTask,
  CreateProjectTaskPayload,
  MarketplaceProjectsResponse,
} from "@/types/api.types";

const projectService = {
  /**
   * List all active projects for the authenticated user.
   */
  getAll: async (): Promise<Project[]> => {
    const response = await proxyAxios.get(PROXY_ENDPOINTS.PROJECTS.LIST);
    const raw = response.data;
    if (raw?.projects && Array.isArray(raw.projects)) return raw.projects;
    if (Array.isArray(raw)) return raw;
    if (raw?.data?.projects) return raw.data.projects;
    if (raw?.data && Array.isArray(raw.data)) return raw.data;
    return [];
  },

  /**
   * Get project workspace details by ID.
   */
  getById: async (id: string): Promise<Project> => {
    const response = await proxyAxios.get(PROXY_ENDPOINTS.PROJECTS.DETAIL(id));
    const raw = response.data;
    return raw?.project || raw?.data || (raw as Project);
  },

  /**
   * Create a new project.
   */
  create: async (data: CreateProjectPayload): Promise<Project> => {
    const response = await proxyAxios.post(PROXY_ENDPOINTS.PROJECTS.CREATE, data);
    const raw = response.data;
    return raw?.project || raw?.data || (raw as Project);
  },

  /**
   * Update project details.
   */
  update: async (id: string, data: Partial<CreateProjectPayload>): Promise<Project> => {
    const response = await proxyAxios.put(PROXY_ENDPOINTS.PROJECTS.UPDATE(id), data);
    const raw = response.data;
    return raw?.project || raw?.data || (raw as Project);
  },

  /**
   * Delete a project.
   */
  deleteProject: async (id: string): Promise<void> => {
    await proxyAxios.delete(PROXY_ENDPOINTS.PROJECTS.DELETE(id));
  },

  /**
   * Invite a collaborator to a project.
   */
  invite: async (projectId: string, data: InviteCollaboratorPayload): Promise<void> => {
    await proxyAxios.post(PROXY_ENDPOINTS.PROJECTS.INVITE(projectId), data);
  },

  uploadFile: async (projectId: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file);
    await proxyAxios.post(PROXY_ENDPOINTS.PROJECTS.FILES(projectId), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  sendMessage: async (projectId: string, content: string): Promise<ProjectMessage> => {
    const response = await proxyAxios.post(PROXY_ENDPOINTS.PROJECTS.MESSAGES(projectId), { content });
    return response.data?.message || response.data?.data || response.data;
  },

  createTask: async (projectId: string, data: CreateProjectTaskPayload): Promise<ProjectTask> => {
    const response = await proxyAxios.post(PROXY_ENDPOINTS.PROJECTS.TASKS(projectId), data);
    return response.data?.task || response.data?.data || response.data;
  },

  updateTaskStatus: async (projectId: string, taskId: string, status: ProjectTask["status"]): Promise<ProjectTask> => {
    const response = await proxyAxios.patch(PROXY_ENDPOINTS.PROJECTS.TASK(projectId, taskId), { status });
    return response.data?.task || response.data?.data || response.data;
  },

  getMarketplace: async (params?: { page?: number; limit?: number; genre?: string; role?: string; search?: string; sortBy?: string; sortOrder?: "asc" | "desc" }): Promise<MarketplaceProjectsResponse> => {
    const response = await proxyAxios.get(PROXY_ENDPOINTS.PROJECTS.MARKETPLACE, { params });
    const raw = response.data;
    return { projects: raw?.projects || raw?.data?.projects || [], meta: raw?.meta || raw?.data?.meta || { total: 0, page: 1, limit: 20, totalPages: 0 } };
  },

  /**
   * Remove a collaborator from a project.
   */
  removeCollaborator: async (projectId: string, collaboratorId: string): Promise<void> => {
    await proxyAxios.delete(PROXY_ENDPOINTS.PROJECTS.REMOVE_COLLABORATOR(projectId, collaboratorId));
  },

  /**
   * Get project metadata and statistics (task, file, agreement, collaborator counts).
   */
  getMetadata: async (id: string): Promise<ProjectMetadata> => {
    const response = await proxyAxios.get(PROXY_ENDPOINTS.PROJECTS.METADATA(id));
    return response.data?.data || response.data;
  },

  /**
   * Get all pending collaboration invites for the current user.
   */
  getMyInvites: async (): Promise<ProjectInvite[]> => {
    const response = await proxyAxios.get(PROXY_ENDPOINTS.PROJECTS.MY_INVITES);
    const raw = response.data;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    return [];
  },

  /**
   * Respond to a collaboration invite (ACCEPT or DECLINE).
   */
  respondToInvite: async (projectId: string, action: "ACCEPT" | "DECLINE"): Promise<void> => {
    await proxyAxios.post(PROXY_ENDPOINTS.PROJECTS.RESPOND_INVITE(projectId), { action });
  },

  /**
   * Apply to join a project.
   */
  applyToProject: async (projectId: string, message?: string): Promise<any> => {
    const response = await proxyAxios.post(PROXY_ENDPOINTS.PROJECTS.APPLY(projectId), { message });
    return response.data?.application || response.data?.data || response.data;
  },
};

export default projectService;
