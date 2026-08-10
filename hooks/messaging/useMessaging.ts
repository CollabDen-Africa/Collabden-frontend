import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import messagingService from "@/services/messaging.service";
import { SendMessagePayload } from "@/types/api.types";
import { handleApiError } from "@/lib/error-handler";

export const useMessaging = () => {
  const queryClient = useQueryClient();

  // Fetch all chats
  const useChats = () =>
    useQuery({
      queryKey: ["messaging", "chats"],
      queryFn: () => messagingService.getChats(),
    });

  // Fetch messages in a specific chat
  const useChatMessages = (chatId: string) =>
    useQuery({
      queryKey: ["messaging", "chats", chatId, "messages"],
      queryFn: () => messagingService.getChatMessages(chatId),
      enabled: !!chatId,
    });

  // Send a message
  const useSendMessage = (chatId: string) =>
    useMutation({
      mutationFn: (payload: SendMessagePayload) =>
        messagingService.sendDirectMessage(chatId, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["messaging", "chats", chatId, "messages"] });
        queryClient.invalidateQueries({ queryKey: ["messaging", "chats"] });
      },
      onError: (error) => handleApiError(error),
    });

  // Fetch message requests
  const useMessageRequests = (direction: "sent" | "received" = "received") =>
    useQuery({
      queryKey: ["messaging", "requests", direction],
      queryFn: () => messagingService.getRequests(direction),
    });

  // Respond to request
  const useRespondRequest = () =>
    useMutation({
      mutationFn: ({ id, status }: { id: string; status: "ACCEPTED" | "DECLINED" }) =>
        messagingService.respondRequest(id, status),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["messaging", "requests"] });
        queryClient.invalidateQueries({ queryKey: ["messaging", "chats"] });
      },
      onError: (error) => handleApiError(error),
    });

  // Toggle emoji reaction
  const useToggleReaction = (chatId: string) =>
    useMutation({
      mutationFn: ({ messageId, emoji }: { messageId: string; emoji: string }) =>
        messagingService.toggleReaction(messageId, emoji),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["messaging", "chats", chatId, "messages"] });
      },
      onError: (error) => handleApiError(error),
    });

  // Archive chat session
  const useArchiveChat = () =>
    useMutation({
      mutationFn: ({ chatId, isArchived }: { chatId: string; isArchived: boolean }) =>
        messagingService.archiveChat(chatId, isArchived),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["messaging", "chats"] });
      },
      onError: (error) => handleApiError(error),
    });

  // Delete chat history
  const useDeleteChat = () =>
    useMutation({
      mutationFn: (chatId: string) => messagingService.deleteChat(chatId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["messaging", "chats"] });
      },
      onError: (error) => handleApiError(error),
    });

  return {
    useChats,
    useChatMessages,
    useSendMessage,
    useMessageRequests,
    useRespondRequest,
    useToggleReaction,
    useArchiveChat,
    useDeleteChat,
  };
};
