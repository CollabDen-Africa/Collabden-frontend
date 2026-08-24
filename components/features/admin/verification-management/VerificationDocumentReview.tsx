"use client";

import React from 'react';
import { 
  FileText, ZoomIn, Download, ShieldAlert, Fingerprint, 
  Camera, ScanFace, Info, EyeOff, RotateCw, Check, X, ClipboardCheck
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';

// --- REUSABLE UI PRIMITIVES ---

const DetailRow = ({ label, value, valueClass = "text-white font-raleway font-bold" }: { label: string, value: string | React.ReactNode, valueClass?: string }) => (
  <div className="flex justify-between items-start py-1.5 w-full border-b border-white/10 last:border-0">
    <span className="font-inter text-[11px] text-white/45">{label}</span>
    <span className={`text-[11px] text-right ${valueClass}`}>{value}</span>
  </div>
);

const AutomatedResultCard = ({ title, metric, status, theme }: { title: string, metric: string, status: string, theme: 'green' | 'yellow' }) => {
  const isGreen = theme === 'green';
  return (
    <div className={`flex flex-col items-start p-3 min-w-23 h-25.25 rounded-xl border shrink-0 ${
      isGreen ? 'bg-primary-green/4 border-primary-green/20' : 'bg-accent-yellow/4 border-accent-yellow/20'
    }`}>
      <span className="font-raleway font-bold text-[13px] text-white">{status}</span>
      <span className="font-inter text-[10px] text-white/45 mt-0.5 mb-1.5 leading-3.75 flex-1">{title}</span>
      <span className={`font-inter font-bold text-[12px] ${isGreen ? 'text-primary-green' : 'text-accent-yellow'}`}>{metric}</span>
    </div>
  );
};

const ControlButton = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <button className="flex items-center justify-center gap-2.5 w-full h-[36.6px] px-3 bg-white/3 border border-white/10 rounded-[10px] hover:bg-white/5 transition-colors mt-1.5">
    <Icon size={13} className="text-white/45" />
    <span className="font-inter font-semibold text-[11px] text-white/45">{label}</span>
  </button>
);

// --- MODULAR SUB-COMPONENTS ---

const DocumentPreviewCard = ({ 
  title, badge, icon: Icon, themeClass, children, details 
}: { 
  title: string, badge: string, icon: any, themeClass: string, children: React.ReactNode, details: { label: string, value: string, highlight?: boolean }[] 
}) => {
  const isPurple = themeClass.includes('A78BFA');
  return (
    <div className={`flex flex-col flex-1 bg-white/5 border rounded-[18px] overflow-hidden relative ${isPurple ? 'border-[#A78BFA]/20' : 'border-primary-green/20'}`}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 shrink-0">
        <Icon size={14} className={isPurple ? 'text-[#A78BFA]' : 'text-primary-green'} />
        <h3 className="font-raleway font-bold text-[13px] text-white flex-1 truncate">{title}</h3>
        <span className={`px-2 py-0.5 rounded-full font-inter font-bold text-[10px] ${isPurple ? 'bg-[#A78BFA]/10 text-[#A78BFA]' : 'bg-primary-green/10 text-primary-green'}`}>
          {badge}
        </span>
      </div>
      
      {/* Visual Preview Box */}
      <div className="p-4 w-full h-81">
        {children}
      </div>

      {/* Details List */}
      <div className="flex flex-col px-4 pb-4 mt-auto">
        {details.map((d, i) => (
          <DetailRow 
            key={i} 
            label={d.label} 
            value={d.value} 
            valueClass={d.highlight ? `font-raleway font-bold ${isPurple ? 'text-[#A78BFA]' : 'text-primary-green'}` : undefined} 
          />
        ))}
      </div>
    </div>
  );
};

