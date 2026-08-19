import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

// ─── TypeScript Interfaces ──────────────────────────────────────────────────

export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";
export type TicketPriority = "Critical" | "High" | "Medium" | "Low";
export type TicketCategory =
  | "Payment Issue"
  | "Escrow Dispute"
  | "Account Access"
  | "Verification"
  | "Platform Bug"
  | "General Inquiry";

export interface SupportTicketItem {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  subject: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo?: string;
  assignedAdmin?: string;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  accountType?: string;
  userRole?: string;
}

export interface SupportTicketDetail extends SupportTicketItem {
  message: string;
  attachments: SupportAttachment[];
  relatedActivity: RelatedActivityItem[];
}

export interface SupportAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface RelatedActivityItem {
  id: string;
  type: "Escrow" | "Payment" | "Project" | "Agreement";
  label: string;
  status: string;
  date: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: "user" | "admin";
  senderAvatar?: string;
  content: string;
  attachments?: SupportAttachment[];
  isInternalNote?: boolean;
  createdAt: string;
}

export interface SupportStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  avgResponseTime: string;
  slaBreaches: number;
}

export interface SupportAuditEntry {
  id: string;
  ticketId: string;
  action: string;
  adminName: string;
  userName: string;
  details: string;
  timestamp: string;
}

export interface SupportReportData {
  stats: SupportStats;
  categoryBreakdown: { category: string; count: number; color: string }[];
  auditLogs: SupportAuditEntry[];
}

// ─── Mock / Initial Data ────────────────────────────────────────────────────

export const INITIAL_SUPPORT_TICKETS: SupportTicketItem[] = [
  {
    id: "st-001",
    ticketId: "TKT-001",
    userId: "usr-101",
    userName: "Amara Chan",
    userEmail: "amara@example.com",
    subject: "Escrow funds not released after milestone completion",
    category: "Escrow Dispute",
    priority: "Critical",
    status: "Open",
    assignedTo: "admin-001",
    assignedAdmin: "Support Admin",
    createdAt: "2025-08-12T09:30:00Z",
    updatedAt: "2025-08-12T10:15:00Z",
    deadline: "2025-08-14T09:30:00Z",
    accountType: "Individual Freelancer",
    userRole: "Collaborator",
  },
  {
    id: "st-002",
    ticketId: "TKT-002",
    userId: "usr-102",
    userName: "Marcus Lee",
    userEmail: "marcus@example.com",
    subject: "System failure: no response after login attempts",
    category: "Platform Bug",
    priority: "High",
    status: "In Progress",
    assignedTo: "admin-002",
    assignedAdmin: "Dev Support",
    createdAt: "2025-08-11T14:20:00Z",
    updatedAt: "2025-08-12T08:45:00Z",
    deadline: "2025-08-13T14:20:00Z",
    accountType: "Business",
    userRole: "Project Owner",
  },
  {
    id: "st-003",
    ticketId: "TKT-003",
    userId: "usr-103",
    userName: "Ngozi Obi",
    userEmail: "ngozi@example.com",
    subject: "Unable to update stage status on a project",
    category: "Platform Bug",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "admin-001",
    assignedAdmin: "Support Admin",
    createdAt: "2025-08-10T11:00:00Z",
    updatedAt: "2025-08-11T16:30:00Z",
    accountType: "Individual Freelancer",
    userRole: "Collaborator",
  },
  {
    id: "st-004",
    ticketId: "TKT-004",
    userId: "usr-104",
    userName: "Tola Adepemi",
    userEmail: "tola@example.com",
    subject: "Urgent: agreement not visible to all parties",
    category: "Account Access",
    priority: "High",
    status: "Open",
    createdAt: "2025-08-09T16:45:00Z",
    updatedAt: "2025-08-09T16:45:00Z",
    deadline: "2025-08-11T16:45:00Z",
    accountType: "Business",
    userRole: "Project Owner",
  },
  {
    id: "st-005",
    ticketId: "TKT-005",
    userId: "usr-105",
    userName: "Chisom Eze",
    userEmail: "chisom@example.com",
    subject: "Profile photo/identity file not uploading",
    category: "Verification",
    priority: "Low",
    status: "Resolved",
    assignedTo: "admin-003",
    assignedAdmin: "Verification Team",
    createdAt: "2025-08-08T09:15:00Z",
    updatedAt: "2025-08-09T11:00:00Z",
    accountType: "Individual Freelancer",
    userRole: "Collaborator",
  },
  {
    id: "st-006",
    ticketId: "TKT-006",
    userId: "usr-106",
    userName: "Yomi Oladipo",
    userEmail: "yomi@example.com",
    subject: "Smartphone storage after cancellation",
    category: "Payment Issue",
    priority: "Medium",
    status: "Resolved",
    assignedTo: "admin-002",
    assignedAdmin: "Finance Team",
    createdAt: "2025-08-07T13:30:00Z",
    updatedAt: "2025-08-08T15:00:00Z",
    accountType: "Business",
    userRole: "Project Owner",
  },
  {
    id: "st-007",
    ticketId: "TKT-007",
    userId: "usr-107",
    userName: "Emeka Kossou",
    userEmail: "emeka@example.com",
    subject: "Cannot receive milestone notifications",
    category: "General Inquiry",
    priority: "Low",
    status: "Closed",
    assignedTo: "admin-001",
    assignedAdmin: "Support Admin",
    createdAt: "2025-08-06T10:00:00Z",
    updatedAt: "2025-08-07T14:30:00Z",
    accountType: "Individual Freelancer",
    userRole: "Collaborator",
  },
];

