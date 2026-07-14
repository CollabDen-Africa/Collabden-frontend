"use client";

import React from "react";
import { FiBell, FiMail, FiSmartphone, FiClock, FiLoader } from "react-icons/fi";
import Toggle from "@/components/ui/Toggle";
import { useNotificationSettingsHook } from "@/hooks/notifications/useNotificationSettings";

export default function ProfileSettingsNotifications() {
  const { useNotificationSettings, useUpdateNotificationSettings } = useNotificationSettingsHook();
  const { data: settings, isLoading } = useNotificationSettings();
  const updateSettingsMutation = useUpdateNotificationSettings();

  const handleToggleChannel = (channel: "inApp" | "email" | "sms") => {
    if (!settings) return;
    updateSettingsMutation.mutate({
      [channel]: !settings[channel],
    });
  };

  const handleFrequencyChange = (frequency: "IMMEDIATE" | "DAILY" | "WEEKLY") => {
    updateSettingsMutation.mutate({ frequency });
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-20 text-white">
        <FiLoader className="animate-spin text-primary-green" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full flex-1 gap-8.75 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="font-raleway font-semibold text-[26.4px] leading-8.5 text-white/90">
          Notifications & Alerts
        </h1>
        <p className="font-raleway font-normal text-[20.5px] leading-7.25 text-white/50">
          Choose how you would like to be notified about platform updates
        </p>
      </div>

      {/* Notification Channels Card */}
      <div className="w-full bg-white/10 border border-white/10 rounded-[35px] flex flex-col backdrop-blur-md overflow-hidden p-8">
        <h2 className="font-raleway font-medium text-[20.5px] text-white/90 mb-6">Notification Channels</h2>
        
        <div className="flex flex-col gap-6">
          {/* In-App Toggles */}
          <div className="flex items-center justify-between py-4 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-blue/15 border border-primary-blue/20 flex items-center justify-center">
                <FiBell size={20} className="text-primary-blue" />
              </div>
              <div className="flex flex-col">
                <span className="font-inter font-medium text-[18px] text-white">In-App Notifications</span>
                <span className="text-[14px] text-white/50">Show activity badges and push banners in the app</span>
              </div>
            </div>
            <Toggle
              active={settings?.inApp ?? false}
              onChange={() => handleToggleChannel("inApp")}
            />
          </div>

          {/* Email Toggles */}
          <div className="flex items-center justify-between py-4 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary-green/15 border border-primary-green/20 flex items-center justify-center">
                <FiMail size={20} className="text-primary-green" />
              </div>
              <div className="flex flex-col">
                <span className="font-inter font-medium text-[18px] text-white">Email Alerts</span>
                <span className="text-[14px] text-white/50">Receive notifications via your registered email address</span>
              </div>
            </div>
            <Toggle
              active={settings?.email ?? false}
              onChange={() => handleToggleChannel("email")}
            />
          </div>

          {/* SMS Toggles */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#E0A030]/15 border border-[#E0A030]/20 flex items-center justify-center">
                <FiSmartphone size={20} className="text-[#E0A030]" />
              </div>
              <div className="flex flex-col">
                <span className="font-inter font-medium text-[18px] text-white">SMS Updates</span>
                <span className="text-[14px] text-white/50">Get security alerts and important files notifications on your phone</span>
              </div>
            </div>
            <Toggle
              active={settings?.sms ?? false}
              onChange={() => handleToggleChannel("sms")}
            />
          </div>
        </div>
      </div>

      {/* Notification Frequency Card */}
      <div className="w-full bg-white/10 border border-white/10 rounded-[35px] p-8 flex flex-col backdrop-blur-md">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#9B59B6]/15 border border-[#9B59B6]/20 flex items-center justify-center">
            <FiClock size={20} className="text-[#9B59B6]" />
          </div>
          <div className="flex flex-col">
            <h2 className="font-raleway font-medium text-[20.5px] text-white/90">Email Summary Frequency</h2>
            <span className="text-[14px] text-white/50">Choose how often you receive digest emails</span>
          </div>
        </div>

        <div className="flex gap-4">
          {(["IMMEDIATE", "DAILY", "WEEKLY"] as const).map((freq) => (
            <button
              key={freq}
              onClick={() => handleFrequencyChange(freq)}
              className={`px-6 py-3 rounded-full border transition-all text-[15px] font-medium ${
                settings?.frequency === freq
                  ? "bg-primary-green border-primary-green text-white"
                  : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
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