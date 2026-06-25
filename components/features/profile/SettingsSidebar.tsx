"use client";

import React from "react";
import { SETTINGS_SIDEBAR_LINKS } from "@/lib/mockData";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function SettingsSidebar() {
  return (
    <div className="w-full flex flex-col shrink-0 bg-black/20 rounded-[30px] overflow-hidden backdrop-blur-md border border-white/5 py-16">
      
      {/* Header / Logo Area */}
      <div className="flex items-center gap-3.75 px-6.75 mb-10">
        <div className="w-9 h-9 bg-primary-green rounded-[9.5px] flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
            <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
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
          return (
            <button 
              key={link.id}
              className={`relative flex items-center w-full h-13 px-6.75 gap-3.75 transition-colors ${
                link.isActive 
                  ? "bg-linear-to-r from-primary-green/20 to-transparent" 
                  : "hover:bg-white/5"
              }`}
            >
              {/* Active Left Border Indicator */}
              {link.isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-12 bg-primary-green rounded-r-[50px]" />
              )}
              
              <Icon 
                size={20} 
                className={link.isActive ? "text-primary-green" : "text-white/70"} 
              />
              <span 
                className={`font-raleway font-medium text-[16px] leading-4.75 ${
                  link.isActive ? "text-primary-green" : "text-white/90"
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
                className="flex items-center gap-[8px] text-white/50 hover:text-white transition-colors font-raleway font-medium text-[14px] bg-white/5 hover:bg-white/10 px-[16px] py-[8px] rounded-full border border-white/5"
              >
                <FiArrowLeft size={16} />
                <span>Back to Profile</span>
              </Link>
            </div>
            

    </div>
  );
}