import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import notificationSettingsService from "@/services/notification-settings.service";
import { UpdateNotificationSettingsPayload } from "@/types/api.types";

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
      meta: { errorContext: "settings.save" },
    });

  return {
    useNotificationSettings,
    useUpdateNotificationSettings,
  };
};
