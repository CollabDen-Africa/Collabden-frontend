"use client";

import React, { useState } from "react";
import {
  FiUsers,
  FiSearch,
  FiPlusCircle,
  FiTrash2,
  FiUserCheck,
  FiShield,
  FiClock,
} from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import Select from "@/components/ui/Select";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { Project } from "@/types/api.types";
import { useProjects } from "@/hooks/projects/useProjects";
import { useConnections } from "@/hooks/connections/useConnections";

interface MembersSettingsTabProps {
  project?: Project;
  onSuccess?: (message?: string) => void;
  onError?: (message: string) => void;
}

export default function MembersSettingsTab({
  project,
  onSuccess,
  onError,
}: MembersSettingsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConnectionId, setSelectedConnectionId] = useState("");
  const [memberToConfirm, setMemberToConfirm] = useState<{
    id: string;
    name: string;
    email: string;
    isPending: boolean;
  } | null>(null);

  const { useInviteCollaborator, useRemoveCollaborator } = useProjects();
  const inviteMutation = useInviteCollaborator(project?.id || "");
  const removeMutation = useRemoveCollaborator(project?.id || "");

  const { useUserConnections } = useConnections();
  const { data: connections = [] } = useUserConnections(
    project?.id ? { projectId: project.id } : undefined
  );

  const projectCollaborators = project?.collaborators || [];
  const members = projectCollaborators.map((c) => {
    const isOwner = c.role === "OWNER";
    const name =
      isOwner && project?.owner
        ? project.owner.displayName ||
          project.owner.legalName ||
          project.owner.email.split("@")[0]
        : c.user?.displayName ||
          c.user?.legalName ||
          (c.user?.email ? c.user.email.split("@")[0] : "Collaborator");
    const email =
      isOwner && project?.owner?.email
        ? project.owner.email
        : c.user?.email || "No email";
    const avatarUrl = isOwner
      ? project?.owner?.avatarUrl || c.user?.avatarUrl || null
      : c.user?.avatarUrl || null;
    const isPending = !isOwner && c.inviteStatus === "PENDING" && !c.isActive;

    return {
      id: c.userId || c.user?.id || c.id,
      name,
      email,
      role: isOwner ? "Owner" : isPending ? "Pending Invite" : "Collaborator",
      isOwner,
      isPending,
      avatarUrl,
    };
  });

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = async () => {
    if (!selectedConnectionId || !project?.id) return;
    try {
      await inviteMutation.mutateAsync({
        collaboratorId: selectedConnectionId,
      });
      setSelectedConnectionId("");
      onSuccess?.("Invitation sent successfully.");
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to invite collaborator.";
      console.error("Failed to invite collaborator:", err);
      onError?.(errMsg);
    }
  };

  const handleConfirmRemove = async () => {
    if (!memberToConfirm || !project?.id) return;
    try {
      await removeMutation.mutateAsync(memberToConfirm.id);
      const isPending = memberToConfirm.isPending;
      setMemberToConfirm(null);
      onSuccess?.(
        isPending
          ? "Invitation cancelled successfully."
          : "Collaborator removed successfully."
      );
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        (memberToConfirm.isPending
          ? "Failed to cancel invitation."
          : "Failed to remove collaborator.");
      console.error("Failed to remove collaborator:", err);
      onError?.(errMsg);
    }
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-white/60">No active project selected.</p>
      </div>
    );
  }

  // Options for custom select
  const connectionOptions = connections.map((conn) => ({
    label:
      conn.displayName || conn.legalName
        ? `${conn.displayName || conn.legalName} (${conn.email})`
        : conn.email,
    value: conn.id,
  }));

  return (
    <div className="w-full flex flex-col gap-[28px] lg:gap-[32px]">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center p-[20px] lg:p-[24px] pr-[56px] sm:pr-[64px] gap-[16px] bg-black/20 rounded-[24px] border border-white/5 shadow-inner">
        <div className="w-[54px] h-[54px] bg-white/10 rounded-[15px] flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
          <FiUsers className="text-white" size={24} />
        </div>
        <div className="flex flex-col justify-center gap-[4px]">
          <h2 className="font-raleway font-semibold text-[22px] lg:text-[25px] leading-[29px] text-white">
            Members & Roles
          </h2>
          <p className="font-raleway font-medium text-[14px] lg:text-[16px] leading-[21px] text-white/60">
            Manage who has access to this project and view collaborator roles.
          </p>
        </div>
      </div>

      {/* Invite Collaborator Section */}
      <div className="flex flex-col gap-[16px] w-full bg-black/20 border border-white/5 p-6 rounded-[24px]">
        <div className="flex flex-col gap-1">
          <h3 className="font-raleway font-bold text-[16px] text-white">
            Invite Collaborator
          </h3>
          <p className="font-raleway font-normal text-[13px] text-white/60">
            Select a connected colleague to invite them to this project.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-[16px] items-stretch sm:items-center mt-1">
          <div className="flex-1 relative min-h-[44px]">
            <Select
              options={connectionOptions}
              value={selectedConnectionId}
              onChange={(val) => setSelectedConnectionId(val)}
              placeholder={
                connectionOptions.length === 0
                  ? "All connected colleagues are already in this project"
                  : "Choose a connected colleague..."
              }
              variant="glass"
              disabled={connectionOptions.length === 0}
            />
          </div>
          <button
            onClick={handleInvite}
            disabled={
              !selectedConnectionId ||
              inviteMutation.isPending ||
              connectionOptions.length === 0
            }
            className="bg-primary-green hover:bg-accent-green-success disabled:opacity-50 disabled:cursor-not-allowed text-white font-sans font-semibold text-[14px] px-[24px] py-[12px] rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(115,191,68,0.3)] flex items-center justify-center gap-2 shrink-0"
          >
            <FiPlusCircle size={16} />
            {inviteMutation.isPending ? "Inviting..." : "Invite"}
          </button>
        </div>
      </div>

      {/* Search and Member List Section */}
      <div className="flex flex-col w-full gap-[16px]">
        <div className="w-full h-[50px] bg-white/10 border border-transparent focus-within:border-primary-green focus-within:bg-white/15 rounded-full flex items-center px-[20px] transition-all duration-300 shadow-sm group">
          <FiSearch
            className="text-white/50 group-focus-within:text-primary-green shrink-0 mr-[12px] transition-colors"
            size={18}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none font-raleway font-medium text-[16px] text-white placeholder:text-white/50"
            placeholder="Search project members"
          />
        </div>

        {/* Members List */}
        <div className="flex flex-col w-full gap-[12px]">
          {filteredMembers.length === 0 ? (
            <div className="w-full py-8 text-center text-white/50 font-raleway font-medium bg-black/10 border border-white/5 rounded-[20px]">
              No members found matching &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between w-full p-[16px] lg:px-[24px] lg:py-[18px] bg-black/10 hover:bg-black/20 border border-white/5 hover:border-white/10 rounded-[24px] transition-all duration-300"
              >
                {/* Left: Avatar & Info */}
                <div className="flex items-center gap-[16px] min-w-0">
                  <Avatar
                    name={member.name}
                    src={member.avatarUrl}
                    className="w-[44px] h-[44px] text-[15px] border border-white/15"
                  />
                  <div className="flex flex-col gap-[2px] min-w-0">
                    <div className="flex items-center gap-[8px] flex-wrap">
                      <span className="font-raleway font-bold text-[15px] lg:text-[17px] text-white truncate">
                        {member.name}
                      </span>
                    </div>
                    <span className="font-raleway font-medium text-[13px] text-white/60 truncate">
                      {member.email}
                    </span>
                  </div>
                </div>

                {/* Right: Real Role Badge & Action Button */}
                <div className="flex items-center gap-[12px] sm:gap-[16px] shrink-0">
                  {member.isOwner ? (
                    <span className="inline-flex items-center gap-1.5 bg-primary-green/15 border border-primary-green/30 text-primary-green text-[12px] font-bold px-[12px] py-[5px] rounded-full shadow-sm">
                      <FiShield size={13} />
                      Owner
                    </span>
                  ) : member.isPending ? (
                    <span className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[12px] font-semibold px-[12px] py-[5px] rounded-full">
                      <FiClock size={13} />
                      Pending Invite
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-white/80 text-[12px] font-medium px-[12px] py-[5px] rounded-full">
                      <FiUserCheck size={13} className="text-white/60" />
                      Collaborator
                    </span>
                  )}

                  {!member.isOwner && (
                    <button
                      onClick={() =>
                        setMemberToConfirm({
                          id: member.id,
                          name: member.name,
                          email: member.email,
                          isPending: member.isPending,
                        })
                      }
                      disabled={removeMutation.isPending}
                      className="w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                      title={
                        member.isPending
                          ? "Cancel invitation"
                          : "Remove collaborator"
                      }
                      aria-label={
                        member.isPending
                          ? "Cancel invitation"
                          : "Remove collaborator"
                      }
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={Boolean(memberToConfirm)}
        onClose={() => setMemberToConfirm(null)}
        onConfirm={handleConfirmRemove}
        title={
          memberToConfirm?.isPending
            ? "Cancel Invitation"
            : "Remove Collaborator"
        }
        description={
          memberToConfirm?.isPending ? (
            <>
              Are you sure you want to cancel the pending invitation for{" "}
              <span className="text-white font-semibold">
                {memberToConfirm?.name || memberToConfirm?.email}
              </span>
              ? They will no longer be able to accept this project invitation.
            </>
          ) : (
            <>
              Are you sure you want to remove{" "}
              <span className="text-white font-semibold">
                {memberToConfirm?.name || memberToConfirm?.email}
              </span>{" "}
              from this project? They will lose access to project files, tasks,
              and workspace features.
            </>
          )
        }
        confirmText={
          memberToConfirm?.isPending
            ? "Cancel Invitation"
            : "Remove Collaborator"
        }
        cancelText="Keep"
        variant="danger"
        isLoading={removeMutation.isPending}
      />
    </div>
  );
}