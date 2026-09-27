"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HiCheck, HiOutlineUserGroup, HiPlus, HiX } from "react-icons/hi";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { useConnections } from "@/hooks/connections/useConnections";

export default function ConnectionsPage() {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { useUserConnections, usePendingRequests, useRespondToConnectionRequest } = useConnections();
  const { data: connections = [], isLoading: areConnectionsLoading } = useUserConnections();
  const { data: pendingRequests = [], isLoading: areRequestsLoading } = usePendingRequests();
  const respondMutation = useRespondToConnectionRequest();

  const handleResponse = (requestId: string, status: "ACCEPTED" | "REJECTED") => {
    setProcessingId(requestId);
    respondMutation.mutate(
      { id: requestId, data: { status } },
      { onSettled: () => setProcessingId(null) },
    );
  };

  const isLoading = areConnectionsLoading || areRequestsLoading;

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 pb-10 pt-4">
      <div>
        <div>
          <h1 className="font-sans text-[28px] font-semibold leading-tight text-foreground md:text-[32px]">
            Connections
          </h1>
          <p className="font-sans text-[16px] font-medium text-foreground/60">
            Manage the people you collaborate with.
          </p>
        </div>
      </div>

      <section className="rounded-[30px] border border-foreground/10 bg-foreground/10 p-5 backdrop-blur-md sm:p-7">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-green/20 text-primary-green">
              <HiOutlineUserGroup size={21} />
            </div>
            <div>
              <h2 className="font-sans text-[18px] font-semibold text-foreground">Connection requests</h2>
              <p className="font-sans text-[13px] text-foreground/60">Review invitations waiting for your response.</p>
            </div>
          </div>
          {pendingRequests.length > 0 && (
            <span className="rounded-full bg-primary-green/20 px-3 py-1 text-[12px] font-bold uppercase tracking-wide text-primary-green">
              {pendingRequests.length} pending
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10"><div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground/20 border-t-primary-green" /></div>
        ) : pendingRequests.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-foreground/15 px-5 py-8 text-center text-sm text-foreground/55">
            No connection requests waiting for you.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {pendingRequests.map((request) => {
              const name = request.sender?.email?.split("@")[0] || "A collaborator";
              const isProcessing = processingId === request.id;
              return (
                <div key={request.id} className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-background/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={name} className="h-11 w-11 text-sm" />
                    <div className="min-w-0">
                      <p className="truncate font-sans text-[15px] font-semibold text-foreground">{name}</p>
                      <p className="truncate text-[13px] text-foreground/60">{request.sender?.email || "Sent you a connection request"}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button disabled={isProcessing} variant="primary" size="sm" icon={HiCheck} iconPosition="left" onClick={() => handleResponse(request.id, "ACCEPTED")}>
                      {isProcessing ? "Saving..." : "Accept"}
                    </Button>
                    <Button disabled={isProcessing} variant="outline" size="sm" icon={HiX} iconPosition="left" onClick={() => handleResponse(request.id, "REJECTED")}>
                      Decline
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-[30px] border border-foreground/10 bg-foreground/10 p-5 backdrop-blur-md sm:p-7">
        <div className="mb-6">
          <div>
            <h2 className="font-sans text-[18px] font-semibold text-foreground">Your connections</h2>
            <p className="font-sans text-[13px] text-foreground/60">People who have accepted your invitation, or whose invitation you accepted.</p>
          </div>
        </div>

        {!isLoading && connections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-foreground/15 px-5 py-8 text-center">
            <p className="text-sm text-foreground/55">Your accepted connections will appear here.</p>
            <Link href="/marketplace" className="mt-3 inline-block text-sm font-semibold text-primary-green hover:underline">Browse the marketplace</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {connections.map((connection) => {
              const name = connection.email?.split("@")[0] || "Collaborator";
              return (
                <div key={connection.id} className="flex items-center gap-3 rounded-2xl border border-foreground/10 bg-background/40 p-4">
                  <Avatar name={name} className="h-11 w-11 text-sm" />
                  <div className="min-w-0">
                    <p className="truncate font-sans text-[15px] font-semibold text-foreground">{name}</p>
                    <p className="truncate text-[13px] text-foreground/60">{connection.email}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex justify-end border-t border-foreground/10 pt-5">
          <Link
            href="/marketplace"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary-green px-5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-accent-green-success"
          >
            <HiPlus size={18} />
            Find collaborators
          </Link>
        </div>
      </section>
    </div>
  );
}
