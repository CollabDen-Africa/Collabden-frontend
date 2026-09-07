"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiShield,
  FiInfo,
  FiAlertCircle,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import { Tabs } from "@/components/ui/Tabs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import GeneralSettings from "./GeneralTab";
import UsersPane from "./users/UsersTab";
import MarketplacePane from "./MarketplaceTab";
import PaymentsPane from "./payment/PaymentsTab";
import NotificationsTab from "./notifications/NotificationsTab";
import FeaturesTab from "./FeaturesTab";
import ChangeHistoryTab from "./ChangeHistoryTab";
import ConfirmChangeModal from "./users/ConfirmChangeModal";
import ConfirmPaymentChangeModal from "./payment/ConfirmPaymentChangeModal";
import { useAdminSettings } from "@/hooks/admin/useAdminSettings";

interface SettingsManagerProps {
  currentUser?: {
    role: string;
    accessLevel: string;
  };
}

const TAB_SLUG_MAP: Record<string, string> = {
  general: "General",
  users: "Users",
  marketplace: "Marketplace",
  payments: "Payments",
  payment: "Payments",
  notifications: "Notifications",
  features: "Features",
  history: "Change History",
  "change-history": "Change History",
};

const TAB_NAME_TO_SLUG: Record<string, string> = {
  General: "general",
  Users: "users",
  Marketplace: "marketplace",
  Payments: "payments",
  Notifications: "notifications",
  Features: "features",
  "Change History": "history",
};

