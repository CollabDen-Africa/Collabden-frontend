import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import projectService from '@/services/project.service';
import { CreateProjectPayload, InviteCollaboratorPayload } from '@/types/api.types';
import { handleApiError } from '@/lib/error-handler';

export const useProjects = () => {
  const queryClient = useQueryClient();

  // Fetch all projects
  const useAllProjects = () => useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAll(),
  });

  // Fetch single project
  const useProjectDetail = (id: string) => useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectService.getById(id),
    enabled: !!id,
  });

  // Create project
  const useCreateProject = () => useMutation({
    mutationFn: (data: CreateProjectPayload) => projectService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error) => handleApiError(error),
  });

  // Update project
  const useUpdateProject = (id: string) => useMutation({
    mutationFn: (data: Partial<CreateProjectPayload>) => projectService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', id] });
    },
    onError: (error) => handleApiError(error),
  });

  // Delete project
  const useDeleteProject = () => useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => handleApiError(error),
  });

  // Fetch project metadata/stats
  const useProjectMetadata = (id: string) => useQuery({
    queryKey: ['projects', id, 'metadata'],
    queryFn: () => projectService.getMetadata(id),
    enabled: !!id,
  });

  // Invite collaborator
  const useInviteCollaborator = (projectId: string) => useMutation({
    mutationFn: (data: InviteCollaboratorPayload) => projectService.invite(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
    },
    onError: (error) => handleApiError(error),
  });

  // Remove collaborator
  const useRemoveCollaborator = (projectId: string) => useMutation({
    mutationFn: (collaboratorId: string) => projectService.removeCollaborator(projectId, collaboratorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
    },
    onError: (error) => handleApiError(error),
  });

  return {
    useAllProjects,
    useProjectDetail,
    useCreateProject,
    useUpdateProject,
    useDeleteProject,
    useProjectMetadata,
    useInviteCollaborator,
    useRemoveCollaborator,
  };
};
