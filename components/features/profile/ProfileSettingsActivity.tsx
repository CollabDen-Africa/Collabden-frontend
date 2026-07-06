"use client";

import React from "react";
import { FiMonitor, FiSmartphone, FiTablet, FiX } from "react-icons/fi";

const SESSIONS = [
  { 
    id: 1, 
    device: "MacBook Pro", 
    browser: "Chrome 125 · Lagos, Nigeria · 102.88.xx.xx", 
    time: "Today · 9:12 AM", 
    current: true, 
    icon: FiMonitor 
  },
  { 
    id: 2, 
    device: "iPhone 15 Pro", 
    browser: "Safari 17 · Lagos, Nigeria · 102.88.xx.xx", 
    time: "Today · 7:30 AM", 
    current: false, 
    icon: FiSmartphone 
  },
  { 
    id: 3, 
    device: "iPad Air", 
    browser: "Safari 17 · Abuja, Nigeria · 197.210.xx.xx", 
    time: "Yesterday · 11:45 PM", 
    current: false, 
    icon: FiTablet 
  },
  { 
    id: 4, 
    device: "Windows PC", 
    browser: "Edge 124 · London, UK · 86.13.xx.xx", 
    time: "Jun 10, 2026 · 3:20 PM", 
    current: false, 
    icon: FiMonitor 
  },
];

const ACTIVITY_LOG = [
  { id: 1, title: "Changed Profile Visibility", details: "From Members Only to Public", date: "May 12, 2026" },
  { id: 2, title: "Enabled Two-Factor Authentication", details: "Authenticator app connected", date: "May 11, 2026" },
  { id: 3, title: "Updated Bio", details: "Profile information changed", date: "May 8, 2026" },
  { id: 4, title: "Subscription Upgraded", details: "Starter → Professional Plan", date: "May 2, 2026" },
  { id: 5, title: "Identity Verified", details: "Government ID approved", date: "May 1, 2026" },
];

export default function ProfileSettingsActivity() {
  return (
    <div className="flex flex-col w-full flex-1 gap-8.75 animate-in fade-in duration-300 pb-10">
      
      {/* Header */}
      <div className="flex flex-col gap-1.5 mb-3">
        <h1 className="font-raleway font-semibold text-[26.4px] leading-8.5 text-white">
          Activity & Sessions
        </h1>
        <p className="font-raleway font-normal text-[20.5px] leading-7.25 text-text-muted">
          Monitor where you&apos;re signed in and your recent account activity
        </p>
      </div>

      {/* Active Sessions Card */}
      <div className="w-full bg-white/10 border border-white/10 rounded-[35px] flex flex-col backdrop-blur-md overflow-hidden">
        
        {/* Card Header */}
        <div className="px-8.75 py-5.75 border-b-[1.6px] border-white/5 flex flex-row items-center justify-between">
          <span className="font-raleway font-medium text-[20.5px] text-white">
            Active Sessions
          </span>
          <button className="font-inter font-medium text-[17.6px] text-accent-red-alt hover:text-red-400 transition-colors">
            Sign Out All Other Devices
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex flex-col">
          {SESSIONS.map((session, index) => {
            const Icon = session.icon;
            const isLast = index === SESSIONS.length - 1;

            return (
              <div 
                key={session.id} 
                className={`flex flex-row items-center justify-between px-8.75 py-5.75 ${
                  !isLast ? "border-b-[1.6px] border-white/5" : ""
                }`}
              >
                <div className="flex items-center gap-[23.5px]">
                  {/* Device Icon */}
                  <div className={`w-[58.6px] h-[58.6px] rounded-[23.5px] flex items-center justify-center shrink-0 border ${
                    session.current 
                      ? "bg-primary-green/20 border-primary-green/50 text-primary-green" 
                      : "bg-black/50 border-border-muted/50 text-white"
                  }`}>
                    <Icon size={24} />
                  </div>
                  
                  {/* Session Details */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-0.75">
                      <span className="font-raleway font-medium text-[20.5px] text-white">
                        {session.device}
                      </span>
                      {session.current && (
                        <div className="bg-primary-green/30 border border-primary-green rounded-full px-2.5 py-0.5 flex items-center justify-center">
                          <span className="font-raleway text-[10px] tracking-wider text-white/75">
                            Current
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="font-raleway font-normal text-[17.6px] text-white/50">
                      {session.browser}
                    </span>
                    <span className="font-raleway font-normal text-[14.7px] text-white/50 mt-0.5">
                      {session.time}
                    </span>
                  </div>
                </div>

                {/* Revoke Access Button */}
                {!session.current && (
                  <button className="w-10.25 h-10.25 border-[1.6px] border-accent-red-alt/30 rounded-[17.6px] flex items-center justify-center group hover:bg-accent-red-alt/10 transition-colors shrink-0">
                    <FiX size={19} className="text-accent-red-alt group-hover:text-red-400" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Log Card */}
      <div className="w-full bg-white/10 border border-white/10 rounded-[35px] flex flex-col backdrop-blur-md overflow-hidden mt-4">
        
        {/* Card Header */}
        <div className="px-8.75 py-5.75 border-b-[1.6px] border-white/5">
          <span className="font-raleway font-medium text-[20.5px] text-white/90">
            Activity Log
          </span>
        </div>

        {/* Log List */}
        <div className="flex flex-col py-5.75 px-8.75 xl:pl-20.5">
          {ACTIVITY_LOG.map((log, index) => {
            const isLast = index === ACTIVITY_LOG.length - 1;

            return (
              <div 
                key={log.id} 
                className={`flex flex-col ${!isLast ? "mb-7.25" : ""}`}
              >
                <span className="font-raleway font-medium text-[20.5px] text-white/90">
                  {log.title}
                </span>
                <span className="font-raleway font-normal text-[17.6px] text-text-muted mt-0.75">
                  {log.details}
                </span>
                <span className="font-raleway font-normal text-[14.7px] text-text-muted mt-0.75">
                  {log.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}