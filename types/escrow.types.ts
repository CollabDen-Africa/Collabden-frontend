export interface Escrow {
  id: string;
  projectId: string;
  agreementId: string;
  totalAmount: number;
  fundedAmount: number;
  releasedAmount: number;
  status: "PENDING_FUNDING" | "FUNDED" | "LOCKED" | "COMPLETED";
  reviewPeriodDays: number;
  createdAt: string;
}

export interface EscrowMilestone {
  id: string;
  title: string;
  amount: number;
  status: "PENDING" | "IN_PROGRESS" | "SUBMITTED" | "AWAITING_REVIEW" | "APPROVED" | "PAYMENT_RELEASED" | "DISPUTED";
  dueDate: string | null;
  submittedAt: string | null;
  reviewDeadline: string | null;
  evidence: {
    files?: string[];
    links?: string[];
    documents?: string[];
    comment?: string;
  } | null;
  isAutoReleased: boolean;
  collaborators: {
    userId: string;
    paymentReference: string | null;
    releasedAt: string | null;
  }[];
}

export interface EscrowAllocation {
  id: string;
  userId: string;
  totalAmount: number;
  releasedAmount: number;
  approvalStatus: "PENDING" | "APPROVED" | "CHANGES_REQUESTED" | "REJECTED";
}

export interface ConfigureEscrowPayload {
  totalAmount: number;
  agreementId: string;
  reviewPeriodDays?: number;
  milestones: {
    title: string;
    amount: number;
    collaboratorIds: string[];
  }[];
}

export interface SubmitMilestonePayload {
  evidence: {
    files?: string[];
    links?: string[];
    documents?: string[];
    comment?: string;
  };
}
