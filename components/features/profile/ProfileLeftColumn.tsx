"use client";
import { FiMapPin, FiCheckCircle } from "react-icons/fi";
import { PRIMARY_ROLES, SPECIALIZATIONS } from "@/lib/mockData";

export default function ProfileLeftColumn() {
  return (
    <div className="flex flex-col gap-[24px] w-full h-full">
      {/* Profile Hero Card */}
      <div className="w-full h-[351px] rounded-[35px] border-[1.8px] border-primary-green relative overflow-hidden bg-white/10 shadow-[0_3.7px_3.7px_rgba(0,0,0,0.25)] group">
        <div className="absolute inset-0 bg-[url('/mock-profiles/tayo-large.png')] bg-cover bg-center mix-blend-overlay opacity-60 transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-[24px] left-[24px] flex flex-col gap-[2px]">
          <div className="flex items-center gap-[4px]">
            <h1 className="font-bold text-[26px] text-white">Tayo Oni</h1>
            <FiCheckCircle className="text-white mt-1" size={16} />
          </div>
          <span className="font-normal text-[16px] text-white">Producer</span>
          <div className="flex items-center gap-[4px] mt-[6px]">
            <FiMapPin className="text-white" size={12} />
            <span className="font-normal text-[10px] text-white">Lagos, Nigeria</span>
          </div>
        </div>
        <div className="absolute bottom-[24px] right-[24px] bg-primary-green rounded-[34px] px-[11px] py-[5px] shadow-lg">
          <span className="font-normal text-[11px] text-white">Open to Collaborate</span>
        </div>
      </div>

      {/* Skills Section */}
      <div className="w-full h-[450px] bg-white/5 border border-white/10 rounded-[35px] mt-5 p-[24px] flex flex-col justify-end backdrop-blur-md">
        <div className="flex flex-col gap-[20px] w-full">
          <div className="flex flex-col">
            <span className="font-semibold text-[12px] text-white/60 uppercase tracking-[0.6px]">Areas of Expertise</span>
            <span className="font-normal text-[13px] text-white/60 leading-[20px] mt-[8px]">
              UX Strategy · Product Design · Brand Identity · Music Production
            </span>
          </div>
          <h2 className="font-bold text-[18px] text-white">Skills & Specializations</h2>
          <div className="flex flex-col gap-[12px] w-full">
            <span className="font-semibold text-[11px] text-white/50 uppercase tracking-[0.55px]">Primary Roles</span>
            <div className="flex flex-wrap gap-[8px]">
              {PRIMARY_ROLES.map(role => (
                <span key={role} className="bg-primary-green/10 border border-primary-green/50 rounded-full px-[10px] py-[6px] font-semibold text-[13px] text-primary-green">{role}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-[12px] w-full mt-[4px]">
            <span className="font-semibold text-[11px] text-white/50 uppercase tracking-[0.55px]">Specializations</span>
            <div className="flex flex-wrap gap-[8px]">
              {SPECIALIZATIONS.map(spec => (
                <span key={spec} className="bg-white/10 border border-white/10 rounded-full px-[10px] py-[6px] font-normal text-[13px] text-white/70">{spec}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}