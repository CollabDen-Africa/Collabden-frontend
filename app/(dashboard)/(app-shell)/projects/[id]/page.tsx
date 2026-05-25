"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { HiArrowLeft } from "react-icons/hi";
import { useProjects } from "@/hooks/projects/useProjects";
import { handleApiError } from "@/lib/error-handler";

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { useProjectDetail } = useProjects();
  const { data: project, isLoading, error } = useProjectDetail(id);

  if (error) {
    handleApiError(error);
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center justify-center gap-8 py-20 px-4">

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="self-start flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
      >
        <HiArrowLeft size={20} />
        <span className="font-sans font-medium text-[14px]">Back to Projects</span>
      </button>

      {/* Placeholder Content */}
      <div className="flex flex-col items-center gap-4 text-center py-16">
        {isLoading ? (
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-primary-green rounded-full animate-spin" />
        ) : (
          <>
            <div className="w-[80px] h-[80px] bg-primary-green/10 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-green">
                <path d="M2 10v3" />
                <path d="M6 6v11" />
                <path d="M10 3v18" />
                <path d="M14 8v7" />
                <path d="M18 5v13" />
                <path d="M22 10v3" />
              </svg>
            </div>
            <h1 className="font-sans font-semibold text-[28px] md:text-[32px] text-foreground">
              {project?.name || "Project Workspace"}
            </h1>
            <p className="font-sans font-medium text-[16px] text-foreground/60 max-w-[400px]">
              {project?.name
                ? `Welcome to ${project.name}. The full workspace experience for this project is coming soon.`
                : "The project workspace is coming soon. You'll be able to manage tasks, files, and collaborate in real time."}
            </p>
          </>
        )}
        <Button
          variant="primary"
          onClick={() => router.push("/projects")}
          className="mt-4"
        >
          Back to Projects
        </Button>
      </div>

    </div>
  );
}
