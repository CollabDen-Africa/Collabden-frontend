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
import { HiOutlineX, HiOutlineDocumentText, HiOutlineDownload, HiOutlineShieldCheck } from "react-icons/hi";

interface AgreementDetailProps {
  id: string;
}

export const AgreementDetail: React.FC<AgreementDetailProps> = ({ id }) => {
  const [activeTab, setActiveTab] = useState("Agreement Details");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  const handleDownloadPDF = () => {
    // Generate simulated blob download for document copy
    const element = document.createElement("a");
    const file = new Blob([`Collabden Legal Agreement\nID: ${infoData.agreementId}\nProject: ${infoData.projectName}\nHash: ${infoData.tamperProofHash}`], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${infoData.agreementId}_Legal_Copy.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
          onViewDocument={() => setIsPreviewOpen(true)}
          onDownload={handleDownloadPDF}
        />

        {/* Detail Sub-Tabs Bar */}
        <Tabs
          tabs={["Agreement Details", "Activity History", `Reports (${reports.length})`, "Audit Log"]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Panel Content */}
        {activeTab === "Agreement Details" && (
          <AgreementInfoTab data={infoData} onViewSignedCopy={() => setIsPreviewOpen(true)} />
        )}

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

      {/* Document Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-3xl bg-[#121415] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <HiOutlineX size={20} />
            </button>

            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-green/10 border border-primary-green/20 text-primary-green flex items-center justify-center">
                <HiOutlineDocumentText size={28} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-bold text-white font-sans">{infoData.displayFile}</h3>
                <span className="text-xs text-text-muted">{infoData.agreementId} • {infoData.agreementType}</span>
              </div>
            </div>

            {/* Document Viewer Frame simulation */}
            <div className="w-full h-80 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between gap-4 font-mono text-xs text-white/80 overflow-y-auto">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-primary-green font-bold border-b border-white/10 pb-2">
                  <span>COLLABDEN EXCLUSIVE MUSIC COLLABORATION AGREEMENT</span>
                  <span className="flex items-center gap-1"><HiOutlineShieldCheck size={16} /> VERIFIED</span>
                </div>
                <p className="text-white/70 leading-relaxed font-sans text-xs">
                  This Agreement is entered into by and between <strong>{infoData.ownerName}</strong> and participating signatories for the project <strong>{infoData.projectName}</strong>.
                </p>
                <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col gap-1 text-[11px]">
                  <span>SHA-256 Hash: {infoData.tamperProofHash}</span>
                  <span>Created: {infoData.dateCreated} | Signed: {infoData.dateSigned}</span>
                  <span>Status: {infoData.status}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
              >
                Close Preview
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-green text-text-main text-xs font-bold hover:brightness-110 transition-all"
              >
                <HiOutlineDownload size={16} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
