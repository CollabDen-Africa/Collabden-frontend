"use client";

import React, { useState } from "react";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";
import { PROFILE_FORM_FIELDS } from "@/lib/mockData";
import Avatar from "@/components/ui/Avatar";

export default function ProfileSettingsContent() {
  const [activeTheme, setActiveTheme] = useState("dark");

  return (
    <div className="flex flex-col w-full flex-1 gap-8.75">
      
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="font-raleway font-semibold text-[26.4px] leading-8.5 text-white">
          Personal Information
        </h1>
        <p className="font-raleway font-normal text-[20.5px] leading-7.25 text-white/50">
          Manage your profile and how others see you
        </p>
      </div>

      {/* Profile Picture Card */}
      <div className="w-full bg-white/5 border-[1.6px] border-white/10 rounded-[35px] p-8.75 flex flex-row items-center gap-7.25 backdrop-blur-md">
        <Avatar 
                  name="Oyinda" 
                  src="/mock-profiles/tayo.png" 
                  className="w-[126.7px] h-[126.7px] border-4 border-accent-green-success/35 text-[40px]" 
                />
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <span className="font-raleway font-medium text-[20.5px] text-white">Profile Picture</span>
            <span className="font-raleway font-normal text-[17.6px] text-white/50">JPG, PNG or GIF · Max 5MB</span>
          </div>
          <div className="flex flex-row items-center gap-3 mt-1.5">
            <button className="bg-primary-green hover:bg-primary-green/90 text-white font-raleway font-semibold text-[17.6px] px-4.5 py-2.25 rounded-[17.6px] transition-colors">
              Upload New
            </button>
            <button className="border-[1.6px] border-white/10 hover:border-white/30 text-white/60 hover:text-white font-raleway font-medium text-[17.6px] px-4.5 py-2.25 rounded-[17.6px] transition-all">
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Form Fields Card */}
      <div className="w-full bg-white/5 border-[1.6px] border-white/10 rounded-[35px] flex flex-col backdrop-blur-md overflow-hidden">
        {PROFILE_FORM_FIELDS.map((field, index) => (
          <div 
            key={field.id} 
            className={`flex flex-row justify-between items-start w-full px-8.75 py-5.75 ${
              index !== PROFILE_FORM_FIELDS.length - 1 ? "border-b-[1.6px] border-white/5" : ""
            }`}
          >
            <div className="flex flex-col gap-1.25 max-w-[80%]">
              <span className="font-raleway font-normal text-[17.6px] text-white/50">
                {field.label}
              </span>
              <span className="font-raleway font-normal text-[20.5px] text-white leading-7.25 wrap-break-word">
                {field.value}
              </span>
            </div>
            <button className="border-[1.6px] border-white/10 hover:border-white/30 hover:bg-white/5 rounded-[17.6px] px-4.5 py-2.25 transition-all shrink-0 mt-1">
              <span className="font-raleway font-medium text-[17.6px] text-accent-soft-blue/70">Edit</span>
            </button>
          </div>
        ))}
      </div>

      {/* Theme Preference Card */}
      <div className="w-full bg-white/5 border-[1.6px] border-white/10 rounded-[35px] p-8.75 flex flex-col gap-5.75 backdrop-blur-md">
        <span className="font-inter font-medium text-[20.5px] text-accent-soft-blue">Theme Preference</span>
        
        <div className="flex flex-row flex-wrap gap-4.25">
          
          <button 
            onClick={() => setActiveTheme("light")}
            className={`flex items-center gap-3 px-5.75 py-3 rounded-[23.5px] border-[1.6px] transition-all ${
              activeTheme === "light" ? "bg-primary-green border-primary-green text-white" : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
            }`}
          >
            <FiSun size={20} className={activeTheme === "light" ? "text-white" : "text-white/50"} />
            <span className="font-inter font-medium text-[20.5px]">Light</span>
          </button>

          <button 
            onClick={() => setActiveTheme("dark")}
            className={`flex items-center gap-3 px-5.75 py-3 rounded-[23.5px] border-[1.6px] transition-all ${
              activeTheme === "dark" ? "bg-primary-green border-primary-green text-white" : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
            }`}
          >
            <FiMoon size={20} className={activeTheme === "dark" ? "text-white" : "text-white/50"} />
            <span className="font-inter font-medium text-[20.5px]">Dark</span>
          </button>

          <button 
            onClick={() => setActiveTheme("system")}
            className={`flex items-center gap-3 px-5.75 py-3 rounded-[23.5px] border-[1.6px] transition-all ${
              activeTheme === "system" ? "bg-primary-green border-primary-green text-white" : "bg-white/5 border-white/10 text-white/50 hover:border-white/30"
            }`}
          >
            <FiMonitor size={20} className={activeTheme === "system" ? "text-white" : "text-white/50"} />
            <span className="font-inter font-medium text-[20.5px]">System</span>
          </button>

        </div>
      </div>

    </div>
  );
}