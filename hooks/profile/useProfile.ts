import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import profileService from "@/services/profile.service";
import { handleApiError } from "@/lib/error-handler";

export const useProfile = () => {
  const queryClient = useQueryClient();

  // Fetch single user profile
  const useUserProfile = (userId: string) =>
    useQuery({
      queryKey: ["profile", userId],
      queryFn: () => profileService.getProfile(userId),
      enabled: !!userId,
    });

  // Update profile
  const useUpdateProfile = (userId: string) =>
    useMutation({
      mutationFn: (data: any) => profileService.updateProfile(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["profile", userId] });
        queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      },
      onError: (error) => handleApiError(error),
    });

  // Update email
  const useUpdateEmail = () =>
    useMutation({
      mutationFn: (data: { newEmail: string; currentPassword: string }) =>
        profileService.updateEmail(data),
      onError: (error) => handleApiError(error),
    });

  // Update avatar URL
  const useUpdateAvatar = (userId: string) =>
    useMutation({
      mutationFn: (avatarUrl: string) => profileService.updateAvatar(avatarUrl),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["profile", userId] });
        queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      },
      onError: (error) => handleApiError(error),
    });

  // Fetch completeness metrics
  const useCompleteness = () =>
    useQuery({
      queryKey: ["profile", "completeness"],
      queryFn: () => profileService.getCompleteness(),
    });

  // Browse collaborators
  const useBrowseCollaborators = (filters: { skills?: string; genres?: string; q?: string }) =>
    useQuery({
      queryKey: ["profile", "browse", filters],
      queryFn: () => profileService.browseCollaborators(filters),
    });

  // Add endorsement
  const useAddEndorsement = (userId: string) =>
    useMutation({
      mutationFn: (content: string) => profileService.addEndorsement(userId, content),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      },
      onError: (error) => handleApiError(error),
    });

  // Get portfolio
  const usePortfolio = (userId: string) =>
    useQuery({
      queryKey: ["profile", "portfolio", userId],
      queryFn: () => profileService.getPortfolio(userId),
      enabled: !!userId,
    });

  // Update portfolio entry
  const useUpdatePortfolioEntry = (userId: string, projectId: string) =>
    useMutation({
      mutationFn: (data: any) => profileService.updatePortfolioEntry(projectId, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["profile", "portfolio", userId] });
      },
      onError: (error) => handleApiError(error),
    });

  return {
    useUserProfile,
    useUpdateProfile,
    useUpdateEmail,
    useUpdateAvatar,
    useCompleteness,
    useBrowseCollaborators,
    useAddEndorsement,
    usePortfolio,
    useUpdatePortfolioEntry,
  };
};
