"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FiSettings } from "react-icons/fi";
import { IoIosArrowBack } from "react-icons/io";
import ProfileCompletion from "@/components/features/profile/ProfileCompletion";
import ProfileLeftColumn from "@/components/features/profile/ProfileLeftColumn";
import ProfileMiddleColumn from "@/components/features/profile/ProfileMiddleColumn";
import ProfileRightColumn from "@/components/features/profile/ProfileRightColumn";
import TestimonialsSection from "@/components/features/profile/TestimonialsSection";
import ProfileEditModal from "@/components/features/profile/ProfileEditModal";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/profile/useProfile";

const toList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

const getCompletion = (profile: any, completeness: any) => {
  const backendValue = Number(
    completeness?.percentage ??
    completeness?.completionPercentage ??
    completeness?.completeness ??
    completeness?.completion ??
    completeness?.data?.percentage ??
    completeness?.data?.completionPercentage
  );
  const checks = [
    ["your name", Boolean(profile?.firstName || profile?.lastName)],
    ["a profile photo", Boolean(profile?.avatarUrl)],
    ["a primary role", Boolean(profile?.role || toList(profile?.primaryRoles).length)],
    ["your location", Boolean(profile?.location)],
    ["an about section", Boolean(profile?.bio)],
    ["your skills", Boolean(toList(profile?.skills).length || toList(profile?.specializations).length)],
    ["your experience", Boolean(profile?.yearsOfExperience)],
    ["your creative philosophy", Boolean(profile?.creativePhilosophy)],
  ] as const;
  const localPercentage = Math.round((checks.filter(([, complete]) => complete).length / checks.length) * 100);
  const missing = checks.filter(([, complete]) => !complete).map(([label]) => label);
  const backendPercentage = Number.isFinite(backendValue) ? Math.min(100, Math.max(0, backendValue)) : 0;
  const percentage = Math.max(backendPercentage, localPercentage);
  const suggestion = missing.length
    ? `Add ${missing.slice(0, 2).join(" and ")} to improve your profile.`
    : "Your profile is complete and ready for collaborators."

  return { percentage, suggestion };
};

export default function ProfileOverview() {
  const { user } = useAuth();
  const { useCurrentProfile, usePortfolio, useCompleteness, useUpdateProfile } = useProfile();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data: profile, isLoading } = useCurrentProfile();
  const { data: portfolioData } = usePortfolio(profile?.id || user?.id || "");
  const { data: completeness } = useCompleteness();
  const updateProfile = useUpdateProfile(profile?.id || user?.id || "");
  const rawPortfolio = Array.isArray(portfolioData)
    ? portfolioData
    : portfolioData?.projects || portfolioData?.portfolio || [];
  const portfolio = rawPortfolio.map((item: any) => ({
    id: String(item.id || item.projectId),
    title: item.title || item.name || "Untitled project",
    role: item.role || item.genre,
    status: item.status,
    image: item.image || item.coverImage || item.thumbnailUrl,
  }));
  const completion = getCompletion(profile, completeness);
  const skills = toList(profile?.skills);

  if (isLoading) {
    return <div className="py-20 text-center text-white/50">Loading your profile…</div>;
  }

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

      <ProfileCompletion percentage={completion.percentage} suggestion={completeness?.suggestion || completion.suggestion} onEdit={() => setIsEditOpen(true)} />

      {/* 3-Column Layout */}
      <div className="flex flex-col xl:flex-row gap-6 2xl:gap-8 w-full items-stretch">
        
        {/* Left Column */}
        <div className="flex-1 w-full min-w-75">
          <ProfileLeftColumn user={{
            firstName: profile?.firstName || user?.firstName || "",
            lastName: profile?.lastName || user?.lastName || "",
            role: profile?.role,
            avatarUrl: profile?.avatarUrl,
            location: profile?.location,
            bio: profile?.bio,
            skills,
            specializations: toList(profile?.specializations),
            primaryRoles: toList(profile?.primaryRoles),
          }} />
        </div>
        
        {/* Middle Column */}
        <div className="flex-[1.2] w-full min-w-[320px]">
          <ProfileMiddleColumn
            bio={profile?.bio}
            yearsOfExperience={profile?.yearsOfExperience}
            creativePhilosophy={profile?.creativePhilosophy}
            portfolio={portfolio}
          />
        </div>
        
        {/* Right Column */}
        <div className="flex-1 w-full min-w-75">
          <ProfileRightColumn portfolioCount={portfolio.length} skillCount={skills.length} role={profile?.role} />
        </div>

      </div>

      <TestimonialsSection endorsements={profile?.endorsements || []} />
      <ProfileEditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} profile={profile} onSave={(data) => updateProfile.mutateAsync(data)} />
    </div>
  );
}
