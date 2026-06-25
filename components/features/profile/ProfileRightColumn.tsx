"use client";
import { FiTrendingUp } from "react-icons/fi";
import { ACHIEVEMENTS, INSIGHTS, SOCIAL_LINKS } from "@/lib/mockData";

export default function ProfileRightColumn() {
  return (
    <div className="flex flex-col gap-[24px] w-full h-full">
      
      {/* Achievements Section */}
      <div className="w-full h-[214px] bg-white/5 border border-white/10 rounded-[35px] p-[24px] flex flex-col backdrop-blur-md">
        <h2 className="font-bold text-[18px] text-white mb-[16px]">Activity & Achievements</h2>
        <div className="flex items-center justify-between gap-[10px]">
          {ACHIEVEMENTS.map((item) => (
            <div key={item.id} className="flex-1 h-[120px] bg-white/5 border border-white/20 rounded-[30px] flex flex-col items-center justify-center gap-[8px] hover:bg-white/10 transition-colors">
              <item.icon className="text-white/40 mb-1" size={20} />
              <span className="font-bold text-[22px] text-white leading-none">{item.value}</span>
              <span className="font-normal text-[11px] text-white/45 text-center leading-[14px] px-2">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Section */}
      <div className="w-full h-[315px] bg-white/5 border border-white/10 rounded-[35px] p-[24px] flex flex-col backdrop-blur-md">
        <h2 className="font-bold text-[18px] text-white mb-[16px]">Profile Insights</h2>
        <div className="grid grid-cols-3 gap-[8px]">
          {INSIGHTS.map((insight) => (
            <div key={insight.id} className="h-[107px] bg-white/5 border border-white/10 rounded-[14px] p-[16px] flex flex-col justify-between hover:border-white/20 transition-all cursor-default">
              <div className="flex justify-between items-start w-full">
                <FiTrendingUp className="text-white/40" size={14} />
                <span className="font-semibold text-[11px] text-primary-green">{insight.change}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[20px] text-white leading-none">{insight.value}</span>
                <span className="font-normal text-[11px] text-white/45 leading-[14px] mt-[4px]">{insight.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links Section */}
      <div className="w-full h-[264px] bg-white/5 border border-white/10 rounded-[35px] p-[24px] flex flex-col backdrop-blur-md">
        <h2 className="font-bold text-[18px] text-white mb-[16px]">Social & External Links</h2>
        <div className="grid grid-cols-2 gap-[12px]">
          {SOCIAL_LINKS.map((social) => (
            <a key={social.id} href="#" className="h-[60px] bg-white/5 border border-white/10 rounded-[14px] p-[12px_16px] flex items-center gap-[12px] hover:bg-white/10 transition-all group">
              <social.icon className="text-white/50 group-hover:text-white transition-colors" size={16} />
              <div className="flex flex-col">
                <span className="font-semibold text-[12px] text-white">{social.platform}</span>
                <span className="font-normal text-[11px] text-white/40 mt-[1px]">{social.handle}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}