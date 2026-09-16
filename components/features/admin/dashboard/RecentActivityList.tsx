"use client";

import React from "react";
import Link from "next/link";
import { 
  FiAlertCircle,
} from "react-icons/fi";
import { ActivityItem } from "@/services/admin/dashboard.service";

interface RecentActivityListProps {
  activities: ActivityItem[];
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({ activities }) => {
  const isAlertActivity = (action: string) =>
    /reject|fail|report|dispute|escalat|suspend|deactivat/i.test(action);


  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col justify-between shadow-sm">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-5 bg-primary-green rounded-full" />
            <h3 className="text-lg font-bold text-white tracking-tight">Recent Activity</h3>
          </div>
          <Link
            href="/admin/users"
            className="text-xs font-semibold text-primary-green hover:text-[#84d653] transition-colors"
          >
            View all &rarr;
          </Link>
        </div>

        {/* Timeline Items */}
        <div className="flex flex-col gap-4">
          {activities.length === 0 ? (
            <p className="py-8 text-center text-sm text-white/40">No recent activity.</p>
          ) : activities.map((item) => {
            const isRed = isAlertActivity(item.action);

            return (
            <div
              key={item.id}
              className="flex items-start gap-3.5 pb-3.5 border-b border-white/5 last:border-b-0 last:pb-0"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  isRed
                    ? "bg-red-500/10 text-red-500"
                    : "bg-primary-green/10 text-primary-green"
                }`}
              >
                  <FiAlertCircle size={16} />
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-white/90 font-medium text-xs leading-relaxed truncate">
                  {item.action}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                    isRed
                        ? "bg-red-500/15 text-red-400"
                        : "bg-primary-green/15 text-primary-green"
                    }`}
                  >
                    {item.user?.displayName || item.user?.email || "System"}
                  </span>
                  <span className="text-white/30 text-[10px] font-medium">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentActivityList;
