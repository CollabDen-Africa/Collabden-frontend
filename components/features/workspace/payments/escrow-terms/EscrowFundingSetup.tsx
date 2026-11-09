"use client";

import { useState, useRef } from "react";
import { 
  FiCheck, 
  FiArrowLeft, 
  FiShield, 
  FiCalendar,
  FiMoreHorizontal,
  FiMessageSquare,
  FiBell,
  FiTrash2,
  FiEdit3,
  FiX
} from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Select from "@/components/ui/Select";
import { useAuth } from "@/context/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useEscrow } from "@/hooks/escrow/useEscrow";
import { usePayment } from "@/hooks/payment/usePayment";
import VerificationModal from "@/components/features/profile/VerificationModal";

interface EscrowFundingSetupProps {
  onBack?: () => void;
  onActivateEscrow?: () => void;
  onReconfigure?: () => void; // Prop to jump back to terms setup
}

export default function EscrowFundingSetup({ 
  onBack, 
  onActivateEscrow,
  onReconfigure
}: EscrowFundingSetupProps) {
  
  const { activeProject } = useWorkspace();
  const projectId = activeProject?.id || "";

  const { user, refreshUser } = useAuth();
  const isVerified = Boolean(user?.identityVerified);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const resumeAfterVerifyRef = useRef(false);

  const { useWallet } = usePayment();
  const { data: walletData } = useWallet();
  const currencySymbol = walletData?.currency === "USD" ? "$" : "₦";
  const walletBalance = walletData?.balance || 0;

  const { useProjectEscrow, useFundEscrow, useRemindCollaborator, useRemoveEscrowCollaborator } = useEscrow();
  const { data: escrowData } = useProjectEscrow(projectId);
  const fundMutation = useFundEscrow();
  const remindMutation = useRemindCollaborator();
  const removeMutation = useRemoveEscrowCollaborator();
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [paymentOption, setPaymentOption] = useState("wallet");
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [viewNoteData, setViewNoteData] = useState<{name: string, comment: string} | null>(null);

  // Computations
  const totalFunding = escrowData?.totalAmount || 0;
  const escrowAmount = totalFunding; 
  const feeAmount = totalFunding * 0.015; // Simulated 1.5% fee

  const deadlineDate = escrowData?.fundingDeadline ? new Date(escrowData.fundingDeadline) : null;
  const daysRemaining = deadlineDate 
    ? Math.max(0, Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) 
    : null;
  const fundingDeadlineStr = deadlineDate ? deadlineDate.toLocaleDateString() : "No deadline set";

  // Check if ALL assigned collaborators have approved
  const isFullyApproved = escrowData?.allocations?.length > 0 && escrowData?.allocations?.every(
    (alloc: any) => alloc.approvalStatus === "APPROVED"
  );

  const formatCurrency = (amount: number) => `${currencySymbol}${amount.toLocaleString()}`;
  const PAYMENT_OPTIONS = [
    { label: `CollabDen Wallet (Bal: ${formatCurrency(walletBalance)})`, value: "wallet" }
  ];

  const runFundEscrow = async () => {
    try {
      await fundMutation.mutateAsync(projectId);
      onActivateEscrow?.();
    } catch (error) {
      console.error("Failed to activate escrow", error);
    }
  };

  const handleActivateEscrow = async () => {
    if (!isVerified) {
      resumeAfterVerifyRef.current = true;
      setIsVerifyModalOpen(true);
      return;
    }
    await runFundEscrow();
  };

  const handleVerifySuccess = async () => {
    setIsVerifyModalOpen(false);
    await refreshUser();
    if (resumeAfterVerifyRef.current) {
      resumeAfterVerifyRef.current = false;
      await runFundEscrow();
    }
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  // Mock handlers for management actions
  const handleSendReminder = async (collabId: string) => {
      setActiveDropdownId(null);
      setActionError(null);
      setActionSuccess(null);
    try {
        await remindMutation.mutateAsync({ projectId, userId: collabId });
        setActionSuccess("Reminder sent successfully.");
      } catch (error: any) {
        // Catch the 429 Too Many Requests from the backend
        if (error?.response?.status === 429 || error?.message?.includes("429")) {
          setActionError("You can only send one reminder every 24 hours.");
        } else {
          setActionError(error.message || "Failed to send reminder.");
        }
      }
    };
  
  const handleRemoveCollaborator = async (collabId: string) => {
      setActiveDropdownId(null);
      setActionError(null);
      setActionSuccess(null);
      try {
        await removeMutation.mutateAsync({ projectId, userId: collabId });
        setActionSuccess("Collaborator removed from escrow successfully.");
        
        // If removal was successful, immediately trigger the reconfigure callback
        // because removing someone alters the total budget/allocations
        if (onReconfigure) onReconfigure();
      } catch (error: any) {
        setActionError(error.message || "Failed to remove collaborator.");
      }
    };


  

  return (
    <div>
        <VerificationModal
          isOpen={isVerifyModalOpen}
          onClose={() => {
            resumeAfterVerifyRef.current = false;
            setIsVerifyModalOpen(false);
          }}
          onSuccess={handleVerifySuccess}
          defaultFirstName={(user as any)?.firstName ?? ""}
          defaultLastName={(user as any)?.lastName ?? ""}
        />

        {/* Section Header */}
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="font-raleway font-extrabold text-[24px] text-white tracking-[-0.6px]">
            Collaborator Approvals
          </h2>
          <p className="font-raleway font-normal text-[14px] text-text-muted-theme/90">
            All collaborators must approve the terms before escrow activation.
          </p>
        </div>

      {/* Main Content Layout */}
      <div className="flex flex-col-reverse lg:flex-row gap-6 w-full">
        
        {/* Left Column - Funding Setup */}
        <div className="flex-1 bg-black/15 border border-white/5 rounded-3xl p-5 flex flex-col relative backdrop-blur-md">
          <span className="font-raleway font-bold text-[11px] text-text-muted tracking-[1px] uppercase mb-6">
            Fund Escrow
          </span>

          <div className="w-full bg-black/15 rounded-[20px] p-5 flex flex-col sm:flex-row sm:justify-between items-center gap-5 sm:gap-0 mb-8 border border-white/5">
            <div className="flex flex-col">
              <span className="font-raleway font-normal text-[11px] text-text-muted tracking-[1px] uppercase mb-3">
                Total Funding Required
              </span>
              <span className="font-raleway font-black text-[40px] text-white leading-none mb-3">
                {formatCurrency(totalFunding)}
              </span>
              <span className="font-raleway font-normal text-[14px] text-text-muted">
                {formatCurrency(escrowAmount)} escrow + {formatCurrency(feeAmount)} fee (1.5%)
              </span>
            </div>
            <div className="w-16 h-16 rounded-[20px] bg-primary-green/10 border border-primary-green/20 hidden sm:flex items-center justify-center">
              <IoWalletOutline size={28} className="text-primary-green" />
            </div>
          </div>

          <div className="flex flex-col gap-5 mb-8">
            <div className="flex flex-col gap-3 mb-1">
              <label className="font-raleway font-semibold text-[13px] text-text-muted tracking-[0.5px] uppercase">
                Payment Method
              </label>
              <Select 
                options={PAYMENT_OPTIONS}
                value={paymentOption}
                onChange={setPaymentOption}
                variant="glass"
              />
            </div>
            
            <div className="flex flex-col gap-3 mt-3">
              <label className="font-raleway font-semibold text-[13px] text-text-muted tracking-[0.5px] uppercase">
                Funding Deadline
              </label>
              <button className="w-full bg-black/15 border border-white/10 hover:border-white/20 transition-colors rounded-2xl p-4 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <FiCalendar className="text-white/60" size={16} />
                  </div>
                  <span className="font-raleway font-semibold text-[15px] text-white">{fundingDeadlineStr}</span>
                </div>
                {daysRemaining !== null && (
                  <span className={`font-raleway font-bold text-[13px] ${daysRemaining < 3 ? 'text-accent-pink' : 'text-accent-yellow'}`}>
                    {daysRemaining} days left
                  </span>
                )}
              </button>
            </div>
          </div>

          <Button 
            variant="primary"
            onClick={handleActivateEscrow}
            disabled={fundMutation.isPending || walletBalance < totalFunding || !isFullyApproved}
            className="mt-auto w-full rounded-[20px] py-1.5 shadow-[0_4px_28px_rgba(115,191,68,0.25)] flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:transform-none disabled:shadow-none"
            icon={FiShield}
            iconPosition="left"
          >
            <span className="font-raleway font-black text-sm sm:text-[18px]">
              {!isFullyApproved 
                ? "Awaiting Approvals" 
                : fundMutation.isPending 
                  ? "Activating..." 
                  : `Fund Escrow Now ${formatCurrency(totalFunding)}`
              }
            </span>
          </Button>
        </div>

        {/* Right Column - Status & Info Sidebar */}
        <div className="w-full lg:w-85 shrink-0 flex flex-col gap-5">

          {actionError && (
                  <div className="mb-4 w-full bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-center gap-3">
                    <span className="font-raleway font-medium text-[13px] text-red-400">{actionError}</span>
                  </div>
                )}
                {actionSuccess && (
                  <div className="mb-4 w-full bg-primary-green/10 border border-primary-green/30 rounded-2xl p-4 flex items-center gap-3">
                    <span className="font-raleway font-medium text-[13px] text-primary-green">{actionSuccess}</span>
                  </div>
                )}
          
          {/* Approvals Summary Card */}
          <div className="bg-black/15 border border-white/5 rounded-3xl p-6 flex flex-col backdrop-blur-md relative z-20">
            <div className="flex justify-between items-center mb-5">
              <span className="font-raleway font-bold text-[11px] text-text-muted tracking-[1px] uppercase">
                Approval Status
              </span>
              <span className="font-raleway font-bold text-[12px] text-white">
                {escrowData?.allocations?.filter((a: any) => a.approvalStatus === "APPROVED").length || 0} / {escrowData?.allocations?.length || 0}
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {escrowData?.allocations?.length === 0 && (
                 <span className="text-white/50 text-[13px]">No collaborators allocated.</span>
              )}
              {escrowData?.allocations?.map((alloc: any) => {
                const collabMeta = activeProject?.collaborators?.find((c: any) => c.userId === alloc.userId);
                const name = collabMeta?.user?.displayName || collabMeta?.user?.legalName || collabMeta?.user?.email || "Unknown";
                const status = alloc.approvalStatus || "PENDING";
                const isApproved = status === "APPROVED";
                const isChangesReq = status === "CHANGES_REQUESTED";
                const isDropdownOpen = activeDropdownId === alloc.userId;

                return (
                  <div key={alloc.userId} className={`flex flex-col border-b border-white/5 pb-3 last:border-0 last:pb-0 relative ${
                          isDropdownOpen ? 'z-50' : 'z-10'
                        }`}>
                    <div className="flex items-center justify-between w-full">
                      
                      <div className="flex items-center gap-3">
                        <Avatar name={name} className="w-7.5 h-7.5 text-[10px]" />
                        <div className="flex flex-col">
                          <span className="font-raleway font-normal text-[14px] text-white/80">
                            {name}
                          </span>
                          <span className={`font-raleway font-bold text-[10px] uppercase tracking-[0.5px] ${isApproved ? 'text-primary-green' : isChangesReq ? 'text-accent-yellow' : 'text-text-muted'}`}>
                            {isApproved ? "Approved" : isChangesReq ? "Changes Requested" : "Pending"}
                          </span>
                        </div>
                      </div>

                      <div className="relative">
                        <button 
                          onClick={() => toggleDropdown(alloc.userId)}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${isDropdownOpen ? "bg-white/15 border-white/30 text-white" : "border-white/10 hover:bg-white/5 text-white/40"}`}
                        >
                          <FiMoreHorizontal size={14} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-xl py-1 shadow-2xl z-999 animate-in fade-in zoom-in-95">
                            {isChangesReq && (
                              <button 
                                onClick={() => {
                                  setViewNoteData({ name, comment: alloc.approvalComment || "No comment provided." });
                                  setActiveDropdownId(null);
                                }}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-accent-yellow hover:bg-white/5 transition-colors text-left"
                              >
                                <FiMessageSquare size={14} />
                                <span className="font-raleway font-medium">View Request</span>
                              </button>
                            )}
                            
                            {!isApproved && (
                              <button 
                                onClick={() => handleSendReminder(alloc.userId)}
                                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-white/70 hover:bg-white/5 hover:text-white transition-colors text-left"
                              >
                                <FiBell size={14} />
                                <span className="font-raleway font-medium">Send Reminder</span>
                              </button>
                            )}

                            <button 
                              onClick={() => handleRemoveCollaborator(alloc.userId)}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-accent-pink/80 hover:bg-accent-pink/10 hover:text-accent-pink transition-colors text-left"
                            >
                              <FiTrash2 size={14} />
                              <span className="font-raleway font-medium">Remove Collaborator</span>
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-primary-blue/10 border border-primary-blue/20 rounded-3xl p-6 flex flex-col backdrop-blur-md">
            <div className="flex gap-2">
              <FiShield size={24} className="text-secondary-blue mb-4" />
              <h4 className="font-raleway font-bold text-[15px] text-secondary-blue mb-2">
                Escrow Protection
              </h4>
            </div>
            <p className="font-raleway font-normal text-[14px] text-accent-soft-blue/75 leading-[1.6]">
              Funds are protected until each milestone&apos;s release conditions are met and approved by all required collaborators.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-12 pt-6 border-t border-white/5">
        <Button 
          variant="ghost"
          onClick={onBack}
          className="opacity-50 hover:opacity-100 hover:bg-white/10"
          icon={FiArrowLeft}
          iconPosition="left"
        >
          Back
        </Button>
        
        {/* Step Indicator */}
        <div className="hidden sm:flex items-center gap-[6px]">
          <div className="w-4.5 h-1.75 bg-primary-green/50 rounded-full" />
          <div className="w-4.5 h-1.75 bg-primary-green/50 rounded-full" />
          <div className="w-4.5 h-1.75 bg-primary-green/50 rounded-full" />
          <div className="w-4.5 h-1.75 bg-primary-green/50 rounded-full" />
          <div className="w-7 h-1.75 bg-primary-green rounded-full" />
        </div>

        {/* The Reconfigure Option in Footer */}
        <Button 
          variant="ghost"
          onClick={onReconfigure}
          className="text-white/60 hover:text-white border border-white/10 hover:bg-white/5 rounded-full"
          icon={FiEdit3}
          iconPosition="left"
        >
          Edit Terms
        </Button>
      </div>

      {/* View Note Modal Overlay */}
      {viewNoteData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1A1A1A] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => setViewNoteData(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            >
              <FiX size={20} />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-accent-yellow/10 flex items-center justify-center mb-5">
               <FiMessageSquare className="text-accent-yellow" size={20} />
            </div>
            <h3 className="font-raleway font-bold text-[20px] text-white mb-2">
              Revision Request
            </h3>
            <p className="font-raleway font-normal text-[14px] text-text-muted mb-6">
              {viewNoteData.name} requested changes to the escrow terms:
            </p>
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 mb-8">
              <p className="font-raleway font-normal text-[14px] text-white/90 italic">
                &quot;{viewNoteData.comment}&quot;
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setViewNoteData(null)} className="flex-1 bg-white/5 border border-white/10">
                Close
              </Button>
              <Button 
                variant="primary" 
                onClick={() => {
                  setViewNoteData(null);
                  if (onReconfigure) onReconfigure();
                }} 
                className="flex-1 shadow-btn-primary"
              >
                Edit Terms Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}