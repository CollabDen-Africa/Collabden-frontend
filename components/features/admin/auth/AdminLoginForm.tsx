"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

import { useAuth } from "@/context/AuthContext";
import { loginSchema, LoginInput } from "@/lib/validations/auth.schema";
import { getErrorMessage } from "@/lib/error-handler";
import { AdminAuthCard } from "@/components/ui/AdminAuthCard";

export const AdminLoginForm: React.FC = () => {
  const router = useRouter();
  const {
    user,
    isLoading: isAuthLoading,
    adminLogin,
    isAuthenticated,
    error: authError,
    clearError,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && user?.isAdmin) {
      router.replace("/admin/dashboard");
    }
  }, [isAuthLoading, isAuthenticated, user, router]);

  const onSubmit = async (data: LoginInput) => {
    setLoginError("");
    setIsSubmitting(true);
    clearError();

    try {
      const response = await adminLogin(data);
      if (response && response?.requires2FA) {
        router.push(
          `/admin/verify?adminId=${response?.adminId}&email=${response?.email}`
        );
        return;
      }
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error) || "Invalid credentials. Please try again.";
      if (errorMsg.toLowerCase().includes("locked")) {
        router.push(`/admin/account-locked?error=${encodeURIComponent(errorMsg)}`);
        return;
      }
      setLoginError(errorMsg);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (authError) {
      setLoginError(authError);
      setIsSubmitting(false);
    }
  }, [authError]);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && user && !user.isAdmin) {
      setLoginError("Access denied. This portal is restricted to administrators only.");
      setIsSubmitting(false);
    }
  }, [isAuthLoading, isAuthenticated, user]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0f10]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-green border-t-transparent rounded-full animate-spin" />
          <span className="text-white/60 text-sm font-medium tracking-wide">Syncing Console...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user?.isAdmin) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0f10]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary-green border-t-transparent rounded-full animate-spin" />
          <span className="text-white/60 text-sm font-medium tracking-wide">Entering Dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthCard
      icon={
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/Green-logo.png"
            alt="CollabDen Logo"
            width={140}
            height={140}
            className="h-9 w-auto object-contain"
            priority
          />
          <div className="px-3 py-1 rounded-full border border-primary-green/30 bg-primary-green/10 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-green animate-pulse" />
            <span className="text-primary-green font-semibold text-xs uppercase tracking-wider">
              Admin Access Only
            </span>
          </div>
        </div>
      }
      title="Welcome back"
      description="Sign in to access the admin dashboard"
      errorMsg={loginError}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5" id="admin-login-form">
        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="admin-email" className="text-white/60 text-xs font-semibold uppercase tracking-wider">
            Email Address
          </label>
          <div
            className={`flex items-center gap-3 bg-white/4 border rounded-xl px-4 py-3.5 transition-all duration-200 group ${
              errors.email
                ? "border-red-500/50 focus-within:border-red-500"
                : "border-white/8 focus-within:border-primary-green/60 focus-within:bg-white/6"
            }`}
          >
            <IoMailOutline
              className={`shrink-0 transition-colors ${
                errors.email ? "text-red-400" : "text-white/30 group-focus-within:text-primary-green/70"
              }`}
              size={18}
            />
            <input
              id="admin-email"
              type="email"
              placeholder="admin@collabden.com"
              autoComplete="email"
              className="w-full bg-transparent border-none outline-none text-white text-sm placeholder:text-white/25 disabled:opacity-50"
              disabled={isSubmitting}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs mt-0.5 ml-1 font-medium"
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="admin-password" className="text-white/60 text-xs font-semibold uppercase tracking-wider">
              Password
            </label>
            <Link
              href="/admin/forgot-password"
              className="text-primary-green hover:text-[#84d653] text-xs font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div
            className={`flex items-center gap-3 bg-white/4 border rounded-xl px-4 py-3.5 transition-all duration-200 group ${
              errors.password
                ? "border-red-500/50 focus-within:border-red-500"
                : "border-white/8 focus-within:border-primary-green/60 focus-within:bg-white/6"
            }`}
          >
            <IoLockClosedOutline
              className={`shrink-0 transition-colors ${
                errors.password ? "text-red-400" : "text-white/30 group-focus-within:text-primary-green/70"
              }`}
              size={18}
            />
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full bg-transparent border-none outline-none text-white text-sm placeholder:text-white/25 disabled:opacity-50"
              disabled={isSubmitting}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="shrink-0 text-white/30 hover:text-white/60 transition-colors p-0.5"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
            </button>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs mt-0.5 ml-1 font-medium"
            >
              {errors.password.message}
            </motion.p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`w-full mt-2 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer ${
            isValid && !isSubmitting
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
              <span>Signing in...</span>
            </>
          ) : (
            <span>Sign in to Admin Portal</span>
          )}
        </button>
      </form>
    </AdminAuthCard>
  );
};

export default AdminLoginForm;
