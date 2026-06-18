import { localApi } from "@/lib/axios";
import { WaitlistEntry, JoinWaitlistPayload } from "@/types/api.types";

const waitlistService = {
  /**
   * Submit email to join waitlist.
   * Calls the frontend local API proxy `/api/waitlist`
   */
  join: async (payload: JoinWaitlistPayload): Promise<{ message: string; entry?: WaitlistEntry }> => {
    const response = await localApi.post("/api/waitlist", payload);
    return response.data;
  },
};

export default waitlistService;
