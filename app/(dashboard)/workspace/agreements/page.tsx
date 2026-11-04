"use client";

import React, { useState } from "react";
import {
  FiDownload,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiChevronDown,
  FiAlertCircle,
  FiTrash2,
  FiPlus,
  FiLock,
  FiShield,
  FiEdit2,
} from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";

import SignAgreementOverlay from "@/components/features/agreements/SignAgreements";
import ConfirmSignatureOverlay from "@/components/features/agreements/ConfirmSignature";
import SuccessSignatureOverlay from "@/components/features/agreements/SuccessSignature";
import CreateAgreementOverlay from "@/components/features/agreements/CreateAgreementOverlay";
import EditAgreementOverlay from "@/components/features/agreements/EditAgreementOverlay";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useAgreements } from "@/hooks/projects/useAgreements";
import { useAuth } from "@/context/AuthContext";

const STATUS_CONFIG = {
  DRAFT: {
    label: "Draft",
    pill: "bg-white/10 border border-white/20 text-white/60",
  },
  PENDING_SIGNATURE: {
    label: "Pending Signature",
    pill: "bg-accent-yellow/20 border border-accent-yellow text-accent-yellow",
  },
  SIGNED: {
    label: "Signed",
    pill: "bg-primary-green/20 border border-primary-green/50 text-primary-green",
  },
} as const;

