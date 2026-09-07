import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export type SupportedCurrency = "NGN" | "USD" | "GBP" | "EUR" | "KES" | "GHS";

export interface GeneralSettingsData {
  platformName?: string;
  supportEmail?: string;
  primaryColor?: string;
  logoUrl?: string | null;
  defaultLanguage?: string;
  defaultCurrency?: SupportedCurrency | string;
  timezone?: string;
  allowNewRegistrations?: boolean;
  maintenanceMode?: boolean;
  enableMarketplace?: boolean;
  tagline?: string;
  website?: string;
  dateFormat?: string;
  [key: string]: any;
}

export interface UserSettingsData {
  phoneRequiredAtSignUp?: boolean;
  dobRequired?: boolean;
  stageNameRequired?: boolean;
  agreeToTermsRequired?: boolean;
  ageVerificationRequired?: boolean;
  defaultProfileVisibility?: "Public" | "Private" | "Connections Only";
  contactInfoVisibility?: "Hidden" | "Connections Only" | "Public";
  allowUsersToSetPrivate?: boolean;
  showOnlineStatus?: boolean;
  allowSeeEachOthersConnections?: boolean;
  verificationToSellOnMarketplace?: boolean;
  verificationToWithdrawEarnings?: boolean;
  verificationToEnterEscrow?: boolean;
  showVerifiedBadge?: boolean;
  maxFailedLoginsBeforeLock?: number;
  accountLockDuration?: "15" | "30" | "60" | "1440" | string;
  allowAdminsToSuspend?: boolean;
  autoFlagUnusualActivity?: boolean;
  [key: string]: any;
}

export interface MarketplaceSettingsData {
  listingApprovalRequired?: boolean;
  allowGuestBrowsing?: boolean;
  allowBuyerRegistrations?: boolean;
  allowSellerRegistrations?: boolean;
  maxActiveListingsPerUser?: number;
  requireProjectBudget?: boolean;
  requireProjectDeadline?: boolean;
  allowFixedPriceProjects?: boolean;
  allowHourlyProjects?: boolean;
  minimumProjectBudget?: number;
  projectPostingCooldownHours?: number;
  defaultCollaboratorVisibility?: "all" | "verified" | "connections";
  showCollaboratorRatings?: boolean;
  showCollaboratorReviews?: boolean;
  allowCollaboratorsToHideEarnings?: boolean;
  searchEnabled?: boolean;
  featuredListingsEnabled?: boolean;
  allowSponsoredListings?: boolean;
  searchResultsPerPage?: number;
  enableLocationBasedSearch?: boolean;
  enableSkillBasedSearch?: boolean;
  [key: string]: any;
}

export interface NotificationSettingsData {
  emailNotificationsEnabled?: boolean;
  emailSenderName?: string;
  emailSenderAddress?: string;
  emailFooterText?: string | null;
  notifyOnNewRegistration?: boolean;
  notifyOnProjectInvite?: boolean;
  notifyOnPaymentReceived?: boolean;
  notifyOnAccountFlagged?: boolean;
  inAppNotificationsEnabled?: boolean;
  notifyOnNewMessage?: boolean;
  notifyOnConnectionRequest?: boolean;
  notifyOnProjectUpdate?: boolean;
  notifyOnMilestoneCompleted?: boolean;
  systemAnnouncementsEnabled?: boolean;
  activeAnnouncementTitle?: string | null;
  activeAnnouncementBody?: string | null;
  activeAnnouncementType?: "info" | "warning" | "critical";
  [key: string]: any;
}

export interface AuditHistoryItem {
  id: string | number;
  settingName: string;
  category: string;
  previousValue: string;
  newValue: string;
  adminId?: string;
  performedAt?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  admin?: {
    id?: string;
    email?: string;
    role?: string;
  };
  // Normalized UI aliases for backward compatibility
  section?: string;
  setting?: string;
  prevValue?: string;
  adminEmail?: string;
  date?: string;
  createdAt?: string;
}

export interface AuditHistoryResponse {
  items: AuditHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SettingsUpdateResponse<T> {
  message: string;
  settings: T;
  significantChanges?: string[];
  warning?: string;
}

export const adminSettingsService = {
  // General Platform Settings
  getGeneralSettings: async (): Promise<GeneralSettingsData> => {
    const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_SETTINGS.GENERAL);
    return res.data?.data || res.data;
  },

