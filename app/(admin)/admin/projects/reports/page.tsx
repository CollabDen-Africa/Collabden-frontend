"use client";

import React from "react";
import { ReportedProjectsList } from "@/components/features/admin/projects/reports/ReportedProjectsList";

export default function ReportedProjectsPage() {
  return (
    <div className="w-full h-full flex flex-col p-6 animate-in fade-in duration-300">
      <ReportedProjectsList />
    </div>
  );
}
