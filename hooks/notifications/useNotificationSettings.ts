import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import notificationSettingsService from "@/services/notification-settings.service";
import { UpdateNotificationSettingsPayload } from "@/types/api.types";
import { handleApiError } from "@/lib/error-handler";

export const useNotificationSettingsHook = () => {
  const queryClient = useQueryClient();

  const useNotificationSettings = () =>
    useQuery({
      queryKey: ["user", "notification-settings"],
      queryFn: () => notificationSettingsService.getNotificationSettings(),
    });

  const useUpdateNotificationSettings = () =>
    useMutation({
      mutationFn: (payload: UpdateNotificationSettingsPayload) =>
        notificationSettingsService.updateNotificationSettings(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user", "notification-settings"] });
      },
      onError: (error) => handleApiError(error),
    });

  return {
    useNotificationSettings,
    useUpdateNotificationSettings,
  };
};
