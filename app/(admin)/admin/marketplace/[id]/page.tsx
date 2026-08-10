"use client";

import React, { use } from "react";
import { MarketplaceCollabDetail } from "@/components/features/admin/marketplace/MarketplaceCollabDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminMarketplaceDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return <MarketplaceCollabDetail id={resolvedParams.id} />;
}
