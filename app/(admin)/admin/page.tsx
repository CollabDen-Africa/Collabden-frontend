"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { HiOutlineShieldCheck } from "react-icons/hi";

import { useAuth } from "@/context/AuthContext";
import { loginSchema, LoginInput } from "@/lib/validations/auth.schema";
import { getErrorMessage } from "@/lib/error-handler";

export default function AdminLoginPage() {
  const router = useRouter();
  const {
    user,
    isLoading: isAuthLoading,
    adminLogin,
    isAuthenticated,
    error: authError,
    clearError,
    logout,
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

  // Auto-redirect: if already authenticated as admin, send to dashboard
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
      console.log("Login Response:", response);
      if (response && response?.requires2FA) {
        router.push(
          `/admin/verify?adminId=${response?.adminId}&email=${response?.email}`
        );
        return;
      }
    } catch (error: unknown) {
      setLoginError(
        getErrorMessage(error) || "Invalid credentials. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  // Watch for global authentication errors
  useEffect(() => {
    if (authError) {
      setLoginError(authError);
      setIsSubmitting(false);
    }
  }, [authError]);

  // Watch for post-login state: user logged in but NOT admin
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && user && !user.isAdmin) {
      setLoginError("Access denied. This portal is restricted to administrators only.");
      setIsSubmitting(false);
    }
  }, [isAuthLoading, isAuthenticated, user]);

  // While AuthContext is initializing, show the loading spinner
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

  // If already authenticated as admin, show redirect state (useEffect handles navigation)
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

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0f10] relative overflow-hidden px-4 py-8">
      {/* Subtle ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(115, 191, 68, 0.04) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-[440px] flex flex-col items-center"
      >
        {/* Logo & Branding */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="relative">
              <Image
                src="/Green-logo.png"
                alt="CollabDen Logo"
                width={140}
                height={140}
                className="h-9 w-auto object-contain"
                priority
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HiOutlineShieldCheck className="text-primary-green" size={18} />
            <span className="text-primary-green font-semibold text-xs uppercase tracking-[0.2em]">
              Admin Portal
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1.5 tracking-tight">
            Welcome back
          </h1>
          <p className="text-white/45 text-sm">
            Sign in to access the admin console
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          variants={itemVariants}
          className="w-full rounded-2xl border border-white/[0.07] p-6 md:p-8"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" id="admin-login-form">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="admin-email" className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                Email
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
              <label htmlFor="admin-password" className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                Password
              </label>
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

            {/* Server Error */}
            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="flex items-start gap-2.5 bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                <p className="text-red-400 text-sm font-medium leading-relaxed">{loginError}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!isValid || isSubmitting}
              whileHover={isValid && !isSubmitting ? { scale: 1.01 } : {}}
              whileTap={isValid && !isSubmitting ? { scale: 0.98 } : {}}
              className="w-full mt-1 py-3.5 rounded-xl font-semibold text-sm text-white transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: isValid && !isSubmitting
                  ? "linear-gradient(135deg, #73BF44 0%, #5fa836 100%)"
                  : "rgba(115, 191, 68, 0.15)",
                boxShadow: isValid && !isSubmitting
                  ? "0 8px 24px rgba(115, 191, 68, 0.2), 0 2px 8px rgba(115, 191, 68, 0.1)"
                  : "none",
              }}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.p variants={itemVariants} className="text-white/20 text-xs mt-6 text-center">
          Restricted access &middot; Authorized personnel only
        </motion.p>
      </motion.div>
    </div>
  );
}
