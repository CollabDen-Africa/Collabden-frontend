"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { HiCheckCircle, HiArrowLeft } from "react-icons/hi";

import { AdminAuthCard } from "@/components/ui/AdminAuthCard";

function AdminResetLinkSentContent() {
  const searchParams = useSearchParams();
  const rawEmail = searchParams.get("email");
  const email = rawEmail || "admin@collabden.com";

  return (
    <AdminAuthCard
      icon={
        <div className="w-16 h-16 rounded-full bg-primary-green/10 border border-primary-green/20 flex items-center justify-center text-primary-green shadow-[0_0_20px_rgba(115,191,68,0.15)]">
          <HiCheckCircle size={32} />
        </div>
      }
      title="Reset Link Sent"
      description={
        <>
          A secure password reset link has been sent to:<br />
          <span className="text-white font-medium">{email}</span>
        </>
      }
    >
      <div className="w-full flex flex-col gap-6">
        {/* Checklist Container */}
        <div className="p-5 rounded-2xl bg-white/4 border border-white/8 flex flex-col gap-3.5">
          <div className="flex items-center gap-3 text-xs text-white/80 font-medium">
            <span className="w-5 h-5 rounded-full bg-primary-green/20 text-primary-green flex items-center justify-center shrink-0">
              ✓
            </span>
            <span>Check your inbox (and spam folder)</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-white/80 font-medium">
            <span className="w-5 h-5 rounded-full bg-primary-green/20 text-primary-green flex items-center justify-center shrink-0">
              ✓
            </span>
            <span>Link expires in 15 minutes</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-white/80 font-medium">
            <span className="w-5 h-5 rounded-full bg-primary-green/20 text-primary-green flex items-center justify-center shrink-0">
              ✓
            </span>
            <span>All sessions will be invalidated after reset</span>
          </div>
        </div>

        {/* Back to Login */}
        <Link
          href="/admin"
          className="w-full py-3.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all font-semibold text-sm flex items-center justify-center gap-2 text-white"
        >
          <HiArrowLeft size={16} />
          <span>Back to Login</span>
        </Link>
      </div>
    </AdminAuthCard>
  );
}

export const AdminResetLinkSentView: React.FC = () => {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0f10]">
          <div className="text-white/50 text-sm">Loading details...</div>
        </div>
      }
    >
      <AdminResetLinkSentContent />
    </React.Suspense>
  );
};

export default AdminResetLinkSentView;
