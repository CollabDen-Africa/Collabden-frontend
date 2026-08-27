"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Table, Column } from "@/components/ui/Table";
import { SubscriptionsSubNav } from "./SubscriptionsSubNav";
import { useAdminSubscriptionPlans } from "@/hooks/admin/useAdminSubscriptionPlans";
import {
  HiOutlineShieldCheck,
  HiOutlineCheck,
  HiOutlinePencil,
  HiOutlineLockClosed,
} from "react-icons/hi";

export const AdminSubscriptionPlansView: React.FC = () => {
  const { plans, changeLogs, isLoading } = useAdminSubscriptionPlans();
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  const breadcrumbItems = [
    { label: "Admin Portal", href: "/admin/dashboard" },
    { label: "Subscriptions", href: "/admin/subscriptions" },
    { label: "Subscription Plans" },
  ];

  const logColumns: Column<any>[] = [
    {
      key: "date",
      label: "DATE",
      render: (row) => <span className="text-xs text-[#AEB2B4] font-mono">{row.date}</span>,
    },
    {
      key: "changedBy",
      label: "CHANGED BY",
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#73BF44]/10 text-[#73BF44] border border-[#73BF44]/20">
          {row.changedBy}
        </span>
      ),
    },
    {
      key: "details",
      label: "DETAILS",
      render: (row) => <span className="text-xs text-white font-medium">{row.details}</span>,
    },
    {
      key: "action",
      label: "ACTION",
      render: (row) => (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6495ED]/10 text-[#6495ED] border border-[#6495ED]/20">
          {row.action}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6 pb-12 animate-in fade-in duration-300">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-sans">Subscription Plans</h1>
          <p className="text-sm text-[#AEB2B4] mt-1">
            Manage plan features, pricing, limits, and view plan distribution across the platform.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-[#73BF44]/10 border border-[#73BF44]/20 text-[#73BF44] text-xs font-bold flex items-center gap-2">
          <HiOutlineShieldCheck size={18} /> Super Admin Permission
        </div>
      </div>

      {/* Super Admin Notice Banner */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#6495ED]/10 border border-[#6495ED]/20 text-[#6495ED] text-xs font-semibold">
        <HiOutlineLockClosed size={18} className="shrink-0" />
        <span>
          <strong>Super Admin Only</strong> — Plan pricing and feature limits require Super Admin role permissions. Standard Admins can view subscriber distribution.
        </span>
      </div>

      {/* Reusable Sub-Nav */}
      <SubscriptionsSubNav />

      {/* 4 Plan Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#73BF44] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#AEB2B4] mt-3">Loading subscription plans...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`p-6 rounded-2xl bg-card-bg-alt/30 border transition-all flex flex-col justify-between ${
                p.tier === "Pro" ? "border-[#73BF44]/40 shadow-lg shadow-[#73BF44]/5" : "border-white/10"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    p.tier === "Pro" ? "bg-[#73BF44]/20 text-[#73BF44] border border-[#73BF44]/30" : "bg-white/5 text-white border border-white/10"
                  }`}>
                    {p.tier}
                  </span>
                  <span className="text-[11px] text-[#AEB2B4] font-semibold">{p.subscribersCount.toLocaleString()} subscribers</span>
                </div>

                <div>
                  <div className="text-2xl font-bold text-white font-sans font-mono">
                    ₦{p.priceMonthly.toLocaleString()}
                    <span className="text-xs text-[#AEB2B4] font-normal"> / month</span>
                  </div>
                  {p.priceAnnual > 0 && (
                    <span className="text-[10px] text-[#73BF44] font-medium">₦{p.priceAnnual.toLocaleString()} billed annually</span>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-2 pt-3 border-t border-white/5">
                  <span className="text-[10px] font-bold text-[#AEB2B4] uppercase tracking-wider">Features Included</span>
                  {p.features.map((ft, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-white/90">
                      <HiOutlineCheck className="text-[#73BF44] shrink-0 mt-0.5" size={14} />
                      <span>{ft}</span>
                    </div>
                  ))}
                </div>

                {/* Resource Limits */}
                <div className="p-3 rounded-xl bg-white/2 border border-white/5 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold text-[#AEB2B4] uppercase tracking-wider">Resource Limits</span>
                  <div className="flex justify-between text-[#AEB2B4]"><span className="text-white font-medium">Collabs:</span> {p.limits.collaborations}</div>
                  <div className="flex justify-between text-[#AEB2B4]"><span className="text-white font-medium">Storage:</span> {p.limits.storage}</div>
                  <div className="flex justify-between text-[#AEB2B4]"><span className="text-white font-medium">Analytics:</span> {p.limits.analytics}</div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <button
                  onClick={() => setEditingPlanId(p.id)}
                  className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <HiOutlinePencil size={14} /> Edit Plan Limits
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plan Edit Modal */}
      {editingPlanId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#505050] border border-white/10 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 font-sans">
              <HiOutlinePencil className="text-[#73BF44]" size={20} /> Edit Plan Pricing & Limits
            </h3>
            <p className="text-xs text-[#AEB2B4]">
              Super Admin authorization required to modify monthly price or cloud storage thresholds.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#AEB2B4] block mb-1">Monthly Price (NGN)</label>
                <input type="number" defaultValue={4800} className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#73BF44]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#AEB2B4] block mb-1">Storage Limit (GB)</label>
                <input type="text" defaultValue="50 GB" className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#73BF44]" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditingPlanId(null)} className="px-4 py-2 rounded-xl bg-white/5 text-xs text-white/70 font-semibold cursor-pointer">Cancel</button>
              <button onClick={() => { setEditingPlanId(null); alert("Plan updated successfully!"); }} className="px-4 py-2 rounded-xl bg-[#73BF44] text-[#505050] text-xs font-bold cursor-pointer">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Change Log Table */}
      <div className="p-6 rounded-2xl bg-card-bg-alt/30 border border-white/10 space-y-4 mt-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-sans">Plan Change Log & Policy Audit</h3>
        <Table columns={logColumns} data={changeLogs} />
      </div>
    </div>
  );
};

export default AdminSubscriptionPlansView;
