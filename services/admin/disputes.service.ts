import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DisputeType =
  | "PAYMENT"
  | "ESCROW_MILESTONE"
  | "AGREEMENT"
  | "PROJECT_COLLABORATION"
  | "USER_CONDUCT";

export type DisputeStatus =
  | "OPEN"
  | "UNDER_REVIEW"
  | "AWAITING_RESPONSE"
  | "RESOLVED"
  | "CLOSED";

export interface DisputeUser {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
}

export interface Dispute {
  id: string;
  disputeCode: string;
  type: DisputeType;
  status: DisputeStatus;
  complainant: DisputeUser;
  respondent: DisputeUser;
  project: string | null;
  reference: string;
  assignedAdmin: string | null;
  createdAt: string;
}

export interface DisputesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  assignedAdmin?: string;
}

export interface DisputesResponse {
  disputes: Dispute[];
  total: number;
  totalPages: number;
  stats: {
    total: number;
    open: number;
    underReview: number;
    awaitingResponse: number;
    resolved: number;
  };
}

// ─── Mock data (replace with real API call once backend endpoint is ready) ────

const AVATAR_COLORS = [
  "bg-green-600/40",
  "bg-blue-600/40",
  "bg-purple-600/40",
  "bg-yellow-600/40",
  "bg-red-600/40",
  "bg-teal-600/40",
  "bg-pink-600/40",
  "bg-orange-600/40",
];

const makeUser = (name: string, idx: number): DisputeUser => ({
  id: `user-${idx}`,
  name,
  initials: name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2),
  avatarColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
});

const MOCK_DISPUTES: Dispute[] = [
  {
    id: "1",
    disputeCode: "DSP-0041",
    type: "PAYMENT",
    status: "UNDER_REVIEW",
    complainant: makeUser("Marcus Lee", 0),
    respondent: makeUser("Tolu Adeyemi", 1),
    project: "Jazz Fusion Album",
    reference: "TXN-18901",
    assignedAdmin: "Super Admin",
    createdAt: "2026-07-15T10:23:00Z",
  },
  {
    id: "2",
    disputeCode: "DSP-0038",
    type: "ESCROW_MILESTONE",
    status: "OPEN",
    complainant: makeUser("Emeka Nwosu", 2),
    respondent: makeUser("Ngozi Obi", 3),
    project: "Gospel Praise Compilation",
    reference: "ESC-0041",
    assignedAdmin: null,
    createdAt: "2026-07-18T08:15:00Z",
  },
  {
    id: "3",
    disputeCode: "DSP-0031",
    type: "AGREEMENT",
    status: "AWAITING_RESPONSE",
    complainant: makeUser("Marcus Lee", 0),
    respondent: makeUser("Chisom Eze", 4),
    project: "Jazz Fusion Album",
    reference: "AGR-0215",
    assignedAdmin: "Super Admin",
    createdAt: "2026-07-20T14:45:00Z",
  },
  {
    id: "4",
    disputeCode: "DSP-0027",
    type: "PROJECT_COLLABORATION",
    status: "RESOLVED",
    complainant: makeUser("Tolu Adeyemi", 1),
    respondent: makeUser("Amara Osei", 5),
    project: "Urban Beats Vol. 2",
    reference: "PRJ-0041",
    assignedAdmin: "Super Admin",
    createdAt: "2026-07-22T09:30:00Z",
  },
  {
    id: "5",
    disputeCode: "DSP-0020",
    type: "USER_CONDUCT",
    status: "OPEN",
    complainant: makeUser("Ngozi Obi", 3),
    respondent: makeUser("Marcus Lee", 0),
    project: null,
    reference: "USR-0318",
    assignedAdmin: null,
    createdAt: "2026-07-25T11:00:00Z",
  },
  {
    id: "6",
    disputeCode: "DSP-0015",
    type: "PAYMENT",
    status: "CLOSED",
    complainant: makeUser("Amara Osei", 5),
    respondent: makeUser("Platform", 6),
    project: "Urban Beats Vol. 2",
    reference: "TXN-17412",
    assignedAdmin: "Super Admin",
    createdAt: "2026-07-28T16:20:00Z",
  },
  {
    id: "7",
    disputeCode: "DSP-0012",
    type: "ESCROW_MILESTONE",
    status: "UNDER_REVIEW",
    complainant: makeUser("Chisom Eze", 4),
    respondent: makeUser("Emeka Nwosu", 2),
    project: "Afrobeat Sessions",
    reference: "ESC-0039",
    assignedAdmin: "Super Admin",
    createdAt: "2026-07-30T13:10:00Z",
  },
  {
    id: "8",
    disputeCode: "DSP-0009",
    type: "AGREEMENT",
    status: "RESOLVED",
    complainant: makeUser("Tolu Adeyemi", 1),
    respondent: makeUser("Ngozi Obi", 3),
    project: "Gospel Praise Compilation",
    reference: "AGR-0198",
    assignedAdmin: "Super Admin",
    createdAt: "2026-08-01T10:45:00Z",
  },
];

