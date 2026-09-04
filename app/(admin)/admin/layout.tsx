"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HiViewGrid,
  HiOutlineLogout,
  HiMenu,
  HiX,
  HiOutlineFolder,
  HiOutlineShoppingBag,
  HiOutlineDocumentText,
  HiOutlineCreditCard,
  HiOutlineShieldCheck,
  HiOutlineTicket,
  HiOutlineCog,
  HiOutlineFlag
} from "react-icons/hi";
import { LuUsers } from "react-icons/lu";
import { IoMailOutline } from "react-icons/io5";

import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { user, isLoading: isAuthLoading, logout } = useAuth();

  const isPublicAuthPage = [
    "/admin",
    "/admin/verify",
    "/admin/forgot-password",
    "/admin/reset-link-sent",
    "/admin/account-locked",
    "/admin/reset-password",
  ].includes(pathname);

  // Client-side auth guard using user.isAdmin property
  useEffect(() => {
    if (isPublicAuthPage) return;

    if (!isAuthLoading) {
      if (!user || !user.isAdmin) {
        router.replace("/admin");
        setIsCheckingAuth(false);
      } else {
        setIsCheckingAuth(false);
      }
    }
  }, [user, isAuthLoading, router, pathname, isPublicAuthPage]);

  // Auth pages handle their own layout — skip the sidebar shell entirely
  if (isPublicAuthPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  // While checking auth state, render loading layout to prevent layout shift or content leak
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0f10]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-green border-t-transparent rounded-full animate-spin" />
          <span className="text-white/60 text-sm font-medium tracking-wide">
            Syncing Session...
          </span>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: HiViewGrid },
    { name: "Users", href: "/admin/users", icon: LuUsers },
    { name: "Projects", href: "/admin/projects", icon: HiOutlineFolder },
    { name: "Marketplace", href: "/admin/marketplace", icon: HiOutlineShoppingBag },
    { name: "Agreements", href: "/admin/agreements", icon: HiOutlineDocumentText },
    { name: "Payments", href: "/admin/payments", icon: HiOutlineCreditCard },
    { name: "Disputes", href: "/admin/disputes", icon: HiOutlineFlag, badge: "12", badgeColor: "bg-red-500/20 text-red-400 border border-red-500/30" },
    { name: "Moderation", href: "/admin/moderation", icon: HiOutlineShieldCheck, badge: "3", badgeColor: "bg-red-500/20 text-red-400 border border-red-500/30" },
    { name: "Verification", href: "/admin/verify", icon: HiOutlineShieldCheck, badge: "5", badgeColor: "bg-primary-green/20 text-primary-green border border-primary-green/30" },
    { name: "Support", href: "/admin/support", icon: HiOutlineTicket, badge: "7", badgeColor: "bg-primary-green/20 text-primary-green border border-primary-green/30" },
    { name: "Subscriptions", href: "/admin/subscriptions", icon: HiOutlineCreditCard, badge: "8", badgeColor: "bg-primary-green/20 text-primary-green border border-primary-green/30" },
    { name: "Admin Roles", href: "/admin/roles", icon: HiOutlineShieldCheck },
    { name: "Settings", href: "/admin/settings", icon: HiOutlineCog },
    { name: "Waitlist", href: "/admin/waitlist", icon: IoMailOutline },
  ];

  const getHeaderTitle = (path: string) => {
    if (path === "/admin/dashboard") return "Admin Console";
    if (path.startsWith("/admin/roles")) return "Admin Roles & Permissions";
    if (path.startsWith("/admin/users")) return "User Management";
    if (path.startsWith("/admin/waitlist")) return "Waitlist Manager";
    if (path.startsWith("/admin/disputes")) return "Dispute Resolution";
    if (path.startsWith("/admin/moderation")) return "Content Moderation";
    if (path.startsWith("/admin/verify")) return "Identity Verification";
    if (path.startsWith("/admin/support")) return "Support Tickets";
    if (path.startsWith("/admin/subscriptions")) return "Subscription Management";
    if (path.startsWith("/admin/payments")) return "Payment Management";
    if (path.startsWith("/admin/agreements")) return "Agreement Management";
    if (path.startsWith("/admin/projects")) return "Project Management";
    if (path.startsWith("/admin/marketplace")) return "Marketplace Management";
    if (path.startsWith("/admin/settings")) return "Settings";
    return "Admin Portal";
  };

  // Shell Layout with persistent static sidebar and scrollable right content
  return (
    <div className="flex min-h-screen w-full font-sans bg-[#0d0f10] text-white overflow-hidden">
      {/* SIDEBAR (Desktop: static, fixed size, no scroll) */}
      <aside className="hidden lg:flex flex-col w-62.5 shrink-0 border-r border-white/10 p-5 bg-black/35 backdrop-blur-md justify-between h-screen sticky top-0 z-25">
        <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1">
          {/* Logo Area */}
          <div className="flex items-center gap-2.5 px-2 pt-1">
            <div className="w-9 h-9 bg-primary-green rounded-[9px] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(115,191,68,0.2)]">
              <span className="text-[#0d0f10] font-bold text-xl leading-none">
                C
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-white font-bold text-base leading-tight tracking-tight">
                CollabDen
              </span>
              <span className="text-primary-green font-semibold text-[10px] leading-tight uppercase tracking-widest">
                Admin Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all group ${isActive
                    ? "bg-primary-green/15 text-primary-green border-l-4 border-primary-green font-semibold"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={17} className={isActive ? "text-primary-green" : "text-white/40 group-hover:text-white"} />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold leading-none ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout at bottom */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full text-left cursor-pointer"
        >
          <HiOutlineLogout size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {/* MOBILE DRAWER SIDEBAR */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm transition-all duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-62.5 z-50 p-6 bg-[#0d0f10] border-r border-white/10 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary-green rounded-[9px] flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xl leading-none">
                  C
                </span>
              </div>
              <span className="text-white font-bold text-lg leading-tight">
                CollabDen Admin
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white/60 hover:text-white"
            >
              <HiX size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all ${isActive
                    ? "bg-primary-green/20 text-primary-green"
                    : "text-white/60 hover:text-white"
                    }`}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full text-left"
        >
          <HiOutlineLogout size={18} />
          <span>Logout</span>
        </button>
      </div>

      {/* MAIN VIEWPORT (Dynamic page content on the right, scrollable) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Sticky Header */}
        <header className="h-17.5 lg:h-20 border-b border-white/10 px-6 flex items-center justify-between bg-black/20 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 bg-white/5 rounded-lg border border-white/10 text-white"
            >
              <HiMenu size={20} />
            </button>
            <h2 className="text-lg font-bold font-sans capitalize tracking-wide text-white/90">
              {getHeaderTitle(pathname)}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Avatar
              name={user?.firstName || "Admin"}
              className="w-9 h-9 border border-primary-green shadow-md text-sm"
            />
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-white font-bold text-sm">
                {user?.firstName || "Admin"}
              </span>
              <span className="text-white/40 text-[11px] mt-0.5">
                Administrator
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic page area */}
        <main className="flex-1 p-6 md:p-8 max-w-350 w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
