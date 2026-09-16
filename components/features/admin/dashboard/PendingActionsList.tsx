"use client";

import React from "react";
import Link from "next/link";
import { 
  FiCheckSquare, 
  FiAlertTriangle, 
  FiShieldOff, 
  FiHelpCircle
} from "react-icons/fi";
import { PendingActionsData } from "@/services/admin/dashboard.service";

interface PendingActionsListProps {
  pendingActions: PendingActionsData;
}

export const PendingActionsList: React.FC<PendingActionsListProps> = ({ pendingActions }) => {
  const pendingItems = [
    {
      title: "Identity Verification Requests",
      count: pendingActions.identityVerificationRequests?.length ?? 0,
      icon: FiCheckSquare,
      isRed: false,
      href: "/admin/verification",
    },
    {
      title: "Reported Users / Projects",
      count: pendingActions.reportedItems?.length ?? 0,
      icon: FiAlertTriangle,
      isRed: true,
      href: "/admin/moderation",
    },
    {
      title: "Open Disputes",
      count: pendingActions.openDisputes?.length ?? 0,
      icon: FiShieldOff,
      isRed: true,
      href: "/admin/disputes",
    },
    {
      title: "Unresolved Support Tickets",
      count: pendingActions.supportTickets?.length ?? 0,
      icon: FiHelpCircle,
      isRed: true,
      href: "/admin/support",
    },
  ].filter((item) => item.count > 0);

  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between shadow-sm">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-5 bg-primary-green rounded-full" />
            <h3 className="text-lg font-bold text-white tracking-tight">Pending Actions</h3>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/80 text-xs font-semibold">
              {pendingItems.length}
            </span>
          </div>
          <Link
            href="/admin/users"
            className="text-xs font-semibold text-primary-green hover:text-[#84d653] transition-colors"
          >
            View all &rarr;
          </Link>
        </div>

        {/* Action Items List */}
        <div className="flex flex-col gap-3.5">
          {pendingItems.length === 0 ? (
            <p className="py-8 text-center text-sm text-white/40">No pending actions.</p>
          ) : pendingItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 group ${
                item.isRed
                  ? "bg-red-500/5 border-red-500/15 hover:border-red-500/30 hover:bg-red-500/10"
                  : "bg-white/3 border-white/5 hover:border-white/15 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    item.isRed
                      ? "bg-red-500/10 text-red-500"
                      : "bg-primary-green/10 text-primary-green"
                  }`}
                >
                  <item.icon size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-white font-semibold text-sm group-hover:text-primary-green transition-colors truncate">
                    {item.title}
                  </span>
                  <span className="text-white/40 text-xs truncate">
                    {item.count} awaiting review
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 gap-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                    item.isRed
                      ? "bg-red-500/15 text-red-400 border border-red-500/25"
                      : "bg-primary-green/15 text-primary-green border border-primary-green/25"
                  }`}
                >
                  {item.count} open
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PendingActionsList;
