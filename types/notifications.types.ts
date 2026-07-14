export type NotificationType =
  | "INVITE"
  | "SYSTEM"
  | "PROJECT_CREATED"
  | "TASK_ASSIGNED"
  | "MESSAGE";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link: string | null;
  createdAt: string;
  updatedAt: string;
}
