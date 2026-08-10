"use client";

import React from "react";
import { HiCheckCircle } from "react-icons/hi";

export interface ProfileOverviewData {
  displayName: string;
  stageName: string;
  profileId: string;
  isVerified: boolean;
  memberSince: string;
  location: string;
  rating: number;
  avgRating: number;
  roles: string[];
  genres: string[];
  totalCollaborations: number;
  completedProjects: number;
  activeProjects: number;
}

interface MarketplaceOverviewTabProps {
  data: ProfileOverviewData;
}

export const MarketplaceOverviewTab: React.FC<MarketplaceOverviewTabProps> = ({ data }) => {
  return (
    <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-300">
      {/* Left Card: Profile Information */}
      <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-6 flex flex-col gap-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-white/5 pb-3">
          Profile Information
        </h3>

        <div className="flex flex-col gap-4 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-text-muted font-medium">Display Name</span>
            <span className="text-white font-semibold">{data.displayName}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-text-muted font-medium">Stage Name</span>
            <span className="text-white font-semibold">{data.stageName}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-text-muted font-medium">Profile ID</span>
            <span className="font-mono text-white/70">{data.profileId}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-text-muted font-medium">Identity Status</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-soft-green text-accent-green-success border border-accent-green-success/30">
              <HiCheckCircle size={14} /> Verified
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-text-muted font-medium">Member Since</span>
            <span className="text-white/80">{data.memberSince}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-text-muted font-medium">Location</span>
            <span className="text-white/80">{data.location}</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-text-muted font-medium">Avg Rating</span>
            <span className="text-accent-yellow font-bold">★ {data.avgRating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      {/* Right Card: Skills & Specialization */}
      <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-6 flex flex-col gap-5">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-white/5 pb-3">
          Skills & Specialization
        </h3>

        <div className="flex flex-col gap-5 text-xs">
          {/* Roles */}
          <div className="flex flex-col gap-2">
            <span className="text-text-muted font-medium uppercase tracking-wider text-[10px]">Roles</span>
            <div className="flex flex-wrap gap-2">
              {data.roles.map((r, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-primary-blue/20 text-secondary-blue border border-primary-blue/30"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          {/* Genres */}
          <div className="flex flex-col gap-2">
            <span className="text-text-muted font-medium uppercase tracking-wider text-[10px]">Genres</span>
            <div className="flex flex-wrap gap-2">
              {data.genres.map((g, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 text-white/80 border border-white/10"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Metrics List */}
          <div className="flex flex-col gap-3 pt-3 border-t border-white/5">
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-text-muted font-medium">Total Collaborations</span>
              <span className="text-white font-bold text-sm">{data.totalCollaborations}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-text-muted font-medium">Completed Projects</span>
              <span className="text-primary-green font-bold text-sm">{data.completedProjects}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-text-muted font-medium">Active Projects</span>
              <span className="text-secondary-blue font-bold text-sm">{data.activeProjects}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
