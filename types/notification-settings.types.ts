export interface NotificationSetting {
  id: string;
  userId: string;
  inApp: boolean;
  email: boolean;
  sms: boolean;
  frequency: "IMMEDIATE" | "DAILY" | "WEEKLY";
  createdAt: string;
  updatedAt: string;
}

export interface UpdateNotificationSettingsPayload {
  inApp?: boolean;
  email?: boolean;
  sms?: boolean;
  frequency?: "IMMEDIATE" | "DAILY" | "WEEKLY";
}
