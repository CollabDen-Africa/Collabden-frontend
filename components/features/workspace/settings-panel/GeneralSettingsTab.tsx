"use client";

import React, { useState } from "react";
import { FiSliders } from "react-icons/fi";
import DatePicker from "@/components/ui/DatePicker";

export default function GeneralSettingsTab() {
  const [projectName, setProjectName] = useState("Urban Beats Vol.2");
  const [description, setDescription] = useState(
    "A collaborative afrofusion EP exploring the textures of Lagos nightlife produced across three studios and twelve creators."
  );
  const [dueDate, setDueDate] = useState<Date | null>(new Date("2026-05-29T00:00:00"));

  const MAX_DESC_LENGTH = 120;

  return (
    <div className="w-full max-w-[931px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] lg:rounded-[50px] p-[32px] lg:p-[48px] shadow-2xl animate-in fade-in slide-in-from-right-8 duration-500">
      
      <div className="flex flex-col gap-[32px] lg:gap-[40px] w-full max-w-[860px]">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center p-[20px] lg:p-[24px] gap-[16px] bg-black/10 rounded-[30px] border border-white/5 shadow-inner">
          <div className="w-[54px] h-[54px] bg-white/20 rounded-[15px] flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
            <FiSliders className="text-white" size={24} />
          </div>
          <div className="flex flex-col justify-center gap-[4px]">
            <h2 className="font-raleway font-semibold text-[22px] lg:text-[25px] leading-[29px] text-white">
              General
            </h2>
            <p className="font-raleway font-medium text-[15px] lg:text-[18px] leading-[21px] text-white/60">
              Core information about your project, visible to everyone you collaborate with.
            </p>
          </div>
        </div>

        {/* Project Name Field */}
        <div className="flex flex-col gap-[16px] w-full">
          <div className="flex flex-col gap-[4px] lg:gap-[8px]">
            <label className="font-raleway font-semibold text-[16px] lg:text-[18px] text-white">
              Project Name
            </label>
            <span className="font-raleway font-normal text-[14px] lg:text-[15px] text-white/60">
              Shown to all collaborators and on shared links.
            </span>
          </div>
          
          <div className="w-full h-[50px] bg-white/10 border border-transparent focus-within:border-primary-green focus-within:bg-white/15 rounded-full flex items-center px-[24px] transition-all duration-300 shadow-sm">
            <input 
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-transparent border-none outline-none font-raleway font-medium text-[16px] text-white placeholder:text-white/40"
              placeholder="Enter project name..."
            />
          </div>
        </div>

        {/* Description Field */}
        <div className="flex flex-col gap-[16px] w-full">
          <div className="flex flex-col gap-[4px] lg:gap-[8px]">
            <label className="font-raleway font-semibold text-[16px] lg:text-[18px] text-white">
              Description
            </label>
            <span className="font-raleway font-normal text-[14px] lg:text-[15px] text-white/60">
              A short summary of what this project is about.
            </span>
          </div>
          
          <div className="flex flex-col gap-[8px] w-full">
            <div className="w-full min-h-[118px] bg-white/10 border border-transparent focus-within:border-primary-green focus-within:bg-white/15 rounded-[30px] p-[24px] lg:p-[32px] transition-all duration-300 shadow-sm">
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={MAX_DESC_LENGTH}
                className="w-full h-full min-h-[70px] bg-transparent border-none outline-none font-raleway font-medium text-[16px] leading-[24px] text-white placeholder:text-white/40 resize-none custom-scrollbar"
                placeholder="Describe your project..."
              />
            </div>
            
            {/* Character Count */}
            <div className="w-full flex justify-end px-[8px]">
              <span className="font-sans font-medium text-[12px] text-[#8B9092]">
                {description.length}/{MAX_DESC_LENGTH}
              </span>
            </div>
          </div>
        </div>

        {/* Due Date Field */}
        <div className="flex flex-col gap-[16px] w-full lg:w-[403px]">
          <div className="flex flex-col gap-[4px] lg:gap-[8px]">
            <label className="font-raleway font-semibold text-[16px] text-white">
              Due Date
            </label>
            <span className="font-raleway font-normal text-[14px] lg:text-[15px] text-white/60">
              Help collaborators see your target delivery.
            </span>
          </div>
          
          <DatePicker 
                      selectedDate={dueDate}
                      onSelect={(date) => setDueDate(date)}
                      className="w-full"
                    />
        </div>

      </div>
      
    </div>
  );
}