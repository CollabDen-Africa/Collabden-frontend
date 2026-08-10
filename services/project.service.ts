import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type {
  Project,
  CreateProjectPayload,
  InviteCollaboratorPayload,
  ProjectMetadata,
} from "@/types/api.types";

const projectService = {
  /**
   * List all active projects for the authenticated user.
   */
  getAll: async (): Promise<Project[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PROJECTS.LIST);
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
    const response = await axiosInstance.get(API_ENDPOINTS.PROJECTS.DETAIL(id));
    const raw = response.data;
    return raw?.project || raw?.data || raw as Project;
  },

  /**
   * Create a new project.
   */
  create: async (data: CreateProjectPayload): Promise<Project> => {
    const response = await axiosInstance.post(API_ENDPOINTS.PROJECTS.CREATE, data);
    const raw = response.data;
    return raw?.project || raw?.data || raw as Project;
  },

  /**
   * Update project details.
   */
  update: async (id: string, data: Partial<CreateProjectPayload>): Promise<Project> => {
    const response = await axiosInstance.put(API_ENDPOINTS.PROJECTS.UPDATE(id), data);
    const raw = response.data;
    return raw?.project || raw?.data || raw as Project;
  },

  /**
   * Delete a project.
   */
  deleteProject: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.PROJECTS.DELETE(id));
  },

  /**
   * Invite a collaborator to a project.
   */
  invite: async (projectId: string, data: InviteCollaboratorPayload): Promise<void> => {
    await axiosInstance.post(API_ENDPOINTS.PROJECTS.INVITE(projectId), data);
  },

  /**
   * Remove a collaborator from a project.
   */
  removeCollaborator: async (projectId: string, collaboratorId: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.PROJECTS.REMOVE_COLLABORATOR(projectId, collaboratorId));
  },

  /**
   * Get project metadata and statistics (task, file, agreement, collaborator counts).
   */
  getMetadata: async (id: string): Promise<ProjectMetadata> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PROJECTS.METADATA(id));
    return response.data?.data || response.data;
  },
};

export default projectService;
