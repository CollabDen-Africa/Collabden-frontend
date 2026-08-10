"use client";

import React, { use } from "react";
import { MarketplacePostingDetail } from "@/components/features/admin/marketplace/MarketplacePostingDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminMarketplacePostingDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return <MarketplacePostingDetail id={resolvedParams.id} />;
}
