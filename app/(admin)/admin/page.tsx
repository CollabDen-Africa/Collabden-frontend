"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user?.isAdmin) {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/auth/login");
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0f10]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary-green border-t-transparent rounded-full animate-spin" />
        <span className="text-white/60 text-sm font-medium tracking-wide">Syncing Console...</span>
      </div>
    </div>
  );
}
