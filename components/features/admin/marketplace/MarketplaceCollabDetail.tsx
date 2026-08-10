"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Tabs } from "@/components/ui/Tabs";
import { MarketplaceCollabHeader } from "./MarketplaceCollabHeader";
import { MarketplaceOverviewTab, ProfileOverviewData } from "./MarketplaceOverviewTab";
import { MarketplaceCollabHistoryTab } from "./MarketplaceCollabHistoryTab";
import { MarketplaceCollabReportsTab } from "./MarketplaceCollabReportsTab";
import { MarketplaceCollabNotesAuditTab } from "./MarketplaceCollabNotesAuditTab";

interface MarketplaceCollabDetailProps {
  id: string;
}

const MOCK_PROFILE_DETAIL: ProfileOverviewData & {
  id: string;
  name: string;
  reviewsCount: number;
  isReported: boolean;
  status: string;
  bio: string;
} = {
  id: "mkt-0412",
  name: "Chisom Eze",
  displayName: "Chisom Eze",
  stageName: "ChisomSongs",
  profileId: "MKT-0412",
  location: "Enugu, Nigeria",
  rating: 4.9,
  avgRating: 4.9,
  reviewsCount: 18,
  isReported: true,
  status: "Open to Collab",
  roles: ["Songwriter", "Vocalist", "Performer"],
  genres: ["R&B", "Pop", "Afrobeats", "Soul"],
  bio: "A vocal arranger and vocalist with 8+ years of professional experience. Specializing in R&B and Pop soundscapes for artists and producers across West Africa and the UK.",
  isVerified: true,
  memberSince: "Feb 3, 2024",
  totalCollaborations: 38,
  completedProjects: 14,
  activeProjects: 3,
};

const MOCK_COLLAB_HISTORY = [
  { id: "h1", projectName: "Unchained Melody Vol. 2", role: "Producer", status: "In Progress" as const, date: "Jan 12, 2025" },
  { id: "h2", projectName: "Summer Vibes EP", role: "Vocalist", status: "Completed" as const, date: "May 2024" },
  { id: "h3", projectName: "Afro Fusion Album", role: "Producer", status: "Completed" as const, date: "Nov 2024" },
];

const MOCK_REPORTS = [
  { id: "r1", reportId: "REP-9041", reason: "Incomplete deliverable submission", reporterName: "Tola Adebayo", date: "Jan 10, 2025", status: "Pending" as const },
  { id: "r2", reportId: "REP-8812", reason: "Copyright dispute on melody track", reporterName: "Marcus Lee", date: "Dec 14, 2024", status: "Reviewed" as const },
];

const MOCK_AUDIT_LOGS = [
  { id: "a1", adminName: "Chidi Okonkwo", action: "Flagged profile as Reported based on ticket #REP-9041", note: "User reported for delayed stem deliveries.", timestamp: "Jan 11, 2025, 10:14 AM" },
  { id: "a2", adminName: "Amaka Eze", action: "Verified identity credentials", timestamp: "Feb 3, 2024, 02:30 PM" },
];

export const MarketplaceCollabDetail: React.FC<MarketplaceCollabDetailProps> = ({ id }) => {
  const [activeTab, setActiveTab] = useState("Profile Overview");
  const [auditLogs, setAuditLogs] = useState(MOCK_AUDIT_LOGS);

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
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs
        items={[
          { label: "Admin Portal" },
          { label: "Marketplace", href: "/admin/marketplace" },
          { label: "Collaborator Profile" },
          { label: MOCK_PROFILE_DETAIL.name },
        ]}
      />

      {/* Main Outer Container */}
      <div className="w-full bg-[#121415] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
        {/* Header Section Banner */}
        <MarketplaceCollabHeader
          data={MOCK_PROFILE_DETAIL}
          onRestrict={() => alert("Profile restriction action triggered")}
          onAddNote={() => setActiveTab("Notes & Audit")}
        />

        {/* Detail Sub-Tabs Bar */}
        <Tabs
          tabs={["Profile Overview", "Collaboration History", `Reports (${MOCK_REPORTS.length})`, "Notes & Audit"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Panel Content */}
        {activeTab === "Profile Overview" && (
          <MarketplaceOverviewTab data={MOCK_PROFILE_DETAIL} />
        )}

        {activeTab === "Collaboration History" && (
          <MarketplaceCollabHistoryTab items={MOCK_COLLAB_HISTORY} />
        )}

        {activeTab.startsWith("Reports") && (
          <MarketplaceCollabReportsTab reports={MOCK_REPORTS} />
        )}

        {activeTab === "Notes & Audit" && (
          <MarketplaceCollabNotesAuditTab logs={auditLogs} onAddNote={handleAddNote} />
        )}
      </div>
    </div>
  );
};
