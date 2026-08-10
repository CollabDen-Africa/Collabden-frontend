import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export interface JoinWaitlistPayload {
  email: string;
  fullName?: string;
  role?: string;
}

export const waitlistService = {
  joinWaitlist: async (payload: JoinWaitlistPayload) => {
    const response = await axiosInstance.post(API_ENDPOINTS.WAITLIST.JOIN, payload);
    return response.data;
  },
  join: async (payload: JoinWaitlistPayload) => {
    const response = await axiosInstance.post(API_ENDPOINTS.WAITLIST.JOIN, payload);
    return response.data;
  },
  getWaitlist: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.WAITLIST.LIST);
    return response.data;
  },
  downloadWaitlist: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.WAITLIST.DOWNLOAD, { responseType: 'blob' });
    return response.data;
  }
};

export default waitlistService;
