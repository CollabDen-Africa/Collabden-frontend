import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import royaltyService from "@/services/royalty.service";
import { UpdateRoyaltySplitInput } from "@/types/royalty.types";
import { handleApiError } from "@/lib/error-handler"; 

export const useRoyalties = () => {
  const queryClient = useQueryClient();

  const useProjectRoyalties = (projectId: string) => {
    return useQuery({
      queryKey: ["project-royalties", projectId],
      queryFn: async () => {
        try {
          return await royaltyService.getProjectSplits(projectId);
        } catch (error) {
          throw new Error(handleApiError(error));
        }
      },
      enabled: !!projectId,
    });
  };

  const useUpdateRoyaltySplits = () => {
    return useMutation({
      mutationFn: async ({ 
        projectId, 
        splitsData 
      }: { 
        projectId: string; 
        splitsData: UpdateRoyaltySplitInput[] 
      }) => {
        try {
          return await royaltyService.updateProjectSplits(projectId, splitsData);
        } catch (error) {
          throw new Error(handleApiError(error));
        }
      },
      
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["project-royalties", variables.projectId] });
        queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] });
      },
    });
  };

  return {
    useProjectRoyalties,
    useUpdateRoyaltySplits,
  };
};