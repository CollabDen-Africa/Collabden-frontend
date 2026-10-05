"use client";

import React, { useState } from "react";
import { FiKey, FiShield, FiAlertTriangle, FiTrash2 } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import Select from "@/components/ui/Select";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { Project } from "@/types/api.types";
import { useProjects } from "@/hooks/projects/useProjects";
import { useRouter } from "next/navigation";

interface OwnershipSettingsTabProps {
  project?: Project;
  onSuccess?: (message?: string) => void;
  onError?: (message: string) => void;
}

export default function OwnershipSettingsTab({
  project,
  onSuccess,
  onError,
}: OwnershipSettingsTabProps) {
  const router = useRouter();
  const [selectedCollaborator, setSelectedCollaborator] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { useDeleteProject } = useProjects();
  const deleteMutation = useDeleteProject();

  if (!project) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-white/60">No active project selected.</p>
      </div>
    );
  }

  // Get list of collaborator names for the transfer dropdown
  const collaborators =
    project.collaborators
      ?.filter((c) => c.role !== "OWNER" && c.isActive)
      .map((c) => c.user?.email.split("@")[0] || "Collaborator") || [];

  // Determine owner name
  const ownerName = project.owner
    ? `${(project.owner as any).firstName || ""} ${(project.owner as any).lastName || ""}`.trim() ||
      project.owner.displayName ||
      project.owner.legalName ||
      project.owner.email
    : "Owner";

  const handleConfirmDelete = async () => {
    if (!project?.id) return;
    try {
      await deleteMutation.mutateAsync(project.id);
      setIsDeleteModalOpen(false);
      onSuccess?.("Project deleted successfully.");
      router.push("/dashboard");
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete project.";
      console.error("Failed to delete project:", err);
      onError?.(errMsg);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-[28px] lg:gap-[32px]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-[20px] lg:p-[24px] pr-[56px] sm:pr-[64px] gap-[16px] bg-black/20 rounded-[24px] border border-white/5 shadow-inner">
        <div className="w-[54px] h-[54px] bg-white/10 rounded-[15px] flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
          <FiKey className="text-white transform -scale-x-100" size={24} />
        </div>
        <div className="flex flex-col justify-center gap-[4px]">
          <h2 className="font-raleway font-semibold text-[22px] lg:text-[25px] leading-[29px] text-white">
            Ownership
          </h2>
          <p className="font-raleway font-medium text-[14px] lg:text-[16px] leading-[21px] text-white/60">
            Transfer full control of {project.name} to another collaborator.
          </p>
        </div>
      </div>

        {/* Transfer Ownership Form Section */}
        <div className="flex flex-col gap-[32px] w-full">
          
          {/* Current Owner Display */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px] w-full max-w-[851px]">
            <div className="flex flex-col gap-[16px]">
              <span className="font-raleway font-bold text-[18px] text-white">
                Current Owner
              </span>
              
              <div className="flex items-center gap-[12px]">
                <div className="relative">
                  <Avatar
                    name={ownerName}
                    src={project.owner?.avatarUrl || undefined}
                    className="w-[44px] h-[44px] text-[15px] border-[1.5px] border-primary-green"
                  />
                  {/* Green Status Dot */}
                  <div className="absolute bottom-0 right-0 w-[14px] h-[14px] bg-primary-green rounded-full border-2 border-[#121A1F]" />
                </div>
                
                <div className="flex items-center gap-[10px]">
                  <span className="font-raleway font-medium text-[15px] text-white">
                    {ownerName}
                  </span>
                </div>
              </div>
            </div>

            {/* Shield/Owner Badge */}
            <div className="w-[36px] h-[36px] rounded-full bg-primary-green/10 border border-primary-green flex items-center justify-center shrink-0">
              <FiShield className="text-white" size={16} />
            </div>
          </div>

          {/* Transfer Selection */}
          <div className="flex flex-col gap-[16px] w-full">
            <div className="flex flex-col gap-[6px]">
              <label className="font-raleway font-bold text-[18px] text-white">
                Transfer ownership to
              </label>
              <span className="font-raleway font-normal text-[15px] text-white/60">
                Select an existing collaborator to become the new owner.
              </span>
            </div>
            
            {/* Custom Select Dropdown */}
            <div className="relative w-full h-[50px]">
              <Select 
                options={collaborators}
                value={selectedCollaborator}
                onChange={setSelectedCollaborator}
                placeholder="Choose a collaborator..."
                variant="glass"
              />
            </div>
          </div>

        </div>

        {/* Transfer Warning Box */}
        <div className="flex flex-col gap-[24px] w-full max-w-[605px] bg-[#FF0000]/4 border border-[#FF0000]/60 rounded-[30px] p-[24px]">
          
          <div className="flex flex-col gap-[16px]">
            <h3 className="font-raleway font-semibold text-[20px] leading-[22px] text-white">
              This action transfers full project ownership
            </h3>
            <p className="font-raleway font-normal text-[16px] lg:text-[18px] leading-[22px] text-white/60">
              You&apos;ll be downgraded to Admin. The new owner gains full control, including deletion rights. This action cannot be undone without the new owner&apos;s consent.
            </p>
          </div>

          <button 
            type="button"
            className="flex items-center justify-center gap-[8px] bg-[#FC110A] hover:bg-[#FC110A]/80 transition-colors duration-300 rounded-[30px] w-fit px-[24px] py-[10px] shadow-lg opacity-50 cursor-not-allowed"
            disabled={true}
          >
            <FiAlertTriangle className="text-white" size={18} />
            <span className="font-raleway font-semibold text-[16px] lg:text-[18px] text-white">
              Transfer Ownership (Soon)
            </span>
          </button>

        </div>

        {/* Danger Zone / Delete Project Box */}
        <div className="flex flex-col gap-[24px] w-full max-w-[605px] bg-[#FF0000]/4 border border-[#FF0000]/60 rounded-[30px] p-[24px]">
          
          <div className="flex flex-col gap-[16px]">
            <h3 className="font-raleway font-semibold text-[20px] leading-[22px] text-[#FC110A]">
              Delete Project
            </h3>
            <p className="font-raleway font-normal text-[16px] lg:text-[18px] leading-[22px] text-white/60">
              Once you delete a project, it will be soft-deleted. All collaborators will lose access immediately. This action is irreversible.
            </p>
          </div>

          <button 
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={deleteMutation.isPending}
            className="flex items-center justify-center gap-[8px] bg-[#FC110A] hover:bg-[#FC110A]/80 transition-colors duration-300 rounded-[30px] w-fit px-[24px] py-[10px] shadow-lg disabled:opacity-50 cursor-pointer"
          >
            <FiTrash2 className="text-white" size={18} />
            <span className="font-raleway font-semibold text-[16px] lg:text-[18px] text-white">
              Delete Project
            </span>
          </button>

        </div>

      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Project?"
        description={
          <>
            Are you sure you want to delete{" "}
            <span className="text-white font-semibold">{project.name}</span>?
            This project will be soft-deleted and all collaborators will lose
            access immediately. This action cannot be undone.
          </>
        }
        confirmText="Delete Project"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}