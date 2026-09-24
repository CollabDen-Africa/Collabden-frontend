"use client";

import React from "react";
import { useProjects } from "@/hooks/projects/useProjects";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import { HiCheck, HiX, HiOutlineMail } from "react-icons/hi";

export default function PendingInvitesBanner() {
  const { useMyInvites, useRespondToInvite } = useProjects();
  const { data: invites = [], isLoading } = useMyInvites();
  const respondMutation = useRespondToInvite();

  if (isLoading || !invites || invites.length === 0) {
    return null;
  }

  const handleRespond = (projectId: string, action: "ACCEPT" | "DECLINE") => {
    respondMutation.mutate({ projectId, action });
  };

  return (
    <div className="w-full bg-gradient-to-r from-primary-green/10 via-foreground/5 to-background border border-primary-green/30 backdrop-blur-md rounded-[24px] p-6 sm:p-8 flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-green/20 text-primary-green flex items-center justify-center">
            <HiOutlineMail size={22} />
          </div>
          <div>
            <h2 className="font-sans font-semibold text-[18px] sm:text-[20px] text-foreground">
              Pending Project Invitations
            </h2>
            <p className="font-sans font-medium text-[13px] sm:text-[14px] text-foreground/60">
              You have {invites.length} pending project {invites.length === 1 ? "invitation" : "invitations"}
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-primary-green/20 text-primary-green font-sans font-bold text-[12px] rounded-full uppercase tracking-wider">
          {invites.length} Pending
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {invites.map((invite) => {
          const owner = invite.project?.owner;
          const ownerName = owner?.displayName || owner?.legalName || owner?.email || "Project Owner";

          return (
            <div
              key={invite.id}
              className="bg-background/60 border border-foreground/10 rounded-[18px] p-5 flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-sans font-semibold text-[16px] text-foreground leading-snug">
                    {invite.project?.name}
                  </h3>
                  <span className="font-sans text-[12px] px-2.5 py-0.5 rounded-md bg-foreground/10 text-foreground/70 shrink-0">
                    {invite.project?.genre}
                  </span>
                </div>
                {invite.project?.description && (
                  <p className="font-sans text-[13px] text-foreground/60 line-clamp-2">
                    {invite.project.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <Avatar name={ownerName} src={owner?.avatarUrl || undefined} className="w-6 h-6 text-[10px]" />
                  <span className="font-sans text-[12px] text-foreground/70">
                    Invited by <strong className="text-foreground">{ownerName}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-foreground/10">
                <Button
                  variant="primary"
                  size="sm"
                  icon={HiCheck}
                  disabled={respondMutation.isPending}
                  onClick={() => handleRespond(invite.projectId, "ACCEPT")}
                  className="flex-1 h-9 text-[13px]"
                >
                  Accept
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={HiX}
                  disabled={respondMutation.isPending}
                  onClick={() => handleRespond(invite.projectId, "DECLINE")}
                  className="flex-1 h-9 text-[13px] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
                >
                  Decline
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
