"use client";

import React, { useState } from "react";
import { 
  FiBell, 
  FiCheckSquare, 
  FiClock, 
  FiAtSign, 
  FiMessageCircle, 
  FiFileText, 
  FiVolume2 
} from "react-icons/fi";

// --- SETTINGS DATA ---
const NOTIFICATION_SETTINGS = [
  { 
    id: "tasks", 
    title: "Task assignments", 
    description: "When you're assigned a new task", 
    icon: FiCheckSquare, 
    defaultState: true 
  },
  { 
    id: "deadlines", 
    title: "Deadline reminders", 
    description: "Smart reminders before due dates", 
    icon: FiClock, 
    defaultState: true 
  },
  { 
    id: "mentions", 
    title: "Mentions", 
    description: "When someone mentions you", 
    icon: FiAtSign, 
    defaultState: true 
  },
  { 
    id: "messages", 
    title: "New messages", 
    description: "Threads and direct messages", 
    icon: FiMessageCircle, 
    defaultState: true 
  },
  { 
    id: "files", 
    title: "File updates", 
    description: "When project files are added or edited", 
    icon: FiFileText, 
    defaultState: false 
  },
  { 
    id: "announcements", 
    title: "Project announcements", 
    description: "Important updates from owners", 
    icon: FiVolume2, 
    defaultState: false 
  },
];

export default function NotificationsSettingsTab() {
  // Initialize state based on the default values of our settings array
  const [settings, setSettings] = useState<Record<string, boolean>>(
    NOTIFICATION_SETTINGS.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.defaultState }), {})
  );

  // Toggle handler
  const toggleSetting = (id: string) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full max-w-[931px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] lg:rounded-[50px] p-[32px] lg:p-[48px] shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500">
      
      <div className="flex flex-col gap-[40px] w-full max-w-[860px]">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center p-[20px] lg:p-[24px] gap-[16px] bg-black/10 rounded-[30px] border border-white/5 shadow-inner">
          <div className="w-[54px] h-[54px] bg-white/20 rounded-[15px] flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
            <FiBell className="text-white" size={24} />
          </div>
          <div className="flex flex-col justify-center gap-[4px]">
            <h2 className="font-raleway font-semibold text-[22px] lg:text-[25px] leading-[29px] text-white">
              Notifications
            </h2>
            <p className="font-raleway font-medium text-[15px] lg:text-[18px] leading-[21px] text-white/60">
              Personalize how Urban Beats Vol. 2 reaches you.
            </p>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex flex-col gap-[24px] lg:gap-[32px] w-full">
          {NOTIFICATION_SETTINGS.map((item) => {
            const Icon = item.icon;
            const isActive = settings[item.id];

            return (
              <div 
                key={item.id} 
                className="flex items-center justify-between w-full group transition-all"
              >
                {/* Left: Icon & Text */}
                <div className="flex items-center gap-[16px]">
                  <div className="w-[44px] h-[44px] bg-white/10 border border-white/10 rounded-[14.6px] flex items-center justify-center shrink-0 shadow-sm">
                    <Icon className="text-white" size={18} />
                  </div>
                  <div className="flex flex-col gap-[2px]">
                    <span className="font-raleway font-bold text-[16px] lg:text-[18px] text-white leading-tight">
                      {item.title}
                    </span>
                    <span className="font-raleway font-normal text-[14px] lg:text-[15px] text-white/60">
                      {item.description}
                    </span>
                  </div>
                </div>

                {/* Right: Custom Toggle Switch */}
                <button
                  type="button"
                  onClick={() => toggleSetting(item.id)}
                  className={`relative w-[45px] h-[27px] rounded-full p-[3px] transition-colors duration-300 shrink-0 ${
                    isActive ? "bg-primary-green" : "bg-white/20"
                  }`}
                  aria-pressed={isActive}
                >
                  <div 
                    className={`w-[21px] h-[21px] bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                      isActive ? "translate-x-[18px]" : "translate-x-0"
                    }`} 
                  />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}