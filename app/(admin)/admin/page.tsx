"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("collabden_admin_logged_in") === "true";
      if (isLoggedIn) {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/admin/login");
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0f10]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary-green border-t-transparent rounded-full animate-spin" />
        <span className="text-white/60 text-sm font-medium tracking-wide">Syncing Console...</span>
      </div>
    </div>
  );
}
