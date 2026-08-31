import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
} from 'lucide-react';
import { SectionCard } from '@/components/ui/SectionCard';
import Toggle from '@/components/ui/Toggle';
import { SystemAnnouncement } from './SystemAnnouncement';

export default function NotificationsTab() {
  const [emailToggles, setEmailToggles] = useState({
    collabReq: true, payment: true, dispute: true, subscription: true, identity: true, weeklyDigest: false,
  });

  const [inAppToggles, setInAppToggles] = useState({
    realtime: true, projectStatus: true, escrow: true, newListings: false, adminSystem: true, featureRelease: true,
  });

  const handleEmailToggle = (key: keyof typeof emailToggles) => setEmailToggles(prev => ({ ...prev, [key]: !prev[key] }));
  const handleInAppToggle = (key: keyof typeof inAppToggles) => setInAppToggles(prev => ({ ...prev, [key]: !prev[key] }));

  const renderIcon = (IconComp: any, theme: 'blue' | 'purple' = 'blue') => {
    const themes = {
      blue: "text-secondary-blue bg-secondary-blue/10 border-secondary-blue/20",
      purple: "text-[#A78BFA] bg-[#A78BFA]/10 border-[#A78BFA]/20",
    };
    return (
      <div className={`flex justify-center items-center w-9 h-9 border rounded-xl ${themes[theme].split(' ').slice(1).join(' ')}`}>
        <IconComp className={`w-4.25 h-4.25 ${themes[theme].split(' ')[0]}`} />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4.5 w-full">
      <SectionCard icon={renderIcon(Bell, 'blue')} title="Notification Settings" subtitle="Configure what system notifications users receive">
        <div className="flex flex-col md:flex-row w-full mt-4 border-t border-white/10">
          
          <div className="flex flex-col flex-1 py-4 md:pr-6 md:border-r border-white/10 border-b md:border-b-0">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-3.5 h-3.5 text-secondary-blue" />
              <span className="font-['Raleway'] font-bold text-[13px] text-white">Email Notifications</span>
            </div>
            <div className="flex flex-col w-full mt-1">
              <CompactToggleRow title="New Collaboration Request" isActive={emailToggles.collabReq} onToggle={() => handleEmailToggle('collabReq')} />
              <CompactToggleRow title="Payment Received" isActive={emailToggles.payment} onToggle={() => handleEmailToggle('payment')} />
              <CompactToggleRow title="Dispute Filed / Resolved" isActive={emailToggles.dispute} onToggle={() => handleEmailToggle('dispute')} />
              <CompactToggleRow title="Subscription Renewal Reminder" isActive={emailToggles.subscription} onToggle={() => handleEmailToggle('subscription')} />
              <CompactToggleRow title="Identity Verification Status" isActive={emailToggles.identity} onToggle={() => handleEmailToggle('identity')} />
              <CompactToggleRow title="Weekly Platform Digest" isActive={emailToggles.weeklyDigest} onToggle={() => handleEmailToggle('weeklyDigest')} isLast />
            </div>
          </div>

          <div className="flex flex-col flex-1 py-4 md:pl-6">
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-3.5 h-3.5 text-[#A78BFA]" />
              <span className="font-['Raleway'] font-bold text-[13px] text-white">In-App Notifications</span>
            </div>
            <div className="flex flex-col w-full mt-1">
              <CompactToggleRow title="Real-Time Messages" isActive={inAppToggles.realtime} onToggle={() => handleInAppToggle('realtime')} />
              <CompactToggleRow title="Project Status Updates" isActive={inAppToggles.projectStatus} onToggle={() => handleInAppToggle('projectStatus')} />
              <CompactToggleRow title="Escrow Milestone Alerts" isActive={inAppToggles.escrow} onToggle={() => handleInAppToggle('escrow')} />
              <CompactToggleRow title="New Marketplace Listings" isActive={inAppToggles.newListings} onToggle={() => handleInAppToggle('newListings')} />
              <CompactToggleRow title="Admin System Announcements" isActive={inAppToggles.adminSystem} onToggle={() => handleInAppToggle('adminSystem')} />
              <CompactToggleRow title="Feature Release Announcements" isActive={inAppToggles.featureRelease} onToggle={() => handleInAppToggle('featureRelease')} isLast />
            </div>
          </div>

        </div>
      </SectionCard>

      <SystemAnnouncement />
      
    </div>
  );
}

// --- Subcomponents ---

function CompactToggleRow({ title, isActive, onToggle, isLast }: { title: string; isActive: boolean; onToggle: () => void; isLast?: boolean; }) {
  return (
    <div className={`flex items-center justify-between py-3.5 w-full ${!isLast ? 'border-b border-white/10' : ''}`}>
      <span className="font-['Raleway'] font-semibold text-[13px] text-white pr-4">{title}</span>
      <Toggle active={isActive} onChange={onToggle} />
    </div>
  );
}
