import React, { useState, useEffect } from "react";
import {
  FiSave,
  FiChevronDown,
  FiUserCheck,
  FiEye,
  FiShield,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import Button from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";
import { SharedToggleRow } from "@/components/ui/SharedToggleRow";
import { UserSettingsData } from "@/services/admin/settings.service";

interface UsersTabProps {
  settings?: UserSettingsData;
  onTriggerConfirm: (payload: any) => void;
  isSaving?: boolean;
}

export default function PlatformSettingsUsers({
  settings = {},
  onTriggerConfirm,
  isSaving = false,
}: UsersTabProps) {
  const [toggles, setToggles] = useState({
    phoneRequiredAtSignUp: settings.phoneRequiredAtSignUp ?? false,
    dobRequired: settings.dobRequired ?? false,
    stageNameRequired: settings.stageNameRequired ?? false,
    agreeToTermsRequired: settings.agreeToTermsRequired ?? true,
    ageVerificationRequired: settings.ageVerificationRequired ?? true,
    // Profile Visibility Rules
    allowUsersToSetPrivate: settings.allowUsersToSetPrivate ?? true,
    showOnlineStatus: settings.showOnlineStatus ?? true,
    allowSeeEachOthersConnections: settings.allowSeeEachOthersConnections ?? false,
    // Verification Requirements
    verificationToSellOnMarketplace: settings.verificationToSellOnMarketplace ?? true,
    verificationToWithdrawEarnings: settings.verificationToWithdrawEarnings ?? true,
    verificationToEnterEscrow: settings.verificationToEnterEscrow ?? true,
    showVerifiedBadge: settings.showVerifiedBadge ?? true,
    // Restrictions
    allowAdminsToSuspend: settings.allowAdminsToSuspend ?? true,
    autoFlagUnusualActivity: settings.autoFlagUnusualActivity ?? true,
  });

  const [maxFailedLogins, setMaxFailedLogins] = useState<number>(
    settings.maxFailedLoginsBeforeLock || 5
  );

  const [lockDuration, setLockDuration] = useState<string>(
    settings.accountLockDuration || "30"
  );

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setToggles({
        phoneRequiredAtSignUp: settings.phoneRequiredAtSignUp ?? false,
        dobRequired: settings.dobRequired ?? false,
        stageNameRequired: settings.stageNameRequired ?? false,
        agreeToTermsRequired: settings.agreeToTermsRequired ?? true,
        ageVerificationRequired: settings.ageVerificationRequired ?? true,
        allowUsersToSetPrivate: settings.allowUsersToSetPrivate ?? true,
        showOnlineStatus: settings.showOnlineStatus ?? true,
        allowSeeEachOthersConnections: settings.allowSeeEachOthersConnections ?? false,
        verificationToSellOnMarketplace: settings.verificationToSellOnMarketplace ?? true,
        verificationToWithdrawEarnings: settings.verificationToWithdrawEarnings ?? true,
        verificationToEnterEscrow: settings.verificationToEnterEscrow ?? true,
        showVerifiedBadge: settings.showVerifiedBadge ?? true,
        allowAdminsToSuspend: settings.allowAdminsToSuspend ?? true,
        autoFlagUnusualActivity: settings.autoFlagUnusualActivity ?? true,
      });
      setMaxFailedLogins(settings.maxFailedLoginsBeforeLock || 5);
      setLockDuration(settings.accountLockDuration || "30");
    }
  }, [settings]);

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    onTriggerConfirm({
      title: "Confirm User Account Settings Change",
      subtitle: "This change affects all platform user accounts globally.",
      impactTitle: "User Security & Registration Rule Changes",
      impactList: [
        "Registration requirements will be updated immediately for all new accounts.",
        "Security rules (failed login limit and verification gates) will take effect instantly.",
        "All changes will be permanently logged in the Platform Audit History.",
      ],
      payload: {
        ...toggles,
        maxFailedLoginsBeforeLock: Number(maxFailedLogins),
        accountLockDuration: lockDuration,
      },
    });
  };

  const renderIcon = (
    IconComp: any,
    theme: "green" | "purple" | "red" = "green"
  ) => {
    const themes = {
      green: "text-primary-green bg-primary-green/10 border-primary-green/20",
      purple: "text-secondary-blue bg-secondary-blue/10 border-secondary-blue/20",
      red: "text-accent-red bg-accent-red/10 border-accent-red/20",
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
        icon={renderIcon(FiUserCheck)}
        title="Account Registration Requirements"
        subtitle="Define what information and steps are required to register"
      >
        <div className="flex flex-col w-full mt-2">
          <SharedToggleRow
            title="Phone Number Required at Sign-Up"
            description="Users must provide a valid phone number during registration"
            isActive={toggles.phoneRequiredAtSignUp}
            onToggle={() => handleToggle("phoneRequiredAtSignUp")}
          />
          <SharedToggleRow
            title="Date of Birth Required"
            description="Users must enter their date of birth to register"
            isActive={toggles.dobRequired}
            onToggle={() => handleToggle("dobRequired")}
          />
          <SharedToggleRow
            title="Stage Name Required"
            description="Artists must set a stage name before completing onboarding"
            isActive={toggles.stageNameRequired}
            onToggle={() => handleToggle("stageNameRequired")}
          />
          <SharedToggleRow
            title="Agree to Terms Required"
            description="Users must accept Terms of Service and Privacy Policy"
            isActive={toggles.agreeToTermsRequired}
            onToggle={() => handleToggle("agreeToTermsRequired")}
          />
          <SharedToggleRow
            title="Age Verification (18+)"
            description="Users must confirm they are 18 or older"
            isActive={toggles.ageVerificationRequired}
            onToggle={() => handleToggle("ageVerificationRequired")}
            isLast
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={renderIcon(FiEye)}
        title="Profile Visibility Rules"
        subtitle="Control what parts of user profiles are visible to others"
      >
        <div className="flex flex-col w-full">
          <SharedToggleRow
            title="Allow Users to Set Profiles to Private"
            description="Users can hide their profiles from discovery"
            isActive={toggles.allowUsersToSetPrivate}
            onToggle={() => handleToggle("allowUsersToSetPrivate")}
          />
          <SharedToggleRow
            title="Show Online Status"
            description="Display when users were last active"
            isActive={toggles.showOnlineStatus}
            onToggle={() => handleToggle("showOnlineStatus")}
          />
          <SharedToggleRow
            title="Allow Users to See Each Other's Connections"
            description="A collaborator list is visible to other verified users"
            isActive={toggles.allowSeeEachOthersConnections}
            onToggle={() => handleToggle("allowSeeEachOthersConnections")}
            isLast
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={renderIcon(FiCheckCircle, "purple")}
        title="Verification Requirements"
        subtitle="Define what features require identity verification"
      >
        <div className="flex flex-col w-full mt-2">
          <SharedToggleRow
            title="Verification Required to Sell on Marketplace"
            description="Unverified users cannot post services for sale"
            isActive={toggles.verificationToSellOnMarketplace}
            onToggle={() => handleToggle("verificationToSellOnMarketplace")}
          />
          <SharedToggleRow
            title="Verification Required to Withdraw Earnings"
            description="Payouts require a verified identity"
            isActive={toggles.verificationToWithdrawEarnings}
            onToggle={() => handleToggle("verificationToWithdrawEarnings")}
          />
          <SharedToggleRow
            title="Verification Required to Enter Escrow"
            description="Escrow-backed projects require both parties verified"
            isActive={toggles.verificationToEnterEscrow}
            onToggle={() => handleToggle("verificationToEnterEscrow")}
          />
          <SharedToggleRow
            title="Show Verified Badge on Profile"
            description="Displays a badge on verified users"
            isActive={toggles.showVerifiedBadge}
            onToggle={() => handleToggle("showVerifiedBadge")}
            isLast
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={renderIcon(FiShield, "red")}
        title="Account Restriction Settings"
        subtitle="Controls for limiting or suspending problematic accounts"
      >
        <div className="flex flex-row items-start p-3 gap-2.5 w-full bg-accent-yellow/5 border border-accent-yellow/20 rounded-xl mb-4 mt-2">
          <FiAlertCircle className="w-4 h-4 text-accent-yellow shrink-0 mt-0.5" />
          <p className="text-xs text-accent-yellow leading-relaxed">
            Changes to restriction settings will apply to future authentication
            attempts platform-wide.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[11px] font-semibold text-white/50">
              Max Failed Logins Before Lock
            </label>
            <div className="relative w-full">
              <select
                value={maxFailedLogins}
                onChange={(e) => setMaxFailedLogins(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-sans text-white appearance-none focus:outline-none focus:border-primary-green transition-colors"
              >
                <option value={3} className="bg-card-bg-alt text-white">3 attempts</option>
                <option value={5} className="bg-card-bg-alt text-white">5 attempts</option>
                <option value={10} className="bg-card-bg-alt text-white">10 attempts</option>
              </select>
              <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[11px] font-semibold text-white/50">
              Account Lock Duration
            </label>
            <div className="relative w-full">
              <select
                value={lockDuration}
                onChange={(e) => setLockDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-sans text-white appearance-none focus:outline-none focus:border-primary-green transition-colors"
              >
                <option value="15" className="bg-card-bg-alt text-white">15 minutes</option>
                <option value="30" className="bg-card-bg-alt text-white">30 minutes</option>
                <option value="60" className="bg-card-bg-alt text-white">1 hour</option>
                <option value="1440" className="bg-card-bg-alt text-white">24 hours</option>
              </select>
              <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
          <SharedToggleRow
            title="Allow Admins to Temporarily Suspend Accounts"
            description="Support and Super Admins can suspend user accounts"
            isActive={toggles.allowAdminsToSuspend}
            onToggle={() => handleToggle("allowAdminsToSuspend")}
          />
          <SharedToggleRow
            title="Auto-Flag Accounts with Unusual Activity"
            description="Suspicious accounts flagged for admin review"
            isActive={toggles.autoFlagUnusualActivity}
            onToggle={() => handleToggle("autoFlagUnusualActivity")}
            isLast
          />
        </div>
      </SectionCard>

      <div className="flex flex-row items-center justify-between px-5 py-3.5 w-full bg-card-bg/20 border border-white/5 rounded-xl mt-2">
        <span className="text-xs text-white/50 leading-relaxed">
          Changes will apply platform-wide and be recorded in Change History
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

