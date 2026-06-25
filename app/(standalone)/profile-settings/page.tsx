"use client";

import React from "react";
import SettingsSidebar from "@/components/features/profile/SettingsSidebar";
import ProfileSettingsContent from "@/components/features/profile/ProfileSettingsPersonal";

export default function SettingsPage() {
  return (
    <div className="w-full flex flex-col xl:flex-row gap-8 pt-4 animate-in fade-in duration-300">
      
      {/* Left Sidebar */}
      <div className="w-full xl:w-70 shrink-0 h-full">
        <SettingsSidebar />
      </div>
      
      {/* Right Content Area */}
      <div className="flex-1 w-full min-w-0">
        <ProfileSettingsContent />
      </div>

    </div>
  );
}