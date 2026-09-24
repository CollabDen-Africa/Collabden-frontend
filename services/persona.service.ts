import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export interface PersonaInquiryResponse {
  inquiryId: string;
  sessionToken: string;
  redirectUrl?: string;
}

const personaService = {
  /**
   * Creates a Persona inquiry via the backend and returns the
   * inquiry ID + session token to launch the Persona embedded SDK.
   */
  createInquiry: async (): Promise<PersonaInquiryResponse> => {
    const response = await axiosInstance.post(API_ENDPOINTS.PERSONA.CREATE_INQUIRY);
    return response.data;
  },
};

export default personaService;
