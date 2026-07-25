"use client";

import React from "react";
import Link from "next/link";
import { 
  FiCheckSquare, 
  FiAlertTriangle, 
  FiShieldOff, 
  FiHelpCircle, 
  FiDollarSign 
} from "react-icons/fi";

interface PendingActionsListProps {
  onViewAll?: () => void;
}

export const PendingActionsList: React.FC<PendingActionsListProps> = () => {
  const pendingItems = [
    {
      title: "Identity Verification Requests",
      subtitle: "142 requests awaiting review",
      badge: "High Priority",
      meta: "Updated 5m ago",
      icon: FiCheckSquare,
      isRed: false,
      href: "/admin/users",
    },
    {
      title: "Reported Users / Projects",
      subtitle: "23 reports pending moderation",
      badge: "Urgent",
      meta: "2 new reports",
      icon: FiAlertTriangle,
      isRed: true,
      href: "/admin/moderation",
    },
    {
      title: "Open Disputes",
      subtitle: "38 disputes require attention",
      badge: "38 Open",
      meta: "6 resolved",
      icon: FiShieldOff,
      isRed: true,
      href: "/admin/moderation",
    },
    {
      title: "Unresolved Support Tickets",
      subtitle: "91 tickets - 7 marked critical",
      badge: "7 Critical",
      meta: "25m avg wait",
      icon: FiHelpCircle,
      isRed: true,
      href: "/admin/support",
    },
    {
      title: "Pending Escrow Releases",
      subtitle: "$27,140 awaiting admin approval",
      badge: "12 Pending",
      meta: "Oldest: 48h",
      icon: FiDollarSign,
      isRed: false,
      href: "/admin/payments",
    },
  ];

  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between shadow-sm">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-5 bg-primary-green rounded-full" />
            <h3 className="text-lg font-bold text-white tracking-tight">Pending Actions</h3>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/80 text-xs font-semibold">
              11
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
          {pendingItems.map((item, idx) => (
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
                    {item.subtitle}
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
                  {item.badge}
                </span>
                <span className="text-white/30 text-[10px] font-medium">
                  {item.meta}
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
