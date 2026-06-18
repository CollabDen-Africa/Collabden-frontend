import { useQuery } from '@tanstack/react-query';
import dashboardService from '@/services/dashboard.service';

export const useDashboard = () => {
  const useDashboardData = () => useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getDashboard(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    useDashboardData,
  };
};
