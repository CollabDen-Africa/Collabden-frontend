import React from "react";
import EditRoleMatrixView from "@/components/features/admin/roles/EditRoleMatrixView";

export const metadata = {
  title: "Edit Role Permissions | CollabDen Admin",
  description: "Configure modular permission levels and access matrix for administrator roles.",
};

export default async function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <EditRoleMatrixView roleId={resolvedParams.id} />;
}
