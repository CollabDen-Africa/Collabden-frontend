import { useState, useEffect, useCallback } from "react";
import {
  adminSettingsService,
  GeneralSettingsData,
  UserSettingsData,
  MarketplaceSettingsData,
  NotificationSettingsData,
  AuditHistoryItem,
} from "@/services/admin/settings.service";

export function useAdminSettings() {
  const [generalSettings, setGeneralSettings] = useState<GeneralSettingsData>({
    platformName: "Collabden",
    tagline: "Where Africa's Music Professionals Collaborate",
    supportEmail: "support@collabden.africa",
    website: "https://collabden.africa",
    defaultLanguage: "en",
    defaultCurrency: "NGN",
    timezone: "Africa/Lagos (UTC+1)",
    dateFormat: "DD / MM / YYYY",
    allowNewRegistrations: true,
    maintenanceMode: false,
    enableMarketplace: true,
  });

  const [userSettings, setUserSettings] = useState<UserSettingsData>({
    phoneRequiredAtSignUp: false,
    dobRequired: false,
    stageNameRequired: false,
    agreeToTermsRequired: true,
    ageVerificationRequired: true,
    defaultProfileVisibility: "Public",
    contactInfoVisibility: "Hidden",
    allowUsersToSetPrivate: true,
    showOnlineStatus: true,
    allowSeeEachOthersConnections: false,
    verificationToSellOnMarketplace: true,
    verificationToWithdrawEarnings: true,
    verificationToEnterEscrow: true,
    showVerifiedBadge: true,
    maxFailedLoginsBeforeLock: 5,
    accountLockDuration: "30",
    allowAdminsToSuspend: true,
    autoFlagUnusualActivity: true,
  });

  const [marketplaceSettings, setMarketplaceSettings] = useState<MarketplaceSettingsData>({
    listingApprovalRequired: false,
    allowGuestBrowsing: true,
    allowBuyerRegistrations: true,
    allowSellerRegistrations: true,
    maxActiveListingsPerUser: 10,
    requireProjectBudget: false,
    requireProjectDeadline: false,
    allowFixedPriceProjects: true,
    allowHourlyProjects: true,
    minimumProjectBudget: 0,
    projectPostingCooldownHours: 0,
    defaultCollaboratorVisibility: "all",
    showCollaboratorRatings: true,
    showCollaboratorReviews: true,
    allowCollaboratorsToHideEarnings: true,
    searchEnabled: true,
    featuredListingsEnabled: true,
    allowSponsoredListings: false,
    searchResultsPerPage: 20,
    enableLocationBasedSearch: true,
    enableSkillBasedSearch: true,
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsData>({
    emailNotificationsEnabled: true,
    emailSenderName: "Collabden",
    emailSenderAddress: "no-reply@collabden.africa",
    emailFooterText: "You are receiving this email because of your Collabden account.",
    notifyOnNewRegistration: true,
    notifyOnProjectInvite: true,
    notifyOnPaymentReceived: true,
    notifyOnAccountFlagged: true,
    inAppNotificationsEnabled: true,
    notifyOnNewMessage: true,
    notifyOnConnectionRequest: true,
    notifyOnProjectUpdate: true,
    notifyOnMilestoneCompleted: true,
    systemAnnouncementsEnabled: true,
    activeAnnouncementTitle: null,
    activeAnnouncementBody: null,
    activeAnnouncementType: "info",
  });

  const [auditHistory, setAuditHistory] = useState<AuditHistoryItem[]>([]);
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditPage, setAuditPage] = useState(1);
  const [auditLimit, setAuditLimit] = useState(10);
  const [auditSearch, setAuditSearch] = useState("");
  const [auditCategory, setAuditCategory] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch all settings
  const fetchAllSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [genRes, userRes, marketRes, notifRes] = await Promise.allSettled([
        adminSettingsService.getGeneralSettings(),
        adminSettingsService.getUserSettings(),
        adminSettingsService.getMarketplaceSettings(),
        adminSettingsService.getNotificationSettings(),
      ]);

      if (genRes.status === "fulfilled" && genRes.value) {
        setGeneralSettings((prev) => ({ ...prev, ...genRes.value }));
      }
      if (userRes.status === "fulfilled" && userRes.value) {
        setUserSettings((prev) => ({ ...prev, ...userRes.value }));
      }
      if (marketRes.status === "fulfilled" && marketRes.value) {
        setMarketplaceSettings((prev) => ({ ...prev, ...marketRes.value }));
      }
      if (notifRes.status === "fulfilled" && notifRes.value) {
        setNotificationSettings((prev) => ({ ...prev, ...notifRes.value }));
      }
    } catch (err: any) {
      console.error("Error fetching admin settings:", err);
      setError(err?.message || "Failed to load platform settings.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch audit history
  const fetchAuditHistory = useCallback(async () => {
    try {
      const res = await adminSettingsService.getSettingsAuditHistory({
        page: auditPage,
        limit: auditLimit,
        search: auditSearch || undefined,
        category: auditCategory && auditCategory !== "All Sections" ? auditCategory : undefined,
      });
      setAuditHistory(res.items);
      setAuditTotal(res.total);
    } catch (err) {
      console.error("Error fetching audit history:", err);
    }
  }, [auditPage, auditLimit, auditSearch, auditCategory]);

  useEffect(() => {
    fetchAllSettings();
  }, [fetchAllSettings]);

  useEffect(() => {
    fetchAuditHistory();
  }, [fetchAuditHistory]);

  // Update handlers
  const saveGeneralSettings = async (payload: Partial<GeneralSettingsData>) => {
    setIsSaving(true);
    setError(null);
    setWarningMessage(null);
    try {
      const res = await adminSettingsService.updateGeneralSettings(payload);
      const updated = "settings" in res ? res.settings : res;
      if ("warning" in res && res.warning) {
        setWarningMessage(res.warning);
      }
      setGeneralSettings((prev) => ({ ...prev, ...updated }));
      setSaveSuccess("General settings updated successfully.");
      fetchAuditHistory();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to update general settings.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveUserSettings = async (payload: Partial<UserSettingsData>) => {
    setIsSaving(true);
    setError(null);
    setWarningMessage(null);
    try {
      const res = await adminSettingsService.updateUserSettings(payload);
      const updated = "settings" in res ? res.settings : res;
      if ("warning" in res && res.warning) {
        setWarningMessage(res.warning);
      }
      setUserSettings((prev) => ({ ...prev, ...updated }));
      setSaveSuccess("User settings updated successfully.");
      fetchAuditHistory();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to update user settings.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveMarketplaceSettings = async (payload: Partial<MarketplaceSettingsData>) => {
    setIsSaving(true);
    setError(null);
    setWarningMessage(null);
    try {
      const res = await adminSettingsService.updateMarketplaceSettings(payload);
      const updated = "settings" in res ? res.settings : res;
      if ("warning" in res && res.warning) {
        setWarningMessage(res.warning);
      }
      setMarketplaceSettings((prev) => ({ ...prev, ...updated }));
      setSaveSuccess("Marketplace settings updated successfully.");
      fetchAuditHistory();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to update marketplace settings.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveNotificationSettings = async (payload: Partial<NotificationSettingsData>) => {
    setIsSaving(true);
    setError(null);
    setWarningMessage(null);
    try {
      const res = await adminSettingsService.updateNotificationSettings(payload);
      const updated = "settings" in res ? res.settings : res;
      setNotificationSettings((prev) => ({ ...prev, ...updated }));
      setSaveSuccess("Notification settings updated successfully.");
      fetchAuditHistory();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.error || err?.message || "Failed to update notification settings.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const publishAnnouncement = async (payload: { title: string; body: string; type?: "info" | "warning" | "critical" }) => {
    setIsSaving(true);
    setError(null);
    setWarningMessage(null);
    try {
      const res = await adminSettingsService.publishAnnouncement(payload);
      setSaveSuccess(res?.message || "Announcement published successfully.");
      fetchAuditHistory();
      return true;
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed to publish announcement.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    generalSettings,
    userSettings,
    marketplaceSettings,
    notificationSettings,
    auditHistory,
    auditTotal,
    auditPage,
    auditLimit,
    auditSearch,
    auditCategory,
    setAuditPage,
    setAuditLimit,
    setAuditSearch,
    setAuditCategory,
    isLoading,
    isSaving,
    saveSuccess,
    warningMessage,
    error,
    clearMessages: () => {
      setSaveSuccess(null);
      setWarningMessage(null);
      setError(null);
    },
    saveGeneralSettings,
    saveUserSettings,
    saveMarketplaceSettings,
    saveNotificationSettings,
    publishAnnouncement,
    refreshSettings: fetchAllSettings,
    refreshAuditHistory: fetchAuditHistory,
  };
}

