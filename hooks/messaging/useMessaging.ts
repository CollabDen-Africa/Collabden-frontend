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

        const messagesKey = ["messaging", "chats", chatId, "messages"];
        const infiniteKey = ["messaging", "chats", chatId, "messages", "infinite"];
        const chatsKey = ["messaging", "chats"];

        await queryClient.cancelQueries({ queryKey: messagesKey });
        await queryClient.cancelQueries({ queryKey: infiniteKey });
        await queryClient.cancelQueries({ queryKey: chatsKey });

        const previousMessages = queryClient.getQueryData<DirectMessage[]>(messagesKey) || [];
        const previousInfinite = queryClient.getQueryData<{
          pages: DirectMessage[][];
          pageParams: unknown[];
        }>(infiniteKey);
        const previousChats = queryClient.getQueryData<DirectChat[]>(chatsKey);

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
          messagesKey,
          [...previousMessages, optimisticMsg]
        );

        // ChatWindow prefers the infinite query when it has data, so the
        // optimistic message must also land there or it won't render until
        // the server round-trip invalidates and refetches.
        queryClient.setQueryData<{
          pages: DirectMessage[][];
          pageParams: unknown[];
        }>(infiniteKey, (old) => {
          if (!old || !old.pages || old.pages.length === 0) {
            return { pages: [[optimisticMsg]], pageParams: [undefined] };
          }
          const pages = [...old.pages];
          pages[0] = [...pages[0], optimisticMsg];
          return { ...old, pages };
        });

        if (previousChats) {
          queryClient.setQueryData<DirectChat[]>(
            chatsKey,
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

        return { previousMessages, previousInfinite, previousChats };
      },

      onError: (err, payload, context) => {
        if (context?.previousMessages) {
          queryClient.setQueryData(["messaging", "chats", chatId, "messages"], context.previousMessages);
        }
        if (context?.previousInfinite !== undefined) {
          queryClient.setQueryData(
            ["messaging", "chats", chatId, "messages", "infinite"],
            context.previousInfinite,
          );
        }
        if (context?.previousChats) {
          queryClient.setQueryData(["messaging", "chats"], context.previousChats);
        }
        handleApiError(err);
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["messaging", "chats", chatId, "messages"] });
        queryClient.invalidateQueries({ queryKey: ["messaging", "chats", chatId, "messages", "infinite"] });
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

  // Archive chat session (optimistic)
  const useArchiveChat = () =>
    useMutation({
      mutationFn: ({ chatId, isArchived }: { chatId: string; isArchived: boolean }) =>
        messagingService.archiveChat(chatId, isArchived),
      onMutate: async ({ chatId, isArchived }) => {
        await queryClient.cancelQueries({ queryKey: ["messaging", "chats"] });
        const previousChats = queryClient.getQueryData<DirectChat[]>(["messaging", "chats"]);
        if (previousChats) {
          queryClient.setQueryData<DirectChat[]>(
            ["messaging", "chats"],
            previousChats.map((c) => (c.id === chatId ? { ...c, isArchived } : c))
          );
        }
        return { previousChats };
      },
      onError: (_err, _vars, context) => {
        if (context?.previousChats) {
          queryClient.setQueryData(["messaging", "chats"], context.previousChats);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["messaging", "chats"] });
      },
      onError: (error) => handleApiError(error),
    });

  // Delete chat history (optimistic)
  const useDeleteChat = () =>
    useMutation({
      mutationFn: (chatId: string) => messagingService.deleteChat(chatId),
      onMutate: async (chatId) => {
        await queryClient.cancelQueries({ queryKey: ["messaging", "chats"] });
        const previousChats = queryClient.getQueryData<DirectChat[]>(["messaging", "chats"]);
        if (previousChats) {
          queryClient.setQueryData<DirectChat[]>(
            ["messaging", "chats"],
            previousChats.filter((c) => c.id !== chatId)
          );
        }
        return { previousChats };
      },
      onError: (_err, _chatId, context) => {
        if (context?.previousChats) {
          queryClient.setQueryData(["messaging", "chats"], context.previousChats);
        }
      },
      onSettled: () => {
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
