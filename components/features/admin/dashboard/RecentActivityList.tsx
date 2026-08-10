"use client";

import React from "react";
import Link from "next/link";
import { 
  FiUserPlus, 
  FiFolderPlus, 
  FiCheckCircle, 
  FiDollarSign, 
  FiXCircle, 
  FiAlertCircle, 
  FiHelpCircle 
} from "react-icons/fi";

export const RecentActivityList: React.FC = () => {
  const activities = [
    {
      title: "Amara Osei registered as a new user",
      badge: "New User",
      time: "2m ago",
      icon: FiUserPlus,
      isRed: false,
    },
    {
      title: 'Tolu Adeyemi created project "Afrobeats EP Vol. 2"',
      badge: "Project",
      time: "8m ago",
      icon: FiFolderPlus,
      isRed: false,
    },
    {
      title: "Kochi Williams identity verification approved",
      badge: "Verification",
      time: "18m ago",
      icon: FiCheckCircle,
      isRed: false,
    },
    {
      title: 'Escrow of $3,200 released for project "Jazz Fusion Album"',
      badge: "Payment",
      time: "22m ago",
      icon: FiDollarSign,
      isRed: false,
    },
    {
      title: "Marcus Lee identity verification rejected",
      badge: "Verification",
      time: "34m ago",
      icon: FiXCircle,
      isRed: true,
    },
    {
      title: 'Project "Dark Sessions" reported for content violation',
      badge: "Reported",
      time: "51m ago",
      icon: FiAlertCircle,
      isRed: true,
    },
    {
      title: "Ngozi Ojo registered as a new user",
      badge: "New User",
      time: "1h ago",
      icon: FiUserPlus,
      isRed: false,
    },
    {
      title: "Support ticket #1204 opened – billing issue",
      badge: "Support",
      time: "1h 20m ago",
      icon: FiHelpCircle,
      isRed: true,
    },
  ];

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
          {activities.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3.5 pb-3.5 border-b border-white/5 last:border-b-0 last:pb-0"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  item.isRed
                    ? "bg-red-500/10 text-red-500"
                    : "bg-primary-green/10 text-primary-green"
                }`}
              >
                <item.icon size={16} />
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-white/90 font-medium text-xs leading-relaxed truncate">
                  {item.title}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      item.isRed
                        ? "bg-red-500/15 text-red-400"
                        : "bg-primary-green/15 text-primary-green"
                    }`}
                  >
                    {item.badge}
                  </span>
                  <span className="text-white/30 text-[10px] font-medium">
                    {item.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivityList;
