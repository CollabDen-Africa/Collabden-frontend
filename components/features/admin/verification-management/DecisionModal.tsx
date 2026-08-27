"use client";

import React, { useState } from 'react';
import { 
  X, Check, ClipboardCheck, XCircle, Info, Clock, AlertTriangle, CheckCircle2, Home, FileText, History
} from 'lucide-react';
import Avatar from '@/components/ui/Avatar';
import Select from '@/components/ui/Select';
import Toggle from '@/components/ui/Toggle';
import Button from '@/components/ui/Button';

// Mock options
const REJECTION_REASONS = [
  { label: "Image blurry or unreadable", value: "blur" },
  { label: "Document details do not match", value: "mismatch" },
  { label: "Document is expired", value: "expired" },
  { label: "Suspected fraudulent document", value: "fraud" }
];

export default function VerificationDecisionModal({ requestData, onClose, onNavigate }: any) {
  const [decision, setDecision] = useState<'approve' | 'reject'>('approve');
  const [notifyUser, setNotifyUser] = useState(true);
  const [rejectionReason, setRejectionReason] = useState("");
  const [step, setStep] = useState<'decision' | 'confirm' | 'success'>('decision');
  

  // --- SUB-SCREENS ---
  const renderConfirmStep = () => (
    <div className="flex flex-col w-100 bg-card-bg border border-white/10 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.6)] overflow-hidden mt-[10vh]">
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-4 ${
          decision === 'approve' ? 'bg-primary-green/10 text-primary-green' : 'bg-accent-red/10 text-accent-red'
        }`}>
          <AlertTriangle size={24} />
        </div>
        <h2 className="font-raleway font-bold text-[18px] text-white mb-2">Are you sure?</h2>
        <p className="font-inter text-[13px] text-white/65 leading-relaxed">
          You are about to <strong>{decision}</strong> the verification request for <span className="text-white">{requestData.user}</span>. This action is irreversible and will be permanently logged.
        </p>
      </div>
      <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-white/3 border-t border-white/10 w-full">
        <Button 
          variant="ghost" 
          onClick={() => setStep('decision')} 
          className="px-5.5! h-10 border border-white/10 text-[13px] text-white/45 font-semibold"
        >
          Cancel
        </Button>
        <Button 
          variant={decision === 'approve' ? 'primary' : 'red'} 
          onClick={() => setStep('success')} 
          className="px-6! h-10 text-[13px] font-bold"
        >
          Yes, {decision === 'approve' ? 'Approve' : 'Reject'}
        </Button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="flex flex-col w-full max-w-110 bg-card-bg border border-white/10 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.6)] overflow-hidden p-8 text-center mt-[10vh]">
      <div className="flex flex-col items-center justify-center mb-6">
        <div className={`flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
          decision === 'approve' ? 'bg-primary-green/10 text-primary-green' : 'bg-accent-red/10 text-accent-red'
        }`}>
          {decision === 'approve' ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
        </div>
        <h2 className="font-raleway font-bold text-[20px] text-white mb-2">
          Verification {decision === 'approve' ? 'Approved' : 'Rejected'}
        </h2>
        <p className="font-inter text-[13px] text-white/65">
          The decision has been recorded securely in the audit log. {notifyUser && `${requestData.user} has been notified via email.`}
        </p>
      </div>
      
      {/* Routing Action Buttons */}
      <div className="flex flex-col gap-2.5 w-full">
        <Button 
          variant="ghost" 
          onClick={() => onNavigate('dashboard')} 
          className="w-full h-11 bg-white/3 border border-white/10 text-white flex items-center justify-center gap-2"
        >
          <Home size={14} className="text-white/45" /> 
          Back to Dashboard
        </Button>
        
        <div className="flex gap-2.5 w-full">
           <Button 
             variant="ghost" 
             onClick={() => onNavigate('details')} 
             className="flex-1 h-11 bg-white/3 border border-white/10 text-white/65 flex items-center justify-center gap-2"
            >
             <FileText size={13} className="text-white/45" /> 
             View Details
           </Button>
           
           <Button 
             variant="ghost" 
             onClick={() => onNavigate('history')} 
             className="flex-1 h-11 bg-white/3 border border-white/10 text-white/65 flex items-center justify-center gap-2"
            >
             <History size={13} className="text-white/45" /> 
             View History
           </Button>
        </div>
      </div>
    </div>
  );

  return (
    // Overlay Background
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start pt-[8vh] w-full min-h-screen bg-[#0D0F14]/90 backdrop-blur-sm font-sans overflow-y-auto custom-scrollbar">
      
      {/* View Router */}
      {step === 'confirm' && renderConfirmStep()}
      {step === 'success' && renderSuccessStep()}
      
      {step === 'decision' && (
        <>
      {/* User Context Bar */}
      <div className="flex items-center gap-3.5 p-3.5 w-full max-w-130 bg-white/5 border border-white/10 rounded-2xl mb-3.5 shadow-lg">
        
        <Avatar name={requestData.user} className="w-10.5 h-10.5 text-[14px] bg-primary-green/20 border border-white/10 text-primary-green" />
        
        {/* User Info */}
        <div className="flex flex-col flex-1 min-w-0">
          <h3 className="font-raleway font-bold text-[14px] text-white leading-tight truncate">{requestData.user}</h3>
          <p className="font-inter text-[11px] text-white/45 mt-0.5 truncate">
            {requestData.id} · {requestData.userId} · {requestData.type} · Submitted {requestData.date}
          </p>
        </div>
        
        {/* Status Badge */}
        <div className="px-2.75 py-0.75 bg-primary-blue/10 rounded-full shrink-0">
          <span className="font-inter font-bold text-[11px] text-secondary-blue">{requestData.status}</span>
        </div>
      </div>

      {/* Main Modal Box */}
      <div className="flex flex-col max-w-200 w-full bg-[#0D0F14] border border-white/10 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.6)] overflow-hidden mb-12 overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 bg-primary-green/4 border-b border-white/10">
          <div className="flex items-center justify-center w-10 h-10 bg-primary-green/10 border border-primary-green/20 rounded-xl shrink-0">
            <ClipboardCheck size={18} className="text-primary-green" />
          </div>
          <div className="flex flex-col flex-1">
            <h2 className="font-raleway font-bold text-[16px] text-white leading-tight">Verification Decision</h2>
            <p className="font-inter text-[12px] text-white/45 mt-0.5">
              Action will be recorded · User will be notified via email
            </p>
          </div>
          <button onClick={onClose} className="text-white/45 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Body Container */}
        <div className="flex flex-col p-6 w-full gap-4.5">
          
          {/* Decision Selection Cards */}
          <div className="flex flex-col w-full">
            <label className="font-raleway font-bold text-[13px] text-white mb-2.5">
              Decision *
            </label>
            <div className="flex items-center gap-2.5 w-full">
              
              {/* Approve Card */}
              <button 
                onClick={() => setDecision('approve')}
                className={`flex flex-col items-center justify-center p-4 flex-1 h-31 rounded-2xl border transition-all ${
                  decision === 'approve' 
                    ? 'bg-primary-green/[0.07] border-primary-green/3' 
                    : 'bg-white/3 border-white/10 hover:bg-white/5'
                }`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-[1.6px] mb-2.5 transition-colors ${
                  decision === 'approve' ? 'bg-primary-green/10 border-primary-green' : 'bg-white/5 border-white/20'
                }`}>
                  <Check size={18} className={decision === 'approve' ? 'text-primary-green' : 'text-white/45'} />
                </div>
                <span className={`font-raleway font-bold text-[14px] ${decision === 'approve' ? 'text-primary-green' : 'text-white'}`}>
                  Approve
                </span>
                <span className="font-inter text-[11px] text-white/45 mt-0.75">
                  Grant verified status
                </span>
              </button>

              {/* Reject Card */}
              <button 
                onClick={() => setDecision('reject')}
                className={`flex flex-col items-center justify-center p-4 flex-1 h-31 rounded-2xl border transition-all ${
                  decision === 'reject' 
                    ? 'bg-accent-red/10 border-accent-red/30' 
                    : 'bg-white/3 border-white/10 hover:bg-white/5'
                }`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-[1.6px] mb-2.5 transition-colors ${
                  decision === 'reject' ? 'bg-accent-red/10 border-accent-red' : 'bg-white/5 border-white/20'
                }`}>
                  <XCircle size={18} className={decision === 'reject' ? 'text-accent-red' : 'text-white/45'} />
                </div>
                <span className={`font-raleway font-bold text-[14px] ${decision === 'reject' ? 'text-accent-red' : 'text-white/45'}`}>
                  Reject
                </span>
                <span className="font-inter text-[11px] text-white/45 mt-0.75">
                  Decline and notify user
                </span>
              </button>
            </div>
          </div>

          {/* Rejection Reason (Disabled/Faded if Approve is selected) */}
          <div className={`flex flex-col w-full transition-opacity duration-200 ${decision === 'approve' ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            
            <label className="font-raleway font-bold text-[13px] text-white mb-2">
              Rejection Reason * <span className="text-white/45 font-normal">(required when rejecting)</span>
            </label>
            
            <Select 
              value={rejectionReason}
              onChange={setRejectionReason}
              options={REJECTION_REASONS}
              placeholder="Select rejection reason..."
              variant="glass"
              containerClassName="mb-2.5"
            />

            <textarea 
              placeholder="Additional notes for the rejection reason…"
              className="w-full min-h-13 bg-white/3 border border-white/10 rounded-xl p-[14px] font-raleway text-[12px] text-white outline-none placeholder:text-white/45 resize-none focus:border-white/20 custom-scrollbar"
            />
          </div>

          {/* Audit Timestamp */}
          <div className="flex items-center gap-2.5 w-full">
            {/* Decision By */}
            <div className="flex flex-col flex-1">
              <span className="font-inter font-semibold text-[11px] text-white/45 mb-1.5">Decision By</span>
              <div className="flex items-center gap-2 p-2.5 bg-white/3 border border-white/10 rounded-[10px]">
            
                <Avatar name="Verification VA" className="w-5 h-5 text-[8px] rounded-md" />
                <span className="font-inter text-[12px] text-white">Verification Admin</span>
              </div>
            </div>
            
            {/* Date & Time */}
            <div className="flex flex-col flex-1">
              <span className="font-inter font-semibold text-[11px] text-white/45 mb-1.5">Date & Time</span>
              <div className="flex items-center gap-2 p-2.5 bg-white/3 border border-white/10 rounded-[10px]">
                <Clock size={13} className="text-white/45" />
                <span className="font-inter text-[12px] text-white">Jul 14, 2025 · Auto-stamped</span>
              </div>
            </div>
          </div>

          {/* Notify User Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-white/3 border border-white/10 rounded-xl w-full">
            <div className="flex flex-col">
              <span className="font-raleway font-bold text-[13px] text-white mb-0.5">Notify User</span>
              <span className="font-inter text-[11px] text-white/45">{requestData.user} will be notified of the decision via email</span>
            </div>

            <Toggle 
              active={notifyUser} 
              onChange={() => setNotifyUser(!notifyUser)} 
            />
          </div>

          {/* Alert Note */}
          <div className={`flex items-start gap-2.5 p-3 rounded-xl border ${
            decision === 'approve' ? 'bg-primary-green/4 border-primary-green/20' : 'bg-accent-red/4 border-accent-red/20'
          }`}>
            <Info size={14} className={`mt-0.5 ${decision === 'approve' ? 'text-primary-green' : 'text-accent-red'}`} />
            <p className={`font-inter text-[12px] leading-4.75 ${decision === 'approve' ? 'text-primary-green' : 'text-accent-red'}`}>
              {decision === 'approve' 
                ? "Approving will grant Amara Osei a Verified status and immediately update their account permissions across the platform."
                : "Rejecting will require Amara Osei to resubmit their documents. The reason selected above will be included in their notification."
              }
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-white/3 border-t border-white/10 w-full">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="px-5.5! h-[45.6px] min-w-22 border border-white/10 text-[13px] text-text-muted font-semibold"
          >
            Cancel
          </Button>
          <Button 
            variant={decision === 'approve' ? 'primary' : 'red'} 
            onClick={() => setStep('confirm')}
            className="px-7! h-[45.6px] text-[13px] font-bold"
          >
            {decision === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
          </Button>
         </div>
        </div>
            </>
            )}
         </div>
       );
     }