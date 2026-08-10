import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ProjectsParams } from '@/services/admin/projects.service';

export const useProjects = (params: ProjectsParams) => {
  return useQuery({
    queryKey: ['adminProjects', params],
    queryFn: async () => {
      const response = await axios.get('/api/admin/projects', { params });
      return response.data;
    },
  });
};
