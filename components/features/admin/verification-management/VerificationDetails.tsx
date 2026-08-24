"use client";

import React, { useState } from 'react';
import { 
  Shield, CheckCircle2, Lock, Eye, 
  CreditCard, User, FileText, Info, Search
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import { Tabs } from '@/components/ui/Tabs';

// --- SUB-COMPONENTS ---

const ProfileHeader = ({ data } : { data: any }) => (
  <div className="flex flex-col p-5.5 w-full max-w-300 bg-white/5 border border-accent-yellow/20 rounded-[20px]">
    <div className="flex flex-col sm:flex-row items-start gap-4.5">
      <Avatar name={data.user} className="w-15 h-15 text-xl border border-white/10" />
      
      {/* Info Stack */}
      <div className="flex flex-col flex-1 min-w-0 md:gap-3">
        {/* Name & Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
          <h2 className="font-raleway font-bold text-[18px] text-white truncate max-w-full">{data.user}</h2>
          <span className="px-3 py-0.5 bg-accent-yellow/10 rounded-full font-inter font-bold text-[11px] text-accent-yellow">
            {data.status}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#A78BFA]/10 rounded-full font-inter font-semibold text-[10px] text-[#A78BFA]">
            <CheckCircle2 size={10} />
            {data.type}
          </span>
        </div>
        
        {/* Meta Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
          <span className="font-inter text-[12px] text-white/45">{data.id} . {data.userId}</span>
          <span className="font-inter text-[12px] text-white/45">Submitted {data.date}</span>
          <span className="font-inter text-[12px] text-white/45">Assigned to: {data.assigned}</span>
          <span className="font-inter text-[12px] text-white/45">Attempt: {data.attempts}</span>
        </div>
        
        {/* Security Alert */}
        <div className="flex items-center gap-1.5 px-3.5 py-2 w-fit bg-primary-green/10 border border-primary-green/20 rounded-[10px] md:absolute md:top-[5%] md:left-[70%]">
          <Shield size={12} className="text-primary-green shrink-0" />
          <span className="font-inter font-semibold text-[11px] text-primary-green">
            Authorized Access Only
          </span>
        </div>
      </div>
    </div>
  </div>
);

// Helper for detail rows
const InfoRow = ({ label, value, valueClass = "text-white font-semibold font-raleway" }: { label: string, value: string, valueClass?: string }) => (
  <div className="flex justify-between items-start py-2.25 w-full border-b border-white/10">
    <span className="font-inter text-[12px] text-white/45">{label}</span>
    <span className={`text-[12px] ${valueClass}`}>{value}</span>
  </div>
);

const UserInformation = ({ data } : { data: any }) => (
  <div className="flex flex-col p-5 w-full bg-white/5 border border-white/10 rounded-[18px]">
    {/* Section 1 */}
    <h3 className="font-raleway font-bold text-[12px] text-white/45 uppercase tracking-[0.84px] mb-3">
      User Information
    </h3>
    <InfoRow label="Full Name" value={data.user} />
    <InfoRow label="User ID" value={data.userId} valueClass="text-secondary-blue font-semibold font-raleway" />
    <InfoRow label="Email" value={data.email} />
    <InfoRow label="Location" value={data.location} />
    <InfoRow label="Account Type" value={data.accountType} />
    <InfoRow label="Member Since" value={data.memberSince} />
    <InfoRow label="Current Status" value="Unverified" valueClass="text-accent-red font-semibold font-raleway" />

    {/* Section 2 */}
    <h3 className="font-raleway font-bold text-[12px] text-white/45 uppercase tracking-[0.84px] mt-8 mb-3">
      Request Details
    </h3>
    <InfoRow label="Request ID" value={data.id} />
    <InfoRow label="Verification Type" value={data.type} valueClass="text-[#A78BFA] font-semibold font-raleway" />
    <InfoRow label="Submission Date" value={data.date} />
    <InfoRow label="Review Status" value={data.status} valueClass="text-accent-yellow font-semibold font-raleway" />
    <InfoRow label="Assigned To" value={data.assigned} valueClass="text-primary-green font-semibold font-raleway" />
  </div>
);

// Helper for Document Cards
const DocCard = ({ title, meta, themeColor, bgGradient, Icon }: any) => {
  // Theme color maps
  const colorMap: Record<string, string> = {
    'purple': 'text-[#A78BFA] border-[#A78BFA]/30 bg-[#A78BFA]/10 hover:bg-[#A78BFA]/20',
    'green': 'text-primary-green border-primary-green/30 bg-primary-green/10 hover:bg-primary-green/20',
    'yellow': 'text-accent-yellow border-accent-yellow/30 bg-accent-yellow/10 hover:bg-accent-yellow/20'
  };
  const themeClasses = colorMap[themeColor];

  return (
    <div className="flex flex-col w-full bg-white/3 border border-white/10 rounded-2xl overflow-hidden min-w-0">
      {/* Preview Box */}
      <div className={`relative flex flex-col justify-center items-center h-27.5 w-full ${bgGradient}`}>
        {/* Encrypted Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.75 bg-white/3 border border-white/10 rounded-full">
          <Lock size={9} className="text-primary-green" />
          <span className="font-inter font-semibold text-[9px] text-primary-green">Encrypted</span>
        </div>

        <div className="flex flex-col items-center mt-3.75">
        {/* Main Icon */}
        <Icon size={32} className={`mb-2 ${themeClasses.split(' ')[0]}`} />
        
        {/* View Button */}
        <button className={`flex items-center gap-1.5 px-3 py-1 border rounded-full transition-colors ${themeClasses}`}>
          <Eye size={10} />
          <span className="font-inter font-bold text-[10px]">View</span>
          </button>
        </div>
      </div>
      
      {/* File Details */}
      <div className="flex flex-col p-3">
        <h4 className="font-raleway font-bold text-[12px] text-white">{title}</h4>
        <p className="font-inter text-[10px] text-white/45 mt-0.5">{meta}</p>
      </div>
    </div>
  );
};

const DocumentsSection = () => (
  <div className="flex flex-col p-5 w-full bg-white/5 border border-white/10 rounded-[18px]">
    <div className="flex justify-between items-center w-full mb-4">
      <h3 className="font-raleway font-bold text-[12px] text-white/45 uppercase tracking-[0.84px]">
        Submitted Documents
      </h3>
      <div className="flex items-center gap-1.5">
        <Lock size={11} className="text-primary-green" />
        <span className="font-inter font-semibold text-[10px] text-primary-green">
          Encrypted · Secure Access
        </span>
      </div>
    </div>

    {/* Documents Grid */}
    <div className="grid grid-cols-2 gap-3.5">
      <DocCard 
        title="National ID (Front)" 
        meta="NGA-NIN · JPG · 2.1 MB" 
        themeColor="purple"
        bgGradient="bg-gradient-to-br from-[#A78BFA]/[0.04] to-[#A78BFA]/10"
        Icon={CreditCard}
      />
      <DocCard 
        title="National ID (Back)" 
        meta="NGA-NIN · JPG · 1.9 MB" 
        themeColor="purple"
        bgGradient="bg-gradient-to-br from-[#A78BFA]/[0.04] to-[#A78BFA]/10"
        Icon={CreditCard}
      />
      <DocCard 
        title="Selfie Photo" 
        meta="Self-captured · PNG · 3.4 MB" 
        themeColor="green"
        bgGradient="bg-gradient-to-br from-primary-green/5 to-primary-green/10"
        Icon={User}
      />
      <DocCard 
        title="Proof of Address" 
        meta="Utility bill · PDF · 0.8 MB" 
        themeColor="yellow"
        bgGradient="bg-gradient-to-br from-accent-yellow/5 to-accent-yellow/10"
        Icon={FileText}
      />
    </div>

    {/* Info Alert */}
    <div className="flex items-start gap-2.5 p-3 mt-4 bg-[#A78BFA]/4 border border-[#A78BFA]/20 rounded-xl">
      <Info size={14} className="text-[#A78BFA] mt-0.5 shrink-0" />
      <p className="font-inter text-[11px] leading-[1.6] text-[#A78BFA]">
        Documents are encrypted and accessible only to Verification Admins during the review process. Data is automatically redacted after 30 days based on compliance policies.
      </p>
    </div>
  </div>
);

const PreviousAttempts = () => (
  <div className="flex flex-col w-full max-w-199.5 mt-4 bg-white/5 border border-white/10 rounded-[18px] overflow-hidden">
    <div className="px-5 py-3.5 bg-white/3 border-b border-white/10">
      <h3 className="font-raleway font-bold text-[13px] text-white">Previous Verification Attempts</h3>
    </div>
    <div className="flex items-center gap-3.5 p-5">
      <div className="flex items-center justify-center w-9 h-9 bg-primary-green/10 border border-primary-green/20 rounded-[10px] shrink-0">
        <CheckCircle2 size={16} className="text-primary-green" />
      </div>
      <div className="flex flex-col">
        <h4 className="font-raleway font-bold text-[13px] text-white">No previous attempts</h4>
        <p className="font-inter text-[11px] text-white/45 mt-0.5">
          This is the user&amp;s first verification request on the platform.
        </p>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
export default function VerificationDetailsScreen({ requestData }) {
  const [activeTab, setActiveTab] = useState("Verification Details");

  return (
    <div className="flex flex-col items-start p-6 md:px-7 md:py-10 w-full min-h-screen bg-background font-sans overflow-x-hidden max-w-400">
      
      {/* Top Header Card */}
      <ProfileHeader data={requestData} />

      {/* Tabs */}
      <div className="w-full mt-6 bg-white/2 rounded-t-[18px] pt-1 border-b border-white/10 overflow-x-auto">
        <div className="min-w-max">
                  <Tabs 
                    tabs={["Verification Details", "Documents", "Previous Attempts", "Audit Log"]} 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                  />
                </div>
      </div>

      {/* Functional Tab Content Routing */}
      {activeTab === "Verification Details" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full mt-5 max-w-300">
            <UserInformation data={requestData} />
            <DocumentsSection />
          </div>
          <PreviousAttempts />
        </>
      )}

      {activeTab === "Documents" && (
        <div className="w-full max-w-300 mt-5">
          <DocumentsSection />
        </div>
      )}

      {activeTab === "Previous Attempts" && (
        <div className="w-full max-w-300 mt-1">
          <PreviousAttempts />
        </div>
      )}

      {activeTab === "Audit Log" && (
        <div className="w-full max-w-300 mt-5 p-8 bg-white/5 border border-white/10 rounded-[18px] flex items-center justify-center">
            <span className="text-white/45 font-inter text-sm">Audit log for this specific user is rendered here.</span>
        </div>
      )}

    </div>
  );
}