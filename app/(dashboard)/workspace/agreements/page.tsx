"use client";

import React, { useState } from "react";
import { FiDownload, FiCheckCircle, FiClock, FiFileText, FiChevronDown, FiAlertCircle } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

import SignAgreementOverlay from "@/components/features/agreements/SignAgreements";
import ConfirmSignatureOverlay from "@/components/features/agreements/ConfirmSignature";
import SuccessSignatureOverlay from "@/components/features/agreements/SuccessSignature";
import CreateAgreementOverlay from "@/components/features/agreements/CreateAgreementOverlay";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useAgreements } from "@/hooks/projects/useAgreements";
import { useAuth } from "@/context/AuthContext";


const AgreementCard = ({ 
  agreement, 
  onTriggerSign 
}: { 
  agreement: any; 
  onTriggerSign: (agreement: any) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const progressPercent = agreement.signatories.total === 0 
    ? 0 
    : Math.round((agreement.signatories.completed / agreement.signatories.total) * 100);

  return (
    <div className="flex flex-col w-full bg-black/10 border border-white/10 rounded-[30px] p-8 lg:p-10 backdrop-blur-md transition-all duration-300">
      
      {/* TOP ROW: Title & Actions */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center w-full gap-6 mb-8">
        
        {/* Left: Title & Info */}
        <div className="flex flex-col gap-2">
          <h2 className="font-raleway font-bold text-[20px] lg:text-[24px] text-white leading-tight">
            {agreement.title}
          </h2>
          <div className="flex lg:flex-col sm:flex-row sm:items-center lg:items-start gap-1 sm:gap-4 lg:mb-5">
            <span className="font-raleway font-normal text-[14px] text-white/60">
              Project: <span className="text-white">{agreement.project}</span>
            </span>
            <span className="lg:hidden sm:block text-white/30">•</span>
            <span className="font-raleway font-normal text-[14px] text-white/60">
              Created: <span className="text-white">{agreement.createdDate}</span>
            </span>
          </div>
          
          {/* Avatar Group */}
          <div className="flex flex-wrap items-start gap-4 lg:gap-8">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-3">
                {agreement.collaborators.map((collab: any) => (
                  <div key={collab.id} className="relative w-7 h-7 rounded-full border-2 border-primary-green overflow-hidden z-1">
                    <Avatar name={collab.name} src={collab.image} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="font-raleway font-medium text-[14px] lg:text-[16px] text-white/60 ml-1">
                {agreement.collaboratorsCount} collaborators
              </span>
            </div>

            {/* Sign Now Button */}
            <Button 
              onClick={() => onTriggerSign(agreement)}
              className="bg-primary-green hover:bg-accent-green-success transition-colors px-5 py-2 rounded-full shadow-[0_4px_14px_rgba(115,191,68,0.3)]"
            >
              <span className="font-raleway font-semibold text-[14px] text-white">
                Sign Now
              </span>
            </Button>
          </div>
        </div>

        {/* Right: Collaborators, Sign Button, & Status Pill */}
        <div className="flex flex-wrap items-start gap-4 lg:gap-8">
          <div className="flex items-center justify-start bg-accent-yellow/20 border border-accent-yellow px-9 py-4 rounded-full shrink-0 lg:-mt-12.75">
            <span className="font-inter font-medium text-[10px] lg:text-[11px] text-accent-yellow tracking-wider leading-none mt-px">
              Pending Signature
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col w-full gap-2 mb-8">
        <div className="flex justify-between items-center w-full">
          <span className="font-raleway font-medium text-[14px] text-white/60">
            Signatories
          </span>
          <div className="flex items-center gap-3">
            <span className="font-raleway font-semibold text-[14px] text-white">
              {agreement.signatories.completed} of {agreement.signatories.total} Completed
            </span>
          </div>
        </div>

        <div className="w-full h-1.75 bg-white/80 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-green transition-all duration-1000 ease-in-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center gap-1 text-white/60 px-2 py-1.25">
          <FiClock size={12} />
          <span className="font-raleway font-medium text-[12px]">
            {agreement.lastUpdated}
          </span>
        </div>
      </div>
      
      {/* BOTTOM DROPDOWN: Agreement Preview */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full border-t border-white/10 pt-6 flex justify-between items-center cursor-pointer hover:opacity-80 transition-opacity group"
      >
        <span className="font-raleway font-semibold text-[16px] lg:text-[18px] text-white">
          Agreement Preview
        </span>
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
          <FiChevronDown className={`text-white transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} size={20} />
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 w-full bg-black/20 border border-white/10 rounded-6 p-6 lg:p-8 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center w-full mb-2">
            <h4 className="font-raleway font-semibold text-[14px] lg:text-[16px] text-white uppercase tracking-wider">
              {agreement.title}
            </h4>
            <button className="flex items-center gap-2 text-primary-green hover:text-accent-green-bright transition-colors group">
              <FiDownload size={16} className="group-hover:-translate-y-0.5 transition-transform" />
              <span className="font-raleway font-medium text-[14px]">
                Download PDF
              </span>
            </button>
          </div>
          {agreement.contentPreview.map((paragraph: string, index: number) => (
            <p 
              key={index} 
              className={`font-raleway font-normal text-[14px] leading-5.75 ${
                index === agreement.contentPreview.length - 1 ? "text-white/50 italic" : "text-white/80"
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      )}

    </div>
  );
};


// --- MAIN PAGE ---
export default function AgreementsOverviewPage() {
  const { activeProject } = useWorkspace();
  const { user } = useAuth();
  const isUserVerified = user?.identityVerified || false;

  const projectId = activeProject?.id || "";

  const { useProjectAgreements, useEsignAgreement, useUploadAgreement } = useAgreements(projectId);
  const uploadMutation = useUploadAgreement();
  const { data: apiAgreements = [], isLoading } = useProjectAgreements();

  // State to manage modal flow
  const [flowState, setFlowState] = useState<'idle' | 'signing' | 'confirming' | 'success'>('idle');
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleUploadNewAgreement = async (file: File) => {
    if (!projectId) {
      console.error("Cannot upload: No active project selected.");
      // Optional: Trigger a toast notification here to tell the user to select a project
      return;
    }
  
    try {
      const formData = new FormData();
      // Expects the key "file" for the PDF
      formData.append("file", file); 
      
      await uploadMutation.mutateAsync(formData);
      setIsCreateOpen(false); // Close modal on success
    } catch (error) {
      console.error("Agreement upload failed:", error);
    }
  };
  
  const esignMutation = useEsignAgreement(selectedAgreement?.id || "");

  const handleTriggerSign = (agreement: any) => {
    setSelectedAgreement(agreement);
    setFlowState('signing');
  };

  const handleConfirmSign = async () => {
    if (!selectedAgreement?.id) return;
    try {
      await esignMutation.mutateAsync(true);
      setFlowState('success');
    } catch (err) {
      console.error("Failed to sign agreement:", err);
    }
  };

  // Map backend agreements to match card fields
  const agreementsList = apiAgreements.map((agreement) => {
    const totalSignatories = activeProject?.collaborators?.length || 1;
    const completedSignatories = agreement.signatures?.length || 0;

    return {
      id: agreement.id,
      title: agreement.title || "Untitled Agreement",
      project: activeProject?.name || "Unknown Project",
      createdDate: new Date(agreement.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      collaboratorsCount: activeProject?.collaborators?.length || 0,
      collaborators: activeProject?.collaborators?.map((c) => ({
        id: c.userId,
        name: c.user?.email.split("@")[0] || "User",
        image: undefined,
      })) || [],
      signatories: {
        completed: completedSignatories,
        total: totalSignatories,
      },
      lastUpdated: `Updated ${new Date(agreement.updatedAt).toLocaleDateString()}`,
      contentPreview: agreement.content 
        ? [agreement.content] 
        : ["No content preview available."],
      isVerified: isUserVerified,
      status: agreement.status,
    };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-25 w-full">
        <div className="w-12 h-12 border-4 border-primary-green/35 border-t-primary-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full relative">
      <div className="flex flex-col w-full px-5 lg:px-0 gap-8 pb-10">

        {agreementsList.length === 0 ? (
          <EmptyState 
            icon={<FiFileText size={32} strokeWidth={1.5} />}
            title="No Agreements Found"
            description="Create, send, and manage your contracts all in one place."
            actionLabel="New Agreement"
            onAction={() => setIsCreateOpen(true)}
          />
        ) : (
          <div className="flex flex-col gap-10 w-full">
            {agreementsList.map((agreement) => (
              <AgreementCard 
                key={agreement.id} 
                agreement={agreement} 
                onTriggerSign={handleTriggerSign} 
              />
            ))}
          </div>
        )}

        {/* IDENTITY VERIFICATION */}
        <div className="flex flex-col w-full bg-black/20 border border-white/10 rounded-[30px] p-8 backdrop-blur-md">
          <h3 className="font-raleway font-semibold text-[20px] text-white mb-6">
            Identity Verification
          </h3>

          
            {/* VERIFIED STATE */}
            <div className="flex flex-col sm:flex-row items-start gap-4 w-full bg-primary-green/10 border border-primary-green/30 rounded-[30px] p-6">
              <div className="mt-0.5 shrink-0">
                <FiCheckCircle className="text-primary-green" size={24} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-raleway font-semibold text-[16px] text-primary-green">
                  Identity Verified
                </span>
                <span className="font-raleway font-normal text-[14px] text-white/80">
                  Government ID successfully verified.
                </span>
                <span className="font-raleway font-normal text-[14px] text-white/60">
                  You are eligible to sign legally binding agreements.
                </span>
              </div>
          </div>
          
        </div>

      </div>

      {/* OVERLAY COMPONENTS */}
      <SignAgreementOverlay 
        isOpen={flowState === 'signing'} 
        onClose={() => setFlowState('idle')} 
        onSign={() => setFlowState('confirming')} 
      />
      
      <ConfirmSignatureOverlay 
        isOpen={flowState === 'confirming'} 
        onClose={() => setFlowState('idle')} 
        onConfirm={handleConfirmSign} 
      />
      
      <SuccessSignatureOverlay 
        isOpen={flowState === 'success'} 
        onClose={() => setFlowState('idle')} 
        project={selectedAgreement?.project}
      />

      <CreateAgreementOverlay 
              isOpen={isCreateOpen}
              onClose={() => setIsCreateOpen(false)}
              onUpload={handleUploadNewAgreement}
              isPending={uploadMutation.isPending} 
            />
      
    </div>
  );
}