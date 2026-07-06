"use client";
import { FiMapPin, FiCheckCircle } from "react-icons/fi";
import { PRIMARY_ROLES, SPECIALIZATIONS, MOCK_USER } from "@/lib/mockData";
import VerificationBanner from "../../layout/VerificationBanner";


interface UserProfile {
  firstName: string;
  lastName: string;
  role?: string;
  avatarUrl?: string | null;
  location?: string;
}

interface ProfileLeftColumnProps {
  user?: UserProfile;
}

export default function ProfileLeftColumn({ user = MOCK_USER }: ProfileLeftColumnProps) {
  const displayName = `${user.firstName} ${user.lastName}`;
    const location = user.location || "Lagos, Nigeria";
  const coverImage = user.avatarUrl || '/mock-profiles/bigplaceholder.jpg';
  
  return (
    <div className="flex flex-col gap-6 w-full h-full">
      
      {/* Profile Hero Card */}
      <div className="w-full h-87.75 rounded-[35px] border-[1.8px] border-primary-green relative overflow-hidden bg-white/10 shadow-[0_3.7px_3.7px_rgba(0,0,0,0.25)] group">
        
        {/* Dynamic Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-60 transition-transform duration-700 group-hover:scale-105" 
                  style={{ backgroundImage: `url(${coverImage})` }}
                />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Availability Pill */}
        <div className="absolute top-3/4 right-6 bg-primary-green rounded-full px-2.75 py-1.25">
          <span className="font-raleway font-normal text-[11px] text-white">Open to Collaborate</span>
        </div>

        <div className="absolute bottom-6 left-6 flex flex-col gap-0.5">
          
                    {/* User Details */}
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
              <h1 className="font-raleway font-bold text-[26px] text-white leading-none">{displayName}</h1>
                        {/* Verification Badge */}
                        <FiCheckCircle className="text-primary-green" size={18} />
                      </div>
                      <span className="font-raleway font-normal text-[16px] text-white/80">{user.role || 'Member'}</span>
                      <div className="flex items-center gap-1 mt-1">
                        <FiMapPin className="text-white/60" size={12} />
                        <span className="font-raleway font-normal text-[10px] text-white/60">{location}</span>
                      </div>
                    </div>
                  </div>
                </div>

      {/* Verification Banner */}
      <VerificationBanner />

      {/* Skills & Specializations Section */}
      <div className="w-full bg-white/5 border border-white/10 rounded-[35px] p-6 flex flex-col gap-4 backdrop-blur-md">
        
        {/* Areas of Expertise */}
        <div className="flex flex-col">
          <span className="font-raleway font-semibold text-[12px] text-white/60 uppercase tracking-[0.6px]">
            Areas of Expertise
          </span>
          {/* Note to self: Remember to un-hardcode this */}
          <span className="font-raleway font-normal text-[13px] text-white/60 leading-5 mt-2">
            UX Strategy · Product Design · Brand Identity · Music Production
          </span>
        </div>

        <h2 className="font-raleway font-bold text-[18px] text-white mt-2">Skills & Specializations</h2>
        
        <div className="flex flex-col gap-3 w-full">
          <span className="font-raleway font-semibold text-[11px] text-text-muted uppercase tracking-[0.55px]">Primary Roles</span>
          <div className="flex flex-wrap gap-2">
            {PRIMARY_ROLES.map(role => (
              <span key={role} className="bg-primary-green/10 border border-primary-green/50 rounded-full px-2.5 py-1.5 font-raleway font-semibold text-[13px] text-primary-green">
                {role}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full mt-1">
          <span className="font-raleway font-semibold text-[11px] text-text-muted uppercase tracking-[0.55px]">Specializations</span>
          <div className="flex flex-wrap gap-2">
            {SPECIALIZATIONS.map(spec => (
              <span key={spec} className="bg-white/10 border border-white/10 rounded-full px-2.5 py-1.5 font-raleway font-normal text-[13px] text-white/70">
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}