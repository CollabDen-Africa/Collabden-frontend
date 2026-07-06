"use client";

import React, { useState} from "react";
import SettingsSidebar from "@/components/features/profile/SettingsSidebar";
import ProfileSettingsContent from "@/components/features/profile/ProfileSettingsPersonal";
import ProfileSettingsLinkedAccounts from "@/components/features/profile/ProfileSettingsLinkedAccounts";
import ProfileSettingsSubscriptions from "@/components/features/profile/ProfileSettingsSubscriptions";
import ProfileSettingsNotifications from "@/components/features/profile/ProfileSettingsNotifications";
import ProfileSettingsSecurity from "@/components/features/profile/ProfileSettingsSecurity";
import ProfileSettingsPrivacy from "@/components/features/profile/ProfileSettingsPrivacy";
import ProfileSettingsActivity from "@/components/features/profile/ProfileSettingsActivity";
import ProfileSettingsSupport from "@/components/features/profile/ProfileSettingsSupport";

export default function SettingsPage() {

  // Default tab
  const [activeTab, setActiveTab] = useState("my-profile");

  // Determine which content component to show
    const renderTabContent = () => {
      switch (activeTab) {
        case "linked-accounts":
          return <ProfileSettingsLinkedAccounts />;
        case "subscriptions":
          return <ProfileSettingsSubscriptions />;
        case "notifications":
          return <ProfileSettingsNotifications />;
        case "security":
          return <ProfileSettingsSecurity />
          case "privacy":
          return <ProfileSettingsPrivacy />
          case "activity":
          return <ProfileSettingsActivity />
          case "support":
            return <ProfileSettingsSupport />
        case "my-profile":
        default:
          // Fallback is the Personal Information tab
          return <ProfileSettingsContent />;
      }
    };
  
  return (
    <div className="w-full flex flex-col xl:flex-row gap-8 pt-4 animate-in fade-in duration-300">
      
      {/* Left Sidebar */}
      <div className="w-full xl:w-70 shrink-0 h-full">
        <SettingsSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}/>
      </div>
      
      {/* Right Content Area - render based on active tab */}
      <div className="flex-1 w-full min-w-0">
        {renderTabContent()}
      </div>

    </div>
  );
}