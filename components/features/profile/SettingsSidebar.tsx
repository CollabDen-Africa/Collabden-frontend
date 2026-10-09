"use client";

import React, { useState, useRef, useEffect} from "react";
import Link from "next/link";
import { FiArrowLeft, FiChevronDown, FiSettings, FiUsers, FiCreditCard, FiBell } from "react-icons/fi";
import Image from "next/image";

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const SETTINGS_SIDEBAR_LINKS = [
  { id: "general", label: "General Settings", icon: FiSettings },
  { id: "members", label: "Members & Permissions", icon: FiUsers },
  { id: "billing", label: "Billing & Escrow", icon: FiCreditCard },
  { id: "notifications", label: "Notifications", icon: FiBell },
];

export default function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLink = SETTINGS_SIDEBAR_LINKS.find(link => link.id === activeTab) || SETTINGS_SIDEBAR_LINKS[0];
  const ActiveIcon = activeLink.icon;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMobileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* MOBILE DROPDOWN VIEW */}
      <div className="flex lg:hidden flex-col w-full gap-5">
        <div className="flex items-center justify-between w-full px-2">
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex items-center justify-center w-9 h-9 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 text-white/70 transition-colors"
              aria-label="Back to Profile"
            >
              <FiArrowLeft size={16} />
            </Link>
          </div>
        </div>

        <div className="relative w-full z-50" ref={dropdownRef}>
          <button 
            onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
            className="w-full flex justify-between items-center bg-black/20 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-md shadow-lg transition-colors hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <ActiveIcon size={20} className="text-primary-green" />
              <span className="font-raleway font-semibold text-[15px] text-white">{activeLink.label}</span>
            </div>
            <FiChevronDown size={20} className={"text-white/50 transition-transform duration-300 " + (isMobileDropdownOpen ? "rotate-180" : "")} />
          </button>

          {isMobileDropdownOpen && (
            <div className="absolute top-[110%] left-0 w-full bg-[#1A1D26]/75 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 flex flex-col animate-in slide-in-from-top-2 fade-in duration-200">
              {SETTINGS_SIDEBAR_LINKS.map((link) => {
                const Icon = link.icon;
                const isCurrentlyActive = activeTab === link.id;
                return (
                  <button 
                    key={link.id}
                    onClick={() => {
                      onTabChange(link.id);
                      setIsMobileDropdownOpen(false);
                    }}
                    className={"flex items-center w-full px-5 py-3.5 gap-3 transition-colors " + (isCurrentlyActive ? "bg-white/5" : "hover:bg-white/5")}
                  >
                    <Icon size={18} className={isCurrentlyActive ? "text-primary-green" : "text-white/50"} />
                    <span className={"font-raleway font-medium text-[14px] " + (isCurrentlyActive ? "text-primary-green" : "text-white/90")}>
                      {link.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP SIDEBAR VIEW */}
      <aside className="hidden lg:flex flex-col w-[310px] shrink-0 bg-white/10 rounded-[30px] overflow-hidden border border-white/5 shadow-2xl backdrop-blur-md">
        <div className="p-8 pb-6 flex items-center gap-4">
          <Link
            href="/profile"
            className="flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 text-white/70 transition-colors"
            aria-label="Back to Profile"
          >
            <FiArrowLeft size={18} />
          </Link>
          <div className="flex flex-col">
            <h2 className="font-raleway font-bold text-[20px] leading-6 text-white">
              Project Settings
            </h2>
            <span className="font-sans font-medium text-[12px] text-white/50 mt-0.5">
              Manage your workspace
            </span>
          </div>
        </div>

        <nav className="flex flex-col w-full py-4 gap-1">
          {SETTINGS_SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            const isCurrentlyActive = activeTab === link.id;

            return (
              <button
                key={link.id}
                onClick={() => onTabChange(link.id)}
                className={"relative flex items-center w-full h-13 px-6.75 gap-3.75 transition-colors " + (isCurrentlyActive ? "bg-gradient-to-r from-primary-green/20 to-transparent" : "hover:bg-white/5")}
              >
                {isCurrentlyActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-12 bg-primary-green rounded-r-[50px]" />
                )}

                <Icon
                  size={20}
                  className={isCurrentlyActive ? "text-primary-green" : "text-white/70"}
                />
                <span
                  className={"font-raleway font-medium text-[16px] leading-4.75 " + (isCurrentlyActive ? "text-primary-green" : "text-white/90")}
                >
                  {link.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
