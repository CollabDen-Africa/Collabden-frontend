"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface AdminAuthCardProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  errorMsg?: string;
  successMsg?: string;
  children: React.ReactNode;
}

export function AdminAuthCard({
  icon,
  title,
  description,
  errorMsg,
  successMsg,
  children,
}: AdminAuthCardProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0f10] relative overflow-hidden px-4 py-8">
      {/* Background radial gradient */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(115, 191, 68, 0.04) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px] sm:max-w-[480px] md:max-w-[540px] lg:max-w-[600px] rounded-[32px] border border-white/[0.07] p-8 md:p-12 flex flex-col items-center"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Top Icon */}
        {icon && <div className="mb-8">{icon}</div>}

        {/* Heading */}
        <h1 className="text-white text-2xl md:text-3xl font-semibold text-center tracking-tight mb-3">
          {title}
        </h1>
        
        {/* Description */}
        {description && (
          <div className="text-white/50 text-[14px] md:text-[15px] text-center mb-8 leading-relaxed font-light">
            {description}
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="w-full mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center transition-all">
            {errorMsg}
          </div>
        )}

        {/* Success message */}
        {successMsg && (
          <div className="w-full mb-6 p-3 rounded-xl bg-[#72c043]/10 border border-[#72c043]/20 text-[#72c043] text-sm text-center transition-all">
            {successMsg}
          </div>
        )}

        {/* Form Content */}
        <div className="w-full flex flex-col items-center">
          {children}
        </div>

        {/* Security Badge */}
        <div className="w-full mt-6 py-3.5 rounded-full border border-white/[0.05] bg-white/[0.02] flex items-center justify-center gap-2.5">
          <Image
            src="/container.svg"
            alt="Secure Icon"
            width={16}
            height={16}
            className="object-contain opacity-80 "
          />
          <span className="text-[#4caf50]/80 font-medium text-[13px]">
            Secured with 256-bit SSL encryption
          </span>
        </div>
      </motion.div>
    </div>
  );
}
