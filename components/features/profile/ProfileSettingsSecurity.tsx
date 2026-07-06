"use client";

import React from "react";
import Button from "@/components/ui/Button";
import { FiShield, FiCheckCircle, FiSmartphone, FiLock, FiKey } from "react-icons/fi";

export default function ProfileSettingsSecurity() {
  
  // Math for the Security Score Progress Ring (92%)
  const percentage = 92;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col w-full flex-1 gap-6 animate-in fade-in duration-300 pb-10">
      
      {/* Header */}
      <div className="flex flex-col gap-1.5 mb-3">
        <h1 className="font-raleway font-semibold text-[26.4px] leading-8.5 text-white/90">
          Security & Verification
        </h1>
        <p className="font-raleway font-normal text-[20.5px] leading-7.25 text-text-muted">
          Protect your account and verify your identity
        </p>
      </div>

      {/* Security Score Card */}
      <div className="w-full bg-white/10 border border-[#73BF44]/20 rounded-[35px] p-8.75 flex flex-row items-center gap-7.5 backdrop-blur-md">
        
        {/* Score Ring */}
        <div className="relative w-26.75 h-26.75 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 107 107">
            <circle cx="53.5" cy="53.5" r={radius} stroke="white" strokeOpacity="0.2" strokeWidth="6" fill="transparent" />
            <circle
              cx="53.5" cy="53.5" r={radius} stroke="#73BF44" strokeWidth="6" fill="transparent" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000"
            />
          </svg>
          <span className="absolute font-raleway font-normal text-[28px] text-white">
            {percentage}%
          </span>
        </div>

        {/* Score Info */}
        <div className="flex flex-col flex-1">
          <span className="font-raleway font-semibold text-[23.4px] text-white mb-1">
            Security Score
          </span>
          <span className="font-inter font-normal text-[20.5px] text-text-muted mb-3">
            Your account is well protected
          </span>
          <div className="flex gap-4">
            <span className="font-raleway font-normal text-[17.6px] text-accent-soft-blue">2FA</span>
            <span className="font-raleway font-normal text-[17.6px] text-accent-soft-blue">Identity</span>
            <span className="font-raleway font-normal text-[17.6px] text-accent-soft-blue">Password</span>
          </div>
        </div>
      </div>

      {/* Verified Identity Card */}
      <div className="w-full bg-white/10 border border-border-muted/15 rounded-[35px] flex flex-col backdrop-blur-md overflow-hidden">
        
        {/* Top Half */}
        <div className="px-8.75 py-7.25 border-b-[1.6px] border-white/5 flex items-center gap-5.75">
          <div className="w-[58.6px] h-[58.6px] bg-white/10 border-[2.2px] border-border-muted/10 rounded-[23.4px] flex items-center justify-center shrink-0">
            <FiShield size={26} className="text-white" />
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-3">
              <span className="font-raleway font-medium text-[20.5px] text-white/90">
                Verified Legal Identity
              </span>
              <div className="bg-primary-green rounded-full px-3 py-0.5 flex items-center shadow-sm">
                <span className="font-raleway font-normal text-[17.6px] text-white">✓ Verified</span>
              </div>
            </div>
            <span className="font-raleway font-normal text-[17.6px] text-text-muted mt-1">
              Government-issued ID verified · May 2026
            </span>
          </div>
        </div>

        {/* Bottom Half */}
        <div className="px-8.75 py-5.75 flex flex-col gap-4">
          <span className="font-raleway font-normal text-[17.6px] text-accent-soft-blue/70">
            Benefits Unlocked
          </span>
          <div className="flex flex-col gap-3">
            {["Sign Legal Agreements", "Receive Payments", "Access Protected Features"].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-[23.4px] h-[23.4px] bg-primary-green/20 border-[1.6px] border-primary-green rounded-full flex items-center justify-center shrink-0">
                  <FiCheckCircle size={14} className="text-primary-green" />
                </div>
                <span className="font-inter font-normal text-[17.6px] text-white/90">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication Card */}
      <div className="w-full bg-white/10 border border-white/10 rounded-[35px] flex flex-col backdrop-blur-md overflow-hidden">
        <div className="px-8.75 py-5.75 border-b-[1.6px] border-white/5 flex flex-col">
          <span className="font-raleway font-medium text-[20.5px] text-white/90">
            Two-Factor Authentication
          </span>
          <span className="font-raleway font-normal text-[17.6px] text-text-muted mt-0.5">
            Add an extra layer of security
          </span>
        </div>
        
        {/* 2FA Options Grid */}
        <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* SMS Option (Inactive visually) */}
          <button className="flex items-start gap-4.5 p-6 border-[1.6px] border-white/20 rounded-[23.4px] text-left hover:bg-white/5 transition-colors">
            <FiSmartphone size={24} className="text-white shrink-0 mt-1" />
            <div className="flex flex-col">
              <span className="font-inter font-medium text-[20.5px] text-white">SMS</span>
              <span className="font-inter font-medium text-[17.6px] text-text-muted mt-1.5">
                Receive codes via text message
              </span>
            </div>
          </button>

          {/* Authenticator App Option (Active visually) */}
          <button className="flex items-start gap-4.5 p-6 bg-primary-green border-[1.6px] border-border-muted/35 rounded-[23.4px] text-left relative overflow-hidden group">
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <FiKey size={24} className="text-white shrink-0 mt-1 z-10" />
            <div className="flex flex-col flex-1 z-10">
              <div className="flex justify-between items-start w-full">
                <span className="font-inter font-medium text-[20.5px] text-white">Authenticator App</span>
                <div className="bg-white/15 rounded-full px-3 py-0.5">
                  <span className="font-inter font-medium text-[17.6px] text-white">Active</span>
                </div>
              </div>
              <span className="font-inter font-medium text-[17.6px] text-white/80 mt-1.5">
                Use Google Authenticator or Authy
              </span>
            </div>
          </button>
          
        </div>
      </div>

      {/* Password Card */}
      <div className="w-full bg-white/10 border border-white/10 rounded-[35px] px-7.25 py-7.25 flex flex-row items-center gap-6 backdrop-blur-md">
        <div className="w-[58.6px] h-[58.6px] bg-[#1E2E3A] border-2 border-border-muted/25 rounded-[23.4px] flex items-center justify-center shrink-0">
          <FiLock size={24} className="text-accent-soft-blue/60" />
        </div>
        
        <div className="flex flex-col flex-1">
          <span className="font-raleway font-medium text-[20.5px] text-white/90">
            Password
          </span>
          <span className="font-raleway font-normal text-[17.6px] text-accent-soft-blue/70">
            Last changed 14 days ago
          </span>
        </div>

        <Button variant="outline" className="px-5! py-2! text-[17.6px] text-text-muted! border-white/10 hover:text-white! hover:bg-card-bg!">
          Change
        </Button>
      </div>

    </div>
  );
}