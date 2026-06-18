import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import agreementService from '@/services/agreement.service';
import { handleApiError } from '@/lib/error-handler';

export const useAgreements = (projectId: string) => {
  const queryClient = useQueryClient();

  // Fetch all agreements for the project
  const useProjectAgreements = () => useQuery({
    queryKey: ['projects', projectId, 'agreements'],
    queryFn: () => agreementService.getAgreements(projectId),
    enabled: !!projectId,
  });

  // Upload draft agreement (PDF)
  const useUploadAgreement = () => useMutation({
    mutationFn: (formData: FormData) => agreementService.uploadDraft(projectId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'agreements'] });
    },
    onError: (error) => handleApiError(error),
  });

  // Edit or replace draft agreement (PDF/fields)
  const useUpdateAgreement = (agreementId: string) => useMutation({
    mutationFn: (formData: FormData) => agreementService.update(projectId, agreementId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'agreements'] });
    },
    onError: (error) => handleApiError(error),
  });

  // Update status manually (e.g. DRAFT to PENDING_SIGNATURE)
  const useUpdateAgreementStatus = (agreementId: string) => useMutation({
    mutationFn: (status: "PENDING_SIGNATURE" | "SIGNED") => 
      agreementService.updateStatus(projectId, agreementId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'agreements'] });
    },
    onError: (error) => handleApiError(error),
  });

  // Upload signed copy manually
  const useUploadSignedCopy = (agreementId: string) => useMutation({
    mutationFn: (formData: FormData) => agreementService.uploadSignedCopy(projectId, agreementId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'agreements'] });
    },
    onError: (error) => handleApiError(error),
  });

  // Electronically sign inside platform
  const useEsignAgreement = (agreementId: string) => useMutation({
    mutationFn: (intentToSign: boolean) => agreementService.esign(projectId, agreementId, intentToSign),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'agreements'] });
    },
    onError: (error) => handleApiError(error),
  });

  return {
    useProjectAgreements,
    useUploadAgreement,
    useUpdateAgreement,
    useUpdateAgreementStatus,
    useUploadSignedCopy,
    useEsignAgreement,
  };
};
