"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { IoMailOutline } from "react-icons/io5";
import { HiArrowLeft, HiInformationCircle } from "react-icons/hi";

import { AdminAuthCard } from "@/components/ui/AdminAuthCard";
import authService from "@/services/auth.service";
import { getErrorMessage } from "@/lib/error-handler";

export const AdminForgotPasswordForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setErrorMsg("");
    setIsSubmitting(true);

    try {
      await authService.adminForgotPassword(email.trim());
      router.push(`/admin/reset-link-sent?email=${encodeURIComponent(email.trim())}`);
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err) || "Failed to send reset link. Please check your email.");
      setIsSubmitting(false);
    }
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  return (
    <AdminAuthCard
      icon={
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-medium self-start mb-2"
          >
            <HiArrowLeft size={16} />
            Back to Login
          </Link>
          <div className="w-16 h-16 rounded-full bg-primary-green/10 border border-primary-green/20 flex items-center justify-center text-primary-green shadow-[0_0_20px_rgba(115,191,68,0.15)]">
            <IoMailOutline size={28} />
          </div>
        </div>
      }
      title="Forgot Password?"
      description={
        <>
          Enter your admin email and we&apos;ll send you a<br />
          secure reset link
        </>
      }
      errorMsg={errorMsg}
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        {/* Email Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="forgot-email" className="text-white/60 text-xs font-semibold uppercase tracking-wider">
            Email Address
          </label>
          <div className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3.5 focus-within:border-primary-green/60 focus-within:bg-white/6 transition-all group">
            <IoMailOutline className="text-white/30 group-focus-within:text-primary-green/70 shrink-0" size={18} />
            <input
              id="forgot-email"
              type="email"
              placeholder="admin@collabden.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-white text-sm placeholder:text-white/25 disabled:opacity-50"
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValidEmail || isSubmitting}
          className={`w-full mt-2 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
            isValidEmail && !isSubmitting
              ? "bg-[#72c043] hover:bg-[#84d653] text-[#0d0f10] shadow-[0_8px_24px_rgba(115,191,68,0.25)]"
              : "bg-white/5 text-white/30 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="w-4 h-4 border-2 border-[#0d0f10]/30 border-t-[#0d0f10] rounded-full"
              />
              <span>Sending Link...</span>
            </>
          ) : (
            <span>Send Reset Link</span>
          )}
        </button>

        {/* Info Box */}
        <div className="p-4 rounded-xl bg-blue-500/8 border border-blue-500/20 flex items-start gap-3 mt-2">
          <HiInformationCircle className="text-blue-400 shrink-0 mt-0.5" size={18} />
          <p className="text-blue-300/80 text-xs leading-relaxed">
            For security, reset links expire after <span className="font-semibold text-blue-300">15 minutes</span>. All active admin sessions will be invalidated after a password reset.
          </p>
        </div>
      </form>
    </AdminAuthCard>
  );
};

export default AdminForgotPasswordForm;
