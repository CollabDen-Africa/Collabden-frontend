import { localApi } from "@/lib/axios";
import { WaitlistEntry } from "@/types/api.types";

const waitlistService = {
  /**
   * Submit email to join waitlist.
   * Calls the frontend local API proxy `/api/waitlist`
   */
  join: async (email: string): Promise<{ message: string; entry?: WaitlistEntry }> => {
    const response = await localApi.post("/api/waitlist", { email });
    return response.data;
  },
};

export default waitlistService;
