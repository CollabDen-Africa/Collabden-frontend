"use client";

import React, { useState } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getPaymentDetail, PaymentTransactionItem } from "@/services/admin/payments.service";
import {
  HiOutlineCreditCard,
  HiCheckCircle,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineExclamationCircle,
  HiOutlineRefresh,
} from "react-icons/hi";
import Link from "next/link";

interface PaymentDetailViewProps {
  id: string;
}

export const PaymentDetailView: React.FC<PaymentDetailViewProps> = ({ id }) => {
  const [detail, setDetail] = useState<PaymentTransactionItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    getPaymentDetail(id).then((res) => {
      setDetail(res);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) return <div className="p-12 text-center text-white/40 text-sm">Loading transaction details...</div>;
  if (!detail) return <div className="p-12 text-center text-accent-red text-sm">Transaction not found.</div>;

  const handleAction = (action: string) => {
    alert(`Action triggered: ${action} for ${detail.transactionId}`);
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-12 text-white animate-in fade-in duration-300">
      {/* Breadcrumb Trail */}
      <Breadcrumbs
        items={[
          { label: "Admin Portal" },
          { label: "Payments", href: "/admin/payments" },
          { label: detail.transactionId },
        ]}
      />

      {/* Main Outer Container */}
      <div className="w-full bg-[#121415] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
        {/* Header Section Banner */}
        <div className="p-6 md:p-8 bg-card-bg-alt/40 border-b border-white/5 flex flex-col gap-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-card-bg border-2 border-primary-green flex items-center justify-center text-primary-green shrink-0 shadow-lg">
                <HiOutlineCreditCard size={30} />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold text-white tracking-tight font-sans">
                    {detail.transactionId}
                  </h2>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-blue/20 text-secondary-blue border border-primary-blue/30">
                    {detail.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                  <span className="font-mono text-white font-bold text-base">
                    ${detail.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {detail.currency}
                  </span>
                  <span>•</span>
                  <span className="text-white/80">Gateway: {detail.gateway}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => handleAction("Release Escrow")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-green text-text-main text-xs font-bold hover:brightness-110 transition-all cursor-pointer shadow-lg"
              >
                <HiCheckCircle size={16} />
                Release Escrow
              </button>
              <button
                onClick={() => handleAction("Refund Payer")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
              >
                <HiOutlineRefresh size={16} />
                Refund Payer
              </button>
              <button
                onClick={() => handleAction("Flag Transaction")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent-soft-red text-accent-red hover:bg-accent-red/20 text-xs font-semibold border border-accent-red/30 transition-all cursor-pointer"
              >
                <HiOutlineExclamationCircle size={16} />
                Flag Transaction
              </button>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="pt-4 border-t border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Escrow Status Timeline</h4>
            <div className="flex items-center justify-between max-w-2xl text-xs">
              <div className="flex items-center gap-2 text-accent-green-success font-semibold">
                <HiCheckCircle size={18} /> Initiated
              </div>
              <div className="h-0.5 flex-1 bg-accent-green-success mx-3" />
              <div className="flex items-center gap-2 text-accent-green-success font-semibold">
                <HiCheckCircle size={18} /> Funded
              </div>
              <div className="h-0.5 flex-1 bg-primary-blue mx-3" />
              <div className="flex items-center gap-2 text-secondary-blue font-semibold">
                <HiOutlineClock size={18} /> In Review
              </div>
              <div className="h-0.5 flex-1 bg-white/10 mx-3" />
              <div className="flex items-center gap-2 text-white/40 font-semibold">
                Released
              </div>
            </div>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Transaction Breakdown & Payer Info */}
          <div className="flex flex-col gap-6">
            <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-white/5 pb-3">
                Transaction Breakdown
              </h3>
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-text-muted">Gross Amount</span>
                  <span className="font-mono text-white font-semibold">${detail.amount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-text-muted">Platform Fee (10%)</span>
                  <span className="font-mono text-accent-yellow font-semibold">-${(detail.amount * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between py-1 pt-2">
                  <span className="text-white font-bold">Net Payout Amount</span>
                  <span className="font-mono text-primary-green font-bold text-sm">${(detail.amount * 0.9).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-white/5 pb-3">
                Payer / Client Details
              </h3>
              <div className="flex items-center gap-4 p-3.5 rounded-xl bg-white/2 border border-white/5">
                <div className="w-12 h-12 rounded-full bg-card-bg border border-primary-green flex items-center justify-center text-white font-bold text-sm uppercase shrink-0">
                  {detail.payerName[0]}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">{detail.payerName}</span>
                  <span className="text-xs text-text-muted">{detail.payerEmail}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Associated Project & Escrow Release Terms */}
          <div className="flex flex-col gap-6">
            <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-white/5 pb-3">
                Associated Project
              </h3>
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/2 border border-white/5">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-white">Project Collaboration Track</span>
                  <span className="text-xs text-text-muted">Afrobeats • Master Track Escrow</span>
                </div>
                <Link
                  href="/admin/projects"
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
                >
                  View Project
                </Link>
              </div>
            </div>

            <div className="bg-card-bg-alt/30 border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted border-b border-white/5 pb-3">
                Escrow Verification Status
              </h3>
              <div className="flex flex-col gap-3 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-text-muted">Agreement Status</span>
                  <span className="text-accent-green-success font-semibold inline-flex items-center gap-1">
                    <HiOutlineShieldCheck size={16} /> Signed & Verified
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-white/5">
                  <span className="text-text-muted">Milestone Verification</span>
                  <span className="text-secondary-blue font-semibold">Pending Admin Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
