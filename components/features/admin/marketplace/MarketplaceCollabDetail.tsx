"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Tabs } from "@/components/ui/Tabs";
import { MarketplaceCollabHeader } from "./MarketplaceCollabHeader";
import { MarketplaceOverviewTab } from "./MarketplaceOverviewTab";
import { MarketplaceCollabHistoryTab } from "./MarketplaceCollabHistoryTab";
import { MarketplaceCollabReportsTab } from "./MarketplaceCollabReportsTab";
import { MarketplaceCollabNotesAuditTab } from "./MarketplaceCollabNotesAuditTab";
import { MarketplaceModerationModal, ModerationTarget } from "./MarketplaceModerationModal";
import { useMarketplaceCollaboratorDetail, useAdminMarketplace } from "@/hooks/admin/useAdminMarketplace";

interface MarketplaceCollabDetailProps {
  id: string;
}

export const MarketplaceCollabDetail: React.FC<MarketplaceCollabDetailProps> = ({ id }) => {
  const [activeTab, setActiveTab] = useState("Profile Overview");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: collabData, isLoading, isError } = useMarketplaceCollaboratorDetail(id);
  const { createNote, moderateCollaborator } = useAdminMarketplace();

  if (isLoading) return <div className="p-8 text-white/40 text-center">Loading collaborator profile...</div>;
  if (isError || !collabData) return <div className="p-8 text-accent-red text-center">Error loading collaborator profile.</div>;

  const profileDetail = {
    id: collabData.id || id,
    name: collabData.displayName || `${collabData.firstName || ''} ${collabData.lastName || ''}`.trim() || "Collaborator",
    displayName: collabData.displayName || collabData.firstName || "Collaborator",
    stageName: collabData.stageName || collabData.displayName || "N/A",
    profileId: collabData.profileId || `MKT-${id.slice(-4)}`,
    location: collabData.location || "Enugu, Nigeria",
    rating: collabData.rating || 4.9,
    avgRating: collabData.rating || 4.9,
    reviewsCount: collabData.reviewsCount || 18,
    isReported: Boolean(collabData.isReported || collabData.status === "REPORTED"),
    status: collabData.status || "Open to Collab",
    roles: Array.isArray(collabData.roles) ? collabData.roles : ["Songwriter", "Vocalist"],
    genres: Array.isArray(collabData.genres) ? collabData.genres : ["R&B", "Pop"],
    bio: collabData.bio || "No bio description provided.",
    isVerified: Boolean(collabData.isVerified || collabData.identityVerified),
    memberSince: collabData.createdAt ? new Date(collabData.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Feb 3, 2024",
    totalCollaborations: collabData.totalCollaborations || 0,
    completedProjects: collabData.completedProjects || 0,
    activeProjects: collabData.activeProjects || 0,
  };

  const collabHistory = Array.isArray(collabData.history) ? collabData.history : [];
  const reports = Array.isArray(collabData.reports) ? collabData.reports : [];
  const auditLogs = Array.isArray(collabData.auditLogs) ? collabData.auditLogs : [];

  const modalTarget: ModerationTarget = {
    id: profileDetail.id,
    name: profileDetail.name,
    type: "profile",
    profileIdOrPostId: profileDetail.profileId,
    rolesOrCategory: profileDetail.roles.join(" / "),
    currentStatus: profileDetail.status,
  };

  const handleModerationConfirm = async (payload: { action: string; reason: string }) => {
    await moderateCollaborator({ id: profileDetail.id, action: payload.action, reason: payload.reason });
  };

  const handleAddNote = async (noteText: string) => {
    await createNote({ note: noteText, targetId: profileDetail.id });
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-white animate-in fade-in duration-300">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs
        items={[
          { label: "Admin Portal" },
          { label: "Marketplace", href: "/admin/marketplace" },
          { label: "Collaborator Profile" },
          { label: profileDetail.name },
        ]}
      />

      {/* Main Outer Container */}
      <div className="w-full bg-[#121415] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
        {/* Header Section Banner */}
        <MarketplaceCollabHeader
          data={profileDetail}
          onRestrict={() => setIsModalOpen(true)}
          onAddNote={() => setActiveTab("Notes & Audit")}
        />

        {/* Detail Sub-Tabs Bar */}
        <Tabs
          tabs={["Profile Overview", "Collaboration History", `Reports (${reports.length})`, "Notes & Audit"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Panel Content */}
        {activeTab === "Profile Overview" && (
          <MarketplaceOverviewTab data={profileDetail} />
        )}

        {activeTab === "Collaboration History" && (
          <MarketplaceCollabHistoryTab items={collabHistory} />
        )}

        {activeTab.startsWith("Reports") && (
          <MarketplaceCollabReportsTab reports={reports} />
        )}

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
