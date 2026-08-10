"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Tabs } from "@/components/ui/Tabs";
import { AgreementHeaderBanner } from "./AgreementHeaderBanner";
import { AgreementInfoTab, AgreementInfoData } from "./AgreementInfoTab";
import { AgreementActivityTab, ActivityEventItem } from "./AgreementActivityTab";
import { MarketplaceCollabReportsTab } from "@/components/features/admin/marketplace/MarketplaceCollabReportsTab";
import { MarketplaceCollabNotesAuditTab } from "@/components/features/admin/marketplace/MarketplaceCollabNotesAuditTab";
import { useAgreementDetailQuery, useAgreementActivityQuery, useAdminAgreements } from "@/hooks/admin/useAdminAgreements";

interface AgreementDetailProps {
  id: string;
}

const MOCK_AGREEMENT_DATA: AgreementInfoData = {
  agreementId: "AGR-4018",
  projectName: "Afro Fusion Album",
  projectId: "proj-101",
  status: "Disputed",
  dateCreated: "May 10, 2024",
  dateSigned: "May 18, 2024",
  agreementType: "Track-Only Collaboration Agreement",
  format: "PDF Document",
  displayFile: "Afro_Fusion_Agreement.pdf",
  fileSize: "2.4 MB",
  ownerId: "user-1",
  ownerName: "Chisom Eze",
  ownerRole: "Project Owner",
  signatories: [
    { id: "s1", name: "Chisom Eze", role: "Project Owner", status: "Signed", signedDate: "May 16, 2024" },
    { id: "s2", name: "Amaka Eze", role: "Collaborator", status: "Signed", signedDate: "May 18, 2024" },
    { id: "s3", name: "Marcus Lee", role: "Collaborator", status: "Pending" },
  ],
  dispute: {
    filedBy: "Marcus Lee",
    date: "Jun 20, 2024",
    reason: "Royalty split differs from verbal agreement during production negotiation.",
  },
  tamperProofHash: "sha256-8f92a10b4c7319e5",
};

const MOCK_ACTIVITY_EVENTS: ActivityEventItem[] = [
  { id: "e1", eventType: "Uploads", badgeLabel: "Agreement Uploaded", badgeColor: "green", description: "Initial draft uploaded by project owner", actorName: "Chisom Eze", timestamp: "May 10, 2024 - 10:14 AM" },
  { id: "e2", eventType: "Edits", badgeLabel: "Agreement Edited", badgeColor: "blue", description: "Royalty split updated from 70/30 to 60/40", actorName: "Chisom Eze", timestamp: "May 14, 2024 - 03:15 PM" },
  { id: "e3", eventType: "Edits", badgeLabel: "Agreement Edited", badgeColor: "blue", description: "Delivery deadline set to May 30, 2024", actorName: "Chisom Eze", timestamp: "May 15, 2024 - 11:02 AM" },
  { id: "e4", eventType: "Signatures", badgeLabel: "Signed by Project Owner", badgeColor: "green", description: "Chisom Eze signed the agreement digitally", actorName: "Chisom Eze", timestamp: "May 16, 2024 - 09:20 AM" },
  { id: "e5", eventType: "Signatures", badgeLabel: "Signed by Collaborator", badgeColor: "green", description: "Amaka Eze signed the agreement digitally", actorName: "Amaka Eze", timestamp: "May 18, 2024 - 02:45 PM" },
  { id: "e6", eventType: "State Changes", badgeLabel: "State Changed – Pending", badgeColor: "yellow", description: "Awaiting final signature from Marcus Lee", actorName: "System", timestamp: "May 19, 2024 - 10:00 AM" },
  { id: "e7", eventType: "State Changes", badgeLabel: "Dispute Filed", badgeColor: "red", description: "Marcus Lee filed a dispute regarding royalty splits with project owner", actorName: "Marcus Lee", timestamp: "Jun 20, 2024 - 05:12 PM" },
  { id: "e8", eventType: "State Changes", badgeLabel: "State Changed – Disputed", badgeColor: "red", description: "Agreement flagged for administrative review", actorName: "System", timestamp: "Jun 20, 2024 - 05:12 PM" },
];

