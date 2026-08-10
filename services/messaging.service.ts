import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
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
    const response = await axiosInstance.post(API_ENDPOINTS.MESSAGING.SEND_REQUEST, {
      receiverId,
      message,
    });
    return response.data?.data || response.data;
  },

  /**
   * Respond to a pending message request (Accept or Decline).
   */
  respondRequest: async (id: string, status: "ACCEPTED" | "DECLINED"): Promise<any> => {
    const response = await axiosInstance.put(API_ENDPOINTS.MESSAGING.RESPOND_REQUEST(id), {
      status,
    });
    return response.data?.data || response.data;
  },

  /**
   * List pending message requests (sent or received).
   */
  getRequests: async (direction: "sent" | "received" = "received"): Promise<MessageRequest[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MESSAGING.LIST_REQUESTS, {
      params: { direction },
    });
    return response.data?.data || response.data || [];
  },

  /**
   * List all direct chats the authenticated user is part of.
   */
  getChats: async (): Promise<DirectChat[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MESSAGING.LIST_CHATS);
    return response.data?.data || response.data || [];
  },

  /**
   * Fetch message history for a direct chat.
   */
  getChatMessages: async (
    chatId: string,
    limit = 50,
    beforeId?: string
  ): Promise<DirectMessage[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.MESSAGING.MESSAGES(chatId), {
      params: { limit, beforeId },
    });
    return response.data?.data || response.data || [];
  },

  /**
   * Send a direct message / voice note in a chat.
   */
  sendDirectMessage: async (chatId: string, payload: SendMessagePayload): Promise<DirectMessage> => {
    const response = await axiosInstance.post(API_ENDPOINTS.MESSAGING.MESSAGES(chatId), payload);
    return response.data?.data || response.data;
  },

  /**
   * Mark all unread messages in a chat as read.
   */
  markChatAsRead: async (chatId: string): Promise<{ success: boolean }> => {
    const response = await axiosInstance.put(API_ENDPOINTS.MESSAGING.READ(chatId));
    return response.data?.data || response.data;
  },

  /**
   * Toggle emoji reaction on a message.
   */
  toggleReaction: async (messageId: string, emoji: string): Promise<any> => {
    const response = await axiosInstance.post(API_ENDPOINTS.MESSAGING.REACTION(messageId), {
      emoji,
    });
    return response.data?.data || response.data;
  },

  /**
   * Archive or unarchive a direct chat conversation.
   */
  archiveChat: async (chatId: string, isArchived: boolean): Promise<any> => {
    const response = await axiosInstance.put(API_ENDPOINTS.MESSAGING.ARCHIVE(chatId), {
      isArchived,
    });
    return response.data?.data || response.data;
  },

  /**
   * Soft delete direct chat conversation history.
   */
  deleteChat: async (chatId: string): Promise<any> => {
    const response = await axiosInstance.delete(API_ENDPOINTS.MESSAGING.DELETE_CHAT(chatId));
    return response.data?.data || response.data;
  },
};

export default messagingService;
