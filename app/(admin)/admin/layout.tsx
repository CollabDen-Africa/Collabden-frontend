"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  HiViewGrid, 
  HiOutlineLogout, 
  HiMenu, 
  HiX 
} from "react-icons/hi";
import { IoMailOutline } from "react-icons/io5";

import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { user, isLoading: isAuthLoading, logout } = useAuth();

  // Client-side auth guard using user.isAdmin property
  useEffect(() => {
    if (!isAuthLoading) {
      if (!user || !user.isAdmin) {
        router.replace("/auth/login");
      } else {
        setIsCheckingAuth(false);
      }
    }
  }, [user, isAuthLoading, router]);

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
          <span className="text-white/60 text-sm font-medium tracking-wide">Syncing Session...</span>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: HiViewGrid },
    { name: "Waitlist", href: "/admin/waitlist", icon: IoMailOutline },
  ];

  // Shell Layout with persistent static sidebar and scrollable right content
  return (
    <div className="flex min-h-screen w-full font-sans bg-[#0d0f10] text-white overflow-hidden">
      {/* SIDEBAR (Desktop: static, fixed size, no scroll) */}
      <aside className="hidden lg:flex flex-col w-[250px] shrink-0 border-r border-white/10 p-6 bg-black/35 backdrop-blur-md justify-between h-screen sticky top-0 z-25">
        <div className="flex flex-col gap-8">
          {/* Logo Area */}
          <div className="flex items-center gap-2 px-2">
            <div className="w-9 h-9 bg-primary-green rounded-[9px] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xl leading-none">C</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-white font-bold text-lg leading-tight">CollabDen</span>
              <span className="text-primary-green font-semibold text-[11px] leading-tight uppercase tracking-wider">Admin</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                    isActive
                      ? "bg-primary-green/20 text-primary-green border-l-4 border-primary-green pl-3"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
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
        className={`fixed top-0 left-0 h-full w-[250px] z-50 p-6 bg-[#0d0f10] border-r border-white/10 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary-green rounded-[9px] flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xl leading-none">C</span>
              </div>
              <span className="text-white font-bold text-lg leading-tight">CollabDen Admin</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/60 hover:text-white">
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
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                    isActive
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
        <header className="h-[70px] lg:h-[80px] border-b border-white/10 px-6 flex items-center justify-between bg-black/20 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 bg-white/5 rounded-lg border border-white/10 text-white"
            >
              <HiMenu size={20} />
            </button>
            <h2 className="text-lg font-bold font-sans capitalize tracking-wide text-white/90">
              {pathname === "/admin/dashboard" ? "Admin Console" : "Waitlist Manager"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Avatar 
              name="Stella" 
              className="w-9 h-9 border border-primary-green shadow-md text-sm"
            />
            <div className="hidden sm:flex flex-col items-start leading-none">
              <span className="text-white font-bold text-sm">Stella</span>
              <span className="text-white/40 text-[11px] mt-0.5">Administrator</span>
            </div>
          </div>
        </header>

        {/* Dynamic page area */}
        <main className="flex-1 p-6 md:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
