"use client";

import React, { use } from "react";
import { AgreementDetail } from "@/components/features/admin/agreements/AgreementDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminAgreementDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return <AgreementDetail id={resolvedParams.id} />;
}
