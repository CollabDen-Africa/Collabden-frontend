"use client";

import React from "react";
import Link from "next/link";
import { FiSettings } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import ProfileCompletion from "@/components/features/profile/ProfileCompletion";
import ProfileLeftColumn from "@/components/features/profile/ProfileLeftColumn";
import ProfileMiddleColumn from "@/components/features/profile/ProfileMiddleColumn";
import ProfileRightColumn from "@/components/features/profile/ProfileRightColumn";
import TestimonialsSection from "@/components/features/profile/TestimonialsSection";

export default function ProfileOverview() {
  return (
    <div className="w-full flex flex-col gap-[32px] pt-4 animate-in fade-in duration-300">
      
      {/* Top Action Header */}
      <div className="flex items-center justify-between w-full">
        <Link 
          href="/dashboard"
          className="flex items-center gap-[8px] text-white/70 hover:text-white transition-colors font-raleway bg-white/5 hover:bg-white/10 px-[12px] py-[12px] rounded-full border border-white/5"
        >
          <IoIosArrowBack size={24} />
        </Link>

        <Link 
          href="profile/profile-settings" 
          className="flex items-center gap-[8px] text-white/70 hover:text-white transition-colors font-raleway bg-white/5 hover:bg-white/10 px-3 py-3 rounded-full border border-white/10"
        >
          <FiSettings size={24} />
        </Link>
      </div>

      <ProfileCompletion />

      {/* 3-Column Fluid Layout (Fixes the cut-off issue) */}
      <div className="flex flex-col xl:flex-row gap-[24px] 2xl:gap-[32px] w-full items-stretch">
        
        {/* Left Column - Takes up ~28% of the space */}
        <div className="flex-1 w-full min-w-[300px]">
          <ProfileLeftColumn />
        </div>
        
        {/* Middle Column - Slightly wider, takes up ~36% of the space */}
        <div className="flex-[1.2] w-full min-w-[320px]">
          <ProfileMiddleColumn />
        </div>
        
        {/* Right Column - Takes up ~31% of the space */}
        <div className="flex-1 w-full min-w-[300px]">
          <ProfileRightColumn />
        </div>

      </div>

      <TestimonialsSection />
    </div>
  );
}