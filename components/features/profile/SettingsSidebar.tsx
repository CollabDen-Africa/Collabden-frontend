"use client";

import React, { useState, useRef, useEffect} from "react";
import { SETTINGS_SIDEBAR_LINKS } from "@/lib/mockData";
import Link from "next/link";
import { FiArrowLeft, FiChevronDown } from "react-icons/fi";
import Image from 'next/image';

interface SettingsSidebarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
  
    // Find the currently active link data for the mobile display
    const activeLink = SETTINGS_SIDEBAR_LINKS.find(link => link.id === activeTab) || SETTINGS_SIDEBAR_LINKS[0];
    const ActiveIcon = activeLink.icon;
  
    // Close the mobile dropdown if the user clicks outside of it
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
        {/* --- MOBILE DROPDOWN VIEW (Visible below lg screens) --- */}
        <div className="flex lg:hidden flex-col w-full gap-5">
          
          {/* Mobile Header Row */}
          <div className="flex items-center justify-between w-full px-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-primary-green rounded-[9.5px] flex items-center justify-center shrink-0">
                <Image src="/collabden-logo-small.png" alt="logo" width={25} height={25} />
              </div>
              <div className="flex flex-col">
                <span className="font-raleway font-bold text-[18px] text-white leading-tight">CollabDen</span>
                <span className="font-raleway font-medium text-[12px] text-white/70">Account Settings</span>
              </div>
            </div>
            
            <Link 
              href="/profile"
              className="flex items-center justify-center w-9 h-9 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 text-white/70 transition-colors"
              aria-label="Back to Profile"
            >
              <FiArrowLeft size={16} />
            </Link>
          </div>
  
          {/* Mobile Dropdown Menu Wrapper */}
          <div className="relative w-full z-50" ref={dropdownRef}>
            <button 
              onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
              className="w-full flex justify-between items-center bg-black/20 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-md shadow-lg transition-colors hover:bg-white/5"
            >
              <div className="flex items-center gap-3">
                <ActiveIcon size={20} className="text-primary-green" />
                <span className="font-raleway font-semibold text-[15px] text-white">{activeLink.label}</span>
              </div>
              <FiChevronDown size={20} className={`text-white/50 transition-transform duration-300 ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
  
            {/* Floating Absolute Dropdown */}
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
                        setIsMobileDropdownOpen(false); // Auto-close on selection
                      }}
                      className={`flex items-center w-full px-5 py-3.5 gap-3 transition-colors ${
                        isCurrentlyActive ? "bg-white/5" : "hover:bg-white/5"
                      }`}
                    >
                      <Icon size={18} className={isCurrentlyActive ? "text-primary-green" : "text-white/50"} />
                      <span className={`font-raleway font-medium text-[14px] ${
                        isCurrentlyActive ? "text-primary-green" : "text-white/90"
                      }`}>
                        {link.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
  
        {/* --- DESKTOP SIDEBAR VIEW (Visible on lg screens and above) --- */}
        <div className="hidden lg:flex w-full flex-col shrink-0 bg-black/20 rounded-[30px] overflow-hidden backdrop-blur-md border border-white/5 py-16">
      
      {/* Header / Logo Area */}
      <div className="flex items-center gap-3.75 px-6.75 mb-10">
        <div className="w-9 h-9 bg-primary-green rounded-[9.5px] flex items-center justify-center shrink-0">
          <span>
            <Image
              src="/collabden-logo-small.png"
              alt="logo"
              width={25}
              height={25}
            />
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-raleway font-bold text-[20px] text-white leading-5.75">CollabDen</span>
          <span className="font-raleway font-medium text-[13px] text-white/70 leading-3.75">Account Settings</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col w-full">
        {SETTINGS_SIDEBAR_LINKS.map((link) => {
          const Icon = link.icon;
          const isCurrentlyActive = activeTab === link.id;
          return (
            <button 
              key={link.id}
              onClick={() => onTabChange(link.id)}
              className={`relative flex items-center w-full h-13 px-6.75 gap-3.75 transition-colors ${
                link.isActive 
                  ? "bg-linear-to-r from-primary-green/20 to-transparent" 
                  : "hover:bg-white/5"
              }`}
            >
              {/* Active Left Border Indicator */}
              {isCurrentlyActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-12 bg-primary-green rounded-r-[50px]" />
              )}
              
              <Icon 
                size={20} 
                className={isCurrentlyActive ? "text-primary-green" : "text-white/70"} 
              />
              <span 
                className={`font-raleway font-medium text-[16px] leading-4.75 ${
                  isCurrentlyActive ? "text-primary-green" : "text-white/90"
                }`}
              >
                {link.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Top Navigation */}
            <div className="w-full flex items-center justify-center mt-5">
              <Link 
                href="/profile"
                className="flex items-center gap-[8px] text-white/50 hover:text-white transition-colors font-raleway font-medium text-[14px] bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5"
              >
                <FiArrowLeft size={16} />
                <span>Back to Profile</span>
              </Link>
            </div>
            

        </div>
      </>
  );
}