  updateGeneralSettings: async (
    payload: Partial<GeneralSettingsData>
  ): Promise<SettingsUpdateResponse<GeneralSettingsData> | GeneralSettingsData> => {
    const res = await axiosInstance.patch(API_ENDPOINTS.ADMIN_SETTINGS.GENERAL, payload);
    return res.data;
  },

  // User & Account Settings
  getUserSettings: async (): Promise<UserSettingsData> => {
    const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_SETTINGS.USERS);
    return res.data?.data || res.data;
  },

  updateUserSettings: async (
    payload: Partial<UserSettingsData>
  ): Promise<SettingsUpdateResponse<UserSettingsData> | UserSettingsData> => {
    const res = await axiosInstance.patch(API_ENDPOINTS.ADMIN_SETTINGS.USERS, payload);
    return res.data;
  },

  // Marketplace Settings
  getMarketplaceSettings: async (): Promise<MarketplaceSettingsData> => {
    const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_SETTINGS.MARKETPLACE);
    return res.data?.data || res.data;
  },

  updateMarketplaceSettings: async (
    payload: Partial<MarketplaceSettingsData>
  ): Promise<SettingsUpdateResponse<MarketplaceSettingsData> | MarketplaceSettingsData> => {
    const res = await axiosInstance.patch(API_ENDPOINTS.ADMIN_SETTINGS.MARKETPLACE, payload);
    return res.data;
  },

  // Notification Settings
  getNotificationSettings: async (): Promise<NotificationSettingsData> => {
    const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_SETTINGS.NOTIFICATIONS);
    return res.data?.data || res.data;
  },

  updateNotificationSettings: async (
    payload: Partial<NotificationSettingsData>
  ): Promise<SettingsUpdateResponse<NotificationSettingsData> | NotificationSettingsData> => {
    const res = await axiosInstance.patch(API_ENDPOINTS.ADMIN_SETTINGS.NOTIFICATIONS, payload);
    return res.data;
  },

  // System Announcement
  publishAnnouncement: async (payload: {
    title: string;
    body: string;
    type?: "info" | "warning" | "critical";
  }) => {
    const res = await axiosInstance.post(API_ENDPOINTS.ADMIN_SETTINGS.NOTIFICATIONS_ANNOUNCEMENT, payload);
    return res.data;
  },

  // Notification Preview
  previewNotification: async (payload: {
    type: "email" | "in-app" | "announcement";
    templateKey: string;
    variables?: Record<string, any>;
  }) => {
    const res = await axiosInstance.post(API_ENDPOINTS.ADMIN_SETTINGS.NOTIFICATIONS_PREVIEW, payload);
    return res.data;
  },

  // Settings Audit History
  getSettingsAuditHistory: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    settingName?: string;
    adminId?: string;
  }): Promise<AuditHistoryResponse> => {
    const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_SETTINGS.USERS_HISTORY, { params });
    const raw = res.data?.data || res.data;
    const rawLogs: any[] = raw?.logs || raw?.history || raw?.items || (Array.isArray(raw) ? raw : []);

    const items: AuditHistoryItem[] = rawLogs.map((log) => ({
      id: log.id || `${log.settingName}-${log.performedAt}`,
      settingName: log.settingName || log.setting || "Configuration",
      category: log.category || log.section || "General",
      previousValue: String(log.previousValue ?? log.prevValue ?? "N/A"),
      newValue: String(log.newValue ?? "N/A"),
      adminId: log.adminId,
      performedAt: log.performedAt || log.createdAt || log.date,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      admin: log.admin,
      // Backward compatibility normalized properties
      section: log.category || log.section || "General",
      setting: log.settingName || log.setting || "Configuration",
      prevValue: String(log.previousValue ?? log.prevValue ?? "N/A"),
      adminEmail: log.admin?.email || (typeof log.admin === "string" ? log.admin : undefined),
      date: log.performedAt
        ? new Date(log.performedAt).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : log.date || "Recent",
    }));

    const total = raw?.total ?? items.length;
    const limit = params?.limit || 10;
    const page = params?.page || 1;
    const totalPages = raw?.totalPages ?? Math.max(1, Math.ceil(total / limit));

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  },
};

