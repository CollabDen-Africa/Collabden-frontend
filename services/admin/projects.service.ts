import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export interface ProjectsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  visibility?: string;
  genre?: string;
}

export const getProjects = async (params: ProjectsParams) => {
  const response = await axios.get(API_ENDPOINTS.ADMIN_PROJECTS.ALL_PROJECTS, {
    params,
    withCredentials: true,
  });
  return response.data;
};

export const getProjectReports = async (params: any) => {
  const response = await axios.get(API_ENDPOINTS.ADMIN_PROJECTS.REPORTS, {
    params,
    withCredentials: true,
  });
  return response.data;
};

export const updateProjectReportStatus = async (projectId: string, reportId: string, status: string) => {
  const response = await axios.patch(
    API_ENDPOINTS.ADMIN_PROJECTS.UPDATE_REPORT_STATUS(projectId, reportId),
    { status },
    { withCredentials: true }
  );
  return response.data;
};

export const getProjectNotes = async (id: string, params: { page?: number; limit?: number }) => {
  const response = await axios.get(API_ENDPOINTS.ADMIN_PROJECTS.PROJECT_NOTES(id), {
    params,
    withCredentials: true,
  });
  return response.data;
};

export const addProjectNote = async (id: string, content: string) => {
  const response = await axios.post(
    API_ENDPOINTS.ADMIN_PROJECTS.PROJECT_NOTES(id),
    { content },
    { withCredentials: true }
  );
  return response.data;
};

export const getProjectAuditHistory = async (id: string, params: { page?: number; limit?: number }) => {
  const response = await axios.get(API_ENDPOINTS.ADMIN_PROJECTS.PROJECT_AUDIT_HISTORY(id), {
    params,
    withCredentials: true,
  });
  return response.data;
};

export const adminProjectsService = {
  getProjects,
  getProjectReports,
  updateProjectReportStatus,
  getProjectNotes,
  addProjectNote,
  getProjectAuditHistory,
};

export default adminProjectsService;
