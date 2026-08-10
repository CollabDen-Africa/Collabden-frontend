"use client";

import React, { use } from "react";
import { ProjectDetails } from "@/components/features/admin/projects/ProjectDetails";

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ProjectDetails projectId={id} />;
}
