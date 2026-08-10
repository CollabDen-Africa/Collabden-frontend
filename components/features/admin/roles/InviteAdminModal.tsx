"use client";

import React, { useState } from "react";
import { HiX, HiOutlineUserAdd } from "react-icons/hi";
import { InviteAdminPayload } from "@/services/admin/roles.service";

interface InviteAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: InviteAdminPayload) => void;
}

export const InviteAdminModal: React.FC<InviteAdminModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [roleKey, setRoleKey] = useState("SUPER_ADMIN");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) return;

    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim() || "User",
      email: email.trim(),
      roleKey,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0d0f10] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-green/15 text-primary-green flex items-center justify-center border border-primary-green/20">
              <HiOutlineUserAdd size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Invite Administrator</h2>
              <p className="text-white/40 text-xs mt-0.5">Assign portal role and permissions to a new admin user.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <HiX size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/70">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Chidi"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary-green/50 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/70">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Okonkwo"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary-green/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@collabden.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary-green/50 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70">Assign Role</label>
            <select
              value={roleKey}
              onChange={(e) => setRoleKey(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary-green/50 cursor-pointer"
            >
              <option value="SUPER_ADMIN" className="bg-[#0d0f10]">Super Admin</option>
              <option value="SUPPORT_ADMIN" className="bg-[#0d0f10]">Support Admin</option>
              <option value="FINANCE_ADMIN" className="bg-[#0d0f10]">Finance Admin</option>
              <option value="VERIFICATION_ADMIN" className="bg-[#0d0f10]">Verification Admin</option>
              <option value="MARKETPLACE_MODERATOR" className="bg-[#0d0f10]">Marketplace Moderator</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/70">Initial Status</label>
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

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4 mt-6">
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
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
