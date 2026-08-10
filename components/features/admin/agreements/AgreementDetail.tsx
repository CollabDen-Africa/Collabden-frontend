"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Tabs } from "@/components/ui/Tabs";
import { AgreementHeaderBanner } from "./AgreementHeaderBanner";
import { AgreementInfoTab, AgreementInfoData } from "./AgreementInfoTab";
import { AgreementActivityTab, ActivityEventItem } from "./AgreementActivityTab";
import { AgreementAuditLogTab } from "./AgreementAuditLogTab";
import { MarketplaceCollabReportsTab } from "@/components/features/admin/marketplace/MarketplaceCollabReportsTab";
import { useAgreementDetailQuery, useAgreementActivityQuery } from "@/hooks/admin/useAdminAgreements";

interface AgreementDetailProps {
  id: string;
}

export const AgreementDetail: React.FC<AgreementDetailProps> = ({ id }) => {
  const [activeTab, setActiveTab] = useState("Agreement Details");

  const { data: remoteDetail, isLoading: isLoadingDetail, isError: isErrorDetail } = useAgreementDetailQuery(id);
  const { data: remoteActivity, isLoading: isLoadingActivity } = useAgreementActivityQuery(id);

  if (isLoadingDetail) return <div className="p-12 text-white/40 text-center text-sm">Loading agreement details...</div>;
  if (isErrorDetail || !remoteDetail) return <div className="p-12 text-accent-red text-center text-sm">Error loading agreement details from API.</div>;

  const infoData: AgreementInfoData = {
    agreementId: remoteDetail.agreementId || `AGR-${id.slice(-4)}`,
    projectName: remoteDetail.projectName || remoteDetail.project?.title || "Project Agreement",
    projectId: remoteDetail.projectId || remoteDetail.project?.id || "proj-1",
    status: remoteDetail.status || "Signed",
    dateCreated: remoteDetail.createdAt ? new Date(remoteDetail.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A",
    dateSigned: remoteDetail.signedAt ? new Date(remoteDetail.signedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A",
    agreementType: remoteDetail.agreementType || "Track-Only Collaboration Agreement",
    format: remoteDetail.format || "PDF Document",
    displayFile: remoteDetail.displayFile || "Agreement_Copy.pdf",
    fileSize: remoteDetail.fileSize || "2.4 MB",
    ownerId: remoteDetail.ownerId || remoteDetail.owner?.id || "user-1",
    ownerName: remoteDetail.ownerName || remoteDetail.owner?.displayName || "Project Owner",
    ownerRole: remoteDetail.ownerRole || "Project Owner",
    signatories: Array.isArray(remoteDetail.signatories) ? remoteDetail.signatories : [],
    dispute: remoteDetail.dispute,
    tamperProofHash: remoteDetail.tamperProofHash || "sha256-verified",
  };

  const activityEvents: ActivityEventItem[] = Array.isArray(remoteActivity)
    ? remoteActivity.map((e: any, idx: number) => ({
        id: e.id || `act-${idx}`,
        eventType: e.eventType || "State Changes",
        badgeLabel: e.badgeLabel || e.action || "Activity Event",
        badgeColor: e.badgeColor || (e.eventType === "Signatures" ? "green" : e.eventType === "Edits" ? "blue" : e.eventType === "Uploads" ? "green" : "yellow"),
        description: e.description || e.note || "Event logged",
        actorName: e.actorName || e.user?.displayName || "System",
        timestamp: e.timestamp || (e.createdAt ? new Date(e.createdAt).toLocaleString() : "Recently"),
      }))
    : [];

  const reports = Array.isArray(remoteDetail?.reports) ? remoteDetail.reports : [];
  const auditLogs = Array.isArray(remoteDetail?.auditLogs) ? remoteDetail.auditLogs : [];

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
          tabs={["Agreement Details", "Activity History", `Reports (${reports.length})`, "Audit Log"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Panel Content */}
        {activeTab === "Agreement Details" && <AgreementInfoTab data={infoData} />}

        {activeTab === "Activity History" && (
          isLoadingActivity ? (
            <div className="p-12 text-center text-white/40 text-sm">Loading activity history...</div>
          ) : (
            <AgreementActivityTab events={activityEvents} />
          )
        )}

        {activeTab.startsWith("Reports") && <MarketplaceCollabReportsTab reports={reports} />}

        {activeTab === "Audit Log" && (
          <AgreementAuditLogTab
            logs={auditLogs}
            agreementTitle={infoData.projectName}
            agreementId={infoData.agreementId}
          />
        )}
      </div>
    </div>
  );
};
