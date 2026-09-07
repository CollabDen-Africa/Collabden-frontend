import React, { useState, useEffect } from "react";
import {
  FiSettings,
  FiUsers,
  FiImage,
  FiAlertTriangle,
  FiSave,
  FiChevronDown,
} from "react-icons/fi";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { SectionCard } from "@/components/ui/SectionCard";
import { SharedToggleRow } from "@/components/ui/SharedToggleRow";
import { GeneralSettingsData } from "@/services/admin/settings.service";

interface GeneralTabProps {
  settings?: GeneralSettingsData;
  onSave?: (data: Partial<GeneralSettingsData>) => Promise<boolean>;
  isSaving?: boolean;
}

const CURRENCY_OPTIONS = [
  { code: "NGN", label: "Nigerian Naira (₦)" },
  { code: "USD", label: "US Dollar ($)" },
  { code: "GBP", label: "British Pound (£)" },
  { code: "EUR", label: "Euro (€)" },
  { code: "KES", label: "Kenyan Shilling (KSh)" },
  { code: "GHS", label: "Ghanaian Cedi (GH₵)" },
];

const LANGUAGE_OPTIONS = [
  { code: "en", label: "English (en-NG)" },
  { code: "en-US", label: "English (en-US)" },
  { code: "fr", label: "French (fr-FR)" },
];

