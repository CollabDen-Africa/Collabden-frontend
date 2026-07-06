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
    <div className="w-full flex flex-col gap-8 pt-4 animate-in fade-in duration-300 mt-5">
      
      {/* Top Action Header */}
      <div className="flex items-center justify-between w-full">
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-raleway bg-white/5 hover:bg-white/10 px-3 py-3 rounded-full border border-white/5"
        >
          <IoIosArrowBack size={24} />
        </Link>

        <div>
          <h1 className="font-semibold text-[38px] leading-5.75">
            Profile Overview
          </h1>
        </div>

        <Link 
          href="/profile-settings" 
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-raleway bg-white/5 hover:bg-white/10 px-3 py-3 rounded-full border border-white/10"
        >
          <FiSettings size={24} />
        </Link>
      </div>

      <ProfileCompletion />

      {/* 3-Column Layout */}
      <div className="flex flex-col xl:flex-row gap-6 2xl:gap-8 w-full items-stretch">
        
        {/* Left Column */}
        <div className="flex-1 w-full min-w-75">
          <ProfileLeftColumn />
        </div>
        
        {/* Middle Column */}
        <div className="flex-[1.2] w-full min-w-[320px]">
          <ProfileMiddleColumn />
        </div>
        
        {/* Right Column */}
        <div className="flex-1 w-full min-w-75">
          <ProfileRightColumn />
        </div>

      </div>

      <TestimonialsSection />
    </div>
  );
}