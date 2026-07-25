"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HiArrowLeft } from "react-icons/hi";
import { FiRefreshCw } from "react-icons/fi";
import Image from "next/image";
import { AdminAuthCard } from "@/components/ui/AdminAuthCard";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/lib/error-handler";

export const Admin2FAModal: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const adminId = searchParams.get("adminId");
  const email = searchParams.get("email");
  
  const { adminVerify2FA, adminResend2FA, clearError } = useAuth();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!adminId || !email) {
        router.replace("/admin");
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [adminId, email, router]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isFormValid = otp.every(val => val !== "");

  const handleSubmit = async () => {
    if (!isFormValid || !adminId) return;
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);
    clearError();

    try {
      await adminVerify2FA({ adminId, code: otp.join("") });
    } catch (error: any) {
      setErrorMsg(getErrorMessage(error) || "Invalid verification code.");
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!adminId || timeLeft > 0 || isResending) return;
    setErrorMsg("");
    setSuccessMsg("");
    setIsResending(true);
    
    try {
      await adminResend2FA({ adminId });
      setTimeLeft(120);
      setSuccessMsg("A new verification code was sent to your email.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      setErrorMsg(getErrorMessage(error) || "Failed to resend verification code.");
    } finally {
      setIsResending(false);
    }
  };

  const maskedEmail = email ? email.replace(/^(.{2})(.*)(@.*)$/, "$1***$3") : "••••23";

  if (!adminId || !email) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0f10]">
        <div className="text-white/50 text-sm">Loading verification details...</div>
      </div>
    );
  }

  return (
    <AdminAuthCard
      title={
        <>
          Two-Factor<br />Authentication
        </>
      }
      icon={
        <div className="w-15 h-15 rounded-full flex items-center justify-center overflow-hidden">
          <Image
            width={30}
            height={30}
            src="/container.svg"
            alt="Container Icon"
            className="object-contain w-full"
          />
        </div>
      }
      description={
        <>
          Enter the 6-digit code sent to your<br />
          authenticator app or email ending in{" "}
          <span className="text-white/80 font-medium">{maskedEmail}</span>
        </>
      }
      errorMsg={errorMsg}
      successMsg={successMsg}
    >
      <div className="flex items-center justify-between w-full gap-2 md:gap-3 mb-8">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-12 h-14 md:w-16 md:h-20 rounded-[14px] bg-transparent border ${digit ? "border-[#72c043] text-white" : "border-white/10 text-white/50"} text-center text-xl md:text-2xl font-medium focus:border-[#72c043] focus:bg-white/2 outline-none transition-all`}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !isFormValid}
        className={`w-full py-3.5 md:py-4 rounded-[14px] font-medium text-[15px] md:text-[16px] transition-all mb-8 ${
          isFormValid
            ? "bg-[#72c043] hover:bg-[#84d653] text-[#0d0f10]"
            : "bg-white/5 text-white/30 cursor-not-allowed"
        }`}
      >
        {isSubmitting ? "Verifying..." : "Verify & Continue"}
      </button>

      <div className="flex flex-col items-center gap-3 mb-8">
        <p className="text-white/40 text-[13px] md:text-[14px]">
          Code expires in{" "}
          <span className="text-[#72c043] font-medium">
            {formatTime(timeLeft)}
          </span>
        </p>
        <button
          onClick={handleResend}
          disabled={timeLeft > 0 || isResending}
          className={`flex items-center gap-2 text-[14px] md:text-[15px] font-medium transition-colors ${
            timeLeft > 0 || isResending
              ? "text-white/20 cursor-not-allowed"
              : "text-[#72c043] hover:text-[#84d653]"
          }`}
        >
          <FiRefreshCw
            size={14}
            className={isResending ? "animate-spin" : ""}
          />
          {isResending ? "Resending..." : "Resend Code"}
        </button>
      </div>

      <button
        onClick={() => router.push("/admin")}
        className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors text-[14px] md:text-[15px] font-medium"
      >
        <HiArrowLeft size={16} />
        Back to Login
      </button>
    </AdminAuthCard>
  );
};

export default Admin2FAModal;
