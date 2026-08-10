import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import securityService from "@/services/security.service";
import { handleApiError } from "@/lib/error-handler";

export const useSecurity = () => {
  const queryClient = useQueryClient();

  const useSetup2FA = () =>
    useMutation({
      mutationFn: () => securityService.setup2FA(),
      onError: (error) => handleApiError(error),
    });

  const useVerify2FA = () =>
    useMutation({
      mutationFn: (token: string) => securityService.verify2FA(token),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      },
      onError: (error) => handleApiError(error),
    });

  const useLogoutAllDevices = () =>
    useMutation({
      mutationFn: () => securityService.logoutAllDevices(),
      onError: (error) => handleApiError(error),
    });

  const useDeactivateAccount = () =>
    useMutation({
      mutationFn: () => securityService.deactivateAccount(),
      onError: (error) => handleApiError(error),
    });

  const useDeleteAccount = () =>
    useMutation({
      mutationFn: () => securityService.deleteAccount(),
      onError: (error) => handleApiError(error),
    });

  const useDataExport = () =>
    useMutation({
      mutationFn: () => securityService.requestDataExport(),
      onError: (error) => handleApiError(error),
    });

  const useCreateSupportTicket = () =>
    useMutation({
      mutationFn: ({ subject, message }: { subject: string; message: string }) =>
        securityService.createSupportTicket(subject, message),
      onError: (error) => handleApiError(error),
    });

  return {
    useSetup2FA,
    useVerify2FA,
    useLogoutAllDevices,
    useDeactivateAccount,
    useDeleteAccount,
    useDataExport,
    useCreateSupportTicket,
  };
};
