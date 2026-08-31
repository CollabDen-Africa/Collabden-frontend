import React, { useState } from 'react';
import {
  Save,
  ChevronDown,
  UserCheck,
  Eye,
  BadgeCheck,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { SectionCard } from '@/components/ui/SectionCard';
import { SharedToggleRow } from '@/components/ui/SharedToggleRow';

export default function PlatformSettingsUsers({ onTriggerConfirm} : { onTriggerConfirm: (payload: any) => void}) {
  // State for toggles
  const [toggles, setToggles] = useState({
    // Account Registration
    phoneRequired: false,
    dobRequired: false,
    stageNameRequired: true,
    termsRequired: true,
    ageVerification: true,
    // Profile Visibility
    allowPrivateProfile: true,
    showOnlineStatus: true,
    allowConnectionsList: false,
    // Verification Requirements
    verifyToSell: true,
    verifyToWithdraw: true,
    verifyToEscrow: true,
    showVerifiedBadge: true,
    // Restrictions
    allowAdminSuspend: true,
    autoFlagSuspicious: true,
  });

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Save payload for the modal
    const handleSave = () => {
      onTriggerConfirm({
        title: "Confirm Account Setting Change",
        subtitle: "This change significantly affects all user accounts.",
        impactTitle: "Enabling Age Verification (18+)", 
        impactList: [
          "Existing users without date of birth on file will be prompted to update.",
          "Users who cannot confirm age will lose access to restricted features.",
          "No accounts will be automatically deleted — access is just limited.",
          "A platform notification will be sent to all affected users."
        ]
      });
    };

  const renderIcon = (IconComp: any, theme: 'green' | 'purple' | 'red' = 'green') => {
      const themes = {
        green: "text-primary-green bg-primary-green/10 border-primary-green/20",
        purple: "text-[#A78BFA] bg-[#A78BFA]/10 border-[#A78BFA]/20",
        red: "text-accent-red bg-accent-red/10 border-accent-red/20"
      };
      return (
        <div className={`flex justify-center items-center w-9 h-9 border rounded-xl ${themes[theme].split(' ').slice(1).join(' ')}`}>
          <IconComp className={`w-4.25 h-4.25 ${themes[theme].split(' ')[0]}`} />
        </div>
      );
    };

  return (
      <div className="flex flex-col gap-4.5 w-full">
        <SectionCard icon={renderIcon(UserCheck)} title="Account Registration Requirements" subtitle="Define what information and steps are required to register">
          <div className="flex flex-col w-full mt-2">
            <SharedToggleRow title="Phone Number Required at Sign-Up" description="Users must provide a valid phone number during registration" isActive={toggles.phoneRequired} onToggle={() => handleToggle('phoneRequired')} />
            <SharedToggleRow title="Date of Birth Required" description="Users must enter their date of birth to register" isActive={toggles.dobRequired} onToggle={() => handleToggle('dobRequired')} />
            <SharedToggleRow title="Stage Name Required" description="Artists must set a stage name before completing onboarding" isActive={toggles.stageNameRequired} onToggle={() => handleToggle('stageNameRequired')} />
            <SharedToggleRow title="Agree to Terms Required" description="Users must accept Terms of Service and Privacy Policy" isActive={toggles.termsRequired} onToggle={() => handleToggle('termsRequired')} />
            <SharedToggleRow title="Age Verification (18+)" description="Users must confirm they are 18 or older" isActive={toggles.ageVerification} onToggle={() => handleToggle('ageVerification')} isLast />
          </div>
        </SectionCard>
  
        <SectionCard icon={renderIcon(Eye)} title="Profile Visibility Rules" subtitle="Control what parts of user profiles are visible to others">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-4 mt-2">
            <SelectField label="Default Profile Visibility" value="Public" helperText="Applied to all new accounts" />
            <SelectField label="Contact Info Visibility" value="Hidden (by default)" helperText="User email and phone display preference" />
          </div>
          <div className="flex flex-col w-full">
            <SharedToggleRow title="Allow Users to Set Profiles to Private" description="Users can hide their profiles from discovery" isActive={toggles.allowPrivateProfile} onToggle={() => handleToggle('allowPrivateProfile')} />
            <SharedToggleRow title="Show Online Status" description="Display when users were last active" isActive={toggles.showOnlineStatus} onToggle={() => handleToggle('showOnlineStatus')} />
            <SharedToggleRow title="Allow Users to See Each Others Connections" description="A collaborator list is visible to others" isActive={toggles.allowConnectionsList} onToggle={() => handleToggle('allowConnectionsList')} isLast />
          </div>
        </SectionCard>
  
        <SectionCard icon={renderIcon(BadgeCheck, 'purple')} title="Verification Requirements" subtitle="Define what features require identity verification">
          <div className="flex flex-col w-full mt-2">
            <SharedToggleRow title="Verification Required to Sell on Marketplace" description="Unverified users cannot post services for sale" isActive={toggles.verifyToSell} onToggle={() => handleToggle('verifyToSell')} />
            <SharedToggleRow title="Verification Required to Withdraw Earnings" description="Payouts require a verified identity" isActive={toggles.verifyToWithdraw} onToggle={() => handleToggle('verifyToWithdraw')} />
            <SharedToggleRow title="Verification Required to Enter Escrow" description="Escrow-backed projects require both parties verified" isActive={toggles.verifyToEscrow} onToggle={() => handleToggle('verifyToEscrow')} />
            <SharedToggleRow title="Show Verified Badge on Profile" description="Displays a badge on verified users" isActive={toggles.showVerifiedBadge} onToggle={() => handleToggle('showVerifiedBadge')} isLast />
          </div>
        </SectionCard>
  
        <SectionCard icon={renderIcon(ShieldAlert, 'red')} title="Account Restriction Settings" subtitle="Controls for limiting or suspending problematic accounts">
          <div className="flex flex-row items-start p-3 gap-2.5 w-full bg-accent-yellow/4 border border-accent-yellow/20 rounded-xl mb-4 mt-2">
            <AlertCircle className="w-3.5 h-3.5 text-accent-yellow shrink-0 mt-0.5" />
            <p className="text-xs text-accent-yellow leading-relaxed">Changes to restriction settings may affect access for currently locked accounts.</p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-4">
            <SelectField label="Max Failed Logins Before Lock" value="5 attempts" helperText="Account locked after this many login failures" />
            <SelectField label="Account Lock Duration" value="30 minutes" />
          </div>
          <div className="flex flex-col w-full">
            <SharedToggleRow title="Allow Admins to Temporarily Suspend Accounts" description="Support and Super Admins can suspend user accounts" isActive={toggles.allowAdminSuspend} onToggle={() => handleToggle('allowAdminSuspend')} />
            <SharedToggleRow title="Auto-Flag Accounts with Unusual Activity" description="Suspicious accounts flagged for admin review" isActive={toggles.autoFlagSuspicious} onToggle={() => handleToggle('autoFlagSuspicious')} isLast />
          </div>
        </SectionCard>
  
        <div className="flex flex-row items-center justify-between px-5 py-3.5 w-full bg-[#121415] border border-white/5 rounded-xl mt-2">
          <span className="text-xs text-white/45 w-82.5 leading-relaxed">Changes will apply platform-wide and be recorded in Change History</span>
          <div className="flex items-center gap-2.5">
            <Button variant="ghost" size="sm">Discard</Button>
            <Button variant="primary" size="sm" icon={Save} iconPosition="left" onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </div>
    );
  }

/* --- Subcomponent --- */



function SelectField({ label, value, helperText }: { label: string; value: string; helperText?: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[11px] font-semibold text-white/45">{label}</label>
      <div className="relative w-full">
        <select className="w-full px-3.5 py-2.5 bg-white/3 border border-white/10 rounded-lg text-[13px] font-['Raleway'] text-white appearance-none focus:outline-none focus:border-primary-green/50">
          <option>{value}</option>
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/45 pointer-events-none" />
      </div>
      {helperText && (
        <span className="text-[10px] text-white/45 mt-0.5">{helperText}</span>
      )}
    </div>
  );
}
