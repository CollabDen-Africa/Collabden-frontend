"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Tabs } from "@/components/ui/Tabs";
import { useAdminSupportDetail } from "@/hooks/admin/useAdminSupportDetail";
import { SupportConversationTab } from "./SupportConversationTab";
import { SupportAssignModal } from "./SupportAssignModal";
import {
  HiOutlineTicket,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlinePaperClip,
} from "react-icons/hi";

const STATUS_STYLES: Record<string, string> = {
  Open: "bg-accent-red/10 text-accent-red border border-accent-red/20",
  "In Progress": "bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20",
  Resolved: "bg-primary-green/10 text-primary-green border border-primary-green/20",
  Closed: "bg-white/5 text-text-muted border border-white/10",
};

const PRIORITY_STYLES: Record<string, string> = {
  Critical: "text-accent-red",
  High: "text-accent-yellow",
  Medium: "text-secondary-blue",
  Low: "text-text-muted",
};

const ACTIVITY_TYPE_STYLES: Record<string, string> = {
  Escrow: "bg-primary-green/10 text-primary-green border border-primary-green/20",
  Payment: "bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20",
  Project: "bg-secondary-blue/10 text-secondary-blue border border-secondary-blue/20",
  Agreement: "bg-accent-pink/10 text-accent-pink border border-accent-pink/20",
};

interface SupportTicketDetailViewProps {
  id: string;
}

