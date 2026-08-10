"use client";

import React from "react";
import { HiOutlineMusicNote, HiOutlineBan, HiOutlineTrash } from "react-icons/hi";

export interface PostingHeaderData {
  id: string;
  title: string;
  postId: string;
  postedDate: string;
  applicationsCount: number;
  status: "Active" | "Reported" | "Restricted" | "Closed";
  description: string;
}

interface MarketplacePostingHeaderProps {
  data: PostingHeaderData;
  onRestrict?: () => void;
  onRemove?: () => void;
}

export const MarketplacePostingHeader: React.FC<MarketplacePostingHeaderProps> = ({
  data,
  onRestrict,
  onRemove,
}) => {
  return (
    <div className="p-6 md:p-8 bg-card-bg-alt/40 border-b border-white/5 flex flex-col gap-6">
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Icon & Identity */}
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-card-bg border-2 border-primary-blue flex items-center justify-center text-secondary-blue shrink-0 shadow-lg">
            <HiOutlineMusicNote size={28} />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
                {data.title}
              </h2>
              {data.status === "Reported" && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-soft-red text-accent-red border border-accent-red/30">
                  Reported
                </span>
              )}
              {data.status === "Active" && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-soft-green text-accent-green-success border border-accent-green-success/30">
                  Active
                </span>
              )}
              {data.status === "Restricted" && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/30">
                  Restricted
                </span>
              )}
            </div>

            {/* Sub Meta Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
              <span className="font-mono text-white/70">{data.postId}</span>
              <span>•</span>
              <span>Posted {data.postedDate}</span>
              <span>•</span>
              <span className="text-primary-green font-semibold">{data.applicationsCount} Applications</span>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onRemove}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-soft-red/20 hover:bg-accent-soft-red/40 text-accent-red text-xs font-semibold border border-accent-red/30 transition-all cursor-pointer"
          >
            <HiOutlineTrash size={15} />
            Remove Posting
          </button>
          <button
            onClick={onRestrict}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-yellow/10 hover:bg-accent-yellow/20 text-accent-yellow text-xs font-semibold border border-accent-yellow/30 transition-all cursor-pointer"
          >
            <HiOutlineBan size={15} />
            Restrict
          </button>
        </div>
      </div>

      {/* Brief Description Box */}
      <div className="p-4 rounded-xl bg-white/2 border border-white/5 text-xs text-white/70 leading-relaxed font-sans">
        {data.description}
      </div>
    </div>
  );
};
