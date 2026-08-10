"use client";

import React from "react";
import { 
  HiOutlineShieldCheck, 
  HiOutlineEye, 
  HiOutlinePencil, 
  HiOutlineDotsHorizontal 
} from "react-icons/hi";
import { HiOutlinePower } from "react-icons/hi2";
import { AdminRoleItem } from "@/services/admin/roles.service";

interface RoleCardProps {
  role: AdminRoleItem;
  onView: (role: AdminRoleItem) => void;
  onEdit: (role: AdminRoleItem) => void;
  onToggleStatus: (roleId: string) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  onView,
  onEdit,
  onToggleStatus,
}) => {
  const getThemeBadgeStyles = (color: AdminRoleItem["themeColor"]) => {
    switch (color) {
      case "green":
        return "bg-primary-green/15 text-primary-green border-primary-green/30";
      case "blue":
        return "bg-primary-blue/20 text-secondary-blue border-primary-blue/30";
      case "purple":
        return "bg-purple-500/15 text-purple-400 border-purple-500/30";
      case "yellow":
        return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
      default:
        return "bg-white/5 text-white/40 border-white/10";
    }
  };

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all hover:bg-white/10 hover:border-white/15 shadow-sm">
      {/* Left Details */}
      <div className="flex items-start gap-4 flex-1">
        {/* Shield Icon Container */}
        <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm ${getThemeBadgeStyles(role.themeColor)}`}>
          <HiOutlineShieldCheck size={24} />
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-base md:text-lg font-bold text-white tracking-tight">{role.name}</h3>
            <span 
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-colors ${
                role.status === "Active" 
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25" 
                  : "bg-white/10 text-white/50 border border-white/10"
              }`}
            >
              {role.status}
            </span>
          </div>
          <p className="text-white/50 text-xs md:text-sm mt-1 max-w-xl font-normal leading-relaxed">
            {role.description}
          </p>
        </div>
      </div>

      {/* Middle Stats + Right Actions */}
      <div className="flex items-center justify-between lg:justify-end gap-8 shrink-0 border-t border-white/5 lg:border-t-0 pt-4 lg:pt-0">
        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center justify-center min-w-16">
            <span className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-none">
              {role.permissionsCount}
            </span>
            <span className="text-[11px] text-white/40 font-medium uppercase tracking-wider mt-1">
              Permissions
            </span>
          </div>

          <div className="w-px h-8 bg-white/10" />

          <div className="flex flex-col items-center justify-center min-w-16">
            <span className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-none">
              {role.adminsCount}
            </span>
            <span className="text-[11px] text-white/40 font-medium uppercase tracking-wider mt-1">
              Admins
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(role)}
            title="View Details"
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <HiOutlineEye size={17} />
          </button>

          <button
            onClick={() => onEdit(role)}
            title="Edit Role"
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <HiOutlinePencil size={16} />
          </button>

          <button
            onClick={() => onToggleStatus(role.id)}
            title={role.status === "Active" ? "Deactivate Role" : "Activate Role"}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
              role.status === "Active" 
                ? "bg-white/5 border-white/10 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20" 
                : "bg-white/5 border-white/10 text-emerald-400/80 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20"
            }`}
          >
            <HiOutlinePower size={17} />
          </button>

          <button
            onClick={() => onView(role)}
            title="More Options"
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <HiOutlineDotsHorizontal size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};
