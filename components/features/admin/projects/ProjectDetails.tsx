import React, { useState } from "react";
import { useProject } from "@/hooks/admin/useProject";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Tabs } from "@/components/ui/Tabs";
import { useRouter } from "next/navigation";
import { ProjectOverview } from "./ProjectOverview";
import { ProjectActivity } from "./ProjectActivity";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectNotesAudit } from "./ProjectNotesAudit";

export const ProjectDetails: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { data: project, isLoading } = useProject(projectId);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Overview");

  if (isLoading) {
    return <div className="p-8 text-center text-white/40">Loading project details...</div>;
  }

  if (!project) {
    return <div className="p-8 text-center text-white/40">Project not found.</div>;
  }

  const breadcrumbs = [
    { label: "Admin Portal" },
    { label: "Projects", href: "/admin/projects" },
    { label: project.name, href: `/admin/projects/${projectId}` },
  ];

  return (
    <div className="w-full flex flex-col gap-6 pb-12 animate-in fade-in duration-300">
      <Breadcrumbs items={breadcrumbs} />

      <div className="w-full bg-[#121415] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
        {/* Header Section */}
        <ProjectHeader 
          project={project} 
          onAddNoteClick={() => setActiveTab("Notes & Audit")} 
        />

        <Tabs 
          tabs={["Overview", "Activity", "Reports", "Notes & Audit"]}
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === "Reports" && project._count?.reports > 0) {
              router.push(`/admin/projects/reports?search=${encodeURIComponent(project.name)}`);
            } else {
              setActiveTab(tab);
            }
          }}
        />

        {activeTab === "Overview" && <ProjectOverview project={project} />}
        {activeTab === "Activity" && <ProjectActivity projectId={projectId} />}
        
        {/* Placeholders for Reports and Notes */}
        {activeTab === "Reports" && (
          <div className="p-8 text-white/40 text-center bg-[#0a0a0c]">
            Reports content will be displayed here.
          </div>
        )}
        {activeTab === "Notes & Audit" && <ProjectNotesAudit projectId={projectId} />}
      </div>
    </div>
  );
};
