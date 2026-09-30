"use client";
import { FiMapPin, FiCheckCircle } from "react-icons/fi";
import VerificationBanner from "../../layout/VerificationBanner";


interface UserProfile {
  firstName: string;
  lastName: string;
  role?: string;
  avatarUrl?: string | null;
  location?: string;
  bio?: string | null;
  skills?: string[];
  specializations?: string[];
  primaryRoles?: string[];
}

interface ProfileLeftColumnProps {
  user?: UserProfile;
  isOwnProfile?: boolean;
}

export default function ProfileLeftColumn({
  user,
  isOwnProfile = true,
}: ProfileLeftColumnProps) {
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Your profile";
  const location = user?.location;
  const coverImage = user?.avatarUrl;
  const primaryRoles = user?.primaryRoles || (user?.role ? [user.role] : []);
  const specializations = user?.specializations || user?.skills || [];

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* Profile Hero Card */}
      <div className="w-full h-64 md:h-87.75 rounded-[35px] border-[1.8px] border-primary-green relative overflow-hidden bg-white/10 shadow-[0_3.7px_3.7px_rgba(0,0,0,0.25)] group">
        {/* Dynamic Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-60 transition-transform duration-700 group-hover:scale-105"
          style={
            coverImage ? { backgroundImage: `url(${coverImage})` } : undefined
          }
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />



        <div className="absolute bottom-6 left-4 md:left-6 flex flex-col gap-1 pr-4 z-20">
          {/* User Details */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-raleway font-bold text-[22px] md:text-[26px] text-white leading-tight">
                {displayName}
              </h1>
              {/* Verification Badge */}
              <FiCheckCircle
                className="text-primary-green shrink-0"
                size={18}
              />
            </div>
            <span className="font-raleway font-normal text-[14px] md:text-[16px] text-white/80">
              {user?.role || "Member"}
            </span>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {location && (
                <div className="flex items-center gap-1">
                  <FiMapPin className="text-white/60 shrink-0" size={12} />
                  <span className="font-raleway font-normal text-[11px] md:text-[10px] text-white/60 truncate">
                    {location}
                  </span>
                </div>
              )}
              {/* Availability Pill — aligned with location */}
              <div className="bg-primary-green rounded-full px-3 py-1 shadow-md flex items-center justify-center">
                <span className="font-raleway font-semibold text-[9px] md:text-[10px] text-white whitespace-nowrap">
                  Open to Collaborate
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOwnProfile && <VerificationBanner />}

      <div className="w-full bg-white/5 border border-white/10 rounded-[35px] p-5 md:p-6 flex flex-col gap-4 backdrop-blur-md">
        <div className="flex flex-col">
          <span className="font-raleway font-semibold text-[12px] text-white/60 uppercase tracking-[0.6px]">
            Areas of Expertise
          </span>
          <span className="font-raleway font-normal text-[13px] text-white/60 leading-5 mt-2">
            {user?.bio ||
              (isOwnProfile
                ? "Add a bio in Account Settings to introduce your creative work."
                : "No bio provided.")}
          </span>
        </div>

        <h2 className="font-raleway font-bold text-[16px] md:text-[18px] text-white mt-2">
          Skills & Specializations
        </h2>

        <div className="flex flex-col gap-3 w-full">
          <span className="font-raleway font-semibold text-[11px] text-text-muted uppercase tracking-[0.55px]">
            Primary Roles
          </span>
          <div className="flex flex-wrap gap-2">
            {primaryRoles.length ? (
              primaryRoles.map((role) => (
                <span
                  key={role}
                  className="bg-primary-green/10 border border-primary-green/50 rounded-full px-2.5 py-1.5 font-raleway font-semibold text-[12px] md:text-[13px] text-primary-green"
                >
                  {role}
                </span>
              ))
            ) : (
              <span className="text-white/45 text-[13px]">
                No roles added yet.
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full mt-1">
          <span className="font-raleway font-semibold text-[11px] text-text-muted uppercase tracking-[0.55px]">
            Specializations
          </span>
          <div className="flex flex-wrap gap-2">
            {specializations.length ? (
              specializations.map((spec) => (
                <span
                  key={spec}
                  className="bg-white/10 border border-white/10 rounded-full px-2.5 py-1.5 font-raleway font-normal text-[12px] md:text-[13px] text-white/70"
                >
                  {spec}
                </span>
              ))
            ) : (
              <span className="text-white/45 text-[13px]">
                No specializations added yet.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}