// ─── Service ──────────────────────────────────────────────────────────────────

export const getDisputes = async (params: DisputesParams): Promise<DisputesResponse> => {
  // TODO: Replace with real API call when backend endpoint is ready:
  // const response = await axiosInstance.get("/api/v1/admin/disputes", { params });
  // return response.data;

  await new Promise((resolve) => setTimeout(resolve, 600));

  let disputes = [...MOCK_DISPUTES];

  if (params.search) {
    const q = params.search.toLowerCase();
    disputes = disputes.filter(
      (d) =>
        d.disputeCode.toLowerCase().includes(q) ||
        d.complainant.name.toLowerCase().includes(q) ||
        d.respondent.name.toLowerCase().includes(q) ||
        (d.project && d.project.toLowerCase().includes(q)) ||
        d.reference.toLowerCase().includes(q)
    );
  }

  if (params.status && params.status !== "ALL") {
    disputes = disputes.filter((d) => d.status === params.status);
  }

  if (params.type && params.type !== "ALL") {
    disputes = disputes.filter((d) => d.type === params.type);
  }

  if (params.assignedAdmin && params.assignedAdmin !== "ALL") {
    if (params.assignedAdmin === "UNASSIGNED") {
      disputes = disputes.filter((d) => !d.assignedAdmin);
    } else {
      disputes = disputes.filter((d) => d.assignedAdmin === params.assignedAdmin);
    }
  }

  const total = disputes.length;
  const page = params.page || 1;
  const limit = params.limit || 10;
  const start = (page - 1) * limit;
  const paginated = disputes.slice(start, start + limit);

  return {
    disputes: paginated,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    stats: {
      total: MOCK_DISPUTES.length,
      open: MOCK_DISPUTES.filter((d) => d.status === "OPEN").length,
      underReview: MOCK_DISPUTES.filter((d) => d.status === "UNDER_REVIEW").length,
      awaitingResponse: MOCK_DISPUTES.filter((d) => d.status === "AWAITING_RESPONSE").length,
      resolved: MOCK_DISPUTES.filter(
        (d) => d.status === "RESOLVED" || d.status === "CLOSED"
      ).length,
    },
  };
};

// ─── Detail Types ─────────────────────────────────────────────────────────────

export interface RelatedRecord {
  label: string;
  reference: string;
  color: string;
}

export interface Evidence {
  id: string;
  filename: string;
  type: string;
  submittedBy: string;
}

export interface InvestigationNote {
  id: string;
  adminName: string;
  adminRole: string;
  content: string;
  createdAt: string;
}

export interface DisputeAuditRecord {
  id: string;
  action: string;
  actionType: string[];
  description: string;
  adminName: string;
  adminRole: string;
  createdAt: string;
}

export interface DisputeDetail extends Dispute {
  amount: string | null;
  reason: string;
  evidence: Evidence[];
  notes: InvestigationNote[];
  relatedRecords: RelatedRecord[];
  auditHistory: DisputeAuditRecord[];
}

