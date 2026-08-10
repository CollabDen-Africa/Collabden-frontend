"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { IoLockClosedOutline } from "react-icons/io5";
import { HiExclamation, HiArrowLeft } from "react-icons/hi";

import { AdminAuthCard } from "@/components/ui/AdminAuthCard";

export const AdminAccountLockedView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawError = searchParams.get("error");

  // Timer logic for 15 minutes lockout (900 seconds)
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <AdminAuthCard
      icon={
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(255,4,4,0.15)]">
          <IoLockClosedOutline size={28} />
        </div>
      }
      title="Account Locked"
      description={
        <>
          Your account has been temporarily locked<br />
          due to multiple failed login attempts
        </>
      }
    >
      <div className="w-full flex flex-col gap-6">
        {/* Red Alert Box */}
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
            <HiExclamation size={16} />
          </div>
          <div className="flex flex-col gap-1 text-xs leading-relaxed">
            <span className="font-semibold text-red-400">
              5 failed attempts detected.
            </span>
            <span className="text-red-300/80">
              {rawError || `Your account will automatically unlock in ${formatTime(timeLeft)}. This event has been recorded in the audit log.`}
            </span>
          </div>
        </div>

        {/* Failed attempts progress indicator */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-white/40">Failed attempts</span>
            <span className="text-red-400 font-bold">5 / 5</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full bg-red-500 rounded-full w-full" />
          </div>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => router.push("/admin/forgot-password")}
          className="w-full py-3.5 rounded-full font-semibold text-sm bg-[#72c043] hover:bg-[#84d653] text-[#0d0f10] shadow-[0_8px_24px_rgba(115,191,68,0.25)] transition-all duration-300 cursor-pointer"
        >
          Reset Password to Unlock
        </button>

        {/* Secondary Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-medium"
          >
            <HiArrowLeft size={16} />
            Back to Login
          </Link>

          <a
            href="mailto:support@collabden.com"
            className="text-white/40 hover:text-white transition-colors text-xs font-medium"
          >
            Contact Super Admin
          </a>
        </div>
      </div>
    </AdminAuthCard>
  );
};

export default AdminAccountLockedView;