const ReviewSidebar = ({ data, onMakeDecision }: { data: any, onMakeDecision?: () => void }) => (
  <div className="flex flex-col p-5 w-full md:max-w-[20vw] border-l border-white/10 shrink-0 min-h-full">
    {/* User Information */}
    <h4 className="font-raleway font-bold text-[11px] text-white/45 uppercase tracking-[0.77px] mb-3">User Information</h4>
    <div className="flex items-center gap-2.5 mb-3.5">
       <Avatar name={data.user} className="w-10 h-10 text-[13px] border border-white/10 text-primary-blue" />
       <div className="flex flex-col min-w-0">
         <span className="font-raleway font-bold text-[13px] text-white truncate">{data.user}</span>
         <span className="font-inter text-[11px] text-white/45 truncate">{data.email || 'No email provided'}</span>
         <span className="font-inter text-[10px] text-white/45 mt-0.5 truncate">{data.userId} · {data.accountType || 'User'}</span>
       </div>
    </div>

    {/* Quick Details */}
    <div className="flex flex-col w-full mb-5">
       <DetailRow label="Request ID" value={data.id} />
       <DetailRow label="Submitted" value={data.date} />
       <DetailRow label="Attempt" value={`${data.attempts || 1}${data.attempts > 1 ? ` (${data.attempts - 1} prior)` : ''}`} />
       <DetailRow label="ID Type" value={data.type} />
       <DetailRow label="Status" value={data.status} valueClass={data.status === 'Pending' ? "text-accent-yellow" : "text-secondary-blue"} />
    </div>

    {/* Dynamic Prior Rejection Alert */}
    {data.attempts > 1 && (
      <div className="flex flex-col p-3 w-full bg-accent-yellow/4 border border-accent-yellow/20 rounded-xl mb-5">
         <div className="flex items-center gap-2 mb-1.5">
           <ShieldAlert size={12} className="text-accent-yellow" />
           <span className="font-raleway font-bold text-[11px] text-accent-yellow">Prior Rejection</span>
         </div>
         <p className="font-inter text-[11px] leading-4.5 text-white/65">
           User was previously rejected. Review document clarity carefully.
         </p>
      </div>
    )}

    {/* Actions */}
    <h4 className="font-raleway font-bold text-[11px] text-white/45 uppercase tracking-[0.77px] mb-1 mt-auto">Document Controls</h4>
    <ControlButton icon={ZoomIn} label="Zoom In" />
    <ControlButton icon={EyeOff} label="Toggle Redaction" />
    <ControlButton icon={RotateCw} label="Rotate Document" />
    <ControlButton icon={Download} label="Download Secure Copy" />

    <h4 className="font-raleway font-bold text-[11px] text-white/45 uppercase tracking-[0.77px] mt-5 mb-2.5">Review Decision</h4>
    <Button 
       variant="primary" 
       onClick={onMakeDecision}
       className="w-full h-[45.6px] bg-primary-blue/10! hover:bg-primary-green/20! mb-2 rounded-xl transition-colors cursor-pointer"
        >
          <ClipboardCheck size={14} className="text-primary-green mr-2" />
           <span className="font-raleway font-bold text-[13px] text-primary-green">Proceed to Decision</span>
        </Button>
    <Button
      variant="ghost"
      className="w-full h-[41.6px] bg-white/3 border-white/10 hover:bg-white/5 rounded-xl mb-4">
         <FileText size={13} className="text-text-muted mr-2" />
         <span className="font-raleway font-semibold text-[12px] text-text-muted">Add Review Note</span>
    </Button>

    <div className="flex items-start gap-2 p-2.5 mt-auto w-full bg-primary-blue/4 border border-primary-blue/20 rounded-[10px]">
      <Info size={11} className="text-secondary-blue shrink-0 mt-0.75" />
      <p className="font-inter text-[10px] leading-4 text-secondary-blue">This session is being logged. Access is restricted.</p>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export default function DocumentReviewScreen({ data, onMakeDecision }: { data: any, onMakeDecision?: () => void }) {
  if (!data) return null;

  return (
    <div className="flex flex-col lg:flex-row items-start w-full mx-auto bg-background rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      
      {/* LEFT COLUMN: Main Content Area */}
      <div className="flex flex-col items-start p-5 md:px-6 md:pb-8 w-full md:w-[60vw] shrink-0">
        
        {/* Header Section */}
        <div className="flex items-center pb-4 w-full gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-green/10 border border-primary-green/20 rounded-xl shrink-0">
            <ScanFace size={18} className="text-primary-green" />
          </div>
          <div className="flex flex-col flex-1">
            <h2 className="font-raleway font-bold text-[16px] text-white leading-tight">Identity Document Review</h2>
            <p className="font-inter text-[11px] text-white/45 mt-1">
              {data.id} · {data.user} · Submitted {data.date}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-4 py-2.5 w-full bg-primary-blue/4 border border-primary-blue/20 rounded-xl mb-4.5">
          <Info size={12} className="text-[#6FA3E0]" />
          <span className="font-inter text-[11px] text-secondary-blue">This document view is access-logged. All inspections are recorded for compliance.</span>
        </div>

        {/* Document Verification */}
        <div className="flex flex-col md:flex-row w-full gap-4 mb-5">
          
          <DocumentPreviewCard 
            title="Government-Issued ID" 
            badge={data.type === 'Identity Document' ? 'Passport' : 'NIN Card'} 
            icon={Fingerprint} 
            themeClass="73BF44"
            details={[
              { label: "Document Type", value: data.type === 'Identity Document' ? 'Int. Passport' : 'NIN Card' },
              { label: "File Format", value: "JPEG · 2.4 MB" },
              { label: "Resolution", value: "2048 × 1292 px" },
              { label: "Clarity Check", value: "Pass", highlight: true },
              { label: "Tamper Check", value: "Pass", highlight: true },
              { label: "Face Detected", value: "Yes", highlight: true },
            ]}
          >
            {/* Dynamic ID*/}
            <div className="relative w-full h-36.5 bg-[#1A1D26] border border-white/10 rounded-xl overflow-hidden p-3.5 flex flex-col justify-between">
              <div className="absolute inset-0 bg-linear-to-br from-[#1E2436] to-[#131620] opacity-80" />
              <div className="relative z-10 flex gap-3">
                <div className="w-12 h-15 bg-white/10 border border-white/10 rounded-lg flex items-center justify-center shrink-0">
                  <Avatar name={data.user} className="w-6 h-6 text-[8px]" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-raleway font-bold text-[11px] text-white truncate">FEDERAL REPUBLIC OF NIGERIA</span>
                  <span className="font-inter text-[9px] text-white/45 mb-1.5">{data.type === 'Identity Document' ? 'PASSPORT' : 'NATIONAL IDENTITY CARD'}</span>
                  <span className="font-inter text-[10px] text-white/45 leading-[1.7] truncate">Name: {data.user.toUpperCase()}</span>
                  <span className="font-inter text-[10px] text-white/45 leading-[1.7]">ID: •••• •••• {Math.floor(Math.random() * 9000) + 1000}</span>
                </div>
              </div>
            </div>
          </DocumentPreviewCard>

          <DocumentPreviewCard 
            title="Live Selfie Capture" 
            badge="Photo" 
            icon={Camera} 
            themeClass="A78BFA"
            details={[
              { label: "Capture Type", value: "Live Selfie" },
              { label: "File Format", value: "JPEG · 1.1 MB" },
              { label: "Resolution", value: "1080 × 1440 px" },
              { label: "Liveness Check", value: "Pass", highlight: true },
              { label: "Face Match", value: "93.4%", highlight: true },
              { label: "Spoofing Check", value: "Clear", highlight: true },
            ]}
          >
            {/* Selfie Preview */}
             <div className="relative w-full h-full bg-[#1A1D26] border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute inset-0 bg-linear-to-b from-[#1C1F2E] to-[#10121A] opacity-80" />
                <div className="absolute w-21 h-25 border-[1.6px] border-dashed border-primary-green/40 rounded-xl z-0" />
                
                <div className="relative z-10 flex flex-col items-center gap-2.5">
                  <div className="w-18 h-18 bg-[#204F99]/20 border-[2.4px] border-[#6FA3E0] rounded-full flex items-center justify-center">
                     <span className="font-raleway text-[11px] text-white/45 text-center leading-[1.2]">Selfie<br/>Preview</span>
                  </div>
                  <div className="px-3 py-1 bg-[#A78BFA]/10 border border-[#A78BFA]/20 rounded-lg">
                    <span className="font-inter font-bold text-[10px] text-[#A78BFA]">Image Loaded</span>
                  </div>
                </div>
             </div>
          </DocumentPreviewCard>
        </div>

        {/* Automated Analysis Results Footer */}
        <div className="flex flex-col p-4 w-full bg-white/5 border border-white/10 rounded-2xl">
          <h4 className="font-raleway font-bold text-[12px] text-white/45 uppercase tracking-[0.84px] mb-3">Automated Analysis Results</h4>
          <div className="flex items-center gap-2.5 w-full overflow-x-auto custom-scrollbar pb-1">
             <AutomatedResultCard status="Verified" title="ID Authenticity" metric="97%" theme="green" />
             <AutomatedResultCard status="Matched" title="Face Match" metric="93%" theme="green" />
             <AutomatedResultCard status="Confirmed" title="Liveness" metric="Pass" theme="green" />
             <AutomatedResultCard status="Pass" title="Data Consistency" metric="100%" theme="green" />
             <AutomatedResultCard status="Pending" title="Manual Review" metric="—" theme="yellow" />
          </div>
        </div>
      </div>

      <ReviewSidebar data={data} onMakeDecision={onMakeDecision} />
    </div>
  );
}