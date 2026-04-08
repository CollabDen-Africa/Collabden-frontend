"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const { login, isLoading: authLoading, error: authError, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0;
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!isFormValid) return;

    try {
      await login({ email, password });
    } catch {
      // Silent catch, error is now managed globally by AuthContext via mutations
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Welcome Back!
        </h1>
        <p className="text-gray-500 font-medium text-base">
          Continue collaborating with creators who get you
        </p>
      </div>

      {authError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1">
          {authError}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-main block">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={authLoading}
            placeholder="johndoe@example.com"
            className="w-full px-4 py-3 rounded-full border border-border-muted focus:border-primary-green focus:ring-4 focus:ring-(--primary-green)/10 transition-all outline-none text-text-main placeholder:text-text-muted font-medium bg-white disabled:opacity-50"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-2 relative">
          <label className="text-sm font-semibold text-text-main block">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={authLoading}
              placeholder="............"
              className="w-full px-4 py-3 rounded-full border border-border-muted focus:border-primary-green focus:ring-4 focus:ring-(--primary-green)/10 transition-all outline-none text-text-main placeholder:text-text-muted font-medium bg-white pr-12 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          <div className="flex justify-start">
            <Link
              href={ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-sm font-semibold hover:underline text-primary-green"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {/* Log In Button */}
        <button
          type="submit"
          disabled={!isFormValid || authLoading}
          className={`w-full py-4 text-white font-bold rounded-full transition-all cursor-pointer disabled:cursor-not-allowed flex justify-center items-center gap-2
            ${isFormValid && !authLoading
              ? "bg-primary-green shadow-btn-primary hover:shadow-btn-hover hover:-translate-y-1 hover:brightness-90 active:scale-[0.98]"
              : "bg-primary-green/60 shadow-none"
            }`}
        >
          {authLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Log In"
          )}
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-2">
          <div className="grow border-t border-border-light"></div>
          <span className="shrink mx-4 text-xs font-medium text-text-main uppercase tracking-widest">
            Or continue with
          </span>
          <div className="grow border-t border-border-light"></div>
        </div>

        {/* Social Login*/}
        <div className="space-y-4">
          <button
            type="button"
            className="w-full py-3.5 flex items-center justify-center gap-3 rounded-full border border-border-light bg-white hover:bg-gray-50 transition-all cursor-pointer font-semibold text-text-main shadow-sm hover:shadow-md"
          >
            <FaGoogle className="text-red-500" size={18} />
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-2">
          <p className="text-base font-semibold text-text-main">
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.AUTH.SIGNUP}
              className="font-bold hover:underline text-primary-green"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
