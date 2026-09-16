"use client";

import { useParams } from "next/navigation";
import { AdminVerifyDetailView } from "@/components/features/admin/verification-management/AdminVerifyDetailView";

export default function VerificationManagementDetailPage() {
  const params = useParams();

  return <AdminVerifyDetailView id={params.id as string} />;
}