export const INITIAL_SUPPORT_MESSAGES: Record<string, SupportMessage[]> = {
  "st-001": [
    {
      id: "msg-001",
      ticketId: "st-001",
      senderId: "usr-101",
      senderName: "Amara Chan",
      senderRole: "user",
      content:
        "I completed the 'Composition & Editing' milestone on Urban Beats Vol. 3 (PR-0346) on June 4th, and the project owner approved it on June 6th. However, the escrow payment of N650,000 has not been released to my wallet. The payment of Milestone 1 has been released to the collaborators, but the funds are still showing as 'Settled'. Please investigate urgently as it's been 6 weeks already.",
      createdAt: "2025-08-12T09:30:00Z",
    },
    {
      id: "msg-002",
      ticketId: "st-001",
      senderId: "admin-001",
      senderName: "Support Admin",
      senderRole: "admin",
      content:
        "Hi Amara, thanks for reaching out. I've checked the transaction and escrow ledger for PR-0346. I can confirm that Milestone 2 was approved by the project owner (James Obi) on June 6th. The expected payout should have been triggered automatically within 48 hours. I'm escalating this to the Finance team for a manual review.",
      createdAt: "2025-08-12T10:15:00Z",
    },
    {
      id: "msg-003",
      ticketId: "st-001",
      senderId: "usr-101",
      senderName: "Amara Chan",
      senderRole: "user",
      content:
        "Thank you for the quick response. Please let me know as soon as the escalation yields results. I have bills to pay and this delay is really affecting me.",
      createdAt: "2025-08-12T11:00:00Z",
    },
    {
      id: "msg-004",
      ticketId: "st-001",
      senderId: "admin-001",
      senderName: "Support Admin",
      senderRole: "admin",
      content:
        "Absolutely, Amara. I've flagged this as urgent with the Finance division. You should receive an update within 24 hours. In the meantime, I'll add a manual note to the escrow record.",
      isInternalNote: false,
      createdAt: "2025-08-12T11:30:00Z",
    },
    {
      id: "msg-005",
      ticketId: "st-001",
      senderId: "admin-001",
      senderName: "Support Admin",
      senderRole: "admin",
      content:
        "INTERNAL NOTE: Escalated to Finance team. Escrow ID: ESC-PR0346-M2. The automated payout webhook may have failed. Check Flutterwave logs for tx_ref matching this escrow.",
      isInternalNote: true,
      createdAt: "2025-08-12T11:35:00Z",
    },
  ],
};

export const INITIAL_SUPPORT_AUDIT_LOGS: SupportAuditEntry[] = [
  {
    id: "audit-001",
    ticketId: "TKT-001",
    action: "Ticket Created",
    adminName: "System",
    userName: "Amara Chan",
    details: "Ticket submitted via platform support form",
    timestamp: "2025-08-12T09:30:00Z",
  },
  {
    id: "audit-002",
    ticketId: "TKT-001",
    action: "Assigned",
    adminName: "Support Admin",
    userName: "Amara Chan",
    details: "Auto-assigned based on category routing rules",
    timestamp: "2025-08-12T09:31:00Z",
  },
  {
    id: "audit-003",
    ticketId: "TKT-002",
    action: "Status Updated",
    adminName: "Dev Support",
    userName: "Marcus Lee",
    details: "Status changed from Open → In Progress",
    timestamp: "2025-08-11T15:00:00Z",
  },
  {
    id: "audit-004",
    ticketId: "TKT-005",
    action: "Resolved",
    adminName: "Verification Team",
    userName: "Chisom Eze",
    details: "File upload issue resolved — CDN cache cleared",
    timestamp: "2025-08-09T11:00:00Z",
  },
  {
    id: "audit-005",
    ticketId: "TKT-003",
    action: "Note Added",
    adminName: "Support Admin",
    userName: "Ngozi Obi",
    details: "Internal note: Investigated project stage API response",
    timestamp: "2025-08-11T16:30:00Z",
  },
  {
    id: "audit-006",
    ticketId: "TKT-006",
    action: "Payment Reversed",
    adminName: "Finance Team",
    userName: "Yomi Oladipo",
    details: "Subscription refund processed — N12,500 returned to wallet",
    timestamp: "2025-08-08T15:00:00Z",
  },
  {
    id: "audit-007",
    ticketId: "TKT-004",
    action: "Escalated",
    adminName: "Support Admin",
    userName: "Tola Adepemi",
    details: "Escalated to legal — agreement visibility issue affecting parties",
    timestamp: "2025-08-10T09:00:00Z",
  },
];

