"use client";

import React, { useState } from "react";
import { FiDownload, FiCheckCircle, FiClock, FiFileText, FiChevronDown, FiAlertCircle } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

import SignAgreementOverlay from "@/components/features/agreements/SignAgreements";
import ConfirmSignatureOverlay from "@/components/features/agreements/ConfirmSignature";
import SuccessSignatureOverlay from "@/components/features/agreements/SuccessSignature";

// --- MOCK DATA ---
const MOCK_AGREEMENTS: any[] = [
  {
    id: "agr_1",
    title: "Freelance Design Agreement",
    project: "Urban Beats Vol. 2",
    createdDate: "May 4, 2026",
    collaboratorsCount: 3,
    collaborators: [
      { id: 1, name: "David Chen", image: "/mock-profiles/David.png" },
      { id: 2, name: "Tayo Oni", image: "/mock-profiles/Tayo.png" },
      { id: 3, name: "Michael Awe", image: "/mock-profiles/Matt.png" },
    ],
    signatories: {
      completed: 1,
      total: 3,
    },
    lastUpdated: "Updated 2 hours ago",
    contentPreview: [
      'This Agreement is entered into as of May 4, 2026, between the parties identified below for the project "Urban Beats Vol. 2".',
      "The Designer agrees to provide creative services as outlined in the project scope, including brand identity design, visual assets, and delivery of final files in agreed-upon formats.",
      "[Document continues with full terms and conditions...]"
    ],
    isVerified: true
  }
];


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
    <div className="flex flex-col w-full bg-black/10 border border-white/10 rounded-[30px] p-[32px] lg:p-[40px] backdrop-blur-md transition-all duration-300">
      
      {/* TOP ROW: Title & Actions */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center w-full gap-[24px] mb-[32px]">
        
        {/* Left: Title & Info */}
        <div className="flex flex-col gap-[8px]">
          <h2 className="font-raleway font-bold text-[20px] lg:text-[24px] text-white leading-tight">
            {agreement.title}
          </h2>
          <div className="flex lg:flex-col sm:flex-row sm:items-center lg:items-start gap-[4px] sm:gap-[16px] lg:mb-5">
            <span className="font-raleway font-normal text-[14px] text-white/60">
              Project: <span className="text-white">{agreement.project}</span>
            </span>
            <span className="lg:hidden sm:block text-white/30">•</span>
            <span className="font-raleway font-normal text-[14px] text-white/60">
              Created: <span className="text-white">{agreement.createdDate}</span>
            </span>
          </div>
          
          {/* Avatar Group */}
          <div className="flex flex-wrap items-start gap-[16px] lg:gap-[32px]">
            <div className="flex items-center gap-[8px]">
              <div className="flex -space-x-[12px]">
                {agreement.collaborators.map((collab: any) => (
                  <div key={collab.id} className="relative w-[28px] h-[28px] rounded-full border-2 border-primary-green overflow-hidden z-[1]">
                    <Avatar name={collab.name} src={collab.image} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <span className="font-raleway font-medium text-[14px] lg:text-[16px] text-white/60 ml-[4px]">
                {agreement.collaboratorsCount} collaborators
              </span>
            </div>

            {/* Sign Now Button */}
            <Button 
              onClick={() => onTriggerSign(agreement)}
              className="bg-primary-green hover:bg-accent-green-success transition-colors px-[20px] py-[8px] rounded-full shadow-[0_4px_14px_rgba(115,191,68,0.3)]"
            >
              <span className="font-raleway font-semibold text-[14px] text-white">
                Sign Now
              </span>
            </Button>
          </div>
        </div>

        {/* Right: Collaborators, Sign Button, & Status Pill */}
        <div className="flex flex-wrap items-start gap-[16px] lg:gap-[32px]">
          <div className="flex items-center justify-start bg-accent-yellow/20 border border-accent-yellow px-[36px] py-[16px] rounded-full shrink-0 lg:mt-[-51px]">
            <span className="font-inter font-medium text-[10px] lg:text-[11px] text-accent-yellow tracking-wider leading-none mt-[1px]">
              Pending Signature
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col w-full gap-[8px] mb-[32px]">
        <div className="flex justify-between items-center w-full">
          <span className="font-raleway font-medium text-[14px] text-white/60">
            Signatories
          </span>
          <div className="flex items-center gap-[12px]">
            <span className="font-raleway font-semibold text-[14px] text-white">
              {agreement.signatories.completed} of {agreement.signatories.total} Completed
            </span>
          </div>
        </div>

        <div className="w-full h-[7px] bg-white/80 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-green transition-all duration-1000 ease-in-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center gap-[4px] text-white/60 px-[8px] py-[5px]">
          <FiClock size={12} />
          <span className="font-raleway font-medium text-[12px]">
            {agreement.lastUpdated}
          </span>
        </div>
      </div>
      
      {/* BOTTOM DROPDOWN: Agreement Preview */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full border-t border-white/10 pt-[24px] flex justify-between items-center cursor-pointer hover:opacity-80 transition-opacity group"
      >
        <span className="font-raleway font-semibold text-[16px] lg:text-[18px] text-white">
          Agreement Preview
        </span>
        <div className="w-[32px] h-[32px] rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
          <FiChevronDown className={`text-white transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} size={20} />
        </div>
      </div>

      {isExpanded && (
        <div className="mt-[24px] w-full bg-black/20 border border-white/10 rounded-[24px] p-[24px] lg:p-[32px] flex flex-col gap-[16px] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center w-full mb-[8px]">
            <h4 className="font-raleway font-semibold text-[14px] lg:text-[16px] text-white uppercase tracking-wider">
              {agreement.title}
            </h4>
            <button className="flex items-center gap-[8px] text-primary-green hover:text-accent-green-bright transition-colors group">
              <FiDownload size={16} className="group-hover:-translate-y-[2px] transition-transform" />
              <span className="font-raleway font-medium text-[14px]">
                Download PDF
              </span>
            </button>
          </div>
          {agreement.contentPreview.map((paragraph: string, index: number) => (
            <p 
              key={index} 
              className={`font-raleway font-normal text-[14px] leading-[23px] ${
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
  
  // State to manage modal flow
  const [flowState, setFlowState] = useState<'idle' | 'signing' | 'confirming' | 'success'>('idle');
  
 
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null);

  // Toggle for unverified vs verified states
  const isUserVerified = false; 

  const handleTriggerSign = (agreement: any) => {
    setSelectedAgreement(agreement);
    setFlowState('signing');
  };

  return (
    <div className="flex flex-col w-full h-full relative">
      <div className="flex flex-col w-full px-[20px] lg:px-[0px] gap-[32px] pb-[40px]">

        {MOCK_AGREEMENTS.length === 0 ? (
          <EmptyState 
            icon={<FiFileText size={32} strokeWidth={1.5} />}
            title="No Agreements Found"
            description="Create, send, and manage your contracts all in one place."
            actionLabel="New Agreement"
            onAction={() => console.log("Open new agreement modal")}
          />
        ) : (
          <div className="flex flex-col gap-[40px] w-full">
            {MOCK_AGREEMENTS.map((agreement) => (
              <AgreementCard 
                key={agreement.id} 
                agreement={agreement} 
                onTriggerSign={handleTriggerSign} 
              />
            ))}
          </div>
        )}

        {/* IDENTITY VERIFICATION */}
        <div className="flex flex-col w-full bg-black/20 border border-white/10 rounded-[30px] p-[32px] backdrop-blur-md">
          <h3 className="font-raleway font-semibold text-[20px] text-white mb-[24px]">
            Identity Verification
          </h3>

          {isUserVerified ? (
            /* VERIFIED STATE */
            <div className="flex flex-col sm:flex-row items-start gap-[16px] w-full bg-primary-green/10 border border-primary-green/30 rounded-[30px] p-[24px]">
              <div className="mt-[2px] shrink-0">
                <FiCheckCircle className="text-primary-green" size={24} />
              </div>
              <div className="flex flex-col gap-[4px]">
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
          ) : (
            /* UNVERIFIED STATE (Action Required) */
            <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full bg-white/10 border border-white/30 rounded-[30px] p-[24px] gap-[24px]">
              <div className="flex flex-col sm:flex-row items-start gap-[16px]">
                <div className="mt-[2px] shrink-0">
                  <FiAlertCircle className="text-accent-yellow" size={24} />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <span className="font-raleway font-semibold text-[16px] text-accent-yellow">
                    Verification Required
                  </span>
                  <span className="font-raleway font-normal text-[14px] text-white/80">
                    Government ID verification is incomplete.
                  </span>
                  <span className="font-raleway font-normal text-[14px] text-white/60">
                    You must verify your identity before signing legally binding agreements.
                  </span>
                </div>
              </div>
              
              <Button className="shrink-0   text-white px-[28px] py-[12px] rounded-full font-raleway font-semibold text-[14px] transition-colors shadow-[0_4px_14px_rgba(249,166,32,0.2)]">
                Verify Identity
              </Button>
            </div>
          )}

        </div>

      </div>

      {/* OVERLAY COMPONENTS                         */}
      <SignAgreementOverlay 
        isOpen={flowState === 'signing'} 
        onClose={() => setFlowState('idle')} 
        onSign={() => setFlowState('confirming')} 
      />
      
      <ConfirmSignatureOverlay 
        isOpen={flowState === 'confirming'} 
        onClose={() => setFlowState('idle')} 
        onConfirm={() => setFlowState('success')} 
      />
      
      <SuccessSignatureOverlay 
        isOpen={flowState === 'success'} 
        onClose={() => setFlowState('idle')} 
        project={selectedAgreement?.project}
      />
      
    </div>
  );
}