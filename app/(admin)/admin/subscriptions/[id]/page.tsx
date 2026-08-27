"use client";

import React from "react";
import { useParams } from "next/navigation";
import { AdminSubscriptionDetailView } from "@/components/features/admin/subscriptions/AdminSubscriptionDetailView";

export default function AdminSubscriptionDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  return <AdminSubscriptionDetailView id={id} />;
}
