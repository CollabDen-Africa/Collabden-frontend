"use client";

import React from "react";
import { AdminAccountLockedView } from "@/components/features/admin/auth/AdminAccountLockedView";

export default function AdminAccountLockedPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0f10]">
          <div className="text-white/50 text-sm">Loading details...</div>
        </div>
      }
    >
      <AdminAccountLockedView />
    </React.Suspense>
  );
}