export const AgreementDetail: React.FC<AgreementDetailProps> = ({ id }) => {
  const [activeTab, setActiveTab] = useState("Agreement Details");

  const { data: remoteDetail, isLoading, isError } = useAgreementDetailQuery(id);
  const { data: remoteActivity } = useAgreementActivityQuery(id);
  const { createNote } = useAdminAgreements();

  if (isLoading) return <div className="p-8 text-white/40 text-center">Loading agreement details...</div>;

  const infoData: AgreementInfoData = remoteDetail
    ? {
        agreementId: remoteDetail.agreementId || `AGR-${id.slice(-4)}`,
        projectName: remoteDetail.projectName || remoteDetail.project?.title || "Project Agreement",
        projectId: remoteDetail.projectId || remoteDetail.project?.id || "proj-1",
        status: remoteDetail.status || "Signed",
        dateCreated: remoteDetail.createdAt ? new Date(remoteDetail.createdAt).toLocaleDateString() : "May 10, 2024",
        dateSigned: remoteDetail.signedAt ? new Date(remoteDetail.signedAt).toLocaleDateString() : "May 18, 2024",
        agreementType: remoteDetail.agreementType || "Track-Only Collaboration Agreement",
        format: "PDF Document",
        displayFile: remoteDetail.displayFile || "Agreement_Copy.pdf",
        fileSize: remoteDetail.fileSize || "2.4 MB",
        ownerId: remoteDetail.ownerId || remoteDetail.owner?.id || "user-1",
        ownerName: remoteDetail.ownerName || remoteDetail.owner?.displayName || "Project Owner",
        ownerRole: remoteDetail.ownerRole || "Project Owner",
        signatories: Array.isArray(remoteDetail.signatories) ? remoteDetail.signatories : MOCK_AGREEMENT_DATA.signatories,
        dispute: remoteDetail.dispute || MOCK_AGREEMENT_DATA.dispute,
        tamperProofHash: remoteDetail.tamperProofHash || "sha256-verified",
      }
    : MOCK_AGREEMENT_DATA;

  const activityEvents: ActivityEventItem[] = Array.isArray(remoteActivity) && remoteActivity.length > 0
    ? remoteActivity
    : MOCK_ACTIVITY_EVENTS;

  const reports = remoteDetail?.reports || [];
  const auditLogs = remoteDetail?.auditLogs || [];

  const handleAddNote = async (noteText: string) => {
    await createNote({ note: noteText, agreementId: id });
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-white animate-in fade-in duration-300">
      {/* Breadcrumb Trail */}
      <Breadcrumbs
        items={[
          { label: "Admin Portal" },
          { label: "Legal Agreements", href: "/admin/agreements" },
          { label: `${infoData.agreementId} - ${infoData.projectName}` },
        ]}
      />

      {/* Main Outer Container */}
      <div className="w-full bg-[#121415] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
        {/* Header Section Banner */}
        <AgreementHeaderBanner
          data={{
            id,
            agreementId: infoData.agreementId,
            title: `${infoData.projectName} – Collaboration Agreement`,
            status: infoData.status as any,
            agreementType: infoData.agreementType,
          }}
          onViewDocument={() => alert("Document viewer opened")}
          onDownload={() => alert("Downloading agreement PDF")}
        />

        {/* Detail Sub-Tabs Bar */}
        <Tabs
          tabs={["Agreement Details", "Activity History", `Reports (${reports.length})`, "Notes & Audit"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Panel Content */}
        {activeTab === "Agreement Details" && <AgreementInfoTab data={infoData} />}

        {activeTab === "Activity History" && <AgreementActivityTab events={activityEvents} />}

        {activeTab.startsWith("Reports") && <MarketplaceCollabReportsTab reports={reports} />}

        {activeTab === "Notes & Audit" && (
          <MarketplaceCollabNotesAuditTab logs={auditLogs} onAddNote={handleAddNote} />
        )}
      </div>
    </div>
  );
};
