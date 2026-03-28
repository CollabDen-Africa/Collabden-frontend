"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaApple, FaChevronDown } from "react-icons/fa";

const ROLES = ["Producer", "Artist", "Manager", "Sound Engineer", "DJ", "Other"];

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const isFormValid = useMemo(() => {
    return (
      email.trim().length > 0 &&
      password.trim().length >= 8 &&
      role.length > 0 &&
      agreedToTerms
    );
  }, [email, password, role, agreedToTerms]);

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

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text-main block">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="abc@youremail.com"
            className="w-full px-4 py-3 rounded-full border border-border-muted focus:border-primary-green focus:ring-4 focus:ring-(--primary-green)/10 transition-all outline-none text-text-main placeholder:text-text-muted font-medium bg-white"
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
              placeholder="............"
              className="w-full px-4 py-3 rounded-full border border-border-muted focus:border-primary-green focus:ring-4 focus:ring-(--primary-green)/10 transition-all outline-none text-text-main placeholder:text-text-muted font-medium bg-white pr-12"
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

        {/* Role Dropdown */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text-main block">
            Your role
          </label>
          <div className="relative w-full">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-border-muted focus:border-primary-green focus:ring-4 focus:ring-(--primary-green)/10 transition-all outline-none text-text-main placeholder:text-text-muted font-medium bg-white appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Select a role
              </option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <FaChevronDown size={14} />
            </div>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div
          className="flex items-start gap-3 cursor-pointer group select-none"
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
              onClick={(e) => e.stopPropagation()}
            >
              terms of use
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="underline font-semibold decoration-primary-green/30 hover:decoration-primary-green transition-colors text-primary-green"
              onClick={(e) => e.stopPropagation()}
            >
              privacy policy
            </Link>
          </span>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-4 text-white font-bold rounded-full transition-all cursor-pointer disabled:cursor-not-allowed 
            ${isFormValid
              ? "bg-primary-green shadow-btn-primary hover:shadow-btn-hover hover:-translate-y-1 hover:brightness-90 active:scale-[0.98]"
              : "bg-primary-green/60 shadow-none"
            }`}
        >
          Sign Up
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-1">
          <div className="grow border-t border-border-light"></div>
          <span className="shrink mx-4 text-xs font-medium text-text-main uppercase tracking-widest">
            Or continue with
          </span>
          <div className="grow border-t border-border-light"></div>
        </div>

        {/* Social Logins */}
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            className="w-12 h-12 flex items-center justify-center rounded-full border border-border-light bg-white text-black hover:bg-gray-50 transition-all cursor-pointer"
          >
            <FaApple size={24} />
          </button>
          <button
            type="button"
            className="w-12 h-12 flex items-center justify-center rounded-full border border-border-light bg-white hover:bg-gray-50 transition-all cursor-pointer"
          >
            <FaGoogle className="text-red-500" size={20} />
          </button>
          <button
            type="button"
            className="w-12 h-12 flex items-center justify-center rounded-full border border-border-light bg-white text-blue-600 hover:bg-gray-50 transition-all cursor-pointer"
          >
            <FaFacebook size={22} />
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
