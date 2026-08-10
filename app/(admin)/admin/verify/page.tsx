"use client";

import React from "react";
import { AdminVerifyView } from "@/components/features/admin/verify/AdminVerifyView";

export default function AdminVerifyPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0f10]">
          <div className="text-white/50 text-sm">Loading verification...</div>
        </div>
      }
    >
      <AdminVerifyView />
    </React.Suspense>
  );
}
