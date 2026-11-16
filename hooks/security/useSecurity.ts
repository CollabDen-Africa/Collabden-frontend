import { useMutation, useQueryClient } from "@tanstack/react-query";
import securityService from "@/services/security.service";


export const useSecurity = () => {
  const queryClient = useQueryClient();

  const useSetup2FA = () =>
    useMutation({
      mutationFn: () => securityService.setup2FA(),
      meta: { errorContext: "security.setup2FA" },
    });

  const useVerify2FA = () =>
    useMutation({
      mutationFn: (token: string) => securityService.verify2FA(token),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
      },
      meta: { errorContext: "security.verify2FA" },
    });

  const useLogoutAllDevices = () =>
    useMutation({
      mutationFn: () => securityService.logoutAllDevices(),
      meta: { errorContext: "security.logoutAll" },
    });

  const useDeactivateAccount = () =>
    useMutation({
      mutationFn: () => securityService.deactivateAccount(),
      meta: { errorContext: "security.deactivate" },
    });

  const useDeleteAccount = () =>
    useMutation({
      mutationFn: () => securityService.deleteAccount(),
      meta: { errorContext: "security.delete" },
    });

  const useDataExport = () =>
    useMutation({
      mutationFn: () => securityService.requestDataExport(),
      meta: { errorContext: "security.dataExport" },
    });

  const useCreateSupportTicket = () =>
    useMutation({
      mutationFn: ({ subject, message }: { subject: string; message: string }) =>
        securityService.createSupportTicket(subject, message),
      meta: { errorContext: "support.ticket", toast: false },
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
