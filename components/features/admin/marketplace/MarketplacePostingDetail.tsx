"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Tabs } from "@/components/ui/Tabs";
import { MarketplacePostingHeader } from "./MarketplacePostingHeader";
import { MarketplacePostingInfoTab } from "./MarketplacePostingInfoTab";
import { MarketplaceCollabReportsTab } from "./MarketplaceCollabReportsTab";
import { MarketplaceCollabNotesAuditTab } from "./MarketplaceCollabNotesAuditTab";
import { MarketplaceModerationModal, ModerationTarget } from "./MarketplaceModerationModal";
import { useMarketplacePostingDetailQuery, useAdminMarketplace } from "@/hooks/admin/useAdminMarketplace";

interface MarketplacePostingDetailProps {
  id: string;
}

export const MarketplacePostingDetail: React.FC<MarketplacePostingDetailProps> = ({ id }) => {
  const [activeTab, setActiveTab] = useState("Posting Details");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: postingData, isLoading, isError } = useMarketplacePostingDetailQuery(id);
  const { createNote, moderateProject } = useAdminMarketplace();

  if (isLoading) return <div className="p-8 text-white/40 text-center">Loading posting details...</div>;
  if (isError || !postingData) return <div className="p-8 text-accent-red text-center">Error loading project posting details.</div>;

  const postingDetail = {
    id: postingData.id || id,
    title: postingData.title || "Project Posting",
    postId: postingData.postId || `POST-${id.slice(-3)}`,
    postedDate: postingData.createdAt ? new Date(postingData.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently",
    applicationsCount: postingData.applicationsCount || (postingData.applicants ? postingData.applicants.length : 0),
    status: postingData.status || "Active",
    description: postingData.description || "No project description provided.",
    genre: postingData.genre || "Hip-Hop",
    requiredRole: postingData.requiredRole || "Producer",
    scope: postingData.scope || "Project",
    isRemote: postingData.isRemote !== false,
    applicationsReceived: postingData.applicationsCount || (postingData.applicants ? postingData.applicants.length : 0),
    fixedBudget: postingData.fixedBudget || "$0 USD",
    ownerId: postingData.user?.id || postingData.ownerId || "user-1",
    ownerName: postingData.user?.displayName || postingData.ownerName || "Project Owner",
    ownerRole: postingData.user?.role || "Project Creator",
    ownerEmail: postingData.user?.email || "owner@collabden.com",
    applicants: Array.isArray(postingData.applicants) ? postingData.applicants : [],
  };

  const reports = Array.isArray(postingData.reports) ? postingData.reports : [];
  const auditLogs = Array.isArray(postingData.auditLogs) ? postingData.auditLogs : [];

  const modalTarget: ModerationTarget = {
    id: postingDetail.id,
    name: postingDetail.title,
    type: "posting",
    profileIdOrPostId: postingDetail.postId,
    rolesOrCategory: postingDetail.genre,
    currentStatus: postingDetail.status,
  };

  const handleModerationConfirm = async (payload: { action: string; reason: string }) => {
    await moderateProject({ id: postingDetail.id, action: payload.action, reason: payload.reason });
  };

  const handleAddNote = async (noteText: string) => {
    await createNote({ note: noteText, targetId: postingDetail.id });
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-white animate-in fade-in duration-300">
      {/* Breadcrumb Trail */}
      <Breadcrumbs
        items={[
          { label: "Admin Portal" },
          { label: "Marketplace", href: "/admin/marketplace" },
          { label: "Project Postings" },
          { label: postingDetail.title },
        ]}
      />

      {/* Main Container */}
      <div className="w-full bg-[#121415] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
        {/* Posting Header Banner */}
        <MarketplacePostingHeader
          data={postingDetail}
          onRestrict={() => setIsModalOpen(true)}
          onRemove={() => setIsModalOpen(true)}
        />

        {/* Detail Tabs Bar */}
        <Tabs
          tabs={[
            "Posting Details",
            `Applications (${postingDetail.applicationsCount})`,
            `Reports (${reports.length})`,
            "Notes & Audit",
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content Panels */}
        {activeTab === "Posting Details" && <MarketplacePostingInfoTab data={postingDetail} />}

        {activeTab.startsWith("Applications") && <MarketplacePostingInfoTab data={postingDetail} />}

        {activeTab.startsWith("Reports") && <MarketplaceCollabReportsTab reports={reports} />}

        {activeTab === "Notes & Audit" && (
          <MarketplaceCollabNotesAuditTab logs={auditLogs} onAddNote={handleAddNote} />
        )}
      </div>

      {/* Moderation Action Modal */}
      <MarketplaceModerationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        target={modalTarget}
        onConfirm={handleModerationConfirm}
      />
    </div>
  );
};
