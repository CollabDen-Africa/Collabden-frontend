"use client";

import React from "react";
import { 
  FiBell, 
  FiMail, 
  FiSmartphone, 
  FiClock, 
  FiLoader 
} from "react-icons/fi";
import { useNotificationSettingsHook } from "@/hooks/notifications/useNotificationSettings";

interface NotificationsSettingsTabProps {
  onSuccess?: (message?: string) => void;
}

export default function NotificationsSettingsTab({ onSuccess }: NotificationsSettingsTabProps) {
  const { useNotificationSettings, useUpdateNotificationSettings } = useNotificationSettingsHook();
  const { data: settings, isLoading } = useNotificationSettings();
  const updateSettingsMutation = useUpdateNotificationSettings();

  const handleToggleChannel = (channel: "inApp" | "email" | "sms") => {
    if (!settings) return;
    const newValue = !settings[channel];
    updateSettingsMutation.mutate(
      { [channel]: newValue },
      {
        onSuccess: () => {
          onSuccess?.("Notification preferences updated.");
        },
      }
    );
  };

  const handleFrequencyChange = (frequency: "IMMEDIATE" | "DAILY" | "WEEKLY") => {
    updateSettingsMutation.mutate(
      { frequency },
      {
        onSuccess: () => {
          onSuccess?.(`Email summary frequency set to ${frequency.toLowerCase()}.`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-20 text-white">
        <FiLoader className="animate-spin text-primary-green" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-[28px] lg:gap-[32px]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-[20px] lg:p-[24px] pr-[56px] sm:pr-[64px] gap-[16px] bg-black/20 rounded-[24px] border border-white/5 shadow-inner">
        <div className="w-[54px] h-[54px] bg-white/10 rounded-[15px] flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
          <FiBell className="text-white" size={24} />
        </div>
        <div className="flex flex-col justify-center gap-[4px]">
          <h2 className="font-raleway font-semibold text-[22px] lg:text-[25px] leading-[29px] text-white">
            Notifications & Alerts
          </h2>
          <p className="font-raleway font-medium text-[14px] lg:text-[16px] leading-[21px] text-white/60">
            Personalize how project updates and alerts reach you.
          </p>
        </div>
      </div>

      {/* Notification Channels List */}
      <div className="flex flex-col gap-[16px] w-full">
        {/* In-App Notifications Toggle */}
        <div className="flex items-center justify-between w-full bg-black/20 border border-white/5 p-4 sm:p-5 rounded-[20px] group transition-all">
          <div className="flex items-center gap-[16px]">
            <div className="w-[44px] h-[44px] bg-white/10 border border-white/10 rounded-[14.6px] flex items-center justify-center shrink-0 shadow-sm">
              <FiBell className="text-white" size={18} />
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="font-raleway font-bold text-[16px] lg:text-[18px] text-white leading-tight">
                In-App Notifications
              </span>
              <span className="font-raleway font-normal text-[14px] lg:text-[15px] text-white/60">
                Show activity badges, popups, and real-time alerts in the application
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleToggleChannel("inApp")}
            disabled={updateSettingsMutation.isPending}
            className={`relative w-[45px] h-[27px] rounded-full p-[3px] transition-colors duration-300 shrink-0 ${
              settings?.inApp ? "bg-primary-green" : "bg-white/20"
            } ${updateSettingsMutation.isPending ? "opacity-55 cursor-not-allowed" : ""}`}
            aria-pressed={settings?.inApp ?? false}
          >
            <div 
              className={`w-[21px] h-[21px] bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                settings?.inApp ? "translate-x-[18px]" : "translate-x-0"
              }`} 
            />
          </button>
        </div>

        {/* Email Alerts Toggle */}
        <div className="flex items-center justify-between w-full bg-black/20 border border-white/5 p-4 sm:p-5 rounded-[20px] group transition-all">
          <div className="flex items-center gap-[16px]">
            <div className="w-[44px] h-[44px] bg-white/10 border border-white/10 rounded-[14.6px] flex items-center justify-center shrink-0 shadow-sm">
              <FiMail className="text-white" size={18} />
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="font-raleway font-bold text-[16px] lg:text-[18px] text-white leading-tight">
                Email Alerts
              </span>
              <span className="font-raleway font-normal text-[14px] lg:text-[15px] text-white/60">
                Receive important invitation, milestone, and project updates in your inbox
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleToggleChannel("email")}
            disabled={updateSettingsMutation.isPending}
            className={`relative w-[45px] h-[27px] rounded-full p-[3px] transition-colors duration-300 shrink-0 ${
              settings?.email ? "bg-primary-green" : "bg-white/20"
            } ${updateSettingsMutation.isPending ? "opacity-55 cursor-not-allowed" : ""}`}
            aria-pressed={settings?.email ?? false}
          >
            <div 
              className={`w-[21px] h-[21px] bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                settings?.email ? "translate-x-[18px]" : "translate-x-0"
              }`} 
            />
          </button>
        </div>

        {/* SMS Updates Toggle */}
        <div className="flex items-center justify-between w-full bg-black/20 border border-white/5 p-4 sm:p-5 rounded-[20px] group transition-all">
          <div className="flex items-center gap-[16px]">
            <div className="w-[44px] h-[44px] bg-white/10 border border-white/10 rounded-[14.6px] flex items-center justify-center shrink-0 shadow-sm">
              <FiSmartphone className="text-white" size={18} />
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="font-raleway font-bold text-[16px] lg:text-[18px] text-white leading-tight">
                SMS Updates
              </span>
              <span className="font-raleway font-normal text-[14px] lg:text-[15px] text-white/60">
                Get security alerts and critical notifications directly on your phone
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleToggleChannel("sms")}
            disabled={updateSettingsMutation.isPending}
            className={`relative w-[45px] h-[27px] rounded-full p-[3px] transition-colors duration-300 shrink-0 ${
              settings?.sms ? "bg-primary-green" : "bg-white/20"
            } ${updateSettingsMutation.isPending ? "opacity-55 cursor-not-allowed" : ""}`}
            aria-pressed={settings?.sms ?? false}
          >
            <div 
              className={`w-[21px] h-[21px] bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                settings?.sms ? "translate-x-[18px]" : "translate-x-0"
              }`} 
            />
          </button>
        </div>
      </div>

      {/* Notification Frequency Section */}
      <div className="flex flex-col gap-[16px] w-full bg-black/20 border border-white/5 p-6 rounded-[24px]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white">
            <FiClock size={18} />
          </div>
          <div className="flex flex-col">
            <h3 className="font-raleway font-bold text-[16px] text-white">Digest & Summary Frequency</h3>
            <span className="font-raleway font-normal text-[13px] text-white/60">
              Choose how often you receive email summaries
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-1">
          {(["IMMEDIATE", "DAILY", "WEEKLY"] as const).map((freq) => (
            <button
              key={freq}
              onClick={() => handleFrequencyChange(freq)}
              disabled={updateSettingsMutation.isPending}
              className={`px-5 py-2.5 rounded-full border transition-all text-[14px] font-semibold disabled:opacity-60 ${
                settings?.frequency === freq
                  ? "bg-primary-green border-primary-green text-white shadow-[0_4px_14px_rgba(115,191,68,0.3)]"
                  : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/30"
              }`}
            >
              {freq.charAt(0) + freq.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}