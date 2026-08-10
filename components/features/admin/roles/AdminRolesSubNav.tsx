"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineShieldCheck, HiOutlineUsers, HiOutlineClock } from "react-icons/hi";

export const AdminRolesSubNav: React.FC = () => {
  const pathname = usePathname();

  const tabs = [
    {
      label: "Roles",
      href: "/admin/roles",
      icon: HiOutlineShieldCheck,
      isActive: pathname === "/admin/roles"
    },
    {
      label: "Admin Accounts",
      href: "/admin/roles/accounts",
      icon: HiOutlineUsers,
      isActive: pathname === "/admin/roles/accounts"
    },
    {
      label: "Access History",
      href: "/admin/roles/access-history",
      icon: HiOutlineClock,
      isActive: pathname === "/admin/roles/access-history"
    }
  ];

  return (
    <div className="flex items-center gap-2 border-b border-white/10 pb-1 overflow-x-auto custom-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              tab.isActive
                ? "bg-primary-green/15 text-primary-green border border-primary-green/30 shadow-sm"
                : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <Icon size={17} className={tab.isActive ? "text-primary-green" : "text-white/40"} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default AdminRolesSubNav;