export const SupportTicketDetailView: React.FC<SupportTicketDetailViewProps> = ({ id }) => {
  const { ticket, messages, isLoading, isLoadingMessages, sendMessage, assignTicket, updateStatus } =
    useAdminSupportDetail(id);
  const [activeTab, setActiveTab] = useState("Ticket Details");
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const tabs = ["Ticket Details", "Conversation", "Attachments", "Related Activity", "Audit Log"];

  const breadcrumbItems = [
    { label: "Admin Portal", href: "/admin/dashboard" },
    { label: "Support", href: "/admin/support" },
    { label: ticket?.ticketId || "Loading..." },
  ];

  if (isLoading || !ticket) {
    return (
      <div className="w-full flex flex-col gap-6">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-2 border-primary-green border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-text-muted mt-3">Loading ticket details...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-lg md:text-xl font-bold text-white tracking-tight line-clamp-1">
              {ticket.subject}
            </h1>
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0 ${STATUS_STYLES[ticket.status] || ""}`}>
              {ticket.status}
            </span>
          </div>
          <p className="text-xs text-text-muted">
            Submitted {formatDate(ticket.createdAt)} &middot;{" "}
            <span className={PRIORITY_STYLES[ticket.priority]}>{ticket.priority}</span> &middot; {ticket.category}
          </p>
        </div>
        <button
          onClick={() => setIsAssignModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-primary-green text-text-main text-xs font-bold hover:brightness-110 transition-all cursor-pointer shrink-0"
        >
          Assign to Me
        </button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "Ticket Details" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left Column — User Info + Ticket Metadata */}
            <div className="lg:col-span-2 space-y-5">
              {/* User Info Card */}
              <div className="rounded-2xl bg-card-bg-alt/30 border border-white/5 p-5">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">User Information</h3>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-green/10 border border-primary-green/20 flex items-center justify-center shrink-0">
                    <span className="text-lg font-bold text-primary-green">{ticket.userName.charAt(0)}</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h4 className="text-sm font-bold text-white">{ticket.userName}</h4>
                      <p className="text-xs text-text-muted">{ticket.userEmail}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <HiOutlineUser className="text-white/30" size={14} />
                        <span className="text-xs text-white/60">{ticket.userRole || "User"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiOutlineShieldCheck className="text-white/30" size={14} />
                        <span className="text-xs text-white/60">{ticket.accountType || "Individual"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ticket Metadata */}
              <div className="rounded-2xl bg-card-bg-alt/30 border border-white/5 p-5">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Ticket Information</h3>
                <div className="space-y-3">
                  {[
                    { icon: <HiOutlineTicket size={14} />, label: "Ticket ID", value: ticket.ticketId },
                    {
                      icon: <HiOutlineClock size={14} />,
                      label: "Status",
                      value: ticket.status,
                      valueClass: STATUS_STYLES[ticket.status],
                      isBadge: true,
                    },
                    { icon: <HiOutlineMail size={14} />, label: "Priority", value: ticket.priority, valueClass: PRIORITY_STYLES[ticket.priority] },
                    { icon: <HiOutlineDocumentText size={14} />, label: "Category", value: ticket.category },
                    { icon: <HiOutlineClock size={14} />, label: "Created", value: formatDate(ticket.createdAt) },
                    { icon: <HiOutlineClock size={14} />, label: "SLA Deadline", value: ticket.deadline ? formatDate(ticket.deadline) : "Not set" },
                    { icon: <HiOutlineUser size={14} />, label: "Assigned To", value: ticket.assignedAdmin || "Unassigned" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-b-0">
                      <div className="flex items-center gap-2 text-white/30">
                        {row.icon}
                        <span className="text-xs text-text-muted">{row.label}</span>
                      </div>
                      {row.isBadge ? (
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${row.valueClass || ""}`}>
                          {row.value}
                        </span>
                      ) : (
                        <span className={`text-xs font-semibold ${row.valueClass || "text-white"}`}>{row.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5">
              {/* Attachments */}
              <div className="rounded-2xl bg-card-bg-alt/30 border border-white/5 p-5">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Attachments</h3>
                {ticket.attachments.length === 0 ? (
                  <p className="text-xs text-white/40">No attachments uploaded.</p>
                ) : (
                  <div className="space-y-2">
                    {ticket.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                      >
                        <HiOutlinePaperClip className="text-primary-green shrink-0" size={16} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{att.fileName}</p>
                          <p className="text-[10px] text-text-muted">{att.fileType}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Related Platform Activity */}
              <div className="rounded-2xl bg-card-bg-alt/30 border border-white/5 p-5">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Related Platform Activity</h3>
                {ticket.relatedActivity.length === 0 ? (
                  <p className="text-xs text-white/40">No related activity linked.</p>
                ) : (
                  <div className="space-y-2">
                    {ticket.relatedActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ACTIVITY_TYPE_STYLES[activity.type] || ""}`}>
                            {activity.type}
                          </span>
                          <span className="text-xs font-semibold text-white">{activity.label}</span>
                        </div>
                        <span className="text-[10px] text-text-muted">{activity.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Conversation" && (
          <div className="rounded-2xl bg-card-bg-alt/30 border border-white/5 overflow-hidden">
            <SupportConversationTab
              messages={messages}
              isLoading={isLoadingMessages}
              onSendMessage={sendMessage}
            />
          </div>
        )}

        {activeTab === "Attachments" && (
          <div className="rounded-2xl bg-card-bg-alt/30 border border-white/5 p-6">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">All Attachments</h3>
            {ticket.attachments.length === 0 ? (
              <p className="text-xs text-white/40 text-center py-8">No attachments uploaded for this ticket.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ticket.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary-green/20 transition-colors cursor-pointer"
                  >
                    <HiOutlinePaperClip className="text-primary-green shrink-0" size={20} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{att.fileName}</p>
                      <p className="text-xs text-text-muted">{att.fileType} &middot; Uploaded {formatDate(att.uploadedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "Related Activity" && (
          <div className="rounded-2xl bg-card-bg-alt/30 border border-white/5 p-6">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Linked Platform Records</h3>
            {ticket.relatedActivity.length === 0 ? (
              <p className="text-xs text-white/40 text-center py-8">No related platform activity linked.</p>
            ) : (
              <div className="space-y-3">
                {ticket.relatedActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${ACTIVITY_TYPE_STYLES[activity.type] || ""}`}>
                        {activity.type}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{activity.label}</p>
                        <p className="text-xs text-text-muted">{activity.date}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg bg-primary-green/10 text-primary-green text-[10px] font-bold border border-primary-green/20">
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "Audit Log" && (
          <div className="rounded-2xl bg-card-bg-alt/30 border border-white/5 p-6">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-4">Ticket Audit Trail</h3>
            <p className="text-xs text-white/40 text-center py-8">
              Audit log entries will be available once backend integration is complete.
            </p>
          </div>
        )}
      </div>

      {/* Assign Modal */}
      <SupportAssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        ticket={ticket}
        onAssign={assignTicket}
        onUpdateStatus={updateStatus}
      />
    </div>
  );
};

export default SupportTicketDetailView;
