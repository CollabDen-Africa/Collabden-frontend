"use client";

import React from "react";
import { HiStar, HiOutlinePlus, HiOutlineBan } from "react-icons/hi";

export interface CollabHeaderData {
  id: string;
  name: string;
  stageName: string;
  profileId: string;
  location: string;
  rating: number;
  reviewsCount: number;
  isReported: boolean;
  status: string;
  roles: string[];
  genres: string[];
  bio: string;
}

interface MarketplaceCollabHeaderProps {
  data: CollabHeaderData;
  onRestrict?: () => void;
  onAddNote?: () => void;
}

export const MarketplaceCollabHeader: React.FC<MarketplaceCollabHeaderProps> = ({
  data,
  onRestrict,
  onAddNote,
}) => {
  return (
    <div className="p-6 md:p-8 bg-card-bg-alt/40 border-b border-white/5 flex flex-col gap-6">
      {/* Top Banner Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Avatar & Identity */}
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-card-bg border-2 border-primary-green flex items-center justify-center text-xl font-bold text-white uppercase shrink-0 shadow-lg">
            {data.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
                {data.name}
              </h2>
              {data.isReported && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-soft-red text-accent-red border border-accent-red/30">
                  Reported
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-soft-green text-accent-green-success border border-accent-green-success/30">
                {data.status}
              </span>
            </div>

            {/* Sub Meta Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
              <span>📍 {data.location}</span>
              <span className="flex items-center gap-1 text-accent-yellow font-semibold">
                <HiStar size={14} /> {data.rating.toFixed(1)} ({data.reviewsCount} reviews)
              </span>
              <span className="font-mono text-white/50">ID: {data.profileId}</span>
            </div>

            {/* Tags Row */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {data.roles.map((r, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-primary-blue/20 text-secondary-blue border border-primary-blue/30"
                >
                  {r}
                </span>
              ))}
              {data.genres.map((g, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-white/5 text-white/70 border border-white/10"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onRestrict}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-yellow/10 hover:bg-accent-yellow/20 text-accent-yellow text-xs font-semibold border border-accent-yellow/30 transition-all cursor-pointer"
          >
            <HiOutlineBan size={15} />
            Restrict Profile
          </button>
          <button
            onClick={onAddNote}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
          >
            <HiOutlinePlus size={15} />
            Add Note
          </button>
        </div>
      </div>

      {/* Bio Paragraph */}
      <div className="p-4 rounded-xl bg-white/2 border border-white/5 text-xs text-white/70 leading-relaxed font-sans">
        {data.bio}
      </div>
    </div>
  );
};