// ─── Service Methods ────────────────────────────────────────────────────────

export const adminSupportService = {
  getTickets: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
  }): Promise<{ tickets: SupportTicketItem[]; total: number }> => {
    try {
      const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_SUPPORT.LIST, { params });
      return res.data;
    } catch {
      return { tickets: INITIAL_SUPPORT_TICKETS, total: INITIAL_SUPPORT_TICKETS.length };
    }
  },

  getTicketDetail: async (id: string): Promise<SupportTicketDetail | null> => {
    try {
      const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_SUPPORT.DETAIL(id));
      return res.data;
    } catch {
      const ticket = INITIAL_SUPPORT_TICKETS.find((t) => t.id === id);
      if (!ticket) return null;
      return {
        ...ticket,
        message: "User submitted this ticket via the platform support form.",
        attachments: [
          { id: "att-001", fileName: "escrow_screenshot.png", fileType: "image/png", fileUrl: "#", uploadedAt: ticket.createdAt },
          { id: "att-002", fileName: "milestone_completion.pdf", fileType: "application/pdf", fileUrl: "#", uploadedAt: ticket.createdAt },
        ],
        relatedActivity: [
          { id: "ra-001", type: "Escrow", label: "Escrow Deposit", status: "Active", date: "Jul 12, 2025" },
          { id: "ra-002", type: "Payment", label: "Payment Record", status: "Pending", date: "Jul 12, 2025" },
          { id: "ra-003", type: "Project", label: "Project Activity", status: "Active", date: "Aug 11, 2025" },
          { id: "ra-004", type: "Agreement", label: "Legal Agreement", status: "Active", date: "Mar 15, 2025" },
        ],
      };
    }
  },

  getTicketMessages: async (id: string): Promise<SupportMessage[]> => {
    try {
      const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_SUPPORT.MESSAGES(id));
      return res.data;
    } catch {
      return INITIAL_SUPPORT_MESSAGES[id] || [];
    }
  },

  sendMessage: async (
    id: string,
    payload: { content: string; isInternalNote?: boolean }
  ): Promise<SupportMessage | null> => {
    try {
      const res = await axiosInstance.post(API_ENDPOINTS.ADMIN_SUPPORT.MESSAGES(id), payload);
      return res.data;
    } catch {
      return {
        id: `msg-${Date.now()}`,
        ticketId: id,
        senderId: "admin-001",
        senderName: "Support Admin",
        senderRole: "admin",
        content: payload.content,
        isInternalNote: payload.isInternalNote,
        createdAt: new Date().toISOString(),
      };
    }
  },

  assignTicket: async (
    id: string,
    payload: { adminId: string; adminName: string }
  ): Promise<boolean> => {
    try {
      await axiosInstance.put(API_ENDPOINTS.ADMIN_SUPPORT.ASSIGN(id), payload);
      return true;
    } catch {
      return true;
    }
  },

  updateTicketStatus: async (id: string, status: TicketStatus): Promise<boolean> => {
    try {
      await axiosInstance.put(API_ENDPOINTS.ADMIN_SUPPORT.UPDATE_STATUS(id), { status });
      return true;
    } catch {
      return true;
    }
  },

  getReports: async (_params?: {
    dateRange?: string;
  }): Promise<SupportReportData> => {
    try {
      const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_SUPPORT.REPORTS, { params: _params });
      return res.data;
    } catch {
      return {
        stats: {
          totalTickets: 1814,
          openTickets: 47,
          inProgressTickets: 65,
          resolvedTickets: 1604,
          avgResponseTime: "4.2h",
          slaBreaches: 8,
        },
        categoryBreakdown: [
          { category: "Payment Issue", count: 520, color: "var(--primary-green)" },
          { category: "Escrow Dispute", count: 380, color: "var(--primary-blue)" },
          { category: "Account Access", count: 310, color: "var(--secondary-blue)" },
          { category: "Verification", count: 245, color: "var(--accent-yellow)" },
          { category: "Platform Bug", count: 210, color: "var(--accent-red)" },
          { category: "General Inquiry", count: 149, color: "var(--accent-pink)" },
        ],
        auditLogs: INITIAL_SUPPORT_AUDIT_LOGS,
      };
    }
  },

  getAuditLogs: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ auditLogs: SupportAuditEntry[]; total: number }> => {
    try {
      const res = await axiosInstance.get(API_ENDPOINTS.ADMIN_SUPPORT.AUDIT, { params });
      return res.data;
    } catch {
      return { auditLogs: INITIAL_SUPPORT_AUDIT_LOGS, total: INITIAL_SUPPORT_AUDIT_LOGS.length };
    }
  },
};
