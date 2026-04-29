"use client";

import React from "react";
import Avatar from "@/app/components/ui/Avatar";
import { HiOutlineLockClosed } from "react-icons/hi";

const TEAM_MEMBERS = [
  { name: "David Chen", role: "Mixing Engineer", email: "davidchen24@gmail.com", image: "/mock-profiles/David.png" },
  { name: "Tayo Oni", role: "Producer", email: "tayooni68@gmail.com", image: "/mock-profiles/Tayo.png" },
  { name: "Michael Awe", role: "Vocalist", email: "michaelawe22@gmail.com", image: "/mock-profiles/small2.png" },
  { name: "Chika Ike", role: "Bass Player", email: "johnike244@gmail.com", image: "/mock-profiles/Sam.png" }
];

export default function WorkspaceOverviewPage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Project Summary Card */}
      <section className="w-full bg-black/10 rounded-[30px] p-8 lg:p-[40px_32px] flex flex-col gap-4">
        <h2 className="font-sans font-bold text-[18px] text-white">Project Summary</h2>
        <p className="font-sans font-medium text-[16px] leading-[1.4] text-white/60 max-w-[1100px]">
          This collaborative hip-hop project brings together the raw energy of modern trap production and the warmth of soulful melodies, creating a sound that feels both current and timeless. The vision is a carefully curated 10-track EP, each song thoughtfully crafted to showcase a distinct mood while maintaining a cohesive sonic identity throughout.
        </p>
        
        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-white/60" />
            <span className="font-sans font-medium text-[13px] text-white/60">Started Mar 1st, 2026</span>
          </div>
          
          {/* Private Pill */}
          <div className="flex items-center gap-1.5 bg-primary-green/10 border border-primary-green rounded-full px-3 py-1.5">
            <HiOutlineLockClosed size={12} className="text-white" />
            <span className="font-sans font-medium text-[10px] text-white">Private</span>
          </div>

          {/* Genre */}
          <div className="flex flex-col ml-4">
            <span className="font-sans font-semibold text-[16px] text-white">Genre</span>
            <span className="font-sans font-medium text-[16px] text-white/60">Hip-hop</span>
          </div>

          {/* Status */}
          <div className="flex flex-col ml-4">
            <span className="font-sans font-semibold text-[16px] text-white mb-1">Status</span>
            <div className="bg-white/10 rounded-full px-3 py-1 flex items-center justify-center">
              <span className="font-sans font-medium text-[10px] text-[#11EA9B]">Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members Card */}
      <section className="w-full bg-black/10 rounded-[30px] p-8 lg:p-[40px_32px] flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h2 className="font-sans font-bold text-[18px] text-white">Team Members</h2>
          <span className="font-sans font-medium text-[13px] text-primary-green/60">4 Collaborators</span>
        </div>

        <div className="flex flex-col gap-6">
          {TEAM_MEMBERS.map((member, idx) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0">
              
              {/* Avatar & Name */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <Avatar name={member.name} src={member.image} className="w-[39px] h-[39px]" />
                <span className="font-sans font-bold text-[16px] text-white">{member.name}</span>
              </div>

              {/* Role */}
              <div className="flex-1 md:ml-12">
                <span className="font-sans font-medium text-[14px] text-white/60">{member.role}</span>
              </div>

              {/* Email */}
              <div className="flex-1 text-right">
                <a href={`mailto:${member.email}`} className="font-sans font-medium text-[14px] text-white/60 underline hover:text-white transition-colors">
                  {member.email}
                </a>
              </div>

            </div>
          ))}
        </div>
      </section>

    </div>
  );
}