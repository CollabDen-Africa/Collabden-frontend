import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import projectService from '@/services/project.service';
import { handleApiError } from '@/lib/error-handler';
import { CreateProjectPayload, CreateProjectTaskPayload, InviteCollaboratorPayload, Project, ProjectMessage, ProjectTask, SendProjectMessagePayload } from '@/types/api.types';

export const useProjects = () => {
  const queryClient = useQueryClient();

  // Fetch all projects
  const useAllProjects = (params?: { hasMessages?: boolean; limit?: number }) => useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectService.getAll(params),
    meta: { errorContext: "projects.load" },
  });

  // Fetch only projects that have active messages
  const useProjectsWithMessages = () => useQuery({
    queryKey: ['projects', 'hasMessages'],
    queryFn: () => projectService.getAll({ hasMessages: true, limit: 100 }),
    staleTime: 30 * 1000,
    meta: { errorContext: "projects.load" },
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
    meta: { errorContext: 'projects.create', toast: false },
  });

  // Update project
  const useUpdateProject = (id: string) => useMutation({
    mutationFn: (data: Partial<CreateProjectPayload>) => projectService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', id] });
    },
    meta: { errorContext: 'projects.update' },
  });

  // Delete project
  const useDeleteProject = () => useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
     meta: { errorContext: 'projects.delete' },
  });

  // Fetch project metadata/stats
  const useProjectMetadata = (id: string) => useQuery({
    queryKey: ['projects', id, 'metadata'],
    queryFn: () => projectService.getMetadata(id),
    enabled: !!id,
  });

  const useMarketplaceProjects = (filters?: { page?: number; limit?: number; genre?: string; role?: string; search?: string; sortBy?: string; sortOrder?: "asc" | "desc"; excludeJoined?: boolean }) => useQuery({
    queryKey: ['marketplace', 'projects', filters],
    queryFn: () => projectService.getMarketplace(filters),
    staleTime: 0,
    refetchOnWindowFocus: true,
    meta: { errorContext: 'marketplace.load' },
  });

  // Invite collaborator
  const useInviteCollaborator = (projectId: string) => useMutation({
    mutationFn: (data: InviteCollaboratorPayload) => projectService.invite(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
    meta: { errorContext: 'projects.invite' },
  });

  const useUploadProjectFile = (projectId: string) => useMutation({
    mutationFn: (file: File) => projectService.uploadFile(projectId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    meta: { errorContext: 'files.upload', toast: false },
  });

  const useDeleteProjectFile = (projectId: string) => useMutation({
    mutationFn: (fileId: string) => projectService.deleteFile(projectId, fileId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      },
      meta: { errorContext: 'files.delete', toast: false },
    });

  const useSendProjectMessage = (projectId: string) => useMutation({
    mutationFn: (payload: SendProjectMessagePayload) => projectService.sendMessage(projectId, payload),
    onSuccess: (message: ProjectMessage) => {
      queryClient.setQueryData<Project>(['projects', projectId], (project) => {
        if (!project || project.messages?.some((existing) => existing.id === message.id)) {
          return project;
        }

        return { ...project, messages: [...(project.messages || []), message] };
      });
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
    },
     meta: { errorContext: 'projectMessages.send', toast: false },
  });

  const useCreateProjectTask = (projectId: string) => useMutation({
    mutationFn: (data: CreateProjectTaskPayload) => projectService.createTask(projectId, data),
    onSuccess: (task: ProjectTask) => {
      queryClient.setQueryData<Project>(['projects', projectId], (project) => {
        if (!project || project.tasks?.some((existing) => existing.id === task.id)) return project;
        return { ...project, tasks: [...(project.tasks || []), task] };
      });
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
    },
    meta: { errorContext: 'tasks.create' },
  });

  const useUploadProjectCover = (projectId?: string) => useMutation({
      mutationFn: ({ coverImage, id }: { coverImage: File; id?: string }) =>
        projectService.uploadCoverImage((id ?? projectId)!, coverImage),
      onSuccess: (_data, { id }) => {
        const resolvedId = id ?? projectId;
        queryClient.invalidateQueries({ queryKey: ['projects', resolvedId] });
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({ queryKey: ['marketplace', 'projects'] });
      },
     meta: { errorContext: 'projects.coverUpload' },
    });

  const useUpdateProjectTaskStatus = (projectId: string) => useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: ProjectTask["status"] }) =>
      projectService.updateTaskStatus(projectId, taskId, status),
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({ queryKey: ['projects', projectId] });
      const previousProject = queryClient.getQueryData<Project>(['projects', projectId]);
      queryClient.setQueryData<Project>(['projects', projectId], (project) => project ? {
        ...project,
        tasks: project.tasks?.map((task) => task.id === taskId ? { ...task, status } : task),
      } : project);
      return { previousProject };
    },
    onError: (error, _variables, context) => {
      if (context?.previousProject) queryClient.setQueryData(['projects', projectId], context.previousProject);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['projects', projectId] }),
    meta: { errorContext: 'tasks.move' },
  });

  // Remove collaborator / Cancel invitation
  const useRemoveCollaborator = (projectId: string) => useMutation({
    mutationFn: (collaboratorId: string) => projectService.removeCollaborator(projectId, collaboratorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace', 'projects'] });
    },
    meta: { errorContext: 'projects.removeCollaborator' },
  });


  // Fetch pending invitations for current user
  const useMyInvites = () => useQuery({
    queryKey: ['projects', 'my-invites'],
    queryFn: () => projectService.getMyInvites(),
    meta: { errorContext: 'invites.load' },
  });

  // Respond to invitation (ACCEPT | DECLINE)
  const useRespondToInvite = () => useMutation({
    mutationFn: ({ projectId, action }: { projectId: string; action: 'ACCEPT' | 'DECLINE' }) =>
      projectService.respondToInvite(projectId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', 'my-invites'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['marketplace'] });
    },
    meta: { errorContext: 'invites.respond' },
  });

  // Fetch applications for a specific project (Project Owner)
  const useProjectApplications = (projectId: string) => useQuery({
    queryKey: ["projects", projectId, "applications"],
    queryFn: () => projectService.getProjectApplications(projectId),
    enabled: !!projectId,
    meta: { errorContext: 'applications.load' },
  });

  // Review an application (ACCEPT | DECLINE | REJECT)
  const useReviewApplication = (projectId: string) => useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: "ACCEPTED" | "DECLINED" | "REJECTED" | "CANCELLED" }) =>
      projectService.reviewApplication(projectId, applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", projectId, "applications"] });
      queryClient.invalidateQueries({ queryKey: ["projects", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    meta: { errorContext: 'applications.review' },
  });

  // Cancel an application (Applicant or Owner)
  const useCancelApplication = () => useMutation({
    mutationFn: (applicationId: string) => projectService.cancelApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", "my-applications"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    meta: { errorContext: 'applications.cancel' },
  });

  // Fetch applications submitted by current user
  const useMyApplications = () => useQuery({
    queryKey: ["projects", "my-applications"],
    queryFn: () => projectService.getMyApplications(),
    meta: { errorContext: 'applications.load' },
  });

  // Apply to join a project
  const useApplyToProject = () => useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: { message?: string; role?: string; portfolioLink?: string } }) =>
      projectService.applyToProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["marketplace"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", "my-applications"] });
    },
    meta: { errorContext: 'applications.apply' },
  });

  return {
    useAllProjects,
    useProjectsWithMessages,
    useProjectDetail,
    useCreateProject,
    useUploadProjectCover,
    useUpdateProject,
    useDeleteProject,
    useProjectMetadata,
    useMarketplaceProjects,
    useInviteCollaborator,
    useUploadProjectFile,
    useDeleteProjectFile,
    useSendProjectMessage,
    useCreateProjectTask,
    useUpdateProjectTaskStatus,
    useRemoveCollaborator,
    useMyInvites,
    useRespondToInvite,
    useApplyToProject,
    useProjectApplications,
    useReviewApplication,
    useCancelApplication,
    useMyApplications,
  };
};
