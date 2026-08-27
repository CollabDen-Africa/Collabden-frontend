"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SubscriptionsSubNavProps {
  activeTab?: string;
}

export const SubscriptionsSubNav: React.FC<SubscriptionsSubNavProps> = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "All Subscriptions", href: "/admin/subscriptions", badge: null },
    { label: "Issues & Failed Payments", href: "/admin/subscriptions/issues", badge: "83", badgeColor: "bg-accent-red/20 text-accent-red border border-accent-red/30" },
    { label: "Plans & Distribution", href: "/admin/subscriptions/plans", badge: null },
    { label: "Reports & Audit Log", href: "/admin/subscriptions/reports", badge: null },
  ];

  return (
    <div className="w-full border-b border-white/10 flex items-center gap-6 overflow-x-auto custom-scrollbar">
      {navItems.map((item) => {
        const isActive =
          item.href === "/admin/subscriptions"
            ? pathname === "/admin/subscriptions"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 text-nowrap cursor-pointer ${
              isActive
                ? "text-[#72c043] border-[#72c043]"
                : "text-text-muted border-transparent hover:text-white"
            }`}
          >
            <span>{item.label}</span>
            {item.badge && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor}`}>
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default SubscriptionsSubNav;
