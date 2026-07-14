import { localApi } from "@/lib/axios";
import type {
  MessageRequest,
  DirectChat,
  DirectMessage,
  SendMessagePayload,
} from "@/types/api.types";

const messagingService = {
  /**
   * Send a message request to an unconnected user.
   */
  sendRequest: async (receiverId: string, message: string): Promise<MessageRequest> => {
    const response = await localApi.post("/api/proxy/messaging/requests", {
      receiverId,
      message,
    });
    return response.data;
  },

  /**
   * Respond to a pending message request (Accept or Decline).
   */
  respondRequest: async (id: string, status: "ACCEPTED" | "DECLINED"): Promise<any> => {
    const response = await localApi.patch(`/api/proxy/messaging/requests/${id}`, {
      status,
    });
    return response.data;
  },

  /**
   * List pending message requests (sent or received).
   */
  getRequests: async (direction: "sent" | "received" = "received"): Promise<MessageRequest[]> => {
    const response = await localApi.get("/api/proxy/messaging/requests", {
      params: { direction },
    });
    return response.data || [];
  },

  /**
   * List all direct chats the authenticated user is part of.
   */
  getChats: async (): Promise<DirectChat[]> => {
    const response = await localApi.get("/api/proxy/messaging/chats");
    return response.data || [];
  },

  /**
   * Fetch message history for a direct chat.
   */
  getChatMessages: async (
    chatId: string,
    limit = 50,
    beforeId?: string
  ): Promise<DirectMessage[]> => {
    const response = await localApi.get(`/api/proxy/messaging/chats/${chatId}/messages`, {
      params: { limit, beforeId },
    });
    return response.data || [];
  },

  /**
   * Send a direct message / voice note in a chat.
   */
  sendDirectMessage: async (chatId: string, payload: SendMessagePayload): Promise<DirectMessage> => {
    const response = await localApi.post(`/api/proxy/messaging/chats/${chatId}/messages`, payload);
    return response.data;
  },

  /**
   * Mark all unread messages in a chat as read.
   */
  markChatAsRead: async (chatId: string): Promise<{ success: boolean }> => {
    const response = await localApi.patch(`/api/proxy/messaging/chats/${chatId}/read`);
    return response.data;
  },

  /**
   * Toggle emoji reaction on a message.
   */
  toggleReaction: async (messageId: string, emoji: string): Promise<any> => {
    const response = await localApi.post(`/api/proxy/messaging/messages/${messageId}/reactions`, {
      emoji,
    });
    return response.data;
  },

  /**
   * Archive or unarchive a direct chat conversation.
   */
  archiveChat: async (chatId: string, isArchived: boolean): Promise<any> => {
    const response = await localApi.patch(`/api/proxy/messaging/chats/${chatId}/archive`, {
      isArchived,
    });
    return response.data;
  },

  /**
   * Soft delete direct chat conversation history.
   */
  deleteChat: async (chatId: string): Promise<any> => {
    const response = await localApi.delete(`/api/proxy/messaging/chats/${chatId}`);
    return response.data;
  },
};

export default messagingService;