function DeleteButton({
  onDelete,
  isPending,
}: {
  onDelete: () => void;
  isPending: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-raleway text-[13px] text-white/60">Delete?</span>
        <button
          onClick={() => {
            onDelete();
            setConfirming(false);
          }}
          disabled={isPending}
          className="px-3 py-1.5 rounded-full bg-accent-red/20 border border-accent-red/40 text-accent-red-alt text-[12px] font-raleway font-semibold hover:bg-accent-red/30 transition-colors disabled:opacity-50"
        >
          {isPending ? "Deleting…" : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[12px] font-raleway font-medium hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-red/10 border border-accent-red/20 text-accent-red-alt hover:bg-accent-red/20 transition-colors group"
    >
      <FiTrash2
        size={14}
        className="group-hover:scale-110 transition-transform"
      />
      <span className="font-raleway font-medium text-[13px]">Delete</span>
    </button>
  );
}


const AgreementCard = ({
  agreement,
  isOwner,
  currentUserId,
  isUserVerified,
  onTriggerSign,
  onEdit,
  onDelete,
  isDeleting,
}: {
  agreement: any;
  isOwner: boolean;
  currentUserId: string;
  isUserVerified: boolean;
  onTriggerSign: (agreement: any) => void;
  onEdit: (agreement: any) => void;
  onDelete: (agreementId: string) => void;
  isDeleting: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const progressPercent =
    agreement.signatories.total === 0
      ? 0
      : Math.round(
          (agreement.signatories.completed / agreement.signatories.total) * 100
        );

  const statusCfg =
    STATUS_CONFIG[agreement.status as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG.DRAFT;
  const isSigned = agreement.status === "SIGNED";
  const alreadySigned = agreement.rawSignatures?.some(
    (s: any) => s.userId === currentUserId
  );

  const renderSignButton = () => {
    if (isSigned || alreadySigned) {
      return (
        <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary-green/10 border border-primary-green/30">
          <FiCheckCircle className="text-primary-green" size={14} />
          <span className="font-raleway font-semibold text-[14px] text-primary-green">
            {alreadySigned ? "You've Signed" : "Fully Signed"}
          </span>
        </div>
      );
    }

    if (!isUserVerified) {
      return (
        <div
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 cursor-not-allowed"
          title="Verify your identity to sign"
        >
          <FiLock className="text-white/30" size={14} />
          <span className="font-raleway font-semibold text-[14px] text-white/30">
            Sign Now
          </span>
        </div>
      );
    }

    return (
      <Button
        onClick={() => onTriggerSign(agreement)}
        className="bg-primary-green hover:bg-accent-green-success transition-colors px-5 py-2 rounded-full shadow-[0_4px_14px_rgba(115,191,68,0.3)]"
      >
        <span className="font-raleway font-semibold text-[14px] text-white">
          Sign Now
        </span>
      </Button>
    );
  };

  return (
    <div className="flex flex-col w-full bg-black/10 border border-white/10 rounded-[30px] p-8 lg:p-10 backdrop-blur-md transition-all duration-300">
  
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center w-full gap-6 mb-8">
  
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
              Created:{" "}
              <span className="text-white">{agreement.createdDate}</span>
            </span>
          </div>

          
          <div className="flex flex-wrap items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-3">
                {agreement.collaborators.map((collab: any) => (
                  <div
                    key={collab.id}
                    className="relative w-7 h-7 rounded-full border-2 border-primary-green overflow-hidden z-1"
                  >
                    <Avatar
                      name={collab.name}
                      src={collab.image}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <span className="font-raleway font-medium text-[14px] lg:text-[16px] text-white/60 ml-1">
                {agreement.collaboratorsCount} collaborators
              </span>
            </div>

            {renderSignButton()}
          </div>
        </div>

        {/* Right: Status pill */}
        <div className="flex flex-col items-end gap-3 lg:-mt-12.75">
          <div
            className={`flex items-center justify-center px-9 py-4 rounded-full shrink-0 ${statusCfg.pill}`}
          >
            <span className="font-inter font-medium text-[10px] lg:text-[11px] tracking-wider leading-none mt-px">
              {statusCfg.label}
            </span>
          </div>

          {/* Owner actions — only for non-signed agreements */}
          {isOwner && !isSigned && (
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => onEdit(agreement)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/15 text-white/70 hover:bg-white/10 hover:text-white transition-colors group"
              >
                <FiEdit2
                  size={13}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="font-raleway font-medium text-[13px]">
                  Edit
                </span>
              </button>
              <DeleteButton
                onDelete={() => onDelete(agreement.id)}
                isPending={isDeleting}
              />
            </div>
          )}
        </div>
      </div>

    
      <div className="flex flex-col w-full gap-2 mb-8">
        <div className="flex justify-between items-center w-full">
          <span className="font-raleway font-medium text-[14px] text-white/60">
            Signatories
          </span>
          <span className="font-raleway font-semibold text-[14px] text-white">
            {agreement.signatories.completed} of {agreement.signatories.total}{" "}
            Completed
          </span>
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

      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full border-t border-white/10 pt-6 flex justify-between items-center cursor-pointer hover:opacity-80 transition-opacity group"
      >
        <span className="font-raleway font-semibold text-[16px] lg:text-[18px] text-white">
          Agreement Preview
        </span>
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
          <FiChevronDown
            className={`text-white transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            size={20}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 w-full bg-black/20 border border-white/10 rounded-6 p-6 lg:p-8 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center w-full mb-2">
            <h4 className="font-raleway font-semibold text-[14px] lg:text-[16px] text-white uppercase tracking-wider">
              {agreement.title}
            </h4>
            {agreement.fileUrl ? (
              <a
                href={agreement.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="flex items-center gap-2 text-primary-green hover:text-accent-green-bright transition-colors group"
              >
                <FiDownload
                  size={16}
                  className="group-hover:-translate-y-0.5 transition-transform"
                />
                <span className="font-raleway font-medium text-[14px]">
                  Download PDF
                </span>
              </a>
            ) : (
              <span className="flex items-center gap-2 text-white/30 cursor-not-allowed">
                <FiDownload size={16} />
                <span className="font-raleway font-medium text-[14px]">
                  Download PDF
                </span>
              </span>
            )}
          </div>
          {agreement.contentPreview.map((paragraph: string, index: number) => (
            <p
              key={index}
              className={`font-raleway font-normal text-[14px] leading-5.75 ${
                index === agreement.contentPreview.length - 1
                  ? "text-white/50 italic"
                  : "text-white/80"
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

export default function AgreementsOverviewPage() {
  const { activeProject } = useWorkspace();
  const { user } = useAuth();
  const isOwner = Boolean(
    user?.id &&
      (activeProject?.owner?.id === user.id ||
        activeProject?.ownerId === user.id)
  );
  const isUserVerified = user?.identityVerified || false;

  // Use KYC-verified legalName when available; fall back to profile first + last name
  const verifiedLegalName =
    user?.legalName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    undefined;

  const projectId = activeProject?.id || "";

  const {
    useProjectAgreements,
    useEsignAgreement,
    useUploadAgreement,
    useUpdateAgreement,
    useDeleteAgreement,
  } = useAgreements(projectId);
  const uploadMutation = useUploadAgreement();
  const { data: apiAgreements = [], isLoading } = useProjectAgreements();

  // Modal flow state
  const [flowState, setFlowState] = useState<
    "idle" | "signing" | "confirming" | "success"
  >("idle");
  const [selectedAgreement, setSelectedAgreement] = useState<any>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState<any>(null);
  const [signedMeta, setSignedMeta] = useState<{
    date: string;
    time: string;
  } | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const deleteMutation = useDeleteAgreement(deletingId || "");
  const updateMutation = useUpdateAgreement(editingAgreement?.id || "");

  const handleUploadNewAgreement = async (file: File) => {
    if (!projectId) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      await uploadMutation.mutateAsync(formData);
      setIsCreateOpen(false);
    } catch (error) {
      console.error("Agreement upload failed:", error);
    }
  };

  const esignMutation = useEsignAgreement(
    selectedAgreement?.id || "",
    verifiedLegalName
  );

  const handleTriggerSign = (agreement: any) => {
    setSelectedAgreement(agreement);
    setFlowState("signing");
  };

  const handleConfirmSign = async () => {
    if (!selectedAgreement?.id) return;
    try {
      await esignMutation.mutateAsync(true);
      const now = new Date();
      setSignedMeta({
        date: now.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        time: now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
      setFlowState("success");
    } catch (err) {
      console.error("Failed to sign agreement:", err);
    }
  };

  const handleDelete = async (agreementId: string) => {
    setDeletingId(agreementId);
    try {
      await deleteMutation.mutateAsync();
    } finally {
      setDeletingId(null);
    }
  };

  const handleTriggerEdit = (agreement: any) => {
    setEditingAgreement(agreement);
  };

  const handleUpdateAgreement = async (file: File) => {
    if (!editingAgreement?.id) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      await updateMutation.mutateAsync(formData);
      setEditingAgreement(null);
    } catch (error) {
      console.error("Agreement update failed:", error);
    }
  };

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
      collaborators:
        activeProject?.collaborators?.map((c) => ({
          id: c.userId,
          name:
            c.user?.displayName ||
            c.user?.legalName ||
            c.user?.email?.split("@")[0] ||
            "User",
          image: c.user?.avatarUrl || undefined,
        })) || [],
      signatories: {
        completed: completedSignatories,
        total: totalSignatories,
      },
      lastUpdated: `Updated ${new Date(agreement.updatedAt).toLocaleDateString()}`,
      contentPreview: agreement.content
        ? [agreement.content]
        : ["No content preview available."],
      fileUrl: agreement.fileUrl || null,
      status: agreement.status,
      rawSignatures: agreement.signatures || [],
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
        {/* Page header with New Agreement button for owners */}
        {isOwner && agreementsList.length > 0 && (
          <div className="flex justify-end w-full">
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 bg-primary-green hover:bg-accent-green-success transition-colors px-6 py-3 rounded-full shadow-[0_4px_14px_rgba(115,191,68,0.3)]"
            >
              <FiPlus size={16} className="text-white" />
              <span className="font-raleway font-semibold text-[14px] text-white">
                New Agreement
              </span>
            </Button>
          </div>
        )}

        {agreementsList.length === 0 ? (
          <EmptyState
            icon={<FiFileText size={32} strokeWidth={1.5} />}
            title="No Agreements Found"
            description={
              isOwner
                ? "Create, send, and manage your contracts all in one place."
                : "There are currently no agreements to sign."
            }
            actionLabel={isOwner ? "New Agreement" : undefined}
            onAction={isOwner ? () => setIsCreateOpen(true) : undefined}
          />
        ) : (
          <div className="flex flex-col gap-10 w-full">
            {agreementsList.map((agreement) => (
              <AgreementCard
                key={agreement.id}
                agreement={agreement}
                isOwner={isOwner}
                currentUserId={user?.id || ""}
                isUserVerified={isUserVerified}
                onTriggerSign={handleTriggerSign}
                onEdit={handleTriggerEdit}
                onDelete={handleDelete}
                isDeleting={
                  deletingId === agreement.id && deleteMutation.isPending
                }
              />
            ))}
          </div>
        )}

        {/* Identity Verification */}
        <div className="flex flex-col w-full bg-black/20 border border-white/10 rounded-[30px] p-8 backdrop-blur-md">
          <h3 className="font-raleway font-semibold text-[20px] text-white mb-6">
            Identity Verification
          </h3>

          {isUserVerified ? (
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
          ) : (
            <div className="flex flex-col sm:flex-row items-start gap-4 w-full bg-accent-yellow/10 border border-accent-yellow/30 rounded-[30px] p-6">
              <div className="mt-0.5 shrink-0">
                <FiShield className="text-accent-yellow" size={24} />
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-raleway font-semibold text-[16px] text-accent-yellow">
                  Identity Not Verified
                </span>
                <span className="font-raleway font-normal text-[14px] text-white/80">
                  You must verify your identity with a government-issued ID
                  (e.g. NIN) to sign agreements.
                </span>
                <span className="font-raleway font-normal text-[14px] text-white/60">
                  Electronic signatures are only available to verified users.
                </span>
                <a
                  href="/settings/verification"
                  className="mt-2 w-max flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-yellow/20 border border-accent-yellow/40 hover:bg-accent-yellow/30 transition-colors"
                >
                  <FiAlertCircle className="text-accent-yellow" size={14} />
                  <span className="font-raleway font-semibold text-[13px] text-accent-yellow">
                    Verify Identity
                  </span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay components */}
      <SignAgreementOverlay
        isOpen={flowState === "signing"}
        onClose={() => setFlowState("idle")}
        onSign={() => setFlowState("confirming")}
        legalName={verifiedLegalName}
        isUserVerified={isUserVerified}
        fileUrl={selectedAgreement?.fileUrl || undefined}
        agreementTitle={selectedAgreement?.title}
      />

      <ConfirmSignatureOverlay
        isOpen={flowState === "confirming"}
        onClose={() => setFlowState("idle")}
        onConfirm={handleConfirmSign}
        isPending={esignMutation.isPending}
      />

      <SuccessSignatureOverlay
        isOpen={flowState === "success"}
        onClose={() => setFlowState("idle")}
        legalName={verifiedLegalName}
        date={signedMeta?.date}
        time={signedMeta?.time}
        project={selectedAgreement?.project}
      />

      <CreateAgreementOverlay
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onUpload={handleUploadNewAgreement}
        isPending={uploadMutation.isPending}
      />

      <EditAgreementOverlay
        isOpen={Boolean(editingAgreement)}
        onClose={() => setEditingAgreement(null)}
        onUpdate={handleUpdateAgreement}
        isPending={updateMutation.isPending}
        agreementTitle={editingAgreement?.title}
      />
    </div>
  );
}
