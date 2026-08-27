"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Tabs } from "@/components/ui/Tabs";
import { Table, Column } from "@/components/ui/Table";
import { useAdminSubscriptionDetail } from "@/hooks/admin/useAdminSubscriptionDetail";
import {
  HiOutlineDocumentDownload,
  HiOutlineArrowLeft,
  HiOutlineUser,
  HiOutlineCreditCard,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineCheck,
} from "react-icons/hi";

interface AdminSubscriptionDetailViewProps {
  id: string;
}

export const AdminSubscriptionDetailView: React.FC<AdminSubscriptionDetailViewProps> = ({ id }) => {
  const router = useRouter();
  const { detail, isLoading } = useAdminSubscriptionDetail(id);
  const [activeTab, setActiveTab] = useState("Overview");

  const breadcrumbItems = [
    { label: "Admin Portal", href: "/admin/dashboard" },
    { label: "Subscriptions", href: "/admin/subscriptions" },
    { label: detail?.subscriptionId || id },
  ];

  const tabs = ["Overview", "Billing History", "Activity Log", "Related Issues"];

  if (isLoading || !detail) {
    return (
      <div className="w-full flex flex-col gap-6 pb-12">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-2 border-primary-green border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-text-muted mt-3">Loading subscription details...</p>
        </div>
      </div>
    );
  }

  const billingColumns: Column<any>[] = [
    {
      key: "date",
      label: "DATE",
      render: (row) => <span className="text-xs text-[#AEB2B4]">{row.date}</span>,
    },
    {
      key: "amount",
      label: "AMOUNT",
      render: (row) => (
        <span className="text-xs font-bold text-white font-mono">
          ₦{row.amount?.toLocaleString()}
        </span>
      ),
    },
    {
      key: "method",
      label: "METHOD",
      render: (row) => <span className="text-xs text-[#AEB2B4]">{row.method}</span>,
    },
    {
      key: "reference",
      label: "REFERENCE",
      render: (row) => <span className="text-xs font-mono text-[#73BF44]">{row.reference}</span>,
    },
    {
      key: "status",
      label: "STATUS",
      render: (row) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.status === "Paid" ? "bg-[#73BF44]/10 text-[#73BF44] border border-[#73BF44]/20" : "bg-[#FF0404]/10 text-[#FF0404] border border-[#FF0404]/20"
          }`}>
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 pb-12 animate-in fade-in duration-300">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Back Button */}
      <div>
        <button
          onClick={() => router.push("/admin/subscriptions")}
          className="text-xs font-semibold text-[#73BF44] hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <HiOutlineArrowLeft size={14} /> Back to Subscriptions List
        </button>
      </div>

      {/* Subscription Summary Header Card */}
      <div className="p-6 rounded-2xl bg-card-bg-alt/30 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#73BF44]/10 border border-[#73BF44]/20 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-[#73BF44]">{detail.userName.charAt(0)}</span>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold text-white font-sans">{detail.userName} — {detail.plan} Subscription</h1>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#73BF44]/10 text-[#73BF44] border border-[#73BF44]/20">
                {detail.status}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#6495ED]/10 text-[#6495ED] border border-[#6495ED]/20">
                {detail.plan}
              </span>
            </div>
            <p className="text-xs text-[#AEB2B4] mt-1 font-mono">
              {detail.subscriptionId} &middot; Started {detail.startDate} &middot; Renewal {detail.renewalDate} &middot; <strong className="text-white">₦{detail.amount?.toLocaleString()} / month</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => alert("Invoice preview & PDF generation triggered.")}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
        >
          <HiOutlineDocumentDownload size={16} /> View Invoice
        </button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: User Info + Current Plan */}
          <div className="lg:col-span-1 space-y-6">
            {/* USER INFORMATION */}
            <div className="p-6 rounded-2xl bg-card-bg-alt/30 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-[#AEB2B4] uppercase tracking-wider font-sans">User Information</h3>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#73BF44]/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-[#73BF44]">{detail.userName.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">{detail.userName}</h4>
                  <p className="text-xs text-[#AEB2B4]">{detail.userEmail} &middot; {detail.userId}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-[#AEB2B4] flex items-center gap-1.5"><HiOutlineUser size={14} /> Account Type</span>
                  <span className="text-white font-medium">{detail.accountType}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-[#AEB2B4] flex items-center gap-1.5"><HiOutlineClock size={14} /> Member Since</span>
                  <span className="text-white font-medium">{detail.memberSince}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-[#AEB2B4] flex items-center gap-1.5"><HiOutlineShieldCheck size={14} /> Email Verified</span>
                  <span className="text-[#73BF44] font-medium">{detail.emailVerified ? "Yes" : "No"}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-[#AEB2B4] flex items-center gap-1.5"><HiOutlineCreditCard size={14} /> Active Subscriptions</span>
                  <span className="text-white font-medium">{detail.activeSubscriptionsCount}</span>
                </div>
              </div>
            </div>

            {/* CURRENT PLAN — PRO */}
            <div className="p-6 rounded-2xl bg-card-bg-alt/30 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-[#AEB2B4] uppercase tracking-wider font-sans">Current Plan — {detail.plan}</h3>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold text-white font-sans">₦{detail.amount?.toLocaleString()}</span>
                <span className="text-xs text-[#AEB2B4]">/ {detail.billingCycle.toLowerCase()}</span>
              </div>

              <div className="space-y-2 text-xs py-2 border-t border-b border-white/5">
                <div className="flex justify-between py-1"><span className="text-[#AEB2B4]">Start Date</span><span className="text-white">{detail.startDate}</span></div>
                <div className="flex justify-between py-1"><span className="text-[#AEB2B4]">Renewal Date</span><span className="text-[#73BF44] font-semibold">{detail.renewalDate}</span></div>
                <div className="flex justify-between py-1"><span className="text-[#AEB2B4]">Billing Cycle</span><span className="text-white">{detail.billingCycle}</span></div>
                <div className="flex justify-between py-1"><span className="text-[#AEB2B4]">Payment Method</span><span className="text-white">{detail.paymentMethod}</span></div>
                <div className="flex justify-between py-1"><span className="text-[#AEB2B4]">Status</span><span className="text-[#73BF44] font-bold">{detail.status}</span></div>
              </div>

              {/* Plan Features List */}
              <div className="space-y-2 pt-1">
                <h4 className="text-[11px] font-bold text-[#AEB2B4] uppercase tracking-wider">Plan Features</h4>
                {detail.planFeatures.map((ft, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-white/90">
                    <HiOutlineCheck className="text-[#73BF44] shrink-0" size={14} />
                    <span>{ft}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Billing History Table + Activity Stream */}
          <div className="lg:col-span-2 space-y-6">
            {/* Billing History Table */}
            <div className="p-6 rounded-2xl bg-card-bg-alt/30 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#AEB2B4] uppercase tracking-wider font-sans">Billing History</h3>
                <span className="text-[10px] text-[#AEB2B4] font-mono">Read-only</span>
              </div>

              <Table columns={billingColumns} data={detail.billingHistory} />

              <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                <button className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                  <HiOutlineDocumentDownload size={14} /> Download Invoice
                </button>
                <button className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-semibold cursor-pointer">
                  View Receipt
                </button>
              </div>
            </div>

            {/* SUBSCRIPTION ACTIVITY Timeline */}
            <div className="p-6 rounded-2xl bg-card-bg-alt/30 border border-white/10 space-y-4">
              <h3 className="text-xs font-bold text-[#AEB2B4] uppercase tracking-wider font-sans">Subscription Activity</h3>
              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                {detail.activityStream.map((act) => (
                  <div key={act.id} className="flex items-start gap-4 relative pl-7">
                    <div className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2 ${act.type === "failed" ? "bg-[#FF0404] border-[#FF0404]" : "bg-[#73BF44] border-[#73BF44]"
                      }`} />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-white">{act.title}</p>
                      <p className="text-[10px] text-[#AEB2B4] mt-0.5">{act.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab !== "Overview" && (
        <div className="p-12 rounded-2xl bg-card-bg-alt/30 border border-white/10 text-center text-xs text-[#AEB2B4]">
          {activeTab} tab details loaded for subscription {detail.subscriptionId}.
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptionDetailView;
