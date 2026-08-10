"use client";

import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  color?: string;
  isRedAlert?: boolean;
  isLoading?: boolean;
  onViewDetails?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  badge,
  icon,
  color = "bg-primary-green",
  isRedAlert = false,
  isLoading = false,
  onViewDetails,
}) => {
  const isRed = isRedAlert || color.includes("red");

  return (
    <div
      className={`p-6 rounded-2xl bg-white/5 border backdrop-blur-md shadow-sm transition-all flex flex-col justify-between ${
        isRed
          ? "border-red-500/20 hover:border-red-500/40"
          : "border-white/10 hover:border-white/20"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        {icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isRed
                ? "bg-red-500/10 text-red-500"
                : "bg-primary-green/10 text-primary-green"
            }`}
          >
            {icon}
          </div>
        )}

        {badge && (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
              isRed
                ? "bg-red-500/10 text-red-400 border border-red-500/20"
                : "bg-primary-green/10 text-primary-green border border-primary-green/20"
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      <div>
        <div className="text-3xl font-bold font-sans tracking-tight text-white mb-1">
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-primary-green border-t-transparent rounded-full animate-spin" />
          ) : (
            value
          )}
        </div>
        <span className="text-white/50 font-medium text-xs tracking-wide">
          {label}
        </span>

        {subtitle && (
          <div className="text-[11px] text-white/40 mt-1 font-medium">
            {subtitle}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className={`text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer ${
              isRed
                ? "text-red-400 hover:text-red-300"
                : "text-primary-green hover:text-[#84d653]"
            }`}
          >
            View details &rsaquo;
          </button>
        )}
        <div
          className={`h-1 w-8 rounded-full ${
            isRed ? "bg-red-500" : "bg-primary-green"
          }`}
        />
      </div>
    </div>
  );
};

export default StatCard;
