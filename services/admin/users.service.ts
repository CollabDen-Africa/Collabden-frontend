import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export interface UsersParams {
  page?: number;
  limit?: number;
  search?: string;
  accountStatus?: string;
  isVerified?: boolean;
  tier?: string;
}

export const getUsers = async (params: UsersParams) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_AUTH.ALL_USERS, {
    params,
  });
  return response.data;
};

export const getUserDetail = async (id: string) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_AUTH.USER_DETAIL(id));
  return response.data;
};

export const getUserActivity = async (id: string) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_AUTH.USER_ACTIVITY(id));
  return response.data;
};

export const getUserReports = async (id: string) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_AUTH.USER_REPORTS(id));
  return response.data;
};

export const getUserAuditHistory = async (id: string) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_AUTH.USER_AUDIT_HISTORY(id));
  return response.data;
};

export const getUserNotes = async (id: string) => {
  const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_AUTH.USER_NOTES(id));
  return response.data;
};

export const addUserNote = async (id: string, note: string) => {
  const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_AUTH.USER_NOTES(id), { note });
  return response.data;
};

export const moderateUser = async (id: string, payload: { action: string; reason?: string }) => {
  const response = await axiosInstance.post(API_ENDPOINTS.ADMIN_AUTH.MODERATE_USER(id), payload);
  return response.data;
};

export const usersService = {
  getUsers,
  getUserDetail,
  getUserActivity,
  getUserReports,
  getUserAuditHistory,
  getUserNotes,
  addUserNote,
  moderateUser,
};

export default usersService;
