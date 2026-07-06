"use client";

import React, { useState } from "react";
import { 
  FiMessageSquare, 
  FiFolder, 
  FiAtSign,
  FiClipboard, 
  FiFileText, 
  FiDollarSign, 
  FiGrid, 
  FiClock 
} from "react-icons/fi";
import Toggle from "@/components/ui/Toggle";

// Toggle state
const INITIAL_NOTIFICATIONS = [
  { id: "messages", label: "Messages", color: "#6495ED", icon: FiMessageSquare, inApp: true, email: true, sms: false, frequency: "Instantly" },
  { id: "project_updates", label: "Project Updates", color: "#73BF44", icon: FiFolder, inApp: true, email: true, sms: false, frequency: "Daily" },
  { id: "task_assignments", label: "Task Assignments", color: "#E0A030", icon: FiClipboard, inApp: true, email: true, sms: false, frequency: "Instantly" },
  { id: "mentions", label: "Mentions", color: "#D6E6FF", icon: FiAtSign, inApp: true, email: true, sms: false, frequency: "Instantly" },
  { id: "legal", label: "Legal Agreements", color: "#9B59B6", icon: FiFileText, inApp: true, email: true, sms: false, frequency: "Instantly" },
  { id: "payments", label: "Payments", color: "#34A853", icon: FiDollarSign, inApp: true, email: true, sms: false, frequency: "Instantly" },
  { id: "applications", label: "Applications", color: "#4A9FD4", icon: FiGrid, inApp: true, email: true, sms: false, frequency: "Daily" },
  { id: "deadlines", label: "Deadlines", color: "#E05260", icon: FiClock, inApp: true, email: true, sms: false, frequency: "Daily" },
];


export default function ProfileSettingsNotifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const handleToggle = (id: string, field: 'inApp' | 'email' | 'sms') => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, [field]: !notif[field] } : notif
    ));
  };

  return (
    <div className="flex flex-col w-full flex-1 gap-8.75 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="font-raleway font-semibold text-[26.4px] leading-8.5 text-white/90">
          Notifications & Alerts
        </h1>
        <p className="font-raleway font-normal text-[20.5px] leading-7.25 text-text-text-muted">
          Choose what you hear about and how you hear about it
        </p>
      </div>

      {/* Notifications Table Card */}
      <div className="w-full bg-white/10 border border-white/10 rounded-[35px] flex flex-col backdrop-blur-md overflow-hidden">
        
        {/* Table Header Row */}
        <div className="grid grid-cols-[minmax(200px,2fr)_1fr_1fr_1fr_minmax(100px,1fr)] items-center px-8.75 py-6 border-b-[1.6px] border-white/5">
          <span className="font-raleway text-[17.6px] text-text-muted">Category</span>
          <span className="font-raleway text-[17.6px] text-text-muted text-center">In-App</span>
          <span className="font-raleway text-[17.6px] text-text-muted text-center">Email</span>
          <span className="font-raleway text-[17.6px] text-text-muted text-center">SMS</span>
          <span className="font-raleway text-[17.6px] text-text-muted text-right">Frequency</span>
        </div>

        {/* Table Body Rows */}
        <div className="flex flex-col w-full">
          {notifications.map((notif, index) => {
            const Icon = notif.icon;
            
            return (
              <div 
                key={notif.id} 
                className={`grid grid-cols-[minmax(200px,2fr)_1fr_1fr_1fr_minmax(100px,1fr)] items-center px-8.75 py-6 ${
                  index !== notifications.length - 1 ? "border-b-[1.6px] border-white/5" : ""
                }`}
              >
                {/* Category Column */}
                <div className="flex items-center gap-[17.6px]">
                  <div 
                    className="w-10.25 h-10.25 rounded-[17.6px] flex items-center justify-center border-[1.8px]"
                    style={{ backgroundColor: `${notif.color}18`, borderColor: `${notif.color}10` }}
                  >
                    <Icon size={20} color={notif.color} />
                  </div>
                  <span className="font-inter font-normal text-[20.5px] text-white/90">
                    {notif.label}
                  </span>
                </div>

                {/* Toggles */}
                <div className="flex justify-center">
                  <Toggle active={notif.inApp} onChange={() => handleToggle(notif.id, 'inApp')} />
                </div>
                <div className="flex justify-center">
                  <Toggle active={notif.email} onChange={() => handleToggle(notif.id, 'email')} />
                </div>
                <div className="flex justify-center">
                  <Toggle active={notif.sms} onChange={() => handleToggle(notif.id, 'sms')} />
                </div>

                {/* Frequency Column */}
                <div className="flex justify-end">
                  <span className="font-raleway text-[17.6px] text-text-muted cursor-pointer hover:text-white transition-colors">
                    {notif.frequency}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}