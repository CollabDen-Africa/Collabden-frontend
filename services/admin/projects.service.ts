import axiosInstance from "@/lib/axios";
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
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_PROJECTS.ALL_PROJECTS, {
    params,
  });
  return response.data;
};

export const getProjectDetail = async (id: string) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_PROJECTS.PROJECT_DETAIL(id));
  return response.data;
};

export const getProjectActivity = async (id: string) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_PROJECTS.PROJECT_ACTIVITY(id));
  return response.data;
};

export const getProjectReports = async (params: any) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_PROJECTS.REPORTS, {
    params,
  });
  return response.data;
};

export const getProjectReportDetail = async (reportId: string) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_PROJECTS.REPORT_DETAIL(reportId));
  return response.data;
};

export const updateProjectReportStatus = async (projectId: string, reportId: string, status: string) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.ADMIN_PROJECTS.UPDATE_REPORT_STATUS(projectId, reportId),
    { status }
  );
  return response.data;
};

export const updateGlobalProjectReportStatus = async (reportId: string, status: string) => {
  const response = await axiosInstance.patch(
    API_ENDPOINTS.ADMIN_PROJECTS.UPDATE_GLOBAL_REPORT_STATUS(reportId),
    { status }
  );
  return response.data;
};

export const getProjectNotes = async (id: string, params?: { page?: number; limit?: number }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_PROJECTS.PROJECT_NOTES(id), {
    params,
  });
  return response.data;
};

export const addProjectNote = async (id: string, content: string) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.ADMIN_PROJECTS.PROJECT_NOTES(id),
    { content }
  );
  return response.data;
};

export const getProjectAuditHistory = async (id: string, params?: { page?: number; limit?: number }) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_PROJECTS.PROJECT_AUDIT_HISTORY(id), {
    params,
  });
  return response.data;
};

export const moderateProject = async (id: string, payload: { action: string; reason?: string }) => {
  const response = await axiosInstance.post(
    API_ENDPOINTS.ADMIN_PROJECTS.MODERATE_PROJECT(id),
    payload
  );
  return response.data;
};

export const adminProjectsService = {
  getProjects,
  getProjectDetail,
  getProjectActivity,
  getProjectReports,
  getProjectReportDetail,
  updateProjectReportStatus,
  updateGlobalProjectReportStatus,
  getProjectNotes,
  addProjectNote,
  getProjectAuditHistory,
  moderateProject,
};

export default adminProjectsService;
