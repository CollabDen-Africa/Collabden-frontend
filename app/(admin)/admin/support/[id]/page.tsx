"use client";

import React from "react";
import { useParams } from "next/navigation";
import { SupportTicketDetailView } from "@/components/features/admin/support/SupportTicketDetailView";

export default function AdminSupportDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  return <SupportTicketDetailView id={id} />;
}
