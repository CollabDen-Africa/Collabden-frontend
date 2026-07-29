import React, { Suspense } from "react";
import AdminAccountsView from "@/components/features/admin/roles/AdminAccountsView";

export const metadata = {
  title: "Administrator Accounts | CollabDen Admin",
  description: "Manage admin accounts, assign roles, and control portal access across CollabDen.",
};

export default function AdminAccountsPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center text-white/40">Loading accounts...</div>}>
      <AdminAccountsView />
    </Suspense>
  );
}
