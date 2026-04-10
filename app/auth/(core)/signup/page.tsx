"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";


export default function SignupPage() {
  const { signup, isLoading: authLoading, error: authError, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [role, setRole] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const isFormValid = useMemo(() => {
    return (
      email.trim().length > 0 &&
      password.trim().length >= 8 &&
      agreedToTerms
    );
  }, [email, password, agreedToTerms]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!isFormValid) return;

    try {
      await signup({ email, password });
    } catch {
      // Error is managed globally by AuthContext via mutations
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl mb-4 font-bold text-gray-900 tracking-tight">
          Create an account
        </h1>
        <p className="text-gray-500 font-medium text-base">
          Start your journey with creators who get you.
        </p>
      </div>

      {authError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1">
          {authError}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text-main block">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={authLoading}
            placeholder="abc@youremail.com"
            className="w-full px-4 py-3 rounded-full border border-border-muted focus:border-primary-green focus:ring-4 focus:ring-(--primary-green)/10 transition-all outline-none text-text-main placeholder:text-text-muted font-medium bg-white disabled:opacity-50"
          />
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
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
          <p className="text-xs text-gray-400 mt-1">
            At least 8 characters, include a number
          </p>
        </div>

        {/* Terms Checkbox */}
        <div
          className={`flex items-start gap-3 cursor-pointer group select-none ${authLoading ? "pointer-events-none opacity-50" : ""}`}
          onClick={() => setAgreedToTerms(!agreedToTerms)}
        >
          <div
            className={`mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${agreedToTerms
              ? "bg-primary-green border-primary-green shadow-circle-check"
              : "border-border-muted group-hover:border-primary-green"
              }`}
          >
            {agreedToTerms && (
              <div className="h-2 w-2 rounded-full bg-white transition-all scale-100" />
            )}
          </div>
          <span className="text-sm text-gray-500 leading-tight">
            I have read and agree to Collabden&apos;s{" "}
            <Link
              href="#"
              className="underline font-semibold decoration-primary-green/30 hover:decoration-primary-green transition-colors text-primary-green"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              terms of use
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="underline font-semibold decoration-primary-green/30 hover:decoration-primary-green transition-colors text-primary-green"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              privacy policy
            </Link>
          </span>
        </div>

        {/* Sign Up Button */}
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
            "Sign Up"
          )}
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-1">
          <div className="grow border-t border-border-light"></div>
          <span className="shrink mx-4 text-xs font-medium text-text-main uppercase tracking-widest">
            Or continue with
          </span>
          <div className="grow border-t border-border-light"></div>
        </div>

        {/* Social Login - Google Only */}
        <div className="space-y-4">
          <button
            type="button"
            className="w-full py-3.5 flex items-center justify-center gap-3 rounded-full border border-border-light bg-white hover:bg-gray-50 transition-all cursor-pointer font-semibold text-text-main shadow-sm hover:shadow-md"
          >
            <FcGoogle size={27} />
            <span>Sign up with Google</span>
          </button>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-1">
          <p className="text-base font-semibold text-text-main">
            Already have an account?{" "}
            <Link
              href={ROUTES.AUTH.LOGIN}
              className="text-bold hover:underline text-primary-green"
            >
              Log In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
