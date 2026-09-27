"use client";
import { FiBriefcase, FiStar, FiUser } from "react-icons/fi";

export default function ProfileRightColumn({
  portfolioCount = 0,
  skillCount = 0,
  role,
}: {
  portfolioCount?: number;
  skillCount?: number;
  role?: string;
}) {
  const profileDetails = [
    { label: "Portfolio Projects", value: portfolioCount, icon: FiBriefcase },
    { label: "Skills", value: skillCount, icon: FiStar },
    { label: "Primary Role", value: role || "Not set", icon: FiUser },
  ];
  return (
    <div className="flex flex-col gap-6 w-full h-full">
      
      {/* Achievements Section */}
      <div className="w-full bg-white/5 border border-white/10 rounded-[35px] p-6 flex flex-col backdrop-blur-md">
        <h2 className="font-raleway font-bold text-[18px] text-white mb-4">Profile Details</h2>
        <div className="flex items-center justify-between gap-2.5">
          {profileDetails.map((item) => {
            const DetailIcon = item.icon;
            
            return (
              <div key={item.label} className="flex-1 h-30 bg-white/5 border border-white/20 rounded-[30px] flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                <DetailIcon className="text-white/40 mb-1" size={20} />
                <span className="font-raleway font-bold text-[22px] text-white leading-none text-center break-words">{item.value}</span>
                <span className="font-raleway font-normal text-[11px] text-white/45 text-center leading-4 px-2">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity and social analytics are not currently provided by the profile API. */}
      <div className="w-full bg-white/5 border border-white/10 rounded-[35px] p-6 flex flex-col backdrop-blur-md">
        <h2 className="font-raleway font-bold text-[18px] text-white mb-4">Profile Insights</h2>
        <p className="font-raleway text-sm text-white/45 leading-5">Profile views and engagement analytics will appear here when they are available.</p>
      </div>

    </div>
  );
}
