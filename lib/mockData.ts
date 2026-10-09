// Production Clean Data Definitions (Mock data replaced with live schemas and empty initial states)

export const MOCK_USER = null;

export const MOCK_TOP_STATS = [
  { label: "Active Projects", value: "0", hint: "Current projects in progress" },
  { label: "Collaborations", value: "0", hint: "Active collaborators" },
  { label: "Pending Requests", value: "0", hint: "Incoming connection requests" },
];

export const MOCK_ACTIVE_PROJECTS: any[] = [];
export const MOCK_RECENT_ACTIVITY: any[] = [];
export const MOCK_SUGGESTED_PROJECTS: any[] = [];
export const MOCK_SUGGESTED_COLLABORATORS: any[] = [];
export const MOCK_NOTIFICATIONS: any[] = [];

export const PROJECT_GENRES = [
  "Hip-Hop", "Afrobeats", "R&B", "Pop", "Electronic", "Rock", "Jazz", "Classical", "Gospel", "Reggae"
];

export const MOCK_COLLABORATORS: any[] = [];
export const PROJECTS_DATA: any[] = [];
export const MOCK_MESSAGES: any[] = [];

export type ActivitySegmentType = 'name' | 'action' | 'task' | 'update' | 'comment' | 'progress' | 'regular';

export interface ActivitySegment {
  text: string;
  type: ActivitySegmentType;
}

export interface WorkspaceActivity {
  id: string;
  segments: ActivitySegment[];
  timestamp: string;
}

export const MOCK_WORKSPACE_ACTIVITIES: WorkspaceActivity[] = [];
export const MOCK_UPDATES: any[] = [];

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  assignees: string[];
  dueDate: string;
  commentsCount: number;
  attachmentsCount: number;
  priority: Priority;
  progress: number;
  totalSubtasks: number;
  completedSubtasks: number;
}

export interface Column {
  id: string;
  title: string;
  count: number;
  tasks: Task[];
}

export const MOCK_BOARD: Column[] = [
  { id: "todo", title: "To Do", count: 0, tasks: [] },
  { id: "in-progress", title: "In Progress", count: 0, tasks: [] },
  { id: "review", title: "In Review", count: 0, tasks: [] },
  { id: "done", title: "Done", count: 0, tasks: [] },
];

export const MOCK_DASHBOARD_CONVERSATIONS: any[] = [];
export const MOCK_DASHBOARD_MESSAGES: Record<string, any[]> = {};

export const PRIMARY_ROLES = [
  "Producer", "Vocalist", "Songwriter", "Mixing Engineer", "Mastering Engineer", "Instrumentalist", "Sound Designer"
];

export const SPECIALIZATIONS = [
  "Beat Making", "Vocal Tuning", "Arrangement", "Audio Editing", "Scoring", "Mixing"
];

export const PORTFOLIO_ITEMS: any[] = [];
export const ACHIEVEMENTS: any[] = [];
export const INSIGHTS: any[] = [];
export const SOCIAL_LINKS: any[] = [];
export const TESTIMONIALS: any[] = [];

export const SETTINGS_SIDEBAR_LINKS = [
  { id: "general", label: "General Settings", icon: "FiSettings" },
  { id: "members", label: "Members & Permissions", icon: "FiUsers" },
  { id: "billing", label: "Billing & Escrow", icon: "FiCreditCard" },
  { id: "notifications", label: "Notifications", icon: "FiBell" },
];

export const PROFILE_FORM_FIELDS: any[] = [];