export default function SettingsManager({
  currentUser = { role: "Super Admin", accessLevel: "Full Access" },
}: SettingsManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const adminSettings = useAdminSettings();

  const tabList = [
    "General",
    "Users",
    "Marketplace",
    "Payments",
    "Notifications",
    "Features",
    "Change History",
  ];

  const queryTab = searchParams.get("tab")?.toLowerCase();
  const initialTab = (queryTab && TAB_SLUG_MAP[queryTab]) || "General";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [modals, setModals] = useState({
    confirmUserChange: false,
    confirmPaymentChange: false,
  });
  const [modalPayload, setModalPayload] = useState<any>({});

  // Sync tab with URL search parameter if changed externally
  useEffect(() => {
    if (queryTab && TAB_SLUG_MAP[queryTab]) {
      setActiveTab(TAB_SLUG_MAP[queryTab]);
    }
  }, [queryTab]);

  const handleTabChange = (tab: string) => {
    adminSettings.clearMessages();
    setActiveTab(tab);
    const slug = TAB_NAME_TO_SLUG[tab] || "general";
    router.replace(`/admin/settings?tab=${slug}`, { scroll: false });
  };

  const toggleModal = (modalName: keyof typeof modals, isOpen: boolean) => {
    setModals((prev) => ({ ...prev, [modalName]: isOpen }));
  };

  const handleTriggerUserConfirm = (payload: any) => {
    setModalPayload(payload);
    toggleModal("confirmUserChange", true);
  };

  const handleConfirmUserSave = async () => {
    if (modalPayload.payload) {
      await adminSettings.saveUserSettings(modalPayload.payload);
    }
    toggleModal("confirmUserChange", false);
  };

  const handleConfirmPaymentSave = () => {
    toggleModal("confirmPaymentChange", false);
  };

  // Header Descriptions
  const headerContent: Record<string, any> = {
    General: {
      title: "General Platform Settings",
      desc: "Configure platform identity, regional defaults, and global availability flags.",
      banner: {
        type: "warning",
        text: "Access to Platform Settings is restricted to authorized administrators. All modifications are immutably logged.",
      },
    },
    Users: {
      title: "Users & Account Controls",
      desc: "Configure user registration rules, identity verification gates, and profile discovery.",
    },
    Marketplace: {
      title: "Marketplace Rules & Discovery",
      desc: "Manage listing approvals, budget requirements, and search filters.",
    },
    Payments: {
      title: "Payment & Fee Configurations",
      desc: "Manage platform commission rates, withdrawal thresholds, and payout schedules.",
      banner: {
        type: "info",
        text: "Financial changes impact active contracts and fee calculations. Ensure regulatory compliance before saving.",
      },
    },
    Notifications: {
      title: "Notification & Alert Preferences",
      desc: "Configure automated email and in-app triggers for platform events.",
    },
    Features: {
      title: "Feature Flags",
      desc: "Toggle experimental or modular platform features.",
    },
    "Change History": {
      title: "Settings Audit Trail",
      desc: "Immutable change history recording all admin configuration updates.",
    },
  };

  const activeHeader = headerContent[activeTab] || {
    title: activeTab,
    desc: "Settings configuration.",
  };

  return (
    <div className="flex flex-col w-full max-w-6xl text-white font-sans mx-auto gap-4">
      {/* Breadcrumbs Navigation */}
      <div className="px-2">
        <Breadcrumbs
          items={[
            { label: "Admin Console", href: "/admin/dashboard" },
            { label: "Settings", href: "/admin/settings" },
            { label: activeTab },
          ]}
        />
      </div>

      <div className="flex flex-col w-full bg-card-bg-alt/40 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header & Role Badge */}
        <div className="flex flex-col p-6 md:p-8 pb-0">
          <div className="flex flex-row justify-between items-start w-full mb-6">
            <div className="flex flex-col">
              <h1 className="font-bold text-xl md:text-2xl text-white tracking-tight">
                {activeHeader.title}
              </h1>
              <p className="text-xs text-white/50 mt-1">{activeHeader.desc}</p>
            </div>
            <div className="flex items-center px-3 py-1.5 gap-1.5 bg-primary-green/10 border border-primary-green/30 rounded-lg shrink-0">
              <FiShield className="w-3.5 h-3.5 text-primary-green" />
              <span className="font-bold text-[11px] text-primary-green">
                {currentUser.role} — {currentUser.accessLevel}
              </span>
            </div>
          </div>

          {/* Dynamic Save Feedback */}
          {adminSettings.saveSuccess && (
            <div className="flex items-center gap-2 p-3 w-full bg-primary-green/10 border border-primary-green/30 rounded-xl mb-4 text-primary-green text-xs font-medium">
              <FiCheckCircle className="w-4 h-4 shrink-0" />
              <span>{adminSettings.saveSuccess}</span>
            </div>
          )}

          {/* Warning Banner from backend significant changes */}
          {adminSettings.warningMessage && (
            <div className="flex items-center gap-2 p-3 w-full bg-accent-yellow/10 border border-accent-yellow/30 rounded-xl mb-4 text-accent-yellow text-xs font-medium">
              <FiAlertCircle className="w-4 h-4 shrink-0" />
              <span>{adminSettings.warningMessage}</span>
            </div>
          )}

          {adminSettings.error && (
            <div className="flex items-center gap-2 p-3 w-full bg-accent-red/10 border border-accent-red/30 rounded-xl mb-4 text-accent-red text-xs font-medium">
              <FiAlertTriangle className="w-4 h-4 shrink-0" />
              <span>{adminSettings.error}</span>
            </div>
          )}

          {/* Conditional Info Banner */}
          {activeHeader.banner && (
            <div
              className={`flex flex-row items-center p-3 gap-2.5 w-full border rounded-xl mb-6 ${
                activeHeader.banner.type === "info"
                  ? "bg-secondary-blue/10 border-secondary-blue/30 text-secondary-blue"
                  : "bg-accent-yellow/10 border-accent-yellow/30 text-accent-yellow"
              }`}
            >
              {activeHeader.banner.type === "info" ? (
                <FiInfo className="w-4 h-4 shrink-0" />
              ) : (
                <FiAlertCircle className="w-4 h-4 shrink-0" />
              )}
              <p className="text-xs leading-relaxed">
                {activeHeader.banner.text}
              </p>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="px-6 md:px-8">
          <Tabs
            tabs={tabList}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>

        {/* Tab Panes */}
        <div className="flex flex-col p-6 md:p-8 w-full bg-black/20">
          {activeTab === "General" && (
            <GeneralSettings
              settings={adminSettings.generalSettings}
              onSave={adminSettings.saveGeneralSettings}
              isSaving={adminSettings.isSaving}
            />
          )}
          {activeTab === "Users" && (
            <UsersPane
              settings={adminSettings.userSettings}
              onTriggerConfirm={handleTriggerUserConfirm}
              isSaving={adminSettings.isSaving}
            />
          )}
          {activeTab === "Marketplace" && (
            <MarketplacePane
              settings={adminSettings.marketplaceSettings}
              onSave={adminSettings.saveMarketplaceSettings}
              isSaving={adminSettings.isSaving}
            />
          )}
          {activeTab === "Payments" && (
            <PaymentsPane
              onTriggerConfirm={(payload) => {
                setModalPayload(payload);
                toggleModal("confirmPaymentChange", true);
              }}
            />
          )}
          {activeTab === "Notifications" && (
            <NotificationsTab
              settings={adminSettings.notificationSettings}
              onSave={adminSettings.saveNotificationSettings}
              onPublishAnnouncement={adminSettings.publishAnnouncement}
              isSaving={adminSettings.isSaving}
            />
          )}
          {activeTab === "Features" && <FeaturesTab />}
          {activeTab === "Change History" && (
            <ChangeHistoryTab
              auditHistory={adminSettings.auditHistory}
              auditTotal={adminSettings.auditTotal}
              auditPage={adminSettings.auditPage}
              auditLimit={adminSettings.auditLimit}
              auditSearch={adminSettings.auditSearch}
              auditCategory={adminSettings.auditCategory}
              onPageChange={adminSettings.setAuditPage}
              onSearchChange={adminSettings.setAuditSearch}
              onCategoryChange={adminSettings.setAuditCategory}
              isLoading={adminSettings.isLoading}
            />
          )}
        </div>

        {/* Modals */}
        <ConfirmChangeModal
          isOpen={modals.confirmUserChange}
          onClose={() => toggleModal("confirmUserChange", false)}
          onConfirm={handleConfirmUserSave}
          title={modalPayload.title}
          subtitle={modalPayload.subtitle}
          impactTitle={modalPayload.impactTitle}
          impactList={modalPayload.impactList}
        />

        <ConfirmPaymentChangeModal
          isOpen={modals.confirmPaymentChange}
          onClose={() => toggleModal("confirmPaymentChange", false)}
          onConfirm={handleConfirmPaymentSave}
          changes={modalPayload.changes}
        />
      </div>
    </div>
  );
}