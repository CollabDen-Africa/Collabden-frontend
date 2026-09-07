import React, { useState, useEffect } from "react";
import { FiBell, FiMail, FiSave } from "react-icons/fi";
import { SectionCard } from "@/components/ui/SectionCard";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import { SystemAnnouncement } from "./SystemAnnouncement";
import { NotificationSettingsData } from "@/services/admin/settings.service";

interface NotificationsTabProps {
  settings?: NotificationSettingsData;
  onSave?: (data: Partial<NotificationSettingsData>) => Promise<boolean>;
  onPublishAnnouncement?: (data: {
    title: string;
    body: string;
    type?: "info" | "warning" | "critical";
  }) => Promise<boolean>;
  isSaving?: boolean;
}

export default function NotificationsTab({
  settings = {},
  onSave,
  onPublishAnnouncement,
  isSaving = false,
}: NotificationsTabProps) {
  const [emailToggles, setEmailToggles] = useState({
    notifyOnNewRegistration: settings.notifyOnNewRegistration ?? true,
    notifyOnProjectInvite: settings.notifyOnProjectInvite ?? true,
    notifyOnPaymentReceived: settings.notifyOnPaymentReceived ?? true,
    notifyOnAccountFlagged: settings.notifyOnAccountFlagged ?? true,
    emailNotificationsEnabled: settings.emailNotificationsEnabled ?? true,
  });

  const [inAppToggles, setInAppToggles] = useState({
    notifyOnNewMessage: settings.notifyOnNewMessage ?? true,
    notifyOnConnectionRequest: settings.notifyOnConnectionRequest ?? true,
    notifyOnProjectUpdate: settings.notifyOnProjectUpdate ?? true,
    notifyOnMilestoneCompleted: settings.notifyOnMilestoneCompleted ?? true,
    inAppNotificationsEnabled: settings.inAppNotificationsEnabled ?? true,
    systemAnnouncementsEnabled: settings.systemAnnouncementsEnabled ?? true,
  });

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setEmailToggles({
        notifyOnNewRegistration: settings.notifyOnNewRegistration ?? true,
        notifyOnProjectInvite: settings.notifyOnProjectInvite ?? true,
        notifyOnPaymentReceived: settings.notifyOnPaymentReceived ?? true,
        notifyOnAccountFlagged: settings.notifyOnAccountFlagged ?? true,
        emailNotificationsEnabled: settings.emailNotificationsEnabled ?? true,
      });
      setInAppToggles({
        notifyOnNewMessage: settings.notifyOnNewMessage ?? true,
        notifyOnConnectionRequest: settings.notifyOnConnectionRequest ?? true,
        notifyOnProjectUpdate: settings.notifyOnProjectUpdate ?? true,
        notifyOnMilestoneCompleted: settings.notifyOnMilestoneCompleted ?? true,
        inAppNotificationsEnabled: settings.inAppNotificationsEnabled ?? true,
        systemAnnouncementsEnabled: settings.systemAnnouncementsEnabled ?? true,
      });
    }
  }, [settings]);

  const handleEmailToggle = (key: keyof typeof emailToggles) =>
    setEmailToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  const handleInAppToggle = (key: keyof typeof inAppToggles) =>
    setInAppToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = async () => {
    if (!onSave) return;
    await onSave({
      ...emailToggles,
      ...inAppToggles,
    });
  };

  const renderIcon = (IconComp: any, theme: "blue" | "purple" = "blue") => {
    const themes = {
      blue: "text-secondary-blue bg-secondary-blue/10 border-secondary-blue/20",
      purple:
        "text-secondary-blue bg-secondary-blue/10 border-secondary-blue/20",
    };
    return (
      <div
        className={`flex justify-center items-center w-9 h-9 border rounded-xl ${themes[
          theme
        ]
          .split(" ")
          .slice(1)
          .join(" ")}`}
      >
        <IconComp className={`w-4 h-4 ${themes[theme].split(" ")[0]}`} />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <SectionCard
        icon={renderIcon(FiBell, "blue")}
        title="Notification Settings"
        subtitle="Configure system-wide email and in-app triggers"
      >
        <div className="flex flex-col md:flex-row w-full mt-4 border-t border-white/10">
          <div className="flex flex-col flex-1 py-4 md:pr-6 md:border-r border-white/10 border-b md:border-b-0">
            <div className="flex items-center gap-2 mb-1">
              <FiMail className="w-4 h-4 text-secondary-blue" />
              <span className="font-bold text-xs text-white">
                Email Notifications
              </span>
            </div>
            <div className="flex flex-col w-full mt-1">
              <CompactToggleRow
                title="Global Email Delivery"
                isActive={emailToggles.emailNotificationsEnabled}
                onToggle={() => handleEmailToggle("emailNotificationsEnabled")}
              />
              <CompactToggleRow
                title="New User Registration Alert"
                isActive={emailToggles.notifyOnNewRegistration}
                onToggle={() => handleEmailToggle("notifyOnNewRegistration")}
              />
              <CompactToggleRow
                title="Project Invite Received"
                isActive={emailToggles.notifyOnProjectInvite}
                onToggle={() => handleEmailToggle("notifyOnProjectInvite")}
              />
              <CompactToggleRow
                title="Payment / Escrow Funded Alert"
                isActive={emailToggles.notifyOnPaymentReceived}
                onToggle={() => handleEmailToggle("notifyOnPaymentReceived")}
              />
              <CompactToggleRow
                title="Account Moderation / Flagged Alert"
                isActive={emailToggles.notifyOnAccountFlagged}
                onToggle={() => handleEmailToggle("notifyOnAccountFlagged")}
                isLast
              />
            </div>
          </div>

          <div className="flex flex-col flex-1 py-4 md:pl-6">
            <div className="flex items-center gap-2 mb-1">
              <FiBell className="w-4 h-4 text-primary-green" />
              <span className="font-bold text-xs text-white">
                In-App Notifications
              </span>
            </div>
            <div className="flex flex-col w-full mt-1">
              <CompactToggleRow
                title="Global In-App Delivery"
                isActive={inAppToggles.inAppNotificationsEnabled}
                onToggle={() => handleInAppToggle("inAppNotificationsEnabled")}
              />
              <CompactToggleRow
                title="Real-Time Direct Messages"
                isActive={inAppToggles.notifyOnNewMessage}
                onToggle={() => handleInAppToggle("notifyOnNewMessage")}
              />
              <CompactToggleRow
                title="Collaborator Connection Requests"
                isActive={inAppToggles.notifyOnConnectionRequest}
                onToggle={() => handleInAppToggle("notifyOnConnectionRequest")}
              />
              <CompactToggleRow
                title="Project Milestone & Status Updates"
                isActive={inAppToggles.notifyOnProjectUpdate}
                onToggle={() => handleInAppToggle("notifyOnProjectUpdate")}
              />
              <CompactToggleRow
                title="System Announcement Banners"
                isActive={inAppToggles.systemAnnouncementsEnabled}
                onToggle={() =>
                  handleInAppToggle("systemAnnouncementsEnabled")
                }
                isLast
              />
            </div>
          </div>
        </div>
      </SectionCard>

      <SystemAnnouncement onPublish={onPublishAnnouncement} isSaving={isSaving} />

      <div className="flex flex-row items-center justify-between px-5 py-3.5 w-full bg-card-bg/20 border border-white/5 rounded-xl mt-2">
        <span className="text-xs text-white/50 leading-relaxed">
          Notification preferences will take effect for all automated email & socket triggers
        </span>
        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="sm"
            icon={FiSave}
            iconPosition="left"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function CompactToggleRow({
  title,
  isActive,
  onToggle,
  isLast,
}: {
  title: string;
  isActive: boolean;
  onToggle: () => void;
  isLast?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-3.5 w-full ${
        !isLast ? "border-b border-white/10" : ""
      }`}
    >
      <span className="font-medium text-xs text-white pr-4">{title}</span>
      <Toggle active={isActive} onChange={onToggle} />
    </div>
  );
}
