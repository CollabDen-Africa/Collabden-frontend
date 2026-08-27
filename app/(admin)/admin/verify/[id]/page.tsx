"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AdminVerifyDetailView } from "@/components/features/admin/verification-management/AdminVerifyDetailView";

export default function AdminVerifyDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  return <AdminVerifyDetailView id={id} />;
}
