import React from "react";
import AdminRolesView from "@/components/features/admin/roles/AdminRolesView";

export const metadata = {
  title: "Admin Roles & Permissions | CollabDen Admin",
  description: "Manage administrator roles, assigned permissions, and access levels across CollabDen.",
};

export default function AdminRolesPage() {
  return <AdminRolesView />;
}
