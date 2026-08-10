"use client";

import React from "react";
import Link from "next/link";
import { HiOutlineWrenchScrewdriver, HiArrowLeft } from "react-icons/hi2";

interface FeatureInProgressViewProps {
  title: string;
  description?: string;
}

export const FeatureInProgressView: React.FC<FeatureInProgressViewProps> = ({
  title,
  description = "This administrative module is currently under active development. Check back soon!",
}) => {
  return (
    <div className="w-full py-20 px-6 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
      <div className="w-20 h-20 rounded-3xl bg-primary-green/10 border border-primary-green/20 flex items-center justify-center text-primary-green mb-6 shadow-[0_0_30px_rgba(115,191,68,0.15)]">
        <HiOutlineWrenchScrewdriver size={36} />
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-green/10 border border-primary-green/20 text-primary-green text-xs font-semibold uppercase tracking-wider mb-3">
        <span>Module In Progress</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
        {title}
      </h1>

      <p className="text-white/50 text-sm md:text-base font-medium max-w-md mb-8 leading-relaxed">
        {description}
      </p>

      <Link
        href="/admin/dashboard"
        className="px-6 py-3 rounded-full bg-primary-green hover:bg-[#84d653] text-[#0d0f10] font-semibold text-sm transition-all shadow-[0_8px_24px_rgba(115,191,68,0.25)] flex items-center gap-2"
      >
        <HiArrowLeft size={16} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};

export default FeatureInProgressView;
