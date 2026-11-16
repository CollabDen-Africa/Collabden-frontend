import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import userSpaceService, {
  type UserSpaceQuery,
} from "@/services/userSpace.service";
import projectService from "@/services/project.service";

export const useUserSpace = (query: UserSpaceQuery = {}) =>
  useQuery({
    queryKey: ["user", "space", query],
    queryFn: () => userSpaceService.getSpace(query),
    meta: { errorContext: "mySpace.load" },
  });

export const useRemoveSavedFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectFileId: string) => userSpaceService.removeSavedFile(projectFileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "space"] });
    },
    meta: { errorContext: "mySpace.remove" },
  });
};

export const useSaveFileToSpace = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, fileId }: { projectId: string; fileId: string }) =>
      projectService.saveFileToSpace(projectId, fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "space"] });
    },
    meta: { errorContext: "files.saveToSpace" },
  });
};