// ─── Detail Mock ──────────────────────────────────────────────────────────────

const MOCK_AUDIT: DisputeAuditRecord[] = [
  {
    id: "a1",
    action: "Dispute Record Accessed",
    actionType: ["View"],
    description: "Dispute DSP-0041 opened by Super Admin.",
    adminName: "Super Admin",
    adminRole: "Super Admin",
    createdAt: "2025-07-08T15:04:00Z",
  },
  {
    id: "a2",
    action: "Dispute Assigned",
    actionType: ["Assign"],
    description: "Dispute assigned to Super Admin for review.",
    adminName: "Super Admin",
    adminRole: "Super Admin",
    createdAt: "2025-07-08T15:05:00Z",
  },
  {
    id: "a3",
    action: "Status Changed → Under Review",
    actionType: ["Status"],
    description: "Status updated from Open to Under Review. Reason: Initial review commenced.",
    adminName: "Super Admin",
    adminRole: "Super Admin",
    createdAt: "2025-07-08T15:06:00Z",
  },
  {
    id: "a4",
    action: "Investigation Note Added",
    actionType: ["Note"],
    description: "Transaction TXN-18901 and escrow details reviewed.",
    adminName: "Super Admin",
    adminRole: "Super Admin",
    createdAt: "2025-07-09T09:42:00Z",
  },
  {
    id: "a5",
    action: "Message Sent to Parties",
    actionType: ["Message"],
    description: "Message sent to both Marcus Lee and Tolu Adeyemi requesting clarification.",
    adminName: "Support Admin",
    adminRole: "Support Admin",
    createdAt: "2025-07-09T14:15:00Z",
  },
  {
    id: "a6",
    action: "Evidence Request Sent",
    actionType: ["Evidence"],
    description: "Additional evidence requested from Marcus Lee and Tolu Adeyemi.",
    adminName: "Super Admin",
    adminRole: "Super Admin",
    createdAt: "2025-07-10T10:04:00Z",
  },
  {
    id: "a7",
    action: "Status Changed → Awaiting Response",
    actionType: ["Status"],
    description: "Status updated to Awaiting Response. Evidence request sent to both parties.",
    adminName: "Super Admin",
    adminRole: "Super Admin",
    createdAt: "2025-07-10T10:05:00Z",
  },
  {
    id: "a8",
    action: "Investigation Note Added",
    actionType: ["Note"],
    description: "Chat screenshot confirmed agreed fee of ₦45,000. Outstanding balance: ₦15,000.",
    adminName: "Super Admin",
    adminRole: "Super Admin",
    createdAt: "2025-07-12T09:30:00Z",
  },
  {
    id: "a9",
    action: "Dispute Decision Recorded",
    actionType: ["Decision"],
    description: "Ruled in favour of complainant Marcus Lee. ₦15,000 to be remitted by Tolu Adeyemi.",
    adminName: "Super Admin",
    adminRole: "Super Admin",
    createdAt: "2025-07-14T14:00:00Z",
  },
  {
    id: "a10",
    action: "Status Changed → Resolved",
    actionType: ["Status", "Final Action"],
    description: "Dispute marked as Resolved following final decision.",
    adminName: "Super Admin",
    adminRole: "Super Admin",
    createdAt: "2025-07-14T14:01:00Z",
  },
];

const MOCK_NOTES: InvestigationNote[] = [
  {
    id: "n1",
    adminName: "Super Admin",
    adminRole: "Super Admin",
    content:
      "Transaction TXN-18901 reviewed. Amount of ₦30,000 transferred to Tolu Adeyemi confirmed. Awaiting escrow milestone confirmation from project record.",
    createdAt: "2026-07-08T09:42:00Z",
  },
  {
    id: "n2",
    adminName: "Support Admin",
    adminRole: "Support Admin",
    content:
      "Contacted both parties. Marcus Lee claims the agreed fee was ₦45,000, not ₦30,000. Requesting supporting communication as evidence.",
    createdAt: "2026-07-09T14:15:00Z",
  },
  {
    id: "n3",
    adminName: "Super Admin",
    adminRole: "Super Admin",
    content:
      "Evidence request sent to both users. Awaiting response. Status updated to Awaiting Response.",
    createdAt: "2026-07-10T10:04:00Z",
  },
];

