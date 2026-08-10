import { Project } from "./projects.types";
import { Notification } from "./notifications.types";

export interface DashboardData {
  activeProjects: Project[];
  notifications: Notification[];
  stats?: DashboardStat[];
  recentActivity?: DashboardActivity[];
  suggestedProjects?: Project[];
  suggestedCollaborators?: any[];
}

export interface DashboardStat {
  title: string;
  count: string | number;
  subtitle: string;
}

export interface DashboardActivity {
  id: string;
  user: string;
  action: string;
  time: string;
  avatarUrl?: string;
}
