"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiSettings, FiMessageSquare } from "react-icons/fi";
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
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];

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
    [
      "a primary role",
      Boolean(profile?.role || toList(profile?.primaryRoles).length),
    ],
    ["your location", Boolean(profile?.location)],
    ["an about section", Boolean(profile?.bio)],
    [
      "your skills",
      Boolean(
        toList(profile?.skills).length ||
          toList(profile?.specializations).length
      ),
    ],
    ["your experience", Boolean(profile?.yearsOfExperience)],
    ["your creative philosophy", Boolean(profile?.creativePhilosophy)],
  ] as const;
  const localPercentage = Math.round(
    (checks.filter(([, complete]) => complete).length / checks.length) * 100
  );
  const missing = checks
    .filter(([, complete]) => !complete)
    .map(([label]) => label);
  const backendPercentage = Number.isFinite(backendValue)
    ? Math.min(100, Math.max(0, backendValue))
    : 0;
  const percentage = Math.max(backendPercentage, localPercentage);
  const suggestion = missing.length
    ? `Add ${missing.slice(0, 2).join(" and ")} to improve your profile.`
    : "Your profile is complete and ready for collaborators.";

  return { percentage, suggestion };
};

export default function ProfileOverview() {
  const { user: authUser } = useAuth();
  const searchParams = useSearchParams();
  const queryUserId = searchParams.get("id") || searchParams.get("userId");

  const {
    useCurrentProfile,
    useUserProfile,
    usePortfolio,
    useCompleteness,
    useUpdateProfile,
  } = useProfile();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: ownProfile, isLoading: isOwnLoading } = useCurrentProfile();

  const targetId =
    queryUserId &&
    queryUserId !== ownProfile?.id &&
    queryUserId !== authUser?.id
      ? queryUserId
      : null;
  const { data: targetProfile, isLoading: isTargetLoading } = useUserProfile(
    targetId || ""
  );

  const profile = targetId ? targetProfile : ownProfile;
  const isLoading = targetId ? isTargetLoading : isOwnLoading;

  const isOwnProfile = !targetId;

  const { data: portfolioData } = usePortfolio(profile?.id || "");
  const { data: completeness } = useCompleteness();
  const updateProfile = useUpdateProfile(profile?.id || "");

  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "error";
  } | null>(null);

  const showToast = (message: string, tone: "success" | "error") => {
    setToast({ message, tone });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleSaveProfile = async (data: Record<string, unknown>) => {
    if (!isOwnProfile) return;
    try {
      await updateProfile.mutateAsync(data);
      showToast("Profile updated successfully.", "success");
    } catch (error: any) {
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update profile.";
      showToast(msg, "error");
      throw error;
    }
  };

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
    return (
      <div className="py-20 text-center text-white/50 font-raleway">
        Loading profile…
      </div>
    );
  }

  const displayName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    profile?.legalName ||
    profile?.email?.split("@")[0] ||
    "User Profile";

  return (
    <div className="w-full flex flex-col gap-8 pt-4 animate-in fade-in duration-300 mt-5 relative">
      {/* Top Action Header */}
      <div className="flex items-center justify-between w-full">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-raleway bg-white/5 hover:bg-white/10 px-3 py-3 rounded-full border border-white/5"
        >
          <IoIosArrowBack size={24} />
        </Link>

        <div className="pl-10 sm:pl-0">
          <h1 className="font-semibold text-[38px] leading-5.75">
            {isOwnProfile ? "Profile Overview" : displayName}
          </h1>
        </div>

        {isOwnProfile ? (
          <Link
            href="/profile-settings"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-raleway bg-white/5 hover:bg-white/10 px-3 py-3 rounded-full border border-white/10"
            title="Account Settings"
          >
            <FiSettings size={24} />
          </Link>
        ) : (
          <Link
            href={`/workspace/messages?userId=${profile?.id}`}
            className="flex items-center gap-2 text-white font-raleway bg-primary-green hover:bg-accent-green-success transition-colors px-4 py-2.5 rounded-full border border-primary-green text-sm font-semibold shadow-lg"
          >
            <FiMessageSquare size={18} />
            <span>Message</span>
          </Link>
        )}
      </div>

      {isOwnProfile && (
        <ProfileCompletion
          percentage={completion.percentage}
          suggestion={completeness?.suggestion || completion.suggestion}
          onEdit={() => setIsEditOpen(true)}
        />
      )}

      {/* 3-Column Layout */}
      <div className="flex flex-col xl:flex-row gap-6 2xl:gap-8 w-full items-stretch">
        {/* Left Column */}
        <div className="flex-1 w-full min-w-0 xl:min-w-75">
          <ProfileLeftColumn
            isOwnProfile={isOwnProfile}
            user={{
              firstName: profile?.firstName || "",
              lastName: profile?.lastName || "",
              role: profile?.role,
              avatarUrl: profile?.avatarUrl,
              location: profile?.location,
              bio: profile?.bio,
              skills,
              specializations: toList(profile?.specializations),
              primaryRoles: toList(profile?.primaryRoles),
            }}
          />
        </div>

        {/* Middle Column */}
        <div className="flex-[1.2] w-full min-w-0 xl:min-w-[320px]">
          <ProfileMiddleColumn
            bio={profile?.bio}
            yearsOfExperience={profile?.yearsOfExperience}
            creativePhilosophy={profile?.creativePhilosophy}
            portfolio={portfolio}
          />
        </div>

        {/* Right Column */}
        <div className="flex-1 w-full min-w-0 xl:min-w-75">
          <ProfileRightColumn
            portfolioCount={portfolio.length}
            skillCount={skills.length}
            role={profile?.role}
          />
        </div>
      </div>

      <TestimonialsSection endorsements={profile?.endorsements || []} />

      {isOwnProfile && (
        <ProfileEditModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          profile={profile}
          onSave={handleSaveProfile}
        />
      )}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-999 flex items-center gap-2.5 rounded-2xl px-5 py-3.5 text-sm font-semibold text-white shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-4 border ${
            toast.tone === "success"
              ? "bg-primary-green/20 border-primary-green/50 text-primary-green"
              : "bg-red-500/20 border-red-500/50 text-red-400"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
