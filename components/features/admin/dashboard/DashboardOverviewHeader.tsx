"use client";

import React, { useState } from "react";
import { FiRefreshCw, FiRadio, FiSearch } from "react-icons/fi";

interface DashboardOverviewHeaderProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
  adminName?: string;
}

export const DashboardOverviewHeader: React.FC<DashboardOverviewHeaderProps> = ({
  onRefresh,
  isRefreshing = false,
  adminName = "Super Admin",
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col gap-6 w-full mb-8">
      {/* Top Search & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="flex items-center gap-2 bg-black/40 w-full h-11 pl-4 pr-4 rounded-xl border border-white/10 focus-within:border-primary-green transition-all backdrop-blur-md">
            <FiSearch className="text-white/30 shrink-0" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users, projects, tickets..."
              className="bg-transparent border-none outline-none text-white text-xs placeholder:text-white/30 w-full font-medium"
            />
          </div>
        </div>

        {/* Right Status Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-10 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <FiRefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-green/10 border border-primary-green/20 text-primary-green text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary-green animate-pulse" />
            <span>{adminName} · Online</span>
          </div>
        </div>
      </div>

      {/* Main Title & Action Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-white/40 text-xs md:text-sm mt-1 font-medium">
            Welcome back, <span className="text-white/80">{adminName}</span> &middot; Last refreshed: just now
          </p>
          <div className="flex items-center gap-2 text-[11px] text-white/30 mt-2 font-medium">
            <span>Admin Portal</span>
            <span>/</span>
            <span className="text-primary-green">Dashboard</span>
          </div>
        </div>

        {/* Live Indicator & Refresh Data Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium">
            <FiRadio size={14} className="text-primary-green animate-pulse" />
            <span>Live</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-5 py-2.5 rounded-full bg-primary-green hover:bg-[#84d653] text-[#0d0f10] font-semibold text-xs transition-all shadow-[0_8px_24px_rgba(115,191,68,0.2)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <FiRefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewHeader;
