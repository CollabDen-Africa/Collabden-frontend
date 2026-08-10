import React from "react";
import AccessHistoryView from "@/components/features/admin/roles/AccessHistoryView";

export const metadata = {
  title: "Admin Access History | CollabDen Admin",
  description: "Monitor administrator login activity, device info, and suspicious access events.",
};

export default function AccessHistoryPage() {
  return <AccessHistoryView />;
}
