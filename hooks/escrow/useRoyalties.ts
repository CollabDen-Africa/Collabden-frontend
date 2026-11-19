import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import royaltyService from "@/services/royalty.service";
import { UpdateRoyaltySplitInput } from "@/types/royalty.types";

export const useRoyalties = () => {
  const queryClient = useQueryClient();

  const useProjectRoyalties = (projectId: string) => {
    return useQuery({
      queryKey: ["project-royalties", projectId],
      queryFn: async () => {
        try {
          const data = await royaltyService.getProjectSplits(projectId);
          return data || { splits: [] };
        } catch (error) {
          // If the API fails (e.g., 404 Not Found because no splits exist yet),
          // gracefully return an empty splits array instead of crashing the app.
          if (axios.isAxiosError(error) && error.response?.status === 404) {
           return { splits: [] };
          }
           throw error;
          }
      },
      enabled: !!projectId,
      meta: { errorContext: "royalties.load" },
    });
  };

  const useUpdateRoyaltySplits = () => {
    return useMutation({
      mutationFn: async ({ 
        projectId, 
        splitsData 
      }: { 
        projectId: string; 
          splitsData: UpdateRoyaltySplitInput[]; 
      }) => 
       royaltyService.updateProjectSplits(projectId, splitsData),
      
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ["project-royalties", variables.projectId] });
        queryClient.invalidateQueries({ queryKey: ["project", variables.projectId] });
        },
        meta: { errorContext: "royalties.save" },
    });
  };

  return {
    useProjectRoyalties,
    useUpdateRoyaltySplits,
  };
};