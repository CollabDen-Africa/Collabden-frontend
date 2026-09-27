import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
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

async function requestWithAuthProxy<T>(
  proxyConfig: AxiosRequestConfig,
  legacyRequest: () => Promise<AxiosResponse<T>>,
): Promise<AxiosResponse<T>> {
  if (typeof window !== "undefined") {
    try {
      return await axios.request<T>(proxyConfig);
    } catch (error) {
      if (!axios.isAxiosError(error) || error.response?.status !== 401) {
        throw error;
      }
    }
  }

  return legacyRequest();
}

const projectService = {
  /**
   * List all active projects for the authenticated user.
   */
  getAll: async (): Promise<Project[]> => {
    const response = await requestWithAuthProxy(
      { method: "GET", url: "/api/proxy/projects" },
      () => axiosInstance.get(API_ENDPOINTS.PROJECTS.LIST),
    );
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
    const response = await requestWithAuthProxy(
      { method: "GET", url: `/api/proxy/projects/${id}` },
      () => axiosInstance.get(API_ENDPOINTS.PROJECTS.DETAIL(id)),
    );
    const raw = response.data;
    return raw?.project || raw?.data || raw as Project;
  },

  /**
   * Create a new project.
   */
  create: async (data: CreateProjectPayload): Promise<Project> => {
    const response = await requestWithAuthProxy(
      { method: "POST", url: "/api/proxy/projects", data },
      () => axiosInstance.post(API_ENDPOINTS.PROJECTS.CREATE, data),
    );
    const raw = response.data;
    return raw?.project || raw?.data || raw as Project;
  },

  /**
   * Update project details.
   */
  update: async (id: string, data: Partial<CreateProjectPayload>): Promise<Project> => {
    const response = await requestWithAuthProxy(
      { method: "PUT", url: `/api/proxy/projects/${id}`, data },
      () => axiosInstance.put(API_ENDPOINTS.PROJECTS.UPDATE(id), data),
    );
    const raw = response.data;
    return raw?.project || raw?.data || raw as Project;
  },

  /**
   * Delete a project.
   */
  deleteProject: async (id: string): Promise<void> => {
    await requestWithAuthProxy(
      { method: "DELETE", url: `/api/proxy/projects/${id}` },
      () => axiosInstance.delete(API_ENDPOINTS.PROJECTS.DELETE(id)),
    );
  },

  /**
   * Invite a collaborator to a project.
   */
  invite: async (projectId: string, data: InviteCollaboratorPayload): Promise<void> => {
    await requestWithAuthProxy(
      { method: "POST", url: `/api/proxy/projects/${projectId}/invite`, data },
      () => axiosInstance.post(API_ENDPOINTS.PROJECTS.INVITE(projectId), data),
    );
  },

  uploadFile: async (projectId: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append("file", file);
    await requestWithAuthProxy(
      {
        method: "POST",
        url: `/api/proxy/projects/${projectId}/files`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      },
      () => axiosInstance.post(`${API_ENDPOINTS.PROJECTS.DETAIL(projectId)}/files`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    );
  },

  sendMessage: async (projectId: string, content: string): Promise<ProjectMessage> => {
    const response = await requestWithAuthProxy(
      { method: "POST", url: `/api/proxy/projects/${projectId}/messages`, data: { content } },
      () => axiosInstance.post(`${API_ENDPOINTS.PROJECTS.DETAIL(projectId)}/messages`, { content }),
    );
    return response.data?.message || response.data?.data || response.data;
  },

  createTask: async (projectId: string, data: CreateProjectTaskPayload): Promise<ProjectTask> => {
    const response = await requestWithAuthProxy(
      { method: "POST", url: `/api/proxy/projects/${projectId}/tasks`, data },
      () => axiosInstance.post(API_ENDPOINTS.PROJECTS.TASKS(projectId), data),
    );
    return response.data?.task || response.data?.data || response.data;
  },

  updateTaskStatus: async (projectId: string, taskId: string, status: ProjectTask["status"]): Promise<ProjectTask> => {
    const response = await requestWithAuthProxy(
      { method: "PATCH", url: `/api/proxy/projects/${projectId}/tasks/${taskId}`, data: { status } },
      () => axiosInstance.patch(API_ENDPOINTS.PROJECTS.TASK(projectId, taskId), { status }),
    );
    return response.data?.task || response.data?.data || response.data;
  },

  getMarketplace: async (params?: { page?: number; limit?: number; genre?: string; role?: string; search?: string; sortBy?: string; sortOrder?: "asc" | "desc" }): Promise<MarketplaceProjectsResponse> => {
    const response = await requestWithAuthProxy(
      { method: "GET", url: "/api/proxy/projects/marketplace", params },
      () => axiosInstance.get(API_ENDPOINTS.PROJECTS.MARKETPLACE, { params }),
    );
    const raw = response.data;
    return { projects: raw?.projects || raw?.data?.projects || [], meta: raw?.meta || raw?.data?.meta || { total: 0, page: 1, limit: 20, totalPages: 0 } };
  },

  /**
   * Remove a collaborator from a project.
   */
  removeCollaborator: async (projectId: string, collaboratorId: string): Promise<void> => {
    await requestWithAuthProxy(
      { method: "DELETE", url: `/api/proxy/projects/${projectId}/collaborators/${collaboratorId}` },
      () => axiosInstance.delete(API_ENDPOINTS.PROJECTS.REMOVE_COLLABORATOR(projectId, collaboratorId)),
    );
  },

  /**
   * Get project metadata and statistics (task, file, agreement, collaborator counts).
   */
  getMetadata: async (id: string): Promise<ProjectMetadata> => {
    const response = await requestWithAuthProxy(
      { method: "GET", url: `/api/proxy/projects/${id}/metadata` },
      () => axiosInstance.get(API_ENDPOINTS.PROJECTS.METADATA(id)),
    );
    return response.data?.data || response.data;
  },

  /**
   * Get all pending collaboration invites for the current user.
   */
  getMyInvites: async (): Promise<ProjectInvite[]> => {
    const response = await requestWithAuthProxy(
      { method: "GET", url: "/api/proxy/projects/invitations/my-invites" },
      () => axiosInstance.get(API_ENDPOINTS.PROJECTS.MY_INVITES),
    );
    const raw = response.data;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    return [];
  },

  /**
   * Respond to a collaboration invite (ACCEPT or DECLINE).
   */
  respondToInvite: async (projectId: string, action: "ACCEPT" | "DECLINE"): Promise<void> => {
    await requestWithAuthProxy(
      { method: "POST", url: `/api/proxy/projects/${projectId}/invitations/respond`, data: { action } },
      () => axiosInstance.post(API_ENDPOINTS.PROJECTS.RESPOND_INVITE(projectId), { action }),
    );
  },
};

export default projectService;
