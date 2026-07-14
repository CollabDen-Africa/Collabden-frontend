import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import collaboratorService from "@/services/collaborator.service";
import { handleApiError } from "@/lib/error-handler";

export const useCollaborator = () => {
  const queryClient = useQueryClient();

  const useCollaborators = (filters?: {
    name?: string;
    skills?: string;
    genres?: string;
    role?: string;
    openToCollaborate?: "true" | "false" | "all";
  }) =>
    useQuery({
      queryKey: ["collaborators", "list", filters],
      queryFn: () => collaboratorService.getCollaborators(filters),
    });

  const useCollaboratorDetails = (userId: string) =>
    useQuery({
      queryKey: ["collaborators", "detail", userId],
      queryFn: () => collaboratorService.getCollaboratorById(userId),
      enabled: !!userId,
    });

  const useMarketplaceSkills = () =>
    useQuery({
      queryKey: ["collaborators", "skills"],
      queryFn: () => collaboratorService.listSkills(),
    });

  const useMarketplaceGenres = () =>
    useQuery({
      queryKey: ["collaborators", "genres"],
      queryFn: () => collaboratorService.listGenres(),
    });

  const useUpdateAvailability = () =>
    useMutation({
      mutationFn: (openToCollaborate: boolean) =>
        collaboratorService.updateAvailability(openToCollaborate),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
        queryClient.invalidateQueries({ queryKey: ["collaborators"] });
      },
      onError: (error) => handleApiError(error),
    });

  return {
    useCollaborators,
    useCollaboratorDetails,
    useMarketplaceSkills,
    useMarketplaceGenres,
    useUpdateAvailability,
  };
};
