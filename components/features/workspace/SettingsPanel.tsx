"use client";

import React from "react";
import { FiX, FiInfo, FiUsers, FiBell, FiShield, FiKey, FiChevronRight } from "react-icons/fi";

const SETTINGS_OPTIONS = [
  { id: "gen", title: "General", sub: "Project Information", icon: <FiInfo size={16} /> },
  { id: "mem", title: "Members & Roles", sub: "Collaborators", icon: <FiUsers size={16} /> },
  { id: "not", title: "Notifications", sub: "Your preferences", icon: <FiBell size={16} /> },
  { id: "pri", title: "Privacy & Visibility", sub: "Access control", icon: <FiShield size={16} /> },
  { id: "own", title: "Ownership", sub: "Transfer project", icon: <FiKey size={16} /> },
];

export default function SettingsPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <aside className="fixed inset-y-0 right-0 z-[100] w-[85vw] sm:w-[322px] bg-[#162026] border-l border-white/10 p-6 shadow-2xl flex flex-col shrink-0
                      lg:relative lg:inset-auto lg:z-auto lg:w-[322px] lg:h-[832px] lg:bg-white/10 lg:border-none lg:rounded-[30px] lg:shadow-none">
      
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-sans font-bold text-[18px] text-white">Settings</h2>
        <button onClick={onClose} className="lg:hidden p-2 text-white/40"><FiX size={20} /></button>
      </div>

      <div className="flex flex-col gap-2">
        {SETTINGS_OPTIONS.map((opt) => (
          <button key={opt.id} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/10 transition-all group text-left">
            <div className="flex items-center gap-4">
              <div className="w-[30px] h-[30px] bg-white/20 rounded-[10px] flex items-center justify-center text-white border border-white/10">
                {opt.icon}
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-semibold text-[13px] text-white">{opt.title}</span>
                <span className="font-sans font-medium text-[10px] text-white/60">{opt.sub}</span>
              </div>
            </div>
            <FiChevronRight size={14} className="text-white/30 group-hover:text-white" />
          </button>
        ))}
      </div>
    </aside>
  );
}