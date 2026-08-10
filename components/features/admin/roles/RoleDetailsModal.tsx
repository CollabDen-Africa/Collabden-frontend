"use client";

import React from "react";
import { HiX, HiOutlineShieldCheck, HiOutlinePencil, HiOutlineUsers, HiOutlineCheck } from "react-icons/hi";
import { AdminRoleItem } from "@/services/admin/roles.service";

interface RoleDetailsModalProps {
  role: AdminRoleItem | null;
  onClose: () => void;
  onEdit: (role: AdminRoleItem) => void;
}

export const RoleDetailsModal: React.FC<RoleDetailsModalProps> = ({
  role,
  onClose,
  onEdit,
}) => {
  if (!role) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0d0f10] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-green/15 text-primary-green border border-primary-green/30 flex items-center justify-center">
              <HiOutlineShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{role.name}</h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  role.status === "Active" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-white/10 text-white/50 border border-white/10"
                }`}>
                  {role.status}
                </span>
              </div>
              <p className="text-white/40 text-xs mt-0.5 font-mono">KEY: {role.roleKey}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <HiX size={20} />
          </button>
        </div>

        {/* Content body */}
        <div className="space-y-6 overflow-y-auto custom-scrollbar pr-1 flex-1">
          {/* Description */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
            <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">Overview</span>
            <p className="text-sm text-white/80 font-medium leading-relaxed">
              {role.description}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-white/40 font-medium uppercase tracking-wider block">Assigned Admins</span>
                <span className="text-xl font-bold text-white mt-1 block">{role.adminsCount}</span>
              </div>
              <HiOutlineUsers size={24} className="text-primary-green/70" />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-white/40 font-medium uppercase tracking-wider block">Active Permissions</span>
                <span className="text-xl font-bold text-white mt-1 block">{role.permissionsCount}</span>
              </div>
              <HiOutlineShieldCheck size={24} className="text-secondary-blue/70" />
            </div>
          </div>

          {/* Modules */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Module Access</h4>
            <div className="flex flex-wrap gap-2">
              {role.modules.map((mod) => (
                <span key={mod} className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-white/80">
                  {mod}
                </span>
              ))}
            </div>
          </div>

          {/* Permissions List */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider">Capabilities & Privileges</h4>
            <div className="space-y-1.5">
              {role.permissions.map((perm) => (
                <div key={perm} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white/80">
                  <HiOutlineCheck size={14} className="text-primary-green shrink-0" />
                  <span className="font-mono text-white/90">{perm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 text-sm font-semibold transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onEdit(role);
            }}
            className="px-5 py-2.5 rounded-xl bg-primary-green text-[#0d0f10] text-sm font-bold hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer"
          >
            <HiOutlinePencil size={16} />
            Edit Role
          </button>
        </div>
      </div>
    </div>
  );
};
