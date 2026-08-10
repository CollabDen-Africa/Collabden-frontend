"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Tabs } from "@/components/ui/Tabs";
import { MarketplacePostingHeader } from "./MarketplacePostingHeader";
import { MarketplacePostingInfoTab } from "./MarketplacePostingInfoTab";
import { MarketplaceCollabReportsTab } from "./MarketplaceCollabReportsTab";
import { MarketplaceCollabNotesAuditTab } from "./MarketplaceCollabNotesAuditTab";
import { MarketplaceModerationModal, ModerationTarget } from "./MarketplaceModerationModal";
import { useAdminMarketplace } from "@/hooks/admin/useAdminMarketplace";

interface MarketplacePostingDetailProps {
  id: string;
}

const MOCK_POSTING_DATA = {
  id: "post-103",
  title: "Beat Producer Needed – Hip-Hop Project",
  postId: "POST-103",
  postedDate: "Jul 5, 2024",
  applicationsCount: 11,
  status: "Reported" as const,
  description: "Looking for an experienced beat producer to create heavy instrumental beats for a 5-track project. Previous submission experience preferred.",
  genre: "Hip-Hop",
  requiredRole: "Beat Producer",
  scope: "3-4 tracks",
  isRemote: true,
  applicationsReceived: 11,
  fixedBudget: "$450 USD",
  ownerId: "mkt-0521",
  ownerName: "Afeez Owo",
  ownerRole: "Project Creator",
  ownerEmail: "afeez@collabden.com",
  applicants: [
    { id: "app-1", name: "Alvara Omo", role: "Producer", rating: 4.9, status: "Shortlisted" as const, appliedDate: "Jul 6, 2024" },
    { id: "app-2", name: "Marcus Lee", role: "Producer", rating: 5.0, status: "Applied" as const, appliedDate: "Jul 7, 2024" },
    { id: "app-3", name: "Femi Dedigbo", role: "Mixer", rating: 4.8, status: "Applied" as const, appliedDate: "Jul 7, 2024" },
    { id: "app-4", name: "Kelechi James", role: "Beatmaker", rating: 4.3, status: "Rejected" as const, appliedDate: "Jul 8, 2024" },
  ],
};

const MOCK_REPORTS = [
  { id: "rep-101", reportId: "REP-4012", reason: "Misleading posting — payment terms misrepresentation", reporterName: "Tola Adebayo", date: "Jul 6, 2024", status: "Pending" as const },
];

const MOCK_AUDIT_LOGS = [
  { id: "a1", adminName: "Super Admin", action: "Flagged posting as Reported", note: "User reported payment dispute.", timestamp: "Jul 6, 2024, 04:12 PM" },
];

export const MarketplacePostingDetail: React.FC<MarketplacePostingDetailProps> = ({ id }) => {
  const [activeTab, setActiveTab] = useState("Posting Details");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOGS);

  const { moderateProject } = useAdminMarketplace();

  const modalTarget: ModerationTarget = {
    id: MOCK_POSTING_DATA.id,
    name: MOCK_POSTING_DATA.title,
    type: "posting",
    profileIdOrPostId: MOCK_POSTING_DATA.postId,
    rolesOrCategory: MOCK_POSTING_DATA.genre,
    currentStatus: MOCK_POSTING_DATA.status,
  };

  const handleModerationConfirm = async (payload: { action: string; reason: string; notes: string }) => {
    await moderateProject({ id: MOCK_POSTING_DATA.id, action: payload.action, reason: payload.reason });
    const newLog = {
      id: `a-${Date.now()}`,
      adminName: "Super Admin",
      action: `Executed ${payload.action.toUpperCase()} action`,
      note: payload.notes || payload.reason,
      timestamp: "Just now",
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const handleAddNote = (noteText: string) => {
    const newLog = {
      id: `a-${Date.now()}`,
      adminName: "Super Admin",
      action: "Added internal note",
      note: noteText,
      timestamp: "Just now",
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-white animate-in fade-in duration-300">
      {/* Breadcrumb Trail */}
      <Breadcrumbs
        items={[
          { label: "Admin Portal" },
          { label: "Marketplace", href: "/admin/marketplace" },
          { label: "Project Postings" },
          { label: MOCK_POSTING_DATA.title },
        ]}
      />

      {/* Main Container */}
      <div className="w-full bg-[#121415] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
        {/* Posting Header Banner */}
        <MarketplacePostingHeader
          data={MOCK_POSTING_DATA}
          onRestrict={() => setIsModalOpen(true)}
          onRemove={() => setIsModalOpen(true)}
        />

        {/* Detail Tabs Bar */}
        <Tabs
          tabs={[
            "Posting Details",
            `Applications (${MOCK_POSTING_DATA.applicationsCount})`,
            `Reports (${MOCK_REPORTS.length})`,
            "Notes & Audit",
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content Panels */}
        {activeTab === "Posting Details" && <MarketplacePostingInfoTab data={MOCK_POSTING_DATA} />}

        {activeTab.startsWith("Applications") && <MarketplacePostingInfoTab data={MOCK_POSTING_DATA} />}

        {activeTab.startsWith("Reports") && <MarketplaceCollabReportsTab reports={MOCK_REPORTS} />}

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
