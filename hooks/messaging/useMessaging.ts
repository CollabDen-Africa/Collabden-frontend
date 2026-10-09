import { useAuth } from "@/context/AuthContext";
import { DirectMessage, DirectChat } from "@/types/api.types";
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import messagingService from "@/services/messaging.service";
import { SendMessagePayload } from "@/types/api.types";
import { handleApiError } from "@/lib/error-handler";

export const useMessaging = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch all chats
  const useChats = () =>
    useQuery({
      queryKey: ["messaging", "chats"],
      queryFn: () => messagingService.getChats(),
      staleTime: 30 * 1000,
    });

  // Fetch messages in a specific chat (cached with staleTime for 0ms chat switching delay)
  const useChatMessages = (chatId: string) =>
    useQuery({
      queryKey: ["messaging", "chats", chatId, "messages"],
      queryFn: () => messagingService.getChatMessages(chatId),
      enabled: !!chatId,
      staleTime: 60 * 1000,
      gcTime: 10 * 60 * 1000,
    });

  // Fetch older messages when scrolling up (Infinite Query with beforeId cursor)
  const useInfiniteChatMessages = (chatId: string) =>
    useInfiniteQuery({
      queryKey: ["messaging", "chats", chatId, "messages", "infinite"],
      queryFn: async ({ pageParam }) => {
        return messagingService.getChatMessages(chatId, 30, pageParam as string | undefined);
      },
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => {
        if (!lastPage || lastPage.length < 30) return undefined;
        return lastPage[0]?.id; // Returns oldest message ID in page for next beforeId cursor
      },
      enabled: !!chatId,
      staleTime: 60 * 1000,
    });

    // Send a message with instant Optimistic Updates for high performance UX
  const useSendMessage = (chatId: string) =>
    useMutation({
      mutationFn: (payload: SendMessagePayload) =>
        messagingService.sendDirectMessage(chatId, payload),

      onMutate: async (payload: SendMessagePayload) => {
        if (!chatId) return;

        await queryClient.cancelQueries({ queryKey: ["messaging", "chats", chatId, "messages"] });
        await queryClient.cancelQueries({ queryKey: ["messaging", "chats"] });

        const previousMessages = queryClient.getQueryData<DirectMessage[]>(["messaging", "chats", chatId, "messages"]) || [];
        const previousChats = queryClient.getQueryData<DirectChat[]>(["messaging", "chats"]);

        const optimisticMsg: DirectMessage = {
          id: `temp-${Date.now()}`,
          chatId,
          senderId: user?.id || "me",
          content: payload.content || "",
          voiceUrl: payload.voiceUrl || null,
          voiceDuration: payload.voiceDuration || null,
          parentId: payload.parentId || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        queryClient.setQueryData<DirectMessage[]>(
          ["messaging", "chats", chatId, "messages"],
          [...previousMessages, optimisticMsg]
        );

        if (previousChats) {
          queryClient.setQueryData<DirectChat[]>(
            ["messaging", "chats"],
            previousChats.map((c) => {
              if (c.id === chatId) {
                return {
                  ...c,
                  lastMessage: optimisticMsg,
                  updatedAt: optimisticMsg.createdAt,
                };
              }
              return c;
            })
          );
        }

        return { previousMessages, previousChats };
      },

      onError: (err, payload, context) => {
        if (context?.previousMessages) {
          queryClient.setQueryData(["messaging", "chats", chatId, "messages"], context.previousMessages);
        }
        if (context?.previousChats) {
          queryClient.setQueryData(["messaging", "chats"], context.previousChats);
        }
        handleApiError(err);
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["messaging", "chats", chatId, "messages"] });
        queryClient.invalidateQueries({ queryKey: ["messaging", "chats"] });
      },
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

  // Send a message request
  const useSendRequest = () =>
    useMutation({
      mutationFn: ({ receiverId, message }: { receiverId: string; message: string }) =>
        messagingService.sendRequest(receiverId, message),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["messaging", "requests"] });
        queryClient.invalidateQueries({ queryKey: ["messaging", "chats"] });
      },
      onError: (error) => handleApiError(error),
    });


  // Create or retrieve a direct chat
  const useCreateChat = () =>
    useMutation({
      mutationFn: (recipientId: string) => messagingService.createChat(recipientId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["messaging", "chats"] });
      },
      onError: (error) => handleApiError(error),
    });

  return {
    useCreateChat,
    useChats,
    useChatMessages,
    useInfiniteChatMessages,
    useSendMessage,
    useMessageRequests,
    useRespondRequest,
    useSendRequest,
    useToggleReaction,
    useArchiveChat,
    useDeleteChat,
  };
};
