"use client";

import React, { useState } from "react";
import { useUser } from "@/hooks/admin/useUser";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useRouter } from "next/navigation";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { HiOutlineMinusCircle, HiOutlineUsers, HiOutlineRefresh } from "react-icons/hi";
import { useQueryClient } from "@tanstack/react-query";

interface ModerateUserProps {
  id: string;
}

export const ModerateUser: React.FC<ModerateUserProps> = ({ id }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading, isError } = useUser(id);
  const [action, setAction] = useState<"suspend" | "ban" | "reactivate">("suspend");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return <div className="p-8 text-white/40 text-center">Loading user details...</div>;
  if (isError || !user) return <div className="p-8 text-red-500 text-center">Error loading user</div>;

  const name = user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown';
  const initials = name.substring(0, 2).toUpperCase() || 'U';
  const shortId = user.id.substring(user.id.length - 4).toUpperCase();

  const handleSubmit = async () => {
    // Basic validation
    if (!reason.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/users/${id}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason, notes })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Failed to moderate user');
      }
      
      await queryClient.invalidateQueries({ queryKey: ['adminUser', id] });
      await queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      
      router.push(`/admin/users/${id}`);
    } catch (error) {
      console.error("Failed to submit moderation action:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActionConfig = (currentAction: string) => {
    switch (currentAction) {
      case 'suspend': return { label: 'Confirm Suspension', colorClass: 'bg-yellow-500 hover:bg-yellow-400 text-black' };
      case 'ban': return { label: 'Confirm Ban', colorClass: 'bg-red-500 hover:bg-red-400 text-white' };
      case 'reactivate': return { label: 'Confirm Reactivation', colorClass: 'bg-emerald-500 hover:bg-emerald-400 text-black' };
      default: return { label: 'Confirm Action', colorClass: 'bg-yellow-500 hover:bg-yellow-400 text-black' };
    }
  };

  const actionConfig = getActionConfig(action);

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-white">
      <Breadcrumbs
        items={[
          { label: "Admin Portal" },
          { label: "Users", href: "/admin/users" },
          { label: name, href: `/admin/users/${id}` },
          { label: "Suspend Account" },
        ]}
      />

      <div className="w-full max-w-2xl mx-auto bg-[#121415] border border-white/5 rounded-3xl overflow-hidden flex flex-col">
        {/* Header Section */}
        <div className="p-6 md:p-8 flex items-start gap-4 border-b border-white/5 bg-white/[0.02]">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 shrink-0">
            <HiOutlineMinusCircle size={24} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold">Suspend Account</h2>
            <p className="text-sm text-white/40 mt-1">
              This action will be logged in the audit trail
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col gap-8">
          {/* User Card */}
          <div className="bg-[#1a1c1d] border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-600/30 flex items-center justify-center text-lg font-bold text-white border border-emerald-500/20">
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white">{name}</span>
                <span className="text-xs text-white/40">
                  {user.email} · USR-{shortId}
                </span>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase ${user.accountStatus === "ACTIVE" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
            >
              {user.accountStatus}
            </span>
          </div>

          {/* Action Selection */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-white">
              Select Action <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setAction("suspend")}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors ${action === "suspend" ? "bg-yellow-500/10 border-yellow-500 text-yellow-500" : "bg-[#1a1c1d] border-white/5 text-white/40 hover:bg-white/5"}`}
              >
                <HiOutlineMinusCircle size={20} />
                <span className="text-xs font-bold">Suspend</span>
              </button>
              <button
                onClick={() => setAction("ban")}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors ${action === "ban" ? "bg-red-500/10 border-red-500 text-red-500" : "bg-[#1a1c1d] border-white/5 text-white/40 hover:bg-white/5"}`}
              >
                <HiOutlineUsers size={20} />
                <span className="text-xs font-bold">Ban</span>
              </button>
              <button
                onClick={() => setAction("reactivate")}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors ${action === "reactivate" ? "bg-emerald-500/10 border-emerald-500 text-emerald-500" : "bg-[#1a1c1d] border-white/5 text-white/40 hover:bg-white/5"}`}
              >
                <HiOutlineRefresh size={20} />
                <span className="text-xs font-bold">Reactivate</span>
              </button>
            </div>
          </div>

          {/* Reason Input */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-white">
              Reason <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#1a1c1d] border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-yellow-500/50"
              placeholder="E.g., Violation of terms of service"
            />
          </div>

          {/* Additional Notes Textarea */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold text-white">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#1a1c1d] border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-yellow-500/50 resize-none min-h-[120px]"
              placeholder="Provide additional context for this action."
            />
          </div>

          {/* Warning Alert */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3 text-yellow-500/90 text-sm leading-relaxed">
            <HiOutlineExclamationTriangle
              className="shrink-0 mt-0.5"
              size={18}
            />
            <p>
              Suspending this account will immediately restrict the user&apos;s
              access to the platform. They will be notified via email. This
              action is recorded in the audit log.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 flex items-center justify-end gap-4 border-t border-white/5 bg-white/[0.02]">
          <button
            onClick={() => router.push(`/admin/users/${id}`)}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-full text-sm font-bold text-white/60 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!reason.trim() || isSubmitting}
            className={`${actionConfig.colorClass} disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold px-8 py-3 rounded-full transition-colors`}
          >
            {isSubmitting ? "Processing..." : actionConfig.label}
          </button>
        </div>
      </div>
    </div>
  );
};
