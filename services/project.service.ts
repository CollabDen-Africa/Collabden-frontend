import { localApi } from "@/lib/axios";
import type {
  Project,
  CreateProjectPayload,
  InviteCollaboratorPayload,
  ProjectMetadata,
} from "@/types/api.types";

const projectService = {
  /**
   * List all active projects for the authenticated user.
   * Backend returns: { projects: [...], meta: {...} }
   */
  getAll: async (): Promise<Project[]> => {
    const response = await localApi.get("/api/proxy/projects");
    const raw = response.data;
    // Backend returns { projects: [...], meta: {...} }
    if (raw?.projects && Array.isArray(raw.projects)) return raw.projects;
    // Fallback: direct array
    if (Array.isArray(raw)) return raw;
    // Fallback: wrapped in data
    if (raw?.data?.projects) return raw.data.projects;
    if (raw?.data && Array.isArray(raw.data)) return raw.data;
    return [];
  },

  /**
   * Get project workspace details by ID.
   */
  getById: async (id: string): Promise<Project> => {
    const response = await localApi.get(`/api/proxy/projects/${id}`);
    const raw = response.data;
    return raw?.project || raw?.data || raw as Project;
  },

  /**
   * Create a new project.
   */
  create: async (data: CreateProjectPayload): Promise<Project> => {
    const response = await localApi.post("/api/proxy/projects", data);
    const raw = response.data;
    return raw?.project || raw?.data || raw as Project;
  },

  /**
   * Update project details.
   */
  update: async (id: string, data: Partial<CreateProjectPayload>): Promise<Project> => {
    const response = await localApi.put(`/api/proxy/projects/${id}`, data);
    const raw = response.data;
    return raw?.project || raw?.data || raw as Project;
  },

  /**
   * Delete a project.
   */
  deleteProject: async (id: string): Promise<void> => {
    await localApi.delete(`/api/proxy/projects/${id}`);
  },

  /**
   * Invite a collaborator to a project.
   */
  invite: async (projectId: string, data: InviteCollaboratorPayload): Promise<void> => {
    await localApi.post(`/api/proxy/projects/${projectId}/invite`, data);
  },

  /**
   * Remove a collaborator from a project.
   */
  removeCollaborator: async (projectId: string, collaboratorId: string): Promise<void> => {
    await localApi.delete(`/api/proxy/projects/${projectId}/collaborators/${collaboratorId}`);
  },

  /**
   * Get project metadata and statistics (task, file, agreement, collaborator counts).
   */
  getMetadata: async (id: string): Promise<ProjectMetadata> => {
    const response = await localApi.get(`/api/proxy/projects/${id}/metadata`);
    return response.data;
  },
};

export default projectService;
