import React, { useState } from 'react';
import {
  Users,
  ShoppingBag,
  Save,
  ChevronDown,
  AlertCircle,
  Search,
  ListPlus
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { SectionCard } from '@/components/ui/SectionCard';
import { SharedToggleRow } from '@/components/ui/SharedToggleRow';

export default function PlatformSettingsMarketplace() {
  // State for toggles 
  const [toggles, setToggles] = useState({
    // Marketplace Availability
    marketplaceEnabled: true,
    allowNewListings: true,
    allowPurchases: true,
    featuredVisible: true,
    // Project Posting Rules
    requireVerification: true,
    requireAdminApproval: false,
    // Search & Discovery
    enableFilters: true,
    showUnverified: false,
    enableLocation: true,
    // Collaboration Visibility
    allowInvites: true,
    showCollabCount: true,
  });

  const [collabVisibility, setCollabVisibility] = useState('open');

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderIcon = (IconComp: any, theme: 'green' | 'blue' | 'purple' = 'green') => {
      const themes = {
        green: "text-primary-green bg-primary-green/10 border-primary-green/20",
        blue: "text-secondary-blue bg-secondary-blue/10 border-secondary-blue/20",
        purple: "text-[#A78BFA] bg-[#A78BFA]/10 border-[#A78BFA]/20"
      };
      return (
        <div className={`flex justify-center items-center w-9 h-9 border rounded-xl ${themes[theme].split(' ').slice(1).join(' ')}`}>
          <IconComp className={`w-4.25 h-4.25 ${themes[theme].split(' ')[0]}`} />
        </div>
      );
    };
  
    return (
      <div className="flex flex-col gap-4.5 w-full">
        <SectionCard icon={renderIcon(ShoppingBag)} title="Marketplace Availability" subtitle="Master controls for enabling or restricting the marketplace">
          <div className="flex flex-row items-start p-3 gap-2.5 w-full bg-accent-yellow/4 border border-accent-yellow/20 rounded-xl mb-4 mt-2">
            <AlertCircle className="w-3.5 h-3.5 text-accent-yellow shrink-0 mt-0.5" />
            <p className="text-xs text-accent-yellow leading-relaxed">Disabling the marketplace prevents all users from browsing and posting.</p>
          </div>
          <div className="flex flex-col w-full">
            <SharedToggleRow title="Marketplace Enabled" description="Turn off to put the entire marketplace into maintenance mode" isActive={toggles.marketplaceEnabled} onToggle={() => handleToggle('marketplaceEnabled')} />
            <SharedToggleRow title="Allow New Listings" description="Users can post new services or project listings" isActive={toggles.allowNewListings} onToggle={() => handleToggle('allowNewListings')} />
            <SharedToggleRow title="Allow Purchases & Transactions" description="Users can initiate paid transactions through the marketplace" isActive={toggles.allowPurchases} onToggle={() => handleToggle('allowPurchases')} />
            <SharedToggleRow title="Featured Listings Visible" description="Promoted and featured listings appear in discovery" isActive={toggles.featuredVisible} onToggle={() => handleToggle('featuredVisible')} isLast />
          </div>
        </SectionCard>
  
        <SectionCard icon={renderIcon(ListPlus)} title="Project Posting Rules" subtitle="Define requirements and limits for posting projects">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-4 mt-2">
            <SelectField label="Maximum Listings Per User" value="10 active listings" helperText="Caps how many active listings a user can hold simultaneously" />
            <SelectField label="Listing Duration" value="60 days (then expires)" />
            <SelectField label="Minimum Project Budget" value="₦5,000" helperText="Minimum bid/price allowed for project posts" />
            <SelectField label="Content Moderation Mode" value="Auto + Manual Review" />
          </div>
          <div className="flex flex-col w-full">
            <SharedToggleRow title="Require Verification to Post Listings" description="Only verified users may post projects or services" isActive={toggles.requireVerification} onToggle={() => handleToggle('requireVerification')} />
            <SharedToggleRow title="Require Admin Approval for New Listings" description="Each new listing is reviewed before going live" isActive={toggles.requireAdminApproval} onToggle={() => handleToggle('requireAdminApproval')} isLast />
          </div>
        </SectionCard>
  
        <SectionCard icon={renderIcon(Search, 'blue')} title="Search & Discovery Settings" subtitle="Configure how users find collaborators and projects">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-4 mt-2">
            <SelectField label="Default Search Results Sort" value="Relevance" />
            <SelectField label="Results Per Page" value="24 listings" />
          </div>
          <div className="flex flex-col w-full">
            <SharedToggleRow title="Enable Genre & Skill Filters" description="Users can filter by music genre or skill" isActive={toggles.enableFilters} onToggle={() => handleToggle('enableFilters')} />
            <SharedToggleRow title="Show Unverified Users in Discovery" description="Unverified accounts appear in search results" isActive={toggles.showUnverified} onToggle={() => handleToggle('showUnverified')} />
            <SharedToggleRow title="Enable Location-Based Discovery" description="Show nearby collaborators based on profile location" isActive={toggles.enableLocation} onToggle={() => handleToggle('enableLocation')} isLast />
          </div>
        </SectionCard>
  
        <SectionCard icon={renderIcon(Users, 'purple')} title="Collaboration Visibility Settings" subtitle="Control who can see and participate in posted collaborations">
          <div className="flex flex-row items-center gap-2 mt-4 mb-4 overflow-x-auto no-scrollbar">
            <RadioOption label="Open Collaborations" isActive={collabVisibility === 'open'} onClick={() => setCollabVisibility('open')} />
            <RadioOption label="Invite-Only Projects" isActive={collabVisibility === 'invite'} onClick={() => setCollabVisibility('invite')} />
            <RadioOption label="Private (Hidden)" isActive={collabVisibility === 'private'} onClick={() => setCollabVisibility('private')} />
          </div>
          <div className="flex flex-col w-full">
            <SharedToggleRow title="Allow Collaborators to Invite Others" description="Project owners can expand their team beyond original members" isActive={toggles.allowInvites} onToggle={() => handleToggle('allowInvites')} />
            <SharedToggleRow title="Show Project Collaboration Count" description="Display how many collaborators are on each project" isActive={toggles.showCollabCount} onToggle={() => handleToggle('showCollabCount')} isLast />
          </div>
        </SectionCard>
  
        <div className="flex flex-row items-center justify-between px-5 py-3.5 w-full bg-[#121415] border border-white/5 rounded-xl mt-2">
          <span className="text-xs text-white/45 w-82.75 leading-relaxed">Marketplace changes take effect immediately and are recorded in Change History</span>
          <div className="flex items-center gap-2.5">
            <Button variant="ghost" size="sm">Discard</Button>
            <Button variant="primary" size="sm" icon={Save} iconPosition="left" >Save Changes</Button>
          </div>
        </div>
      </div>
    );
  }

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

function RadioOption({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-row items-center justify-center px-3.5 py-2.5 gap-2 border rounded-lg whitespace-nowrap transition-colors ${
        isActive 
          ? 'bg-primary-green/10 border-primary-green/20 text-primary-green' 
          : 'bg-white/3 border-white/10 text-white/45 hover:bg-white/5'
      }`}
    >
      <div className={`flex items-center justify-center w-3.5 h-3.5 rounded-full border-[1.6px] ${
        isActive ? 'border-primary-green' : 'border-white/10'
      }`}>
        {isActive && <div className="w-1.5 h-1.5 bg-primary-green rounded-full" />}
      </div>
      <span className={`text-xs ${isActive ? "font-bold font-['Raleway']" : "font-medium font-['Raleway']"}`}>
        {label}
      </span>
    </button>
  );
}