const buildDetail = (dispute: Dispute): DisputeDetail => {
  const relatedRecords: RelatedRecord[] = [];

  if (dispute.reference.startsWith("TXN")) {
    relatedRecords.push({ label: "Payment Record", reference: dispute.reference, color: "bg-blue-500" });
    relatedRecords.push({ label: "Escrow Details", reference: "ESC-0041", color: "bg-purple-500" });
  } else if (dispute.reference.startsWith("ESC")) {
    relatedRecords.push({ label: "Escrow Details", reference: dispute.reference, color: "bg-purple-500" });
  } else if (dispute.reference.startsWith("AGR")) {
    relatedRecords.push({ label: "Legal Agreement", reference: dispute.reference, color: "bg-teal-500" });
  } else if (dispute.reference.startsWith("PRJ")) {
    relatedRecords.push({ label: "Project Activity", reference: dispute.reference, color: "bg-indigo-500" });
  } else if (dispute.reference.startsWith("USR")) {
    relatedRecords.push({ label: "User Communication", reference: dispute.reference, color: "bg-orange-500" });
  }

  if (dispute.project) {
    relatedRecords.push({ label: "Project Activity", reference: "PRJ-0027", color: "bg-indigo-500" });
  }

  relatedRecords.push({ label: "User Communication", reference: "MSG thread", color: "bg-orange-500" });

  return {
    ...dispute,
    amount: dispute.type === "PAYMENT" || dispute.type === "ESCROW_MILESTONE" ? "₦30,000" : null,
    reason:
      dispute.type === "PAYMENT"
        ? `Payment received does not match the agreed collaboration fee. ${dispute.complainant.name} claims the agreed amount was ₦45,000 but only ₦30,000 was transferred via ${dispute.reference}.`
        : dispute.type === "ESCROW_MILESTONE"
        ? `Escrow milestone deliverable was submitted but the quality did not meet the agreed specification. ${dispute.complainant.name} is requesting a revision or partial refund.`
        : dispute.type === "AGREEMENT"
        ? `Terms of the agreement were not followed. ${dispute.complainant.name} claims the respondent did not deliver the agreed scope of work within the timeline specified.`
        : dispute.type === "PROJECT_COLLABORATION"
        ? `Collaboration expectations were not met. ${dispute.complainant.name} reports the respondent was unresponsive and missed multiple project deadlines.`
        : `${dispute.complainant.name} reports inappropriate behavior from the respondent including unprofessional communication and failure to maintain community standards.`,
    evidence: [
      { id: "e1", filename: "chat_screenshot_jul7.png", type: "Screenshot", submittedBy: dispute.complainant.name },
      { id: "e2", filename: "payment_summary.pdf", type: "Document", submittedBy: dispute.respondent.name },
    ],
    notes: MOCK_NOTES,
    relatedRecords,
    auditHistory: MOCK_AUDIT,
  };
};

export const getDisputeById = async (id: string): Promise<DisputeDetail | null> => {
  // TODO: Replace with real API call:
  // const response = await axiosInstance.get(`/api/v1/admin/disputes/${id}`);
  // return response.data;

  await new Promise((resolve) => setTimeout(resolve, 400));
  const found = MOCK_DISPUTES.find((d) => d.id === id);
  if (!found) return null;
  return buildDetail(found);
};

export const addDisputeNote = async (
  disputeId: string,
  content: string
): Promise<InvestigationNote> => {
  // TODO: Replace with real API call
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    id: `n-${Date.now()}`,
    adminName: "Super Admin",
    adminRole: "Super Admin",
    content,
    createdAt: new Date().toISOString(),
  };
};

export const disputesService = { getDisputes, getDisputeById, addDisputeNote };
export default disputesService;

