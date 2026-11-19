"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { HiCheck, HiOutlineUserGroup, HiPlus, HiX } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { useConnections } from "@/hooks/connections/useConnections";

type SortMode = "az" | "za";

const nameFromEmail = (email?: string | null, fallback = "Collaborator") =>
  email?.split("@")[0] || fallback;

const displayNameFor = (connection: {
  displayName?: string | null;
  legalName?: string | null;
  email?: string | null;
}) =>
  connection.displayName?.trim() ||
  connection.legalName?.trim() ||
  nameFromEmail(connection.email);

export default function ConnectionsPage() {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("az");

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

  const filteredConnections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = connections.filter((connection) => {
      if (!query) return true;
      const name = displayNameFor(connection).toLowerCase();
      const email = (connection.email || "").toLowerCase();
      return name.includes(query) || email.includes(query);
    });

    const sorted = [...list].sort((a, b) => {
      const an = displayNameFor(a).toLowerCase();
      const bn = displayNameFor(b).toLowerCase();
      return sortMode === "az" ? an.localeCompare(bn) : bn.localeCompare(an);
    });

    return sorted;
  }, [connections, searchQuery, sortMode]);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 pb-10 pt-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-sans text-[28px] font-semibold leading-tight text-foreground md:text-[32px]">
            Connections
          </h1>
          <p className="font-sans text-[15px] font-medium text-foreground/60">
            Manage the people you collaborate with.
          </p>
        </div>
        <Link
          href="/marketplace"
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-full bg-primary-green px-5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-accent-green-success sm:self-auto"
        >
          <HiPlus size={18} />
          Find collaborators
        </Link>
      </div>

      {/* Pending requests — only shown when there are any, or during initial load */}
      {(isLoading || pendingRequests.length > 0) && (
        <section className="rounded-[24px] border border-foreground/10 bg-foreground/10 p-5 backdrop-blur-md sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-green/20 text-primary-green">
                <HiOutlineUserGroup size={20} />
              </div>
              <div>
                <h2 className="font-sans text-[16px] font-semibold text-foreground">Connection requests</h2>
                <p className="font-sans text-[13px] text-foreground/60">Review invitations waiting for your response.</p>
              </div>
            </div>
            {pendingRequests.length > 0 && (
              <span className="rounded-full bg-primary-green/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary-green">
                {pendingRequests.length} pending
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-6">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground/20 border-t-primary-green" />
            </div>
          ) : (
            <div className="flex max-h-[280px] flex-col gap-2 overflow-y-auto pr-1">
              {pendingRequests.map((request) => {
                const sender = request.sender;
                const name = sender
                  ? displayNameFor(sender)
                  : nameFromEmail(sender?.email, "A collaborator");
                const isProcessing = processingId === request.id;
                const profileHref = sender?.id ? `/profile?id=${encodeURIComponent(sender.id)}` : null;
                return (
                  <div
                    key={request.id}
                    className="flex flex-col gap-3 rounded-2xl border border-foreground/10 bg-background/40 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {profileHref ? (
                        <Link href={profileHref} className="shrink-0 rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-green/60">
                          <Avatar name={name} src={sender?.avatarUrl} className="h-10 w-10 text-sm" />
                        </Link>
                      ) : (
                        <Avatar name={name} src={sender?.avatarUrl} className="h-10 w-10 text-sm" />
                      )}
                      <div className="min-w-0">
                        {profileHref ? (
                          <Link href={profileHref} className="truncate font-sans text-[14px] font-semibold text-foreground hover:text-primary-green">
                            {name}
                          </Link>
                        ) : (
                          <p className="truncate font-sans text-[14px] font-semibold text-foreground">{name}</p>
                        )}
                        <p className="truncate text-[12px] text-foreground/60">
                          {sender?.email || "Sent you a connection request"}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        disabled={isProcessing}
                        variant="primary"
                        size="sm"
                        icon={HiCheck}
                        iconPosition="left"
                        onClick={() => handleResponse(request.id, "ACCEPTED")}
                      >
                        {isProcessing ? "Saving..." : "Accept"}
                      </Button>
                      <Button
                        disabled={isProcessing}
                        variant="outline"
                        size="sm"
                        icon={HiX}
                        iconPosition="left"
                        onClick={() => handleResponse(request.id, "REJECTED")}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Your connections */}
      <section className="rounded-[24px] border border-foreground/10 bg-foreground/10 p-5 backdrop-blur-md sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-3">
            <h2 className="font-sans text-[16px] font-semibold text-foreground">Your connections</h2>
            <span className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-[12px] font-semibold text-foreground/70">
              {connections.length}
            </span>
          </div>

          {connections.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-full border border-foreground/10 bg-background/40 px-4 focus-within:border-primary-green/70 sm:w-64 sm:flex-initial">
                <FiSearch size={14} className="shrink-0 text-foreground/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search connections..."
                  className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground placeholder:text-foreground/40 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setSortMode((prev) => (prev === "az" ? "za" : "az"))}
                className="flex h-10 shrink-0 items-center gap-1 rounded-full border border-foreground/10 bg-background/40 px-3 text-[12px] font-semibold text-foreground/70 transition-colors hover:border-primary-green/50 hover:text-foreground"
                title="Toggle sort order"
              >
                {sortMode === "az" ? "A–Z" : "Z–A"}
              </button>
            </div>
          )}
        </div>

        {!isLoading && connections.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-foreground/15 px-5 py-10 text-center">
            <p className="text-sm text-foreground/55">Your accepted connections will appear here.</p>
            <Link href="/marketplace" className="mt-3 inline-block text-sm font-semibold text-primary-green hover:underline">
              Browse the marketplace
            </Link>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-10">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground/20 border-t-primary-green" />
          </div>
        ) : filteredConnections.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-foreground/15 px-5 py-8 text-center text-sm text-foreground/55">
            No connections match &quot;{searchQuery}&quot;.
          </p>
        ) : (
          <div className="max-h-[560px] overflow-y-auto rounded-2xl border border-foreground/10 bg-background/30">
            <ul className="divide-y divide-foreground/5">
              {filteredConnections.map((connection) => {
                const name = displayNameFor(connection);
                const profileHref = `/profile?id=${encodeURIComponent(connection.id)}`;
                const messageHref = `/messages?userId=${encodeURIComponent(connection.id)}&name=${encodeURIComponent(name)}${connection.avatarUrl ? `&avatar=${encodeURIComponent(connection.avatarUrl)}` : ""}`;
                return (
                  <li
                    key={connection.id}
                    className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-foreground/5"
                  >
                    <Link
                      href={profileHref}
                      className="shrink-0 rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-green/60"
                      title={`View ${name}'s profile`}
                    >
                      <Avatar name={name} src={connection.avatarUrl} className="h-10 w-10 text-sm" />
                    </Link>
                    <Link href={profileHref} className="min-w-0 flex-1">
                      <p className="truncate font-sans text-[14px] font-semibold text-foreground group-hover:text-primary-green">
                        {name}
                      </p>
                      <p className="truncate text-[12px] text-foreground/60">{connection.email}</p>
                    </Link>
                    <Link
                      href={messageHref}
                      className="rounded-full border border-foreground/10 bg-background/60 px-3 py-1.5 text-[12px] font-semibold text-foreground/70 opacity-0 transition-all hover:border-primary-green/60 hover:text-primary-green group-hover:opacity-100 focus:opacity-100"
                    >
                      Message
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {connections.length > 0 && !isLoading && (
          <p className="mt-3 text-[12px] text-foreground/50">
            Showing {filteredConnections.length} of {connections.length}
          </p>
        )}
      </section>
    </div>
  );
}
