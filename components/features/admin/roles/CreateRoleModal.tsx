"use client";

import React, { useState } from "react";
import { HiX, HiOutlineShieldCheck } from "react-icons/hi";
import { CreateRolePayload, AdminRoleItem } from "@/services/admin/roles.service";

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateRolePayload) => void;
  initialRole?: AdminRoleItem | null;
}

const AVAILABLE_MODULES = [
  "Users",
  "Settings",
  "Payments",
  "Moderation",
  "Agreements",
  "Projects",
  "Support",
  "Marketplace"
];

const AVAILABLE_PERMISSIONS = [
  { key: "manage_users", label: "Manage Users & Profiles" },
  { key: "manage_admins", label: "Manage Administrators & Access" },
  { key: "manage_roles", label: "Configure Admin Roles" },
  { key: "manage_settings", label: "Platform Global Settings" },
  { key: "manage_payments", label: "Escrow & Payment Transactions" },
  { key: "manage_moderation", label: "Content & User Moderation" },
  { key: "manage_support", label: "Support Tickets & Escalations" },
  { key: "view_audit_logs", label: "View System Audit History" },
];

export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialRole,
}) => {
  const [name, setName] = useState(initialRole?.name || "");
  const [description, setDescription] = useState(initialRole?.description || "");
  const [status, setStatus] = useState<"Active" | "Inactive">(initialRole?.status || "Active");
  const [selectedModules, setSelectedModules] = useState<string[]>(
    initialRole?.modules || ["Users", "Support"]
  );
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    initialRole?.permissions || ["manage_users", "manage_support"]
  );

  if (!isOpen) return null;

  const toggleModule = (module: string) => {
    setSelectedModules((prev) =>
      prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module]
    );
  };

  const togglePermission = (permKey: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permKey) ? prev.filter((p) => p !== permKey) : [...prev, permKey]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      description: description.trim() || "No description provided.",
      status,
      modules: selectedModules,
      permissions: selectedPermissions,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0d0f10] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-green/15 text-primary-green flex items-center justify-center border border-primary-green/20">
              <HiOutlineShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {initialRole ? "Edit Administrator Role" : "Create New Role"}
              </h2>
              <p className="text-white/40 text-xs mt-0.5">
                Define role permissions, access levels, and module capabilities.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <HiX size={20} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="space-y-5 overflow-y-auto custom-scrollbar pr-1 flex-1">
          {/* Role Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              Role Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Compliance Officer"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary-green/50 transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              Role Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe access responsibilities..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary-green/50 transition-all resize-none"
            />
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              Status
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStatus("Active")}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  status === "Active"
                    ? "bg-primary-green/20 border-primary-green text-primary-green"
                    : "bg-white/5 border-white/10 text-white/50 hover:text-white"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatus("Inactive")}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  status === "Inactive"
                    ? "bg-white/10 border-white/20 text-white font-medium"
                    : "bg-white/5 border-white/10 text-white/50 hover:text-white"
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          {/* Modules checkboxes */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              Assigned Modules ({selectedModules.length})
            </label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_MODULES.map((mod) => {
                const isSelected = selectedModules.includes(mod);
                return (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => toggleModule(mod)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                      isSelected
                        ? "bg-primary-green/10 border-primary-green/40 text-primary-green"
                        : "bg-white/5 border-white/10 text-white/50 hover:text-white"
                    }`}
                  >
                    <span>{mod}</span>
                    <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center ${isSelected ? "border-primary-green bg-primary-green text-[#0d0f10]" : "border-white/20"}`}>
                      {isSelected && <span className="text-[10px] font-bold leading-none">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Permissions List */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              Permissions ({selectedPermissions.length})
            </label>
            <div className="space-y-1.5">
              {AVAILABLE_PERMISSIONS.map((perm) => {
                const isSelected = selectedPermissions.includes(perm.key);
                return (
                  <div
                    key={perm.key}
                    onClick={() => togglePermission(perm.key)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "bg-white/5 border-primary-green/30 text-white"
                        : "bg-white/5 border-white/5 text-white/40 hover:text-white"
                    }`}
                  >
                    <span>{perm.label}</span>
                    <span className={`text-xs font-semibold ${isSelected ? "text-primary-green" : "text-white/30"}`}>
                      {isSelected ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 text-sm font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary-green text-[#0d0f10] text-sm font-bold hover:brightness-110 transition-all shadow-md cursor-pointer"
            >
              {initialRole ? "Update Role" : "Create Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
