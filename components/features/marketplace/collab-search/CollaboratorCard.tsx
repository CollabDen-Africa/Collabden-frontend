"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { HiHeart, HiBadgeCheck } from "react-icons/hi";
import { useConnections } from "@/hooks/connections/useConnections";
import { getErrorMessage } from "@/lib/error-handler";
import { useAuth } from "@/context/AuthContext";

interface CollaboratorCardProps {
  userId: string;
  name: string;
  role: string;
  bio: string;
  genres: string[];
  image?: string;
  openToCollaborate?: boolean;
  isVerified?: boolean;
}

export default function CollaboratorCard({ userId, name, role, bio, genres, image, openToCollaborate, isVerified = false }: CollaboratorCardProps) {
  const [isRequested, setIsRequested] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: "success" | "error" | "info" } | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user } = useAuth();
  const { useUserConnections, usePendingRequests, useSendConnectionRequest } = useConnections();
  const { data: connections = [] } = useUserConnections();
  const { data: pendingRequests = [] } = usePendingRequests();
  const sendRequestMutation = useSendConnectionRequest();

  const isConnected = useMemo(
    () => connections.some((connection) => connection.id === userId),
    [connections, userId],
  );
  const hasIncomingRequest = useMemo(
    () => pendingRequests.some(
      (request) => request.senderId === userId || request.sender?.id === userId,
    ),
    [pendingRequests, userId],
  );
  const hasOutgoingRequest = useMemo(
    () => pendingRequests.some(
      (request) =>
        request.senderId === user?.id &&
        (request.receiverId === userId || request.receiver?.id === userId),
    ),
    [pendingRequests, user?.id, userId],
  );
  const hasPendingRequest = isRequested || hasOutgoingRequest;
  const isPending = sendRequestMutation.isPending;
  const isDisabled = isConnected || isPending;
  const buttonLabel = isConnected
    ? "Connected"
    : isPending
      ? "Connecting..."
      : hasPendingRequest || hasIncomingRequest
        ? "Pending"
        : "Connect";

  const showToast = (message: string, tone: "success" | "error" | "info") => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, tone });
    toastTimeoutRef.current = setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => () => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
  }, []);

  const handleConnect = () => {
    if (isPending) return;

    if (hasPendingRequest) {
      showToast("Connection invitation is pending.", "info");
      return;
    }

    if (hasIncomingRequest) {
      showToast("This creator has already sent you a connection invitation.", "info");
      return;
    }

    if (isConnected) return;

    sendRequestMutation.mutate(
      { receiverId: userId },
      {
        onSuccess: () => {
          setIsRequested(true);
          showToast("Connection invitation sent successfully.", "success");
        },
        onError: (error) => {
          const message = getErrorMessage(error);
          const isDuplicateRequest = /already|exists|duplicate|pending/i.test(message);
          showToast(
            isDuplicateRequest
              ? "Connection invitation already sent."
              : `Unable to send invitation. ${message}`,
            isDuplicateRequest ? "info" : "error",
          );
        },
      },
    );
  };

  return (
    <div className="relative w-full max-w-90.5 min-h-110.25 bg-black/15 border border-border-muted/15 rounded-[47px] flex flex-col mx-auto overflow-hidden">
      
      {/* --- TOP SECTION --- */}
      <div className="flex flex-col items-center pt-13.25 px-5 relative flex-1">
        
        {/* Status Pill */}
        <div className="absolute top-7 left-6.5 flex items-center justify-center px-2 py-1.25 border-[0.6px] border-primary-green rounded-full">
          <span className="font-sans font-medium text-[9px] sm:text-[9.4px] leading-none text-primary-green">
            {openToCollaborate ? "Open to collaborate" : "Not currently available"}
          </span>
        </div>

        {/* Avatar */}
        <div className="w-15 h-15 rounded-full border-[1.9px] border-primary-green overflow-hidden shadow-sm shrink-0">
          <Avatar name={name} src={image} className="w-full h-full object-cover" />
        </div>

        {/* Name & Role */}
        <div className="flex flex-col items-center w-full mt-3.75">
          <div className="flex items-center gap-1">
            <h3 className="font-sans font-extrabold text-[17px] sm:text-[18.8px] leading-tight text-white tracking-tight text-center">
              {name}
            </h3>
            {isVerified && <HiBadgeCheck className="text-primary-green shrink-0" />}
          </div>
          <span className="font-sans font-light text-[11px] sm:text-[11.3px] leading-tight text-white/80 text-center mt-1.5">
            {role}
          </span>
        </div>
        
        {/* Bio */}
        <p className="font-sans font-normal text-[11px] sm:text-[11.3px] leading-snug text-white text-center w-full line-clamp-2 mt-3.75">
          {bio}
        </p>

        {/* Genres */}
        <div className="flex flex-wrap items-center justify-center gap-[7.5px] w-full mt-3.75">
          {genres.map((genre, idx) => (
            <span key={idx} className="flex items-center justify-center px-2.25 py-[4.5px] bg-black/20 rounded-full font-sans font-medium text-[9px] sm:text-[9.4px] leading-none text-white/60">
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="w-full shrink-0">
        
        {/* Cutout */}
        <div className="relative w-full h-35 bg-[radial-gradient(circle_at_50%_0px,transparent_25px,#0000006B_23px)] rounded-t-[23.5px] rounded-b-[42.3px] flex flex-col justify-start z-10">

          {/* The Orb */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4.25 w-[34.7px] h-[34.7px] bg-primary-green rounded-full flex items-center justify-center z-20 shadow-[0_3px_8px_rgba(0,0,0,0.5)]">
             <HiHeart className="text-white" size={14} />
          </div>

          {/* Stats Row */}
          <div className="w-full px-5.5 mt-4 mb-9.5 text-center text-[11px] text-white/60">Marketplace profile</div>

          {/* Action Buttons Row */}
          <div className="w-full flex items-center justify-center gap-2.75 z-20 px-4">
            <Button 
              variant="primary" 
              disabled={isDisabled}
              onClick={handleConnect}
              className="flex-1 px-2! py-[7.5px] flex items-center justify-center hover:bg-accent-green-success! transition-colors"
            >
              <span className="font-sans font-medium text-[9.4px] leading-none text-white whitespace-nowrap">
                {buttonLabel}
              </span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 px-2! py-[7.5px] border-[0.75px] flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <span className="font-sans font-medium text-[9.4px] leading-none text-white whitespace-nowrap">
                View Profile
              </span>
            </Button>
          </div>
          
        </div>
      </div>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed right-5 top-5 z-[100] max-w-sm rounded-xl border px-4 py-3 text-sm font-medium shadow-xl backdrop-blur-md ${
            toast.tone === "success"
              ? "border-primary-green/60 bg-primary-green/20 text-white"
              : toast.tone === "error"
                ? "border-red-400/60 bg-red-950/90 text-red-100"
                : "border-white/30 bg-black/80 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
