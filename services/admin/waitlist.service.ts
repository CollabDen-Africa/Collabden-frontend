export interface WaitlistEntryData {
  id: string;
  name?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  email: string;
  createdAt: string;
}

export interface WaitlistListResponse {
  data: WaitlistEntryData[];
  total?: number;
  page?: number;
  limit?: number;
}

export const waitlistService = {
  getAll: async (): Promise<WaitlistEntryData[]> => {
    const response = await fetch("/api/admin/waitlist");
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw Object.assign(new Error(err.error || "Failed to fetch waitlist"), { response: { data: err, status: response.status } });
    }
    const payload = await response.json();
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  },

  downloadExcel: async (): Promise<Blob> => {
    const response = await fetch("/api/admin/waitlist/download");
    if (!response.ok) {
      throw new Error("Failed to download waitlist");
    }
    return response.blob();
  },
};
