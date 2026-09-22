"use client";

import React, { useState, useRef } from "react";
import { FiShield, FiLock, FiInfo, FiUploadCloud, FiCamera, FiFileText } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

interface VerificationPanelProps {
  isVerified: boolean;
  isPending?: boolean; // Added to distinguish between 'needs upload' and 'under review'
  profile?: any; 
}

export default function VerificationPanel({ isVerified, isPending = false, profile }: VerificationPanelProps) {
  const { user } = useAuth();
  
  // Local state to simulate switching from upload to pending for the UI preview
  const [localPending, setLocalPending] = useState(isPending);

  // File input refs for the upload state
  const idFrontRef = useRef<HTMLInputElement>(null);
  const idBackRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);
  const poaRef = useRef<HTMLInputElement>(null);

  const memberSince = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : "Recently";

  const statusLabel = isVerified ? "Verified" : (localPending ? "Under Review" : "Unverified");
  const statusColor = isVerified ? "text-primary-green" : (localPending ? "text-accent-yellow" : "text-FC6B6B"); // Using the red from your Figma for unverified

  // --- STATE 1: UPLOAD FORM (User hasn't submitted yet) ---
  if (!isVerified && !localPending) {
    return (
      <div className="w-full bg-white/5 border-[0.8px] border-white/10 rounded-[18px] p-6 lg:p-8 flex flex-col gap-6 backdrop-blur-md">
        
        <div className="flex flex-col gap-2 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white">
              <FiShield size={24} />
            </div>
            <div className="flex flex-col">
              <h3 className="font-raleway font-bold text-[20px] text-white">Submit Verification Documents</h3>
              <p className="font-inter text-[14px] text-white/50">Upload the required documents below to verify your identity.</p>
            </div>
          </div>
        </div>

        {/* Upload Dropzones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* ID Front */}
          <div 
            onClick={() => idFrontRef.current?.click()}
            className="flex flex-col items-center justify-center p-6 border border-dashed border-white/20 rounded-[16px] bg-black/20 hover:bg-white/5 hover:border-primary-green/50 transition-all cursor-pointer group"
          >
            <FiUploadCloud size={28} className="text-white/40 group-hover:text-primary-green mb-3 transition-colors" />
            <span className="font-raleway font-semibold text-[13px] text-white">Upload National ID (Front)</span>
            <span className="font-inter text-[11px] text-white/40 mt-1">JPG, PNG or PDF (Max 5MB)</span>
            <input type="file" ref={idFrontRef} className="hidden" accept="image/*,.pdf" />
          </div>

          {/* ID Back */}
          <div 
            onClick={() => idBackRef.current?.click()}
            className="flex flex-col items-center justify-center p-6 border border-dashed border-white/20 rounded-[16px] bg-black/20 hover:bg-white/5 hover:border-primary-green/50 transition-all cursor-pointer group"
          >
            <FiUploadCloud size={28} className="text-white/40 group-hover:text-primary-green mb-3 transition-colors" />
            <span className="font-raleway font-semibold text-[13px] text-white">Upload National ID (Back)</span>
            <span className="font-inter text-[11px] text-white/40 mt-1">JPG, PNG or PDF (Max 5MB)</span>
            <input type="file" ref={idBackRef} className="hidden" accept="image/*,.pdf" />
          </div>

          {/* Selfie */}
          <div 
            onClick={() => selfieRef.current?.click()}
            className="flex flex-col items-center justify-center p-6 border border-dashed border-white/20 rounded-[16px] bg-black/20 hover:bg-white/5 hover:border-[#A78BFA]/50 transition-all cursor-pointer group"
          >
            <FiCamera size={28} className="text-white/40 group-hover:text-[#A78BFA] mb-3 transition-colors" />
            <span className="font-raleway font-semibold text-[13px] text-white">Take/Upload Selfie</span>
            <span className="font-inter text-[11px] text-white/40 mt-1">Make sure your face is clearly visible</span>
            <input type="file" ref={selfieRef} className="hidden" accept="image/*" capture="user" />
          </div>

          {/* Proof of Address */}
          <div 
            onClick={() => poaRef.current?.click()}
            className="flex flex-col items-center justify-center p-6 border border-dashed border-white/20 rounded-[16px] bg-black/20 hover:bg-white/5 hover:border-accent-yellow/50 transition-all cursor-pointer group"
          >
            <FiFileText size={28} className="text-white/40 group-hover:text-accent-yellow mb-3 transition-colors" />
            <span className="font-raleway font-semibold text-[13px] text-white">Proof of Address</span>
            <span className="font-inter text-[11px] text-white/40 mt-1">Utility bill or bank statement</span>
            <input type="file" ref={poaRef} className="hidden" accept="image/*,.pdf" />
          </div>

        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
          <div className="flex items-center gap-2 text-white/50">
            <FiLock size={14} className="text-primary-green" />
            <span className="font-inter text-[12px]">All uploads are securely encrypted end-to-end.</span>
          </div>
          <button 
            onClick={() => setLocalPending(true)} // Simulates successful upload for now
            className="w-full sm:w-auto bg-primary-green hover:bg-primary-green/90 text-white font-raleway font-semibold text-[14px] px-8 py-3 rounded-full transition-colors shadow-[0_4px_14px_rgba(115,191,68,0.25)]"
          >
            Submit Documents
          </button>
        </div>

      </div>
    );
  }

  // --- STATE 2 & 3: SUMMARY VIEW (Pending or Verified) ---
  return (
    <div className="w-full flex flex-col xl:flex-row gap-5 xl:gap-6 w-full max-w-[800px]">
      
      {/* LEFT COLUMN: User Information */}
      <div className="flex-1 bg-white/5 border-[0.8px] border-white/10 rounded-[18px] p-[20px] flex flex-col backdrop-blur-md">
        
        <h3 className="font-raleway font-bold text-[12px] uppercase tracking-[0.84px] text-white/45 mb-3">
          User Information
        </h3>

        <div className="flex flex-col w-full">
          {/* Full Name */}
          <div className="flex justify-between items-center py-[9px] border-b border-white/10">
            <span className="font-inter text-[12px] text-white/45">Full Name</span>
            <span className="font-raleway font-semibold text-[12px] text-white">
              {profile?.legalName || profile?.displayName || "Not Set"}
            </span>
          </div>

          {/* User ID */}
          <div className="flex justify-between items-center py-[9px] border-b border-white/10">
            <span className="font-inter text-[12px] text-white/45">User ID</span>
            <span className="font-raleway font-semibold text-[12px] text-accent-soft-blue">
              USR-{user?.id?.substring(0,4) || "0102"}
            </span>
          </div>

          {/* Email */}
          <div className="flex justify-between items-center py-[9px] border-b border-white/10">
            <span className="font-inter text-[12px] text-white/45">Email</span>
            <span className="font-raleway font-semibold text-[12px] text-white">
              {profile?.email || user?.email}
            </span>
          </div>

          {/* Account Type */}
          <div className="flex justify-between items-center py-[9px] border-b border-white/10">
            <span className="font-inter text-[12px] text-white/45">Account Type</span>
            <span className="font-raleway font-semibold text-[12px] text-white">
              {profile?.role || "Collaborator"}
            </span>
          </div>

          {/* Member Since */}
          <div className="flex justify-between items-center py-[9px] border-b border-white/10">
            <span className="font-inter text-[12px] text-white/45">Member Since</span>
            <span className="font-raleway font-semibold text-[12px] text-white">
              {memberSince}
            </span>
          </div>

          {/* Current Status */}
          <div className="flex justify-between items-center py-[9px]">
            <span className="font-inter text-[12px] text-white/45">Current Status</span>
            <span className={`font-raleway font-semibold text-[12px] ${statusColor}`}>
              {statusLabel}
            </span>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Submitted Documents */}
      <div className="flex-1 bg-white/5 border-[0.8px] border-white/10 rounded-[18px] p-[20px] flex flex-col backdrop-blur-md">
        
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-raleway font-bold text-[12px] uppercase tracking-[0.84px] text-white/45">
            Submitted Documents
          </h3>
          <div className="flex items-center gap-1.5 text-primary-green">
            <FiLock size={11} />
            <span className="font-inter font-semibold text-[10px]">Encrypted · Secure Access</span>
          </div>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          
          {/* Doc 1: National ID Front */}
          <div className="bg-white/5 border border-white/10 rounded-[16px] overflow-hidden flex flex-col h-[166px]">
            <div className="flex-1 bg-gradient-to-br from-[#A78BFA]/10 to-[#A78BFA]/20 flex items-center justify-center relative">
               <FiShield size={32} className="text-[#A78BFA]" />
               <div className="absolute top-2 left-2 bg-white/5 border border-white/10 rounded-full px-2 py-0.5 flex items-center gap-1">
                 <FiLock size={9} className="text-primary-green" />
                 <span className="font-inter font-semibold text-[9px] text-primary-green">Encrypted</span>
               </div>
            </div>
            <div className="p-3 bg-transparent">
              <h4 className="font-raleway font-bold text-[12px] text-white">National ID (Front)</h4>
              <p className="font-inter text-[10px] text-white/45 mt-0.5">NGA-NIN · JPG · 2.1 MB</p>
            </div>
          </div>

          {/* Doc 2: National ID Back */}
          <div className="bg-white/5 border border-white/10 rounded-[16px] overflow-hidden flex flex-col h-[166px]">
            <div className="flex-1 bg-gradient-to-br from-[#A78BFA]/10 to-[#A78BFA]/20 flex items-center justify-center relative">
               <FiShield size={32} className="text-[#A78BFA]" />
               <div className="absolute top-2 left-2 bg-white/5 border border-white/10 rounded-full px-2 py-0.5 flex items-center gap-1">
                 <FiLock size={9} className="text-primary-green" />
                 <span className="font-inter font-semibold text-[9px] text-primary-green">Encrypted</span>
               </div>
            </div>
            <div className="p-3 bg-transparent">
              <h4 className="font-raleway font-bold text-[12px] text-white">National ID (Back)</h4>
              <p className="font-inter text-[10px] text-white/45 mt-0.5">NGA-NIN · JPG · 1.9 MB</p>
            </div>
          </div>

          {/* Doc 3: Selfie */}
          <div className="bg-white/5 border border-white/10 rounded-[16px] overflow-hidden flex flex-col h-[166px]">
            <div className="flex-1 bg-gradient-to-br from-[#11EA9B]/10 to-[#11EA9B]/20 flex items-center justify-center relative">
               <FiShield size={32} className="text-accent-green-bright" />
               <div className="absolute top-2 left-2 bg-white/5 border border-white/10 rounded-full px-2 py-0.5 flex items-center gap-1">
                 <FiLock size={9} className="text-primary-green" />
                 <span className="font-inter font-semibold text-[9px] text-primary-green">Encrypted</span>
               </div>
            </div>
            <div className="p-3 bg-transparent">
              <h4 className="font-raleway font-bold text-[12px] text-white">Selfie Photo</h4>
              <p className="font-inter text-[10px] text-white/45 mt-0.5">Self-captured · PNG · 3.4 MB</p>
            </div>
          </div>

          {/* Doc 4: Proof of Address */}
          <div className="bg-white/5 border border-white/10 rounded-[16px] overflow-hidden flex flex-col h-[166px]">
            <div className="flex-1 bg-gradient-to-br from-[#E2C806]/10 to-[#E2C806]/20 flex items-center justify-center relative">
               <FiShield size={32} className="text-accent-yellow" />
               <div className="absolute top-2 left-2 bg-white/5 border border-white/10 rounded-full px-2 py-0.5 flex items-center gap-1">
                 <FiLock size={9} className="text-primary-green" />
                 <span className="font-inter font-semibold text-[9px] text-primary-green">Encrypted</span>
               </div>
            </div>
            <div className="p-3 bg-transparent">
              <h4 className="font-raleway font-bold text-[12px] text-white">Proof of Address</h4>
              <p className="font-inter text-[10px] text-white/45 mt-0.5">Utility bill · PDF · 0.8 MB</p>
            </div>
          </div>

        </div>

        {/* Security Notice */}
        <div className="bg-[#A78BFA]/5 border border-[#A78BFA]/20 rounded-[12px] p-3 flex items-start gap-2.5 mt-auto">
          <FiInfo size={14} className="text-[#A78BFA] shrink-0 mt-0.5" />
          <p className="font-inter text-[11px] leading-[18px] text-[#A78BFA]">
            Documents are encrypted and accessible only to Verification Admins during the review process.
          </p>
        </div>

      </div>

    </div>
  );
}