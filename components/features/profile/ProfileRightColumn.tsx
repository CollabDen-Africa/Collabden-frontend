"use client";
import { 
  FiEye, 
  FiActivity, 
  FiUsers, 
  FiUserPlus, 
  FiBookmark, 
  FiMessageSquare,
  FiTrendingUp
} from "react-icons/fi";
import { ACHIEVEMENTS, INSIGHTS, SOCIAL_LINKS } from "@/lib/mockData";

// Local mapping for Insight icons
const INSIGHT_ICONS: Record<number, React.ElementType> = {
  1: FiEye,            // Profile Views
  2: FiActivity,       // Portfolio Engagement
  3: FiUsers,          // Project Invitations
  4: FiUserPlus,       // Connection Requests
  5: FiBookmark,       // Profile Saves
  6: FiMessageSquare,  // Direct Messages
};

export default function ProfileRightColumn() {
  return (
    <div className="flex flex-col gap-6 w-full h-full">
      
      {/* Achievements Section */}
      <div className="w-full bg-white/5 border border-white/10 rounded-[35px] p-6 flex flex-col backdrop-blur-md">
        <h2 className="font-raleway font-bold text-[18px] text-white mb-4">Activity & Achievements</h2>
        <div className="flex items-center justify-between gap-2.5">
          {ACHIEVEMENTS.map((item) => {
            const AchievementIcon = item.icon;
            
            return (
              <div key={item.id} className="flex-1 h-30 bg-white/5 border border-white/20 rounded-[30px] flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                {AchievementIcon && <AchievementIcon className="text-white/40 mb-1" size={20} />}
                <span className="font-raleway font-bold text-[22px] text-white leading-none">{item.value}</span>
                <span className="font-raleway font-normal text-[11px] text-white/45 text-center leading-4 px-2">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Profile Insights Section */}
      <div className="w-full bg-white/5 border border-white/10 rounded-[35px] p-6 flex flex-col backdrop-blur-md">
        <h2 className="font-raleway font-bold text-[18px] text-white mb-4">Profile Insights</h2>
        <div className="grid grid-cols-2 gap-3">
          {INSIGHTS.map((insight) => {
            // Default to FiTrendingUp if ID is missing
            const InsightIcon = INSIGHT_ICONS[insight.id] || FiTrendingUp;

            return (
              <div key={insight.id} className="bg-white/5 border border-white/10 rounded-[14px] p-4 flex flex-col justify-between h-26.75">
                <div className="flex justify-between items-start">
                  <InsightIcon className="text-white/40" size={16} />
                  <span className="font-raleway font-semibold text-[11px] text-primary-green">{insight.change}</span>
                </div>
                <div className="flex flex-col mt-auto">
                  <span className="font-raleway font-bold text-[22px] text-white leading-none">{insight.value}</span>
                  <span className="font-raleway font-normal text-[12px] text-white/45 leading-4 mt-1">{insight.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Social & External Links Section */}
      <div className="w-full bg-white/5 border border-white/10 rounded-[35px] p-6 flex flex-col backdrop-blur-md">
        <h2 className="font-raleway font-bold text-[18px] text-white mb-4">Social & External Links</h2>
        <div className="grid grid-cols-2 gap-3">
          {SOCIAL_LINKS.map((social) => {
            const SocialIcon = social.icon;

            return (
              <a 
                key={social.id} 
                href="#" 
                className="bg-white/5 border border-white/10 rounded-[14px] p-[12px_16px] flex items-center gap-3 hover:bg-white/10 transition-colors group"
              >
                {SocialIcon && <SocialIcon className="text-white/50 group-hover:text-white transition-colors shrink-0" size={16} />}
                <div className="flex flex-col overflow-hidden">
                  <span className="font-raleway font-semibold text-[12px] text-white truncate">
                    {social.platform} 
                  </span>
                  <span className="font-raleway font-normal text-[11px] text-white/40 truncate">
                    {social.handle}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>

    </div>
  );
}