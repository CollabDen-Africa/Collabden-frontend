import { proxyAxios } from "@/lib/axios";
import { PROXY_ENDPOINTS } from "@/constants/api-endpoints";

export type UserSpaceItemType = "agreement" | "saved-file" | "dm-attachment";

export interface UserSpaceItem {
  id: string;
  type: UserSpaceItemType;
  title: string;
  mimeType: string | null;
  size: number | null;
  url: string | null;
  project: { id: string; name: string } | null;
  createdAt: string;
  meta: {
    status?: string;
    awaitingMySignature?: boolean;
    projectFileId?: string;
    savedAt?: string;
    messageId?: string;
    chatId?: string;
    senderId?: string;
  };
}

export interface UserSpaceResponse {
  items: UserSpaceItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserSpaceQuery {
  page?: number;
  limit?: number;
  type?: UserSpaceItemType;
  projectName?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortOrder?: "asc" | "desc";
}

const userSpaceService = {
  getSpace: async (query: UserSpaceQuery = {}): Promise<UserSpaceResponse> => {
    const response = await proxyAxios.get(PROXY_ENDPOINTS.USER_SPACE.LIST, {
      params: query,
    });
    const raw = response.data;
    if (raw?.items) return raw as UserSpaceResponse;
    return { items: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 0 } };
  },

  removeSavedFile: async (projectFileId: string): Promise<void> => {
    await proxyAxios.delete(PROXY_ENDPOINTS.USER_SPACE.REMOVE_SAVED_FILE(projectFileId));
  },
};

export default userSpaceService;
