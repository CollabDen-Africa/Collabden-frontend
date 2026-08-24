"use client";

import React from 'react';
import { 
  CheckCircle2, RefreshCw, FileText, CheckCircle, Clock 
} from 'lucide-react';

// --- HELPER ---
const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Approved': return { bg: 'bg-primary-green/10', text: 'text-primary-green', border: 'border-primary-green/20' };
    case 'Rejected': return { bg: 'bg-accent-red/10', text: 'text-accent-red', border: 'border-accent-red/20' };
    case 'Incomplete':
    case 'Expired': return { bg: 'bg-accent-red/[0.05]', text: 'text-[#FC8080]', border: 'border-accent-red/20' };
    case 'Pending':
    case 'Under Review':
    default: return { bg: 'bg-accent-yellow/10', text: 'text-accent-yellow', border: 'border-accent-yellow/20' };
  }
};

// --- SUB-COMPONENTS ---

const ProfileHeader = ({ data }: { data: any }) => {
  if (!data) return null;
  const statusStyles = getStatusStyles(data.status);
  
  return (
    <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 md:p-4.5 w-full max-w-300 bg-white/5 border ${statusStyles.border} rounded-[20px]`}>
      <div className="flex flex-row items-start sm:items-center gap-4 w-full md:w-auto min-w-0">
        
        {/* Avatar */}
        <div className="flex items-center justify-center w-12 h-12 md:w-13 md:h-13 bg-[#11EA9B]/20 border border-white/10 rounded-full shrink-0">
          <span className="font-raleway font-bold text-[15px] md:text-[17px] text-[#11EA9B]">{data.initials || data.user.substring(0, 2).toUpperCase()}</span>
        </div>
        
        {/* Info Stack */}
        <div className="flex flex-col justify-center gap-1 min-w-0">
          {/* Name & Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="font-raleway font-bold text-[16px] md:text-[17px] text-white truncate">{data.user}</h2>
            <span className={`px-2.75 py-0.75 rounded-full font-inter font-bold text-[11px] whitespace-nowrap ${statusStyles.bg} ${statusStyles.text}`}>
              {data.status}
            </span>
            <span className="font-inter text-[11px] text-white/45 whitespace-nowrap">
              {data.userId} · {data.attempts} total attempt{data.attempts !== 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Description */}
          <p className="font-inter text-[11px] md:text-[12px] text-white/45 max-w-130 leading-4.5">
            All verification attempts are displayed below in chronological order.
          </p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0 mt-2 md:mt-0">
        <button className="flex items-center justify-center gap-2 h-[35.6px] px-4 bg-accent-yellow/5 border border-accent-yellow/20 rounded-[10px] hover:bg-accent-yellow/10 transition-colors w-full sm:w-auto">
          <RefreshCw size={12} className="text-accent-yellow" />
          <span className="font-raleway font-bold text-[12px] text-accent-yellow whitespace-nowrap">Prompt Resubmission</span>
        </button>
      </div>
    </div>
  );
};

const AlertBanner = () => (
  <div className="flex items-center gap-1.5 px-3.5 py-1.5 mt-5.5 w-fit max-w-full bg-primary-blue/4 border border-primary-blue/20 rounded-[10px] overflow-hidden">
    <Clock size={12} className="text-secondary-blue shrink-0" />
    <span className="font-inter font-semibold text-[11px] text-secondary-blue truncate">
      Read-Only · Historical records cannot be edited or deleted.
    </span>
  </div>
);

// Helper for History Cards
type AttemptProps = {
  id: string;
  type: string;
  status: string;
  statusColor: string;
  statusBg: string;
  attemptInfo: string;
  dateRange: string;
  reasonTitle: string;
  reasonDesc: string;
  reviewer: string;
  isRecent?: boolean;
};

const HistoryCard = ({ 
  id, type, status, statusColor, statusBg, attemptInfo, 
  dateRange, reasonTitle, reasonDesc, reviewer, isRecent 
}: AttemptProps) => (
  <div className={`flex flex-col w-full max-w-300 rounded-[18px] overflow-hidden border ${isRecent ? 'bg-primary-blue/4 border-primary-blue/20' : 'bg-white/5 border-white/10 opacity-75'}`}>
    
    {/* Card Header */}
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 md:px-5 md:py-4 border-b border-white/10 gap-4 md:gap-0">
      <div className="flex items-start md:items-center gap-3.5">
        <div className="flex items-center justify-center w-9.5 h-9.5 bg-[#A78BFA]/10 rounded-xl shrink-0 mt-1 md:mt-0">
          <FileText size={16} className="text-[#A78BFA]" />
        </div>
        <div className="flex flex-col gap-0.75 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-inter font-bold text-[11px] text-[#A78BFA]">{id}</span>
            <span className="flex items-center gap-1.5 px-2.5 py-0.75 bg-[#A78BFA]/10 rounded-full font-inter font-semibold text-[10px] text-[#A78BFA] whitespace-nowrap">
              <CheckCircle size={10} />
              {type}
            </span>
            <span className={`px-2.75 py-0.75 rounded-full font-inter font-bold text-[11px] ${statusBg} ${statusColor} whitespace-nowrap`}>
              {status}
            </span>
            <span className="font-inter text-[10px] text-white/45 w-full sm:w-auto mt-1 sm:mt-0">{attemptInfo}</span>
          </div>
          
          {/* Sub-header (only visible if recent) */}
          {isRecent && (
            <p className="font-inter text-[12px] text-secondary-blue mt-0.5 truncate">
              {dateRange}
            </p>
          )}
        </div>
      </div>
      
      {/* Top Right Action / Date */}
      {isRecent ? (
        <button className="flex items-center justify-center gap-1.5 px-3.5 h-[30.6px] bg-primary-green/10 border border-primary-green/20 rounded-full hover:bg-primary-green/20 transition-colors w-full md:w-auto shrink-0 mt-2 md:mt-0">
          <CheckCircle2 size={11} className="text-primary-green" />
          <span className="font-inter font-bold text-[11px] text-primary-green whitespace-nowrap">View Full Detail</span>
        </button>
      ) : (
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-1 bg-white/5 md:bg-transparent p-2.5 md:p-0 rounded-lg md:rounded-none shrink-0 mt-2 md:mt-0">
          <span className="font-inter text-[11px] text-white/45 text-left md:text-right">
            {dateRange.split(' · ')[0]}
          </span>
          <span className="font-inter text-[11px] text-white/45 text-right">
             {dateRange.split(' · ')[1] || 'Pending'}
          </span>
        </div>
      )}
    </div>

    {/* Card Body */}
    <div className="flex flex-col md:flex-row justify-between items-start p-4 md:p-5 bg-white/3 gap-4 md:gap-0">
      <div className="flex flex-col flex-1 w-full md:max-w-165.25">
        <h4 className="font-inter text-[10px] text-white/45 uppercase tracking-[0.7px]">
          {reasonTitle}
        </h4>
        <p className="font-raleway text-[12px] text-white/80 leading-4.75 mt-1.5">
          {reasonDesc}
        </p>
      </div>
      
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto shrink-0 md:ml-4 pt-3 md:pt-0 border-t border-white/10 md:border-t-0">
        <span className="font-inter text-[10px] text-white/45 uppercase tracking-[0.7px] md:text-right">
          Reviewed By
        </span>
        <span className="font-raleway font-semibold text-[12px] text-white md:text-right mt-0 md:mt-1">
          {reviewer}
        </span>
      </div>
    </div>
  </div>
);


// --- MAIN PAGE COMPONENT ---
export default function VerificationHistoryScreen({ 
  requestData, 
  onBackToDetails 
}: { 
  requestData?: any, 
  onBackToDetails?: () => void 
}) {
  
  if (!requestData) {
    return (
      <div className="flex items-center justify-center p-10 text-white/45">
        No request data found. Please go back to the dashboard.
      </div>
    );
  }

  const currentStatusStyles = getStatusStyles(requestData.status);

  return (
    <div className="flex flex-col items-start p-4 sm:p-6 md:px-7 md:py-10 w-full min-h-screen font-sans overflow-x-hidden mx-auto">
      
      <ProfileHeader data={requestData} />
      
      <AlertBanner />

      {/* History Timeline */}
      <div className="flex flex-col w-full max-w-300 gap-3.5 mt-3.5">
        
        {/* Most Recent Attempt (Mapped dynamically to current request) */}
        <HistoryCard 
          isRecent={true}
          id={requestData.id}
          type={requestData.type}
          status={requestData.status}
          statusBg={currentStatusStyles.bg}
          statusColor={currentStatusStyles.text}
          attemptInfo={`Attempt ${requestData.attempts} of ${requestData.attempts} (most recent)`}
          dateRange={`Submitted: ${requestData.date} · Reviewed by ${requestData.assigned.trim() || 'Pending'}`}
          reasonTitle={requestData.status === 'Rejected' ? "Rejection Reason" : "Status Note"}
          reasonDesc={
            requestData.status === 'Rejected' 
              ? "Document blurry or unreadable. Please resubmit a clear, well-lit photo of your government-issued ID." 
              : requestData.status === 'Approved'
              ? "Verification successful. Account upgraded to verified status."
              : "Documents are currently in the review queue."
          }
          reviewer={requestData.assigned.trim() || 'Unassigned'}
        />

        {/* Older Mock Attempts (Rendered conditionally if attempts > 1) */}
        {requestData.attempts > 1 && (
          <HistoryCard 
            id={`VRQ-0${parseInt(requestData.id.split('-')[1]) - 100}`}
            type="Identity Document"
            status="Rejected"
            statusBg="bg-accent-red/10"
            statusColor="text-accent-red"
            attemptInfo={`Attempt ${requestData.attempts - 1} of ${requestData.attempts}`}
            dateRange="Submitted: May 10, 2025 · Decided: May 12, 2025"
            reasonTitle="Rejection Reason"
            reasonDesc="Selfie does not match the photo on the submitted ID document."
            reviewer="Verification Admin"
          />
        )}

        {requestData.attempts > 2 && (
          <HistoryCard 
            id={`VRQ-0${parseInt(requestData.id.split('-')[1]) - 200}`}
            type="Selfie + ID"
            status="Incomplete"
            statusBg="bg-accent-red/[0.05]"
            statusColor="text-[#FC8080]"
            attemptInfo={`Attempt ${requestData.attempts - 2} of ${requestData.attempts}`}
            dateRange="Submitted: Feb 8, 2025 · Decided: Pending"
            reasonTitle="Status Note"
            reasonDesc="Submission incomplete - only one document uploaded."
            reviewer="Unassigned"
          />
        )}
        
      </div>
    </div>
  );
}