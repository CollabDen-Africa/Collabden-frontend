import type { DisputeType, DisputeStatus } from "@/services/admin/disputes.service";

export const DISPUTE_TYPE_LABELS: Record<DisputeType, string> = {
  PAYMENT: "Payment",
  ESCROW_MILESTONE: "Escrow Milestone",
  AGREEMENT: "Agreement",
  PROJECT_COLLABORATION: "Project Collaboration",
  USER_CONDUCT: "User Conduct",
};

export const DISPUTE_TYPE_COLORS: Record<DisputeType, string> = {
  PAYMENT: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  ESCROW_MILESTONE: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
  AGREEMENT: "bg-teal-500/15 text-teal-400 border border-teal-500/20",
  PROJECT_COLLABORATION: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20",
  USER_CONDUCT: "bg-red-500/15 text-red-400 border border-red-500/20",
};

export const DISPUTE_STATUS_LABELS: Record<DisputeStatus, string> = {
  OPEN: "Open",
  UNDER_REVIEW: "Under Review",
  AWAITING_RESPONSE: "Awaiting Response",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export const DISPUTE_STATUS_COLORS: Record<DisputeStatus, string> = {
  OPEN: "text-red-400",
  UNDER_REVIEW: "text-yellow-400",
  AWAITING_RESPONSE: "text-blue-400",
  RESOLVED: "text-emerald-400",
  CLOSED: "text-white/40",
};

export const DISPUTE_STATUS_DOT: Record<DisputeStatus, string> = {
  OPEN: "bg-red-400",
  UNDER_REVIEW: "bg-yellow-400",
  AWAITING_RESPONSE: "bg-blue-400",
  RESOLVED: "bg-emerald-400",
  CLOSED: "bg-white/30",
};
