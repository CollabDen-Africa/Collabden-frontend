"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const VerifySubNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview & Requests", href: "/admin/verify", badge: "5", badgeColor: "bg-[#73BF44]/20 text-[#73BF44] border border-[#73BF44]/30" },
    { label: "Audit Log & History", href: "/admin/verify/audit", badge: null },
  ];

  return (
    <div className="w-full border-b border-white/10 flex items-center gap-6 overflow-x-auto custom-scrollbar">
      {navItems.map((item) => {
        const isActive =
          item.href === "/admin/verify"
            ? pathname === "/admin/verify"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 text-nowrap cursor-pointer ${
              isActive
                ? "text-[#73BF44] border-[#73BF44]"
                : "text-[#AEB2B4] border-transparent hover:text-white"
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

export default VerifySubNav;
