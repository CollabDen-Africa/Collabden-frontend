"use client";

import React, { Suspense } from "react";
import AdminSettingsManager from "@/components/features/admin/settings/SettingsManager";

export default function SettingsAdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-white/50 text-xs">
          Loading Settings...
        </div>
      }
    >
      <AdminSettingsManager />
    </Suspense>
  );
}
