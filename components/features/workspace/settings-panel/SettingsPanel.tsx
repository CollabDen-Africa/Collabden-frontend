"use client";

import React, { useState } from "react";
import { 
  FiX, 
  FiInfo, 
  FiUsers, 
  FiBell, 
  FiShield, 
  FiKey, 
  FiChevronRight 
} from "react-icons/fi";
import GeneralSettingsTab from "./GeneralSettingsTab";
import MembersSettingsTab from "./MemberSettingsTab";
import NotificationsSettingsTab from "./NotificationsSettingsTab";
import PrivacySettingsTab from "./PrivacySettingsTab";
import OwnershipSettingsTab from "./OwnershipSettingsTab";

const SETTINGS_OPTIONS = [
  { id: "gen", title: "General", sub: "Project Information", icon: <FiInfo size={16} /> },
  { id: "mem", title: "Members & Roles", sub: "Collaborators", icon: <FiUsers size={16} /> },
  { id: "not", title: "Notifications", sub: "Your preferences", icon: <FiBell size={16} /> },
  { id: "pri", title: "Privacy & Visibility", sub: "Access control", icon: <FiShield size={16} /> },
  { id: "own", title: "Ownership", sub: "Transfer project", icon: <FiKey size={16} /> },
];

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  // State to track which settings tab is currently open
  const [activeTab, setActiveTab] = useState<string | null>(null);

  if (!isOpen) return null;


  return (
    <div className="lg:relative flex h-full items-start justify-end shrink-0">
      
      {/* Settings Navigation Sidebar */}
      <aside className="fixed inset-y-0 right-0 z-[100] w-[85vw] sm:w-[322px] bg-[#162026] border-l border-white/10 p-[26px_17px] shadow-2xl animate-in slide-in-from-right-8 duration-300 flex flex-col shrink-0
                        lg:relative lg:inset-auto lg:z-auto lg:w-[322px] lg:h-[879px] lg:bg-white/10 lg:border-none lg:rounded-[30px] lg:shadow-none">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-sans font-bold text-[18px] text-white">Settings</h2>
          <button 
            onClick={onClose} 
            className="lg:hidden p-2 text-white/40 hover:text-white transition-colors"
            aria-label="Close settings"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {SETTINGS_OPTIONS.map((opt) => {
            const isActive = activeTab === opt.id;
            return (
              <button 
                key={opt.id} 
                onClick={() => setActiveTab(opt.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group text-left ${
                  isActive 
                    ? "bg-white/15 border border-white/10 shadow-sm" 
                    : "hover:bg-white/10 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-[30px] h-[30px] rounded-[10px] flex items-center justify-center border transition-colors ${
                    isActive 
                      ? "bg-primary-green text-white border-primary-green/50" 
                      : "bg-white/20 text-white border-white/10"
                  }`}>
                    {opt.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans font-semibold text-[13px] text-white">
                      {opt.title}
                    </span>
                    <span className="font-sans font-medium text-[10px] text-white/60">
                      {opt.sub}
                    </span>
                  </div>
                </div>
                <FiChevronRight 
                  size={14} 
                  className={`transition-transform duration-300 ${
                    isActive ? "text-primary-green translate-x-1" : "text-white/30 group-hover:text-white"
                  }`} 
                />
              </button>
            );
          })}
        </div>
      </aside>

      {/* Active Tab Content Overlay */}
      {activeTab && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-md lg:absolute lg:inset-auto lg:top-0 lg:right-[calc(100%+32px)] lg:w-[931px] lg:max-w-[calc(100vw-380px)] lg:bg-transparent lg:backdrop-blur-none lg:p-0 animate-in fade-in duration-300">
          
          {/* Backdrop click to close the active tab on mobile */}
          <div className="absolute inset-0 lg:hidden" onClick={() => setActiveTab(null)} />

          <div className="relative w-full max-h-[90vh] lg:max-h-none overflow-y-auto custom-scrollbar rounded-[40px] lg:rounded-[50px] z-10">
            
            {/* Overlay Close Button */}
            <button
              onClick={() => setActiveTab(null)}
              className="absolute top-6 right-6 lg:top-[32px] lg:right-[32px] w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-colors z-50 backdrop-blur-md shadow-sm"
              aria-label="Close detailed settings"
            >
              <FiX size={20} />
            </button>

            {/* Render the selected component */}
            {activeTab === "gen" && <GeneralSettingsTab />}
            {activeTab === "mem" && <MembersSettingsTab />}
            {activeTab === "not" && <NotificationsSettingsTab />}
            {activeTab === "pri" && <PrivacySettingsTab />}
            {activeTab === "own" && <OwnershipSettingsTab />}
          </div>
        </div>
      )}
      
    </div>
  );
}