export default function GeneralSettings({
  settings = {},
  onSave,
  isSaving = false,
}: GeneralTabProps) {
  const [formData, setFormData] = useState({
    platformName: settings.platformName || "Collabden",
    tagline: settings.tagline || "Where Africa's Music Professionals Collaborate",
    supportEmail: settings.supportEmail || "support@collabden.africa",
    website: settings.website || "https://collabden.africa",
    defaultLanguage: settings.defaultLanguage || "en",
    defaultCurrency: settings.defaultCurrency || "NGN",
    timezone: settings.timezone || "Africa/Lagos (UTC+1)",
    dateFormat: settings.dateFormat || "DD / MM / YYYY",
  });

  const [toggles, setToggles] = useState({
    allowNewRegistrations: settings.allowNewRegistrations ?? true,
    maintenanceMode: settings.maintenanceMode ?? false,
    enableMarketplace: settings.enableMarketplace ?? true,
  });

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setFormData({
        platformName: settings.platformName || "Collabden",
        tagline: settings.tagline || "Where Africa's Music Professionals Collaborate",
        supportEmail: settings.supportEmail || "support@collabden.africa",
        website: settings.website || "https://collabden.africa",
        defaultLanguage: settings.defaultLanguage || "en",
        defaultCurrency: settings.defaultCurrency || "NGN",
        timezone: settings.timezone || "Africa/Lagos (UTC+1)",
        dateFormat: settings.dateFormat || "DD / MM / YYYY",
      });
      setToggles({
        allowNewRegistrations: settings.allowNewRegistrations ?? true,
        maintenanceMode: settings.maintenanceMode ?? false,
        enableMarketplace: settings.enableMarketplace ?? true,
      });
    }
  }, [settings]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Validation
  const errors: string[] = [];
  if (!formData.platformName.trim()) errors.push("Platform Name is required");
  if (!formData.supportEmail.includes("@"))
    errors.push("Valid Support Email is required");
  const hasError = errors.length > 0;

  const handleSave = async () => {
    if (hasError || !onSave) return;
    await onSave({
      platformName: formData.platformName.trim(),
      tagline: formData.tagline.trim(),
      supportEmail: formData.supportEmail.trim(),
      website: formData.website.trim(),
      defaultLanguage: formData.defaultLanguage,
      defaultCurrency: formData.defaultCurrency,
      timezone: formData.timezone,
      dateFormat: formData.dateFormat,
      allowNewRegistrations: toggles.allowNewRegistrations,
      maintenanceMode: toggles.maintenanceMode,
      enableMarketplace: toggles.enableMarketplace,
    });
  };

  const renderIcon = (IconComp: any) => (
    <div className="flex justify-center items-center w-9 h-9 bg-primary-green/10 border border-primary-green/20 rounded-xl">
      <IconComp className="w-4 h-4 text-primary-green" />
    </div>
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <SectionCard
        icon={renderIcon(FiImage)}
        title="Branding & Platform Identity"
        subtitle="Platform name, logo, and public-facing information"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            label="Platform Name"
            value={formData.platformName}
            onChange={(e) => handleInputChange("platformName", e.target.value)}
            error={!formData.platformName.trim() ? "Required" : undefined}
          />
          <Input
            label="Tagline"
            value={formData.tagline}
            onChange={(e) => handleInputChange("tagline", e.target.value)}
          />
          <Input
            label="Support Email"
            value={formData.supportEmail}
            onChange={(e) => handleInputChange("supportEmail", e.target.value)}
            error={
              !formData.supportEmail.includes("@") ? "Required" : undefined
            }
          />
          <Input
            label="Platform Website"
            value={formData.website}
            onChange={(e) => handleInputChange("website", e.target.value)}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={renderIcon(FiSettings)}
        title="Default Platform Preferences"
        subtitle="Language, region, and default user-facing behaviour"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Default Language"
            value={formData.defaultLanguage}
            options={LANGUAGE_OPTIONS.map((opt) => ({ value: opt.code, label: opt.label }))}
            onChange={(e) =>
              handleInputChange("defaultLanguage", e.target.value)
            }
            helperText="Applied to new accounts unless changed by user"
          />
          <SelectField
            label="Default Currency"
            value={formData.defaultCurrency}
            options={CURRENCY_OPTIONS.map((opt) => ({ value: opt.code, label: opt.label }))}
            onChange={(e) =>
              handleInputChange("defaultCurrency", e.target.value)
            }
            helperText="Used for pricing and transaction display"
          />
          <SelectField
            label="Default Timezone"
            value={formData.timezone}
            options={[
              { value: "Africa/Lagos (UTC+1)", label: "Africa/Lagos (UTC+1)" },
              { value: "Africa/Nairobi (UTC+3)", label: "Africa/Nairobi (UTC+3)" },
              { value: "Africa/Accra (UTC+0)", label: "Africa/Accra (UTC+0)" },
              { value: "Africa/Johannesburg (UTC+2)", label: "Africa/Johannesburg (UTC+2)" },
              { value: "Europe/London (UTC+0)", label: "Europe/London (UTC+0)" },
              { value: "America/New_York (UTC-5)", label: "America/New_York (UTC-5)" },
            ]}
            onChange={(e) => handleInputChange("timezone", e.target.value)}
          />
          <SelectField
            label="Date Format"
            value={formData.dateFormat}
            options={[
              { value: "DD / MM / YYYY", label: "DD / MM / YYYY" },
              { value: "MM / DD / YYYY", label: "MM / DD / YYYY" },
              { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
            ]}
            onChange={(e) => handleInputChange("dateFormat", e.target.value)}
          />
        </div>
      </SectionCard>

      <SectionCard
        icon={renderIcon(FiUsers)}
        title="User Registration & System Status"
        subtitle="Control how new users sign up and join the platform"
      >
        <div className="flex flex-col w-full mt-2">
          <SharedToggleRow
            title="Allow New User Registrations"
            description="Enable or disable public sign-up globally"
            isActive={toggles.allowNewRegistrations}
            onToggle={() =>
              setToggles({
                ...toggles,
                allowNewRegistrations: !toggles.allowNewRegistrations,
              })
            }
          />
          <SharedToggleRow
            title="Enable Marketplace Module"
            description="Allow users to browse and post in the marketplace"
            isActive={toggles.enableMarketplace}
            onToggle={() =>
              setToggles({
                ...toggles,
                enableMarketplace: !toggles.enableMarketplace,
              })
            }
          />
          <SharedToggleRow
            title="Maintenance Mode"
            description="Place the platform in temporary maintenance mode for updates"
            isActive={toggles.maintenanceMode}
            onToggle={() =>
              setToggles({
                ...toggles,
                maintenanceMode: !toggles.maintenanceMode,
              })
            }
            isLast
          />
        </div>
      </SectionCard>

      <div
        className={`flex flex-row items-center justify-between px-5 py-3.5 w-full rounded-xl mt-2 border ${
          hasError
            ? "bg-accent-red/5 border-accent-red/20"
            : "bg-card-bg/20 border-white/5"
        }`}
      >
        <div className="flex items-center gap-2">
          {hasError && (
            <>
              <FiAlertTriangle className="w-4 h-4 text-accent-red" />
              <span className="text-xs text-accent-red">
                Fix {errors.length} field error
                {errors.length > 1 ? "s" : ""} before saving: {errors[0]}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant={hasError ? "ghost" : "primary"}
            size="sm"
            icon={FiSave}
            iconPosition="left"
            disabled={hasError || isSaving}
            onClick={handleSave}
            className={hasError ? "opacity-50 cursor-not-allowed" : ""}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  helperText,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  helperText?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[11px] font-semibold text-white/50">{label}</label>
      <div className="relative w-full">
        <select
          value={value}
          onChange={onChange}
          className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-xs font-sans text-white appearance-none focus:outline-none focus:border-primary-green transition-colors"
        >
          {options.map((opt, i) => (
            <option key={i} value={opt.value} className="bg-card-bg-alt text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
      </div>
      {helperText && (
        <span className="text-[10px] text-white/40 mt-0.5">{helperText}</span>
      )}
    </div>
  );
}