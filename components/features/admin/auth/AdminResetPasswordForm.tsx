"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { HiArrowLeft } from "react-icons/hi";

import { AdminAuthCard } from "@/components/ui/AdminAuthCard";
import authService from "@/services/auth.service";
import { getErrorMessage } from "@/lib/error-handler";

function AdminResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || searchParams.get("resetToken") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg("Invalid or missing reset token. Please request a new link.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      await authService.adminResetPassword({ resetToken: token, newPassword: password });
      setSuccessMsg("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } catch (err: unknown) {
      setErrorMsg(getErrorMessage(err) || "Failed to reset password. The link may have expired.");
      setIsSubmitting(false);
    }
  };

  const isFormValid = password.length >= 8 && password === confirmPassword;

  return (
    <AdminAuthCard
      icon={
        <div className="w-16 h-16 rounded-full bg-primary-green/10 border border-primary-green/20 flex items-center justify-center text-primary-green shadow-[0_0_20px_rgba(115,191,68,0.15)]">
          <IoLockClosedOutline size={28} />
        </div>
      }
      title="Reset Password"
      description="Enter your new password below to unlock your admin account"
      errorMsg={errorMsg}
      successMsg={successMsg}
    >
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        {/* New Password Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="new-password" className="text-white/60 text-xs font-semibold uppercase tracking-wider">
            New Password
          </label>
          <div className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3.5 focus-within:border-primary-green/60 focus-within:bg-white/6 transition-all group">
            <IoLockClosedOutline className="text-white/30 group-focus-within:text-primary-green/70 shrink-0" size={18} />
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-white text-sm placeholder:text-white/25 disabled:opacity-50"
              disabled={isSubmitting}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="shrink-0 text-white/30 hover:text-white/60 transition-colors p-0.5"
              tabIndex={-1}
            >
              {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm-password" className="text-white/60 text-xs font-semibold uppercase tracking-wider">
            Confirm Password
          </label>
          <div className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-3.5 focus-within:border-primary-green/60 focus-within:bg-white/6 transition-all group">
            <IoLockClosedOutline className="text-white/30 group-focus-within:text-primary-green/70 shrink-0" size={18} />
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-white text-sm placeholder:text-white/25 disabled:opacity-50"
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`w-full mt-2 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
            isFormValid && !isSubmitting
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
              <span>Resetting Password...</span>
            </>
          ) : (
            <span>Reset Password & Sign In</span>
          )}
        </button>

        {/* Back to Login */}
        <Link
          href="/admin"
          className="flex items-center justify-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-medium mt-2"
        >
          <HiArrowLeft size={16} />
          Back to Login
        </Link>
      </form>
    </AdminAuthCard>
  );
}

export const AdminResetPasswordForm: React.FC = () => {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0f10]">
          <div className="text-white/50 text-sm">Loading reset form...</div>
        </div>
      }
    >
      <AdminResetPasswordContent />
    </React.Suspense>
  );
};

export default AdminResetPasswordForm;
