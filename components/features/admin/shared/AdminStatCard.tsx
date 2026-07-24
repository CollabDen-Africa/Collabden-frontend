"use client";

import React from "react";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  isLoading?: boolean;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  label,
  value,
  subtitle,
  icon,
  color = "bg-primary-green",
  isLoading = false,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-sm hover:border-white/20 transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/60 font-semibold text-sm">{label}</span>
        {icon && (
          <span className="p-3 bg-white/5 rounded-xl text-white/80">
            {icon}
          </span>
        )}
      </div>
      <div>
        <div className="text-3xl font-bold font-sans tracking-tight text-white">
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-primary-green border-t-transparent rounded-full animate-spin" />
          ) : (
            value
          )}
        </div>
        {subtitle && (
          <div className="text-xs text-white/40 mt-1.5 font-medium">
            {subtitle}
          </div>
        )}
      </div>
      {color && <div className={`h-1 w-8 rounded-full mt-4 ${color}`} />}
    </div>
  );
};

export default AdminStatCard;
