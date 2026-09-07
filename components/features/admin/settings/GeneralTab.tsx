import React, { useState } from 'react';
import { Settings, Users, Image as ImageIcon, AlertTriangle, Save, ChevronDown } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { SectionCard } from '@/components/ui/SectionCard';
import { SharedToggleRow } from '@/components/ui/SharedToggleRow';

export default function GeneralSettings() {
  const [formData, setFormData] = useState({
    platformName: 'CollabDen',
    tagline: 'Create Together',
    supportEmail: 'support@collabden.com',
    website: 'https://collabden.com',
    language: 'English (en-NG)',
    currency: 'Nigerian Naira (₦)',
    timezone: 'Africa/Lagos (UTC+1)',
    dateFormat: 'DD / MM / YYYY'
  });

  const [toggles, setToggles] = useState({
    newUsers: true, emailVerification: true, socialGoogle: true, socialApple: false, inviteOnly: false,
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Array-Based Error Checking
  const errors: string[] = [];
  if (!formData.platformName.trim()) errors.push("Platform Name is required");
  if (!formData.supportEmail.includes('@')) errors.push("Valid Support Email is required");
  const hasError = errors.length > 0;

  const renderIcon = (IconComp: any) => (
    <div className="flex justify-center items-center w-9 h-9 bg-primary-green/10 border border-primary-green/20 rounded-xl">
      <IconComp className="w-4.25 h-4.25 text-primary-green" />
    </div>
  );

  return (
    <div className="flex flex-col gap-4.5 w-full">
      <SectionCard icon={renderIcon(ImageIcon)} title="Branding & Platform Identity" subtitle="Platform name, logo, and public-facing information">
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-4">
          <Input label="Platform Name" value={formData.platformName} onChange={(e) => handleInputChange('platformName', e.target.value)} error={!formData.platformName.trim() ? "Required" : undefined} />
          <Input label="Tagline" value={formData.tagline} onChange={(e) => handleInputChange('tagline', e.target.value)} />
          <Input label="Support Email" value={formData.supportEmail} onChange={(e) => handleInputChange('supportEmail', e.target.value)} error={!formData.supportEmail.includes('@') ? "Required" : undefined} />
          <Input label="Platform Website" value={formData.website} onChange={(e) => handleInputChange('website', e.target.value)} />
        </div>
        <div className="flex flex-col gap-1.5 mt-2">
          <label className="text-[11px] font-semibold text-white/45">Platform Logo</label>
          <div className="flex flex-row items-center p-5 gap-3.5 w-full bg-white/3 border-[1.6px] border-dashed border-white/10 rounded-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-green rounded-xl text-black font-['Raleway'] font-bold text-lg">CD</div>
            <div className="flex flex-col flex-1">
              <span className="text-xs font-['Raleway'] font-bold text-white">collabden-logo.svg</span>
              <span className="text-[11px] text-white/45">SVG or PNG, max 2 MB</span>
            </div>
            <Button variant="ghost">Replace</Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={renderIcon(Settings)} title="Default Platform Preferences" subtitle="Language, region, and default user-facing behaviour">
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <SelectField label="Default Language" value={formData.language} options={['English (en-NG)', 'English (en-US)', 'French (fr-FR)']} onChange={(e) => handleInputChange('language', e.target.value)} helperText="Applied to new accounts unless changed by user" />
          <SelectField label="Default Currency" value={formData.currency} options={['Nigerian Naira (₦)', 'US Dollar ($)', 'Euro (€)']} onChange={(e) => handleInputChange('currency', e.target.value)} helperText="Used for pricing and transaction display" />
          <SelectField label="Default Timezone" value={formData.timezone} options={['Africa/Lagos (UTC+1)', 'America/New_York (UTC-5)']} onChange={(e) => handleInputChange('timezone', e.target.value)} />
          <SelectField label="Date Format" value={formData.dateFormat} options={['DD / MM / YYYY', 'MM / DD / YYYY']} onChange={(e) => handleInputChange('dateFormat', e.target.value)} />
        </div>
      </SectionCard>

      <SectionCard icon={renderIcon(Users)} title="User Registration Settings" subtitle="Control how new users sign up and join the platform">
        <div className="flex flex-col w-full mt-2">
          <SharedToggleRow title="Allow New User Registrations" description="Enable or disable public sign-up globally" isActive={toggles.newUsers} onToggle={() => setToggles({...toggles, newUsers: !toggles.newUsers})} />
          <SharedToggleRow title="Require Email Verification" description="Users must verify email before accessing features" isActive={toggles.emailVerification} onToggle={() => setToggles({...toggles, emailVerification: !toggles.emailVerification})} />
          <SharedToggleRow title="Allow Social Sign-In (Google)" description="Users can register via Google OAuth" isActive={toggles.socialGoogle} onToggle={() => setToggles({...toggles, socialGoogle: !toggles.socialGoogle})} />
          <SharedToggleRow title="Allow Social Sign-In (Apple)" description="Users can register via Apple ID" isActive={toggles.socialApple} onToggle={() => setToggles({...toggles, socialApple: !toggles.socialApple})} />
          <SharedToggleRow title="Invite-Only Mode" description="Only invited users may register on the platform" isActive={toggles.inviteOnly} onToggle={() => setToggles({...toggles, inviteOnly: !toggles.inviteOnly})} isLast />
        </div>
      </SectionCard>

      <div className={`flex flex-row items-center justify-between px-5 py-3.5 w-full rounded-xl mt-2 border ${hasError ? 'bg-[#FC110A]/[0.035] border-accent-red/20' : 'bg-[#121415] border-white/5'}`}>
        <div className="flex items-center gap-2">
          {hasError && (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-accent-red" />
              <span className="text-xs text-accent-red">
                Fix {errors.length} field error{errors.length > 1 ? 's' : ''} before saving: {errors[0]}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="ghost">Discard</Button>
          <Button variant={hasError ? "ghost" : "primary"} size="sm" icon={Save} iconPosition='left' disabled={hasError} className={hasError ? 'opacity-50 cursor-not-allowed' : ''}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

// Select Field Subcomponent
function SelectField({ label, value, options, onChange, helperText }: { label: string; value: string; options: string[]; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; helperText?: string }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[11px] font-semibold text-white/45">{label}</label>
      <div className="relative w-full">
        <select value={value} onChange={onChange} className="w-full px-3.5 py-2.5 bg-white/3 border border-white/10 rounded-lg text-[13px] font-['Raleway'] text-white appearance-none focus:outline-none focus:border-primary-green/50">
          {options.map((opt, i) => <option key={i} value={opt} className="bg-[#10141C]">{opt}</option>)}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/45 pointer-events-none" />
      </div>
      {helperText && <span className="text-[10px] text-white/45 mt-0.5">{helperText}</span>}
    </div>
  );
}