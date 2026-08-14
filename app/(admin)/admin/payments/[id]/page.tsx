"use client";

import React, { use } from "react";
import { PaymentDetailView } from "@/components/features/admin/payments/PaymentDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminPaymentDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return <PaymentDetailView id={resolvedParams.id} />;
}
