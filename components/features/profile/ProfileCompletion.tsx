"use client";
import { FiEdit3 } from "react-icons/fi";

export default function ProfileCompletion() {
  return (
    <div className="w-full h-[82px] bg-white/5 border border-white/10 rounded-[16px] flex items-center justify-between px-[20px] backdrop-blur-md">
      <div className="flex items-center gap-[16px]">
        <div className="w-[48px] h-[48px] bg-primary-green rounded-[4px] shadow-sm" />
        <div className="flex flex-col gap-[2px]">
          <span className="font-semibold text-[14px] text-white">Profile Completion — 92%</span>
          <span className="font-normal text-[12px] text-white/50">Add portfolio links to reach 100%</span>
        </div>
      </div>
      <button className="flex items-center gap-[4px] bg-primary-green/20 hover:bg-primary-green/30 transition-colors rounded-full px-[12px] py-[4px] border border-primary-green/50">
        <FiEdit3 className="text-primary-green" size={12} />
        <span className="font-semibold text-[12px] text-primary-green">Edit</span>
      </button>
    </div>
  );
}